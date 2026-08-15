export class RagError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'RagError';
  }
}

export class ProviderUnavailableError extends RagError {
  constructor(message: string) {
    super(message, 'provider_unavailable');
    this.name = 'ProviderUnavailableError';
  }
}
