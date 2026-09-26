import Link from "next/link"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

function Dropdown({ label, items }) {
  return (
    <Menu>
      <MenuButton className="rounded bg-gray-700 px-3 py-1 text-sm text-white data-[active]:bg-gray-800">
        {label}
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="mt-1 w-52 rounded-lg bg-white p-1 shadow-lg [--anchor-gap:4px]"
      >
        {items.map((item, index) => (
          <MenuItem key={index}>
            {item.href ? (
              <Link
                href={item.href}
                className="block rounded px-3 py-2 text-sm data-[focus]:bg-gray-100"
              >
                {item.label}
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className="block w-full rounded px-3 py-2 text-left text-sm data-[focus]:bg-gray-100"
              >
                {item.label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default Dropdown