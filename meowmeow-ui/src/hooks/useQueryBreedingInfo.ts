import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

export function useQueryBreedingInfo(petId: string | null) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["breeding-info", petId],
    queryFn: async () => {
      if (!petId) throw new Error("Pet ID is required");

      // Get breeding capability
      const canBreedTx = new Transaction();
      canBreedTx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::can_breed`,
        arguments: [canBreedTx.object(petId), canBreedTx.object("0x6")],
      });
      
      const canBreedResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: canBreedTx,
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000", // Dummy sender for dev inspect
      });

      // Get breeding cooldown remaining
      const cooldownTx = new Transaction();
      cooldownTx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::get_breeding_cooldown_remaining`,
        arguments: [cooldownTx.object(petId), cooldownTx.object("0x6")],
      });
      
      const cooldownResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: cooldownTx,
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000", // Dummy sender for dev inspect
      });

      const canBreedReturnValue = canBreedResult.results?.[0]?.returnValues?.[0]?.[0];
      const canBreed = Array.isArray(canBreedReturnValue) ? canBreedReturnValue[0] === 1 : canBreedReturnValue === 1;
      const cooldownReturnValue = cooldownResult.results?.[0]?.returnValues?.[0];
      const cooldownMs = cooldownReturnValue
        ? (Array.isArray(cooldownReturnValue[0]) ? parseInt(cooldownReturnValue[0].join('')) : parseInt(String(cooldownReturnValue[0])))
        : 0;

      return {
        canBreed,
        cooldownRemainingMs: cooldownMs,
        cooldownRemainingHours: cooldownMs > 0 ? Math.ceil(cooldownMs / (1000 * 60 * 60)) : 0,
      };
    },
    enabled: !!petId,
  });
}