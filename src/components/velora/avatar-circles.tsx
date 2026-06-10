import { cn } from "@/lib/utils";

interface AvatarCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Names rendered as initials */
  people: string[];
  /** "+N" badge count */
  extra?: number;
}

const gradients = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-purple-600",
];

export function AvatarCircles({
  people,
  extra,
  className,
  ...props
}: AvatarCirclesProps) {
  return (
    <div
      data-slot="avatar-circles"
      className={cn("flex -space-x-3", className)}
      {...props}
    >
      {people.map((name, i) => {
        const initials = name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("");
        return (
          <span
            key={name}
            title={name}
            className={cn(
              "flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ring-2 ring-background",
              gradients[i % gradients.length]
            )}
          >
            {initials}
          </span>
        );
      })}
      {extra && (
        <span className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-semibold ring-2 ring-background">
          +{extra >= 1000 ? `${Math.floor(extra / 1000)}k` : extra}
        </span>
      )}
    </div>
  );
}
