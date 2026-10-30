export function createInitialLevelState() {
  return { itemsCollected: 0, collectedItemsIds: [], doorsOpen: [], clones: [] };
}

export function getNextPos(robot) {
  let x = robot.x;
  let y = robot.y;
  if (robot.dir === 0) y -= 1;
  if (robot.dir === 1) x += 1;
  if (robot.dir === 2) y += 1;
  if (robot.dir === 3) x -= 1;
  return { x, y };
}

export function checkCollision(level, x, y, state) {
  if (x < 0 || x >= level.gridSize || y < 0 || y >= level.gridSize) return 'WALL';
  if (level.obstacles?.some((obstacle) => obstacle.x === x && obstacle.y === y)) return 'OBSTACLE';
  if (level.gate?.x === x && level.gate?.y === y && state.itemsCollected < level.gate.req) return 'GATE_LOCKED';
  const door = level.doors?.find((entry) => entry.x === x && entry.y === y);
  if (door && !state.doorsOpen.includes(door.id)) return 'DOOR_CLOSED';
  return null;
}

export function getSurpriseState(level, x, y, stepNumber) {
  const surprise = level.surprises?.find((entry) => entry.x === x && entry.y === y);
  if (!surprise) return null;
  const period = surprise.period || 2;
  const phaseOffset = surprise.phaseOffset || 0;
  return ((stepNumber + phaseOffset) % period) === 0 ? surprise : null;
}

export function resolveForwardMove(level, robot, state, stepNumber) {
  const next = getNextPos(robot);
  const collision = checkCollision(level, next.x, next.y, state);
  if (collision) return { collision, robot };

  let nextRobot = { ...robot, ...next };
  let teleported = false;
  const teleporter = level.teleporters?.find((entry) => entry.x === nextRobot.x && entry.y === nextRobot.y);
  if (teleporter) {
    nextRobot = { ...nextRobot, x: teleporter.targetX, y: teleporter.targetY };
    teleported = true;
  }

  const surprise = getSurpriseState(level, nextRobot.x, nextRobot.y, stepNumber);
  if (surprise?.type === 'trap') {
    nextRobot = {
      ...nextRobot,
      x: surprise.targetX ?? nextRobot.x,
      y: surprise.targetY ?? nextRobot.y,
    };
  }

  return {
    collision: null,
    robot: nextRobot,
    surprise,
    teleported,
    specialTransition: teleported || Boolean(surprise),
  };
}

export function handleTileInteraction(level, entity, currentState, actionType) {
  const newState = {
    ...currentState,
    collectedItemsIds: [...currentState.collectedItemsIds],
    doorsOpen: [...currentState.doorsOpen],
  };
  let actionHappened = false;

  if (actionType === 'collect') {
    const item = level.items?.find(
      (entry) => entry.x === entity.x && entry.y === entity.y && !newState.collectedItemsIds.includes(`${entry.x}-${entry.y}`)
    );
    if (item) {
      newState.itemsCollected += 1;
      newState.collectedItemsIds.push(`${item.x}-${item.y}`);
      actionHappened = true;
    }
  }

  if (actionType === 'interact') {
    const switchItem = level.switches?.find((entry) => entry.x === entity.x && entry.y === entity.y);
    if (switchItem && !newState.doorsOpen.includes(switchItem.linkId)) {
      newState.doorsOpen.push(switchItem.linkId);
      actionHappened = true;
    }
  }

  return { newState, actionHappened };
}

export function expandCommandSteps(level, command, robot, state, simulationStep) {
  if (command.type === 'if_wall_right') {
    const rightDir = (robot.dir + 1) % 4;
    const rightPos = getNextPos({ ...robot, dir: rightDir });
    return [checkCollision(level, rightPos.x, rightPos.y, state) ? { type: 'internal_move' } : { type: 'right' }];
  }

  if (command.type === 'func_stairs') {
    return [{ type: 'internal_move' }, { type: 'right' }, { type: 'internal_move' }, { type: 'left' }];
  }

  if (command.type !== 'dash' && command.type !== 'auto_path') return [command];

  const steps = [];
  let probeRobot = { ...robot };
  let probeStep = simulationStep;
  let limit = 0;
  while (limit < level.gridSize) {
    const movement = resolveForwardMove(level, probeRobot, state, probeStep + 1);
    if (movement.collision) break;
    probeRobot = movement.robot;
    probeStep += 1;
    steps.push({ type: 'internal_move' });
    limit += 1;
    if (movement.specialTransition) break;
  }

  if (command.type === 'auto_path') {
    const rightDir = (probeRobot.dir + 1) % 4;
    const rightPos = getNextPos({ ...probeRobot, dir: rightDir });
    const leftDir = (probeRobot.dir + 3) % 4;
    const leftPos = getNextPos({ ...probeRobot, dir: leftDir });
    if (!checkCollision(level, rightPos.x, rightPos.y, state)) steps.push({ type: 'right' });
    else if (!checkCollision(level, leftPos.x, leftPos.y, state)) steps.push({ type: 'left' });
  }

  return steps;
}

export function traceClonePath(level, robot, state) {
  const positions = [];
  let probe = { ...robot, isClone: true };
  let limit = 0;
  while (limit < level.gridSize) {
    const movement = resolveForwardMove(level, probe, state, limit + 1);
    if (movement.collision) break;
    probe = { ...movement.robot, isClone: true };
    positions.push(probe);
    limit += 1;
    if (movement.specialTransition) break;
  }
  return positions;
}

export function getMissingRequirements(level, robot, state, program) {
  const missing = [];
  if (robot.x !== level.goal.x || robot.y !== level.goal.y) missing.push('goal');
  if (level.gate && state.itemsCollected < level.gate.req) missing.push('items');
  for (const tool of level.requiredTools || []) {
    if (!program.some((command) => command.type === tool)) missing.push(`tool:${tool}`);
  }
  return missing;
}

export function isLevelComplete(level, robot, state, program) {
  return getMissingRequirements(level, robot, state, program).length === 0;
}

export function simulateProgram(level, program) {
  let robot = { ...level.start };
  let state = createInitialLevelState();
  let simulationStep = 0;

  for (const command of program) {
    if (command.type === 'send_clone') {
      for (const position of traceClonePath(level, robot, state)) {
        state = handleTileInteraction(level, position, state, 'interact').newState;
      }
      continue;
    }

    const steps = expandCommandSteps(level, command, robot, state, simulationStep);
    for (const step of steps) {
      if (step.type === 'collect' || step.type === 'interact') {
        state = handleTileInteraction(level, robot, state, step.type).newState;
      } else if (step.type === 'move' || step.type === 'internal_move') {
        const movement = resolveForwardMove(level, robot, state, simulationStep + 1);
        if (movement.collision) {
          return { success: false, reason: movement.collision, robot, state, simulationStep };
        }
        robot = movement.robot;
      } else if (step.type === 'left') {
        robot = { ...robot, dir: (robot.dir + 3) % 4 };
      } else if (step.type === 'right') {
        robot = { ...robot, dir: (robot.dir + 1) % 4 };
      }
      simulationStep += 1;
    }
  }

  return {
    success: isLevelComplete(level, robot, state, program),
    missingRequirements: getMissingRequirements(level, robot, state, program),
    robot,
    state,
    simulationStep,
  };
}
