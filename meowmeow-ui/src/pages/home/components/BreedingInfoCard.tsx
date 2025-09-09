import React from "react";
import { HeartIcon, InfoIcon, CheckCircleIcon, XCircleIcon, PlayIcon, BriefcaseIcon, StarIcon, CoinsIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PetStruct } from "@/types/Pet";
import type { GameBalanceStruct } from "@/types/GameBalance";

type BreedingInfoCardProps = {
  pet: PetStruct;
  gameBalance: GameBalanceStruct;
  onSwitchToBreeding?: () => void;
};

export function BreedingInfoCard({ pet, gameBalance, onSwitchToBreeding }: BreedingInfoCardProps) {
  // Add safety checks for gameBalance values
  const breedMinLevel = Number(gameBalance.breed_min_level) || 2;
  const breedMinHappiness = Number(gameBalance.breed_min_happiness) || 70;
  const breedCoinsCost = Number(gameBalance.breed_coins_cost) || 50;
  
  const isBreedingReady = 
    pet.game_data.level >= breedMinLevel &&
    pet.stats.happiness >= breedMinHappiness &&
    pet.game_data.coins >= breedCoinsCost;

  const getRequirementStatus = (condition: boolean, currentValue: number, requiredValue: number, unit = "") => {
    const safeCurrentValue = Number(currentValue) || 0;
    const safeRequiredValue = Number(requiredValue) || 1; // Prevent division by zero
    
    return {
      met: condition,
      current: safeCurrentValue,
      required: safeRequiredValue,
      unit,
      progress: Math.min(100, Math.max(0, (safeCurrentValue / safeRequiredValue) * 100))
    };
  };

  const requirements = [
    getRequirementStatus(
      pet.game_data.level >= breedMinLevel,
      pet.game_data.level,
      breedMinLevel,
      ""
    ),
    getRequirementStatus(
      pet.stats.happiness >= breedMinHappiness,
      pet.stats.happiness,
      breedMinHappiness,
      ""
    ),
    getRequirementStatus(
      pet.game_data.coins >= breedCoinsCost,
      pet.game_data.coins,
      breedCoinsCost,
      " coins"
    )
  ];

  const requirementLabels = ["Level", "Happiness", "Coins"];
  const requirementIcons = [<StarIcon className="w-4 h-4" />, <HeartIcon className="w-4 h-4" />, <CoinsIcon className="w-4 h-4" />];
  
  const completedRequirements = requirements.filter(req => req.met).length;
  const overallProgress = (completedRequirements / requirements.length) * 100;

  if (isBreedingReady) {
    return (
      <Card className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border-pink-300 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-pink-800">
            <div className="p-2 bg-pink-100 rounded-full">
              <SparklesIcon className="w-5 h-5 text-pink-600" />
            </div>
            Breeding Ready!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-xl border border-pink-200">
            <div className="flex items-center gap-3 mb-3">
              <img src={pet.image_url} alt={pet.name} className="w-12 h-12 rounded-full border-2 border-pink-300" />
              <div>
                <p className="font-bold text-pink-900">{pet.name}</p>
                <p className="text-sm text-pink-700">Level {pet.game_data.level} • Ready to mate!</p>
              </div>
              <div className="ml-auto">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              {requirements.map((req, index) => (
                <div key={index} className="text-center p-2 bg-white rounded-lg border border-pink-100">
                  <div className="flex justify-center mb-1">
                    {React.cloneElement(requirementIcons[index], { 
                      className: "w-4 h-4 text-green-600" 
                    })}
                  </div>
                  <p className="text-xs font-medium text-gray-700">{requirementLabels[index]}</p>
                  <p className="text-xs text-green-600 font-bold">{req.current}{req.unit}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                onClick={onSwitchToBreeding}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full"
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                Switch to Breeding Mode
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <InfoIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-800">Breeding Benefits</span>
            </div>
            <div className="text-xs text-gray-600 space-y-2">
              <p>✨ Create unique offspring with mixed traits from both parents</p>
              <p>🧬 Genetic inheritance system ensures variety in each generation</p>
              <p>📈 Breeding increases both parents' experience and happiness</p>
              <p>⏰ 24-hour cooldown between breeding sessions per pet</p>
              <p>💰 Total cost: {breedCoinsCost * 2} coins for both parents</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-300 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
          <div className="p-2 bg-blue-100 rounded-full">
            <TrendingUpIcon className="w-5 h-5 text-blue-600" />
          </div>
          Breeding Progress
        </CardTitle>
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-700">Overall Progress:</span>
            <span className="text-sm font-bold text-blue-900">{completedRequirements}/3 Complete</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <img src={pet.image_url} alt={pet.name} className="w-12 h-12 rounded-full border-2 border-blue-300" />
            <div>
              <p className="font-bold text-blue-900">{pet.name}</p>
              <p className="text-sm text-blue-700">Level {pet.game_data.level} • Working toward breeding</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {React.cloneElement(requirementIcons[index], { 
                      className: `w-4 h-4 ${req.met ? 'text-green-600' : 'text-gray-400'}` 
                    })}
                    <span className="text-sm font-medium text-gray-700">{requirementLabels[index]}</span>
                    {req.met ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <span className={`text-sm font-bold ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                    {req.current}/{req.required}{req.unit}
                  </span>
                </div>
                
                {!req.met && (
                  <div className="mt-2">
                    <Progress value={req.progress} className="h-1.5" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.max(0, req.required - req.current)} more {requirementLabels[index].toLowerCase()} needed
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <InfoIcon className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-800">Next Steps & Tips</span>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
            {pet.game_data.level < breedMinLevel && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <div className="text-xs">
                  <p className="font-medium text-purple-800">Priority Goal</p>
                  <p className="text-purple-700">Level up! Need {Math.max(0, (breedMinLevel * 100) - pet.game_data.experience)} more XP for Level {breedMinLevel}</p>
                </div>
              </div>
            )}
            
            {pet.game_data.level >= breedMinLevel && pet.stats.happiness < breedMinHappiness && (
              <div className="flex items-center gap-2 mb-2">
                <PlayIcon className="w-5 h-5 text-pink-500" />
                <div className="text-xs">
                  <p className="font-medium text-purple-800">Happiness Boost Needed</p>
                  <p className="text-purple-700">Play with {pet.name} to gain {Math.max(0, breedMinHappiness - pet.stats.happiness)} more happiness</p>
                </div>
              </div>
            )}
            
            {pet.game_data.level >= breedMinLevel && pet.stats.happiness >= breedMinHappiness && pet.game_data.coins < breedCoinsCost && (
              <div className="flex items-center gap-2 mb-2">
                <BriefcaseIcon className="w-5 h-5 text-green-500" />
                <div className="text-xs">
                  <p className="font-medium text-purple-800">Final Step</p>
                  <p className="text-purple-700">Work to earn {Math.max(0, breedCoinsCost - pet.game_data.coins)} more coins</p>
                </div>
              </div>
            )}
            
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs font-medium text-green-600 mb-1">
                ✨ Progress: {completedRequirements}/3 requirements completed!
              </p>
              <div className="flex gap-3 text-xs text-gray-600">
                <span>💡 Tip: Use combo actions for faster progress!</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Breeding System Info</span>
          </div>
          <div className="text-xs text-amber-700 space-y-1">
            <p>🧬 Offspring inherit traits from both parents with genetic variation</p>
            <p>⏰ 24-hour breeding cooldown per pet after successful mating</p>
            <p>💰 Breeding costs {breedCoinsCost} coins per parent ({breedCoinsCost * 2} total)</p>
            <p>📈 Both parents gain experience and happiness from breeding</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}