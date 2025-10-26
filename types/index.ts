// types/index.ts
export interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Car {
  _id?: string;           // موجود في MongoDB
  name: string;
  brand?: string;         // اختياري
  type: string;
  year: number;
  price: number;
  description: string;
  images?: string[];      // بدل image فردية
  image?: string;         // for backward compatibility
  engine?: string;
  fuel?: string;
  colors?: string[];
  reviews: Review[];
  rating?: number;        // optional معدل افتراضي
}
