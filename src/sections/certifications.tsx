import { CertificationCard } from "@/components/features/certifications/certification-card";
import { CertificateListModalContent } from "@/components/features/certifications/certification-list-modal-content";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import { Button, Modal, useDisclosure } from "@heroui/react";
import { useMemo } from "react";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/certifications/*.jpg",
  { eager: true, import: "default", query: "?format=webp&meta&quality=1" },
);

export default function Certifications() {
  const { queryCertifications } = useCore();
  const { data: _data, isLoading, error } = queryCertifications();
  const data = useMemo(() => _data, [_data]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (isLoading)
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <LoadingTile
                key={`CertificationCardLoadingComponent-${index}`}
                className="h-[400px] rounded-xl lg:h-[300px] xl:h-[380px]"
              />
            ))}
        </div>
      </>
    );

  if (error)
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <ErrorTile
                key={`CertificationCardErrorComponent-${index}`}
                className="h-[400px] rounded-xl lg:h-[300px] xl:h-[380px]"
              />
            ))}
        </div>
      </>
    );

  return (
    <>
      <div className="sticky top-0 z-20 flex w-full justify-end p-2">
        <Button
          onPress={onOpen}
          size="sm"
          className="group border-default bg-background w-max rounded-lg border px-3 py-1 font-mono text-sm uppercase opacity-80"
        >
          <p className="block group-hover:hidden">
            {"Certificate count: "} {data?.length}
          </p>
          <p className="hidden group-hover:block">View certificate list</p>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {data?.map((certificate) => {
          const imageKey = Object.keys(optimizedImages).find((key) =>
            key.includes(certificate.image),
          )!;

          const image = optimizedImages[imageKey];

          return (
            <CertificationCard
              key={`CertificateCard-${certificate.title}`}
              {...certificate}
              image={image}
            />
          );
        })}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <CertificateListModalContent />
      </Modal>
    </>
  );
}
