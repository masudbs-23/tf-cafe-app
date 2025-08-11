import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isLoading: true,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOAD_CART':
      const loadedItems = action.payload;
      const loadedTotalQuantity = loadedItems.reduce((sum, item) => sum + item.quantity, 0);
      const loadedTotalAmount = loadedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...state,
        items: loadedItems,
        totalQuantity: loadedTotalQuantity,
        totalAmount: loadedTotalAmount,
        isLoading: false,
      };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item._id === action.payload._id);
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Item doesn't exist, add new item
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const newTotalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalQuantity: newTotalQuantity,
        totalAmount: newTotalAmount,
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item._id !== action.payload);
      const filteredTotalQuantity = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      const filteredTotalAmount = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: filteredItems,
        totalQuantity: filteredTotalQuantity,
        totalAmount: filteredTotalAmount,
      };
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item._id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0); // Remove items with quantity 0
      
      const updatedTotalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const updatedTotalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalQuantity: updatedTotalQuantity,
        totalAmount: updatedTotalAmount,
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          const items = JSON.parse(cartData);
          dispatch({ type: 'LOAD_CART', payload: items });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever cart changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    };

    if (!state.isLoading) {
      saveCart();
    }
  }, [state.items, state.isLoading]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item as CartItem });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (itemId: string): number => {
    const item = state.items.find(item => item._id === itemId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
