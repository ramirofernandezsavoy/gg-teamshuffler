"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PlayerInputFormSimple from "./PlayerInputFormSimple";
import { SimplePlayer } from "../types";
import { useState } from "react";
import PlayerCard from "./PlayerCard";
import TeamShufflerSimple from "./TeamShufflerSimple";

export function PopoverTeamsSimple() {  
  const [playerList, setPlayerList] = useState<SimplePlayer[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const { toast } = useToast()

  const handleAddPlayer = (newPlayer: SimplePlayer) => {
    console.log("Adding new player:", newPlayer);
    setPlayerList((prev) => [...prev, newPlayer]);
  };

  const handleShuffle = () => {
    playerList.length == 0 ? toast({
      title: "Vos sos pelotudo?",
      description: "Debe haber jugadores para armar equipos",
      variant: "destructive",      
    }) :
    playerList.length % 2 == 0 
    ? setIsShuffled(true)        
    : toast({
      title: "Forro!",
      description: "La cantidad de jugadores debe ser par",
      variant: "destructive",      
    });;
    
  }

  return (
    <section className="flex flex-col lg:max-w-[1000px] md:max-w-[700px] md:mx-auto">
      {/* Layout horizontal en pantallas grandes */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Formulario */}
        <div className="md:w-1/2">
          <PlayerInputFormSimple onAddPlayer={handleAddPlayer} />
        </div>
        
        {/* Lista de jugadores */}
        <div className="md:w-1/2">
          {playerList.length > 0 ? (
            <div className="bg-slate-900/30 border border-white/10 rounded-lg p-4 h-full">
              <h3 className="text-sm font-medium text-white/70 mb-3">
                Jugadores agregados ({playerList.length})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {playerList.map((player) => (
                  <PlayerCard key={player.name} playerName={player.name} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-white/10 border-dashed rounded-lg p-4 h-full flex items-center justify-center">
              <p className="text-white/50 text-sm text-center">
                Todavía no hay jugadores.<br />
                Agregá el primero para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Button 
        onClick={handleShuffle} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg transition-colors"
        disabled={playerList.length < 2}
      >
        Armar los equipos        
      </Button>
     {isShuffled 
     ? <TeamShufflerSimple playersToOrder={playerList} />
     : null }     
    </section>
  );
}
