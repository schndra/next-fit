"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserType } from "@/features/users/schema/user.schemas";
import {
  getFullName,
  getUserActivitySummary,
} from "@/features/users/utils/user.utils";
import { Trash2, RefreshCw } from "lucide-react";

interface DeleteUserDialogProps {
  user: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteUserDialogProps) {
  const fullName = getFullName(user);
  const activitySummary = getUserActivitySummary(user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete User
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p>
                Are you sure you want to delete user <strong>{fullName}</strong>
                ?
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Email: {user.email}</p>
                <p>Activity: {activitySummary}</p>
                <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <p className="text-destructive font-medium">
                This action cannot be undone. This will permanently delete the
                user account and all associated personal data.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
