import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Save, UserPlus } from 'lucide-react';
import {Player, PlayerSkills, PlayerInputFormProps} from '@/types';


const initialState: Player = {
  name: '',
  speed: 5,
  technique: 5,  
  teamwork: 5,
  resistance: 5,
  overall: 5
};

const PlayerInputForm: React.FC<PlayerInputFormProps> = ({ 
  onAddPlayer, 
  playerToEdit = null, 
  onUpdatePlayer 
}) => {
  const [playerData, setPlayerData] = useState<Player>(initialState);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (playerToEdit) {
      setPlayerData(playerToEdit);
      setIsEditing(true);
    }
  }, [playerToEdit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing && onUpdatePlayer) {
      onUpdatePlayer(playerData);
    } else {
      onAddPlayer(playerData);
    }
    handleReset();
  };

  const handleReset = (): void => {
    setPlayerData(initialState);
    setIsEditing(false);
  };

  const handleSliderChange = (value: number[], skill: keyof PlayerSkills): void => {
    setPlayerData(prev => ({
      ...prev,
      [skill]: value[0],
      overall: Math.round
        (prev.speed + prev.technique + prev.teamwork + prev.resistance) / 4 
    }));    
  };

  const renderSlider = (skill: keyof PlayerSkills, label: string) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium">
          {label}
        </label>
        <span className="text-sm text-gray-500">
          {playerData[skill]}
        </span>
      </div>
      <Slider
        defaultValue={[5]}
        max={10}
        min={1}
        step={1}
        value={[playerData[skill]]}
        onValueChange={(value) => handleSliderChange(value, skill)}
        className="w-full"
      />
    </div>
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPlayerData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar jugador' : 'Agregar jugador'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">           
            <Input
              type="text"
              value={playerData.name}
              onChange={handleNameChange}
              placeholder="Nombre del jugador"
              className="w-full"
              required
            />
          </div>

          {renderSlider('speed', 'Velocidad')}
          {renderSlider('technique', 'Técnica')}          
          {renderSlider('teamwork', 'Trabajo en equipo')}
          {renderSlider('resistance', 'Resistencia')}

          <div className="flex justify-between gap-2">            
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!playerData.name}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Actualizar jugador
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Agregar jugador
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerInputForm;