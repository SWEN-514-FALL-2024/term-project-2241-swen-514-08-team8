
export type ProductType = {
    ProductId: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating_rate: number;
    rating_count: number;
};
  
export type Cart = {
    id: string;
    productId: number;
    quantity: number;
    transactionId: string;
    itemStatus: string;
};
  