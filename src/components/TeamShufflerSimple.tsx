import { useState, useEffect } from "react";

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

const TeamShuffler: React.FC<{ playersToOrder: SimplePlayer[] }> = ({ playersToOrder }) => {
  const [players, setPlayers] = useState<PlayerState>({ 
    playerList: playersToOrder 
  });
  const [teamArrangements, setTeamArrangements] = useState<TeamArrangement[]>([]);
  
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
  
  return (
    <div className="w-full flex flex-col">
      <button
        className={`border-[1px] border-white rounded-md mt-4 h-10`} 
        onClick={handleGenerateTeams}
        disabled={playersToOrder.length < 2}
      >
        Mostrar posibles equipos
      </button>
      <button
        className={`border-[1px] border-white rounded-md mt-2 mb-4 h-10`} 
        onClick={() => {setShowScores(!showScores)}}
        disabled={playersToOrder.length < 2}
      >{
        showScores ? "Ocultar puntajes" : "Mostrar puntajes"
      }        
      </button>
      
      {teamArrangements.map((arrangement, index) => (
        <div className="w-full p-4 bg-slate-900/70 rounded-lg mb-4" key={index}>
          <div className="flex justify-between">
            <h3 className="text-xl">Equipos ({index + 1})</h3>
            <div className="text-xs text-right">
              <p>Diferencia de nivel: <span className="font-bold text-orange-300">{arrangement.scoreDifference.toFixed(2)}</span></p>
              <p>Balance de roles: <span className={`font-bold ${getRoleBalanceColor(arrangement.roleBalance)}`}>
                {arrangement.roleBalance === 0 ? "Perfecto" : arrangement.roleBalance < 5 ? "Bueno" : "Regular"}
              </span></p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2">
              <h4 className="text-lg font-bold text-blue-300 mt-2">Equipo A</h4>
              {arrangement.teamA.map((player) => (
                <div key={player.name}>
                  {player.name} 
                  { showScores ?  
                  <span className={`${player.overall < 4 ? "text-red-300 ml-2" : player.overall < 6 ? "text-yellow-400 ml-2" :"text-green-300 ml-2"}`}>
                    (#{player.overall})
                  </span> 
                  : null }
                  {player.role && <span className="text-xs ml-2 text-orange-300">{player.role}</span>}
                </div>
              ))}
              
              {/* Role count for Team A */}
              {allRoles.length > 0 && (
                <div className="mt-2 text-xs text-gray-400 flex flex-col">
                  {allRoles.map(role => (
                    <span key={`teamA-${role}`} className="mr-2">
                      {role}: {countRoleOccurrences(arrangement.teamA, role)}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-2">
              <h4 className="text-right text-lg font-bold text-blue-300 mt-2">Equipo B</h4>
              {arrangement.teamB.map((player) => (
                <div className="text-right" key={player.name}>
                  {player.role && <span className=" text-xs text-orange-300 mr-2">{player.role}</span>}
                  { showScores ?  
                  <span className={`${player.overall < 4 ? "text-red-300 mr-2" : player.overall < 6 ? "text-yellow-400 mr-2" :"text-green-300 mr-2"}`}>
                    (#{player.overall})
                  </span> 
                  : null }
                  {player.name}
                 
                </div>
              ))}
              
              {/* Role count for Team B */}
              {allRoles.length > 0 && (
                <div className="mt-2 text-xs text-gray-400 text-right flex flex-col">
                  {allRoles.map(role => (
                    <span key={`teamB-${role}`} className="ml-2">
                      {role}: {countRoleOccurrences(arrangement.teamB, role)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>    
  );
};

export default TeamShuffler;