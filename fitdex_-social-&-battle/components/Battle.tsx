
import React, { useState, useEffect, useRef } from 'react';
import { Bomb, Diamond, Trophy, AlertTriangle, Swords, Shield, Zap, Play, Gamepad2, Globe, ChevronLeft, RefreshCw, Target, Clock, Star, Activity, Flag, Search, X, Disc, Grid3X3, Lock, CheckCircle, Castle, Crown, Skull, Bot, Users, MousePointerClick } from 'lucide-react';
import { User, Friend, BattleRank } from '../types';

interface BattleProps {
  user: User;
  friends: Friend[];
  onScoreUpdate: (points: number) => void;
}

// --- SHARED TYPES ---
type BattleMode = 'HUB' | 'OTHER_GAMES_MENU' | 'MINESWEEPER' | 'REFLEX' | 'TICTACTOE' | 'ARENAS' | 'FRIENDS_BATTLE_LIST';
type GameType = 'MINESWEEPER' | 'REFLEX';

// --- MINESWEEPER TYPES ---
type MinesweeperState = 'MENU' | 'MATCHMAKING' | 'VS_ANIMATION' | 'PVP_GAME' | 'OPPONENT_TURN' | 'PVP_RESULT';
type CellState = 'hidden' | 'revealed' | 'exploded';
type CellValue = 'mine' | 'gem';

interface Cell {
  id: number;
  state: CellState;
  value: CellValue;
}

interface RoundScore {
  round: number;
  player: number;
  opponent: number;
}

// --- REFLEX GAME TYPES ---
type ReflexState = 'LOBBY' | 'MATCHMAKING' | 'VS_INTRO' | 'GAME' | 'ROUND_RESULT' | 'FINAL_RESULT';
type ReflexDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
type ReflexHitType = 'PERFECT' | 'GOOD' | 'MISS' | null;
type TurnOwner = 'PLAYER' | 'OPPONENT';

interface ReflexTarget {
  id: number;
  x: number;
  y: number;
  spawnTime: number;
  hit: boolean;
  simulatedHitTime?: number; // For AI
}

interface ReflexRoundHistory {
    round: number;
    playerScore: number;
    opponentScore: number;
    winner: 'PLAYER' | 'OPPONENT' | 'TIE';
}

// --- TIC TAC TOE TYPES ---
type TTTPlayer = 'HALTER' | 'WEIGHT' | null; // Halter (Player), Weight (CPU)
type TTTState = 'PLAYING' | 'WON' | 'LOST' | 'DRAW';

const GRID_SIZE = 5;
const MINE_COUNT = 5;
const MAX_ROUNDS = 3;

// Bot Definition for Fallback
const FITBOT: Friend = {
    id: 'bot_1',
    name: 'FitBot 3000',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FitBot',
    points: 9999,
    isOnline: true
};

// Arena Definitions
const ARENAS = [
    { id: 1, name: 'Arena Bronze', minTrophies: 0, color: 'from-orange-700 to-orange-900', icon: 'Shield' },
    { id: 2, name: 'Arena Ouro', minTrophies: 150, color: 'from-yellow-600 to-yellow-800', icon: 'Trophy' },
    { id: 3, name: 'Arena Prata', minTrophies: 350, color: 'from-gray-400 to-gray-600', icon: 'Shield' },
    { id: 4, name: 'Arena Diamante', minTrophies: 600, color: 'from-cyan-600 to-cyan-900', icon: 'Diamond' },
];

// --- CUSTOM ASSETS ---
const BronzeRankEmblem = ({ size = 192, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-2xl ${className}`}>
        <path d="M100 210L20 160V50L100 10L180 50V160L100 210Z" fill="url(#bronze_gradient)" stroke="#5c2b08" strokeWidth="4"/>
        <path d="M100 190L40 150V70L100 40L160 70V150L100 190Z" fill="url(#bronze_inner)" stroke="#78350f" strokeWidth="2"/>
        <path d="M100 90L112 125H148L119 146L130 180L100 158L70 180L81 146L52 125H88L100 90Z" fill="#fbbf24" stroke="#92400e" strokeWidth="2"/>
        <path d="M100 10L180 50V100C180 100 140 120 100 120C60 120 20 100 20 100V50L100 10Z" fill="white" fillOpacity="0.1"/>
        <defs>
            <linearGradient id="bronze_gradient" x1="100" y1="10" x2="100" y2="210" gradientUnits="userSpaceOnUse">
                <stop stopColor="#cd7f32"/>
                <stop offset="1" stopColor="#8b4513"/>
            </linearGradient>
            <linearGradient id="bronze_inner" x1="100" y1="40" x2="100" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d97706"/>
                <stop offset="1" stopColor="#b45309"/>
            </linearGradient>
        </defs>
    </svg>
);

const SilverRankEmblem = ({ size = 192, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-2xl ${className}`}>
        {/* Silver uses cool grays and blues */}
        <path d="M100 210L20 160V50L100 10L180 50V160L100 210Z" fill="url(#silver_gradient)" stroke="#475569" strokeWidth="4"/>
        <path d="M100 190L40 150V70L100 40L160 70V150L100 190Z" fill="url(#silver_inner)" stroke="#334155" strokeWidth="2"/>
        
        {/* Star/Symbol */}
        <path d="M100 60 L120 100 L160 100 L130 130 L140 170 L100 150 L60 170 L70 130 L40 100 L80 100 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
        
        {/* Shine */}
        <path d="M100 10L180 50V100C180 100 140 120 100 120C60 120 20 100 20 100V50L100 10Z" fill="white" fillOpacity="0.15"/>

        <defs>
            <linearGradient id="silver_gradient" x1="100" y1="10" x2="100" y2="210" gradientUnits="userSpaceOnUse">
                <stop stopColor="#94a3b8"/>
                <stop offset="1" stopColor="#475569"/>
            </linearGradient>
            <linearGradient id="silver_inner" x1="100" y1="40" x2="100" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#cbd5e1"/>
                <stop offset="1" stopColor="#64748b"/>
            </linearGradient>
        </defs>
    </svg>
);

const GoldRankEmblem = ({ size = 192, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-2xl ${className}`}>
        {/* Gold uses rich yellows and ambers */}
        <path d="M100 210L10 140V60L100 0L190 60V140L100 210Z" fill="url(#gold_gradient)" stroke="#b45309" strokeWidth="4"/>
        <path d="M100 180L30 130V70L100 20L170 70V130L100 180Z" fill="url(#gold_inner)" stroke="#d97706" strokeWidth="2"/>
        
        {/* Trophy Cup Shape */}
        <path d="M60 60 H140 L130 110 C130 130 115 140 100 140 C85 140 70 130 70 110 L60 60Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
        <circle cx="100" cy="140" r="10" fill="#d97706"/>
        <path d="M90 150 H110 L120 170 H80 L90 150Z" fill="#fef3c7"/>

        {/* Shine */}
        <path d="M100 0L190 60V100C190 100 145 120 100 120C55 120 10 100 10 100V60L100 0Z" fill="white" fillOpacity="0.2"/>

        <defs>
            <linearGradient id="gold_gradient" x1="100" y1="0" x2="100" y2="210" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24"/>
                <stop offset="1" stopColor="#d97706"/>
            </linearGradient>
            <linearGradient id="gold_inner" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fcd34d"/>
                <stop offset="1" stopColor="#b45309"/>
            </linearGradient>
        </defs>
    </svg>
);

const DiamondRankEmblem = ({ size = 192, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-2xl ${className}`}>
        <defs>
            <linearGradient id="dia_grad" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="dia_shine" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0.8"/>
                <stop offset="0.5" stopColor="white" stopOpacity="0"/>
            </linearGradient>
        </defs>
        <path d="M100 10 L130 40 L180 30 L160 80 L190 100 L160 120 L180 170 L130 160 L100 190 L70 160 L20 170 L40 120 L10 100 L40 80 L20 30 L70 40 Z" fill="#164e63" stroke="#06b6d4" strokeWidth="2"/>
        <path d="M100 20 L155 55 V145 L100 180 L45 145 V55 L100 20Z" fill="url(#dia_grad)" stroke="white" strokeWidth="3"/>
        <path d="M100 20 L100 90 L155 55" fill="white" fillOpacity="0.2"/>
        <path d="M100 20 L45 55 L100 90" fill="white" fillOpacity="0.4"/>
        <path d="M45 55 L45 145 L100 90" fill="black" fillOpacity="0.1"/>
        <path d="M155 55 L155 145 L100 90" fill="black" fillOpacity="0.1"/>
        <path d="M45 145 L100 180 L100 90" fill="white" fillOpacity="0.1"/>
        <path d="M155 145 L100 180 L100 90" fill="white" fillOpacity="0.3"/>
        <path d="M100 50 L115 85 H155 L125 110 L135 150 L100 130 L65 150 L75 110 L45 85 H85 Z" fill="#ecfeff" stroke="#0891b2" strokeWidth="1" />
    </svg>
);

