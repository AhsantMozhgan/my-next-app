import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth/next"
import Layout from "../../components/Layout"
import { authOptions } from "../api/auth/[...nextauth]"
import db from "../../utils/db"
import Order from "../../models/order"

function OrderPage({ order }) {
  if (!order) {
    return (
      <Layout title="Order">
        <p>Order not found.</p>
      </Layout>
    )
  }

  return (
    <Layout title={`Order ${order._id.slice(-8)}`}>
      <div className="mb-4">
        <Link href="/order-history" className="text-blue-600 underline text-sm">
          ← Back to Order History
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold">
        Order <span className="font-mono text-lg">{order._id}</span>
      </h1>

      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-5 mb-4">
            <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
            <p>
              {order.shippingAddress.fullName}, {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-5 mb-4">
            <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
            <p>{order.paymentMethod}</p>
            <p className="mt-2 text-sm">
              Status:{" "}
              {order.isPaid ? (
                <span className="text-green-600">Paid</span>
              ) : (
                <span className="text-red-600">Not Paid</span>
              )}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="mb-2 text-lg font-semibold">Order Items</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-bold text-gray-600">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.slug} className="border-b">
                      <td className="py-3">
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-3"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                          <span>{item.title}</span>
                        </Link>
                      </td>
                      <td className="py-3">{item.quantity}</td>
                      <td className="py-3">${item.price}</td>
                      <td className="py-3">${item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-5 md:sticky md:top-4 h-fit">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

          <div className="flex justify-between mb-1">
            <span>Items Total</span>
            <span>${order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shipping</span>
            <span>${order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tax</span>
            <span>${order.taxPrice}</span>
          </div>
          <div className="flex justify-between mb-4 font-semibold border-t pt-2">
            <span>Total</span>
            <span>${order.totalPrice}</span>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Placed: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-1">
              Delivery:{" "}
              {order.isDelivered ? (
                <span className="text-green-600">Delivered</span>
              ) : (
                <span className="text-red-600">Not Delivered</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OrderPage

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=/order/${ctx.params.id}`,
        permanent: false,
      },
    }
  }

  const { id } = ctx.params

  try {
    await db.connect()

    const order = await Order.findById(id).lean()

    if (!order) {
      return { notFound: true }
    }

    // regular users can only view their own orders; admins can view any
    const isOwner = order.user.toString() === session.user._id
    const isAdmin = session.user.isAdmin

    if (!isOwner && !isAdmin) {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      }
    }

    return {
      props: {
        order: JSON.parse(JSON.stringify(order)),
      },
    }
  } catch (err) {
    console.error(err)
    return { notFound: true }
  }
}