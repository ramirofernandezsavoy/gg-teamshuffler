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
  const baby =
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Frivadavia.com.ar%2Fnoticias%2Fbasta-baby%2Fel-editorial-de-baby-etchecopar-el-kirchnerismo-se-llevo-todo&psig=AOvVaw3t1rpLvYm2G0sg5PQJucY3&ust=1739667452163000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCICzkKC8xIsDFQAAAAAdAAAAABAE";
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
