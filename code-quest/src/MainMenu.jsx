import React from "react";
import { Play, Edit } from "lucide-react";

export default function MainMenu({ setView }) {
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
            <span className="text-8xl select-none" style={{filter:'drop-shadow(0 0 16px #fff8)'}}>916</span>
          </div>
        </div>
        <h1 className="text-7xl md:text-8xl font-extrabold mb-3 bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl shimmer-text animate-fade-in" style={{ fontFamily: 'Fredoka, Comic Sans MS, cursive', letterSpacing: '-0.04em' }}>
          <span className="shimmer-text">Code Quest</span>
        </h1>
        <p className="text-2xl md:text-3xl text-blue-700 font-bold mb-2 animate-fade-in drop-shadow-sm">Apprends à coder en t'amusant !</p>
        <p className="text-pink-500 font-semibold italic mb-10 animate-fade-in drop-shadow-sm">Créé par Emrick DAHISSIHO</p>
        <div className="flex flex-col sm:flex-row justify-center gap-8 pt-6 w-full animate-fade-in">
          <button onClick={() => setView('map')} className="btn-primary !text-2xl !py-6 !px-12 w-full sm:w-auto shadow-2xl hover:scale-105 transition-transform bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 border-0 text-white font-bold rounded-3xl">
            <Play size={36} className="mr-2" /> Aventure
          </button>
          <button onClick={() => setView('editor')} className="btn-secondary !text-2xl !py-6 !px-12 w-full sm:w-auto shadow-2xl hover:scale-105 transition-transform bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400 border-0 text-white font-bold rounded-3xl">
            <Edit size={36} className="mr-2" /> Créer Niveau
          </button>
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
