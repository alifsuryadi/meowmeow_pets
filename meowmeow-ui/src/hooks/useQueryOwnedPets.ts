import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";
import { normalizeSuiPetObject } from "@/lib/utils";
import type { PetStruct } from "@/types/Pet";

export const queryKeyOwnedPets = (address?: string) => {
  if (address) return ["owned-pets", address];
  return ["owned-pets"];
};

export function useQueryOwnedPets() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: queryKeyOwnedPets(currentAccount?.address),
    queryFn: async (): Promise<PetStruct[]> => {
      if (!currentAccount) throw new Error("No connected account");

      // Get all pet objects owned by the user
      const petResponse = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::Pet` },
        options: { showContent: true },
      });

      if (petResponse.data.length === 0) return [];

      const petsWithSleepStatus = await Promise.all(
        petResponse.data.map(async (petObject) => {
          const normalizedPet = normalizeSuiPetObject(petObject);
          if (!normalizedPet) return null;

          // Check if pet is sleeping
          const dynamicFields = await suiClient.getDynamicFields({
            parentId: normalizedPet.id,
          });

          const isSleeping = dynamicFields.data.some(
            (field) =>
              field.name.type === "0x1::string::String" &&
              field.name.value === "sleep_started_at"
          );

          return { ...normalizedPet, isSleeping } as PetStruct;
        })
      );

      return petsWithSleepStatus.filter((pet): pet is PetStruct => pet !== null);
    },
    enabled: !!currentAccount,
  });
}