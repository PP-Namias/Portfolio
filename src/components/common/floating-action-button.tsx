import { Button, Tooltip } from "@heroui/react";
import type { ButtonProps } from "@heroui/react";
import { Calendar, Download, Mail, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCore } from "@/hooks/use-core";

type ActionItem = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  color: ButtonProps["color"];
};

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { downloadResumeMutation } = useCore();
  const calendlyUrl = "https://calendly.com/pp-namias";

  const actions: ActionItem[] = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule Meeting",
      action: () => window.open(calendlyUrl, "_blank"),
      color: "primary",
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: "Download Resume",
      action: () => downloadResumeMutation.mutate(),
      color: "secondary",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Quick Contact",
      action: () => {
        const contactSection = document.getElementById("ContactSection");
        contactSection?.scrollIntoView({ behavior: "smooth" });
      },
      color: "success",
    },
  ];

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 flex flex-col gap-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Tooltip content={action.label} placement="left">
                  <Button
                    isIconOnly
                    color={action.color}
                    size="lg"
                    className="shadow-lg"
                    onPress={action.action}
                  >
                    {action.icon}
                  </Button>
                </Tooltip>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        isIconOnly
        color="primary"
        size="lg"
        className="shadow-2xl"
        onPress={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
        </motion.div>
      </Button>
    </div>
  );
};
