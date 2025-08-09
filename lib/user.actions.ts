"use server";

import { signInFormSchema } from "./validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import z, { success } from "zod";

// Sign in the user with credentials
export async function signInUser(
  credentials: z.infer<typeof signInFormSchema>
) {
  const result = signInFormSchema.safeParse(credentials);
  if (!result.success) {
    return { success: false, error: "Invalid credentials" };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
    });
    return { success: true, message: "Successfully signed in" };
  } catch (error) {
    if (isRedirectError(error)) {
      //   return { redirect: error.destination };
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

// Sign user out
export async function signOutUser() {
  try {
    await signOut();
    return { success: true, message: "Successfully signed out" };
  } catch (error) {
    return { success: false, message: "Failed to sign out" };
  }
}
