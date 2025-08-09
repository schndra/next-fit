import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/components/providers/react-query-provider";
import { getUserProfile } from "@/features/profile/actions/profile.actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProfileClient } from "@/features/profile/components/profile-client";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { PasswordUpdateForm } from "@/features/profile/components/password-update-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/profile");
  }

  const queryClient = getQueryClient();
  const userId = session.user.id;

  // Prefetch profile data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClient>
        <div className="space-y-8">
          <ProfileForm />
          <PasswordUpdateForm />
        </div>
      </ProfileClient>
    </HydrationBoundary>
  );
}
