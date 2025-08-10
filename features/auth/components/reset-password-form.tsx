"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { resetPassword } from "@/features/auth/actions/password-reset.actions";
import { useFormStatus } from "react-dom";
import { useState } from "react";

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

const ResetPasswordForm = ({ token, email }: ResetPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, action] = useActionState(resetPassword, {
    success: false,
    message: "",
  });

  const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" disabled={pending}>
        {pending ? "Resetting..." : "Reset Password"}
      </Button>
    );
  };

  // If password was successfully reset, show success message
  if (data.success) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-600">
            Password Reset Successful!
          </h3>
          <p className="text-sm text-gray-600 mt-2">{data.message}</p>
        </div>
        <Link href="/sign-in">
          <Button className="w-full">Sign In with New Password</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <form action={action} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="pl-10 pr-10"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="pl-10 pr-10"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p>Password requirements:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-500">
            <li>At least 6 characters long</li>
            <li>Passwords must match</li>
          </ul>
        </div>

        <SubmitButton />

        {data && !data.success && (
          <div className="text-center text-destructive text-sm">
            {data.message}
          </div>
        )}
      </form>
    </>
  );
};

export default ResetPasswordForm;
