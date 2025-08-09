import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { compare } from "bcrypt";

// export const config: NextAuthConfig =
// {
//   pages: {
//     signIn: "/sign-in",
//     error: "/sign-in",
//     // signOut: "/signout",
//     // verifyRequest: "/auth/verify-request",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         email: { type: "email" },
//         password: { type: "password" },
//       },
//       authorize: async (credentials) => {
//         if (credentials === null) return null;

//         // logic to salt and hash password
//         // const pwHash = saltAndHashPassword(credentials.password);

//         // logic to verify if the user exists
//         // user = await getUserFromDb(credentials.email, pwHash);
//         const user = await prisma.user.findUnique({
//           where: {
//             email: credentials.email as string,
//           },
//           include: {
//             roles: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         });

//         // check if user exists and if the password matches
//         if (user && user.password) {
//           const isMatch = await compare(
//             credentials.password as string,
//             user.password
//           );

//           // if password is correct
//           if (isMatch) {
//             return {
//               id: user.id,
//               name: user.name,
//               first_name: user.first_name,
//               last_name: user.last_name,
//               email: user.email,
//               roles: user.roles,
//             };
//           }
//         }

//         // if (!user) {
//         //   // No user found, so this is their first attempt to login
//         //   // Optionally, this is also the place you could do a user registration
//         //   throw new Error("Invalid credentials.");
//         // }

//         // if no user and password does not match return null
//         return null;
//       },
//     }),
//   ],

//   callbacks: {
//     async session({ session, user, trigger, token }: any) {
//       // Set the user ID from the token
//       session.user.id = token.sub;

//       // if there is an update set the user name
//       if (trigger === "update" && user) {
//         session.user.name = user.name;
//         // session.user.roles = user.roles;
//       }

//       return session;
//     },
//   },
// };

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
    // signOut: "/signout",
    // verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (credentials === null) return null;

        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password);

        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash);
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );

          // if password is correct
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              roles: user.roles,
            };
          }
        }

        // if (!user) {
        //   // No user found, so this is their first attempt to login
        //   // Optionally, this is also the place you could do a user registration
        //   throw new Error("Invalid credentials.");
        // }

        // if no user and password does not match return null
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;

      // if there is an update set the user name
      if (trigger === "update" && user) {
        session.user.name = user.name;
        // session.user.roles = user.roles;
      }

      return session;
    },
  },
});
