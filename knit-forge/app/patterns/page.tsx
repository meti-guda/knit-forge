import Link from "next/link";
import { patterns } from "@/app/lib/patterns";

const difficultyColor: Record<string, string> = {
     Beginner: "bg-green-100 text-green-700",
     Intermediate: "bg-yellow-100 text-yellow-700",
     Advanced: "bg-red-100 text-red-700",
};

export default function PatternsPage() {
     return (
          <main className="min-h-screen bg-gray-50 p-6">
               <h1 className="text-3xl font-bold text-center mb-6 text-rose-600">
                    🧶 Patterns
               </h1>

               <div className="max-w-xl mx-auto space-y-3">
                    {patterns.map((p) => (
                         <Link
                              key={p.slug}
                              href={`/patterns/${p.slug}`}
                              className="block bg-white rounded-2xl shadow p-5 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-200"
                         >
                              <div className="flex justify-between items-start">
                                   <div>
                                        <h2 className="font-semibold text-gray-800">{p.title}</h2>
                                        <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                                   </div>
                                   <span className={`text-xs font-semibold px-2 py-1 rounded-full ml-3 whitespace-nowrap ${difficultyColor[p.difficulty]}`}>
                                        {p.difficulty}
                                   </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">{p.steps.length} steps</p>
                         </Link>
                    ))}
               </div>
          </main>
     );
}
