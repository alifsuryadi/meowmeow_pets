import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

export function useQueryBreedingInfo(petId: string | null) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["breeding-info", petId],
    queryFn: async () => {
      if (!petId) throw new Error("Pet ID is required");

      // Get breeding capability
      const canBreedResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: {
          kind: "programmable",
          inputs: [
            { type: "object", objectId: petId },
            { type: "object", objectId: "0x6" }, // Clock object
          ],
          transactions: [
            {
              kind: "moveCall",
              target: `${PACKAGE_ID}::${MODULE_NAME}::can_breed`,
              arguments: [{ kind: "input", index: 0 }, { kind: "input", index: 1 }],
            },
          ],
        },
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000", // Dummy sender for dev inspect
      });

      // Get breeding cooldown remaining
      const cooldownResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: {
          kind: "programmable",
          inputs: [
            { type: "object", objectId: petId },
            { type: "object", objectId: "0x6" }, // Clock object
          ],
          transactions: [
            {
              kind: "moveCall",
              target: `${PACKAGE_ID}::${MODULE_NAME}::get_breeding_cooldown_remaining`,
              arguments: [{ kind: "input", index: 0 }, { kind: "input", index: 1 }],
            },
          ],
        },
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000", // Dummy sender for dev inspect
      });

      const canBreed = canBreedResult.results?.[0]?.returnValues?.[0]?.[0] === 1;
      const cooldownMs = cooldownResult.results?.[0]?.returnValues?.[0] 
        ? parseInt(cooldownResult.results[0].returnValues[0][0]) 
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