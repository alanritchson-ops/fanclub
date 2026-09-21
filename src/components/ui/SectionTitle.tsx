export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      className={`display text-balance text-[clamp(2.6rem,12vw,5.75rem)] ${className}`}
    >
      {children}
    </Tag>
  );
}
