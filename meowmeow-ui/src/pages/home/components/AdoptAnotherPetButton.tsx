import { useState } from "react";
import { PlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutateAdoptPet } from "@/hooks/useMutateAdoptPet";

const INITIAL_PET_IMAGE_URL =
  "https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreidkhjpthergw2tcg6u5r344shgi2cdg5afmhgpf5bv34vqfrr7hni";

type AdoptAnotherPetButtonProps = {
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function AdoptAnotherPetButton({ 
  variant = "default", 
  size = "default", 
  className = "" 
}: AdoptAnotherPetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [petName, setPetName] = useState("");
  const { mutate: mutateAdoptPet, isPending: isAdopting } = useMutateAdoptPet();

  const handleAdoptPet = () => {
    if (!petName.trim()) return;
    
    mutateAdoptPet({ name: petName.trim() }, {
      onSuccess: () => {
        setIsOpen(false);
        setPetName("");
      }
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setPetName("");
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Adopt Another Pet
      </Button>

      {/* Custom Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border-2 border-primary">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              disabled={isAdopting}
            >
              <XIcon className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 text-center">
              <h2 className="text-2xl font-bold text-primary">Adopt Another Pet</h2>
              <p className="text-gray-600 mt-2">Expand your pet family! Give this new friend a name.</p>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-6 space-y-6">
              <div className="flex justify-center">
                <img
                  src={INITIAL_PET_IMAGE_URL}
                  alt="New pet"
                  className="w-32 h-32 rounded-full border-4 border-primary/20 object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="pet-name" className="block text-sm font-medium mb-2">
                    Pet Name
                  </label>
                  <Input
                    id="pet-name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Enter new pet's name"
                    disabled={isAdopting}
                    className="text-center"
                    maxLength={20}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && petName.trim() && !isAdopting) {
                        handleAdoptPet();
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={isAdopting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdoptPet}
                    disabled={!petName.trim() || isAdopting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isAdopting ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Adopting...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adopt Pet
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}