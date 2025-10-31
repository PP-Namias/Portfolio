import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@heroui/react";
import { Eye } from "lucide-react";

type CertificationCardProps = {
  title: string;
  image: string;
  issuer: string;
  issuedAt: string;
  tags: string[];
};

export const CertificationCard = (props: CertificationCardProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        onClick={onOpen}
        className="group hover:border-primary relative h-full w-full cursor-pointer overflow-hidden rounded-xl border border-transparent transition-all duration-300 ease-in-out"
      >
        <div className="text-primary group-hover:bg-primary/10 absolute inset-0 z-[15] flex items-center justify-center opacity-0 transition-all duration-300 ease-in-out group-hover:animate-pulse group-hover:opacity-100 group-hover:backdrop-blur-sm">
          <Eye size={80} />
        </div>

        <Image
          width={1000}
          src={props.image}
          classNames={{
            wrapper: "h-full w-full object-cover ",
            img: "h-full w-full scale-105 object-cover object-center transition-all duration-300 ease-in-out group-hover:scale-110",
          }}
          alt=""
        />
      </div>

      <Modal size={"3xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <div className="">
                  <p className="mb-6 text-2xl font-bold">{props.title}</p>
                  <div className="overflow-hidden rounded-xl">
                    <Image
                      isBlurred
                      width={1000}
                      src={props.image}
                      classNames={{
                        wrapper: "h-full w-full",
                        img: "h-full w-full object-cover scale-105",
                      }}
                      alt=""
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {props.tags.map((tag) => (
                      <div
                        key={`CertificateTag-${props.title}-${tag}`}
                        className="rounded-lg border px-3 py-1 text-base"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
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
      </Modal>
    </>
  );
};
