import { useState } from "react";
import Terminal from "../Components/Terminal";
import { FiTerminal } from "react-icons/fi";

export default function Desktop() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-10 bg-black bg-opacity-90 flex items-center justify-between px-6 text-white select-none text-sm font-black z-50 shadow-lg border-b border-pink-600/70">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-pink-600 rounded-full shadow-[0_0_10px_#ff00c8]"></div>
            <span className="uppercase text-pink-500 tracking-widest">ACTIVITIES</span>
          </div>
          <div className="hidden md:flex space-x-6 uppercase tracking-widest text-xs text-pink-400/80">
            <span>Applications</span>
            <span>Places</span>
            <span>Devices</span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6 uppercase tracking-widest text-xs text-pink-400/80">
          <span>English (US)</span>
          <span>Battery</span>
        </div>
      </div>

      <div className="fixed top-10 left-0 w-16 h-[calc(100vh-2.5rem)] bg-black bg-opacity-90 flex flex-col items-center py-4 space-y-6 z-50 shadow-lg border-r border-pink-600/70">
        <button
          title="Terminal"
          onClick={() => setTerminalOpen((open) => !open)}
          className="p-3 rounded-full bg-gradient-to-br from-pink-700 to-pink-400 shadow-[0_0_10px_#ff00c8] hover:shadow-[0_0_25px_#ff00c8] transition-all duration-300"
        >
          <FiTerminal size={28} className="text-white" />
        </button>
      </div>

      <div className="absolute top-10 left-16 right-0 bottom-0 bg-gradient-to-br from-black via-[#12071a] to-[#300a24] p-6 select-none z-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-transparent border-4 border-pink-600 rounded-lg mb-3 flex items-center justify-center text-pink-400 text-4xl font-extrabold shadow-[0_0_20px_#ff00c8] animate-pulse cursor-default select-none">
            PDF
          </div>
          <span className="uppercase text-pink-400 tracking-wide text-sm md:text-lg font-semibold select-none">
            PDF
          </span>
        </div>
      </div>

      {terminalOpen && (
        <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      )}
    </>
  );
}
