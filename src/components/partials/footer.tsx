import { SocialsModalContent } from "@/components/features/socials/socials-modal-content";
import { addToast, Button, Modal, useDisclosure } from "@heroui/react";
import { Clipboard } from "lucide-react";

export const Footer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const emailAddress = "pp.namias@gmail.com";

  function onCopy() {
    navigator.clipboard.writeText(emailAddress).then(() => {
      addToast({
        title: "Successfully copied to clipboard",
        color: "success",
      });
    });
  }

  return (
    <>
      <div className="bg-background flex justify-between rounded-xl p-[3px] text-xs sm:text-sm">
        <div className="w-max-h-max relative">
          <Button
            size="sm"
            onPress={onCopy}
            className="bg-custom-secondary text-primary border-default flex w-max items-center gap-1 rounded-lg border text-sm dark:border-none"
          >
            <p className="text-foreground">{emailAddress}</p>
            <Clipboard className="h-[1rem] w-[1rem]" />
          </Button>
        </div>
        <Button
          size="sm"
          onPress={onOpen}
          className="bg-custom-secondary flex w-max items-center gap-2 rounded-lg text-sm"
        >
          <p className="hidden sm:block">Connect with me</p>
          <p className="block sm:hidden">Connect</p>
          <div className="bg-success size-3 rounded-full"></div>
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <SocialsModalContent />
      </Modal>
    </>
  );
};
