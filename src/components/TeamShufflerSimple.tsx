import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";

// Types
interface SimplePlayer {
  name: string; 
  overall: number;
  role?: string; // Add optional role property
}

interface PlayerState {
  playerList: SimplePlayer[];
}

interface TeamArrangement {
  teamA: SimplePlayer[];
  teamB: SimplePlayer[];
  scoreDifference: number;
  roleBalance: number; // Score representing how well roles are distributed
}

// Helper functions
const calculateTeamScore = (team: SimplePlayer[]): number => {
  if (team.length === 0) return 0;
  return team.reduce((sum, player) => sum + player.overall, 0) / team.length;
};

const getTeamDifference = (teamA: SimplePlayer[], teamB: SimplePlayer[]): number => {
  return Math.abs(calculateTeamScore(teamA) - calculateTeamScore(teamB));
};

// Calculate role imbalance between teams (lower is better)
const calculateRoleImbalance = (teamA: SimplePlayer[], teamB: SimplePlayer[]): number => {
  // Count roles in each team
  const roleCountA: Record<string, number> = {};
  const roleCountB: Record<string, number> = {};

  // Count roles in Team A
  teamA.forEach(player => {
    if (player.role) {
      roleCountA[player.role] = (roleCountA[player.role] || 0) + 1;
    }
  });

  // Count roles in Team B
  teamB.forEach(player => {
    if (player.role) {
      roleCountB[player.role] = (roleCountB[player.role] || 0) + 1;
    }
  });

  // Calculate imbalance for each role
  const allRoles = new Set([
    ...Object.keys(roleCountA),
    ...Object.keys(roleCountB)
  ]);

  let totalImbalance = 0;
  allRoles.forEach(role => {
    const countA = roleCountA[role] || 0;
    const countB = roleCountB[role] || 0;
    totalImbalance += Math.abs(countA - countB);
  });

  return totalImbalance;
};

// Main balancing function
const generateBalancedTeams = (
  playerState: PlayerState,
  maxAttempts: number = 200 // Increased attempts for better role balancing
): TeamArrangement | null => {
  // Validation
  if (!playerState?.playerList || playerState.playerList.length < 2) {
    console.error('Not enough players to create teams');
    return null;
  }

  let bestTeamA: SimplePlayer[] = [];
  let bestTeamB: SimplePlayer[] = [];
  let smallestDifference = Infinity;
  let bestRoleBalance = Infinity;

  // Try multiple times to find balanced teams
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Shuffle players randomly
      const shuffledPlayers = [...playerState.playerList].sort(() => Math.random() - 0.5);
      
      // Split into two teams
      const midPoint = Math.floor(shuffledPlayers.length / 2);
      const currentTeamA = shuffledPlayers.slice(0, midPoint);
      const currentTeamB = shuffledPlayers.slice(midPoint);
      
      // Calculate score difference
      const scoreDifference = getTeamDifference(currentTeamA, currentTeamB);
      
      // Calculate role imbalance
      const roleImbalance = calculateRoleImbalance(currentTeamA, currentTeamB);
      
      // Combined score (weighting can be adjusted based on priorities)
      const combinedScore = scoreDifference + (roleImbalance * 2); // Role imbalance has higher weight
      
      // If this arrangement is better than what we've seen, save it
      if (combinedScore < smallestDifference + (bestRoleBalance * 2)) {
        bestTeamA = currentTeamA;
        bestTeamB = currentTeamB;
        smallestDifference = scoreDifference;
        bestRoleBalance = roleImbalance;
        
        // If teams are perfectly balanced in both aspects, we can stop
        if (scoreDifference === 0 && roleImbalance === 0) break;
      }
    } catch (error) {
      console.error('Error during team generation:', error);
      continue;
    }
  }

  return {
    teamA: bestTeamA,
    teamB: bestTeamB,
    scoreDifference: smallestDifference,
    roleBalance: bestRoleBalance
  };
};

