'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

type CartContextType = {
    count: number;
    setCount: (value: number) => void;
    refetch: () => void;
}
const GET_CART_COUNT = gql`
query {
cart {
id
}
}
`;

const Cartcontext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [count, setCount] = useState(0);
    const { data, refetch } = useQuery<{ cart: { id: string }[] }>(GET_CART_COUNT)

    useEffect(() => {
        if (data?.cart) {
            setCount(data.cart.length)
        }
    }, [data])
    return (
        <Cartcontext.Provider value={{ count, setCount, refetch }}>
            {children}
        </Cartcontext.Provider>
    );
}


export function useCart() {
    const context = useContext(Cartcontext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider")
    }
    return context;
}