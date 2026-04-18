"use client";

// Aggiunto ? a label e inserito rows per le textarea
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label?: string; 
  as?: 'input' | 'select' | 'textarea';
  error?: boolean;
  rows?: number; 
}

export default function Input({ label, as = 'input', error, className = "", ...props }: InputProps) {
  const Component = as as any;
  const baseClass = "admin-input w-full transition-all duration-200";
  const errorClass = error ? "border-rose-500 bg-rose-50/30" : "";

  return (
    <div className="space-y-2 w-full">
      {/* Il rendering condizionale evita errori se label manca */}
      {label && (
        <label className={`admin-label ${error ? 'text-rose-600' : ''}`}>
          {label}
        </label>
      )}
      <Component 
        className={`${baseClass} ${errorClass} ${className}`}
        {...props}
      />
    </div>
  );
}