import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import Header from "@/components/Header";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPet, isPending: isOwnedPetLoading } = useQueryOwnedPet();

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-24">
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
        ) : ownedPet ? (
          <PetComponent pet={ownedPet} />
        ) : (
          <AdoptComponent />
        )}
      </main>
    </div>
  );
}
