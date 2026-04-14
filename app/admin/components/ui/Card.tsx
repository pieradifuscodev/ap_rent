export default function Card({ children, title, className = "" }: { children: React.ReactNode, title?: string, className?: string }) {
  return (
    <div className={`bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 border-b border-slate-50 pb-6 mb-8">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}