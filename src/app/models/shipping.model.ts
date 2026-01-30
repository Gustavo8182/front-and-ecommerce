export interface ShippingOption {
  serviceName: string;
  serviceType: 'EXPRESS' | 'NORMAL';
  price: number;
  deliveryDays: number;
}

export interface ShippingCalculationRequest {
  storeId: string;
  zipCode: string;
  items: ShippingItem[];
}

export interface ShippingItem {
  width: number;
  height: number;
  length: number;
  weight: number;
  price: number;
  quantity: number;
}
