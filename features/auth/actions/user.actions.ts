"use server";

import { signInFormSchema, signupFormSchema } from "../../../lib/validators";
import { signIn, signOut } from "@/auth";
import { hashPassword } from "@/lib/encrypt";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import prisma from "@/lib/prisma";
import { formatError } from "@/lib/utils";

// Sign in the user with credentials
export async function signInUser(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

// Sign user out
export async function signOutUser(formData: FormData) {
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    // Extract form data with proper type handling
    const phone = formData.get("phone");
    const dob = formData.get("dob");

    const formDataObj = {
      name: formData.get("name"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: phone ? phone.toString() : "",
      dob: dob ? dob.toString() : "",
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      acceptTerms: formData.has("acceptTerms"),
      acceptMarketing: formData.has("acceptMarketing"),
    };

    const user = signupFormSchema.parse(formDataObj);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return { success: false, message: "User with this email already exists" };
    }

    const plainPassword = user.password;
    const hashedPassword = await hashPassword(user.password);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        roles: {
          connect: { name: "ROLE_USER" },
        },
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
