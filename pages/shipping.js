import Layout from "../components/Layout"
import CheckoutWizard from "../components/CheckoutWizard"

function Shipping() {
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
    </Layout>
  )
}

export default Shipping