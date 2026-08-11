export function FloralAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 110"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* 茎 */}
      <path
        d="M70 104 C66 78 58 62 30 40"
        stroke="#8a7a68"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M70 104 C72 74 82 54 112 22"
        stroke="#8a7a68"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M70 104 C69 80 69 60 69 34"
        stroke="#8a7a68"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ユーカリの葉（セージグリーン） */}
      <g stroke="#5f6e50" strokeWidth="1">
        <ellipse cx="34" cy="36" rx="8.5" ry="6" fill="#8fa080" transform="rotate(-28 34 36)" />
        <ellipse cx="22" cy="44" rx="7" ry="5" fill="#a3b393" transform="rotate(-6 22 44)" />
        <ellipse cx="44" cy="24" rx="6.5" ry="4.8" fill="#a3b393" transform="rotate(-46 44 24)" />
        <ellipse cx="108" cy="26" rx="9" ry="6.5" fill="#8fa080" transform="rotate(24 108 26)" />
        <ellipse cx="118" cy="16" rx="7" ry="5" fill="#a3b393" transform="rotate(10 118 16)" />
        <ellipse cx="96" cy="38" rx="6" ry="4.5" fill="#a3b393" transform="rotate(38 96 38)" />
      </g>

      {/* かすみ草 */}
      <g fill="#fdf8f2" stroke="#c9a68f" strokeWidth="0.8">
        <circle cx="58" cy="30" r="3.2" />
        <circle cx="66" cy="20" r="2.8" />
        <circle cx="76" cy="24" r="3" />
        <circle cx="52" cy="18" r="2.6" />
        <circle cx="82" cy="14" r="2.6" />
        <circle cx="62" cy="10" r="2.4" />
        <circle cx="46" cy="28" r="2.4" />
        <circle cx="90" cy="20" r="2.4" />
      </g>

      {/* 結び紐 */}
      <path
        d="M64 100 Q70 96 76 100"
        stroke="#a68f72"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
