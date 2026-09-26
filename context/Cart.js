import { createContext, useReducer, useContext, useEffect } from "react"
import Cookies from "js-cookie"

export const Store = createContext()

const initialState = {
  cart: {
    cartItems: [],
    shippingAddress: null,
    paymentMethod: "",
  },
}

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
        cart: { cartItems: [], shippingAddress: null, paymentMethod: "" },
      }

    case "CART_HYDRATE":
      return { ...state, cart: { ...state.cart, cartItems: action.payload } }

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

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // hydrate once on mount
  useEffect(() => {
    const storedCart = Cookies.get("cart")
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart)
        if (parsed?.cartItems?.length) {
          dispatch({ type: "CART_HYDRATE", payload: parsed.cartItems })
        }
      } catch (e) {}
    }

    const storedAddress = Cookies.get("shippingAddress")
    if (storedAddress) {
      try {
        dispatch({
          type: "SAVE_SHIPPING_ADDRESS",
          payload: JSON.parse(storedAddress),
        })
      } catch (e) {}
    }

    const storedPayment = Cookies.get("paymentMethod")
    if (storedPayment) {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: storedPayment })
    }
  }, [])

  // persist cart items
  useEffect(() => {
    Cookies.set(
      "cart",
      JSON.stringify({ cartItems: state.cart.cartItems }),
      { expires: 7, path: "/" }
    )
  }, [state.cart.cartItems])

  // persist shipping address
  useEffect(() => {
    if (state.cart.shippingAddress) {
      Cookies.set(
        "shippingAddress",
        JSON.stringify(state.cart.shippingAddress),
        { expires: 7, path: "/" }
      )
    }
  }, [state.cart.shippingAddress])

  // persist payment method
  useEffect(() => {
    if (state.cart.paymentMethod) {
      Cookies.set("paymentMethod", state.cart.paymentMethod, {
        expires: 7,
        path: "/",
      })
    }
  }, [state.cart.paymentMethod])

  return (
    <Store.Provider value={{ state, dispatch }}>
      {children}
    </Store.Provider>
  )
}

export function useStore() {
  return useContext(Store)
}