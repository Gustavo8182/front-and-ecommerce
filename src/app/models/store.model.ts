import { ShippingService } from '../services/shipping.service';
import { ShippingOption } from './shipping.model';

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

export interface StoreConfig {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  melhorEnvioToken?: string;
}
