export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock?: number; // For stock alert/urgency
}
