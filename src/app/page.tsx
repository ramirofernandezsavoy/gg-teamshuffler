import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1 className="text-white">Goal Gurus</h1>
          <Link href="/teams">Ir al armador de equipos</Link>
      </main>  
    </div>
  );
}
