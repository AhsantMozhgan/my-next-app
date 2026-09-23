import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import db from "../../../utils/db"
import User from "../../../models/user"

export default NextAuth({
  providers: [
    CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
      async authorize(credentials) {
        await db.connect()

        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error("No user found with that email")
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id
      if (user?.isAdmin) token.isAdmin = user.isAdmin
      return token
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin
      return session
    },
  },
})
