interface PlayerSkills {
  speed: number;
  technique: number;  
  teamwork: number;
  resistance: number;
}

interface Player extends PlayerSkills {
  name: string;
  overall: number;
}

interface PlayerInputFormProps {
  onAddPlayer: (player: Player) => void;
  playerToEdit?: Player | null;
  onUpdatePlayer?: (player: Player) => void;
}

export type { Player, PlayerSkills, PlayerInputFormProps };