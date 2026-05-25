import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        await dbConnect();
        const email = credentials?.email;
        const password = credentials?.password as string;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({user,account}){
      if(account?.provider == "google"){
        await dbConnect();
        let existingUser= await User.findOne({email:user.email});
        if(!existingUser){
         existingUser = await User.create({
            name:user.name,
            email:user.email,
            image:user.image || ""
          })
          user.id=existingUser._id.toString();
          user.role=existingUser.role;
        }
        else{
          user.id=existingUser._id.toString();
          user.role=existingUser.role;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
});
