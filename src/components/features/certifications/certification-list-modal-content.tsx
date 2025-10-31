import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";

export const CertificateListModalContent = () => {
  const { queryCertifications } = useCore();
  const certifications = queryCertifications();

  if (certifications.isLoading)
    return (
      <ModalContent className="p-1">
        <LoadingTile className="h-[50vh]" />
      </ModalContent>
    );

  if (certifications.error)
    return (
      <ModalContent className="p-1">
        <ErrorTile className="h-[50vh]" />
      </ModalContent>
    );

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            <p>Certifications</p>
            <p className="text-base font-normal">
              {
                "A list of my certifications for every field over the course of my lifetime"
              }
            </p>
          </ModalHeader>
          <ModalBody>
            <ScrollShadow size={40} className="max-h-[400px]">
              <ol className="list-inside list-decimal">
                {certifications.data?.map((certification) => (
                  <li key={`Certification-${certification.title}`}>
                    {certification.title}
                  </li>
                ))}
              </ol>
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
