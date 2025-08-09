import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  providers: [],

  callbacks: {
    // async session({ session, user, trigger, token }: any) {
    //   // Set the user ID from the token
    //   session.user.id = token.sub;
    //   // if there is an update set the user name
    //   if (trigger === "update" && user) {
    //     session.user.name = user.name;
    //     // session.user.roles = user.roles;
    //   }
    //   return session;
    // },
  },
};
