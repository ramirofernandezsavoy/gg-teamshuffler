import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface Player {
  name: string;
  overall: number;
}

interface PlayerInputForm2Props {
  onAddPlayer: (player: Player) => void;
}

const PlayerInputForm2: React.FC<PlayerInputForm2Props> = ({ onAddPlayer }) => {
  const [playerData, setPlayerData] = useState<Player>({
    name: '',
    overall: 5
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddPlayer(playerData);
    setPlayerData({
      name: '',
      overall: 5
    });
  };

  return (
    <Card className="w-screen max-w-xs mx-auto bg-black border border-white mt-4 rounded-md z-50">
      <CardHeader>
        <CardTitle>Agregar jugador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Player Name
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                Puntaje general
              </label>
              <span className="text-sm text-gray-500">
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
            className="w-full flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Player
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerInputForm2;