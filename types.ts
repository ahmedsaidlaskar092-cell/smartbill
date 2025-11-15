export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isService?: boolean;
}

export interface BillItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export enum PaymentMode {
  CASH = 'Cash',
  UPI = 'UPI',
  CARD = 'Card',
}

export interface Bill {
  id:string;
  date: string;
  items: BillItem[];
  subTotal: number;
  discount: number;
  grandTotal: number;
  paymentMode: PaymentMode;
  patientName?: string;
  patientPhone?: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  referringDoctor?: string;
}

export interface Settings {
  shopName: string;
  address: string;
  phone?: string;
  gstin?: string;
  logo: string; // base64 string
  upiId: string;
  printSize: '58mm' | '80mm' | 'A4';
}