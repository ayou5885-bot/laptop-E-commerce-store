export type Brand = 'Dell' | 'HP' | 'Lenovo' | 'ASUS' | 'Acer' | 'Apple';

export type Category = 'Business' | 'Gaming' | 'Ultrabook' | 'Everyday' | 'Creative';

export type Availability = 'In Stock' | 'Low Stock' | 'Pre-Order';

export interface Product {
  id: number;
  brand: Brand;
  model: string;
  slug: string;
  category: Category;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  fullDescription: string;
  processor: string;
  graphics: string;
  ram: string;
  storage: string;
  display: string;
  resolution: string;
  operatingSystem: string;
  weight: string;
  features: string[];
  availability: Availability;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  releaseDate: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}
