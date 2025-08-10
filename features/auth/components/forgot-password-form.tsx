"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generatePasswordResetToken } from "@/features/auth/actions/password-reset.actions";
import { useFormStatus } from "react-dom";

const ForgotPasswordForm = () => {
  const [data, action] = useActionState(generatePasswordResetToken, {
    success: false,
    message: "",
  });

  const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send Reset Instructions"}
      </Button>
    );
  };

  return (
    <>
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              className="pl-10"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <SubmitButton />

        {data && (
          <div
            className={`text-center text-sm ${
              data.success ? "text-green-600" : "text-destructive"
            }`}
          >
            {data.message}
          </div>
        )}
      </form>

      <div className="mt-6">
        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
