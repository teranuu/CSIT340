import React, { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const initialState = {
  cart: [],
  wishlist: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload;
      // if item exists increase quantity
      const existing = state.cart.find(i => i.id === item.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i)
        };
      }
      return { ...state, cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
    }

    case 'REMOVE_FROM_CART': {
      const id = action.payload;
      return { ...state, cart: state.cart.filter(i => i.id !== id) };
    }

    case 'SET_CART_QUANTITY': {
      const { id, quantity } = action.payload;
      return { ...state, cart: state.cart.map(i => i.id === id ? { ...i, quantity } : i) };
    }

    case 'TOGGLE_WISHLIST': {
      const item = action.payload;
      const inList = state.wishlist.find(i => i.id === item.id);
      if (inList) {
        return { ...state, wishlist: state.wishlist.filter(i => i.id !== item.id) };
      }
      return { ...state, wishlist: [...state.wishlist, item] };
    }

    case 'REMOVE_FROM_WISHLIST': {
      const id = action.payload;
      return { ...state, wishlist: state.wishlist.filter(i => i.id !== id) };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

export function useCartState() {
  const ctx = useContext(CartStateContext);
  if (ctx === undefined) throw new Error('useCartState must be used within CartProvider');
  return ctx;
}

export function useCartDispatch() {
  const ctx = useContext(CartDispatchContext);
  if (ctx === undefined) throw new Error('useCartDispatch must be used within CartProvider');
  return ctx;
}

export default CartProvider;
