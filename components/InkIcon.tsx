import type { SVGProps } from "react";

export type InkIconName =
  | "search"
  | "close"
  | "menu"
  | "arrow"
  | "play"
  | "book"
  | "world"
  | "collection"
  | "sound"
  | "home"
  | "path"
  | "plus";

type InkIconProps = SVGProps<SVGSVGElement> & { name: InkIconName };

export default function InkIcon({ name, ...props }: InkIconProps) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.55, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props} {...common}>
      {name === "search" && <><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.1 4.1" /></>}
      {name === "close" && <><path d="m6 6 12 12M18 6 6 18" /></>}
      {name === "menu" && <><path d="M4 7h16M4 12h16M4 17h10" /></>}
      {name === "arrow" && <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>}
      {name === "play" && <path fill="currentColor" stroke="none" d="m9 6 9 6-9 6V6Z" />}
      {name === "book" && <><path d="M12 6.2A7.5 7.5 0 0 0 4 5v13.2a7.5 7.5 0 0 1 8 1.1m0-13.1A7.5 7.5 0 0 1 20 5v13.2a7.5 7.5 0 0 0-8 1.1" /><path d="M12 6.2v13.1" /></>}
      {name === "world" && <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.2 2.35 3.25 5.18 3.25 8.5S14.2 18.15 12 20.5C9.8 18.15 8.75 15.32 8.75 12S9.8 5.85 12 3.5Z" /></>}
      {name === "collection" && <><path d="M5 7.5h14v11H5z" /><path d="M8 7.5V5h8v2.5M9 12h6" /></>}
      {name === "sound" && <><path d="M5 10v4M9 7v10M13 5v14M17 8v8M21 10v4" /></>}
      {name === "home" && <><path d="m4 10 8-6 8 6v9H4z" /><path d="M9 19v-5h6v5" /></>}
      {name === "path" && <><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /><path d="M9 8.5c3.5 0 1.8 6.8 5.5 6.8" /></>}
      {name === "plus" && <><path d="M12 5v14M5 12h14" /></>}
    </svg>
  );
}
