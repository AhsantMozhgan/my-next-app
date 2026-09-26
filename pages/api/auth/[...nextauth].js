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
      if (user?._id) token._id = user._id
      if (user?.isAdmin) token.isAdmin = user.isAdmin   // must be here
      return token
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin   // must be here
      return session
    },
  },
  providers: [
    CredentialsProvider({

      async authorize(credentials) {
        await db.connect()
        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error("No user found")

        const ok = await bcrypt.compare(credentials.password, user.password)
        if (!ok) throw new Error("Incorrect password")

        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,   // must be here
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)