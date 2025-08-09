import { UserType } from "@/features/users/schema/user.schemas";

// Helper function to format date
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// Helper function to format short date
export const formatShortDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
};

// Helper function to get full name
export const getFullName = (user: UserType): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.name;
};

// Helper function to get user initials
export const getUserInitials = (user: UserType): string => {
  const fullName = getFullName(user);
  const names = fullName.split(" ");
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return fullName.slice(0, 2).toUpperCase();
};

// Helper function to get verification status badge props
export const getVerificationStatusBadge = (emailVerified: Date | null) => {
  if (emailVerified) {
    return {
      label: "Verified",
      className:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-700 bg-green-100",
    };
  }
  return {
    label: "Unverified",
    className:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-700 bg-yellow-100",
  };
};

// Helper function to get user role names
export const getUserRoleNames = (user: UserType): string => {
  if (!user.roles || user.roles.length === 0) {
    return "No roles";
  }
  return user.roles.map((role) => role.name).join(", ");
};

// Helper function to get primary role
export const getPrimaryRole = (user: UserType): string => {
  if (!user.roles || user.roles.length === 0) {
    return "User";
  }
  return user.roles[0].name;
};

// Helper function to check if user has specific role
export const hasRole = (user: UserType, roleName: string): boolean => {
  return user.roles.some(
    (role) => role.name.toLowerCase() === roleName.toLowerCase()
  );
};

// Helper function to check if user is admin
export const isAdmin = (user: UserType): boolean => {
  return hasRole(user, "admin") || hasRole(user, "administrator");
};

// Helper function to format user activity summary
export const getUserActivitySummary = (user: UserType): string => {
  const activities = [];

  if (user._count.orders > 0) {
    activities.push(
      `${user._count.orders} order${user._count.orders > 1 ? "s" : ""}`
    );
  }

  if (user._count.products > 0) {
    activities.push(
      `${user._count.products} product${user._count.products > 1 ? "s" : ""}`
    );
  }

  if (user._count.reviews > 0) {
    activities.push(
      `${user._count.reviews} review${user._count.reviews > 1 ? "s" : ""}`
    );
  }

  if (activities.length === 0) {
    return "No activity";
  }

  return activities.join(", ");
};

// Helper function to calculate user join duration
export const getUserJoinDuration = (user: UserType): string => {
  const now = new Date();
  const joinDate = new Date(user.created_at);
  const diffTime = Math.abs(now.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

// Helper function to get user status color
export const getUserStatusColor = (user: UserType): string => {
  if (isAdmin(user)) {
    return "text-purple-600";
  }
  if (user.email_verified) {
    return "text-green-600";
  }
  return "text-yellow-600";
};

// Helper function to check if user can be deleted
export const canDeleteUser = (user: UserType): boolean => {
  // Users with orders, products, or reviews cannot be deleted
  return (
    user._count.orders === 0 &&
    user._count.products === 0 &&
    user._count.reviews === 0
  );
};

// Helper function to get user statistics summary
export const getUserStatsSummary = (
  user: UserType
): Array<{ label: string; value: number; color?: string }> => {
  return [
    {
      label: "Orders",
      value: user._count.orders,
      color: user._count.orders > 0 ? "text-blue-600" : "text-gray-400",
    },
    {
      label: "Products",
      value: user._count.products,
      color: user._count.products > 0 ? "text-green-600" : "text-gray-400",
    },
    {
      label: "Reviews",
      value: user._count.reviews,
      color: user._count.reviews > 0 ? "text-yellow-600" : "text-gray-400",
    },
    {
      label: "Addresses",
      value: user._count.addresses,
      color: user._count.addresses > 0 ? "text-purple-600" : "text-gray-400",
    },
  ];
};
