import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

export const SocialsModalContent = () => {
  const { querySocials } = useCore();
  const socials = querySocials();

  // Map social names to SimpleIcons slugs
  const getIconSlug = (name: string) => {
    const iconMap: Record<string, string> = {
      calendly: "calendly",
      github: "github",
      email: "gmail",
      linkedin: "linkedin",
      facebook: "facebook",
      discord: "discord",
      x: "x",
      instagram: "instagram",
    };
    return iconMap[name.toLowerCase()] || name.toLowerCase();
  };

  if (socials.isLoading)
    return (
      <ModalContent className="p-1">
        <LoadingTile className="h-[500px]" />
      </ModalContent>
    );

  if (socials.error)
    return (
      <ModalContent className="p-1">
        <ErrorTile className="h-[500px]" />
      </ModalContent>
    );

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            <p>Connect with me on my socials</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-wrap gap-2">
              {socials.data?.map((social, index) => {
                const iconSlug = getIconSlug(social.name);
                return (
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`SocialTile-${social.link}-${index}`}
                    className="bg-custom-secondary hover:border-primary hover:bg-primary/5 dark:border-default dark:hover:border-primary flex grow items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all duration-300 ease-in-out"
                  >
                    <img
                      src={`https://cdn.simpleicons.org/${iconSlug}/000000/ffffff`}
                      alt={`${social.name} icon`}
                      className="size-8"
                      onError={(e) => {
                        // Fallback to a generic icon if the specific one fails
                        e.currentTarget.src = `https://cdn.simpleicons.org/googlechrome/000000/ffffff`;
                      }}
                    />
                    <div className="flex flex-col">
                      <p className="text-xs capitalize">{social.name}</p>
                      <p className="text-base">{social.label}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
