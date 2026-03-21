import Link from "next/link";

const modules = [
  {
    href: "/row-counter",
    emoji: "🧮",
    title: "Row Counter",
    description: "Track multiple counters with alerts for any pattern.",
  },
  {
    href: "/gauge-calculator",
    emoji: "📐",
    title: "Gauge Calculator",
    description: "Calculate your personal gauge and resize any pattern.",
  },
  {
    href: "/patterns",
    emoji: "📋",
    title: "Patterns",
    description: "Browse and track your progress through knitting patterns.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-bold text-rose-600"> KnitForge</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Your knitting tools, all in one place.
          </p>
        </header>

        <div className="space-y-3">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-start gap-4 bg-white rounded-2xl shadow p-5 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
            >
              <span className="text-3xl">{m.emoji}</span>
              <div>
                <h2 className="font-semibold text-gray-800">{m.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{m.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 pb-6">
          More tools coming soon ✨
        </p>
      </div>
    </main>
  );
}
