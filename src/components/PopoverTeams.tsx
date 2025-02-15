"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PlayerInputForm from "../components/PlayerInputForm";
import { Player } from "../types";
import { useState } from "react";
import PlayerCard from "./PlayerCard";
import TeamShuffler from "./TeamShuffler";

export function PopoverTeams() {  
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const { toast } = useToast()

  const handleAddPlayer = (newPlayer: Player) => {
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
    <section className="flex flex-col items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Agregar jugador
            <ChevronRight />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px]">
          <PlayerInputForm onAddPlayer={handleAddPlayer} />
        </PopoverContent>
      </Popover>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {playerList.map((player) => (
          <PlayerCard key={player.name} playerName={player.name} />
        ))}
      </div>
      <Button onClick={handleShuffle} className="mt-4 bg-indigo-700">
        Ya están todos?
        <ChevronDown />
      </Button>
     {isShuffled 
     ? <TeamShuffler playersToOrder={playerList} />
     : null }     
    </section>
  );
}
