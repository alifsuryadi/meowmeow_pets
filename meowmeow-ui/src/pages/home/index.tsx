import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useQueryOwnedPets } from "@/hooks/useQueryOwnedPets";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import { BreedingPanel } from "./components/BreedingPanel";
import { BreedingInfoCard } from "./components/BreedingInfoCard";
import { AdoptAnotherPetButton } from "./components/AdoptAnotherPetButton";
import Header from "@/components/Header";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPet, isPending: isOwnedPetLoading } = useQueryOwnedPet();
  const { data: ownedPets = [], isPending: isOwnedPetsLoading } =
    useQueryOwnedPets();
  const { data: gameBalance } = useQueryGameBalance();
  const [showBreeding, setShowBreeding] = useState(false);
  const [activePetId, setActivePetId] = useState<string | null>(null);

  // Get the currently active pet - either the selected one or the first owned pet
  const currentActivePet = activePetId
    ? ownedPets.find((pet) => pet.id === activePetId) || ownedPet
    : ownedPet;

  const handleSwitchPet = (petId: string) => {
    setActivePetId(petId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-28">
        {!currentAccount ? (
          <div className="relative text-center px-10 pt-20 pb-10 border-4 border-primary bg-background shadow-[8px_8px_0px_#000] max-w-lg">
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              START HERE!
            </div>
            <div className="mb-6 flex justify-center">
              <img
                src="https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreidkhjpthergw2tcg6u5r344shgi2cdg5afmhgpf5bv34vqfrr7hni"
                alt="MeowMeow Pet"
                className="w-32 h-32 object-contain animate-bounce"
              />
            </div>
            <h2 className="text-3xl font-bold uppercase text-primary mb-4">
              Welcome to MeowMeow!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Connect your wallet to adopt your first digital pet!
            </p>
          </div>
        ) : isOwnedPetLoading ? (
          <div className="text-center p-10 border-4 border-primary bg-background shadow-[8px_8px_0px_#000] max-w-md">
            <div className="mb-4 flex justify-center">
              <img
                src="https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreidkhjpthergw2tcg6u5r344shgi2cdg5afmhgpf5bv34vqfrr7hni"
                alt="Loading Pet"
                className="w-24 h-24 object-contain animate-pulse opacity-70"
              />
            </div>
            <h2 className="text-2xl font-bold uppercase text-primary mb-2">
              Loading Pet...
            </h2>
            <p className="text-muted-foreground">Finding your companion!</p>
          </div>
        ) : currentActivePet ? (
          <div className="space-y-6 max-w-6xl w-full">
            {/* Toggle between Pet Care and Breeding */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={() => setShowBreeding(false)}
                variant={!showBreeding ? "default" : "outline"}
                className="px-6"
              >
                Pet Care
              </Button>
              <Button
                onClick={() => setShowBreeding(true)}
                variant={showBreeding ? "default" : "outline"}
                className="px-6"
              >
                Breeding System{" "}
                {ownedPets.length >= 2
                  ? `(${ownedPets.length} pets)`
                  : `(${ownedPets.length} pet${
                      ownedPets.length === 1 ? "" : "s"
                    })`}
              </Button>
              <AdoptAnotherPetButton variant="outline" className="px-6" />
            </div>

            {/* Content Area */}
            <div className="flex justify-center mt-8">
              {!showBreeding ? (
                <div className="flex flex-col lg:flex-row gap-6 max-w-7xl w-full">
                  {/* Pet Stack Section */}
                  <div className="flex-1 flex flex-col items-center">
                    {ownedPets.length > 1 && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 text-center hidden sm:block">
                          Click visible pets to switch
                        </p>
                        {/* Mobile Pet Switcher */}
                        <div className="sm:hidden">
                          <select
                            value={currentActivePet.id}
                            onChange={(e) => handleSwitchPet(e.target.value)}
                            className="w-full p-2 border-2 border-primary rounded-lg bg-white text-center font-bold"
                          >
                            {ownedPets.map((pet) => (
                              <option key={pet.id} value={pet.id}>
                                {pet.name} (Level {pet.game_data.level})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="relative mt-4">
                      {/* Stacked Pet Cards */}
                      {ownedPets.length > 1 &&
                        ownedPets
                          .filter((pet) => pet.id !== currentActivePet.id)
                          .map((pet, index) => (
                            <div
                              key={pet.id}
                              className="absolute top-0 cursor-pointer transition-all duration-300 hover:translate-x-2 hover:-translate-y-1 hover:scale-105 hidden sm:block"
                              style={{
                                right: `${-20 - index * 15}px`,
                                zIndex: 10 + ownedPets.length - index,
                                transform: `rotate(${(index + 1) * 2}deg)`,
                              }}
                              onClick={() => handleSwitchPet(pet.id)}
                            >
                              <div className="group">
                                <div className="bg-white rounded-lg p-2 border-2 border-gray-300 hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300 w-[300px] sm:w-[400px] lg:w-[600px] blur-sm hover:blur-none">
                                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                      SWITCH
                                    </span>
                                  </div>
                                  <div className="w-full">
                                    <PetComponent pet={pet} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                      {/* Active Pet (Front) */}
                      <div className="relative z-20">
                        <div className="relative">
                          <div className="relative bg-white rounded-lg p-3 border-4 border-primary shadow-xl w-[300px] sm:w-[400px] lg:w-[600px]">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                ⭐ ACTIVE
                              </span>
                            </div>
                            <PetComponent pet={currentActivePet} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breeding Info Sidebar */}
                  {!currentActivePet.isSleeping && (
                    <div className="w-full lg:w-80 flex-shrink-0">
                      <BreedingInfoCard
                        pet={currentActivePet}
                        gameBalance={gameBalance}
                        onSwitchToBreeding={() => setShowBreeding(true)}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <BreedingPanel
                  userPets={ownedPets}
                  isAnyActionPending={isOwnedPetLoading || isOwnedPetsLoading}
                />
              )}
            </div>
          </div>
        ) : (
          <AdoptComponent />
        )}
      </main>
    </div>
  );
}
