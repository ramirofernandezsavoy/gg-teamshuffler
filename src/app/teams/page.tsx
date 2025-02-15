import { PopoverTeams } from "@/components/PopoverTeams"

export default function Teams() {
  return (
    <div>
        <div>
            <h2 className="text-4xl text-center mt-4">Equipos</h2>
            <p className="text-center text-white/70 px-4">
                Ingresá los jugadores para el evento.
            </p>
        </div>   
        <div className="flex justify-center mt-4">
            <PopoverTeams />
        </div>

    </div>
  )
}
