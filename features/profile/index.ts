// Components
export { ProfileClient } from "./components/profile-client";
export { ProfileForm } from "./components/profile-form";
export { PasswordUpdateForm } from "./components/password-update-form";

// Hooks
export {
  useUserProfile,
  useUpdateProfile,
  useUpdatePassword,
  useUserRole,
} from "./hooks/use-profile";

// Actions
export {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  checkUserRole,
} from "./actions/profile.actions";

// Schema
export {
  profileUpdateSchema,
  passwordUpdateSchema,
  type ProfileUpdateData,
  type PasswordUpdateData,
} from "./schema";
