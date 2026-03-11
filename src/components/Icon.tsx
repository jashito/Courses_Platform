import Image from "next/image";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const iconPath = "/assets/icons";

export function Icon({ name, size = 24, className = "" }: IconProps) {
  return (
    <Image
      src={`${iconPath}/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  );
}

export const sidebarIcons = {
  home: "sidebar/home",
  courses: "sidebar/courses",
  blog: "sidebar/blog",
  contact: "sidebar/contact",
  pricing: "sidebar/pricing",
  profile: "sidebar/profile",
} as const;

export const featureIcons = {
  expert: "features/expert",
  pace: "features/pace",
  certificate: "features/certificate",
} as const;

export const uiIcons = {
  check: "ui/check",
  arrowRight: "ui/arrow-right",
  arrowLeft: "ui/arrow-left",
  menu: "ui/menu",
  close: "ui/close",
  search: "ui/search",
  edit: "ui/edit",
  delete: "ui/delete",
  download: "ui/download",
  upload: "ui/upload",
  user: "ui/user",
  logout: "ui/logout",
  settings: "ui/settings",
  theme: "ui/theme",
} as const;
