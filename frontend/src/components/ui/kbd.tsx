import { cn } from "@/lib/utils"

type KbdSize = 'sm' | 'md' | 'lg'

function Kbd({ className, size = 'md', ...props }: React.ComponentProps<"kbd"> & { size?: KbdSize }) {
  const sizeClasses: Record<KbdSize, string> = {
    sm: "h-4 min-w-4 px-1 text-2xs",
    md: "h-5 min-w-5 px-1 text-xs",
    lg: "h-6 min-w-6 px-1.5 text-sm",
  }

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex w-fit items-center justify-center gap-1 rounded-sm bg-muted font-sans font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
