import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, CheckCircle, Star, Lock, Gem, Radio, DoorClosed, DoorOpen, RefreshCw, XCircle, Info } from "lucide-react";

export default function LevelView({
  activeModuleInfo,
  currentLevelData,
  levelState,
  program,
  gameStatus,
  setGameStatus,
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
  setProgram,
  generateRealCode
}) {
  // État local pour forcer la fermeture du modal
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (gameStatus === 'success' || gameStatus === 'failure') setModalOpen(true);
    else setModalOpen(false);
  }, [gameStatus]);

  // Ferme le modal si on clique en dehors du contenu (hors modalRef)
  useEffect(() => {
    if (!modalOpen) return;
    function handleDocClick(e) {
      if (!modalRef.current) return;
      if (!modalRef.current.contains(e.target)) {
        setModalOpen(false);
        setGameStatus('idle');
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [modalOpen, setGameStatus]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setGameStatus('idle');
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    resetSimulation();
    setModalOpen(false);
    setGameStatus('idle');
  };

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


          {/* Résumé succès/échec, non bloquant, dismissible */}
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-40" onClick={handleCloseModal}>
              <div
                id="modal-summary"
                ref={modalRef}
                className={`relative w-full max-w-2xl mx-auto text-center rounded-3xl shadow-2xl border-4 transition-all duration-500 p-8 md:p-12 flex flex-col items-center
                  ${gameStatus === 'success' ? 'border-emerald-400 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 animate-pop-in' :
                    'border-rose-400 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-700 animate-shake'}
                `}
                style={{ pointerEvents: 'auto', minHeight: '340px' }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-6 text-white/80 hover:text-white text-3xl font-bold px-3 py-1 bg-black/20 rounded-full transition-all"
                  onClick={handleCloseModal}
                  aria-label="Fermer la fenêtre"
                >
                  ×
                </button>
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-2
                    ${gameStatus === 'success' ? 'bg-emerald-800/60 animate-bounce-in' :
                      'bg-rose-800/60 animate-shake'}`}
                  >
                    {gameStatus === 'success' && <CheckCircle className="w-16 h-16 text-emerald-400 animate-pulse" />}
                    {gameStatus === 'failure' && <XCircle className="w-16 h-16 text-rose-400 animate-pulse" />}
                  </div>
                  {gameStatus === 'success' && (
                    <div className="flex gap-3 justify-center mb-2">
                      {[1, 2, 3].map(s => (
                        <Star key={s} size={56} className={`transition-all duration-500 ${s <= stars ? 'text-amber-400 fill-amber-400 scale-125' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  )}
                  <h2 className={`text-4xl md:text-5xl font-extrabold mb-2 ${gameStatus === 'success' ? 'text-emerald-100 drop-shadow' : 'text-rose-100 drop-shadow'}`}>
                    {gameStatus === 'success' ? 'Niveau Complété !' : 'Échec...'}
                  </h2>
                  <p className="text-gray-200 text-lg md:text-xl mb-4 min-h-6 font-semibold">{feedbackMsg || (gameStatus === 'success' ? 'Bravo !' : 'Essaie encore !')}</p>
                  {gameStatus === 'success' && currentLevelData.par && (
                    <p className="text-gray-300 text-base mb-4">Blocs utilisés: <span className="text-emerald-200 font-bold">{program.length}</span> (Objectif: {currentLevelData.par})</p>
                  )}
                  <button
                    onClick={handleRestart}
                    className="mt-2 btn-primary text-lg px-8 py-3 rounded-2xl shadow-lg"
                  >
                    Recommencer
                  </button>
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

        <aside className="w-full md:w-80 bg-gradient-to-br from-indigo-100 via-blue-100 to-emerald-100 border-l-4 border-indigo-300 flex flex-col shadow-2xl z-10 backdrop-blur rounded-l-3xl">
          <div className="p-5 border-b-2 border-indigo-200 bg-white/80 rounded-tl-3xl">
            <h2 className="text-lg font-extrabold text-indigo-700 mb-1 flex items-center gap-2">🧩 Construis ton programme !</h2>
            <p className="text-sm text-indigo-500 font-semibold mb-2">Ajoute les blocs pour guider le robot jusqu'à l'étoile ⭐</p>
            <div className="flex flex-col gap-1 text-xs text-blue-700 font-bold bg-blue-100/60 rounded p-2 mb-2">
              <span>1️⃣ Clique sur un bloc pour l'ajouter</span>
              <span>2️⃣ Clique sur la croix pour supprimer</span>
              <span>3️⃣ Appuie sur <span className="inline-block bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">Tester mon programme</span></span>
            </div>
          </div>

          <div className="p-4 border-b-2 border-indigo-200 bg-white/70">
            <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Outils disponibles</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentLevelData.availableTools.map(tool => (
                <button key={tool} onClick={() => addBlock(tool)} disabled={isRunning}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl font-bold shadow-md border-2 transition-all duration-150 disabled:opacity-50
                    ${tool === 'dash' || tool.startsWith('func') || tool === 'send_clone' ? 'bg-orange-100 border-orange-300 text-orange-700' 
                    : tool === 'if_wall_right' ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : tool === 'auto_path' ? 'bg-cyan-100 border-cyan-300 text-cyan-700'
                    : tool === 'collect' ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : tool === 'interact' ? 'bg-teal-100 border-teal-300 text-teal-700'
                    : 'bg-indigo-100 border-indigo-300 text-indigo-700'}
                  `}
                  title={renderBlockLabel(tool)}
                >
                  <span className="text-2xl">{renderBlockIcon(tool)}</span>
                  <span className="text-xs font-bold leading-tight">{renderBlockLabel(tool)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-white/60">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Mon programme</h3>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setShowCode(!showCode)} className="text-emerald-600 hover:text-emerald-400 font-bold transition-colors underline">
                  {showCode ? 'Voir les blocs' : 'Voir le code'}
                </button>
                <button onClick={() => setProgram([])} className="text-rose-600 hover:text-rose-400 font-bold transition-colors underline">Tout effacer</button>
              </div>
            </div>
            <div className="space-y-2 min-h-40 border-2 border-dashed border-indigo-300 rounded-xl p-3 bg-indigo-50/60">
              {program.length === 0 && <div className="text-center text-indigo-300 italic text-xs pt-10">Ajoute des blocs à ton programme !</div>}
              {showCode ? (
                <pre className="text-xs font-mono text-emerald-700 whitespace-pre-wrap leading-snug bg-emerald-100/60 rounded p-2">
                  {generateRealCode ? generateRealCode() : '// Code non disponible'}
                </pre>
              ) : (
                program.map((block, index) => (
                  <div key={block.id} className={`flex items-center justify-between gap-2 p-2 rounded-xl border-2 bg-white/80 shadow-sm animate-fade-in ${getBlockColor(block.type)}`}
                    style={{ borderLeftWidth: '8px' }}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="text-indigo-400 font-mono text-xs">{index + 1}.</span>
                      <span className="text-xl">{renderBlockIcon(block.type)}</span>
                      <span className="text-xs font-bold text-indigo-700">{renderBlockLabel(block.type)}</span>
                    </span>
                    <button onClick={() => removeBlock(index)} disabled={isRunning} className="text-rose-500 hover:text-rose-700 transition-colors bg-rose-100 rounded-full p-1 ml-2 shadow">
                      <XCircle size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-emerald-200 via-blue-200 to-indigo-200 border-t-2 border-indigo-200 grid grid-cols-1 gap-3 rounded-bl-3xl">
            <button onClick={resetSimulation} disabled={isRunning} className="w-full py-3 rounded-xl font-bold text-lg bg-white text-indigo-700 border-2 border-indigo-300 shadow hover:bg-indigo-50 transition-all">
              🔄 Recommencer
            </button>
            <button onClick={runProgram} disabled={isRunning || program.length === 0} className="w-full py-3 rounded-xl font-bold text-lg bg-emerald-400 text-white border-2 border-emerald-500 shadow hover:bg-emerald-500 transition-all animate-pop-in">
              🚀 Tester mon programme
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
