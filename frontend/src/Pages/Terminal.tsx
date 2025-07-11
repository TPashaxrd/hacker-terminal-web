import { useState, useRef, useEffect } from "react";
import { commands } from "../Components/commands";

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export default function Terminal() {
  const [input, setInput] = useState("");
  const [name, setName] = useState("root");
  const [history, setHistory] = useState<string[]>([
    "Welcome to Hacker Tycoon Terminal!",
    "Type 'help' to see commands.",
  ]);

useEffect(() => {
  setHistory(prev => {
    if (prev.length > 0 && prev[0].startsWith("Hello")) {
      const newHistory = [...prev];
      newHistory[0] = `Hello ${name},`;
      return newHistory;
    }
    return [`Hello ${name},`, ...prev];
  });
}, [name]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [exited, setExited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const storedName = localStorage.getItem("username");
  if (storedName) {
    setName(storedName);
  }
}, []);
  useEffect(() => {
    if (!exited) inputRef.current?.focus();
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isProcessing, exited]);

  async function handleCommand(cmdLine: string) {
    setIsProcessing(true);
    setHistory(prev => [...prev, `> ${cmdLine}`]);

    const [cmdName, ...args] = cmdLine.split(" ");
    const cmd = commands.find(c => c.name === cmdName.toLowerCase());

    const addHistory = (line: string) => {
      if (line === "__CLEAR__") {
        setHistory([]);
      } else {
        setHistory(prev => [...prev, line]);
      }
    };

    if (cmd) {
      await cmd.execute(args, addHistory);
      if (cmdName === "exit") setExited(true);
    } else {
      addHistory(`bash: command not found: ${cmdName}`);
      addHistory(`Try 'help' for list of commands.`);
    }

    setIsProcessing(false);
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isProcessing || !input.trim() || exited) return;
    await handleCommand(input.trim());
    setInput("");
  }

  return (
    <div className="relative bg-black h-screen w-screen select-none font-mono flex flex-col p-6 overflow-hidden text-green-400">
      <MatrixEffect />

      <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col h-full bg-black bg-opacity-90 rounded-lg shadow-[0_0_20px_#39ff14] p-6">
        <div className="flex-grow overflow-y-auto mb-6 space-y-1 text-green-400 text-lg drop-shadow-[0_0_10px_rgba(57,255,20,0.9)] scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-black">
          {history.map((line, i) => (
            <pre key={i} className="whitespace-pre-wrap">{line}</pre>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSubmit} className="flex items-center">
          <span className="mr-3 font-extrabold text-green-500 drop-shadow-[0_0_15px_rgba(0,255,0,0.85)] select-none">
            root@hacker:~#
          </span>
          <input
            title="Type your command here"
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing || exited}
            autoComplete="off"
            spellCheck={false}
            className={`
              bg-transparent border-b-2 border-green-600
              text-green-400 flex-grow text-lg font-semibold
              outline-none caret-green-400
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:border-green-400 transition-colors duration-300
            `}
          />
          <span
            title="Press Enter to execute command"
            className="ml-2 w-6 h-7 bg-green-400 rounded-sm blink-animation"
          />
        </form>
      </div>
    </div>
  );
}

function MatrixEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const letters = "アァカサタナハマヤャラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(
          letters.charAt(Math.floor(Math.random() * letters.length)),
          x,
          y
        );
        drops[i]++;
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
    }
    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops.length = 0;
      for (let i = 0; i < columns; i++) drops[i] = 1;
      draw();
    }

    canvas.width = width;
    canvas.height = height;

    draw();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none opacity-20 z-0"
    />
  );
}
