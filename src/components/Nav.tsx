import Link from "next/link";
import Image from "next/image";
import logo from "../../public/gg-logo.png";
import Hamburguer from "./Hamburguer";

export default function Nav() {
  return (
    <nav className="w-screen text-center sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <section className="flex items-center justify-between wrapper">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src={logo} alt="Logo Goal Gurus" height={120} width={120} />
        </Link>

        <ul className="md:flex text-sm items-center gap-4 md:gap-6 text-white font-medium hidden ">
          <Link className="hover:text-blue-400 transition-colors" href="/teams">Equipos</Link>
          <Link className="hover:text-blue-400 transition-colors" href="/players">Jugadores</Link>
          {/* <Link className="hover:text-blue-400 transition-colors" href="/games">Partidos</Link> */}
          <Link className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 ml-6 transition-colors shadow-lg" href="/register">Registrarse</Link>
        </ul>
        <div className="block md:hidden">
          <Hamburguer />
        </div>

      </section>
    </nav>
  );
}
