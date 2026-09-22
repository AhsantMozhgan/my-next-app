import { createContext, useReducer } from 'react'

// ---------- Context ----------
const CartContext = createContext()

// ---------- Initial state ----------
const initialState = {
  cart: {
    cartItems: [],
  },
}

// ---------- Reducer ----------
function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = action.payload
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      )

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.title === existItem.title ? newItem : item
          )
        : [...state.cart.cartItems, newItem]

      return { ...state, cart: { ...state.cart, cartItems } }
    }

    default:
      return state
  }
}

// ---------- Provider ----------
export function CartContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = { state, dispatch }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
