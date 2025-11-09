type SendMessageParams = {
  email: string;
  name: string;
  message: string;
};

export interface IContactService {
  sendMessage(params: SendMessageParams): Promise<{
    error: boolean;
    data?: unknown;
    errorMessage?: string;
  }>;
}
