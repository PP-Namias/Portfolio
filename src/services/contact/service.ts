import axios from "axios";
import type { IContactService } from "./interface";

export class ContactService implements IContactService {
  constructor() {
    this.sendMessage = this.sendMessage.bind(this);
  }

  async sendMessage(
    params: Parameters<IContactService["sendMessage"]>[0],
  ): ReturnType<IContactService["sendMessage"]> {
    const url = "https://formsubmit.co/pp.namias@gmail.com";

    try {
      // Create FormData to match the standard FormSubmit POST format
      const formData = new FormData();
      formData.append("name", params.name);
      formData.append("email", params.email);
      formData.append("message", params.message);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { error: false, data: response.data };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { error: true, errorMessage: errorMessage || "Unknown error" };
    }
  }
}
