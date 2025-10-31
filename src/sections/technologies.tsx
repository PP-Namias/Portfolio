import { TechnologiesModalContent } from "@/components/features/technologies/technologies-modal-content";
import { TechnologyBadge } from "@/components/features/technologies/technology-badge";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import { Modal, Tooltip, useDisclosure } from "@heroui/react";
import { CornerLeftUp, Forward } from "lucide-react";
import { useMemo } from "react";
import Marquee from "react-fast-marquee";

export default function Technologies() {
  const { queryTechnologies } = useCore();
  const { data: _data, isLoading, error } = queryTechnologies();
  const data = useMemo(() => _data, [_data]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (isLoading)
    return (
      <div className="bg-background h-[3rem] rounded-xl p-[3px]">
        <LoadingTile spinnerSize="sm" />
      </div>
    );

  if (error)
    return (
      <div className="bg-background h-[3rem] rounded-xl p-[3px]">
        <ErrorTile />
      </div>
    );

  return (
    <>
      <div className="relative overflow-x-hidden rounded-xl">
        <div className="from-background absolute left-0 z-[5] flex h-full items-center bg-gradient-to-r to-transparent px-6"></div>
        <div className="to-background absolute right-0 z-[5] flex h-full items-center bg-gradient-to-r from-transparent px-6">
          <Tooltip
            color="primary"
            className="font-mono text-xs uppercase"
            closeDelay={0}
            content="Open list"
          >
            <button onClick={onOpen} className="relative cursor-pointer">
              <div className="border-primary dark:border-foreground absolute z-[-5] h-full w-full animate-ping rounded-full border bg-transparent backdrop-blur-xl"></div>
              <Forward className="bg-primary text-primary-foreground z-[3] hidden rounded-full p-1 lg:block" />
              <CornerLeftUp className="bg-primary text-primary-foreground z-[3] block rounded-full p-1 lg:hidden" />
            </button>
          </Tooltip>
        </div>
        <div className="bg-background h-max rounded-xl p-[3px]">
          <Marquee>
            {data?.map((technology) => (
              <TechnologyBadge
                className="mx-[3px] h-[2.6rem]"
                key={`TechnologyBadge-${technology.name}`}
                name={technology.name}
                simpleIcon={technology.logo}
              />
            ))}
          </Marquee>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <TechnologiesModalContent />
      </Modal>
    </>
  );
}
