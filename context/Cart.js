import { createContext, useReducer, useContext, useEffect } from "react"
import Cookies from "js-cookie"

// ---------- Context ----------
export const Store = createContext()

// ---------- Initial state ----------
const initialState = {
  cart: {
    cartItems: [],
    shippingAddress: null,
    paymentMethod: "",
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
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: null,
          paymentMethod: "",
        },
      }

    case "CART_HYDRATE":
      return {
        ...state,
        cart: { ...state.cart, cartItems: action.payload },
      }

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      }

    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      }

    default:
      return state
  }
}

// ---------- Provider ----------
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // hydrate cart items from cookie once on mount
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

  // hydrate payment method from cookie once on mount
  useEffect(() => {
    const storedPayment = Cookies.get("paymentMethod")
    if (storedPayment) {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: storedPayment })
    }
  }, [])

  // persist cart items whenever they change
  useEffect(() => {
    Cookies.set(
      "cart",
      JSON.stringify({ cartItems: state.cart.cartItems }),
      { expires: 7 }
    )
  }, [state.cart.cartItems])

  // persist shipping address whenever it changes
  useEffect(() => {
    if (state.cart.shippingAddress) {
      Cookies.set(
        "shippingAddress",
        JSON.stringify(state.cart.shippingAddress),
        { expires: 7 }
      )
    }
  }, [state.cart.shippingAddress])

  // persist payment method whenever it changes
  useEffect(() => {
    if (state.cart.paymentMethod) {
      Cookies.set("paymentMethod", state.cart.paymentMethod, { expires: 7 })
    }
  }, [state.cart.paymentMethod])

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