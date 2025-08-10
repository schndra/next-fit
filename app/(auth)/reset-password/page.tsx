import type React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { validateResetToken } from "@/features/auth/actions/password-reset.actions";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const { token } = await props.searchParams;
  const session = await auth();

  // If user is already signed in, redirect to home
  if (session) {
    return redirect("/");
  }

  // If no token provided, redirect to forgot password
  if (!token) {
    return redirect("/auth/forgot-password");
  }

  // Validate the token
  const validation = await validateResetToken(token);

  if (!validation.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              NextFit
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-red-600">{validation.message}</p>
                <Link
                  href="/auth/forgot-password"
                  className="inline-block text-blue-600 hover:text-blue-500 font-medium"
                >
                  Request a new reset link
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            NextFit
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={token} email={validation.email || ""} />
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
