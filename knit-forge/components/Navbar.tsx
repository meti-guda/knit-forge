import Link from "next/link";

export default function Navbar() {
     return (
          <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
               <Link href="/" className="text-rose-600 font-bold text-lg">
                    KnitForge
               </Link>
               <div className="flex gap-4 text-sm text-gray-500">
                    <Link href="/row-counter" className="hover:text-rose-600">Counter</Link>
                    <Link href="/gauge-calculator" className="hover:text-rose-600">Gauge</Link>
                    <Link href="/patterns" className="hover:text-rose-600">Patterns</Link>
               </div>
          </nav>
     );
}
