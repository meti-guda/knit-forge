import Link from "next/link";

export default function PatternsPage() {
     return (
          <main className="min-h-screen bg-gray-50 p-6">
               <h1 className="text-3xl font-bold text-center mb-6 text-rose-600">
                    🧶 Patterns
               </h1>

               <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-5">
                    <p className="text-sm text-gray-600 mb-3">
                         This is where your patterns will live. For now, there is one sample pattern.
                    </p>
                    <ul className="space-y-2">
                         <li>
                              <Link
                                   href="/patterns/sample"
                                   className="block px-4 py-3 rounded-xl border hover:bg-rose-50"
                              >
                                   <span className="font-semibold text-gray-800">
                                        Simple Garter Scarf (sample)
                                   </span>
                                   <p className="text-xs text-gray-500">
                                        A dummy pattern to test the tracker.
                                   </p>
                              </Link>
                         </li>
                    </ul>
               </div>
          </main>
     );
}
