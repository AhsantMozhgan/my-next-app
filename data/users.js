import bcrypt from "bcryptjs"

const users = [
  {
    name: "Mozhgan",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: true,
  },
  {
    name: "User Two",
    email: "user@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: false,
  },
]

export default users