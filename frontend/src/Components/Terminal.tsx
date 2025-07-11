import { useState, useRef, useEffect } from "react";
import { FiTerminal, FiMaximize2, FiX } from "react-icons/fi";
import { commands } from "./commands";
import ForDeveloper from "./ForDeveloper";
import { FaRegWindowMinimize } from "react-icons/fa";

export default function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("root");
  const [isRoot, setIsRoot] = useState(true);
  const [history, setHistory] = useState<string[]>([
    "Welcome to Ubuntu 22.04 LTS - Hacker Edition",
    "",
    " * Documentation:  https://help.ubuntu.com",
    " * Management:     https://landscape.canonical.com",
    " * Support:        https://ubuntu.com/advantage",
    "",
    `Last login: ${new Date().toLocaleString()}`,
    ""
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [terminalClosing, setTerminalClosing] = useState(false);
  const [terminalFullscreen, setTerminalFullscreen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 100, y: 100 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (localStorage.getItem("username") && localStorage.getItem("password")) {
      setUsername(localStorage.getItem("username") || "root");
      setIsRoot(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (!terminalMinimized && open) inputRef.current?.focus();
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isProcessing, open, terminalMinimized]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current || !terminalRef.current || terminalFullscreen) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      pos.current.x = Math.min(
        Math.max(0, pos.current.x + dx),
        window.innerWidth - terminalRef.current.offsetWidth
      );
      pos.current.y = Math.min(
        Math.max(40, pos.current.y + dy),
        window.innerHeight - terminalRef.current.offsetHeight
      );

      terminalRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;

      dragStart.current.x = e.clientX;
      dragStart.current.y = e.clientY;
    }
    function onMouseUp() {
      dragging.current = false;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [terminalFullscreen]);
  useEffect(() => {
    function onFullscreenChange() {
      if (document.fullscreenElement === terminalRef.current) {
        setTerminalFullscreen(true);
      } else {
        setTerminalFullscreen(false);
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      terminalRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }
  function onDragStart(e: React.MouseEvent) {
    if (terminalFullscreen) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  }

  async function handleCommand(cmdLine: string) {
    if (!cmdLine.trim()) return;
    setIsProcessing(true);
    setHistory((prev) => [...prev, `${getPrompt()} ${cmdLine}`]);
    const [cmdNameRaw, ...args] = cmdLine.trim().split(" ");
    const cmdName = cmdNameRaw.toLowerCase();
    const cmd = commands.find((c) => c.name === cmdName);
    const addHistory = (line: string) => {
      if (line === "__CLEAR__") setHistory([]);
      else setHistory((prev) => [...prev, line]);
    };
    if (cmd) {
      try {
        await cmd.execute(args, addHistory, { isRoot, setIsRoot, setUsername, username });
      } catch {
        addHistory("Command execution failed.");
      }
    } else {
      addHistory(`Command '${cmdName}' not found, but can be installed with:`);
      addHistory(`sudo apt install ${cmdName}`);
    }
    setIsProcessing(false);
  }

  function getPrompt() {
    const hostname = "ubuntu";
    const path = "~";
    return isRoot ? `root@${hostname}:${path}#` : `${username}@${hostname}:${path}$`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isProcessing || !open || terminalMinimized) return;
    await handleCommand(input);
    setInput("");
  }

  function restoreTerminal() {
    setTerminalMinimized(false);
  }

  const WindowControls = () => (
    <div className="flex items-center space-x-2 ml-4">
      <button
        onClick={() => setTerminalMinimized(true)}
        title="Minimize"
        className="p-1 text-gray-300 hover:bg-gray-700 rounded-full transition"
      >
        <FaRegWindowMinimize size={14} />
      </button>
      <button
        onClick={toggleFullscreen}
        title={terminalFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded-full transition"
      >
        <FiMaximize2 size={14} />
      </button>
      <button
        onClick={() => {
          setTerminalClosing(true);
          setTimeout(() => {
            setTerminalClosing(false);
            setTerminalMinimized(false);
            setTerminalFullscreen(false);
            onClose();
          }, 250);
        }}
        title="Close"
        className="p-1 text-gray-300 hover:bg-red-600 hover:text-white rounded-full transition"
      >
        <FiX size={14} />
      </button>
    </div>
  );

  return !open ? null : (
    <>
      {!terminalMinimized && (
        <div
          ref={terminalRef}
          onMouseDown={onDragStart}
          className={`
            fixed bg-[#0f0219] text-green-400 font-mono rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.7)]
            border border-green-700 flex flex-col transition-transform duration-300 z-50
            ${terminalFullscreen ? "top-0 left-0 w-screen h-screen rounded-none" : "w-[720px] h-[60vh]"}
            ${terminalClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
          style={{
            transform: terminalFullscreen ? "none" : `translate(${pos.current.x}px, ${pos.current.y}px)`,
            userSelect: terminalFullscreen ? "none" : "auto",
            overflow: "hidden",
            boxShadow: "0 0 15px #00ff00",
          }}
        >
          <div
            className="flex items-center justify-between bg-[#0a0011] px-4 py-2 rounded-t-xl select-none cursor-move"
            onMouseDown={onDragStart}
          >
            <div className="flex items-center space-x-3">
              <FiTerminal size={20} />
              <span className="font-bold">{getPrompt()}</span>
            </div>
            <WindowControls />
          </div>
          <div
            className="flex-1 overflow-y-auto px-6 py-4 text-sm whitespace-pre-wrap scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-transparent"
            style={{ fontFamily: "'Ubuntu Mono', monospace", backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            {history.map((line, i) => (
              <pre key={i} className="break-words">{line}</pre>
            ))}
            <div ref={bottomRef} />
          </div>
          <form
            onSubmit={onSubmit}
            className="flex items-center border-t border-green-700 bg-[#0a0011] px-6 py-3 space-x-2"
            spellCheck={false}
            autoComplete="off"
          >
            <span className="select-none font-mono">{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isProcessing}
              autoFocus
              className="bg-transparent flex-grow outline-none caret-green-400 text-green-400 font-mono text-sm placeholder-green-600"
              placeholder="Type a command..."
            />
          </form>
        </div>
      )}
      {terminalMinimized && (
        <div
          onClick={restoreTerminal}
          className="fixed bottom-5 left-20 bg-[#0a0011] text-green-400 px-5 py-2 rounded-lg shadow-lg cursor-pointer flex items-center space-x-2 border border-green-600 hover:bg-green-900 transition"  
          title="Restore Terminal"
        >
          <FiTerminal size={18} />
          <span className="font-bold">Terminal</span>
        </div>
      )}
      <ForDeveloper />
    </>
  );
}
