import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Key, Settings, Menu, Search, FileText } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import '@fontsource/kalam'; // Import the handwriting font

// The pure CSS + SVG Filter Cloud Component
const ProceduralCloud = ({ seed, className, style, baseFrequency = '0.015', opacity = 1 }) => {
  return (
    <>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={`cloud-filter-${seed}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="4"
              seed={seed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="60"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        className={`absolute rounded-[100px] bg-white/70 ${className}`}
        style={{
          filter: `url(#cloud-filter-${seed})`,
          boxShadow: '0 0 60px 30px rgba(255,255,255,0.7)',
          opacity: opacity,
          ...style
        }}
      />
    </>
  );
};

// Simple SVG Doodles
const DoodleSmiley = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`absolute fill-none stroke-white stroke-[4] stroke-linecap-round stroke-linejoin-round ${className}`} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}>
    <path d="M20,60 Q50,90 80,60" />
    <line x1="30" y1="30" x2="30" y2="45" />
    <line x1="70" y1="30" x2="70" y2="45" />
  </svg>
);

const DoodleHeart = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`absolute fill-none stroke-white stroke-[4] stroke-linecap-round stroke-linejoin-round ${className}`} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}>
    <path d="M50,80 C50,80 10,50 10,30 C10,15 30,10 50,30 C70,10 90,15 90,30 C90,50 50,80 50,80 Z" />
  </svg>
);

const DoodleSparkle = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`absolute fill-none stroke-white stroke-[4] stroke-linecap-round stroke-linejoin-round ${className}`} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}>
    <path d="M50,10 Q50,50 10,50 Q50,50 50,90 Q50,50 90,50 Q50,50 50,10 Z" />
  </svg>
);

