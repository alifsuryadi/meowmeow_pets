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

const mutateKeyWakeEatWorkCombo = ["mutate", "wake-eat-work-combo"];

type UseMutateWakeEatWorkComboParams = {
  petId: string;
};

export function useMutateWakeEatWorkCombo() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyWakeEatWorkCombo,
    mutationFn: async ({ petId }: UseMutateWakeEatWorkComboParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::wake_eat_work_combo`,
        arguments: [tx.object(petId), tx.object("0x6")],
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
      // Check if it was a partial success (wake_eat_partial) or full success
      const events = response.events || [];
      const isPartialSuccess = events.some(event => 
        event.parsedJson && 
        typeof event.parsedJson === 'object' && 
        'action' in event.parsedJson && 
        event.parsedJson.action === 'wake_eat_partial'
      );
      
      if (isPartialSuccess) {
        toast.success(`Pet woke up and ate, but couldn't work (low stats). Tx: ${response.digest}`);
      } else {
        toast.success(`Pet woke up, ate, and worked! Tx: ${response.digest}`);
      }
      
      queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
    },
    onError: (error) => {
      console.error("Error with wake-eat-work combo:", error);
      toast.error(`Error with combo action: ${error.message}`);
    },
  });
}