import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Utility to read password reset tokens from the log file
 * This is for development/testing purposes only
 */
export function getPasswordResetTokens(): Array<{
  email: string;
  token: string;
  timestamp: string;
  expiresAt: string;
}> {
  const logPath = join(process.cwd(), "logs", "password-reset-tokens.txt");

  if (!existsSync(logPath)) {
    return [];
  }

  try {
    const content = readFileSync(logPath, "utf-8");
    const lines = content
      .trim()
      .split("\n")
      .filter((line) => line.length > 0);

    return lines
      .map((line) => {
        const [timestamp, email, token, expiresAt] = line.split(" | ");
        return {
          email,
          token,
          timestamp,
          expiresAt,
        };
      })
      .reverse(); // Most recent first
  } catch (error) {
    console.error("Error reading password reset tokens log:", error);
    return [];
  }
}

/**
 * Get the most recent token for a specific email
 */
export function getLatestTokenForEmail(email: string): string | null {
  const tokens = getPasswordResetTokens();
  const userToken = tokens.find((t) => t.email === email);

  if (!userToken) {
    return null;
  }

  // Check if token is still valid (not expired)
  const now = new Date();
  const expiresAt = new Date(userToken.expiresAt);

  if (now > expiresAt) {
    return null; // Token expired
  }

  return userToken.token;
}
