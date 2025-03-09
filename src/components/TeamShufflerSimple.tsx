import { useState, useEffect } from "react";

// Types
  
  interface PlayerState {
    playerList: SimplePlayer[];
  }

  interface SimplePlayer {
    name: string;
    overall: number;
  }
  
  interface TeamArrangement {
    teamA: SimplePlayer[];
    teamB: SimplePlayer[];
    scoreDifference: number;
  }
  
  // Helper functions
  const calculateTeamScore = (team: SimplePlayer[]): number => {
    if (team.length === 0) return 0;
    return team.reduce((sum, player) => sum + player.overall, 0) / team.length;
  };
  
  const getTeamDifference = (teamA: SimplePlayer[], teamB: SimplePlayer[]): number => {
    return Math.abs(calculateTeamScore(teamA) - calculateTeamScore(teamB));
  };
  
  // Main balancing function
  const generateBalancedTeams = (
    playerState: PlayerState,
    maxAttempts: number = 100
  ): TeamArrangement | null => {
    // Validation
    if (!playerState?.playerList || playerState.playerList.length < 2) {
      console.error('Not enough players to create teams');
      return null;
    }
  
    let bestTeamA: SimplePlayer[] = [];
    let bestTeamB: SimplePlayer[] = [];
    let smallestDifference = Infinity;
  
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
        const difference = getTeamDifference(currentTeamA, currentTeamB);
        
        // If this arrangement is better than what we've seen, save it
        if (difference < smallestDifference) {
          bestTeamA = currentTeamA;
          bestTeamB = currentTeamB;
          smallestDifference = difference;
          
          // If teams are perfectly balanced, we can stop
          if (difference === 0) break;
        }
      } catch (error) {
        console.error('Error during team generation:', error);
        continue;
      }
    }
  
    return {
      teamA: bestTeamA,
      teamB: bestTeamB,
      scoreDifference: smallestDifference
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
  
    for (let i = 0; i < numberOfArrangements * 2; i++) {
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
  
    // Sort arrangements by score difference
    return arrangements.sort((a, b) => a.scoreDifference - b.scoreDifference);
  };
  
  
  const TeamShufflerSimple: React.FC<{ playersToOrder: SimplePlayer[] }> = ( { playersToOrder } ) => {
    
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

  // Hiding the scores

  const [showScores, setShowScores] = useState<Boolean>(false);
  
  return (
    <div className="w-full flex flex-col">
      <button
        className={`border-[1px] border-white rounded-md mt-4 mb-2 h-10`} 
        onClick={handleGenerateTeams}
        disabled={playersToOrder.length < 2}
      >
        Mostrar posibles equipos
      </button>
      <button
        className={`border-[1px] border-white rounded-md mb-4 h-10`} 
        onClick={() => setShowScores(!showScores)}        
      >
        { showScores ? 'Ocultar Puntajes' : 'Mostrar Puntajes' }
      </button>
      
      
      {teamArrangements.map((arrangement, index) => (
        <div className="w-full p-4 bg-slate-900/70 rounded-lg mb-4" key={index}>
            <div className="flex justify-between">
            <h3 className="text-xl">Equipos ({index + 1})</h3>
            <p className="text-sm ">Diferencia de nivel: <span className="font-bold text-orange-300">{arrangement.scoreDifference.toFixed(2)}</span></p>
            </div>
          <div className="grid grid-cols-2 gap-4 ">
            <div className="p-2">
              <h4>Equipo A</h4>
              {arrangement.teamA.map((player) => (
                <div key={player.name}>
                  {player.name} {showScores ? <span className={`${player.overall < 4 ? "text-red-400" : player.overall < 6 ? "text-yellow-400" :"text-green-400"}`}>(#{player.overall})</span> : null }
                </div>
              ))}
            </div>
            <div className="p-2">
              <h4 className="text-right">Equipo B</h4>
              {arrangement.teamB.map((player) => (
                <div className="text-right" key={player.name}>
                  {player.name} {showScores ? <span className={`${player.overall < 4 ? "text-red-400" : player.overall < 6 ? "text-yellow-400" :"text-green-400"}`}>(#{player.overall})</span> : null }
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      </div>    
  );
};

export default TeamShufflerSimple;