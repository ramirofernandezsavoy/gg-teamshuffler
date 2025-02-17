import Link from "next/link";

export default function Home() {
  return (
    <div className="wrapper">
      <section className="flex flex-col justify-center items-center">        
          <div className="border-white rounded-lg border-2 px-8 py-4">
            <h2 className="text-center text-3xl">Armar equipos</h2>
            <div className="flex gap-4 mt-2">
              <Link href="/teams" className="flex flex-col items-center justify-center bg-red-200 hover:bg-red-400 duration-200 px-4 py-2 w-56 text-black rounded-lg font-medium">              
                Version: Compleja
              </Link>  
              <Link href="/teams" className="flex flex-col items-center justify-center bg-blue-200 hover:bg-blue-400 duration-200 px-4 py-2 w-56 text-black rounded-lg font-medium">              
                Version: Simple
              </Link>        
            </div>
          </div>
        
      </section>  
    </div>
  );
}
