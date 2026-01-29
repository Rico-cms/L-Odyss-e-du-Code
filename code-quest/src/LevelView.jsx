import React from "react";
import { ChevronRight, CheckCircle, Star, Lock, Gem, Radio, DoorClosed, DoorOpen, RefreshCw, XCircle, Info } from "lucide-react";

export default function LevelView({
  activeModuleInfo,
  currentLevelData,
  levelState,
  program,
  gameStatus,
  stars,
  setView,
  robotState,
  addBlock,
  removeBlock,
  isRunning,
  showCode,
  setShowCode,
  resetSimulation,
  runProgram,
  feedbackMsg,
  getBlockColor,
  renderBlockIcon,
  renderBlockLabel,
  setProgram
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex flex-col">
      <header className="glass-panel border-b border-indigo-700/20 p-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(activeModuleInfo.id === 99 ? 'editor' : 'map')} className="btn-secondary !py-1 !px-3 text-sm"><ChevronRight className="rotate-180" size={16} /></button>
          <div>
            <h2 className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">{activeModuleInfo.title}</h2>
            <p className="text-xs text-gray-400">{activeModuleInfo.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentLevelData.items && (
            <div className="glass-panel px-3 py-1 rounded text-sm text-emerald-300 font-bold border border-emerald-600/50">
              Cristaux: {levelState.itemsCollected}/{currentLevelData.gate?.req || currentLevelData.items.length}
            </div>
          )}
          <div className="glass-panel px-4 py-2 rounded text-sm border border-indigo-600/50 font-bold text-indigo-300">
            Mémoire: {program.length}/{currentLevelData.maxBlocks}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {gameStatus === 'success' && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-panel-lg max-w-lg w-full text-center relative border-2 border-emerald-600">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-success"></div>
               <div className="mb-6 flex flex-col items-center gap-4">
                 <div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center animate-pulse">
                   <CheckCircle className="w-12 h-12 text-emerald-400" />
                 </div>
                 <div className="flex gap-2 justify-center">
                    {[1, 2, 3].map(s => (
                      <Star key={s} size={40} className={`transition-all duration-500 ${s <= stars ? 'text-amber-400 fill-amber-400 scale-125' : 'text-gray-600'}`} />
                    ))}
                 </div>
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">Niveau Complété !</h2>
               {currentLevelData.par && (
                 <p className="text-gray-400 text-sm mb-6">Blocs utilisés: <span className="text-emerald-300 font-bold">{program.length}</span> (Objectif: {currentLevelData.par})</p>
               )}
               <button onClick={() => setView('map')} className="btn-success w-full !py-3">
                 Continuer l'aventure <ChevronRight size={20} />
               </button>
            </div>
          </div>
        )}

        <div className="flex-1 bg-slate-900 p-6 flex flex-col items-center justify-center">
          <div className="glass-panel p-4 shadow-lg">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${currentLevelData.gridSize}, minmax(0, 1fr))` }}>
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
                  <div key={i} className={`game-cell
                     ${isObstacle ? 'bg-rose-900/40 border-rose-600' : isGoal ? 'bg-emerald-900/30 border-emerald-600 ring-2 ring-emerald-500' : isTeleporter ? 'bg-cyan-900/30 border-cyan-600' : 'bg-slate-800/50 border-indigo-700'}
                  `}>
                    {isObstacle && "🧱"}
                    {isItem && !isCollected && <Gem className="text-indigo-400 animate-pulse" size={18} />}
                    {isGate && !gateOpen && <Lock className="text-rose-400" size={20} />}
                    {isTeleporter && <Radio className="text-cyan-400 animate-pulse" size={18} />}
                    {isSwitch && <div className={`w-4 h-4 rounded-full ${levelState.doorsOpen.includes(isSwitch.linkId) ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>}
                    {door && !isDoorOpen && <DoorClosed className="text-rose-400" size={20} />}
                    {door && isDoorOpen && <DoorOpen className="text-emerald-500" size={16} />}
                    {isGoal && !isRobot && <Star className="text-amber-400 animate-pulse fill-amber-400" size={18} />}
                    {isRobot && <div className="text-2xl transition-transform duration-300 drop-shadow-lg" style={{ transform: `rotate(${robotState.dir * 90}deg)` }}>🚀</div>}
                    {isClone && <div className="text-xl transition-transform duration-300 drop-shadow-lg opacity-70" style={{ transform: `rotate(${isClone.dir * 90}deg)` }}>🤖</div>}
                  </div>
                );
              })}
            </div>
          </div>
          {gameStatus !== 'success' && (
            <div className={`mt-6 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold border transition-all text-sm ${gameStatus === 'running' ? 'border-indigo-600 bg-indigo-900/30 text-indigo-300' : gameStatus === 'failure' ? 'border-rose-600 bg-rose-900/30 text-rose-300' : 'border-gray-700 bg-slate-800 text-gray-400'}`}>
                {gameStatus === 'running' ? <RefreshCw className="animate-spin" size={16} /> : gameStatus === 'failure' ? <XCircle size={16} /> : <Info size={16} />}
                {feedbackMsg || "En attente..."}
            </div>
          )}
        </div>

        <div className="w-full md:w-80 bg-slate-800/50 border-l border-indigo-700/20 flex flex-col shadow-2xl z-10 backdrop-blur">
          <div className="p-4 border-b border-indigo-700/20 bg-slate-800/70">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Outils Disponibles</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentLevelData.availableTools.map(tool => (
                 <button key={tool} onClick={() => addBlock(tool)} disabled={isRunning}
                  className={`p-2 rounded text-xs font-bold flex items-center justify-center gap-1 transition-all duration-150 disabled:opacity-50 ${
                    tool === 'dash' || tool.startsWith('func') || tool === 'send_clone' ? 'btn-secondary bg-orange-900 border-orange-700' 
                    : tool === 'if_wall_right' ? 'btn-secondary bg-purple-900 border-purple-700'
                    : tool === 'auto_path' ? 'btn-secondary bg-cyan-900 border-cyan-700'
                    : tool === 'collect' ? 'btn-secondary bg-emerald-900 border-emerald-700'
                    : tool === 'interact' ? 'btn-secondary bg-teal-900 border-teal-700'
                    : 'btn-secondary bg-indigo-900/30 border-indigo-700'
                  }`}>
                  {renderBlockIcon(tool)}
                 </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-slate-900/50 space-y-2">
             <div className="flex justify-between items-center mb-2">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Programme</h3>
               <div className="flex gap-2 text-xs">
                 <button onClick={() => setShowCode(!showCode)} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                   {showCode ? 'Blocs' : 'Code'}
                 </button>
                 <button onClick={() => setProgram([])} className="text-rose-400 hover:text-rose-300 transition-colors">Effacer</button>
               </div>
             </div>
             <div className="space-y-1 min-h-40 border-2 border-dashed border-indigo-700/20 rounded p-2 bg-slate-900/30">
               {program.length === 0 && <div className="text-center text-gray-600 italic text-xs pt-12">Zone vide</div>}
               {showCode ? (
                 <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-snug">
                   {/* La génération du code réel doit être passée en prop si besoin */}
                 </pre>
               ) : (
                 program.map((block, index) => (
                   <div key={block.id} className={`p-2 rounded text-xs flex justify-between items-center border-l-4 animate-fade-in ${getBlockColor(block.type)} bg-opacity-20`}>
                     <span className="flex items-center gap-1 font-semibold">
                       <span className="text-gray-500 font-mono text-xs">{index + 1}.</span>
                       {renderBlockIcon(block.type)}
                       {renderBlockLabel(block.type)}
                     </span>
                     <button onClick={() => removeBlock(index)} disabled={isRunning} className="text-gray-400 hover:text-rose-400 transition-colors">
                       <XCircle size={14} />
                     </button>
                   </div>
                 ))
               )}
             </div>
          </div>
          <div className="p-3 bg-dark-800 border-t border-brand-700 border-opacity-20 grid grid-cols-2 gap-2">
            <button onClick={resetSimulation} disabled={isRunning} className="btn-secondary text-xs">Reset</button>
            <button onClick={runProgram} disabled={isRunning || program.length === 0} className="btn-success text-xs">{isRunning ? '...' : 'Go'}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
