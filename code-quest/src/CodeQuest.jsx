import React, { useState, useEffect, useRef } from 'react';
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
    levelNumber: 1,
    gridSize: 5,
    start: { x: 0, y: 2, dir: 1 },
    goal: { x: 4, y: 2 },
    obstacles: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 4 }],
    maxBlocks: 5,
    par: 4, 
    availableTools: ['move', 'left', 'right'],
    initialCode: [],
    hint: "Utilise plusieurs blocs 'Avancer' pour traverser.",
    
        pedagogy: {
          concept: "L'Algorithme",
          explanation: "Bravo ! Tu viens de créer ton tout premier programme : tu as donné des instructions précises à ton robot pour qu'il atteigne son objectif. C'est comme donner une recette à suivre, étape par étape.",
          devWorld: "Dans le monde des développeurs, on écrit des suites d'instructions pour que l'ordinateur accomplisse une tâche. C'est la base de tout logiciel !",
          takeaway: "À retenir : Un programme, c'est une liste d'actions à faire dans le bon ordre."
        }
  },
  2: {
    levelNumber: 2,
    gridSize: 5,
    start: { x: 1, y: 4, dir: 0 },
    goal: { x: 3, y: 4 },
    obstacles: [{ x: 2, y: 4 }, { x: 2, y: 3 }],
    maxBlocks: 8,
    par: 8,
    availableTools: ['move', 'left', 'right'],
    initialCode: [{ id: 'bug1', type: 'move' }, { id: 'bug2', type: 'move' }, { id: 'bug3', type: 'right' }, { id: 'bug4', type: 'move' }], 
    hint: "Le mur est moins haut ! Tu peux passer par dessus (y=2).",
    
        pedagogy: {
          concept: "Le Débuggage",
          explanation: "Félicitations ! Tu as trouvé et corrigé des erreurs dans un programme existant. C'est comme réparer une voiture pour qu'elle roule à nouveau.",
          devWorld: "Les développeurs passent beaucoup de temps à chercher et corriger des bugs dans leur code. C'est une compétence essentielle !",
          takeaway: "À retenir : Corriger ses erreurs, c'est normal et ça fait progresser."
        }
  },
  3: {
    levelNumber: 3,
    gridSize: 6,
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 5, y: 5 },
    obstacles: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 4, y: 2 }, { x: 4, y: 3 }],
    maxBlocks: 14,
    par: 14,
    availableTools: ['move', 'left', 'right'],
    initialCode: [],
    hint: "Passe par le trou au centre du mur.",
    
        pedagogy: {
          concept: "Séquence",
          explanation: "Super ! Tu as compris que l'ordre des instructions change tout : avancer, tourner, puis avancer n'est pas pareil que tourner, avancer, avancer.",
          devWorld: "En programmation, la séquence des actions est cruciale. Comme dans une recette de cuisine, il faut suivre les étapes dans le bon ordre pour réussir.",
          takeaway: "À retenir : L'ordre des blocs compte, chaque étape a son importance."
        }
  },
  4: {
    levelNumber: 4,
    gridSize: 5,
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 2, y: 2 },
    obstacles: [{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:3}],
    maxBlocks: 10,
    par: 10,
    availableTools: ['move', 'left', 'right', 'if_wall_right'],
    initialCode: [],
    hint: "Défi : Faisable en 10 blocs pile !",
    
        pedagogy: {
          concept: "Conditions",
          explanation: "Bravo ! Tu as utilisé des conditions : le robot agit différemment selon la situation. C'est comme dire 'Si j'ai faim, alors je mange.'",
          devWorld: "Les développeurs utilisent des conditions pour que le programme prenne des décisions selon ce qui se passe.",
          takeaway: "À retenir : Les conditions permettent d'adapter le comportement du robot à l'environnement."
        }
  },
  5: {
    levelNumber: 5,
    gridSize: 8,
    start: { x: 0, y: 3, dir: 1 },
    goal: { x: 7, y: 3 },
    obstacles: [...Array.from({length: 8}, (_, i) => ({x: i, y: 2})), ...Array.from({length: 8}, (_, i) => ({x: i, y: 4})), {x:0, y:0}, {x:1, y:1}, {x:7, y:0}, {x:6, y:7}, {x:2, y:6}],
    maxBlocks: 3,
    par: 1,
    availableTools: ['move', 'left', 'right', 'dash'],
    initialCode: [],
    hint: "Utilise le 'Dash' pour traverser d'un coup.",
    
        pedagogy: {
          concept: "Boucles (While)",
          explanation: "Super ! Tu as fait répéter une action à ton robot jusqu'à ce qu'il atteigne son but. C'est comme dire 'Répète jusqu'à ce que tu arrives.'",
          devWorld: "En programmation, les boucles servent à répéter des actions automatiquement, comme traiter une liste de données.",
          takeaway: "À retenir : Les boucles font gagner du temps et évitent de répéter le même bloc plusieurs fois."
        }
  },
  6: {
    levelNumber: 6,
    gridSize: 7,
    start: { x: 1, y: 5, dir: 0 },
    goal: { x: 5, y: 1 },
    obstacles: [{x:0, y:5}, {x:0, y:4}, {x:0, y:3}, {x:0, y:2}, {x:0, y:1}, {x:2, y:5}, {x:2, y:4}, {x:2, y:3}, {x:2, y:2}, {x:4, y:4}, {x:4, y:3}, {x:4, y:2}, {x:4, y:1}, {x:6, y:5}, {x:6, y:4}, {x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:1, y:0}, {x:3, y:6}, {x:5, y:0}, {x:5, y:6}],
    maxBlocks: 12,
    par: 10,
    availableTools: ['move', 'left', 'right', 'auto_path'],
    initialCode: [],
    hint: "L'Auto-Pilote : Avance + Virage intelligent.",
    
        pedagogy: {
          concept: "IA / Algorithme Complexe",
          explanation: "Génial ! Tu as utilisé une commande intelligente qui décide toute seule du meilleur chemin. C'est comme un GPS qui trouve la route pour toi.",
          devWorld: "Les développeurs créent des algorithmes capables de prendre des décisions complexes, comme les voitures autonomes.",
          takeaway: "À retenir : On peut déléguer des tâches à des programmes intelligents."
        }
  },
  7: {
    levelNumber: 7,
    gridSize: 6,
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 5, y: 5 },
    obstacles: [{x:1, y:1}, {x:2, y:2}, {x:3, y:3}, {x:4, y:4}, {x:5, y:0}, {x:0, y:5}],
    items: [{ x: 2, y: 0, type: 'crystal' }, { x: 0, y: 2, type: 'crystal' }, { x: 5, y: 3, type: 'crystal' }],
    gate: { x: 4, y: 5, req: 3 },
    maxBlocks: 15,
    par: 13,
    availableTools: ['move', 'left', 'right', 'collect'],
    initialCode: [],
    hint: "Ramasse les 3 cristaux pour ouvrir la porte.",
    
        pedagogy: {
          concept: "Les Variables",
          explanation: "Bravo ! Tu as manipulé des objets à collecter, comme des points ou des cristaux. C'est comme compter tes billes ou tes points à un jeu.",
          devWorld: "En code, on utilise des variables pour stocker et modifier des valeurs (score, vies, etc.).",
          takeaway: "À retenir : Les variables servent à retenir des informations qui changent."
        }
  },
  8: {
    levelNumber: 8,
    gridSize: 7,
    start: { x: 0, y: 3, dir: 1 },
    goal: { x: 6, y: 3 },
    obstacles: [{x:3, y:0}, {x:3, y:1}, {x:3, y:2}, {x:3, y:3}, {x:3, y:4}, {x:3, y:5}, {x:3, y:6}],
    teleporters: [{ x: 2, y: 3, targetX: 4, targetY: 3 }],
    maxBlocks: 6,
    par: 4,
    availableTools: ['move', 'left', 'right'],
    initialCode: [],
    hint: "Marche sur la dalle bleue pour te téléporter.",
    
        pedagogy: {
          concept: "Coordonnées (X,Y)",
          explanation: "Super ! Tu as utilisé la téléportation pour déplacer ton robot à un endroit précis. C'est comme aller directement à une case sur un plateau.",
          devWorld: "Les développeurs utilisent des coordonnées pour placer des objets sur un écran ou une carte.",
          takeaway: "À retenir : Les coordonnées permettent de se repérer et de se déplacer précisément."
        }
  },
  9: {
    levelNumber: 9,
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
    
        pedagogy: {
          concept: "Les Événements",
          explanation: "Bravo ! Tu as déclenché un événement en activant un interrupteur. C'est comme appuyer sur un bouton pour allumer la lumière.",
          devWorld: "En informatique, un événement (clic, touche, etc.) déclenche une action dans le programme.",
          takeaway: "À retenir : Les événements relient une action à une réaction."
        }
  },
  10: {
    levelNumber: 10,
    gridSize: 6,
    start: { x: 0, y: 5, dir: 0 },
    goal: { x: 5, y: 0 },
    obstacles: [
       {x:0, y:3}, {x:0, y:2}, {x:0, y:1}, {x:0, y:0},
       {x:1, y:5}, {x:1, y:2}, {x:1, y:1}, {x:1, y:0},
       {x:2, y:5}, {x:2, y:4}, {x:2, y:1}, {x:2, y:0},
       {x:3, y:5}, {x:3, y:4}, {x:3, y:3}, {x:3, y:0},
       {x:4, y:5}, {x:4, y:4}, {x:4, y:3}, {x:4, y:2},
       {x:5, y:5}, {x:5, y:4}, {x:5, y:3}, {x:5, y:2}, {x:5, y:1},
    ],
    maxBlocks: 6,
    par: 5,
    availableTools: ['func_stairs'],
    initialCode: [],
    hint: "Le motif se répète 5 fois. Utilise la super-fonction 'Marche' !",
    
        pedagogy: {
          concept: "Les Fonctions",
          explanation: "Génial ! Tu as utilisé une fonction : un bloc qui regroupe plusieurs actions. C'est comme une chorégraphie que tu peux réutiliser.",
          devWorld: "Les fonctions permettent de réutiliser du code et de simplifier les programmes.",
          takeaway: "À retenir : Une fonction, c'est un super-bloc qui fait plusieurs choses à la fois."
        }
  },
  11: {
    levelNumber: 11,
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
    
        pedagogy: {
          concept: "Multi-Tâches",
          explanation: "Bravo ! Tu as fait agir plusieurs robots en même temps. C'est comme une équipe qui travaille ensemble pour réussir plus vite.",
          devWorld: "Les ordinateurs peuvent exécuter plusieurs tâches en parallèle, comme les serveurs sur Internet.",
          takeaway: "À retenir : Plusieurs actions peuvent se dérouler en même temps grâce à la programmation."
        }
  },
  12: {
    levelNumber: 12,
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
    
        pedagogy: {
          concept: "Architecte Logiciel",
          explanation: "Félicitations ! Tu as combiné tout ce que tu as appris pour résoudre un défi complexe. C'est comme construire une maison avec toutes les briques que tu connais.",
          devWorld: "Les développeurs utilisent toutes leurs compétences pour créer des applications complètes.",
          takeaway: "À retenir : La programmation, c'est assembler plein d'idées pour créer de grandes choses."
        }
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
    // --- Helpers pour l'exécution du robot ---
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

    const getRightPos = (robot) => {
      const rightDir = (robot.dir + 1) % 4;
      return getNextPos({ ...robot, dir: rightDir });
    };

    const getLeftPos = (robot) => {
      const leftDir = (robot.dir + 3) % 4;
      return getNextPos({ ...robot, dir: leftDir });
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

    // Fonction principale d'exécution du programme du robot
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
        } else if (command.type === 'if_wall_right') {
          stepsToExecute = [];
          const rightPos = getRightPos(currentRobot);
          const rightCollision = checkCollision(rightPos.x, rightPos.y, currentLevelState);
          if (rightCollision) {
            stepsToExecute.push({ type: 'internal_move' });
          } else {
            stepsToExecute.push({ type: 'right' });
          }
        } else if (command.type === 'auto_path') {
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
        } else if (command.type === 'func_stairs') {
          stepsToExecute = [{ type: 'internal_move' }, { type: 'right' }, { type: 'internal_move' }, { type: 'left' }];
        } else if (command.type === 'send_clone') {
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
            setLevelState({ ...currentLevelState });
            const res = await handleTileInteraction(stepPos, currentLevelState);
            currentLevelState = res.newState;
            if (res.actionHappened) setLevelState({ ...currentLevelState });
            await new Promise(r => setTimeout(r, 200));
          }
          currentLevelState.clones = [];
          setLevelState({ ...currentLevelState });
        }
        for (let step of stepsToExecute) {
          if (step.type === 'collect' || step.type === 'interact') {
            const res = await handleTileInteraction(currentRobot, currentLevelState);
            currentLevelState = res.newState;
            setLevelState({ ...currentLevelState });
            if (res.actionHappened) await new Promise(r => setTimeout(r, 200));
          } else if (step.type === 'move' || step.type === 'internal_move') {
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
          } else if (step.type === 'left') {
            currentRobot = { ...currentRobot, dir: (currentRobot.dir + 3) % 4 };
          } else if (step.type === 'right') {
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
  const nextBlockIdRef = useRef(1);

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
      nextBlockIdRef.current += 1;
      setProgram([...program, { id: `block-${nextBlockIdRef.current}`, type }]);
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
        case 'if_wall_right': return `if (robot.detecteMurDroite()) {\n  robot.avancer();\n} else {\n  robot.tournerDroite();\n}`;
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.25),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.25),_transparent_35%),linear-gradient(135deg,_#fffaf3_0%,_#f1f8ff_45%,_#f8f2ff_100%)] relative overflow-hidden font-['Fredoka','Comic_Sans_MS',cursive]">
        <div className="absolute -top-10 -left-10 h-44 w-44 rounded-full bg-pink-200/60 blur-3xl"></div>
        <div className="absolute bottom-8 right-8 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-100/70 blur-3xl"></div>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center rounded-[36px] border border-white/70 bg-white/70 p-8 shadow-[0_30px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-12">
          <div className="mb-6 flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-white/70 bg-gradient-to-br from-yellow-200 via-pink-100 to-sky-200 shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
              <span className="absolute -top-3 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-white/80 shadow-lg"></span>
              <span className="absolute -bottom-3 right-1/2 h-10 w-10 translate-x-1/2 rounded-full bg-sky-200/80 shadow-md"></span>
              <span className="text-7xl select-none">🤖</span>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="playful-pill">✨ Apprendre en jouant</span>
            <span className="playful-pill">🧠 Mini défis de logique</span>
            <span className="playful-pill">🌈 Style bébé-coder</span>
          </div>

          <h1 className="mb-3 text-center text-5xl font-extrabold text-slate-800 md:text-7xl">
            <span className="childish-title">Code Quest</span>
          </h1>
          <p className="mb-2 text-center text-xl font-semibold text-sky-700 md:text-2xl">Apprends à coder en t’amusant !</p>
          <p className="mb-8 text-center text-lg text-fuchsia-600">Créé par Emrick DAHISSIHO • Version ultra ludique</p>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
            <button onClick={() => setView('map')} className="playful-button flex items-center justify-center gap-2 px-8 py-4 text-xl">
              <Play size={28} /> Aventure
            </button>
            <button onClick={() => setView('editor')} className="playful-button-secondary flex items-center justify-center gap-2 px-8 py-4 text-xl">
              <Edit size={28} /> Créer un niveau
            </button>
          </div>
        </div>
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.2),_transparent_35%),linear-gradient(135deg,_#fffaf3_0%,_#f1f8ff_45%,_#f8f2ff_100%)] p-6 py-10 text-slate-800 relative overflow-hidden font-['Fredoka','Comic_Sans_MS',cursive]">
        <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-pink-200/50 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl"></div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
          <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.1)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/70 bg-amber-100/80 px-3 py-1 text-sm font-semibold text-amber-700">
                <Map size={16} /> Carte des systèmes
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">Choisis un monde de missions</h2>
              <p className="mt-1 text-sm text-slate-600 md:text-base">Chaque carte te fait découvrir une nouvelle idée de programmation.</p>
            </div>
            <Button variant="secondary" onClick={() => setView('menu')} className="playful-button-secondary px-5 py-3">Retour</Button>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => {
              const isUnlocked = unlockedModules.includes(mod.id);
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setProgram([]);
                      setActiveModule(mod.id);
                      setView('level');
                    }
                  }}
                  className={`group relative flex min-h-[220px] cursor-pointer flex-col items-start overflow-hidden rounded-[28px] border border-white/60 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all duration-300 ${isUnlocked ? 'hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.18)]' : 'opacity-60 grayscale'} bg-gradient-to-br ${mod.color}`}
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-150"></div>
                  <span className="playful-pill mb-3 bg-white/30 text-white">{mod.phase}</span>
                  <h3 className="mb-2 text-2xl font-extrabold text-white drop-shadow">{mod.title}</h3>
                  <p className="mb-4 text-sm leading-6 text-white/90">{mod.desc}</p>
                  <div className="mt-auto flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                    {isUnlocked ? '▶ Débloqué' : '🔒 À venir'}
                  </div>
                  {!isUnlocked && <Lock className="absolute bottom-4 right-4 text-white/70" size={24} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'level') {
    const activeModuleInfo = activeModule === 99 ? { id: 99, title: "Niveau Personnalisé", desc: "Création joueur" } : MODULES.find(m => m.id === activeModule);
    const goToNextLevel = () => {
      if (typeof activeModuleInfo.id === 'number' && activeModuleInfo.id < 12) {
        setProgram([]);
        setView('level');
        setActiveModule(activeModuleInfo.id + 1);
      }
    };
    return (
      <LevelView
        activeModuleInfo={activeModuleInfo}
        currentLevelData={currentLevelData}
        levelState={levelState}
        program={program}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
        stars={stars}
        setView={setView}
        goToNextLevel={goToNextLevel}
        robotState={robotState}
        addBlock={addBlock}
        removeBlock={removeBlock}
        isRunning={isRunning}
        showCode={showCode}
        setShowCode={setShowCode}
        resetSimulation={resetSimulation}
        runProgram={runProgram}
        feedbackMsg={feedbackMsg}
        getBlockColor={getBlockColor}
        renderBlockIcon={renderBlockIcon}
        renderBlockLabel={renderBlockLabel}
        setProgram={setProgram}
        generateRealCode={generateRealCode}
      />
    );
  }
  return null;
}
