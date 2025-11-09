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

  // Inline LinkedIn SVG icon (white color for dark/light theme compatibility)
  const LinkedInIcon = () => (
    <svg 
      viewBox="0 0 382 382" 
      className="size-8"
      fill="currentColor"
    >
      <path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472L341.91,330.654L341.91,330.654z"/>
    </svg>
  );

  // Map social names to SimpleIcons slugs with proper details
  const getSocialInfo = (name: string) => {
    const socialInfo: Record<string, { slug: string; displayName: string; subtitle?: string; useCustomIcon?: boolean }> = {
      calendly: { slug: "calendly", displayName: "Calendly", subtitle: "Schedule a Meeting" },
      github: { slug: "github", displayName: "GitHub", subtitle: "PP-Namias" },
      email: { slug: "gmail", displayName: "Gmail", subtitle: "pp.namias@gmail.com" },
      linkedin: { slug: "linkedin", displayName: "LinkedIn", subtitle: "Jhon Keneth Ryan Namias", useCustomIcon: true },
      facebook: { slug: "facebook", displayName: "Facebook", subtitle: "Jhon Keneth Ryan Namias" },
      discord: { slug: "discord", displayName: "Discord", subtitle: "@PP-Namias" },
      x: { slug: "x", displayName: "X (Twitter)", subtitle: "@PP_Namias" },
      instagram: { slug: "instagram", displayName: "Instagram", subtitle: "@pp_namias" },
    };
    return socialInfo[name.toLowerCase()] || { slug: name.toLowerCase(), displayName: name };
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
                const socialInfo = getSocialInfo(social.name);
                const iconSrc = socialInfo.useLocalIcon && socialInfo.localIcon
                  ? socialInfo.localIcon
                  : `https://cdn.simpleicons.org/${socialInfo.slug}/000000/ffffff`;
                
                return (
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`SocialTile-${social.link}-${index}`}
                    className="bg-custom-secondary hover:border-primary hover:bg-primary/5 dark:border-default dark:hover:border-primary flex grow items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all duration-300 ease-in-out"
                  >
                    <img
                      src={iconSrc}
                      alt={`${socialInfo.displayName} icon`}
                      className="size-8"
                      onError={(e) => {
                        // Fallback to a generic icon if the specific one fails
                        if (!socialInfo.useLocalIcon) {
                          e.currentTarget.src = `https://cdn.simpleicons.org/googlechrome/000000/ffffff`;
                        }
                      }}
                    />
                    <div className="flex flex-col">
                      <p className="text-xs font-medium">{socialInfo.displayName}</p>
                      <p className="text-sm text-default-500">{socialInfo.subtitle || social.label}</p>
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
