import Image from "next/image";
import { GitGudSVG } from "@/components/event-svgs/GitGudSVG";
import type { EventBackground } from "@/data/events";

interface EventVisualProps {
  bg: EventBackground;
}

export function EventVisual({ bg }: EventVisualProps) {
  if (bg === "gitgud") return <GitGudSVG />;
  if (bg === "fossforge")
    return (
      <Image
        src="/foss-forge-2025.jpg"
        alt="FOSS Forge"
        fill
        className="object-cover"
      />
    );
  return null;
}
