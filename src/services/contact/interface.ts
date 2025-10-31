type SendMessageParams = {
  email: string;
  name: string;
  message: string;
};

export interface IContactService {
  sendMessage(params: SendMessageParams): Promise<never>;
}
