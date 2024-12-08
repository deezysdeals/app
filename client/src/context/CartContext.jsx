import { createContext, useState, useEffect } from 'react';

// const CartContext = createContext(); 

// export default CartContext; 
export const CartContext = createContext(); 


export const CartProvider = ({ children }) => { 
    const VALID_DISCOUNT_CODES = {
        SAVE10: 10, // 10% discount
        SAVE20: 20, // 20% discount
    }; 

    const [cartItems, setCartItems] = useState([]); 
    const [discount, setDiscount] = useState(0); 

    useEffect(() => {
        const storedCart = localStorage.getItem('deezysDeals_cartItems'); 
        if (storedCart) {
            setCartItems(JSON.parse(storedCart)); 
        }
    }, []); 

    useEffect(() => {
        if (cartItems?.length > 0) {
            localStorage.setItem('deezysDeals_cartItems', JSON.stringify(cartItems)); 
        } else {
            localStorage.removeItem('deezysDeals_cartItems'); 
        }
    }, [cartItems]); 

    const addToCart = (itemId, 
                        asin, 
                        imgsSrc, 
                        title, 
                        description, 
                        oldPrice, 
                        currentPrice) => { 
        // console.log(itemId, 
        //             asin, 
        //             imgsSrc, 
        //             title, 
        //             description, 
        //             oldPrice, 
        //             currentPrice)
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item?.id == asin); 

            if (itemExists) {
                return prevItems?.map(item => item?.id == asin ? { ...item, quantity: item.quantity + 1 } : item);
            } 

            let newItem = { id: asin, 
                            img: imgsSrc, 
                            title, 
                            description, 
                            oldPrice, 
                            currentPrice
            }
            return [...prevItems, { ...newItem, quantity: 1 }];
        });
    }; 

    const removeFromCart = (productId) => { 
        console.log(productId)
        setCartItems(prevItems => 
            prevItems
                .map(item => (item?.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
                .filter(item => item.quantity > 0)
        );
    }; 

    const clearCart = () => {
        setCartItems([]); 
        localStorage.removeItem('deezysDeals_cartItems'); 
    }; 

    const getTotalQuantity = () => {
        return cartItems?.reduce((total, item) => total + item?.quantity, 0);
    }; 

    const getTotalPrice = () => {
        return cartItems?.reduce((total, item) => total + item?.currentPrice * item?.quantity, 0);
    }; 

    const applyDiscount = (code) => {
        const discountPercentage = VALID_DISCOUNT_CODES[code.toUpperCase()] || 0; 
        setDiscount(discountPercentage); 
    }; 

    const getTotalPriceWithDiscount = () => {
        const totalPrice = getTotalPrice(); 
        const discountAmount = (totalPrice * discount) / 100; 
        return totalPrice - discountAmount; 
    }; 


    let contextData = {
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        getTotalQuantity, 
        getTotalPrice, 
        applyDiscount, 
        getTotalPriceWithDiscount, 
        discount
    } 

    
    return (
        <CartContext.Provider value={ contextData }>
            { children }
        </CartContext.Provider>
    )
}