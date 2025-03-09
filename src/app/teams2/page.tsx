import { PopoverTeamsSimple } from "@/components/PopoverTeamsSimple";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Armador de equipos | Goal Gurus",
  description: "Armá tus equipos basandote en las habilidades de tus compañeros.",
};

export default function Teams() {
  return (
    <div className="wrapper min-h-[700px]">
        <div>
            <h2 className="text-2xl mt-4">Armá tus equipos</h2>
            <p className="text-white/70">
                Ingresá los jugadores para el evento.
            </p>
        </div>   
        <div className="mt-6">
            <PopoverTeamsSimple />
        </div>

    </div>
  )
}
