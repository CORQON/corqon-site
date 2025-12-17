interface DottedDividerProps {
  className?: string;
}

export default function DottedDivider({ className = '' }: DottedDividerProps) {
  return (
    <div 
      className={`h-px w-full dotted-divider-h ${className}`}
    />
  );
}

