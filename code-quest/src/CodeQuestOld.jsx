import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ChevronRight, Star, Lock, Map, Code, Info, Terminal, RefreshCw, CheckCircle, XCircle, Zap, Cpu, Activity, BookOpen, Gem, DoorClosed, DoorOpen, Fingerprint, Radio, Copy, Layers, Edit, Save, Trash2, Eye, EyeOff, MousePointer } from 'lucide-react';

// --- DONNÉES PÉDAGOGIQUES (ROADMAP) ---
const MODULES = [
  { id: 1, title: "La Séquence", desc: "Donner des ordres dans le bon ordre.", phase: "Logique", color: "bg-blue-500" },
  { id: 2, title: "Le Débuggage", desc: "Le code est cassé ! Trouve l'erreur.", phase: "Logique", color: "bg-blue-600" },
  { id: 3, title: "Précision", desc: "Répéter des actions sans se tromper.", phase: "Logique", color: "bg-indigo-500" },
  { id: 4, title: "Conditions", desc: "Le robot doit réagir aux murs.", phase: "Intelligence", color: "bg-purple-500" },
  { id: 5, title: "Boucles Tant Que", desc: "Avancer tant que la voie est libre.", phase: "Intelligence", color: "bg-purple-600" },
  { id: 6, title: "Logique Avancée", desc: "Algorithmes de décision (IA).", phase: "Intelligence", color: "bg-purple-700" },
  { id: 7, title: "Les Variables", desc: "Stocker de l'information (Score).", phase: "Données", color: "bg-emerald-500" },
  { id: 8, title: "Coordonnées", desc: "Se téléporter sur la carte (X, Y).", phase: "Données", color: "bg-emerald-600" },
  { id: 9, title: "Événements", desc: "Actionner des mécanismes.", phase: "Données", color: "bg-teal-500" },
  { id: 10, title: "Fonctions", desc: "Créer tes propres super-blocs.", phase: "Architecture", color: "bg-orange-500" },
  { id: 11, title: "Clonage", desc: "Envoyer des robots à distance.", phase: "Architecture", color: "bg-orange-600" },
  { id: 12, title: "Projet Final", desc: "Le défi ultime !", phase: "Architecture", color: "bg-red-500" },
];

