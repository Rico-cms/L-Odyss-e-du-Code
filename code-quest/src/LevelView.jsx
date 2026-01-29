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
          {/* Feedback global animé (succès, erreur, info) */}
          {(gameStatus === 'success' || gameStatus === 'failure' || gameStatus === 'running') && (
            <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none transition-all duration-500 ${gameStatus === 'success' ? 'bg-emerald-900/80' : gameStatus === 'failure' ? 'bg-rose-900/80' : 'bg-indigo-900/60'}`}>
              <div className={`relative max-w-lg w-full text-center rounded-3xl shadow-2xl border-4 transition-all duration-500
                ${gameStatus === 'success' ? 'border-emerald-400 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 animate-pop-in' :
                  gameStatus === 'failure' ? 'border-rose-400 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-700 animate-shake' :
                  'border-indigo-400 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 animate-fade-in'}
              `} style={{ pointerEvents: 'auto' }}>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2
                    ${gameStatus === 'success' ? 'bg-emerald-800/60 animate-bounce-in' :
                      gameStatus === 'failure' ? 'bg-rose-800/60 animate-shake' :
                      'bg-indigo-800/60 animate-spin-slow'}`}
                  >
                    {gameStatus === 'success' && <CheckCircle className="w-12 h-12 text-emerald-400 animate-pulse" />}
                    {gameStatus === 'failure' && <XCircle className="w-12 h-12 text-rose-400 animate-pulse" />}
                    {gameStatus === 'running' && <RefreshCw className="w-12 h-12 text-indigo-400 animate-spin" />}
                  </div>
                  {gameStatus === 'success' && (
                    <div className="flex gap-2 justify-center mb-2">
                      {[1, 2, 3].map(s => (
                        <Star key={s} size={40} className={`transition-all duration-500 ${s <= stars ? 'text-amber-400 fill-amber-400 scale-125' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  )}
                  <h2 className={`text-3xl font-bold mb-2 ${gameStatus === 'success' ? 'text-emerald-200' : gameStatus === 'failure' ? 'text-rose-200' : 'text-indigo-200'}`}>
                    {gameStatus === 'success' ? 'Niveau Complété !' : gameStatus === 'failure' ? 'Échec...' : 'Simulation en cours...'}
                  </h2>
                  <p className="text-gray-300 text-base mb-4 min-h-6">{feedbackMsg || (gameStatus === 'success' ? 'Bravo !' : gameStatus === 'failure' ? 'Essaie encore !' : '...')}</p>
                  {gameStatus === 'success' && currentLevelData.par && (
                    <p className="text-gray-400 text-sm mb-4">Blocs utilisés: <span className="text-emerald-300 font-bold">{program.length}</span> (Objectif: {currentLevelData.par})</p>
                  )}
                  {gameStatus === 'success' && (
                    <button onClick={() => setView('map')} className="btn-success w-full !py-3 mt-2">
                      Continuer l'aventure <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        <div className="flex-1 bg-slate-900 p-6 flex flex-col items-center justify-center">
          <div className="glass-panel p-4 shadow-2xl rounded-2xl border-4 border-indigo-700/30 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
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

                // Style dynamique pour chaque case
                let cellClass = 'relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-2 shadow-inner transition-all duration-200';
                if (isObstacle) cellClass += ' bg-rose-900/60 border-rose-700';
                else if (isGoal) cellClass += ' bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 border-emerald-500 ring-2 ring-emerald-400';
                else if (isTeleporter) cellClass += ' bg-cyan-900/40 border-cyan-600 animate-pulse';
                else cellClass += ' bg-slate-800/60 border-indigo-700';

                return (
                  <div key={i} className={cellClass} style={{ boxShadow: isGoal ? '0 0 16px 4px #34d39988' : isObstacle ? '0 0 8px 2px #f43f5e44' : undefined }}>
                    {/* Obstacle */}
                    {isObstacle && <span className="text-2xl select-none animate-bounce">🧱</span>}
                    {/* Cristal */}
                    {isItem && !isCollected && <Gem className="text-indigo-300 animate-pulse drop-shadow-lg" size={22} />}
                    {/* Porte verrouillée */}
                    {isGate && !gateOpen && <Lock className="text-rose-400 animate-pulse" size={22} />}
                    {/* Téléporteur */}
                    {isTeleporter && <Radio className="text-cyan-400 animate-pulse" size={20} />}
                    {/* Interrupteur */}
                    {isSwitch && <div className={`w-5 h-5 rounded-full border-2 ${levelState.doorsOpen.includes(isSwitch.linkId) ? 'bg-emerald-400 border-emerald-600 animate-pulse' : 'bg-rose-500 border-rose-700 animate-pulse-slow'}`}></div>}
                    {/* Porte */}
                    {door && !isDoorOpen && <DoorClosed className="text-rose-400 animate-pulse" size={22} />}
                    {door && isDoorOpen && <DoorOpen className="text-emerald-400 animate-pulse" size={18} />}
                    {/* Objectif */}
                    {isGoal && !isRobot && <Star className="text-amber-400 animate-pulse fill-amber-400 drop-shadow-xl" size={22} />}
                    {/* Robot principal */}
                    {isRobot && <div className="text-3xl transition-transform duration-300 drop-shadow-2xl animate-float" style={{ transform: `rotate(${robotState.dir * 90}deg)` }}>🚀</div>}
                    {/* Clone */}
                    {isClone && <div className="text-2xl transition-transform duration-300 drop-shadow-lg opacity-70 animate-float-slow" style={{ transform: `rotate(${isClone.dir * 90}deg)` }}>🤖</div>}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Feedback flottant en bas pour info/hint */}
          {gameStatus !== 'success' && (
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 font-semibold border-2 text-base z-30 transition-all duration-500
              ${gameStatus === 'running' ? 'border-indigo-500 bg-indigo-900/80 text-indigo-200 animate-pulse' :
                gameStatus === 'failure' ? 'border-rose-500 bg-rose-900/80 text-rose-200 animate-shake' :
                'border-gray-700 bg-slate-800/90 text-gray-200 animate-fade-in'}
            `}>
              {gameStatus === 'running' ? <RefreshCw className="animate-spin" size={20} /> : gameStatus === 'failure' ? <XCircle size={20} /> : <Info size={20} />}
              <span>{feedbackMsg || "En attente..."}</span>
            </div>
          )}
              {/* Animations CSS utilitaires */}
              <style>{`
                @keyframes pop-in { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
                .animate-pop-in { animation: pop-in 0.7s cubic-bezier(.22,1.12,.62,1.01); }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                .animate-shimmer { background-size: 200% 100%; animation: shimmer 2.5s infinite linear; }
                @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
                .animate-shake { animation: shake 0.5s; }
                @keyframes bounce-in { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
                .animate-bounce-in { animation: bounce-in 0.7s cubic-bezier(.22,1.12,.62,1.01); }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                .animate-float { animation: float 2.5s ease-in-out infinite; }
                @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
                .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 1s; }
                @keyframes spin-slow { 100% { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 3s linear infinite; }
              `}</style>
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
