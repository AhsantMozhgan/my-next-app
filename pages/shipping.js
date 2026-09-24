import Layout from "../components/Layout"
import CheckoutWizard from "../components/CheckoutWizard"

function Shipping() {
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />

      <form
        className="mx-auto max-w-md bg-white rounded-xl p-6"
      >
        <h1 className="mb-6 text-xl font-bold">Shipping Address</h1>

        <div className="mb-4">
          <label className="mb-1 block">Full Name</label>
          <input
            className="w-full rounded border p-2"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block">Address</label>
          <input
            className="w-full rounded border p-2"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block">Postal Code</label>
          <input
            className="w-full rounded border p-2"
          />
        </div>

        <button className="w-full rounded-xl bg-gray-700 px-4 py-2 text-white">
          Continue
        </button>
      </form>
    </Layout>
  )
}

export default Shipping