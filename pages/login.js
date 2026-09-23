import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "../components/Layout"

function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }
    // later: POST to /api/users/register
    router.push("/login")
  }

  return (
    <Layout title="Register">
      <form
        onSubmit={submitHandler}
        className="mx-auto max-w-md bg-white rounded-xl p-6"
      >
        <h1 className="mb-6 text-xl font-bold">Register</h1>

        <div className="mb-4">
          <label className="mb-1 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <button className="rounded-xl bg-gray-700 px-4 py-2 text-white">
          Register
        </button>

        {/* reverse link */}
        <div className="mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </div>
      </form>
    </Layout>
  )
}

export default RegisterPage
