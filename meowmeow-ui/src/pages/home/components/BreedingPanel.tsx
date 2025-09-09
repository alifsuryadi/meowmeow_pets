import { useState } from "react";
import {
  HeartIcon,
  Loader2Icon,
  PlusIcon,
  ClockIcon,
  CoinsIcon,
  StarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useMutateBreedPets } from "@/hooks/useMutateBreedPets";
import { useQueryBreedingInfo } from "@/hooks/useQueryBreedingInfo";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";
import { AdoptAnotherPetButton } from "./AdoptAnotherPetButton";

import type { PetStruct } from "@/types/Pet";

type BreedingPanelProps = {
  userPets: PetStruct[];
  isAnyActionPending?: boolean;
};

export function BreedingPanel({ userPets, isAnyActionPending }: BreedingPanelProps) {
  const [selectedParent1, setSelectedParent1] = useState<PetStruct | null>(null);
  const [selectedParent2, setSelectedParent2] = useState<PetStruct | null>(null);
  const [offspringName, setOffspringName] = useState("");

  const { mutate: mutateBreedPets, isPending: isBreeding } = useMutateBreedPets();
  const { data: gameBalance } = useQueryGameBalance();
  const { data: parent1BreedingInfo } = useQueryBreedingInfo(selectedParent1?.id || null);
  const { data: parent2BreedingInfo } = useQueryBreedingInfo(selectedParent2?.id || null);

  if (!gameBalance) return null;

  // Add safety checks for gameBalance values
  const breedMinLevel = Number(gameBalance.breed_min_level) || 2;
  const breedMinHappiness = Number(gameBalance.breed_min_happiness) || 70;
  const breedCoinsCost = Number(gameBalance.breed_coins_cost) || 50;

  // Filter pets that can potentially breed (level 2+)
  const breedablePets = userPets.filter(pet => 
    pet.game_data.level >= breedMinLevel && 
    !pet.isSleeping
  );

  const canBreed = 
    selectedParent1 &&
    selectedParent2 &&
    selectedParent1.id !== selectedParent2.id &&
    parent1BreedingInfo?.canBreed &&
    parent2BreedingInfo?.canBreed &&
    offspringName.trim().length > 0 &&
    !isAnyActionPending;

  const handleBreed = () => {
    if (!canBreed || !selectedParent1 || !selectedParent2) return;
    
    mutateBreedPets({
      parent1Id: selectedParent1.id,
      parent2Id: selectedParent2.id,
      offspringName: offspringName.trim(),
    });

    // Reset form after breeding
    setSelectedParent1(null);
    setSelectedParent2(null);
    setOffspringName("");
  };

  const getBreedingStatusText = (pet: PetStruct, breedingInfo: any) => {
    if (!breedingInfo) return "Loading...";
    if (breedingInfo.canBreed) return "Ready to breed";
    if (breedingInfo.cooldownRemainingMs > 0) {
      return `Cooldown: ${breedingInfo.cooldownRemainingHours}h`;
    }
    if (pet.stats.happiness < breedMinHappiness) {
      return `Need ${breedMinHappiness}+ happiness`;
    }
    if (pet.game_data.coins < breedCoinsCost) {
      return `Need ${breedCoinsCost}+ coins`;
    }
    return "Not ready";
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl shadow-hard border-2 border-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <HeartIcon className="w-6 h-6 text-pink-500" />
            Pet Breeding System
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enhanced Breeding Requirements Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <StarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-lg">Breeding Requirements</h3>
                <p className="text-sm text-blue-600">Ensure both pets meet these conditions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <StarIcon className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Minimum Level</p>
                    <p className="text-sm text-gray-600">Level {breedMinLevel} or higher</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">High Happiness</p>
                    <p className="text-sm text-gray-600">{breedMinHappiness}+ happiness required</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CoinsIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Breeding Cost</p>
                    <p className="text-sm text-gray-600">{breedCoinsCost} coins per pet</p>
                    <p className="text-xs text-gray-500">Total: {breedCoinsCost * 2} coins</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Cooldown Period</p>
                    <p className="text-sm text-gray-600">24 hours between breedings</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">💡 Pro Tip:</p>
              <p className="text-sm text-blue-700 mt-1">
                Play with your pets to increase happiness, and work to earn coins before breeding!
              </p>
            </div>
          </div>

          {breedablePets.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <div className="text-gray-500">
                <p>You need at least one level {breedMinLevel}+ pet to start breeding.</p>
              </div>
              <div>
                <AdoptAnotherPetButton className="bg-blue-600 hover:bg-blue-700" />
              </div>
            </div>
          )}

          {breedablePets.length === 1 && (
            <div className="text-center py-8 space-y-4">
              <div className="text-gray-500">
                <p>You need at least two level {breedMinLevel}+ pets to breed.</p>
                <p className="text-sm mt-2">Adopt another pet to unlock breeding!</p>
              </div>
              <div>
                <AdoptAnotherPetButton className="bg-green-600 hover:bg-green-700" />
              </div>
            </div>
          )}

          {breedablePets.length >= 2 && (
            <>
              {/* Requirements Legend */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Status Indicators:</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Requirement met</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-gray-600">Needs improvement</span>
                  </div>
                  <div className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                    Ready
                  </div>
                  <span className="text-gray-600">= All requirements met</span>
                </div>
              </div>

              {/* Parent Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Parent 1 */}
                <div>
                  <h3 className="font-semibold mb-3">Select First Parent</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {breedablePets.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => setSelectedParent1(pet)}
                        disabled={pet.id === selectedParent2?.id}
                        className={`w-full p-3 border rounded-lg text-left transition-colors ${
                          selectedParent1?.id === pet.id
                            ? "border-primary bg-primary/10"
                            : pet.id === selectedParent2?.id
                            ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                            : "border-gray-300 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{pet.name}</p>
                              {pet.game_data.level >= breedMinLevel &&
                               pet.stats.happiness >= breedMinHappiness &&
                               pet.game_data.coins >= breedCoinsCost && (
                                <div className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                                  Ready
                                </div>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              Level {pet.game_data.level} • {pet.stats.happiness} happiness • {pet.game_data.coins} coins
                            </div>
                            
                            {/* Requirements checklist */}
                            <div className="flex gap-2">
                              <div className={`w-2 h-2 rounded-full ${pet.game_data.level >= breedMinLevel ? 'bg-green-500' : 'bg-red-400'}`} title={`Level ${breedMinLevel}+`}></div>
                              <div className={`w-2 h-2 rounded-full ${pet.stats.happiness >= breedMinHappiness ? 'bg-green-500' : 'bg-red-400'}`} title={`${breedMinHappiness}+ happiness`}></div>
                              <div className={`w-2 h-2 rounded-full ${pet.game_data.coins >= breedCoinsCost ? 'bg-green-500' : 'bg-red-400'}`} title={`${breedCoinsCost}+ coins`}></div>
                            </div>
                            
                            {selectedParent1?.id === pet.id && (
                              <p className="text-xs text-blue-600 mt-1">
                                {getBreedingStatusText(pet, parent1BreedingInfo)}
                              </p>
                            )}
                          </div>
                          <img src={pet.image_url} alt={pet.name} className="w-12 h-12 rounded-full" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parent 2 */}
                <div>
                  <h3 className="font-semibold mb-3">Select Second Parent</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {breedablePets.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => setSelectedParent2(pet)}
                        disabled={pet.id === selectedParent1?.id}
                        className={`w-full p-3 border rounded-lg text-left transition-colors ${
                          selectedParent2?.id === pet.id
                            ? "border-primary bg-primary/10"
                            : pet.id === selectedParent1?.id
                            ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                            : "border-gray-300 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{pet.name}</p>
                              {pet.game_data.level >= breedMinLevel &&
                               pet.stats.happiness >= breedMinHappiness &&
                               pet.game_data.coins >= breedCoinsCost && (
                                <div className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                                  Ready
                                </div>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              Level {pet.game_data.level} • {pet.stats.happiness} happiness • {pet.game_data.coins} coins
                            </div>
                            
                            {/* Requirements checklist */}
                            <div className="flex gap-2">
                              <div className={`w-2 h-2 rounded-full ${pet.game_data.level >= breedMinLevel ? 'bg-green-500' : 'bg-red-400'}`} title={`Level ${breedMinLevel}+`}></div>
                              <div className={`w-2 h-2 rounded-full ${pet.stats.happiness >= breedMinHappiness ? 'bg-green-500' : 'bg-red-400'}`} title={`${breedMinHappiness}+ happiness`}></div>
                              <div className={`w-2 h-2 rounded-full ${pet.game_data.coins >= breedCoinsCost ? 'bg-green-500' : 'bg-red-400'}`} title={`${breedCoinsCost}+ coins`}></div>
                            </div>
                            
                            {selectedParent2?.id === pet.id && (
                              <p className="text-xs text-blue-600 mt-1">
                                {getBreedingStatusText(pet, parent2BreedingInfo)}
                              </p>
                            )}
                          </div>
                          <img src={pet.image_url} alt={pet.name} className="w-12 h-12 rounded-full" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Offspring Name Input */}
              {selectedParent1 && selectedParent2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="offspring-name" className="block font-semibold mb-2">
                      Name your new pet:
                    </label>
                    <Input
                      id="offspring-name"
                      placeholder="Enter offspring name"
                      value={offspringName}
                      onChange={(e) => setOffspringName(e.target.value)}
                      maxLength={20}
                      disabled={isBreeding}
                    />
                  </div>

                  {/* Breeding Preview */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Breeding Preview:</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>Parents: {selectedParent1.name} + {selectedParent2.name}</p>
                      <p>Offspring will inherit mixed traits from both parents</p>
                      <p>Total cost: {breedCoinsCost * 2} coins</p>
                    </div>
                  </div>

                  {/* Breed Button */}
                  <Button
                    onClick={handleBreed}
                    disabled={!canBreed || isBreeding}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3"
                  >
                    {isBreeding ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Breeding Pets...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Breed Pets
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}