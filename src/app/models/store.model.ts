export interface Store {
  id: string;
  name: string;
  description: string;
  cnpj?: string;
  ownerName?: string; // Novo campo que o Back-end envia
}

export interface CreateStoreRequest {
  name: string;
  description: string;
  cnpj?: string;
}