// --- DONNÉES DES NIVEAUX (CONFIGURATION) ---
const LEVELS_DATA = {
  1: {
    gridSize: 5,
    start: { x: 0, y: 2, dir: 1 },
    goal: { x: 4, y: 2 },
    obstacles: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 4 }],
    maxBlocks: 5,
    par: 4, 
    availableTools: ['move', 'left', 'right'],
    initialCode: [],
    hint: "Utilise plusieurs blocs 'Avancer' pour traverser.",
    pedagogy: { concept: "L'Algorithme", explanation: "Une suite d'instructions précises.", realWorld: "Comme une recette de cuisine." }
  },
  2: {
    gridSize: 5,
    start: { x: 1, y: 4, dir: 0 },
    goal: { x: 3, y: 4 },
    obstacles: [{ x: 2, y: 4 }, { x: 2, y: 3 }],
    maxBlocks: 8,
    par: 6,
    availableTools: ['move', 'left', 'right'],
    initialCode: [{ id: 'bug1', type: 'move' }, { id: 'bug2', type: 'move' }, { id: 'bug3', type: 'right' }, { id: 'bug4', type: 'move' }], 
    hint: "Le mur est moins haut ! Tu peux passer par dessus (y=2).",
    pedagogy: { concept: "Le Débuggage", explanation: "Corriger un code existant.", realWorld: "Les développeurs passent 50% de leur temps à corriger des bugs." }
  },
  3: {
    gridSize: 6,
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 5, y: 5 },
    obstacles: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 4, y: 2 }, { x: 4, y: 3 }],
    maxBlocks: 14,
    par: 12,
    availableTools: ['move', 'left', 'right'],
    initialCode: [],
    hint: "Passe par le trou au centre du mur.",
    pedagogy: { concept: "Séquence", explanation: "L'ordre des instructions est crucial.", realWorld: "Automatisation industrielle." }
  },
  4: {
    gridSize: 5,
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 2, y: 2 },
    obstacles: [{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:3}],
    maxBlocks: 10,
    par: 10,
    availableTools: ['move', 'left', 'right', 'if_wall_right'],
    initialCode: [],
    hint: "Défi : Faisable en 10 blocs pile !",
    pedagogy: { concept: "Conditions", explanation: "Si... Alors...", realWorld: "Thermostat intelligent." }
  },
  5: {
    gridSize: 8,
    start: { x: 0, y: 3, dir: 1 },
    goal: { x: 7, y: 3 },
    obstacles: [...Array.from({length: 8}, (_, i) => ({x: i, y: 2})), ...Array.from({length: 8}, (_, i) => ({x: i, y: 4})), {x:0, y:0}, {x:1, y:1}, {x:7, y:0}, {x:6, y:7}, {x:2, y:6}],
    maxBlocks: 3,
    par: 1,
    availableTools: ['move', 'left', 'right', 'dash'],
    initialCode: [],
    hint: "Utilise le 'Dash' pour traverser d'un coup.",
    pedagogy: { concept: "Boucles (While)", explanation: "Répéter tant que c'est possible.", realWorld: "Traitement de listes de données." }
  },
  6: {
    gridSize: 7,
    start: { x: 1, y: 5, dir: 0 },
    goal: { x: 5, y: 1 },
    obstacles: [{x:0, y:5}, {x:0, y:4}, {x:0, y:3}, {x:0, y:2}, {x:0, y:1}, {x:2, y:5}, {x:2, y:4}, {x:2, y:3}, {x:2, y:2}, {x:4, y:4}, {x:4, y:3}, {x:4, y:2}, {x:4, y:1}, {x:6, y:5}, {x:6, y:4}, {x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:1, y:0}, {x:3, y:6}, {x:5, y:0}, {x:5, y:6}],
    maxBlocks: 5,
    par: 3,
    availableTools: ['move', 'left', 'right', 'auto_path'],
    initialCode: [],
    hint: "L'Auto-Pilote : Avance + Virage intelligent.",
    pedagogy: { concept: "IA / Algorithme Complexe", explanation: "Déléguer la logique.", realWorld: "Voitures autonomes." }
  },
  7: {
    gridSize: 6,
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 5, y: 5 },
    obstacles: [{x:1, y:1}, {x:2, y:2}, {x:3, y:3}, {x:4, y:4}, {x:5, y:0}, {x:0, y:5}],
    items: [{ x: 2, y: 0, type: 'crystal' }, { x: 0, y: 2, type: 'crystal' }, { x: 5, y: 3, type: 'crystal' }],
    gate: { x: 4, y: 5, req: 3 },
    maxBlocks: 15,
    par: 12,
    availableTools: ['move', 'left', 'right', 'collect'],
    initialCode: [],
    hint: "Ramasse les 3 cristaux pour ouvrir la porte.",
    pedagogy: { concept: "Les Variables", explanation: "Score = Score + 1.", realWorld: "Points de vie dans les jeux." }
  },
  8: {
    gridSize: 7,
    start: { x: 0, y: 3, dir: 1 },
    goal: { x: 6, y: 3 },
    obstacles: [{x:3, y:0}, {x:3, y:1}, {x:3, y:2}, {x:3, y:3}, {x:3, y:4}, {x:3, y:5}, {x:3, y:6}],
    teleporters: [{ x: 2, y: 3, targetX: 4, targetY: 3 }],
    maxBlocks: 6,
    par: 3,
    availableTools: ['move', 'left', 'right'],
    initialCode: [],
    hint: "Marche sur la dalle bleue pour te téléporter.",
    pedagogy: { concept: "Coordonnées (X,Y)", explanation: "Déplacement instantané vers (4,3).", realWorld: "Pixels sur un écran." }
  },
  9: {
    gridSize: 6,
    start: { x: 0, y: 0, dir: 2 },
    goal: { x: 5, y: 2 },
    obstacles: [{x:3, y:0}, {x:3, y:1}, {x:3, y:3}, {x:3, y:4}, {x:3, y:5}],
    switches: [{ x: 0, y: 2, linkId: 1 }],
    doors: [{ x: 3, y: 2, id: 1, state: 'closed' }],
    maxBlocks: 12,
    par: 9,
    availableTools: ['move', 'left', 'right', 'interact'],
    initialCode: [],
    hint: "La porte est fermée ! Active l'interrupteur en (0,2) sur ta route.",
    pedagogy: { concept: "Les Événements", explanation: "L'action 'Actionner' déclenche l'événement 'Ouverture'.", realWorld: "Relation Cause (Clic) -> Effet (Action)." }
  },
  10: {
    gridSize: 6,
    start: { x: 0, y: 5, dir: 0 },
    goal: { x: 5, y: 0 },
    obstacles: [
       {x:0, y:4}, {x:0, y:3}, {x:0, y:2}, {x:0, y:1}, {x:0, y:0},
       {x:1, y:5}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}, {x:1, y:0},
       {x:2, y:5}, {x:2, y:4}, {x:2, y:2}, {x:2, y:1}, {x:2, y:0},
       {x:3, y:5}, {x:3, y:4}, {x:3, y:3}, {x:3, y:0},
       {x:4, y:5}, {x:4, y:4}, {x:4, y:3}, {x:4, y:2},
       {x:5, y:5}, {x:5, y:4}, {x:5, y:3}, {x:5, y:2}, {x:5, y:1},
    ],
    maxBlocks: 6,
    par: 5,
    availableTools: ['func_stairs'],
    initialCode: [],
    hint: "Le motif se répète 5 fois. Utilise la super-fonction 'Marche' !",
    pedagogy: { concept: "Les Fonctions", explanation: "Une commande qui en contient 4 autres.", realWorld: "Abstraction de code." }
  },
  11: {
    gridSize: 7,
    start: { x: 3, y: 3, dir: 1 }, 
    goal: { x: 6, y: 3 },
    obstacles: [
      {x:3, y:4}, {x:2, y:3}, 
      {x:2, y:2}, {x:4, y:2}, 
      {x:2, y:1}, {x:4, y:1},
      {x:2, y:0}, {x:4, y:0}, {x:3, y:-1}
    ],
    switches: [{ x: 3, y: 0, linkId: 1 }],
    doors: [{ x: 4, y: 3, id: 1, state: 'closed' }],
    maxBlocks: 8,
    par: 6,
    availableTools: ['left', 'right', 'send_clone', 'move'],
    initialCode: [],
    hint: "Tourne-toi vers le haut et envoie un Clone activer l'interrupteur.",
    pedagogy: { concept: "Multi-Tâches", explanation: "Exécution parallèle.", realWorld: "Serveurs & Threads." }
  },
  12: {
    gridSize: 8,
    start: { x: 0, y: 7, dir: 1 },
    goal: { x: 7, y: 0 },
    obstacles: [
      {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}, 
      {x:4, y:7}, 
      {x:6, y:1}, {x:6, y:2}, {x:6, y:3}, {x:6, y:4}, {x:6, y:5}, 
      {x:1, y:4}, {x:2, y:4}, {x:3, y:4}, {x:4, y:4}, 
      {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, 
    ],
    items: [{ x: 7, y: 7, type: 'crystal' }],
    gate: { x: 7, y: 1, req: 1 }, 
    teleporters: [{ x: 0, y: 0, targetX: 7, targetY: 6 }],
    switches: [],
    maxBlocks: 20,
    par: 9,
    availableTools: ['move', 'left', 'right', 'dash', 'auto_path', 'collect', 'func_stairs'],
    initialCode: [],
    hint: "Cherche le téléporteur caché en haut à gauche (0,0) !",
    pedagogy: { concept: "Architecte Logiciel", explanation: "Synthèse de tous les acquis.", realWorld: "Développement d'application complète." }
  }
};

