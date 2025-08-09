"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Shield, ShieldOff, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { UserType } from "@/features/users/schema/user.schemas";
import { updateUser, deleteUser } from "@/features/users/actions/users.actions";
import { DeleteUserDialog } from "./delete-user-dialog";
import { canDeleteUser, isAdmin } from "@/features/users/utils/user.utils";

interface UserActionsProps {
  user: UserType;
}

export function UserActions({ user }: UserActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error("Update user error:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setShowDeleteDialog(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user. Please try again.");
    },
  });

  const handleVerifyEmail = () => {
    updateUserMutation.mutate({
      id: user.id,
      data: { email_verified: new Date() },
    });
  };

  const handleUnverifyEmail = () => {
    updateUserMutation.mutate({
      id: user.id,
      data: { email_verified: null },
    });
  };

  const handleDeleteUser = () => {
    deleteUserMutation.mutate({ id: user.id });
  };

  const userIsAdmin = isAdmin(user);
  const canDelete = canDeleteUser(user);

  return (
    <>
      <DropdownMenuItem asChild>
        <Link href={`/admin/users/${user.id}`}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Link>
      </DropdownMenuItem>

      {!user.email_verified && (
        <DropdownMenuItem onClick={handleVerifyEmail}>
          <MailCheck className="mr-2 h-4 w-4" />
          Verify Email
        </DropdownMenuItem>
      )}

      {user.email_verified && (
        <DropdownMenuItem onClick={handleUnverifyEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Unverify Email
        </DropdownMenuItem>
      )}

      <DropdownMenuSeparator />

      {canDelete && (
        <DropdownMenuItem
          onClick={() => setShowDeleteDialog(true)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      )}

      {!canDelete && (
        <DropdownMenuItem disabled className="text-muted-foreground">
          <Trash2 className="mr-2 h-4 w-4" />
          Cannot Delete
        </DropdownMenuItem>
      )}

      <DeleteUserDialog
        user={user}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteUser}
        isLoading={deleteUserMutation.isPending}
      />
    </>
  );
}
