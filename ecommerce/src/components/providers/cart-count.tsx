import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCart } from '../../fetch/product';

interface CartContextType {
    refreshCartCount: () => Promise<void>;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getNumberOfItemsInCart } = useCart();
    const [cartItemCount, setCartItemCount] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            const data = await getNumberOfItemsInCart();
            setCartItemCount(data);
        }
        fetchData();
    }, []);

    async function refreshCartCount()  {
        const data = await getNumberOfItemsInCart();
        console.log("Updating context");
        setCartItemCount(data);
    };

    function getCartCount(): number {
        return cartItemCount;
    };

    return (
        <CartContext.Provider value={{ refreshCartCount, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartCountProvider');
  }
  return context;
};