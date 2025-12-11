import React, { createContext, useContext, useReducer } from 'react';

const FilterStateContext = createContext();
const FilterDispatchContext = createContext();

const initialState = {
  category: 'All Products',
  priceMin: 0,
  priceMax: 1000,
  color: 'All',
  searchTerm: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_PRICE_MIN':
      return { ...state, priceMin: action.payload };
    case 'SET_PRICE_MAX':
      return { ...state, priceMax: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'RESET_FILTERS':
      return { ...initialState };
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FilterDispatchContext.Provider value={dispatch}>
      <FilterStateContext.Provider value={state}>
        {children}
      </FilterStateContext.Provider>
    </FilterDispatchContext.Provider>
  );
}

export function useFilterState() {
  const ctx = useContext(FilterStateContext);
  if (ctx === undefined) throw new Error('useFilterState must be used within FilterProvider');
  return ctx;
}

export function useFilterDispatch() {
  const ctx = useContext(FilterDispatchContext);
  if (ctx === undefined) throw new Error('useFilterDispatch must be used within FilterProvider');
  return ctx;
}

export default FilterProvider;
