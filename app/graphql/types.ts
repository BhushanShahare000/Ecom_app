export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: {
        name: string;
    };
}

export interface GetProductsData {
    products: Product[];
}

export interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
}

export interface GetCartData {
    cart: CartItem[];
}

export interface CheckoutData {
    checkout: {
        id: string;
        total: number;
        status: string;
    };
}

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        image: string;
    };
}

export interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export interface GetOrdersData {
    orders: Order[];
}