// --- COMPOSANTS UI ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, title = '' }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white border-b-4 border-indigo-800",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border-b-4 border-slate-900",
    success: "bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700",
    danger: "bg-rose-500 hover:bg-rose-400 text-white border-b-4 border-rose-700",
    purple: "bg-purple-600 hover:bg-purple-500 text-white border-b-4 border-purple-800",
    orange: "bg-orange-500 hover:bg-orange-400 text-white border-b-4 border-orange-700",
    cyan: "bg-cyan-500 hover:bg-cyan-400 text-white border-b-4 border-cyan-700",
    teal: "bg-teal-600 hover:bg-teal-500 text-white border-b-4 border-teal-800",
  };

  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

// --- MOTEUR DE JEU ---

export default function CodeQuestApp() {
  const [view, setView] = useState('menu');
  const [unlockedModules, setUnlockedModules] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [activeModule, setActiveModule] = useState(1);
  
  // Custom Level Editor State
  const [customLevel, setCustomLevel] = useState(null);
  const [editorGrid, setEditorGrid] = useState([]);
  const [editorTool, setEditorTool] = useState('wall');
  const editorSize = 8; // setEditorSize n'est jamais utilisé

  const [program, setProgram] = useState([]);
  const [robotState, setRobotState] = useState({ x: 0, y: 0, dir: 1 });
  
  const [levelState, setLevelState] = useState({
    itemsCollected: 0,
    collectedItemsIds: [],
    doorsOpen: [],
    clones: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const [gameStatus, setGameStatus] = useState('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [stars, setStars] = useState(0); 
  const [showCode, setShowCode] = useState(false); 

  const currentLevelData = activeModule === 99 ? customLevel : (LEVELS_DATA[activeModule] || LEVELS_DATA[1]);

  // Fonctions déplacées avant le useEffect pour éviter l'accès avant déclaration
  const initEditor = () => {
    const grid = Array(editorSize * editorSize).fill({ type: 'empty' });
    grid[0] = { type: 'start' };
    grid[grid.length - 1] = { type: 'goal' };
    setEditorGrid(grid);
  };

  const fullReset = () => {
    setRobotState(currentLevelData.start);
    setProgram(currentLevelData.initialCode ? [...currentLevelData.initialCode] : []);
    setLevelState({ itemsCollected: 0, collectedItemsIds: [], doorsOpen: [], clones: [] });
    setGameStatus('idle');
    setIsRunning(false);
    setFeedbackMsg(currentLevelData.hint || '');
    setStars(0);
  };

  // Utilise un compteur React pour générer des IDs stables
  const blockIdRef = useRef(0);
  const addBlock = (type) => {
    if (program.length < currentLevelData.maxBlocks && gameStatus !== 'running') {
      blockIdRef.current += 1;
      setProgram([...program, { id: `block-${blockIdRef.current}`, type }]);
    }
  };

  useEffect(() => {
    if (view === 'level') fullReset();
    if (view === 'editor' && editorGrid.length === 0) initEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule, view]);


  const resetSimulation = () => {
    setRobotState(currentLevelData.start);
    setLevelState({ itemsCollected: 0, collectedItemsIds: [], doorsOpen: [], clones: [] });
    setGameStatus('idle');
    setIsRunning(false);
    setFeedbackMsg(currentLevelData.hint || '');
  };

  // ...déplacé plus haut et corrigé...

  const removeBlock = (index) => {
    if (gameStatus !== 'running') {
      const newProg = [...program];
      newProg.splice(index, 1);
      setProgram(newProg);
    }
  };

  const handleEditorClick = (index) => {
    const newGrid = [...editorGrid];
    if (editorTool === 'start') {
       const oldStart = newGrid.findIndex(c => c.type === 'start');
       if (oldStart !== -1) newGrid[oldStart] = { type: 'empty' };
    }
    if (editorTool === 'goal') {
       const oldGoal = newGrid.findIndex(c => c.type === 'goal');
       if (oldGoal !== -1) newGrid[oldGoal] = { type: 'empty' };
    }
    newGrid[index] = { type: editorTool };
    setEditorGrid(newGrid);
  };

  const saveAndPlayCustomLevel = () => {
    const startIdx = editorGrid.findIndex(c => c.type === 'start');
    const goalIdx = editorGrid.findIndex(c => c.type === 'goal');
    
    if (startIdx === -1 || goalIdx === -1) {
      alert("Il faut un Départ (D) et une Arrivée (A) !");
      return;
    }

    const startX = startIdx % editorSize;
    const startY = Math.floor(startIdx / editorSize);
    const goalX = goalIdx % editorSize;
    const goalY = Math.floor(goalIdx / editorSize);

    const obstacles = [];
    const crystals = [];
    
    editorGrid.forEach((cell, i) => {
      const x = i % editorSize;
      const y = Math.floor(i / editorSize);
      if (cell.type === 'wall') obstacles.push({ x, y });
      if (cell.type === 'crystal') crystals.push({ x, y, type: 'crystal' });
    });

    const newLevel = {
      gridSize: editorSize,
      start: { x: startX, y: startY, dir: 1 },
      goal: { x: goalX, y: goalY },
      obstacles,
      items: crystals,
      gate: crystals.length > 0 ? { x: goalX, y: goalY, req: crystals.length } : null,
      maxBlocks: 50,
      par: 10,
      availableTools: ['move', 'left', 'right', 'dash', 'collect'],
      initialCode: [],
      hint: "Ton niveau personnalisé !",
      pedagogy: { concept: "Création", explanation: "Tu es le concepteur du jeu.", realWorld: "Game Design." }
    };

    setCustomLevel(newLevel);
    setActiveModule(99);
    setView('level');
  };

  const checkCollision = (x, y, currentState) => {
    if (x < 0 || x >= currentLevelData.gridSize || y < 0 || y >= currentLevelData.gridSize) return 'WALL';
    if (currentLevelData.obstacles?.some(obs => obs.x === x && obs.y === y)) return 'OBSTACLE';
    if (currentLevelData.gate && currentLevelData.gate.x === x && currentLevelData.gate.y === y) {
      if (currentState.itemsCollected < currentLevelData.gate.req) return 'GATE_LOCKED';
    }
    if (currentLevelData.doors) {
       const door = currentLevelData.doors.find(d => d.x === x && d.y === y);
       if (door && !currentState.doorsOpen.includes(door.id)) return 'DOOR_CLOSED';
    }
    return null;
  };

  const getNextPos = (robot) => {
    let newX = robot.x;
    let newY = robot.y;
    if (robot.dir === 0) newY -= 1;
    if (robot.dir === 1) newX += 1;
    if (robot.dir === 2) newY += 1;
    if (robot.dir === 3) newX -= 1;
    return { x: newX, y: newY };
  };

  const handleTileInteraction = async (entity, currentState) => {
      let newState = { ...currentState };
      let actionHappened = false;
      const item = currentLevelData.items?.find(it => it.x === entity.x && it.y === entity.y && !newState.collectedItemsIds.includes(`${it.x}-${it.y}`));
      if (item) {
        newState.itemsCollected += 1;
        newState.collectedItemsIds.push(`${item.x}-${item.y}`);
        actionHappened = true;
      }
      const switchItem = currentLevelData.switches?.find(s => s.x === entity.x && s.y === entity.y);
      if (switchItem && !newState.doorsOpen.includes(switchItem.linkId)) {
        newState.doorsOpen.push(switchItem.linkId);
        actionHappened = true;
      }
      return { newState, actionHappened };
  };

  const runProgram = async () => {
    if (program.length === 0) {
      setFeedbackMsg("Le programme est vide !");
      return;
    }
    setIsRunning(true);
    setGameStatus('running');
    setFeedbackMsg("Exécution...");
    let currentRobot = { ...currentLevelData.start };
    let currentLevelState = { itemsCollected: 0, collectedItemsIds: [], doorsOpen: [], clones: [] };
    setRobotState(currentRobot);
    setLevelState(currentLevelState);
    await new Promise(r => setTimeout(r, 500));
    for (let i = 0; i < program.length; i++) {
      const command = program[i];
      let stepsToExecute = [command];
      if (command.type === 'dash') {
        stepsToExecute = [];
        let limit = 0;
        let probeRobot = { ...currentRobot };
        while (limit < currentLevelData.gridSize) {
           const next = getNextPos(probeRobot);
           if (checkCollision(next.x, next.y, currentLevelState)) break;
           probeRobot = { ...probeRobot, ...next };
           stepsToExecute.push({ type: 'internal_move' }); 
           limit++;
        }
      }
      else if (command.type === 'if_wall_right') {
        stepsToExecute = [];
        const next = getNextPos(currentRobot);
        if (checkCollision(next.x, next.y, currentLevelState)) {
           stepsToExecute.push({ type: 'right' });
        } else {
           stepsToExecute.push({ type: 'internal_move' });
        }
      }
      else if (command.type === 'auto_path') {
         stepsToExecute = [];
         let limit = 0;
         let probeRobot = { ...currentRobot };
         while (limit < currentLevelData.gridSize) {
             const next = getNextPos(probeRobot);
             if (checkCollision(next.x, next.y, currentLevelState)) break;
             probeRobot = { ...probeRobot, ...next };
             stepsToExecute.push({ type: 'internal_move' });
             limit++;
         }
         const rightDir = (probeRobot.dir + 1) % 4;
         const nextRight = getNextPos({ ...probeRobot, dir: rightDir });
         const leftDir = (probeRobot.dir + 3) % 4;
         const nextLeft = getNextPos({ ...probeRobot, dir: leftDir });
         if (!checkCollision(nextRight.x, nextRight.y, currentLevelState)) {
             stepsToExecute.push({ type: 'right' });
         } else if (!checkCollision(nextLeft.x, nextLeft.y, currentLevelState)) {
             stepsToExecute.push({ type: 'left' });
         }
      }
      else if (command.type === 'func_stairs') {
        stepsToExecute = [{ type: 'internal_move' }, { type: 'right' }, { type: 'internal_move' }, { type: 'left' }];
      }
      else if (command.type === 'send_clone') {
         stepsToExecute = [];
         const cloneStart = { ...currentRobot, isClone: true };
         let cloneProbe = { ...cloneStart };
         let cloneSteps = [];
         let limit = 0;
         while (limit < currentLevelData.gridSize) {
            const next = getNextPos(cloneProbe);
            if (checkCollision(next.x, next.y, currentLevelState)) break;
            cloneProbe = { ...cloneProbe, ...next };
            cloneSteps.push({ ...cloneProbe });
            limit++;
         }
         if (cloneSteps.length === 0) {
            setFeedbackMsg("Le clone est bloqué par un obstacle !");
            await new Promise(r => setTimeout(r, 500));
         }
         for (const stepPos of cloneSteps) {
             currentLevelState.clones = [stepPos];
             setLevelState({...currentLevelState});
             const res = await handleTileInteraction(stepPos, currentLevelState);
             currentLevelState = res.newState;
             if (res.actionHappened) setLevelState({...currentLevelState});
             await new Promise(r => setTimeout(r, 200)); 
         }
         currentLevelState.clones = [];
         setLevelState({...currentLevelState});
      }
      for (let step of stepsToExecute) {
        if (step.type === 'collect' || step.type === 'interact') {
           const res = await handleTileInteraction(currentRobot, currentLevelState);
           currentLevelState = res.newState;
           setLevelState({...currentLevelState});
           if (res.actionHappened) await new Promise(r => setTimeout(r, 200));
        }
        else if (step.type === 'move' || step.type === 'internal_move') {
          const next = getNextPos(currentRobot);
          const collision = checkCollision(next.x, next.y, currentLevelState);
          if (collision) {
            setGameStatus('failure');
            if (collision === 'GATE_LOCKED') setFeedbackMsg("Porte fermée ! Il manque des cristaux.");
            else if (collision === 'DOOR_CLOSED') setFeedbackMsg("Passage bloqué ! Active l'interrupteur.");
            else setFeedbackMsg("BOUM ! Obstacle détecté.");
            setIsRunning(false);
            return;
          }
          currentRobot = { ...currentRobot, ...next };
          const teleporter = currentLevelData.teleporters?.find(tp => tp.x === currentRobot.x && tp.y === currentRobot.y);
          if (teleporter) {
             await new Promise(r => setTimeout(r, 200));
             currentRobot = { ...currentRobot, x: teleporter.targetX, y: teleporter.targetY };
          }
        } 
        else if (step.type === 'left') {
          currentRobot = { ...currentRobot, dir: (currentRobot.dir + 3) % 4 };
        } 
        else if (step.type === 'right') {
          currentRobot = { ...currentRobot, dir: (currentRobot.dir + 1) % 4 };
        }
        setRobotState(currentRobot);
        await new Promise(r => setTimeout(r, step.type === 'internal_move' ? 150 : 500)); 
      }
    }
    if (currentRobot.x === currentLevelData.goal.x && currentRobot.y === currentLevelData.goal.y) {
      setGameStatus('success');
      const par = currentLevelData.par || program.length + 2;
      let earnedStars = 1;
      if (program.length <= par) earnedStars = 3;
      else if (program.length <= par + 2) earnedStars = 2;
      setStars(earnedStars);
      setFeedbackMsg(`OBJECTIF ATTEINT ! (${earnedStars} étoiles)`);
      if (!unlockedModules.includes(activeModule + 1) && activeModule !== 99) {
        setUnlockedModules([...unlockedModules, activeModule + 1]);
      }
    } else {
      setGameStatus('failure');
      setFeedbackMsg("Programme terminé. Objectif non atteint.");
    }
    setIsRunning(false);
  };

  const generateRealCode = () => {
    if (program.length === 0) return "// Le programme est vide\n// Ajoutez des blocs pour commencer !";
    return program.map(block => {
      switch(block.type) {
        case 'move': return 'robot.avancer();';
        case 'left': return 'robot.tournerGauche();';
        case 'right': return 'robot.tournerDroite();';
        case 'dash': return `while (robot.voieLibre()) {\n  robot.avancer();\n}`;
        case 'collect': return 'robot.ramasser();';
        case 'interact': return 'robot.actionner();';
        case 'if_wall_right': return `if (robot.detecteMurDevant()) {\n  robot.tournerDroite();\n} else {\n  robot.avancer();\n}`;
        case 'func_stairs': return `monter_escalier(); // Macro`;
        case 'send_clone': return `const clone = new RobotClone();\nclone.avancerJusquObstacle();`;
        case 'auto_path': return `robot.navigationAuto();`;
        default: return '// Action inconnue';
      }
    }).join('\n\n');
  };

  const renderBlockIcon = (type) => {
    switch(type) {
      case 'move': return <ChevronRight className="-rotate-90" size={16} />;
      case 'left': return <RotateCcw size={16} />;
      case 'right': return <RotateCcw className="scale-x-[-1]" size={16} />;
      case 'dash': return <Zap size={16} />;
      case 'if_wall_right': return <Activity size={16} />;
      case 'auto_path': return <Cpu size={16} />;
      case 'collect': return <Gem size={16} />;
      case 'interact': return <Fingerprint size={16} />;
      case 'func_stairs': return <Layers size={16} />;
      case 'send_clone': return <Copy size={16} />;
      default: return <Code size={16} />;
    }
  };

  const renderBlockLabel = (type) => {
    switch(type) {
      case 'move': return 'Avancer';
      case 'left': return 'Gauche';
      case 'right': return 'Droite';
      case 'dash': return 'Dash (Tant Que)';
      case 'if_wall_right': return 'Si Mur → Droite';
      case 'auto_path': return 'Auto-Pilote';
      case 'collect': return 'Ramasser';
      case 'interact': return 'Actionner';
      case 'func_stairs': return 'Fonction Marche';
      case 'send_clone': return 'Envoi Clone';
      default: return 'Action';
    }
  };

  const getBlockColor = (type) => {
     if (['dash'].includes(type)) return 'bg-orange-600 border-orange-500 text-orange-100';
     if (['func_stairs', 'send_clone'].includes(type)) return 'bg-orange-600 border-orange-500 text-orange-100';
     if (['if_wall_right'].includes(type)) return 'bg-purple-600 border-purple-500 text-purple-100';
     if (['auto_path'].includes(type)) return 'bg-cyan-600 border-cyan-500 text-cyan-100';
     if (['collect'].includes(type)) return 'bg-emerald-600 border-emerald-500 text-emerald-100';
     if (['interact'].includes(type)) return 'bg-teal-600 border-teal-500 text-teal-100';
     if (['left', 'right'].includes(type)) return 'bg-indigo-600 border-indigo-500 text-indigo-100';
     return 'bg-blue-600 border-blue-500 text-blue-100';
  };

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        <div className="z-10 text-center max-w-2xl">
          <div className="mb-6 flex justify-center">
             <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
              <Code size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            CODE QUEST
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-2">Apprends à coder en jouant.</p>
          <p className="text-indigo-400 font-medium italic mb-8">Créé par Emrick DAHISSIHO</p>
          
          <div className="flex justify-center gap-4">
            <Button onClick={() => setView('map')} className="text-xl py-4 px-8">Aventure</Button>
            <Button onClick={() => setView('editor')} variant="secondary" className="text-xl py-4 px-8"><Edit size={24}/> Créer Niveau</Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col p-4 md:p-8 font-sans">
         <header className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3"><Edit /> Éditeur de Niveau</h2>
            <div className="flex gap-2">
               <Button onClick={() => setView('menu')} variant="ghost">Annuler</Button>
               <Button onClick={saveAndPlayCustomLevel} variant="success"><Play size={20}/> Tester</Button>
            </div>
         </header>
         <div className="flex flex-col md:flex-row gap-8 flex-1">
            <div className="flex-1 bg-slate-800 p-8 rounded-2xl flex items-center justify-center border-4 border-slate-700">
               <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${editorSize}, minmax(0, 1fr))` }}>
                  {editorGrid.map((cell, i) => (
                    <div key={i} onClick={() => handleEditorClick(i)} 
                      className={`w-10 h-10 md:w-14 md:h-14 border border-slate-700/50 cursor-pointer transition-all hover:brightness-110
                        ${cell.type === 'wall' ? 'bg-slate-600' : 'bg-slate-900/50'}
                        ${cell.type === 'start' ? 'ring-2 ring-indigo-500 bg-indigo-900/50' : ''}
                        ${cell.type === 'goal' ? 'ring-2 ring-yellow-500 bg-yellow-900/50' : ''}
                      `}
                    >
                      <div className="w-full h-full flex items-center justify-center text-xl">
                         {cell.type === 'wall' && '🧱'}
                         {cell.type === 'start' && '🚀'}
                         {cell.type === 'goal' && '⭐'}
                         {cell.type === 'crystal' && <Gem className="text-purple-400" size={20} />}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="w-64 flex flex-col gap-4">
               <div className="bg-slate-800 p-4 rounded-xl">
                  <h3 className="font-bold mb-3 text-slate-400 uppercase text-xs">Outils</h3>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => setEditorTool('wall')} className={`p-3 rounded border-b-4 font-bold flex flex-col items-center ${editorTool === 'wall' ? 'bg-slate-600 border-slate-800' : 'bg-slate-700 border-slate-900'}`}>🧱 Mur</button>
                     <button onClick={() => setEditorTool('crystal')} className={`p-3 rounded border-b-4 font-bold flex flex-col items-center ${editorTool === 'crystal' ? 'bg-purple-600 border-purple-800' : 'bg-purple-700 border-purple-900'}`}><Gem size={20}/> Cristal</button>
                     <button onClick={() => setEditorTool('start')} className={`p-3 rounded border-b-4 font-bold flex flex-col items-center ${editorTool === 'start' ? 'bg-indigo-600 border-indigo-800' : 'bg-indigo-700 border-indigo-900'}`}>🚀 Départ</button>
                     <button onClick={() => setEditorTool('goal')} className={`p-3 rounded border-b-4 font-bold flex flex-col items-center ${editorTool === 'goal' ? 'bg-yellow-600 border-yellow-800' : 'bg-yellow-700 border-yellow-900'}`}>⭐ Arrivée</button>
                     <button onClick={() => setEditorTool('empty')} className={`p-3 rounded border-b-4 font-bold flex flex-col items-center col-span-2 ${editorTool === 'empty' ? 'bg-red-600 border-red-800' : 'bg-red-700 border-red-900'}`}><Trash2 size={20}/> Gomme</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (view === 'map') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8 font-sans">
        <header className="glass-morphism flex justify-between items-center mb-8 max-w-5xl mx-auto p-6 rounded-2xl">
          <h2 className="text-4xl font-bold flex items-center gap-3 gradient-text"><Map /> Carte des Systèmes</h2>
          <Button variant="ghost" onClick={() => setView('menu')} className="text-indigo-400 hover:text-indigo-300">Retour</Button>
        </header>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((mod) => (
            <div key={mod.id} onClick={() => unlockedModules.includes(mod.id) && (setActiveModule(mod.id), setView('level'))}
              className={`card-hover relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${unlockedModules.includes(mod.id) ? 'glass-morphism border-indigo-400/30 hover:border-indigo-400' : 'bg-slate-900/50 border-slate-700 opacity-60 grayscale'}`}>
               <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-4xl font-bold text-white/10">{mod.id}</div>
               <span className={`text-xs font-bold uppercase py-1 px-2 rounded ${mod.color} text-white bg-opacity-20`}>{mod.phase}</span>
               <h3 className="text-xl font-bold mt-2 mb-1">{mod.title}</h3>
               <p className="text-slate-400 text-sm">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'level') {
    const activeModuleInfo = activeModule === 99 ? { title: "Niveau Personnalisé", desc: "Création joueur" } : MODULES.find(m => m.id === activeModule);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col font-sans">
        <header className="glass-morphism border-b border-indigo-400/20 p-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => setView(activeModule === 99 ? 'editor' : 'map')} className="!py-1 !px-3 text-sm btn-gradient"><ChevronRight className="rotate-180" size={16} /> {activeModule === 99 ? 'Éditeur' : 'Carte'}</Button>
            <div><h2 className="text-xl font-bold gradient-text">{activeModuleInfo.title}</h2><p className="text-xs text-indigo-300/70">{activeModuleInfo.desc}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {currentLevelData.items && (
              <div className="glass-morphism-darker px-3 py-1 rounded text-sm text-emerald-300 font-bold border border-emerald-400/30 shadow-glow">
                Cristaux: {levelState.itemsCollected} / {currentLevelData.gate?.req || currentLevelData.items.length}
              </div>
            )}
            <div className="glass-morphism-darker px-4 py-2 rounded-lg text-sm border border-indigo-400/30 font-bold text-indigo-300 shadow-glow">
               Mémoire: {program.length} / {currentLevelData.maxBlocks}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {gameStatus === 'success' && (
            <div className="absolute inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-slate-800 border-2 border-emerald-500/50 rounded-2xl p-6 md:p-8 max-w-lg text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                 <div className="mb-6 flex justify-center flex-col items-center">
                   <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce mb-4">
                     <CheckCircle className="w-10 h-10 text-emerald-400" />
                   </div>
                   <div className="flex gap-2">
                      {[1, 2, 3].map(s => (
                        <Star key={s} size={40} className={`transition-all duration-500 ${s <= stars ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-slate-600'}`} />
                      ))}
                   </div>
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Niveau Complété !</h2>
                 {currentLevelData.par && (
                   <p className="text-slate-400 text-sm mb-4">Blocs utilisés: <span className="text-white font-bold">{program.length}</span> (Objectif: {currentLevelData.par})</p>
                 )}
                 <Button onClick={() => setView('map')} variant="success" className="w-full py-4 text-lg shadow-emerald-500/20">
                   Continuer l'aventure <ChevronRight />
                 </Button>
              </div>
            </div>
          )}

          <div className="flex-1 bg-slate-900 p-6 flex flex-col items-center justify-center relative">
            <div className="relative bg-slate-800 p-4 rounded-xl shadow-2xl border-4 border-slate-700">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${currentLevelData.gridSize}, minmax(0, 1fr))` }}>
                {Array.from({ length: currentLevelData.gridSize * currentLevelData.gridSize }).map((_, i) => {
                  const x = i % currentLevelData.gridSize;
                  const y = Math.floor(i / currentLevelData.gridSize);
                  const isObstacle = currentLevelData.obstacles?.some(o => o.x === x && o.y === y);
                  const isGoal = currentLevelData.goal.x === x && currentLevelData.goal.y === y;
                  const isRobot = robotState.x === x && robotState.y === y;
                  const isItem = currentLevelData.items?.find(it => it.x === x && it.y === y);
                  const isCollected = isItem && levelState.collectedItemsIds.includes(`${x}-${y}`);
                  const isGate = currentLevelData.gate && currentLevelData.gate.x === x && currentLevelData.gate.y === y;
                  const gateOpen = isGate && levelState.itemsCollected >= currentLevelData.gate.req;
                  const isTeleporter = currentLevelData.teleporters?.find(tp => tp.x === x && tp.y === y);
                  const isSwitch = currentLevelData.switches?.find(s => s.x === x && s.y === y);
                  const door = currentLevelData.doors?.find(d => d.x === x && d.y === y);
                  const isDoorOpen = door && levelState.doorsOpen.includes(door.id);
                  const isClone = levelState.clones?.find(c => c.x === x && c.y === y);

                  return (
                    <div key={i} className={`w-10 h-10 md:w-14 md:h-14 rounded flex items-center justify-center text-xl relative transition-all duration-300
                       ${isObstacle ? 'bg-slate-700 shadow-inner border border-slate-600' : 'bg-slate-800/50 border border-slate-700/30'}
                       ${isGoal ? 'ring-2 ring-yellow-500/50 bg-yellow-500/10' : ''}
                       ${isTeleporter ? 'bg-blue-900/40 border-blue-500/30 ring-1 ring-blue-500/50' : ''}
                       ${isGate && !gateOpen ? 'bg-slate-700 border-red-500/50' : ''}
                       ${door && !isDoorOpen ? 'bg-slate-700 border-l-4 border-red-500' : ''}
                    `}>
                      <span className="absolute top-0.5 left-1 text-[8px] text-slate-600 opacity-50 font-mono">{x},{y}</span>
                      {isObstacle && "🧱"}
                      {isItem && !isCollected && <Gem className="text-purple-400 animate-bounce" size={20} />}
                      {isGate && !gateOpen && <Lock className="text-red-400" size={20} />}
                      {isGate && gateOpen && <div className="w-full h-full bg-emerald-500/20 absolute"></div>}
                      {isTeleporter && <Radio className="text-blue-400 animate-pulse" size={20} />}
                      {isSwitch && <div className={`w-6 h-6 rounded-full border-4 ${levelState.doorsOpen.includes(isSwitch.linkId) ? 'border-green-500 bg-green-900' : 'border-red-500 bg-red-900'}`}></div>}
                      {door && !isDoorOpen && <DoorClosed className="text-red-400" size={24} />}
                      {door && isDoorOpen && <DoorOpen className="text-emerald-500 opacity-50" size={24} />}
                      {isGoal && !isRobot && <Star className="text-yellow-400 animate-pulse" size={20} fill="currentColor" />}
                      {isRobot && <div className="text-indigo-400 transition-transform duration-300 z-10 drop-shadow-lg" style={{ transform: `rotate(${robotState.dir * 90}deg)` }}>🚀</div>}
                      {isClone && <div className="text-orange-400 transition-transform duration-300 z-10 drop-shadow-lg opacity-70" style={{ transform: `rotate(${isClone.dir * 90}deg)` }}>🤖</div>}
                    </div>
                  );
                })}
              </div>
            </div>
            {gameStatus !== 'success' && (
              <div className={`mt-6 px-6 py-3 rounded-lg flex items-center gap-3 font-bold border transition-all ${gameStatus === 'running' ? 'border-indigo-500/50 bg-indigo-900/20 text-indigo-300' : gameStatus === 'failure' ? 'border-rose-500/50 bg-rose-900/20 text-rose-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                  {gameStatus === 'running' ? <RefreshCw className="animate-spin" /> : gameStatus === 'failure' ? <XCircle /> : <Info />}
                  {feedbackMsg || "En attente..."}
              </div>
            )}
          </div>

          <div className="w-full md:w-96 bg-slate-800 border-l border-slate-700 flex flex-col shadow-2xl z-10">
            <div className="p-4 border-b border-slate-700 bg-slate-800/90">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Outils Disponibles</h3>
              <div className="grid grid-cols-2 gap-2">
                {currentLevelData.availableTools.map(tool => (
                   <button key={tool} onClick={() => addBlock(tool)} disabled={isRunning}
                    className={`p-3 rounded-lg border-b-4 font-bold flex items-center justify-center gap-2 text-sm transition-all active:translate-y-1 disabled:opacity-50 ${tool === 'dash' ? 'bg-orange-600 border-orange-800' : tool.startsWith('func') ? 'bg-orange-600 border-orange-800' : tool === 'send_clone' ? 'bg-orange-600 border-orange-800' : tool === 'if_wall_right' ? 'bg-purple-600 border-purple-800' : tool === 'auto_path' ? 'bg-cyan-600 border-cyan-800' : tool === 'collect' ? 'bg-emerald-600 border-emerald-800' : tool === 'interact' ? 'bg-teal-600 border-teal-800' : 'bg-blue-600 border-blue-800'} text-white`}>
                    {renderBlockIcon(tool)} {renderBlockLabel(tool)}
                   </button>
                ))}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-slate-900/50 relative">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Terminal size={12}/> Programme
                 </h3>
                 <div className="flex gap-2">
                   <button onClick={() => setShowCode(!showCode)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                     {showCode ? <EyeOff size={12}/> : <Eye size={12}/>} {showCode ? 'Blocs' : 'Code'}
                   </button>
                   <button onClick={() => setProgram([])} className="text-xs text-rose-400 hover:underline">Effacer</button>
                 </div>
               </div>
               <div className="space-y-2 min-h-[200px] border-2 border-dashed border-slate-700 rounded-xl p-2 bg-slate-900/50">
                 {program.length === 0 && <div className="text-center text-slate-600 italic text-sm mt-10">Zone vide</div>}
                 {showCode ? (
                   <pre className="text-xs font-mono text-green-400 p-2 whitespace-pre-wrap leading-relaxed">
                     {generateRealCode()}
                   </pre>
                 ) : (
                   program.map((block, index) => (
                     <div key={block.id} className={`p-3 rounded-lg flex justify-between items-center border-l-4 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300 ${getBlockColor(block.type)} bg-opacity-20`}>
                       <div className="flex items-center gap-3"><span className="text-slate-500 text-xs font-mono">{index + 1}</span><span className="font-bold text-sm flex items-center gap-2">{renderBlockIcon(block.type)} {renderBlockLabel(block.type)}</span></div>
                       <button onClick={() => removeBlock(index)} disabled={isRunning} className="text-slate-400 hover:text-rose-400"><XCircle size={16} /></button>
                     </div>
                   ))
                 )}
               </div>
            </div>
            <div className="p-4 bg-slate-800 border-t border-slate-700 grid grid-cols-2 gap-4">
              <Button onClick={resetSimulation} variant="secondary" disabled={isRunning} className="w-full"><RefreshCw size={20} /> Reset</Button>
              <Button onClick={runProgram} variant="success" disabled={isRunning || program.length === 0} className="w-full">{isRunning ? '...' : <><Play size={20} /> Go</>}</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return null;
}