// Function to generate multiple team arrangements
const generateMultipleTeamArrangements = (
  playerState: PlayerState,
  numberOfArrangements: number = 3
): TeamArrangement[] => {
  if (!playerState?.playerList || playerState.playerList.length < 2) {
    console.error('Not enough players to create teams');
    return [];
  }

  const arrangements: TeamArrangement[] = [];
  const usedArrangements = new Set<string>();

  for (let i = 0; i < numberOfArrangements * 3; i++) { // Increased iterations for better diversity
    const result = generateBalancedTeams(playerState);
    
    if (!result) continue;

    // Create a unique key for this arrangement
    const arrangementKey = [
      ...result.teamA.map(p => p.name).sort(),
      '|',
      ...result.teamB.map(p => p.name).sort()
    ].join(',');
    
    // Only add unique arrangements
    if (!usedArrangements.has(arrangementKey)) {
      usedArrangements.add(arrangementKey);
      arrangements.push(result);
      
      if (arrangements.length === numberOfArrangements) break;
    }
  }

  // Sort arrangements by a combined score of skill difference and role balance
  return arrangements.sort((a, b) => {
    const scoreA = a.scoreDifference + (a.roleBalance * 2);
    const scoreB = b.scoreDifference + (b.roleBalance * 2);
    return scoreA - scoreB;
  });
};

// Helper function to count roles in a team
const countRoleOccurrences = (team: SimplePlayer[], role: string): number => {
  return team.filter(player => player.role === role).length;
};

// Display color for role balance
const getRoleBalanceColor = (balance: number): string => {
  if (balance === 0) return "text-green-300";
  if (balance <= 2) return "text-orange-300";
  return "text-red-300";
};

// Draggable and Droppable Player Component
const DraggablePlayer: React.FC<{ 
  player: SimplePlayer; 
  teamId: string; 
  showScores: boolean;
  isDragging?: boolean;
}> = ({ player, teamId, showScores, isDragging }) => {
  const playerId = `${teamId}-${player.name}`;
  
  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging: isCurrentlyDragging } = useDraggable({
    id: playerId,
    data: { player, teamId }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: playerId,
    data: { player, teamId }
  });

  // Combinar refs
  const setNodeRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isCurrentlyDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...listeners} 
      {...attributes}
      className={`text-sm cursor-grab active:cursor-grabbing p-2 rounded border transition-colors ${
        isOver ? 'border-yellow-400 bg-yellow-900/30 scale-105' : 'border-white/10 bg-slate-800/30 hover:bg-slate-800/50'
      } ${isCurrentlyDragging ? 'opacity-50' : ''}`}
    >
      <span className="font-medium">{player.name}</span>
      {showScores && (
        <span className={`${player.overall < 4 ? "text-red-400 ml-2" : player.overall < 6 ? "text-yellow-400 ml-2" : "text-green-400 ml-2"} text-xs font-bold`}>
          ({player.overall})
        </span>
      )}
      {player.role && <span className="text-xs ml-2 text-orange-400 bg-orange-950/30 px-1.5 py-0.5 rounded">{player.role}</span>}
    </div>
  );
};

