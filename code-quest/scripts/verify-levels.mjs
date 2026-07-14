import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourcePath = path.join(__dirname, '..', 'src', 'CodeQuest.jsx');
const source = fs.readFileSync(sourcePath, 'utf8');

const start = source.indexOf('const LEVELS_DATA =');
const end = source.indexOf('\nconst Button');
if (start === -1 || end === -1) {
  throw new Error('Unable to locate LEVELS_DATA in CodeQuest.jsx');
}
const snippet = source.slice(start, end) + '\nthis.__LEVELS_DATA__ = LEVELS_DATA;';
const context = {
  console,
  Array,
  Object,
  Math,
  Date,
  Set,
  Map,
  JSON,
  RegExp,
  parseInt,
  parseFloat,
  isNaN,
  NaN,
  Infinity,
  ArrayFrom: Array.from,
};
vm.createContext(context);
vm.runInContext(snippet, context);
const LEVELS_DATA = context.__LEVELS_DATA__;

function getNextPos(robot) {
  let newX = robot.x;
  let newY = robot.y;
  if (robot.dir === 0) newY -= 1;
  if (robot.dir === 1) newX += 1;
  if (robot.dir === 2) newY += 1;
  if (robot.dir === 3) newX -= 1;
  return { x: newX, y: newY };
}

function getRightPos(robot) {
  return getNextPos({ ...robot, dir: (robot.dir + 1) % 4 });
}

function checkCollision(level, x, y, currentState) {
  if (x < 0 || x >= level.gridSize || y < 0 || y >= level.gridSize) return 'WALL';
  if (level.obstacles?.some((obs) => obs.x === x && obs.y === y)) return 'OBSTACLE';
  if (level.gate && level.gate.x === x && level.gate.y === y) {
    if (currentState.itemsCollected < level.gate.req) return 'GATE_LOCKED';
  }
  if (level.doors) {
    const door = level.doors.find((d) => d.x === x && d.y === y);
    if (door && !currentState.doorsOpen.includes(door.id)) return 'DOOR_CLOSED';
  }
  return null;
}

function handleTileInteraction(level, entity, currentState) {
  let newState = { ...currentState };
  const item = level.items?.find(
    (it) => it.x === entity.x && it.y === entity.y && !newState.collectedItemsIds.includes(`${it.x}-${it.y}`)
  );
  if (item) {
    newState.itemsCollected += 1;
    newState.collectedItemsIds.push(`${item.x}-${item.y}`);
  }
  const switchItem = level.switches?.find((s) => s.x === entity.x && s.y === entity.y);
  if (switchItem && !newState.doorsOpen.includes(switchItem.linkId)) {
    newState.doorsOpen.push(switchItem.linkId);
  }
  return newState;
}

