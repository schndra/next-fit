import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function checkAdminAuth() {
  const session = await auth();

  if (!session) {
    console.log("No session found, redirecting to sign-in");
    redirect("/sign-in");
  }

  console.log("USER_SESSION", session);

  // Check if user has admin role
  const hasAdminRole = (session.user as any)?.roles?.some(
    (role: any) => role.name === "ROLE_ADMIN" || role.name === "Admin"
  );

  if (!hasAdminRole) {
    console.log("User does not have admin role, redirecting to home");
    redirect("/");
  }

  return session;
}