const TeamShuffler: React.FC<{ playersToOrder: SimplePlayer[] }> = ({ playersToOrder }) => {
  const [players, setPlayers] = useState<PlayerState>({ 
    playerList: playersToOrder 
  });
  const [teamArrangements, setTeamArrangements] = useState<TeamArrangement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    })
  );
  
  // Use useEffect to update players state when playersToOrder changes
  useEffect(() => {
    setPlayers({ playerList: playersToOrder });
  }, [playersToOrder]);
  
  const handleGenerateTeams = () => {
    const arrangements = generateMultipleTeamArrangements(players);
    setTeamArrangements(arrangements);
  };
  
  // Get all unique roles for display
  const getAllRoles = (players: SimplePlayer[]): string[] => {
    const roles = players
      .map(player => player.role)
      .filter((role): role is string => !!role);
    return [...new Set(roles)];
  };
  
  const allRoles = getAllRoles(playersToOrder);

  // Show Scores Option
  const [showScores, setShowScores] = useState<Boolean>(false);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end - swap players between teams
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current as { player: SimplePlayer; teamId: string };
    const overData = over.data.current as { player: SimplePlayer; teamId: string };

    if (!activeData || !overData) return;

    const [arrangementId, ...rest] = (activeData.teamId as string).split('-');
    const arrangementIndex = parseInt(arrangementId);

    // Update the team arrangement
    setTeamArrangements(prev => {
      const newArrangements = [...prev];
      const arrangement = { ...newArrangements[arrangementIndex] };
      
      const activeTeam = activeData.teamId.includes('teamA') ? 'teamA' : 'teamB';
      const overTeam = overData.teamId.includes('teamA') ? 'teamA' : 'teamB';

      const newTeamA = [...arrangement.teamA];
      const newTeamB = [...arrangement.teamB];

      if (activeTeam === overTeam) {
        // Same team - just reorder
        return prev;
      }

      // Different teams - swap players
      const activeIndex = activeTeam === 'teamA' 
        ? newTeamA.findIndex(p => p.name === activeData.player.name)
        : newTeamB.findIndex(p => p.name === activeData.player.name);
      
      const overIndex = overTeam === 'teamA'
        ? newTeamA.findIndex(p => p.name === overData.player.name)
        : newTeamB.findIndex(p => p.name === overData.player.name);

      if (activeTeam === 'teamA' && overTeam === 'teamB') {
        const temp = newTeamA[activeIndex];
        newTeamA[activeIndex] = newTeamB[overIndex];
        newTeamB[overIndex] = temp;
      } else if (activeTeam === 'teamB' && overTeam === 'teamA') {
        const temp = newTeamB[activeIndex];
        newTeamB[activeIndex] = newTeamA[overIndex];
        newTeamA[overIndex] = temp;
      }

      arrangement.teamA = newTeamA;
      arrangement.teamB = newTeamB;
      arrangement.scoreDifference = getTeamDifference(newTeamA, newTeamB);
      arrangement.roleBalance = calculateRoleImbalance(newTeamA, newTeamB);

      newArrangements[arrangementIndex] = arrangement;
      return newArrangements;
    });
  };
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full flex flex-col">
        <button
          className="bg-slate-900/50 border border-white/20 rounded-lg mt-4 h-12 font-medium hover:bg-slate-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handleGenerateTeams}
          disabled={playersToOrder.length < 2}
        >
          Mostrar posibles equipos
        </button>
        <button
          className="bg-slate-900/50 border border-white/20 rounded-lg mt-2 mb-4 h-10 text-sm hover:bg-slate-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={() => {setShowScores(!showScores)}}
          disabled={playersToOrder.length < 2}
        >{
          showScores ? "Ocultar puntajes" : "Mostrar puntajes"
        }        
        </button>
        
        <div className="mb-4 p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-300 text-center">
            💡 Arrastrá y soltá jugadores entre equipos para intercambiarlos
          </p>
        </div>
        
        {teamArrangements.map((arrangement, index) => (
          <div className="w-full p-5 bg-slate-900/50 border border-white/20 rounded-lg mb-4 shadow-lg" key={index}>
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-white/10">
              <h3 className="text-xl font-bold">Opción {index + 1}</h3>
              <div className="text-xs text-right space-y-1">
                <p className="text-white/70">
                  Diferencia: <span className="font-bold text-orange-400">{arrangement.scoreDifference.toFixed(2)}</span>
                </p>
                <p className="text-white/70">
                  Balance: <span className={`font-bold ${getRoleBalanceColor(arrangement.roleBalance)}`}>
                    {arrangement.roleBalance === 0 ? "Perfecto" : arrangement.roleBalance < 5 ? "Bueno" : "Regular"}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-950/30 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-lg font-bold text-blue-400 mb-3">Equipo A</h4>
                <div className="space-y-2">
                  {arrangement.teamA.map((player) => (
                    <DraggablePlayer
                      key={player.name}
                      player={player}
                      teamId={`${index}-teamA`}
                      showScores={showScores as boolean}
                    />
                  ))}
                </div>
                
                {/* Role count for Team A */}
                {allRoles.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 space-y-1">
                    {allRoles.map(role => (
                      <div key={`teamA-${role}`}>
                        {role}: <span className="font-semibold">{countRoleOccurrences(arrangement.teamA, role)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-3">
                <h4 className="text-right text-lg font-bold text-red-400 mb-3">Equipo B</h4>
                <div className="space-y-2">
                  {arrangement.teamB.map((player) => (
                    <DraggablePlayer
                      key={player.name}
                      player={player}
                      teamId={`${index}-teamB`}
                      showScores={showScores as boolean}
                    />
                  ))}
                </div>
                
                {/* Role count for Team B */}
                {allRoles.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 text-right space-y-1">
                    {allRoles.map(role => (
                      <div key={`teamB-${role}`}>
                        {role}: <span className="font-semibold">{countRoleOccurrences(arrangement.teamB, role)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <DragOverlay>
        {activeId ? (
          <div className="p-2 rounded border border-white/20 bg-slate-800 shadow-2xl">
            <span className="font-medium text-sm">
              {activeId.split('-').slice(2).join('-')}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TeamShuffler;