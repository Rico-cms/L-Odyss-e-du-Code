import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInitialLevelState, handleTileInteraction, simulateProgram } from '../src/gameEngine.js';

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

function canonicalKey(level, robot, state, program) {
  const requiredToolState = (level.requiredTools || []).map((tool) => program.some((command) => command.type === tool) ? '1' : '0').join('');
  return `${robot.x},${robot.y},${robot.dir},${state.itemsCollected},${state.collectedItemsIds.join('|')},${state.doorsOpen.join('|')},${requiredToolState}`;
}

function findShortest(level) {
  const queue = [{ program: [], robot: { ...level.start }, state: createInitialLevelState() }];
  const visited = new Set([canonicalKey(level, queue[0].robot, queue[0].state, [])]);

  while (queue.length) {
    const item = queue.shift();
    const res = simulateProgram(level, item.program);
    if (res.success) return item.program;
    if (item.program.length >= 20) continue;

    for (const tool of level.availableTools) {
      const nextProgram = [...item.program, { type: tool }];
      const nextRes = simulateProgram(level, nextProgram);
      if (nextRes.success) return nextProgram;
      const key = canonicalKey(level, nextRes.robot, nextRes.state, nextProgram);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ program: nextProgram, robot: nextRes.robot, state: nextRes.state });
      }
    }
  }

  return null;
}

const issues = [];
const knownTools = new Set(['move', 'left', 'right', 'dash', 'if_wall_right', 'auto_path', 'collect', 'interact', 'func_stairs', 'send_clone']);
for (const [id, level] of Object.entries(LEVELS_DATA)) {
  const shortestProgram = findShortest(level);
  const shortest = shortestProgram?.length ?? null;
  const par = level.par;
  const maxBlocks = level.maxBlocks;
  const label = `${id}: ${level.levelNumber}`;
  if (shortest === null) {
    issues.push(`${label} is not solvable with the current tool set`);
    console.log(`${label} shortest=null par=${par} max=${maxBlocks}`);
    continue;
  }
  if (par !== shortest) {
    issues.push(`${label} par ${par} does not match the shortest solution ${shortest}`);
  }
  if (par > maxBlocks) {
    issues.push(`${label} par ${par} exceeds maxBlocks ${maxBlocks}`);
  }
  for (const tool of level.availableTools) {
    if (!knownTools.has(tool)) issues.push(`${label} exposes an unknown tool ${tool}`);
  }
  for (const tool of level.requiredTools || []) {
    if (!level.availableTools.includes(tool)) issues.push(`${label} requires unavailable tool ${tool}`);
  }
  if (level.gate && level.gate.req > (level.items?.length || 0)) {
    issues.push(`${label} gate requires ${level.gate.req} items but only ${level.items?.length || 0} exist`);
  }
  const obstacleKeys = new Set((level.obstacles || []).map((entry) => `${entry.x}-${entry.y}`));
  if (obstacleKeys.has(`${level.start.x}-${level.start.y}`)) issues.push(`${label} start overlaps an obstacle`);
  if (obstacleKeys.has(`${level.goal.x}-${level.goal.y}`)) issues.push(`${label} goal overlaps an obstacle`);
  for (const switchItem of level.switches || []) {
    if (!(level.doors || []).some((door) => door.id === switchItem.linkId)) {
      issues.push(`${label} switch ${switchItem.linkId} has no matching door`);
    }
  }
  const positionedEntries = [
    ['start', [level.start]],
    ['goal', [level.goal]],
    ['obstacle', level.obstacles],
    ['item', level.items],
    ['gate', level.gate ? [level.gate] : []],
    ['teleporter', level.teleporters],
    ['surprise', level.surprises],
    ['switch', level.switches],
    ['door', level.doors],
  ];
  for (const [kind, entries = []] of positionedEntries) {
    for (const entry of entries) {
      if (entry.x < 0 || entry.x >= level.gridSize || entry.y < 0 || entry.y >= level.gridSize) {
        issues.push(`${label} has an out-of-bounds ${kind} at (${entry.x},${entry.y})`);
      }
    }
  }
  console.log(`${label} shortest=${shortest} par=${par} max=${maxBlocks} solution=${shortestProgram.map(command => command.type).join(' > ')}`);
}

if (simulateProgram(LEVELS_DATA[2], LEVELS_DATA[2].initialCode).success) {
  issues.push('2: the deliberately buggy initial program already completes the level');
}

const crystalPosition = LEVELS_DATA[7].items[0];
const collectWithInteract = handleTileInteraction(LEVELS_DATA[7], crystalPosition, createInitialLevelState(), 'interact').newState;
const collectWithCollect = handleTileInteraction(LEVELS_DATA[7], crystalPosition, createInitialLevelState(), 'collect').newState;
if (collectWithInteract.itemsCollected !== 0 || collectWithCollect.itemsCollected !== 1) {
  issues.push('7: crystals must react only to the collect action');
}

const switchPosition = LEVELS_DATA[9].switches[0];
const switchWithCollect = handleTileInteraction(LEVELS_DATA[9], switchPosition, createInitialLevelState(), 'collect').newState;
const switchWithInteract = handleTileInteraction(LEVELS_DATA[9], switchPosition, createInitialLevelState(), 'interact').newState;
if (switchWithCollect.doorsOpen.length !== 0 || !switchWithInteract.doorsOpen.includes(1)) {
  issues.push('9: switches must react only to the interact action');
}

const twoMoves = [{ type: 'move' }, { type: 'move' }];
const fourMoves = [...twoMoves, ...twoMoves];
if (simulateProgram(LEVELS_DATA[8], twoMoves).success || !simulateProgram(LEVELS_DATA[8], fourMoves).success) {
  issues.push('8: the teleporter route must require four moves without a free trap shortcut');
}

if (issues.length > 0) {
  console.error('\nLevel balance issues found:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('\nAll level targets look consistent with the current simulation.');
