import { useCore } from "@/hooks/use-core";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  addToast,
} from "@heroui/react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export const ResumeViewModalContent = () => {
  const { resumeUrl, downloadResumeMutation } = useCore();
  async function onDownloadResume() {
    await downloadResumeMutation
      .mutateAsync()
      .then(() => {
        addToast({
          title: "Resume has been downloaded successfully",
          color: "success",
        });
      })
      .catch(() => {
        addToast({
          title: "An error has occured",
          color: "danger",
        });
      });
  }

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            <p>RESUME_CABRERA-JENJADE.PDF</p>
            <p className="text-base font-normal">{""}</p>
          </ModalHeader>
          <ModalBody>
            <ScrollShadow
              size={40}
              hideScrollBar
              className="h-[70vh] rounded-xl"
            >
              <div className="h-full">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer fileUrl={resumeUrl} />
                </Worker>
              </div>
            </ScrollShadow>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              onPress={onDownloadResume}
              isLoading={downloadResumeMutation.isPending}
              color="primary"
            >
              Download
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
