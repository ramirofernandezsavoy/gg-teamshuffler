import Link from "next/link";
import Image from "next/image";
import logo from "../../public/gg-logo.png";

export default function Nav() {
  return (
    <nav className="w-screen text-center sticky top-0 z-10 bg-zinc-950">
      <section className="flex items-center justify-between wrapper">
        <Link href="/">
        <Image src={logo} alt="Logo Goal Gurus" height={120} width={120} />
        </Link>

        <ul className="flex text-sm gap-4 md:gap-6 text-white font-medium">
          <Link href="/teams">Equipos</Link>
          <Link href="/players">Jugadores</Link>
          <Link href="/games">Partidos</Link>
        </ul>
      </section>
    </nav>
  );
}
