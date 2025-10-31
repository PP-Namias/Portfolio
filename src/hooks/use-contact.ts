import { ContactService } from "@/services/contact";
import { useMutation } from "@tanstack/react-query";

export const useContact = () => {
  const contactService = new ContactService();

  const sendMessageMutation = useMutation({
    mutationFn: contactService.sendMessage,
  });

  return {
    sendMessageMutation,
  };
};
