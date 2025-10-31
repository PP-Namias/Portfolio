import { useCore } from "@/hooks/use-core";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";
import { TechnologyBadge } from "./technology-badge";

export const TechnologiesModalContent = () => {
  const { queryTechnologies } = useCore();
  const technologies = queryTechnologies();

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="mt-2 flex flex-col gap-1">
            <p className="text-xl">Technologies</p>
            <p className="text-base font-normal">
              <span>{"A total of "}</span>
              <span className="text-primary p-1 text-xl font-bold">
                {technologies.data?.length}
              </span>
              <span>
                {
                  " languages and technologies that I work and used to work with"
                }
              </span>
            </p>
          </ModalHeader>
          <ModalBody>
            <ScrollShadow size={100} className="max-h-[400px]">
              <div className="flex flex-wrap gap-2">
                {technologies.data?.map((technology) => (
                  <TechnologyBadge
                    className="h-[2.6rem]"
                    key={`TechnologyBadge-${technology.name}`}
                    name={technology.name}
                    simpleIcon={technology.logo}
                  />
                ))}
              </div>
            </ScrollShadow>
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
