import { createContext, useReducer, useContext, useEffect } from "react"
import Cookies from "js-cookie"

// ---------- Context ----------
export const Store = createContext()

// ---------- Initial state ----------
const initialState = {
  cart: {
    cartItems: [],
    shippingAddress: null,
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

    case "REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      )
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } }

    case "CART_HYDRATE":
      return { ...state, cart: { ...state.cart, cartItems: action.payload } }

    case "SAVE_SHIPPING_ADDRESS":
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload } }

    default:
      return state
  }
}

// ---------- Provider ----------
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // hydrate from cookie once on mount
  useEffect(() => {
    const stored = Cookies.get("cart")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.cartItems?.length) {
          dispatch({ type: "CART_HYDRATE", payload: parsed.cartItems })
        }
      } catch (e) {
        // ignore malformed cookie
      }
    }
  }, [])

  // hydrate shipping address from cookie once on mount
useEffect(() => {
  const storedAddress = Cookies.get("shippingAddress")
  if (storedAddress) {
    try {
      dispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: JSON.parse(storedAddress),
      })
    } catch (e) {
      // ignore malformed cookie
    }
  }
}, [])

// persist cart items
useEffect(() => {
  Cookies.set(
    "cart",
    JSON.stringify({ cartItems: state.cart.cartItems }),
    { expires: 7 }
  )
}, [state.cart.cartItems])

// persist shipping address
useEffect(() => {
  if (state.cart.shippingAddress) {
    Cookies.set(
      "shippingAddress",
      JSON.stringify(state.cart.shippingAddress),
      { expires: 7 }
    )
  }
}, [state.cart.shippingAddress])

  return (
    <Store.Provider value={{ state, dispatch }}>
      {children}
    </Store.Provider>
  )
}

export function useStore() {
  return useContext(Store)
}
