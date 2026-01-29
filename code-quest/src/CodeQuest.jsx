import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ChevronRight, Star, Lock, Map, Code, Info, Terminal, RefreshCw, CheckCircle, XCircle, Zap, Cpu, Activity, BookOpen, Gem, DoorClosed, DoorOpen, Fingerprint, Radio, Copy, Layers, Edit, Save, Trash2, Eye, EyeOff, MousePointer } from 'lucide-react';
import MainMenu from './MainMenu';
import LevelView from './LevelView';

const MODULES = [ 
  { id: 1, title: "La Séquence", desc: "Donner des ordres dans le bon ordre.", phase: "Logique", color: "from-blue-600 to-blue-700" },
  { id: 2, title: "Le Débuggage", desc: "Le code est cassé ! Trouve l'erreur.", phase: "Logique", color: "from-blue-600 to-blue-700" },
  { id: 3, title: "Précision", desc: "Répéter des actions sans se tromper.", phase: "Logique", color: "from-indigo-600 to-indigo-700" },
  { id: 4, title: "Conditions", desc: "Le robot doit réagir aux murs.", phase: "Intelligence", color: "from-purple-600 to-purple-700" },
  { id: 5, title: "Boucles Tant Que", desc: "Avancer tant que la voie est libre.", phase: "Intelligence", color: "from-purple-600 to-purple-700" },
  { id: 6, title: "Logique Avancée", desc: "Algorithmes de décision (IA).", phase: "Intelligence", color: "from-purple-700 to-purple-800" },
  { id: 7, title: "Les Variables", desc: "Stocker de l'information (Score).", phase: "Données", color: "from-emerald-600 to-emerald-700" },
  { id: 8, title: "Coordonnées", desc: "Se téléporter sur la carte (X, Y).", phase: "Données", color: "from-emerald-600 to-emerald-700" },
  { id: 9, title: "Événements", desc: "Actionner des mécanismes.", phase: "Données", color: "from-teal-600 to-teal-700" },
  { id: 10, title: "Fonctions", desc: "Créer tes propres super-blocs.", phase: "Architecture", color: "from-orange-600 to-orange-700" },
  { id: 11, title: "Clonage", desc: "Envoyer des robots à distance.", phase: "Architecture", color: "from-orange-600 to-orange-700" },
  { id: 12, title: "Projet Final", desc: "Le défi ultime !", phase: "Architecture", color: "from-red-600 to-red-700" },
];

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

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    danger: "btn-danger",
    icon: "btn-icon",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function CodeQuestApp() {
  const [view, setView] = useState('menu');
  const [unlockedModules, setUnlockedModules] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [activeModule, setActiveModule] = useState(1);
  
  const [customLevel, setCustomLevel] = useState(null);
  const [editorGrid, setEditorGrid] = useState([]);
  const [editorTool, setEditorTool] = useState('wall');
  const [editorSize] = useState(8); // setEditorSize n'est jamais utilisé

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

  useEffect(() => {
    if (view === 'level') fullReset();
    if (view === 'editor' && editorGrid.length === 0) initEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule, view]);

  // Déplacer les fonctions AVANT le useEffect pour éviter l'accès avant déclaration
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

  const resetSimulation = () => {
    setRobotState(currentLevelData.start);
    setLevelState({ itemsCollected: 0, collectedItemsIds: [], doorsOpen: [], clones: [] });
    setGameStatus('idle');
    setIsRunning(false);
    setFeedbackMsg(currentLevelData.hint || '');
  };

  // Générateur d'ID stable pour React (évite Date.now/Math.random)
  let nextBlockId = 1;
  const addBlock = (type) => {
    if (program.length < currentLevelData.maxBlocks && gameStatus !== 'running') {
      nextBlockId += 1;
      setProgram([...program, { id: `block-${nextBlockId}`, type }]);
    }
  };

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
    const icons = {
      move: <ChevronRight className="-rotate-90" size={16} />,
      left: <RotateCcw size={16} />,
      right: <RotateCcw className="scale-x-[-1]" size={16} />,
      dash: <Zap size={16} />,
      if_wall_right: <Activity size={16} />,
      auto_path: <Cpu size={16} />,
      collect: <Gem size={16} />,
      interact: <Fingerprint size={16} />,
      func_stairs: <Layers size={16} />,
      send_clone: <Copy size={16} />,
    };
    return icons[type] || <Code size={16} />;
  };

  const renderBlockLabel = (type) => {
    const labels = {
      move: 'Avancer',
      left: 'Gauche',
      right: 'Droite',
      dash: 'Dash (Tant Que)',
      if_wall_right: 'Si Mur → Droite',
      auto_path: 'Auto-Pilote',
      collect: 'Ramasser',
      interact: 'Actionner',
      func_stairs: 'Fonction Marche',
      send_clone: 'Envoi Clone',
    };
    return labels[type] || 'Action';
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-100 relative overflow-hidden font-['Fredoka','Comic_Sans_MS',cursive]">
        {/* Effets Pixar : bulles pastel, shimmer, ombres douces */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-100/40 rounded-full blur-2xl animate-bounce -translate-x-1/2 -translate-y-1/2 z-0"></div>

        {/* Illustration robot cartoon */}
        <div className="z-10 flex flex-col items-center max-w-2xl w-full">
          <div className="flex justify-center mb-8">
            <div className="w-40 h-40 bg-gradient-to-br from-yellow-200 via-pink-100 to-blue-200 rounded-full shadow-2xl flex items-center justify-center border-8 border-white/60 relative animate-float">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/80 rounded-full shadow-lg animate-bounce"></span>
              <span className="absolute -bottom-4 right-1/2 translate-x-1/2 w-10 h-10 bg-blue-200/80 rounded-full shadow-md animate-pulse"></span>
              <span className="text-8xl select-none" style={{filter:'drop-shadow(0 0 16px #fff8)'}}>🤖</span>
            </div>
          </div>
          <h1
            className="text-7xl md:text-8xl font-extrabold mb-3 bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl shimmer-text animate-fade-in"
            style={{ fontFamily: 'Fredoka, Comic Sans MS, cursive', letterSpacing: '-0.04em' }}
          >
            <span className="shimmer-text">Code Quest</span>
          </h1>
          <p className="text-2xl md:text-3xl text-blue-700 font-bold mb-2 animate-fade-in drop-shadow-sm">Apprends à coder en t'amusant !</p>
          <p className="text-pink-500 font-semibold italic mb-10 animate-fade-in drop-shadow-sm">Créé par Emrick DAHISSIHO</p>

          <div className="flex flex-col sm:flex-row justify-center gap-8 pt-6 w-full animate-fade-in">
            <Button onClick={() => setView('map')} className="btn-primary !text-2xl !py-6 !px-12 w-full sm:w-auto shadow-2xl hover:scale-105 transition-transform bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 border-0 text-white font-bold rounded-3xl">
              <Play size={36} className="mr-2" /> Aventure
            </Button>
            <Button onClick={() => setView('editor')} variant="secondary" className="btn-secondary !text-2xl !py-6 !px-12 w-full sm:w-auto shadow-2xl hover:scale-105 transition-transform bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400 border-0 text-white font-bold rounded-3xl">
              <Edit size={36} className="mr-2" /> Créer Niveau
            </Button>
          </div>
        </div>
        {/* Shimmer effect CSS */}
        <style>{`
          .shimmer-text {
            background: linear-gradient(90deg, #fff 20%, #ffe082 40%, #fff 60%);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2.5s infinite linear;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex flex-col p-4 md:p-8 font-sans">
         <header className="glass-panel-lg flex justify-between items-center mb-6 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl font-bold flex items-center gap-3"><Edit size={32} /> Éditeur de Niveau</h2>
            <div className="flex gap-2">
               <Button onClick={() => setView('menu')} variant="secondary" className="btn-secondary">Annuler</Button>
               <Button onClick={saveAndPlayCustomLevel} variant="success" className="btn-success"><Play size={20} /> Tester</Button>
            </div>
         </header>
         <div className="flex flex-col md:flex-row gap-8 flex-1 max-w-7xl mx-auto w-full">
            <div className="flex-1 glass-panel-lg flex items-center justify-center">
               <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${editorSize}, minmax(0, 1fr))` }}>
                  {editorGrid.map((cell, i) => (
                    <div key={i} onClick={() => handleEditorClick(i)} 
                      className={`w-10 h-10 md:w-14 md:h-14 border border-indigo-700/30 cursor-pointer transition-all hover:border-indigo-700/60 hover:shadow-md flex items-center justify-center text-xl
                        ${cell.type === 'wall' ? 'bg-rose-900/30 border-rose-600' : cell.type === 'start' ? 'bg-indigo-900 border-indigo-500 ring-2 ring-indigo-400' : cell.type === 'goal' ? 'bg-emerald-900 border-emerald-500 ring-2 ring-emerald-400' : 'bg-slate-800/40'}
                      `}
                    >
                      {cell.type === 'wall' && '🧱'}
                      {cell.type === 'start' && '🚀'}
                      {cell.type === 'goal' && '⭐'}
                      {cell.type === 'crystal' && <Gem className="text-indigo-400 animate-pulse" size={20} />}
                    </div>
                  ))}
               </div>
            </div>
            <div className="w-64 flex flex-col gap-4">
               <div className="glass-panel p-4 space-y-3">
                  <h3 className="font-bold text-indigo-400 uppercase text-sm tracking-wider">Outils</h3>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => setEditorTool('wall')} className={`p-3 rounded font-bold flex items-center justify-center transition-all ${editorTool === 'wall' ? 'btn-primary shadow-lg' : 'btn-secondary'}`}>🧱</button>
                     <button onClick={() => setEditorTool('crystal')} className={`p-3 rounded font-bold flex items-center justify-center transition-all ${editorTool === 'crystal' ? 'btn-primary shadow-lg' : 'btn-secondary'}`}><Gem size={20} /></button>
                     <button onClick={() => setEditorTool('start')} className={`p-3 rounded font-bold flex items-center justify-center transition-all ${editorTool === 'start' ? 'btn-primary shadow-lg' : 'btn-secondary'}`}>🚀</button>
                     <button onClick={() => setEditorTool('goal')} className={`p-3 rounded font-bold flex items-center justify-center transition-all ${editorTool === 'goal' ? 'btn-primary shadow-lg' : 'btn-secondary'}`}>⭐</button>
                     <button onClick={() => setEditorTool('empty')} className={`col-span-2 p-3 rounded font-bold flex items-center justify-center gap-2 transition-all ${editorTool === 'empty' ? 'btn-primary shadow-lg' : 'btn-secondary'}`}><Trash2 size={16} /> Gomme</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (view === 'map') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 relative overflow-hidden font-['Fredoka','Comic_Sans_MS',cursive]">
        {/* Effets Pixar : bulles pastel, shimmer, ombres douces */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-100/40 rounded-full blur-2xl animate-bounce -translate-x-1/2 -translate-y-1/2 z-0"></div>
        <header className="z-10 flex justify-between items-center mb-10 max-w-6xl w-full mx-auto">
          <h2 className="text-5xl font-extrabold flex items-center gap-4 bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl shimmer-text" style={{ fontFamily: 'Fredoka, Comic Sans MS, cursive', letterSpacing: '-0.04em' }}><Map size={48} /> Carte des Systèmes</h2>
          <Button variant="secondary" onClick={() => setView('menu')} className="btn-secondary !py-3 !px-8 rounded-2xl text-lg shadow-lg">Retour</Button>
        </header>
        <div className="z-10 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MODULES.map((mod) => (
            <div key={mod.id} onClick={() => unlockedModules.includes(mod.id) && (setActiveModule(mod.id), setView('level'))}
              className={`group cursor-pointer relative overflow-hidden transition-all duration-300 rounded-3xl shadow-xl border-4 border-white/40 bg-gradient-to-br ${mod.color} ${unlockedModules.includes(mod.id) ? 'hover:scale-105 hover:shadow-2xl' : 'opacity-50 grayscale hover:opacity-60'} p-7 flex flex-col items-start min-h-[200px]`}
              style={{ filter: unlockedModules.includes(mod.id) ? 'none' : 'grayscale(0.7)' }}
            >
               <div className={`absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
               <span className={`inline-block text-xs font-bold uppercase py-1 px-3 rounded-full bg-white/30 text-gray-700 backdrop-blur mb-3 drop-shadow`}>{mod.phase}</span>
               <h3 className="text-2xl font-extrabold mb-2 text-white drop-shadow-lg">{mod.title}</h3>
               <p className="text-gray-100 text-base mb-2 drop-shadow-sm">{mod.desc}</p>
               {!unlockedModules.includes(mod.id) && <Lock className="absolute bottom-4 right-4 text-gray-400" size={28} />}
            </div>
          ))}
        </div>
        {/* Shimmer effect CSS */}
        <style>{`
          .shimmer-text {
            background: linear-gradient(90deg, #fff 20%, #ffe082 40%, #fff 60%);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2.5s infinite linear;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (view === 'level') {
    const activeModuleInfo = activeModule === 99 ? { title: "Niveau Personnalisé", desc: "Création joueur" } : MODULES.find(m => m.id === activeModule);
    return (
      <LevelView
        activeModuleInfo={activeModuleInfo}
        currentLevelData={currentLevelData}
        levelState={levelState}
        program={program}
        gameStatus={gameStatus}
        stars={stars}
        setView={setView}
        robotState={robotState}
        addBlock={addBlock}
        removeBlock={removeBlock}
        isRunning={isRunning}
        showCode={showCode}
        setShowCode={setShowCode}
        resetSimulation={resetSimulation}
        runProgram={() => {}} // TODO: implémenter la logique d'exécution du programme
        feedbackMsg={feedbackMsg}
        getBlockColor={getBlockColor}
        renderBlockIcon={renderBlockIcon}
        renderBlockLabel={renderBlockLabel}
        setProgram={setProgram}
      />
    );
  }
  return null;
}
