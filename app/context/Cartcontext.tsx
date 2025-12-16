'use client'

import { createContext, useContext, useState, ReactNode } from "react"

type CartContextType = {
    count: number;
    setCount: (value: number) => void;


}

const Cartcontext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [count, setCount] = useState(0);
    return (
        <Cartcontext.Provider value={{ count, setCount }}>
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