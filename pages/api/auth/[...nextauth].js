import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import db from "../../../utils/db"
import User from "../../../models/user"

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.isAdmin = token.isAdmin
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect()
        const user = await User.findOne({ email: credentials.email })

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          }
        }

        throw new Error("Invalid email or password")
      },
    }),
  ],
}

export default NextAuth(authOptions)