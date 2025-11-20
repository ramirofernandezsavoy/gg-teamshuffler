import Link from "next/link";

export default function Home() {
  return (
    <div className="wrapper">
      <section className="flex flex-col justify-center items-center px-4">        
          <div className="border-white/20 rounded-lg border bg-slate-900/50 px-8 py-6 max-w-md w-full">
            <h2 className="text-center text-3xl font-bold mb-2">Armar equipos</h2>
            <p className="text-center text-white/70 text-sm mb-6">
              Organizá tus partidos deportivos de forma equilibrada
            </p>
            <div className="flex flex-col gap-3">
              {/* <Link href="/teams" className="flex flex-col items-center justify-center bg-slate-700/50 hover:bg-slate-700 border border-white/20 duration-200 px-4 py-3 rounded-lg font-medium transition-colors">              
                Version: Compleja
              </Link>   */}
              <Link href="/teams2" className="flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 duration-200 px-4 py-3 rounded-lg font-medium transition-colors shadow-lg">              
                Comenzar
              </Link>        
            </div>
          </div>
        
      </section>  
    </div>
  );
}
