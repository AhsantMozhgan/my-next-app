// // import bcrypt from "bcryptjs"
// import db from "../../utils/db"
// import userItem from "../../data/users.json"
// import User from "../../models/user"

// async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" })
//   }

//   try {
//     await db.connect()

//     const existing = await User.countDocuments()
//     if (existing > 0) {
//       return res.status(200).json({ message: "Users already seeded" })
//     }

//     // hash passwords before seeding
//     const hashedUsers = await Promise.all(
//       userItem.map(async (u) => ({
//         ...u,
//         password: await bcrypt.hash(u.password, 10),
//       }))
//     )

//     await User.insertMany(userItem)
//     res.send({message: 'user added'})
//     res.status(201).json({ message: `Seeded ${hashedUsers.length} users` })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: err.message })
//   }
// }

// export default handler


import db from "../../utils/db"
import userItem from "../../data/users.json"
import User from "../../models/user"

async function handler(req, res) {
  // try {
    await db.connect()

    // const existing = await User.countDocuments()
    // if (existing > 0) {
    //   return res.status(200).json({ message: "Users already seeded" })
    // }

    await User.insertMany(userItem)
    res.send({ message: "user added" })
  // } catch (err) {
  //   console.error(err)
  //   res.status(500).json({ message: err.message })
  // }
}

export default handler
