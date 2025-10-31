import axios from "axios";
import type { IContactService } from "./interface";

export class ContactService implements IContactService {
  constructor() {
    this.sendMessage = this.sendMessage.bind(this);
  }

  async sendMessage(
    params: Parameters<IContactService["sendMessage"]>[0],
  ): ReturnType<IContactService["sendMessage"]> {
    const url = "https://formsubmit.co/ajax/hello@jadecabrera.com";
    return axios.post(url, {
      "Content-Type": "application/json",
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        message: params.message,
      }),
    });
  }
}
