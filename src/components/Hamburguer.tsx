import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { AlignJustify } from "lucide-react";

export default function Hamburguer() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="shadow-lg">
            <AlignJustify size={32} />            
        </button>
        
      </PopoverTrigger>
      <PopoverContent>
        <ul className="flex flex-col text-xl items-center justify-center gap-8 md:gap-6 text-white font-medium py-8 px-12 h-64">
          <Link className="hover:text-gray-200" href="/teams">
            Equipos
          </Link>
          <Link className="hover:text-gray-200" href="/players">
            Jugadores
          </Link>
          {/* <Link className="hover:text-gray-200"href="/games">Partidos</Link> */}
          <Link
            className="bg-gray-200 text-black rounded-lg px-4 py-2 hover:bg-gray-300"
            href="/register"
          >
            Registrarse
          </Link>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
