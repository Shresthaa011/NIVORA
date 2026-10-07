import React from 'react';

interface MetadataBadgeProps {
  label: string;
  variant?: 'cyan' | 'teal' | 'sky' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate';
  size?: 'sm' | 'md';
}

export const MetadataBadge: React.FC<MetadataBadgeProps> = ({
  label,
  variant = 'cyan',
  size = 'sm'
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
    teal: 'bg-teal-950/80 text-teal-300 border-teal-800/80',
    sky: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
    indigo: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-mono font-medium',
    md: 'text-xs px-3 py-1 font-mono font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded border tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  );
};
