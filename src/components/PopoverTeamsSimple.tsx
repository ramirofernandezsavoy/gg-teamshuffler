"use client";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
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
    <section className="flex flex-col md:max-w-[500px] md:mx-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Agregar jugadores
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PlayerInputFormSimple onAddPlayer={handleAddPlayer} />
        </PopoverContent>
      </Popover>
      <div className="grid grid-cols-2 gap-2 my-2 -z-10">
        {playerList.map((player) => (
          <PlayerCard key={player.name} playerName={player.name} />
        ))}
      </div>
      <Button onClick={handleShuffle} className="mt-2 bg-slate-900 text-white hover:bg-slate-700">
        Armar los equipos        
      </Button>
     {isShuffled 
     ? <TeamShufflerSimple playersToOrder={playerList} />
     : null }     
    </section>
  );
}
