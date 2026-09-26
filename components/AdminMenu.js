import Link from "next/link"
import { useRouter } from "next/router"

export default function AdminMenu() {
  const router = useRouter()

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/users", label: "Users" },
  ]

  return (
    <nav className="bg-white rounded-xl p-4 mb-5">
      <ul className="flex flex-wrap gap-4">
        {links.map((link) => {
          const isActive = router.pathname === link.href
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-xl px-4 py-2 ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}