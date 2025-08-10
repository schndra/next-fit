"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import crypto from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

/**
 * Generate a password reset token and save it to the database
 */
export async function generatePasswordResetToken(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return {
        success: false,
        message: "Email is required.",
      };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message:
          "If an account with that email exists, we've sent password reset instructions.",
      };
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set expiration to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires_at: expiresAt,
      },
    });

    // For now, log the reset token to a file instead of sending email
    const resetLink = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;
    const logMessage = `
Password Reset Request
Date: ${new Date().toISOString()}
Email: ${email}
Reset Token: ${resetToken}
Reset Link: ${resetLink}
Expires At: ${expiresAt.toISOString()}
----------------------------------------
`;

    // Write to logs directory
    const logsDir = path.join(process.cwd(), "logs");
    const logFile = path.join(logsDir, "password-reset-tokens.txt");

    try {
      await writeFile(logFile, logMessage, { flag: "a" });
    } catch (error) {
      // Create logs directory if it doesn't exist
      try {
        await writeFile(logFile, logMessage, { flag: "w" });
      } catch (createError) {
        console.error("Could not create log file:", createError);
      }
    }

    console.log("Password reset token generated:", resetLink);

    return {
      success: true,
      message:
        "If an account with that email exists, we've sent password reset instructions.",
    };
  } catch (error) {
    console.error("Error generating password reset token:", error);
    return {
      success: false,
      message: "An error occurred. Please try again.",
    };
  }
}

/**
 * Validate a password reset token
 */
export async function validateResetToken(token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expires_at: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return {
        valid: false,
        message: "Invalid or expired reset token.",
      };
    }

    return {
      valid: true,
      userId: user.id,
      email: user.email,
    };
  } catch (error) {
    console.error("Error validating reset token:", error);
    return {
      valid: false,
      message: "An error occurred. Please try again.",
    };
  }
}

/**
 * Reset user password with a valid token
 */
export async function resetPassword(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const token = formData.get("token") as string;
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token || !newPassword || !confirmPassword) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match.",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long.",
      };
    }

    // First validate the token
    const validation = await validateResetToken(token);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message || "Invalid or expired reset token.",
      };
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 12);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: validation.userId },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires_at: null,
      },
    });

    // Log the password reset
    const logMessage = `
Password Reset Completed
Date: ${new Date().toISOString()}
Email: ${validation.email}
Token Used: ${token}
----------------------------------------
`;

    const logsDir = path.join(process.cwd(), "logs");
    const logFile = path.join(logsDir, "password-reset-tokens.txt");

    try {
      await writeFile(logFile, logMessage, { flag: "a" });
    } catch (error) {
      console.log("Could not write to log file:", error);
    }

    return {
      success: true,
      message:
        "Password has been reset successfully. You can now sign in with your new password.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "An error occurred. Please try again.",
    };
  }
}
