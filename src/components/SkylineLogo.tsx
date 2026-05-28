interface SkylineLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function SkylineLogo({ className = "", showWordmark = true }: SkylineLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 48 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-auto text-foreground"
        aria-hidden="true"
      >
        {/* Speed arcs — the "C" of Car */}
        <path
          d="M4 16 C 4 8, 12 4, 20 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M2 20 C 2 10, 12 2, 24 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Car silhouette */}
        <path
          d="M10 22 L14 16 C15 14.5, 16.5 14, 18 14 L34 14 C36 14, 38 14.8, 40 16 L44 18 L44 22 L40 22 C40 23.7, 38.7 25, 37 25 C35.3 25, 34 23.7, 34 22 L18 22 C18 23.7, 16.7 25, 15 25 C13.3 25, 12 23.7, 12 22 L10 22 Z"
          fill="currentColor"
        />
        <circle cx="15" cy="22" r="2" fill="currentColor" stroke="#0A0A0A" strokeWidth="0.8" />
        <circle cx="37" cy="22" r="2" fill="currentColor" stroke="#0A0A0A" strokeWidth="0.8" />
      </svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold text-base tracking-wider-2 uppercase text-foreground">
            Skyline
          </span>
          <span className="font-display text-[10px] tracking-wider-2 uppercase text-silver">
            Car Rental
          </span>
        </div>
      )}
    </div>
  );
}
