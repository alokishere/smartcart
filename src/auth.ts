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
        let user;
        try {
          user = await User.findOne({ email }).select("+password");
          console.log("[AUTHORIZE] User found:", !!user);
        } catch (e) {
          console.error("[AUTHORIZE] User.findOne failed:", e);
          throw e;
        }
        if (!user) {
          throw new Error("User not found");
        }
        let ismatch;
        try {
          ismatch = await bcrypt.compare(password, user.password);
          console.log("[AUTHORIZE] Password match:", ismatch);
        } catch (e) {
          console.error("[AUTHORIZE] bcrypt.compare failed:", e);
          throw e;
        }
        if (!ismatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
    Google({
      clientId:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({user, account}){
      console.log("[SIGNIN CALLBACK] Provider:", account?.provider, "Email:", user?.email);
      if(account?.provider == "google"){
        try {
          await dbConnect();
          let existingUser= await User.findOne({email:user.email});
          if(!existingUser){
           existingUser = await User.create({
              name:user.name,
              email:user.email,
              image:user.image || ""
            })
          }
          user.id=existingUser._id.toString();
          user.role=existingUser.role;
          user.mobile=existingUser.mobile;
        } catch (e) {
          console.error("[SIGNIN CALLBACK] Error:", e);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.mobile = (user as any).mobile;
      }
      if (trigger === "update" && session) {
        if (session.role) {
          token.role = session.role;
        }
        if (session.mobile) {
          token.mobile = session.mobile;
        }
        if (session.user) {
          if (session.user.role) {
            token.role = session.user.role;
          }
          if (session.user.mobile) {
            token.mobile = session.user.mobile;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.mobile = token.mobile as string;
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
