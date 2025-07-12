const sanitizeUser = ({
  _id,
  fullname,
  username,
  email,
  role,
  createdAt,
  updatedAt,
  avatarUrl,
  isEmailVerified,
  bio = "",
  location = "",
  socialLinks = {},
}) => {
  if (!_id) return null;

  return {
    _id,
    fullname,
    username,
    email,
    role,
    createdAt,
    updatedAt,
    avatarUrl,
    isEmailVerified,
    bio,
    location,
    socialLinks: {
      twitter: socialLinks.twitter || "",
      linkedin: socialLinks.linkedin || "",
      github: socialLinks.github || "",
      instagram: socialLinks.instagram || "",
      website: socialLinks.website || "",
    },
  };
};

export { sanitizeUser };
