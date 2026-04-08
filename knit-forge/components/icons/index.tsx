export function YarnBall({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="28" fill="#B85C38" opacity="0.2" />
      <circle cx="32" cy="32" r="24" fill="#B85C38" />
      <path
        d="M16 26C16 26 24 16 32 16C40 16 48 26 48 26"
        stroke="#F5EDE0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 34C12 34 22 28 32 28C42 28 52 34 52 34"
        stroke="#F5EDE0"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M18 42C18 42 24 38 32 38C40 38 46 42 46 42"
        stroke="#F5EDE0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="22" cy="22" rx="5" ry="2.5" fill="#D4714A" opacity="0.6" />
      <path
        d="M48 20C48 20 52 24 52 32C52 40 48 44 48 44"
        stroke="#B85C38"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Needle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="8"
        y1="56"
        x2="48"
        y2="16"
        stroke="#8B3A2F"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="52" cy="12" r="6" fill="#D4A853" />
      <circle cx="52" cy="12" r="3" fill="#8B3A2F" />
      <ellipse
        cx="12"
        cy="52"
        rx="2"
        ry="4"
        fill="#8B3A2F"
        transform="rotate(-45 12 52)"
      />
    </svg>
  );
}

export function Stitch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 20C12 20 20 12 32 12C44 12 52 20 52 20"
        stroke="#5C6B4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 32C12 32 20 40 32 40C44 40 52 32 52 32"
        stroke="#5C6B4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="20"
        x2="12"
        y2="32"
        stroke="#5C6B4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="12"
        x2="32"
        y2="40"
        stroke="#5C6B4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="52"
        y1="20"
        x2="52"
        y2="32"
        stroke="#5C6B4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 44C12 44 20 52 32 52C44 52 52 44 52 44"
        stroke="#7B5D7A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

export function Counter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="12"
        width="48"
        height="40"
        rx="4"
        fill="#F5EDE0"
        stroke="#D4A853"
        strokeWidth="3"
      />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="24"
        fontFamily="var(--font-space-mono)"
        fontWeight="bold"
        fill="#B85C38"
      >
        42
      </text>
      <line x1="8" y1="24" x2="56" y2="24" stroke="#D4A853" strokeWidth="2" />
    </svg>
  );
}

export function Calculator({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="4"
        fill="#F5EDE0"
        stroke="#D9CFC0"
        strokeWidth="3"
      />
      <rect x="14" y="14" width="36" height="12" rx="2" fill="#EDE5D8" />
      <text
        x="32"
        y="23"
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-space-mono)"
        fill="#B85C38"
      >
        20×28
      </text>
      <circle cx="20" cy="38" r="4" fill="#D4A853" />
      <circle cx="32" cy="38" r="4" fill="#5C6B4A" />
      <circle cx="44" cy="38" r="4" fill="#7B5D7A" />
      <circle cx="20" cy="50" r="4" fill="#B85C38" />
      <circle cx="32" cy="50" r="4" fill="#D9CFC0" />
      <circle cx="44" cy="50" r="4" fill="#D4A853" />
    </svg>
  );
}

export function Palette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 32C12 32 12 20 24 16C36 12 48 16 52 28C56 40 48 52 32 52C16 52 12 40 12 32Z"
        fill="#F5EDE0"
        stroke="#D9CFC0"
        strokeWidth="3"
      />
      <circle cx="20" cy="28" r="5" fill="#B85C38" />
      <circle cx="36" cy="20" r="5" fill="#D4A853" />
      <circle cx="44" cy="36" r="5" fill="#5C6B4A" />
      <circle cx="28" cy="44" r="5" fill="#7B5D7A" />
      <circle cx="20" cy="28" r="2" fill="#D4714A" opacity="0.6" />
      <circle cx="20" cy="36" r="4" fill="#8B3A2F" />
    </svg>
  );
}

export function Image({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="6"
        y="10"
        width="52"
        height="44"
        rx="4"
        fill="#F5EDE0"
        stroke="#D9CFC0"
        strokeWidth="3"
      />
      <path
        d="M6 42L20 28L32 40L44 28L58 42"
        stroke="#5C6B4A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="22" r="6" fill="#D4A853" />
      <circle cx="44" cy="22" r="4" fill="#7B5D7A" />
      <path
        d="M24 20L28 26L36 18"
        stroke="#B85C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="14" y="32" width="8" height="8" fill="#B85C38" opacity="0.3" />
      <rect x="26" y="28" width="6" height="6" fill="#5C6B4A" opacity="0.3" />
      <rect x="38" y="32" width="10" height="6" fill="#D4A853" opacity="0.3" />
    </svg>
  );
}

export function Shirt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 12L8 20L16 28L16 52L48 52L48 28L56 20L48 12L40 12C40 16 36 20 32 20C28 20 24 16 24 12L16 12Z"
        fill="#F5EDE0"
        stroke="#D9CFC0"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M24 12C24 16 28 20 32 20C36 20 40 16 40 12"
        stroke="#D4A853"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 20L16 28L16 52L20 52L20 32L16 28L8 20Z"
        fill="#EDE5D8"
      />
      <path
        d="M56 20L48 28L48 52L44 52L44 32L48 28L56 20Z"
        fill="#EDE5D8"
      />
      <line x1="32" y1="20" x2="32" y2="52" stroke="#D9CFC0" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

export function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 4L34 20L50 22L34 24L32 40L30 24L14 22L30 20L32 4Z"
        fill="#D4A853"
      />
      <path
        d="M16 32L17 40L25 41L17 42L16 50L15 42L7 41L15 40L16 32Z"
        fill="#B85C38"
        opacity="0.8"
      />
      <path
        d="M48 36L49 42L55 43L49 44L48 50L47 44L41 43L47 42L48 36Z"
        fill="#7B5D7A"
        opacity="0.8"
      />
      <circle cx="52" cy="16" r="3" fill="#D4A853" />
      <circle cx="12" cy="48" r="2" fill="#5C6B4A" />
      <circle cx="56" cy="52" r="2" fill="#D4A853" />
    </svg>
  );
}

export function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Menu({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 6H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 18H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Close({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
