import { type SVGProps } from "react";

export function LightningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      className="h-6 w-6 text-purple-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 10V3L4 14h7v7l9-11h-7z" 
      />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      className="h-6 w-6 text-purple-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
      />
    </svg>
  );
}

export function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      className="h-6 w-6 text-purple-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
      />
    </svg>
  );
}