const Battle: React.FC<BattleProps> = ({ user, friends, onScoreUpdate }) => {
  // --- MAIN NAV STATE ---
  const [activeGame, setActiveGame] = useState<BattleMode>('HUB');
  const [mainGamePreference, setMainGamePreference] = useState<GameType>('MINESWEEPER');
  const [surrendered, setSurrendered] = useState(false);
  
  // --- FRIEND CHALLENGE STATE ---
  const [challengeModalFriend, setChallengeModalFriend] = useState<Friend | null>(null);

  // --- MINESWEEPER STATE ---
  const [msViewState, setMsViewState] = useState<MinesweeperState>('MENU');
  const [opponent, setOpponent] = useState<Friend | null>(null);
  const [roundsHistory, setRoundsHistory] = useState<RoundScore[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [currentTurnPoints, setCurrentTurnPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [message, setMessage] = useState('');
  const [opponentActionText, setOpponentActionText] = useState('');

  // --- REFLEX GAME STATE ---
  const [reflexState, setReflexState] = useState<ReflexState>('LOBBY');
  const [reflexDifficulty, setReflexDifficulty] = useState<ReflexDifficulty>('MEDIUM');
  const [activeTurn, setActiveTurn] = useState<TurnOwner>('PLAYER');
  const [reflexRound, setReflexRound] = useState(1);
  const [reflexHistory, setReflexHistory] = useState<ReflexRoundHistory[]>([]);
  const [currentRoundPlayerScore, setCurrentRoundPlayerScore] = useState(0);
  const [currentRoundOpponentScore, setCurrentRoundOpponentScore] = useState(0);
  const [reflexTargets, setReflexTargets] = useState<ReflexTarget[]>([]);
  const [reflexHitFeedback, setReflexHitFeedback] = useState<{type: ReflexHitType, x: number, y: number} | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // --- TIC TAC TOE STATE ---
  const [tttBoard, setTTTBoard] = useState<TTTPlayer[]>(Array(9).fill(null));
  const [tttStatus, setTTTStatus] = useState<TTTState>('PLAYING');
  const [tttWinningLine, setTTTWinningLine] = useState<number[] | null>(null);

  // --- HELPER: Get Current Arena ---
  const getCurrentArena = (points: number) => {
      const sortedArenas = [...ARENAS].sort((a, b) => b.minTrophies - a.minTrophies);
      return sortedArenas.find(a => points >= a.minTrophies) || ARENAS[0];
  };
  const currentArena = getCurrentArena(user.points);

  // --- GLOBAL ACTIONS ---
  const handleSurrender = () => {
      if (!window.confirm("Tem certeza que deseja desistir?")) return;
      setSurrendered(true);
      onScoreUpdate(-20);
      if (activeGame === 'MINESWEEPER') setMsViewState('PVP_RESULT');
      else if (activeGame === 'REFLEX') endReflexMatch(true);
  };
  
  const handleSwapMainGame = (newMain: GameType) => {
      setMainGamePreference(newMain);
      setActiveGame('HUB');
  };

  // ==========================================
  // MINESWEEPER LOGIC
  // ==========================================
  useEffect(() => {
    if (activeGame === 'MINESWEEPER' && msViewState === 'PVP_GAME') {
      startMinesweeperGrid();
    }
  }, [activeGame, msViewState, currentRound]);

  const handleStartMinesweeperRanked = (specificOpponent?: Friend) => {
    setActiveGame('MINESWEEPER');
    setMsViewState('MATCHMAKING');
    setSurrendered(false);
    
    // If challenging a friend, delay is shorter
    const delay = specificOpponent ? 1500 : 2000 + Math.random() * 2000;

    // Simulate Matchmaking delay
    setTimeout(() => {
        let matchedOpponent = specificOpponent;

        if (!matchedOpponent) {
             // 70% chance to find a friend, 30% chance to get the Bot
            const foundPlayer = Math.random() > 0.3 && friends.length > 0;
            matchedOpponent = foundPlayer 
                ? friends[Math.floor(Math.random() * friends.length)]
                : FITBOT;
        }

        setOpponent(matchedOpponent);
        setMsViewState('VS_ANIMATION');
        
        // Animation duration
        setTimeout(() => {
            setRoundsHistory([]);
            setCurrentRound(1);
            setMsViewState('PVP_GAME');
        }, 2500);
    }, delay);
  };

  const startMinesweeperGrid = () => {
    const newGrid: Cell[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      id: i,
      state: 'hidden',
      value: 'gem',
    }));
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const idx = Math.floor(Math.random() * newGrid.length);
      if (newGrid[idx].value !== 'mine') {
        newGrid[idx].value = 'mine';
        minesPlaced++;
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setCurrentTurnPoints(0);
    setMessage('');
    setMultiplier(1.0);
  };

  const handleCellClick = (id: number) => {
    if (gameOver || grid[id].state !== 'hidden') return;
    const newGrid = [...grid];
    const cell = newGrid[id];
    cell.state = 'revealed';

    if (cell.value === 'mine') {
      cell.state = 'exploded';
      setGameOver(true);
      const finalGrid = newGrid.map(c => c.value === 'mine' ? { ...c, state: 'exploded' as CellState } : c);
      setGrid(finalGrid);
      setMessage('BOMBA! 0 Pontos.');
      setTimeout(() => {
         finishPlayerTurnMsPvP(0);
      }, 1500);
    } else {
      const basePoints = 10;
      const newPoints = Math.floor(currentTurnPoints + (basePoints * multiplier));
      setCurrentTurnPoints(newPoints);
      setMultiplier(prev => parseFloat((prev + 0.2).toFixed(1))); 
      setGrid(newGrid);
    }
  };

  const handleCashOut = () => {
    setMessage(`Safe! +${currentTurnPoints} pts`);
    setGameOver(true);
    setTimeout(() => {
        finishPlayerTurnMsPvP(currentTurnPoints);
    }, 1000);
  };

  const finishPlayerTurnMsPvP = (score: number) => {
    setMsViewState('OPPONENT_TURN');
    simulateMsOpponentTurn(score);
  };

  const simulateMsOpponentTurn = (playerScore: number) => {
    setOpponentActionText(`${opponent?.name} está jogando...`);
    setTimeout(() => {
      const exploded = Math.random() < 0.3; // 30% chance opponent hits bomb
      let oppScore = 0;
      if (exploded) {
        setOpponentActionText(`${opponent?.name} explodiu uma bomba!`);
        oppScore = 0;
      } else {
        // Bot logic: try to beat player slightly or get a decent score
        const target = playerScore > 0 ? playerScore + 10 : 40;
        const variance = Math.floor(Math.random() * 30); 
        oppScore = target + variance;
        setOpponentActionText(`${opponent?.name} parou com ${oppScore} pontos!`);
      }
      
      const newHistory = [...roundsHistory, {
        round: currentRound,
        player: playerScore,
        opponent: oppScore
      }];
      setRoundsHistory(newHistory);
      
      setTimeout(() => {
        if (currentRound < MAX_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setMsViewState('PVP_GAME');
        } else {
          setMsViewState('PVP_RESULT');
          const totalPlayer = newHistory.reduce((acc, curr) => acc + curr.player, 0);
          const totalOpp = newHistory.reduce((acc, curr) => acc + curr.opponent, 0);
          if (totalPlayer > totalOpp) {
            onScoreUpdate(25); 
          } else if (totalPlayer < totalOpp) {
            onScoreUpdate(-15);
          }
        }
      }, 2500);
    }, 2000);
  };

  // ==========================================
  // REFLEX GAME LOGIC
  // ==========================================

  // 1. Matchmaking
  const startReflexMatchmaking = (difficulty: ReflexDifficulty, specificOpponent: Friend | null) => {
    setActiveGame('REFLEX'); // Ensure we switch view
    setReflexDifficulty(difficulty);
    setReflexState('MATCHMAKING');
    
    // Simulate searching delay
    setTimeout(() => {
        if (specificOpponent) {
            setOpponent(specificOpponent);
        } else {
            // Random bot from friends list if no specific opponent
            const randomOpp = friends[Math.floor(Math.random() * friends.length)];
            setOpponent(randomOpp);
        }
        setReflexState('VS_INTRO');
    }, specificOpponent ? 1500 : 2000);

    // VS Animation Duration
    setTimeout(() => {
        initializeReflexMatch();
    }, specificOpponent ? 4000 : 4500); 
  };

  const handleReflexFriendChallenge = (friend: Friend) => {
    setActiveGame('REFLEX');
    startReflexMatchmaking('MEDIUM', friend);
  };

  // 2. Initialize Match Data
  const initializeReflexMatch = () => {
    setReflexHistory([]);
    setReflexRound(1);
    setSurrendered(false);
    startReflexRoundSequence(1);
  };

  // 3. Round Logic (Turn Swapping)
  const startReflexRoundSequence = (round: number) => {
    // Reset Round Scores
    setCurrentRoundPlayerScore(0);
    setCurrentRoundOpponentScore(0);
    setReflexRound(round);

    // Order logic: 
    // Round 1: Player -> Opponent
    // Round 2: Opponent -> Player
    // Round 3: Player -> Opponent
    const firstTurn = round === 2 ? 'OPPONENT' : 'PLAYER';
    
    setReflexState('GAME');
    // Need a slight delay to let the render cycle update reflexState before starting loop
    setTimeout(() => {
        setActiveTurn(firstTurn);
        startTurn(firstTurn);
    }, 500);
  };

  const startTurn = (turn: TurnOwner) => {
    // Clear any existing loops first to avoid bugs
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
    
    setReflexTargets([]);
    
    // Game Duration: 10 seconds per turn (fast paced)
    let timeLeft = 10000; 
    const spawnInterval = 600; // Fast spawn

    // Spawn Loop
    const spawnLoop = setInterval(() => {
        const id = Date.now() + Math.random();
        const x = Math.floor(Math.random() * 70) + 15; 
        const y = Math.floor(Math.random() * 60) + 20;
        
        // If it's opponent, pre-calculate hit time
        let simulatedHitTime = undefined;
        if (turn === 'OPPONENT') {
            // AI Logic
            const hitChance = reflexDifficulty === 'EASY' ? 0.6 : reflexDifficulty === 'MEDIUM' ? 0.8 : 0.95;
            if (Math.random() < hitChance) {
                // They will hit it between 500ms and 900ms after spawn
                simulatedHitTime = Date.now() + 500 + Math.random() * 400;
            }
        }

        setReflexTargets(prev => [...prev, { id, x, y, spawnTime: Date.now(), hit: false, simulatedHitTime }]);
    }, spawnInterval);
    
    spawnTimerRef.current = spawnLoop;

    // AI Hit Checker (runs frequently)
    if (turn === 'OPPONENT') {
        const aiLoop = setInterval(() => {
            const now = Date.now();
            setReflexTargets(prev => {
                let newTargets = [...prev];
                let scoreAdded = 0;
                
                newTargets = newTargets.map(t => {
                    if (!t.hit && t.simulatedHitTime && now >= t.simulatedHitTime) {
                        // AI Hits it
                        scoreAdded += Math.random() > 0.7 ? 3 : 1; // 30% Perfect for AI
                        
                        // Visual feedback for AI
                        setReflexHitFeedback({ 
                            type: Math.random() > 0.7 ? 'PERFECT' : 'GOOD', 
                            x: t.x, 
                            y: t.y 
                        });
                        
                        return { ...t, hit: true };
                    }
                    return t;
                });
                
                if (scoreAdded > 0) {
                    setCurrentRoundOpponentScore(s => s + scoreAdded);
                }
                return newTargets;
            });
            // Clear feedback quickly (hacky but works for AI visuals)
            if (Math.random() > 0.8) setReflexHitFeedback(null);

        }, 100);
        aiIntervalRef.current = aiLoop;
    }

    // End Turn Timer
    setTimeout(() => {
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
        
        // Clear remaining targets
        setReflexTargets([]);
        setReflexHitFeedback(null);
        
        handleTurnEnd(turn);

    }, timeLeft);
  };

  const handleTurnEnd = (justFinished: TurnOwner) => {
      if (reflexRound === 1 || reflexRound === 3) {
          if (justFinished === 'PLAYER') {
              // Next is opponent
              setActiveTurn('OPPONENT');
              setTimeout(() => startTurn('OPPONENT'), 1000); // Brief pause
          } else {
              // Round Over
              finishRound();
          }
      } else if (reflexRound === 2) {
          // Round 2: Opponent starts
          if (justFinished === 'OPPONENT') {
               // Next is player
               setActiveTurn('PLAYER');
               setTimeout(() => startTurn('PLAYER'), 1000);
          } else {
               // Round Over
               finishRound();
          }
      }
  };

  const finishRound = () => {
      setReflexState('ROUND_RESULT');
      
      // Save history
      const winner = currentRoundPlayerScore > currentRoundOpponentScore ? 'PLAYER' : 
                     currentRoundOpponentScore > currentRoundPlayerScore ? 'OPPONENT' : 'TIE';
      
      const historyItem: ReflexRoundHistory = {
          round: reflexRound,
          playerScore: currentRoundPlayerScore,
          opponentScore: currentRoundOpponentScore,
          winner
      };
      
      setReflexHistory(prev => [...prev, historyItem]);

      setTimeout(() => {
          if (reflexRound < 3) {
              startReflexRoundSequence(reflexRound + 1);
          } else {
              endReflexMatch();
          }
      }, 3000); // Show round result for 3s
  };

  const endReflexMatch = (isSurrender = false) => {
      setReflexState('FINAL_RESULT');
      
      // Only calc score if finished properly
      if (!isSurrender) {
         const totalPlayer = reflexHistory.reduce((acc, curr) => acc + curr.playerScore, 0) + currentRoundPlayerScore;
         const totalOpp = reflexHistory.reduce((acc, curr) => acc + curr.opponentScore, 0) + currentRoundOpponentScore;
         
         if (totalPlayer > totalOpp) {
             onScoreUpdate(25);
         } else {
             onScoreUpdate(-10);
         }
      }
  };


  // 4. Interaction (Player Turn)
  const handleReflexTap = (target: ReflexTarget) => {
      if (target.hit || activeTurn !== 'PLAYER') return;

      const now = Date.now();
      const age = now - target.spawnTime;
      const idealTime = 1000; // Ring closing time
      const diff = Math.abs(age - idealTime);

      let points = 0;
      let type: ReflexHitType = 'MISS';

      // More forgiving hit windows
      if (diff < 250) {
          type = 'PERFECT';
          points = 3;
      } else if (diff < 550) {
          type = 'GOOD';
          points = 1;
      } else {
          type = 'MISS';
          points = 0;
      }

      // Visual Feedback
      setReflexHitFeedback({ type, x: target.x, y: target.y });
      setTimeout(() => setReflexHitFeedback(null), 400);

      if (type === 'MISS') {
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), 300);
      } else {
          setCurrentRoundPlayerScore(prev => prev + points);
      }

      // Mark as hit
      setReflexTargets(prev => prev.map(t => t.id === target.id ? { ...t, hit: true } : t));
  };

  useEffect(() => {
      return () => {
          if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
          if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
      };
  }, []);


  // ==========================================
  // TIC TAC TOE LOGIC (Deprioritized but kept for reference if needed)
  // ==========================================
  const startTTT = () => {
      setActiveGame('TICTACTOE');
      setTTTBoard(Array(9).fill(null));
      setTTTStatus('PLAYING');
      setTTTWinningLine(null);
  };

  const handleTTTMove = (index: number) => {
      if (tttBoard[index] || tttStatus !== 'PLAYING') return;

      const newBoard = [...tttBoard];
      newBoard[index] = 'HALTER'; // Player is always Halter
      setTTTBoard(newBoard);

      const result = checkTTTWinner(newBoard);
      if (result) {
          finishTTT(result, newBoard);
      } else {
          // CPU Move
          setTimeout(() => cpuTTTMove(newBoard), 500);
      }
  };

  const cpuTTTMove = (currentBoard: TTTPlayer[]) => {
      const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      
      if (emptyIndices.length === 0) return;

      // Simple Logic: 1. Win if can, 2. Block if must, 3. Random
      let move = -1;

      // 1. Check for win
      for (let idx of emptyIndices) {
          const testBoard = [...currentBoard];
          testBoard[idx] = 'WEIGHT';
          if (checkTTTWinner(testBoard) === 'WEIGHT') {
              move = idx;
              break;
          }
      }

      // 2. Block player
      if (move === -1) {
          for (let idx of emptyIndices) {
              const testBoard = [...currentBoard];
              testBoard[idx] = 'HALTER';
              if (checkTTTWinner(testBoard) === 'HALTER') {
                  move = idx;
                  break;
              }
          }
      }

      // 3. Random
      if (move === -1) {
          move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }

      const newBoard = [...currentBoard];
      newBoard[move] = 'WEIGHT';
      setTTTBoard(newBoard);

      const result = checkTTTWinner(newBoard);
      if (result) {
          finishTTT(result, newBoard);
      }
  };

  const checkTTTWinner = (board: TTTPlayer[]): 'HALTER' | 'WEIGHT' | 'DRAW' | null => {
      const lines = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
          [0, 4, 8], [2, 4, 6]             // Diagonals
      ];

      for (let line of lines) {
          const [a, b, c] = line;
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
              setTTTWinningLine(line);
              return board[a] as 'HALTER' | 'WEIGHT';
          }
      }

      if (!board.includes(null)) return 'DRAW';
      return null;
  };

  const finishTTT = (result: 'HALTER' | 'WEIGHT' | 'DRAW', board: TTTPlayer[]) => {
      if (result === 'HALTER') {
          setTTTStatus('WON');
          onScoreUpdate(15);
      } else if (result === 'WEIGHT') {
          setTTTStatus('LOST');
      } else {
          setTTTStatus('DRAW');
          onScoreUpdate(5);
      }
  };

  // ==========================================
  // RENDER: BATTLE HUB
  // ==========================================
  if (activeGame === 'HUB') {
      return (
          <div className="pb-24 h-full flex flex-col bg-[#121212] animate-fade-in relative overflow-hidden">
              {/* Top Bar */}
              <div className="flex justify-between items-start p-4 z-10">
                  <div className="flex items-center space-x-2 bg-gray-900/80 backdrop-blur-md p-2 pr-4 rounded-full border border-gray-700">
                       <div className="relative">
                           <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-indigo-500" />
                           <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-[10px] font-bold px-1.5 rounded-full border border-black">{user.level}</div>
                       </div>
                       <div>
                           <div className="text-xs text-gray-400 font-bold">{user.name}</div>
                           <div className="text-yellow-400 text-xs font-black flex items-center">
                               <Trophy size={12} className="mr-1"/> {user.points}
                           </div>
                       </div>
                  </div>
                  
                  {/* Top Right: Arenas Button */}
                  <button 
                    onClick={() => setActiveGame('ARENAS')}
                    className="bg-indigo-900/80 p-2 rounded-full border border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] active:scale-95 transition-transform"
                  >
                      <Shield size={20} fill="currentColor" className="text-indigo-300" />
                  </button>
              </div>

              {/* Center Stage - RANK / ARENA DISPLAY (CLICKABLE) */}
              <button 
                  onClick={() => setActiveGame('ARENAS')}
                  className="flex-1 flex flex-col items-center justify-center -mt-10 relative z-10 outline-none group"
              >
                  <div className="relative mb-6 group-active:scale-95 transition-transform duration-200">
                      {/* Rank Glow */}
                      <div className={`absolute inset-0 blur-3xl opacity-30 rounded-full ${
                          currentArena.id === 2 ? 'bg-yellow-500' : 
                          currentArena.id === 4 ? 'bg-cyan-500' : 
                          currentArena.id === 1 ? 'bg-orange-700' : 'bg-gray-400'
                      }`}></div>
                      
                      <div className="w-48 h-48 relative animate-float flex items-center justify-center">
                          {currentArena.id === 1 && <BronzeRankEmblem size={192} />}
                          {currentArena.id === 2 && <GoldRankEmblem size={192} />}
                          {currentArena.id === 3 && <SilverRankEmblem size={192} />}
                          {currentArena.id === 4 && <DiamondRankEmblem size={192} />}
                          
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-black/80 backdrop-blur px-6 py-2 rounded-xl border border-white/10 shadow-xl">
                              <div className="text-center">
                                  <div className="text-[10px] text-gray-400 uppercase tracking-widest">Arena Atual</div>
                                  <div className="text-xl font-black text-white uppercase italic whitespace-nowrap">{currentArena.name}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <p className="text-gray-500 text-xs animate-pulse group-hover:text-white transition-colors">Toque para ver o caminho</p>
              </button>

              {/* MAIN BATTLE BUTTON (DYNAMIC) */}
              <div className="flex justify-center mb-8 relative z-20">
                  {mainGamePreference === 'MINESWEEPER' ? (
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStartMinesweeperRanked();
                        }}
                        className="w-64 h-24 bg-gradient-to-b from-purple-600 to-purple-900 rounded-2xl border-b-8 border-purple-950 shadow-[0_10px_30px_rgba(147,51,234,0.4)] flex flex-col items-center justify-center active:border-b-0 active:translate-y-2 transition-all relative overflow-hidden group"
                      >
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                          
                          <div className="flex items-center space-x-3 relative z-10">
                              <Bomb size={28} className="text-white drop-shadow-md" />
                              <span className="text-3xl font-black text-white drop-shadow-md italic tracking-wider">JOGAR</span>
                          </div>
                          <span className="text-xs font-bold text-purple-200 uppercase tracking-widest relative z-10 mt-1">Campo Minado</span>
                      </button>
                  ) : (
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            startReflexMatchmaking('MEDIUM', null);
                        }}
                        className="w-64 h-24 bg-gradient-to-b from-orange-600 to-red-900 rounded-2xl border-b-8 border-red-950 shadow-[0_10px_30px_rgba(234,88,12,0.4)] flex flex-col items-center justify-center active:border-b-0 active:translate-y-2 transition-all relative overflow-hidden group"
                      >
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                          
                          <div className="flex items-center space-x-3 relative z-10">
                              <MousePointerClick size={28} className="text-white drop-shadow-md" />
                              <span className="text-3xl font-black text-white drop-shadow-md italic tracking-wider">JOGAR</span>
                          </div>
                          <span className="text-xs font-bold text-orange-200 uppercase tracking-widest relative z-10 mt-1">Reflexo</span>
                      </button>
                  )}
              </div>

              {/* FOOTER BUTTONS */}
              <div className="flex justify-between px-6 pb-6 relative z-20">
                  <button 
                    onClick={() => setActiveGame('OTHER_GAMES_MENU')}
                    className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors active:scale-95"
                  >
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-gray-700 shadow-lg">
                          <Gamepad2 size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase">Outros Games</span>
                  </button>

                  <button 
                    onClick={() => setActiveGame('FRIENDS_BATTLE_LIST')}
                    className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors active:scale-95"
                  >
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-gray-700 shadow-lg">
                          <Swords size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase">X1 Amigos</span>
                  </button>
              </div>
          </div>
      );
  }

  // ==========================================
  // RENDER: OTHER GAMES MENU
  // ==========================================
  if (activeGame === 'OTHER_GAMES_MENU') {
    return (
      <div className="min-h-screen bg-black text-white p-6 animate-fade-in">
         <div className="flex items-center mb-8">
            <button onClick={() => setActiveGame('HUB')} className="p-2 -ml-2 hover:bg-gray-800 rounded-full">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold ml-2">Outros Games</h1>
         </div>

         <div className="space-y-4">
             <p className="text-gray-500 text-sm mb-4">Selecione um jogo para torná-lo o principal.</p>

             {/* If Main is Minesweeper, show Reflex here */}
             {mainGamePreference === 'MINESWEEPER' && (
                <button 
                    onClick={() => handleSwapMainGame('REFLEX')}
                    className="w-full bg-gradient-to-r from-orange-900 to-red-900 border border-orange-500/30 p-6 rounded-2xl flex items-center space-x-4 hover:border-orange-500 transition-all active:scale-95 relative overflow-hidden"
                >
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-300 z-10">
                        <MousePointerClick size={32} />
                    </div>
                    <div className="text-left z-10">
                        <h3 className="text-lg font-bold text-white">Reflexo</h3>
                        <p className="text-xs text-gray-400">Definir como Principal</p>
                    </div>
                </button>
             )}

             {/* If Main is Reflex, show Minesweeper here */}
             {mainGamePreference === 'REFLEX' && (
                 <button 
                    onClick={() => handleSwapMainGame('MINESWEEPER')}
                    className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 p-6 rounded-2xl flex items-center space-x-4 hover:border-purple-500 transition-all active:scale-95 relative overflow-hidden"
                >
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 z-10">
                        <Bomb size={32} />
                    </div>
                    <div className="text-left z-10">
                        <h3 className="text-lg font-bold text-white">Campo Minado</h3>
                        <p className="text-xs text-gray-400">Definir como Principal</p>
                    </div>
                </button>
             )}
         </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: FRIENDS BATTLE LIST & CHALLENGE MODAL
  // ==========================================
  if (activeGame === 'FRIENDS_BATTLE_LIST') {
      return (
          <div className="min-h-screen bg-black text-white p-6 animate-fade-in relative">
              <div className="flex items-center mb-6">
                  <button onClick={() => setActiveGame('HUB')} className="p-2 -ml-2 hover:bg-gray-800 rounded-full">
                      <ChevronLeft size={24} />
                  </button>
                  <h1 className="text-xl font-bold ml-2">Desafiar Amigo</h1>
              </div>

              <div className="space-y-3">
                  {friends.map(friend => (
                      <div key={friend.id} className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                              <div className="relative">
                                  <img src={friend.avatar} className="w-12 h-12 rounded-full object-cover" />
                                  {friend.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900"></div>}
                              </div>
                              <div>
                                  <h3 className="font-bold">{friend.name}</h3>
                                  <p className="text-xs text-gray-500">{friend.points} pts</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => setChallengeModalFriend(friend)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-transform"
                          >
                              Desafiar
                          </button>
                      </div>
                  ))}
              </div>

              {/* Challenge Modal */}
              {challengeModalFriend && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
                          <button 
                            onClick={() => setChallengeModalFriend(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                          >
                              <X size={24} />
                          </button>

                          <div className="text-center mb-6">
                              <img src={challengeModalFriend.avatar} className="w-20 h-20 rounded-full border-4 border-indigo-500 mx-auto mb-3" />
                              <h2 className="text-xl font-bold text-white">Desafiar {challengeModalFriend.name}</h2>
                              <p className="text-gray-400 text-sm">Escolha o modo de batalha</p>
                          </div>

                          <div className="space-y-3">
                              <button 
                                onClick={() => {
                                    handleStartMinesweeperRanked(challengeModalFriend);
                                    setChallengeModalFriend(null);
                                }}
                                className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 p-4 rounded-xl flex items-center justify-between hover:border-purple-500 active:scale-95 transition-all"
                              >
                                  <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300">
                                          <Bomb size={20} />
                                      </div>
                                      <div className="text-left">
                                          <span className="block font-bold text-white">Campo Minado</span>
                                          <span className="text-xs text-gray-400">Estratégia e Sorte</span>
                                      </div>
                                  </div>
                                  <ChevronLeft size={20} className="rotate-180 text-gray-500" />
                              </button>

                              <button 
                                onClick={() => {
                                    setActiveGame('REFLEX');
                                    startReflexMatchmaking('MEDIUM', challengeModalFriend);
                                    setChallengeModalFriend(null);
                                }}
                                className="w-full bg-gradient-to-r from-orange-900 to-red-900 border border-orange-500/30 p-4 rounded-xl flex items-center justify-between hover:border-orange-500 active:scale-95 transition-all"
                              >
                                  <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-300">
                                          <MousePointerClick size={20} />
                                      </div>
                                      <div className="text-left">
                                          <span className="block font-bold text-white">Reflexo</span>
                                          <span className="text-xs text-gray-400">Agilidade Pura</span>
                                      </div>
                                  </div>
                                  <ChevronLeft size={20} className="rotate-180 text-gray-500" />
                              </button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // ==========================================
  // RENDER: MINESWEEPER GAME
  // ==========================================
  if (activeGame === 'MINESWEEPER') {
      if (msViewState === 'MATCHMAKING' || msViewState === 'VS_ANIMATION') {
          return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in">
                {msViewState === 'MATCHMAKING' ? (
                    <>
                        <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin-slow"></div>
                        </div>
                        <h2 className="text-xl font-bold text-white animate-pulse">
                            {opponent ? `Desafiando ${opponent.name}...` : "Procurando Oponente..."}
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">Rank: {currentArena.name}</p>
                        <div className="mt-8 flex space-x-2">
                             <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s'}}></div>
                             <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                             <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col relative overflow-hidden">
                         {/* VS Animation */}
                         <div className="flex-1 bg-purple-900/20 flex items-center justify-center relative animate-slide-in-left">
                             <div className="text-center">
                                 <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] mb-4 mx-auto" />
                                 <h2 className="text-3xl font-black text-white uppercase italic">{user.name}</h2>
                                 <div className="text-purple-400 font-bold text-xl flex items-center justify-center">
                                    <Trophy size={18} className="mr-2" />
                                    {user.points} pts
                                 </div>
                             </div>
                         </div>
                         
                         <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                             <div className="text-7xl font-black text-white italic drop-shadow-[0_5px_5px_rgba(0,0,0,1)] scale-150 animate-bounce-small">VS</div>
                         </div>

                         <div className="flex-1 bg-gray-800/50 flex items-center justify-center relative animate-slide-in-right">
                            {opponent ? (
                                <div className="text-center">
                                    <img src={opponent.avatar} className="w-32 h-32 rounded-full border-4 border-gray-500 shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-4 mx-auto" />
                                    <h2 className="text-3xl font-black text-white uppercase italic">{opponent.name}</h2>
                                    <div className="text-gray-400 font-bold text-xl flex items-center justify-center">
                                        {opponent.id === 'bot_1' ? (
                                            <>
                                                <Bot size={18} className="mr-2"/>
                                                <span>Inteligência Artificial</span>
                                            </>
                                        ) : (
                                            <span>{opponent.points} pts</span>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                         </div>
                    </div>
                )}
            </div>
          );
      }

      if (msViewState === 'PVP_GAME' || msViewState === 'OPPONENT_TURN' || msViewState === 'PVP_RESULT') {
          const totalPlayer = roundsHistory.reduce((acc, curr) => acc + curr.player, 0) + (msViewState === 'PVP_GAME' ? 0 : currentTurnPoints); // Don't double count in game
          const totalOpp = roundsHistory.reduce((acc, curr) => acc + curr.opponent, 0);

          if (msViewState === 'PVP_RESULT') {
               const won = totalPlayer > totalOpp;
               return (
                   <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in p-6 text-center">
                      {won ? (
                          <>
                            <Trophy size={80} className="text-yellow-400 mb-6 animate-bounce" />
                            <h1 className="text-5xl font-black text-white italic mb-2">VITÓRIA!</h1>
                            <p className="text-gray-400 mb-8">Você venceu a partida!</p>
                            <div className="text-yellow-400 text-3xl font-bold mb-8">+25 Troféus</div>
                          </>
                      ) : (
                          <>
                            <Bomb size={80} className="text-red-500 mb-6" />
                            <h1 className="text-5xl font-black text-white italic mb-2">DERROTA</h1>
                            <p className="text-gray-400 mb-8">Cuidado com as bombas...</p>
                            <div className="text-red-400 text-3xl font-bold mb-8">-15 Troféus</div>
                          </>
                      )}
                      <div className="flex space-x-8 mb-12">
                          <div className="text-center">
                              <div className="text-4xl font-black text-white">{totalPlayer}</div>
                              <div className="text-xs text-gray-500 uppercase">Você</div>
                          </div>
                          <div className="text-center">
                              <div className="text-4xl font-black text-gray-500">{totalOpp}</div>
                              <div className="text-xs text-gray-600 uppercase">Oponente</div>
                          </div>
                      </div>
                      <button 
                        onClick={() => setActiveGame('HUB')}
                        className="w-full max-w-xs bg-white text-black font-black py-4 rounded-xl shadow-xl active:scale-95 transition-transform"
                      >
                          CONTINUAR
                      </button>
                   </div>
               );
          }

          return (
              <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col overflow-hidden">
                  {/* HUD */}
                  <div className="bg-gray-800 p-4 pb-6 rounded-b-3xl shadow-2xl z-10">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-2">
                               <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white border-2 border-indigo-400">
                                   You
                               </div>
                               <div className="flex flex-col">
                                   <span className="text-[10px] text-gray-400 uppercase font-bold">Pontos Totais</span>
                                   <span className="text-xl font-black text-white leading-none">{roundsHistory.reduce((a, b) => a + b.player, 0)}</span>
                               </div>
                          </div>
                          
                          <div className="flex flex-col items-center">
                              <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">Round {currentRound}/{MAX_ROUNDS}</div>
                              <div className="px-3 py-1 bg-black/50 rounded border border-gray-700 text-xs text-gray-400">
                                  {msViewState === 'OPPONENT_TURN' ? 'Vez do Oponente' : 'Sua Vez'}
                              </div>
                          </div>

                          <div className="flex items-center space-x-2 justify-end">
                               <div className="flex flex-col items-end">
                                   <span className="text-[10px] text-gray-400 uppercase font-bold">Oponente</span>
                                   <span className="text-xl font-black text-white leading-none">{totalOpp}</span>
                               </div>
                               <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center font-bold text-red-200 border-2 border-red-900">
                                   {opponent?.name.charAt(0)}
                               </div>
                          </div>
                      </div>

                      {/* Current Turn Stats */}
                      <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5">
                           <div className="flex items-center space-x-2">
                               <Diamond size={16} className="text-cyan-400" />
                               <span className="text-cyan-400 font-bold text-lg">{currentTurnPoints}</span>
                               <span className="text-xs text-gray-500">neste round</span>
                           </div>
                           <div className="text-xs font-bold text-purple-400">Multiplicador: {multiplier}x</div>
                      </div>
                  </div>

                  {/* Message Overlay */}
                  {message && (
                      <div className="absolute top-40 left-0 right-0 flex justify-center z-20 pointer-events-none">
                          <div className="bg-black/80 backdrop-blur text-white px-6 py-2 rounded-full font-bold animate-bounce border border-white/10">
                              {message}
                          </div>
                      </div>
                  )}

                  {/* Game Grid */}
                  <div className="flex-1 flex items-center justify-center p-4 relative">
                      {msViewState === 'OPPONENT_TURN' && (
                          <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                              <h3 className="text-xl font-bold text-white animate-pulse">{opponentActionText || "Oponente jogando..."}</h3>
                          </div>
                      )}

                      <div className="grid grid-cols-5 gap-2 w-full max-w-sm aspect-square">
                          {grid.map((cell) => (
                              <button
                                key={cell.id}
                                onClick={() => handleCellClick(cell.id)}
                                disabled={gameOver || cell.state !== 'hidden' || msViewState !== 'PVP_GAME'}
                                className={`
                                    relative rounded-xl flex items-center justify-center text-2xl transition-all duration-300
                                    ${cell.state === 'hidden' ? 'bg-gray-700 hover:bg-gray-600 active:scale-95 shadow-[0_4px_0_#374151]' : ''}
                                    ${cell.state === 'revealed' ? 'bg-gray-800 border border-gray-700 shadow-inner' : ''}
                                    ${cell.state === 'exploded' ? 'bg-red-500/20 border-2 border-red-500 animate-shake' : ''}
                                `}
                              >
                                  {cell.state === 'revealed' && cell.value === 'gem' && <Diamond className="text-cyan-400 animate-pop" size={24} />}
                                  {cell.state === 'exploded' && <Bomb className="text-red-500" size={24} />}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Controls */}
                  <div className="p-6 bg-gray-800 border-t border-gray-700">
                      <button 
                        onClick={handleCashOut}
                        disabled={currentTurnPoints === 0 || msViewState !== 'PVP_GAME'}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black text-lg rounded-xl shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wide"
                      >
                          PARAR E PONTUAR ({currentTurnPoints})
                      </button>
                  </div>
              </div>
          );
      }
  }

  // ==========================================
  // RENDER: TICTACTOE GAME
  // ==========================================
  if (activeGame === 'TICTACTOE') {
     return (
         <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 animate-fade-in relative">
             <div className="absolute top-4 left-4">
                 <button onClick={() => setActiveGame('HUB')} className="p-2 bg-gray-800 rounded-full text-white">
                     <ChevronLeft size={24} />
                 </button>
             </div>

             <h2 className="text-3xl font-bold text-white mb-2">Jogo da Velha</h2>
             <div className="flex items-center space-x-8 mb-8">
                 <div className={`flex flex-col items-center ${tttStatus === 'PLAYING' ? 'opacity-100' : 'opacity-50'}`}>
                     <span className="text-4xl mb-2">🏋️‍♂️</span>
                     <span className="text-xs font-bold text-indigo-400">VOCÊ</span>
                 </div>
                 <div className="text-2xl font-bold text-gray-600">VS</div>
                 <div className="flex flex-col items-center opacity-50">
                     <span className="text-4xl mb-2">🔘</span>
                     <span className="text-xs font-bold text-red-400">CPU</span>
                 </div>
             </div>

             <div className="bg-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-700">
                 <div className="grid grid-cols-3 gap-2">
                     {tttBoard.map((cell, idx) => (
                         <button
                             key={idx}
                             disabled={!!cell || tttStatus !== 'PLAYING'}
                             onClick={() => handleTTTMove(idx)}
                             className={`w-24 h-24 bg-gray-900 rounded-xl flex items-center justify-center text-4xl transition-all 
                                 ${!cell && tttStatus === 'PLAYING' ? 'hover:bg-gray-700 active:scale-95' : ''}
                                 ${tttWinningLine?.includes(idx) ? 'bg-green-900/50 ring-2 ring-green-500' : ''}
                             `}
                         >
                             {cell === 'HALTER' && '🏋️‍♂️'}
                             {cell === 'WEIGHT' && '🔘'}
                         </button>
                     ))}
                 </div>
             </div>

             {tttStatus !== 'PLAYING' && (
                 <div className="mt-8 animate-bounce text-center">
                     {tttStatus === 'WON' && <div className="text-green-400 text-2xl font-black mb-2">VITÓRIA! (+15 pts)</div>}
                     {tttStatus === 'LOST' && <div className="text-red-400 text-2xl font-black mb-2">DERROTA</div>}
                     {tttStatus === 'DRAW' && <div className="text-gray-400 text-2xl font-black mb-2">EMPATE (+5 pts)</div>}
                     
                     <button 
                        onClick={startTTT}
                        className="mt-2 px-8 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                     >
                         Jogar Novamente
                     </button>
                 </div>
             )}
         </div>
     );
  }


  // ==========================================
  // RENDER: ARENAS PATH
  // ==========================================
  if (activeGame === 'ARENAS') {
      // Calculate progress to next arena
      const nextArena = [...ARENAS].sort((a, b) => a.minTrophies - a.minTrophies).find(a => a.minTrophies > user.points);
      const prevArena = getCurrentArena(user.points);
      
      let progress = 0;
      if (nextArena) {
          const totalRange = nextArena.minTrophies - prevArena.minTrophies;
          const currentProgress = user.points - prevArena.minTrophies;
          progress = Math.min(100, Math.max(0, (currentProgress / totalRange) * 100));
      } else {
          progress = 100; // Max rank
      }

      return (
          <div className="min-h-screen bg-[#1a1a2e] text-white overflow-y-auto pb-24 animate-fade-in">
              <div className="fixed top-0 left-0 right-0 bg-[#1a1a2e]/90 backdrop-blur-md z-20 p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                      <button onClick={() => setActiveGame('HUB')} className="p-2 -ml-2 hover:bg-white/10 rounded-full">
                          <ChevronLeft size={24} />
                      </button>
                      <h2 className="text-lg font-bold">Caminho de Troféus</h2>
                      <div className="flex items-center space-x-1 bg-black/40 px-3 py-1 rounded-full border border-yellow-500/30">
                          <Trophy size={14} className="text-yellow-400" />
                          <span className="text-yellow-400 font-bold text-sm">{user.points}</span>
                      </div>
                  </div>
              </div>

              <div className="pt-20 px-6 pb-10 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-10 top-20 bottom-0 w-1 bg-gray-800"></div>
                  
                  {/* Progress Line fill */}
                  <div className="absolute left-10 top-20 w-1 bg-yellow-500 transition-all duration-1000" style={{ height: `${Math.min(100, (user.points / 600) * 100)}%` }}></div>

                  <div className="space-y-12 relative z-10">
                      {ARENAS.map((arena) => {
                          const isUnlocked = user.points >= arena.minTrophies;
                          const isCurrent = currentArena.id === arena.id;

                          return (
                              <div key={arena.id} className={`relative pl-12 group ${isUnlocked ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                  {/* Dot on line */}
                                  <div className={`absolute left-[34px] top-8 w-4 h-4 rounded-full border-4 border-[#1a1a2e] transition-colors ${isUnlocked ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>

                                  <div className={`bg-gradient-to-r ${arena.color} p-1 rounded-2xl shadow-lg transform transition-transform ${isCurrent ? 'scale-105 ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#1a1a2e]' : ''}`}>
                                      <div className="bg-[#1a1a2e] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                                          {/* Background Emblem Faded */}
                                          <div className="absolute -right-4 bottom-0 opacity-10 transform translate-x-2 translate-y-4">
                                              {arena.id === 1 && <BronzeRankEmblem size={140} />}
                                              {arena.id === 2 && <GoldRankEmblem size={140} />}
                                              {arena.id === 3 && <SilverRankEmblem size={140} />}
                                              {arena.id === 4 && <DiamondRankEmblem size={140} />}
                                          </div>

                                          <div className="relative z-10 flex items-center w-full">
                                              {/* Left Side Emblem */}
                                              <div className="mr-4 -ml-2 drop-shadow-lg">
                                                  {arena.id === 1 && <BronzeRankEmblem size={60} />}
                                                  {arena.id === 2 && <GoldRankEmblem size={60} />}
                                                  {arena.id === 3 && <SilverRankEmblem size={60} />}
                                                  {arena.id === 4 && <DiamondRankEmblem size={60} />}
                                              </div>

                                              <div className="flex-1">
                                                  <div className="flex items-center space-x-2 mb-1">
                                                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{arena.minTrophies} Troféus</span>
                                                  </div>
                                                  <h3 className="text-xl font-black italic text-white leading-none">{arena.name}</h3>
                                                  {isCurrent && (
                                                      <div className="mt-1 inline-block bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                                          ATUAL
                                                      </div>
                                                  )}
                                              </div>
                                              
                                              {/* Unlock Status */}
                                              <div className="relative z-10 ml-2">
                                                  {isUnlocked ? <CheckCircle size={24} className="text-green-500" /> : <Lock size={24} className="text-gray-500"/>}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  // ==========================================
  // RENDER: FRIENDS BATTLE LIST (EXISTING)
  // ==========================================
  // ... (Original Logic for Friends List will be replaced above by the new version with Modal)
  
  // ==========================================
  // RENDER: REFLEX GAME (EXISTING)
  // ==========================================
  if (activeGame === 'REFLEX') {
       // ... (Keeping the original Reflex UI logic)
      if (reflexState === 'LOBBY') return null; // Should trigger matchmaking immediately

      if (reflexState === 'MATCHMAKING' || reflexState === 'VS_INTRO') {
          return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in">
                {reflexState === 'MATCHMAKING' ? (
                    <>
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                        <h2 className="text-xl font-bold text-white animate-pulse">
                             {opponent ? `Desafiando ${opponent.name}...` : "Procurando Oponente..."}
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">Rank: {currentArena.name}</p>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col relative overflow-hidden">
                         {/* VS Animation */}
                         <div className="flex-1 bg-blue-900/20 flex items-center justify-center relative animate-slide-in-left">
                             <div className="text-center">
                                 <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4 mx-auto" />
                                 <h2 className="text-3xl font-black text-white uppercase italic">{user.name}</h2>
                                 <div className="text-blue-400 font-bold text-xl flex items-center justify-center">
                                    <Trophy size={18} className="mr-2" />
                                    {user.points} pts
                                 </div>
                             </div>
                         </div>
                         
                         <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                             <div className="text-7xl font-black text-white italic drop-shadow-[0_5px_5px_rgba(0,0,0,1)] scale-150 animate-bounce-small">VS</div>
                         </div>

                         <div className="flex-1 bg-red-900/20 flex items-center justify-center relative animate-slide-in-right">
                            {opponent ? (
                                <div className="text-center">
                                    <img src={opponent.avatar} className="w-32 h-32 rounded-full border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] mb-4 mx-auto" />
                                    <h2 className="text-3xl font-black text-white uppercase italic">{opponent.name}</h2>
                                    <div className="text-red-400 font-bold text-xl flex items-center justify-center">
                                        {opponent.id === 'bot_1' ? (
                                            <>
                                                <Bot size={18} className="mr-2"/>
                                                <span>Inteligência Artificial</span>
                                            </>
                                        ) : (
                                            <span>{opponent.points} pts</span>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                         </div>
                    </div>
                )}
            </div>
          );
      }

      if (reflexState === 'GAME' || reflexState === 'ROUND_RESULT') {
          return (
              <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col overflow-hidden touch-none select-none">
                  {/* Header HUD */}
                  <div className="h-20 bg-gray-800 flex items-center justify-between px-4 border-b border-gray-700 z-10">
                      <div className={`flex flex-col items-center transition-all ${activeTurn === 'PLAYER' ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
                          <span className="text-xs text-blue-400 font-bold mb-1">VOCÊ</span>
                          <div className="text-3xl font-black text-white leading-none">{currentRoundPlayerScore}</div>
                      </div>

                      <div className="flex flex-col items-center">
                          <div className="text-xs font-bold text-gray-500 mb-1">ROUND {reflexRound}/3</div>
                          <div className="px-3 py-1 bg-black/40 rounded text-xs font-bold text-yellow-500 border border-yellow-500/30">
                              {activeTurn === 'PLAYER' ? 'SUA VEZ' : 'VEZ DO OPONENTE'}
                          </div>
                      </div>

                      <div className={`flex flex-col items-center transition-all ${activeTurn === 'OPPONENT' ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
                          <span className="text-xs text-red-400 font-bold mb-1">RIVAL</span>
                          <div className="text-3xl font-black text-white leading-none">{currentRoundOpponentScore}</div>
                      </div>
                  </div>

                  {/* Game Area */}
                  <div className={`flex-1 relative overflow-hidden ${screenShake ? 'animate-shake' : ''}`}>
                       {/* Tap Targets */}
                       {reflexTargets.map(target => (
                           !target.hit && (
                               <button
                                key={target.id}
                                onPointerDown={() => handleReflexTap(target)}
                                className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-transparent flex items-center justify-center active:scale-95 transition-transform"
                                style={{ left: `${target.x}%`, top: `${target.y}%` }}
                               >
                                   {/* Outer Ring shrinking */}
                                   <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-50 animate-ping-slow"></div>
                                   {/* Core */}
                                   <div className="w-12 h-12 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-2 border-white relative">
                                       <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                                   </div>
                               </button>
                           )
                       ))}

                       {/* Feedback Text */}
                       {reflexHitFeedback && (
                           <div 
                            className="absolute text-2xl font-black italic text-white drop-shadow-lg pointer-events-none animate-float-up"
                            style={{ left: `${reflexHitFeedback.x}%`, top: `${reflexHitFeedback.y}%`, transform: 'translate(-50%, -50%)' }}
                           >
                               {reflexHitFeedback.type === 'PERFECT' && <span className="text-yellow-400">PERFEITO!</span>}
                               {reflexHitFeedback.type === 'GOOD' && <span className="text-green-400">BOA!</span>}
                               {reflexHitFeedback.type === 'MISS' && <span className="text-red-500">ERROU!</span>}
                           </div>
                       )}
                       
                       {/* Round Result Overlay */}
                       {reflexState === 'ROUND_RESULT' && (
                           <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 animate-fade-in">
                               <div className="text-center transform scale-110">
                                   <h2 className="text-4xl font-black text-white italic mb-2">FIM DO ROUND {reflexRound}</h2>
                                   {currentRoundPlayerScore > currentRoundOpponentScore ? (
                                       <span className="text-green-400 font-bold text-xl">Você venceu o round!</span>
                                   ) : currentRoundPlayerScore < currentRoundOpponentScore ? (
                                       <span className="text-red-400 font-bold text-xl">Oponente venceu o round!</span>
                                   ) : (
                                       <span className="text-gray-400 font-bold text-xl">Empate!</span>
                                   )}
                               </div>
                           </div>
                       )}
                  </div>

                  {/* Footer Surrender */}
                  <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-center">
                       <button onClick={handleSurrender} className="text-red-400 text-xs font-bold border border-red-900 bg-red-900/20 px-4 py-2 rounded-lg uppercase">
                           Desistir
                       </button>
                  </div>
              </div>
          );
      }

      if (reflexState === 'FINAL_RESULT') {
          const totalPlayer = reflexHistory.reduce((acc, curr) => acc + curr.playerScore, 0);
          const totalOpp = reflexHistory.reduce((acc, curr) => acc + curr.opponentScore, 0);
          const won = totalPlayer > totalOpp;
          
          return (
              <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in p-6 text-center">
                  {won ? (
                      <>
                        <Trophy size={80} className="text-yellow-400 mb-6 animate-bounce" />
                        <h1 className="text-5xl font-black text-white italic mb-2">VITÓRIA!</h1>
                        <p className="text-gray-400 mb-8">Você dominou a arena!</p>
                        <div className="text-yellow-400 text-3xl font-bold mb-8">+25 Troféus</div>
                      </>
                  ) : (
                      <>
                        <AlertTriangle size={80} className="text-red-500 mb-6" />
                        <h1 className="text-5xl font-black text-white italic mb-2">DERROTA</h1>
                        <p className="text-gray-400 mb-8">Mais sorte na próxima...</p>
                        <div className="text-red-400 text-3xl font-bold mb-8">-10 Troféus</div>
                      </>
                  )}

                  <div className="flex space-x-8 mb-12">
                      <div className="text-center">
                          <div className="text-4xl font-black text-white">{totalPlayer}</div>
                          <div className="text-xs text-gray-500 uppercase">Seus Pontos</div>
                      </div>
                      <div className="text-center">
                          <div className="text-4xl font-black text-gray-500">{totalOpp}</div>
                          <div className="text-xs text-gray-600 uppercase">Oponente</div>
                      </div>
                  </div>

                  <button 
                    onClick={() => setActiveGame('HUB')}
                    className="w-full max-w-xs bg-white text-black font-black py-4 rounded-xl shadow-xl active:scale-95 transition-transform"
                  >
                      CONTINUAR
                  </button>
              </div>
          );
      }
  }

  // Fallback if state is weird
  return null;
};

export default Battle;
