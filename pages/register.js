import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Layout from "../components/Layout"

function RegisterPage() {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const [error, setError] = useState("")

  const submitHandler = async ({ name, email, password }) => {
    setError("")

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Registration failed")
        return
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
        return
      }

      toast.success("Account created")
      router.push("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Layout title="Register">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-md bg-white rounded-xl p-6"
      >
        <h1 className="mb-6 text-xl font-bold">Register</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1 block">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full rounded border p-2"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

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
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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

        <div className="mb-4">
          <label className="mb-1 block">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            className="w-full rounded border p-2"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button className="w-full rounded-xl bg-gray-700 px-4 py-2 text-white">
          Register
        </button>

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