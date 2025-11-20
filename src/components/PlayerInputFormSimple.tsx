import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Player {
  name: string;
  overall: number;
  role?: string;
}

interface PlayerInputForm2Props {
  onAddPlayer: (player: Player) => void;
}

const PlayerInputForm2: React.FC<PlayerInputForm2Props> = ({ onAddPlayer }) => {
  const [playerData, setPlayerData] = useState<Player>({
    name: '',
    overall: 5,
    role: undefined
  });

  // Predefined roles for the select dropdown
  const predefinedRoles = [
    "Arquero",
    "Defensa",
    "Mediocampista",
    "Ataque"    
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddPlayer(playerData);
    setPlayerData({
      name: '',
      overall: 5,
      role: undefined
    });
  };

  const handleRoleChange = (value: string) => {
    setPlayerData(prev => ({ ...prev, role: value }));
  };

  return (
    <div className="w-full bg-slate-900/50 border border-white/20 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">Agregar jugador</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nombre
          </label>
          <Input
            type="text"
            value={playerData.name}
            onChange={(e) => setPlayerData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre del jugador"
            className="w-full"
            required
          />
        </div>

        {/* Role Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rol
          </label>
          <Select
            value={playerData.role}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elija el rol" />
            </SelectTrigger>
            <SelectContent className='w-full bg-black p-1'>                
              {predefinedRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}                
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              Puntaje general
            </label>
            <span className="text-sm text-gray-400 font-bold">
              {playerData.overall}
            </span>
          </div>
          <Slider
            defaultValue={[5]}
            max={10}
            min={1}
            step={1}
            value={[playerData.overall]}
            onValueChange={(value) => setPlayerData(prev => ({ ...prev, overall: value[0] }))}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={!playerData.name}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" />
          Agregar jugador
        </Button>
      </form>
    </div>
  );
};

export default PlayerInputForm2;