import InkIcon, { type InkIconName } from "@/components/InkIcon";

const items: Array<{ label: string; href: string; icon: InkIconName }> = [
  { label: "خانه", href: "#top", icon: "home" },
  { label: "کشف", href: "#discover", icon: "search" },
  { label: "صدا", href: "#audio", icon: "sound" },
  { label: "مسیر", href: "#journey", icon: "path" },
];

export default function MobileDock() {
  return (
    <nav className="mobile-dock" aria-label="ناوبری موبایل">
      {items.map((item) => (
        <a key={item.href} href={item.href}><InkIcon name={item.icon} width={17} height={17} /><span>{item.label}</span></a>
      ))}
    </nav>
  );
}
