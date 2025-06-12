import React, { createContext, useState, useContext } from 'react';

const CartAccessContext = createContext();

export const CartAccessProvider = ({ children }) => {
  const [cartAccessAllowed, setCartAccessAllowed] = useState(false);

  const allowCartAccess = () => {
    setCartAccessAllowed(true);
    localStorage.setItem('cartAccessAllowed', 'true');
  };

  const denyCartAccess = () => {
    setCartAccessAllowed(false);
    localStorage.removeItem('cartAccessAllowed');
  };

  return (
    <CartAccessContext.Provider value={{ cartAccessAllowed, allowCartAccess, denyCartAccess }}>
      {children}
    </CartAccessContext.Provider>
  );
};

export const useCartAccess = () => useContext(CartAccessContext);