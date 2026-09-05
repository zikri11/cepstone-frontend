import { cn } from "@/lib/utils";

interface LogoCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  /** One entry per logo — pass SVGs, `img` elements or plain wordmarks */
  logos: { name: string; logo: React.ReactNode }[];
  /** Show logos muted until hovered */
  dimUntilHover?: boolean;
}

/**
 * Customer or integration logos on a responsive grid, muted until hovered so
 * they read as texture rather than competing with the headline.
 */
export function LogoCloud({
  logos,
  dimUntilHover = true,
  className,
  ...props
}: LogoCloudProps) {
  return (
    <div
      {...props}
      data-slot="logo-cloud"
      className={cn(
        "grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5",
        className
      )}
    >
      {logos.map(({ name, logo }) => (
        <div
          key={name}
          title={name}
          className={cn(
            "flex h-8 items-center justify-center text-muted-foreground transition-all duration-300 motion-reduce:transition-none",
            dimUntilHover &&
              "opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:text-foreground"
          )}
        >
          {logo}
        </div>
      ))}
    </div>
  );
}
