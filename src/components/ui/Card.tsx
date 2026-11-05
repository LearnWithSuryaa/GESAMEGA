import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
