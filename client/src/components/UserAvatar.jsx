// =============================================
// components/UserAvatar.jsx — Reusable Avatar
// =============================================
// ONE component used everywhere a photo/avatar is needed
// Automatically shows photo if available, initials if not
// Used in: Navbar, Sidebar, MessageCard, MeetingCard etc.

const UserAvatar = ({
  name = "",           // user's name (for initials fallback)
  photo = "",          // photo URL
  size = "md",         // "xs", "sm", "md", "lg", "xl"
  role = "student",    // "student" or "faculty" (for color)
  shape = "rounded",   // "rounded" = rounded-xl, "circle" = rounded-full
  className = "",      // extra classes
  onClick = null,      // if provided, avatar becomes clickable
}) => {

  // Size classes
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-3xl",
  };

  // Color based on role
  const colors = {
    student: "bg-blue-600",
    faculty: "bg-emerald-600",
    admin:   "bg-purple-600",
  };

  // Shape
  const shapes = {
    rounded: "rounded-xl",
    circle:  "rounded-full",
  };

  const sizeClass  = sizes[size]        || sizes.md;
  const colorClass = colors[role]       || colors.student;
  const shapeClass = shapes[shape]      || shapes.rounded;
  const cursorClass = onClick ? "cursor-pointer" : "";

  // Get initials — first letter of first and last name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        onClick={onClick}
        className={`${sizeClass} ${shapeClass} ${cursorClass} object-cover border-2 border-white/20 flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${sizeClass} ${shapeClass} ${colorClass} ${cursorClass} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
