import { createContext, useReducer, useContext, useEffect } from "react"

// ---------- Context ----------
export const Store = createContext()

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
            item.slug === existItem.slug ? newItem : item
          )
        : [...state.cart.cartItems, newItem]

      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      )
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } }

    case "CART_HYDRATE":
      return { ...state, cart: { ...state.cart, cartItems: action.payload } }

    default:
      return state
  }
}

// ---------- Provider ----------
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // 👇 useEffect #1 — hydrate from localStorage once, on mount
  useEffect(() => {
    const stored = window.localStorage.getItem("cart")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.cartItems?.length) {
        dispatch({ type: "CART_HYDRATE", payload: parsed.cartItems })
      }
    }
  }, [])

  // 👇 useEffect #2 — persist to localStorage on every cart change
  useEffect(() => {
    window.localStorage.setItem("cart", JSON.stringify(state.cart))
  }, [state.cart])

  return (
    <Store.Provider value={{ state, dispatch }}>
      {children}
    </Store.Provider>
  )
}

// ---------- Hook ----------
export function useStore() {
  return useContext(Store)
}
