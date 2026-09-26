import { createContext, useReducer } from "react"
import Cookies from "js-cookie"

export const Store = createContext()

const initialState = {
  cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const cart = typeof window !== "undefined" ? Cookies.get("cart") : null
    return cart ? { cart: JSON.parse(cart) } : init
  })

  const value = { state, dispatch }
  return <Store.Provider value={value}>{children}</Store.Provider>
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = action.payload
      const existingItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      )
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item.slug === existingItem.slug ? newItem : item
          )
        : [...state.cart.cartItems, newItem]

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }))
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case "REMOVE_ITEM": {
      const removeItem = action.payload
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== removeItem.slug
      )
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }))
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case "CART_CLEAR": {
      const cartItems = []
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }))
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case "SAVE_SHIPPING_ADDRESS": {
      const updatedCart = {
        ...state.cart,
        shippingAddress: { ...state.cart.shippingAddress, ...action.payload },
      }
      Cookies.set("cart", JSON.stringify(updatedCart))
      return { ...state, cart: updatedCart }
    }

    case "SAVE_PAYMENT_METHOD": {
      const updatedCart = { ...state.cart, paymentMethod: action.payload }
      Cookies.set("cart", JSON.stringify(updatedCart))
      return { ...state, cart: updatedCart }
    }

    default:
      return state
  }
}