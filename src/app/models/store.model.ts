export interface Store {
    id: string;
    name: string;
    description: string;
    cnpj?: string;
    creationDate: string;
}

export interface CreateStoreRequest {
    name: string;
    description: string;
    cnpj?: string;
}
