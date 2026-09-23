import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import Layout from "../components/Layout"

function LoginPage() {
  const router = useRouter()
  const { redirect } = router.query
  const { status } = useSession()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const [error, setError] = useState("")

  // if already logged in, skip the login form
  useEffect(() => {
    if (status === "authenticated") {
      router.push(redirect || "/")
    }
  }, [status, router, redirect])

  const submitHandler = async ({ email, password }) => {
    setError("")

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
      return
    }

    router.push(redirect || "/")
  }

  return (
    <Layout title="Login">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-md bg-white rounded-xl p-6"
      >
        <h1 className="mb-6 text-xl font-bold">Login</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Email is invalid",
              },
            })}
            className="w-full rounded border p-2"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full rounded border p-2"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button className="rounded-xl bg-gray-700 px-4 py-2 text-white">
          Login
        </button>

        <div className="mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Register
          </Link>
        </div>
      </form>
    </Layout>
  )
}

export default LoginPage