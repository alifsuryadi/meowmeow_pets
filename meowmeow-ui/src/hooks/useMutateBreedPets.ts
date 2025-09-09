import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeyOwnedPet } from "./useQueryOwnedPet";
import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

const mutateKeyBreedPets = ["mutate", "breed-pets"];

type UseMutateBreedPetsParams = {
  parent1Id: string;
  parent2Id: string;
  offspringName: string;
};

export function useMutateBreedPets() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyBreedPets,
    mutationFn: async ({ parent1Id, parent2Id, offspringName }: UseMutateBreedPetsParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      
      // Add the random object for randomness
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::breed_pets`,
        arguments: [
          tx.object(parent1Id),
          tx.object(parent2Id),
          tx.pure.string(offspringName),
          tx.object("0x6"), // Clock object
          tx.object("0x8"), // Random object
        ],
      });

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true, showEvents: true },
      });
      if (response?.effects?.status.status === "failure")
        throw new Error(response.effects.status.error);

      return response;
    },
    onSuccess: (response) => {
      toast.success(`Pets bred successfully! New offspring created. Tx: ${response.digest}`);
      queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
    },
    onError: (error) => {
      console.error("Error breeding pets:", error);
      toast.error(`Error breeding pets: ${error.message}`);
    },
  });
}