function runProgram(level, program) {
  let currentRobot = { ...level.start };
  let currentState = { itemsCollected: 0, collectedItemsIds: [], doorsOpen: [], clones: [] };

  for (const command of program) {
    let stepsToExecute = [command];

    if (command.type === 'dash') {
      stepsToExecute = [];
      let limit = 0;
      let probeRobot = { ...currentRobot };
      while (limit < level.gridSize) {
        const next = getNextPos(probeRobot);
        if (checkCollision(level, next.x, next.y, currentState)) break;
        probeRobot = { ...probeRobot, ...next };
        stepsToExecute.push({ type: 'internal_move' });
        limit += 1;
      }
    } else if (command.type === 'if_wall_right') {
      stepsToExecute = [];
      const rightPos = getRightPos(currentRobot);
      const rightCollision = checkCollision(level, rightPos.x, rightPos.y, currentState);
      if (rightCollision) stepsToExecute.push({ type: 'internal_move' });
      else stepsToExecute.push({ type: 'right' });
    } else if (command.type === 'auto_path') {
      stepsToExecute = [];
      let limit = 0;
      let probeRobot = { ...currentRobot };
      while (limit < level.gridSize) {
        const next = getNextPos(probeRobot);
        if (checkCollision(level, next.x, next.y, currentState)) break;
        probeRobot = { ...probeRobot, ...next };
        stepsToExecute.push({ type: 'internal_move' });
        limit += 1;
      }
      const rightDir = (probeRobot.dir + 1) % 4;
      const nextRight = getNextPos({ ...probeRobot, dir: rightDir });
      const leftDir = (probeRobot.dir + 3) % 4;
      const nextLeft = getNextPos({ ...probeRobot, dir: leftDir });
      if (!checkCollision(level, nextRight.x, nextRight.y, currentState)) {
        stepsToExecute.push({ type: 'right' });
      } else if (!checkCollision(level, nextLeft.x, nextLeft.y, currentState)) {
        stepsToExecute.push({ type: 'left' });
      }
    } else if (command.type === 'func_stairs') {
      stepsToExecute = [{ type: 'internal_move' }, { type: 'right' }, { type: 'internal_move' }, { type: 'left' }];
    } else if (command.type === 'send_clone') {
      stepsToExecute = [];
      const cloneStart = { ...currentRobot, isClone: true };
      let cloneProbe = { ...cloneStart };
      const cloneSteps = [];
      let limit = 0;
      while (limit < level.gridSize) {
        const next = getNextPos(cloneProbe);
        if (checkCollision(level, next.x, next.y, currentState)) break;
        cloneProbe = { ...cloneProbe, ...next };
        cloneSteps.push({ ...cloneProbe });
        limit += 1;
      }
      for (const stepPos of cloneSteps) {
        currentState = handleTileInteraction(level, stepPos, currentState);
      }
    } else if (command.type === 'collect') {
      stepsToExecute = [{ type: 'collect' }];
    } else if (command.type === 'interact') {
      stepsToExecute = [{ type: 'interact' }];
    } else if (command.type === 'move') {
      stepsToExecute = [{ type: 'move' }];
    } else if (command.type === 'left') {
      stepsToExecute = [{ type: 'left' }];
    } else if (command.type === 'right') {
      stepsToExecute = [{ type: 'right' }];
    }

    for (const step of stepsToExecute) {
      if (step.type === 'collect' || step.type === 'interact') {
        currentState = handleTileInteraction(level, currentRobot, currentState);
      } else if (step.type === 'move' || step.type === 'internal_move') {
        const next = getNextPos(currentRobot);
        const collision = checkCollision(level, next.x, next.y, currentState);
        if (collision) return { success: false, reason: collision, robot: currentRobot, state: currentState };
        currentRobot = { ...currentRobot, ...next };
        const teleporter = level.teleporters?.find((tp) => tp.x === currentRobot.x && tp.y === currentRobot.y);
        if (teleporter) {
          currentRobot = { ...currentRobot, x: teleporter.targetX, y: teleporter.targetY };
        }
      } else if (step.type === 'left') {
        currentRobot = { ...currentRobot, dir: (currentRobot.dir + 3) % 4 };
      } else if (step.type === 'right') {
        currentRobot = { ...currentRobot, dir: (currentRobot.dir + 1) % 4 };
      }
    }
  }

  return {
    success: currentRobot.x === level.goal.x && currentRobot.y === level.goal.y,
    robot: currentRobot,
    state: currentState,
  };
}

function canonicalKey(robot, state) {
  return `${robot.x},${robot.y},${robot.dir},${state.itemsCollected},${state.collectedItemsIds.join('|')},${state.doorsOpen.join('|')}`;
}

function findShortest(level) {
  const queue = [{ program: [], robot: { ...level.start }, state: { itemsCollected: 0, collectedItemsIds: [], doorsOpen: [], clones: [] } }];
  const visited = new Set([canonicalKey(queue[0].robot, queue[0].state)]);

  while (queue.length) {
    const item = queue.shift();
    const res = runProgram(level, item.program);
    if (res.success) return item.program.length;
    if (item.program.length >= 20) continue;

    for (const tool of level.availableTools) {
      const nextProgram = [...item.program, { type: tool }];
      const nextRes = runProgram(level, nextProgram);
      if (nextRes.success) return nextProgram.length;
      const key = canonicalKey(nextRes.robot, nextRes.state);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ program: nextProgram, robot: nextRes.robot, state: nextRes.state });
      }
    }
  }

  return null;
}

const issues = [];
for (const [id, level] of Object.entries(LEVELS_DATA)) {
  const shortest = findShortest(level);
  const par = level.par;
  const maxBlocks = level.maxBlocks;
  const label = `${id}: ${level.levelNumber}`;
  if (shortest === null) {
    issues.push(`${label} is not solvable with the current tool set`);
    console.log(`${label} shortest=null par=${par} max=${maxBlocks}`);
    continue;
  }
  if (par < shortest) {
    issues.push(`${label} par ${par} is below the shortest solution ${shortest}`);
  }
  if (par > maxBlocks) {
    issues.push(`${label} par ${par} exceeds maxBlocks ${maxBlocks}`);
  }
  console.log(`${label} shortest=${shortest} par=${par} max=${maxBlocks}`);
}

if (issues.length > 0) {
  console.error('\nLevel balance issues found:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('\nAll level targets look consistent with the current simulation.');
