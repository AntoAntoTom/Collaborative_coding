// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";
// import type { NextAuthOptions } from "next-auth";
// import credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import { JWT } from "next-auth/jwt";

// export const authOptions: NextAuthOptions = {
//   providers: [
    
//     credentials({
//       name: "Credentials",
//       id: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDB();
//         const user = await User.findOne({
//           email: credentials?.email,
//         }).select("+password +role");
//         console.log("User found in ----------------------------------------------------------------------------DB:", user); 
//         console.log("User Found:", user);

//         if (!user) throw new Error("Wrong Email");

//         const passwordMatch = await bcrypt.compare(
//           credentials!.password,
//           user.password
//         );
// console.log(user.role)
//         if (!passwordMatch) throw new Error("Wrong Password");
//         return { id: user.id, email: user.email, role: user.role };

//       },
//     }),
//   ],
//   callbacks:{
//     async jwt({ token, user }: { token: JWT; user?: any }) {
//       if (user) {
//         token.role = user.role; // Store role in JWT
//       }
//       console.log("JWT Token:", token);
//       return token;
//     },
//     async session({ session, token }: { session: any; token: JWT }) {
//       if (session.user) {
//         session.user.role = token.role; // Ensure role is assigned
//       }
//       console.log("Updated Session:", session);

//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
// };
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb"; // Ensure DB connection
import User from "@/models/User"; // Import your User model if using MongoDB

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error("No user found");
        }

        return {id:user.id, email:user.email, name: user.name, role: user.role};
      },
    }),
  ],

  callbacks: {
    // Store role in JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;  // Store role from user in JWT token
      }
      return token;
    },

    // Pass the role from JWT to the session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // Ensure role is assigned in session
      }
      return session;
    },
  },

  pages: {
    // signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env.local
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
