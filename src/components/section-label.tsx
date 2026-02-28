interface SectionLabelProps {
  readonly code: string;
  readonly label: string;
}

export function SectionLabel({ code, label }: SectionLabelProps) {
  return (
    <div className="mb-4 inline-block border-b border-waste-border pb-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-waste-dim">
      <span className="text-waste-amber">{code}</span> // {label}
    </div>
  );
}
