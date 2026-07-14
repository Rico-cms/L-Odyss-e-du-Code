import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, CheckCircle, Star, Lock, Gem, Radio, DoorClosed, DoorOpen, RefreshCw, XCircle, Info, Cpu } from "lucide-react";

export default function LevelView({
  activeModuleInfo,
  currentLevelData,
  levelState,
  program,
  gameStatus,
  setGameStatus,
  stars,
  setView,
  goToNextLevel,
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
  const [hoveredTool, setHoveredTool] = useState(null);
  const modalRef = useRef();

  const toolMeta = {
    move: { label: 'Avancer', description: 'Avance d’une case dans la direction actuelle.' },
    left: { label: 'Tourner à gauche', description: 'Tourne ton robot de 90° vers la gauche.' },
    right: { label: 'Tourner à droite', description: 'Tourne ton robot de 90° vers la droite.' },
    dash: { label: 'Dash', description: 'Avance autant que possible jusqu’à rencontrer un obstacle.' },
    if_wall_right: { label: 'Si mur à droite', description: 'Si le chemin est bloqué, tourne. Sinon, avance.' },
    auto_path: { label: 'Auto-path', description: 'Avance automatiquement en s’arrêtant face aux obstacles.' },
    collect: { label: 'Collecter', description: 'Ramasse un cristal ou un objet sur la case actuelle.' },
    interact: { label: 'Interagir', description: 'Actionne un interrupteur ou un mécanisme sur la case actuelle.' },
    func_stairs: { label: 'Fonction Escalier', description: 'Exécute une série d’actions préprogrammées pour avancer.' },
    send_clone: { label: 'Envoyer clone', description: 'Envoie un clone en ligne droite pour activer un interrupteur.' },
  };

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.15),_transparent_30%),linear-gradient(135deg,_#fffaf3_0%,_#f1f8ff_45%,_#f8f2ff_100%)] text-slate-800 flex flex-col">
      <header className="sticky top-0 z-30 flex min-h-[96px] flex-col items-center justify-between gap-4 border-b border-white/70 bg-white/70 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex-row md:px-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(activeModuleInfo.id === 99 ? 'editor' : 'map')} className="flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-lg font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-fuchsia-500">Niveau {currentLevelData.levelNumber || activeModuleInfo.id}</span>
            <span className="text-2xl font-extrabold text-slate-800 md:text-3xl">{activeModuleInfo.title}</span>
            <span className="text-sm italic text-slate-600">{activeModuleInfo.desc}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {currentLevelData.items && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-base font-bold text-emerald-700 shadow-sm">
              <Gem className="text-emerald-500" size={18} />
              <span>Cristaux</span>
              <span className="ml-1">{levelState.itemsCollected}/{currentLevelData.gate?.req || currentLevelData.items.length}</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-base font-bold text-sky-700 shadow-sm">
            <Cpu className="text-sky-500" size={18} />
            <span>Mémoire</span>
            <span className="ml-1">{program.length}/{currentLevelData.maxBlocks}</span>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
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
                  {gameStatus === 'success' && currentLevelData.pedagogy && (
                    <div className="bg-indigo-900/60 border-l-4 border-emerald-400 rounded-xl p-4 mb-4 text-left">
                      <div className="font-bold text-emerald-200 mb-1">Ce que tu viens de faire :</div>
                      <div className="text-indigo-100 text-base mb-1">{currentLevelData.pedagogy.explanation}</div>
                      {currentLevelData.pedagogy.devWorld && (
                        <div className="text-indigo-300 text-sm italic mb-1">Dans la vie de développeur : {currentLevelData.pedagogy.devWorld}</div>
                      )}
                      {currentLevelData.pedagogy.takeaway && (
                        <div className="text-emerald-300 text-base font-bold mt-2">{currentLevelData.pedagogy.takeaway}</div>
                      )}
                    </div>
                  )}
                  {gameStatus === 'success' && currentLevelData.par && (
                    <p className="text-gray-300 text-base mb-4">Blocs utilisés: <span className="text-emerald-200 font-bold">{program.length}</span> (Objectif: {currentLevelData.par})</p>
                  )}
                  {/* (explication pédagogique contextualisée déjà affichée ci-dessus) */}
                  {/* Solution de référence si disponible */}
                  {currentLevelData.solution && (
                    <div className="w-full text-left bg-white/10 rounded-xl p-4 my-4">
                      <h3 className="text-lg font-bold text-emerald-200 mb-2">Solution classique :</h3>
                      <ol className="list-decimal list-inside text-emerald-100 text-base">
                        {currentLevelData.solution.map((block, idx) => (
                          <li key={block.id || idx} className="mb-1">
                            {typeof block === 'string' ? block : (block.type || JSON.stringify(block))}
                          </li>
                        ))}
                      </ol>
                      {/* Comparaison simple */}
                      <div className="mt-2 text-sm font-semibold">
                        {program.length === currentLevelData.solution.length
                          ? <span className="text-emerald-300">Bravo, tu as utilisé autant d’étapes que la solution classique !</span>
                          : program.length < currentLevelData.solution.length
                            ? <span className="text-emerald-400">Super, tu as fait plus court que la solution classique !</span>
                            : <span className="text-rose-300">Tu as utilisé {program.length - currentLevelData.solution.length} bloc(s) de plus que la solution classique.</span>
                        }
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row gap-3 mt-2 w-full justify-center">
                    <button
                      onClick={handleRestart}
                      className="btn-primary text-lg px-8 py-3 rounded-2xl shadow-lg"
                    >
                      Recommencer
                    </button>
                    {gameStatus === 'success' && typeof goToNextLevel === 'function' && (
                      <button
                        onClick={goToNextLevel}
                        className="btn-success text-lg px-8 py-3 rounded-2xl shadow-lg"
                      >
                        Niveau suivant
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        <div className="flex flex-1 flex-col items-center justify-center bg-transparent p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-[32px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
              <span className="font-semibold">🧭 Zone de jeu</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{currentLevelData.gridSize}×{currentLevelData.gridSize}</span>
            </div>
            <div className="grid gap-2 md:gap-1" style={{ gridTemplateColumns: `repeat(${currentLevelData.gridSize}, minmax(0, 1fr))` }}>
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
                let cellClass = 'relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 shadow-inner transition-all duration-200 md:h-16 md:w-16';
                if (isObstacle) cellClass += ' bg-rose-100 border-rose-300';
                else if (isGoal) cellClass += ' bg-gradient-to-br from-emerald-400 via-emerald-300 to-emerald-200 border-emerald-400 ring-2 ring-emerald-300';
                else if (isTeleporter) cellClass += ' bg-sky-100 border-sky-300 animate-pulse';
                else cellClass += ' bg-slate-100 border-slate-200';

                return (
                  <div key={i} className={cellClass} style={{ boxShadow: isGoal ? '0 0 16px 4px #34d39988' : isObstacle ? '0 0 8px 2px #f43f5e44' : undefined }}>
                    {/* Obstacle */}
                    {isObstacle && <span className="text-2xl select-none animate-bounce">🧱</span>}
                    {/* Cristal */}
                    {isItem && !isCollected && <Gem className="text-indigo-400 animate-pulse drop-shadow-lg" size={22} />}
                    {/* Porte verrouillée */}
                    {isGate && !gateOpen && <Lock className="text-rose-400 animate-pulse" size={22} />}
                    {/* Téléporteur */}
                    {isTeleporter && <Radio className="text-cyan-500 animate-pulse" size={20} />}
                    {/* Interrupteur */}
                    {isSwitch && <div className={`h-5 w-5 rounded-full border-2 ${levelState.doorsOpen.includes(isSwitch.linkId) ? 'animate-pulse border-emerald-500 bg-emerald-400' : 'animate-pulse-slow border-rose-500 bg-rose-500'}`}></div>}
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

        <aside className="z-20 flex w-full flex-col border-t border-white/70 bg-white/80 shadow-[0_-10px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl md:w-96 md:border-l md:border-t-0">
          <div className="border-b border-slate-200 bg-white/90 p-5">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold text-slate-800">🧩 Construis ton programme</h2>
            <p className="mb-3 text-sm font-semibold text-slate-600">Ajoute les blocs pour guider le robot jusqu’à l’étoile <span className="text-amber-400">⭐</span></p>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.25em] text-emerald-600">Par cible</div>
                <div className="text-2xl font-bold text-emerald-700">{currentLevelData.par ?? '-'}</div>
                <div className="text-xs text-emerald-600">Objectif optimal</div>
              </div>
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3">
                <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.25em] text-sky-600">Mémoire utilisée</div>
                <div className="text-2xl font-bold text-sky-700">{program.length}/{currentLevelData.maxBlocks}</div>
                <div className="text-xs text-sky-600">Blocs en cours</div>
              </div>
            </div>
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="mb-2 font-semibold text-slate-900">Astuce du niveau</div>
              <p>{currentLevelData.hint || 'Aucune astuce disponible pour ce niveau.'}</p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sm font-semibold text-sky-700">
              <div>1️⃣ Ajoute un bloc</div>
              <div>2️⃣ Supprime-le si besoin</div>
              <div>3️⃣ Teste ton programme</div>
            </div>
          </div>

          <div className="border-b border-slate-200 bg-white/80 p-5">
            <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-fuchsia-500">Outils disponibles</h3>
            <div className="grid grid-cols-2 gap-3">
              {currentLevelData.availableTools.map(tool => (
                <button key={tool} onClick={() => addBlock(tool)} disabled={isRunning}
                  onMouseEnter={() => setHoveredTool(tool)}
                  onMouseLeave={() => setHoveredTool(null)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl font-bold shadow-md border-2 transition-all duration-150 disabled:opacity-50
                    ${tool === 'dash' || tool.startsWith('func') || tool === 'send_clone' ? 'bg-orange-100 border-orange-300 text-orange-700' 
                    : tool === 'if_wall_right' ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : tool === 'auto_path' ? 'bg-cyan-100 border-cyan-300 text-cyan-700'
                    : tool === 'collect' ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : tool === 'interact' ? 'bg-teal-100 border-teal-300 text-teal-700'
                    : 'bg-indigo-100 border-indigo-300 text-indigo-700'}
                  `}
                  title={renderBlockLabel(tool)}
                >
                  <span className="text-3xl">{renderBlockIcon(tool)}</span>
                  <span className="text-sm font-bold leading-tight">{renderBlockLabel(tool)}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="mb-1 font-semibold text-slate-900">{hoveredTool ? toolMeta[hoveredTool]?.label : 'Survole un outil pour voir son action.'}</div>
              <p>{hoveredTool ? toolMeta[hoveredTool]?.description : 'Passe la souris sur un outil pour voir son effet en cours de jeu.'}</p>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto bg-white/70">
            <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-fuchsia-500">Mon programme</h3>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">{program.length} blocs / {currentLevelData.maxBlocks}</div>
              </div>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setShowCode(!showCode)} className="font-bold text-emerald-700 underline transition-colors hover:text-emerald-500">
                  {showCode ? 'Voir les blocs' : 'Voir le code'}
                </button>
                <button onClick={() => setProgram([])} className="font-bold text-rose-600 underline transition-colors hover:text-rose-500">Tout effacer</button>
              </div>
            </div>
            <div className="min-h-40 space-y-2 rounded-[24px] border-2 border-dashed border-emerald-200 bg-emerald-50/70 p-4">
              {program.length === 0 && <div className="pt-10 text-center text-sm italic text-emerald-600">Ajoute des blocs à ton programme !</div>}
              {program.length > 0 && program.length >= currentLevelData.maxBlocks * 0.75 && (
                <div className="rounded-xl bg-amber-100 border border-amber-300 text-amber-800 px-3 py-2 text-sm font-semibold">
                  Attention : tu es proche de la limite de blocs.
                </div>
              )}
              {showCode ? (
                <pre className="text-sm font-mono text-emerald-700 whitespace-pre-wrap leading-snug bg-emerald-100/60 rounded p-3">
                  {generateRealCode ? generateRealCode() : '// Code non disponible'}
                </pre>
              ) : (
                program.map((block, index) => (
                  <div key={block.id} className={`flex items-center justify-between gap-2 p-3 rounded-2xl border-2 bg-white/90 shadow-sm animate-fade-in ${getBlockColor(block.type)}`}
                    style={{ borderLeftWidth: '8px' }}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="font-mono text-xs text-slate-500">{index + 1}.</span>
                      <span className="text-2xl">{renderBlockIcon(block.type)}</span>
                      <span className="text-sm font-bold text-slate-700">{renderBlockLabel(block.type)}</span>
                    </span>
                    <button onClick={() => removeBlock(index)} disabled={isRunning} className="ml-2 rounded-full bg-rose-100 p-1 text-rose-500 shadow transition-colors hover:text-rose-700">
                      <XCircle size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-slate-200 bg-slate-50/90 p-5">
            <button onClick={resetSimulation} disabled={isRunning} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100">
              🔄 Recommencer
            </button>
            <button onClick={runProgram} disabled={isRunning || program.length === 0} className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500 px-4 py-3 text-lg font-bold text-white shadow-[0_10px_24px_rgba(124,58,237,0.25)] transition-all hover:-translate-y-0.5">
              🚀 Tester mon programme
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
