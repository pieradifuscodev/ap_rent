"use client";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  loading?: boolean;
}

export default function Table({ headers, children, loading }: TableProps) {
  return (
    <div className="w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/30">
              {headers.map((header, i) => (
                <th 
                  key={i} 
                  className="px-8 py-6 text-left border-b border-slate-100 first:pl-10 last:pr-10"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="p-24 text-center">
                   <div className="inline-block w-8 h-8 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                </td>
              </tr>
            ) : children}
          </tbody>
        </table>
      </div>
    </div>
  );
}