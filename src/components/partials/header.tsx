import { ResumeViewModalContent } from "@/components/common/resume-view-modal-content";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button, Modal, useDisclosure } from "@heroui/react";
import { cn } from "@heroui/theme";
import { PersonStanding } from "lucide-react";

export const Header = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="bg-background relative flex items-center rounded-xl p-[3px] text-sm sm:text-base lg:text-sm xl:text-base">
        <div className="me-auto flex items-center gap-1">
          <div className="p-1">
            <PersonStanding />
          </div>
          <p className="me-auto font-bold">Jhon Keneth Namias</p>
        </div>

        <div className="flex gap-1">
          <Button
            onPress={onOpen}
            size="sm"
            className={cn(
              "bg-custom-secondary rounded-lg text-sm font-bold sm:flex sm:text-base lg:text-sm 2xl:gap-4 2xl:text-base",
            )}
          >
            View resume
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ResumeViewModalContent />
      </Modal>
    </>
  );
};
