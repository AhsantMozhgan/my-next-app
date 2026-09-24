import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"
import Layout from "../components/Layout"
import CheckoutWizard from "../components/CheckoutWizard"
import { Store } from "../context/Cart"

function Shipping() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems, shippingAddress },
  } = state

  // empty cart → back home
  useEffect(() => {
    if (!cartItems.length) {
      router.push("/")
    }
  }, [cartItems, router])

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()

  // once context has the address, push it into the form
  useEffect(() => {
    if (shippingAddress) {
      setValue("fullName", shippingAddress.fullName)
      setValue("address", shippingAddress.address)
      setValue("city", shippingAddress.city)
      setValue("postalCode", shippingAddress.postalCode)
      setValue("country", shippingAddress.country)
    }
  }, [shippingAddress, setValue])

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    })

    Cookies.set(
      "shippingAddress",
      JSON.stringify({ fullName, address, city, postalCode, country }),
      { expires: 7 }
    )

    router.push("/payment")
  }

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-md bg-white rounded-xl p-6"
      >
        <h1 className="mb-6 text-xl font-bold">Shipping Address</h1>

        {/* Full Name */}
        <div className="mb-4">
          <label className="mb-1 block">Full Name</label>
          <input
            {...register("fullName", { required: "Full name is required" })}
            className="w-full rounded border p-2"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="mb-1 block">Address</label>
          <input
            {...register("address", { required: "Address is required" })}
            className="w-full rounded border p-2"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="mb-1 block">City</label>
          <input
            {...register("city", { required: "City is required" })}
            className="w-full rounded border p-2"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* Postal Code */}
        <div className="mb-4">
          <label className="mb-1 block">Postal Code</label>
          <input
            {...register("postalCode", { required: "Postal code is required" })}
            className="w-full rounded border p-2"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        {/* Country */}
        <div className="mb-4">
          <label className="mb-1 block">Country</label>
          <input
            {...register("country", { required: "Country is required" })}
            className="w-full rounded border p-2"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>

        <button className="w-full rounded-xl bg-gray-700 px-4 py-2 text-white">
          Continue
        </button>
      </form>
    </Layout>
  )
}

export default Shipping