export default function SkyTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode, theme, setTheme,
  currentUser, handleLogout, setShowApiKeys
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Pure CSS animation replaces the 60fps React state loop to prevent catastrophic editor lag
  const driftCSS = `
    @keyframes driftSlow { 0% { transform: translateX(0); } 100% { transform: translateX(40px); } }
    @keyframes driftMed { 0% { transform: translateX(0); } 100% { transform: translateX(80px); } }
    @keyframes driftFast { 0% { transform: translateX(0); } 100% { transform: translateX(120px); } }
    @keyframes driftSlowRev { 0% { transform: translateX(0); } 100% { transform: translateX(-40px); } }
    @keyframes driftMedRev { 0% { transform: translateX(0); } 100% { transform: translateX(-80px); } }
  `;

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-b from-[#1a66a8] to-[#4b9cdb] relative font-sans">

      {/* Background Sky Canvas - Rendered behind everything */}
      <style>{driftCSS}</style>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top edge clouds - Moved up and away from top left UI */}
        <ProceduralCloud seed="101" className="w-[300px] h-[150px]" style={{ top: '-100px', left: '20%', animation: 'driftFast 10s linear infinite alternate' }} opacity={0.6} />
        <ProceduralCloud seed="102" className="w-[400px] h-[200px]" style={{ top: '-120px', right: '-50px', animation: 'driftMedRev 12s linear infinite alternate' }} opacity={0.8} />

        {/* Bottom edge clouds - Kept fluffy but pushed down */}
        <ProceduralCloud seed="201" className="w-[600px] h-[300px]" style={{ bottom: '-150px', left: '-50px', animation: 'driftSlow 15s linear infinite alternate' }} opacity={0.9} />
        <ProceduralCloud seed="202" className="w-[700px] h-[350px]" style={{ bottom: '-180px', right: '-150px', animation: 'driftSlowRev 18s linear infinite alternate' }} opacity={0.9} />
        <ProceduralCloud seed="203" className="w-[400px] h-[200px]" style={{ bottom: '-50px', left: '40%', animation: 'driftFast 12s linear infinite alternate' }} opacity={0.7} />

        {/* Side clouds */}
        <ProceduralCloud seed="301" className="w-[200px] h-[300px]" style={{ top: '60%', left: '-100px', animation: 'driftSlow 16s linear infinite alternate' }} opacity={0.5} />
        <ProceduralCloud seed="302" className="w-[250px] h-[300px]" style={{ top: '40%', right: '-100px', animation: 'driftMedRev 14s linear infinite alternate' }} opacity={0.6} />

        <DoodleSmiley className="w-16 h-16 top-10 left-[45%] transform rotate-12 opacity-80" />
        <DoodleSparkle className="w-8 h-8 top-32 left-[50%] opacity-90" />
        <DoodleSparkle className="w-6 h-6 bottom-40 left-[20%] opacity-60" />
        <DoodleHeart className="w-12 h-12 top-24 right-[25%] transform rotate-12 opacity-80" />
        <DoodleHeart className="w-8 h-8 bottom-32 right-[30%] transform -rotate-12 opacity-60" />
        <DoodleSparkle className="w-10 h-10 top-1/2 right-[10%] opacity-70" />
      </div>

      {/* UI Content - Rendered above sky */}
      <div className="relative z-10 flex h-full w-full">

        {/* Full-height Glassmorphic Sidebar */}
        {showSidebar && (
          <div className="w-[320px] h-full bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col p-6 flex-shrink-0 animate-in slide-in-from-left fade-in duration-300 z-50 shadow-2xl">

            {/* Sidebar Top Header */}
            <div className="flex justify-between items-center text-white mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-white/80 hover:text-white transition-colors focus:outline-none"
                >
                  <Menu size={24} strokeWidth={1.5} />
                </button>
                <span className="text-xl font-light tracking-wide truncate max-w-[150px]">hi, {currentUser?.username}</span>
              </div>
              <button className="text-white/80 hover:text-white transition-colors">
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* New Note Button */}
            <button
              onClick={addNote}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white mb-6 border border-white/10 shadow-sm group"
            >
              <Plus size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
              <span className="font-light tracking-wide">new thought</span>
            </button>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`cursor-pointer transition-all duration-200 px-4 py-3 rounded-2xl flex justify-between items-center group ${note.id === activeNoteId
                    ? 'bg-white/20 text-white shadow-sm border border-white/10'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText size={18} strokeWidth={1.5} className="flex-shrink-0" />
                    <span className="truncate font-light tracking-wide text-lg">
                      {note.title || 'untitled...'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className={`opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-300 transition-opacity p-1 ${note.id === activeNoteId ? 'opacity-100' : ''}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 h-full flex flex-col relative overflow-hidden">

          {/* Hamburger toggle if sidebar is hidden */}
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors z-50 drop-shadow-md"
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>
          )}

          {/* Right Corner: Settings Menu */}
          <div className="absolute top-8 right-8 z-50">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`text-white/80 hover:text-white transition-all p-2 drop-shadow-md focus:outline-none ${showSettings ? 'rotate-90' : 'hover:rotate-45'}`}
            >
              <Settings size={32} />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl flex flex-col gap-2 min-w-[220px] text-white z-50 animate-in fade-in slide-in-from-top-4">
                <button onClick={handleLogout} className="text-left text-xl hover:bg-white/20 p-2 rounded-xl transition-colors">logout</button>
                <div className="w-full h-px bg-white/30 my-1"></div>
                <button onClick={() => window.open(`http://${window.location.hostname}:5000/api-docs`, '_blank')} className="text-left text-xl hover:bg-white/20 p-2 rounded-xl transition-colors">api docs</button>
                <button onClick={() => setShowApiKeys(true)} className="text-left text-xl hover:bg-white/20 p-2 rounded-xl transition-colors flex items-center gap-2"><Key size={18} /> api keys</button>
                <div className="w-full h-px bg-white/30 my-1"></div>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-sm opacity-60 px-2 font-bold uppercase tracking-widest mb-1">Themes</span>
                  {['aesthetic', 'sticky', 'retro', 'notesos', 'sky'].map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTheme(t); setShowSettings(false); }}
                      className={`text-left text-xl p-2 rounded-xl transition-colors ${theme === t ? 'bg-white/30 font-bold' : 'hover:bg-white/20 text-white/80'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Active Note Area */}
          {activeNote ? (
            <div className={`flex-1 flex flex-col h-full px-12 md:px-24 pt-24 pb-12 max-w-5xl transition-all duration-300 ${!showSidebar ? 'mx-auto' : ''}`}>
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                className="text-5xl md:text-6xl font-light tracking-wide bg-transparent outline-none w-full text-white placeholder-white/50 mb-6 drop-shadow-sm"
                placeholder="give it a title..."
              />

              <div className="w-full h-px bg-white/20 mb-8 flex-shrink-0 shadow-sm"></div>

              <div className="flex-1 overflow-y-auto text-white text-xl md:text-2xl prose prose-invert max-w-none">
                <style>{`
                  /* Custom scrollbar for sky theme editor */
                  ::-webkit-scrollbar { width: 6px; height: 6px; }
                  ::-webkit-scrollbar-track { background: transparent; }
                  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
                  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.6); }

                  /* ProseMirror text fixes - Clean sans typography */
                  .sky-prose .ProseMirror { color: white !important; font-weight: 300; }
                  .sky-prose .ProseMirror p { font-size: 1.25rem !important; line-height: 1.7; margin: 0.5rem 0; color: white !important; }
                  .sky-prose .ProseMirror h1 { font-size: 2.5rem !important; margin-bottom: 1rem; color: white !important; font-weight: 400; }
                  .sky-prose .ProseMirror h2 { font-size: 2rem !important; margin-bottom: 1rem; color: white !important; font-weight: 400; }
                  .sky-prose .ProseMirror strong, .sky-prose .ProseMirror b { color: white !important; font-weight: 800; }
                  .sky-prose .ProseMirror ul, .sky-prose .ProseMirror ol { padding-left: 2rem; margin: 0.5rem 0; }
                  .sky-prose .ProseMirror li { margin: 0.5rem 0 !important; }
                  .sky-prose .ProseMirror li p { margin: 0 !important; }
                  
                  /* Task list and Checkbox styling */
                  .sky-prose .ProseMirror ul[data-type="taskList"] { list-style-type: none; padding-left: 0.5rem; }
                  .sky-prose .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; margin-bottom: 0.5rem; }
                  .sky-prose .ProseMirror ul[data-type="taskList"] li > label { display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; user-select: none; margin-top: 0.25rem; }
                  
                  /* Custom Checkbox */
                  .sky-prose .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
                    appearance: none;
                    background-color: rgba(255, 255, 255, 0.2);
                    margin: 0;
                    font: inherit;
                    color: white;
                    width: 1.4em;
                    height: 1.4em;
                    border: 3px solid white;
                    border-radius: 8px;
                    display: grid;
                    place-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
                  }
                  
                  .sky-prose .ProseMirror ul[data-type="taskList"] input[type="checkbox"]::before {
                    content: "";
                    width: 0.8em;
                    height: 0.8em;
                    transform: scale(0);
                    transition: 120ms transform ease-in-out;
                    background-color: white;
                    transform-origin: center;
                    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                  }
                  
                  .sky-prose .ProseMirror ul[data-type="taskList"] input[type="checkbox"]:checked {
                    background-color: rgba(255, 255, 255, 0.3);
                  }
                  
                  .sky-prose .ProseMirror ul[data-type="taskList"] input[type="checkbox"]:checked::before {
                    transform: scale(1);
                  }
                  
                  /* Table contrast fixes */
                  .sky-prose .ProseMirror table { border-collapse: collapse; margin: 1rem 0; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); border-radius: 8px; overflow: hidden; }
                  .sky-prose .ProseMirror th, .sky-prose .ProseMirror td { border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; }
                  
                  /* Code block contrast */
                  .sky-prose .ProseMirror pre { background: rgba(0,0,0,0.3) !important; color: #fff !important; text-shadow: none; padding: 1rem; border-radius: 8px; font-family: monospace !important; }
                  .sky-prose .ProseMirror code { background: rgba(0,0,0,0.3) !important; color: #fff !important; text-shadow: none; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace !important; font-size: 1.2rem; }
                `}</style>
                <div className="sky-prose h-full">
                  <RichTextEditor
                    key={activeNote.id}
                    theme={theme}
                    content={activeNote.content}
                    onChange={(html) => updateActiveNote({ content: html })}
                    editable={true}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-white/50 text-2xl font-light">select a thought...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
