import { useState, useRef, useEffect } from "react";
import { commands } from "../Components/commands";
import ForDeveloper from "../Components/ForDeveloper";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [name, setName] = useState("root");
  const [isRoot, setIsRoot] = useState(false);
  const [history, setHistory] = useState<string[]>([
    "Welcome to Hacker Tycoon Terminal!",
    "Type 'help' to see commands.",
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exited, setExited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState(false);
  
useEffect(() => {
    function handleLogin() {
        if (localStorage.getItem("username") && localStorage.getItem("password")) {
            setIsLogin(true);
            const username = localStorage.getItem("username");
            console.log(`${username ? username.charAt(0).toUpperCase() + username.slice(1) : ""} logged in. ${isLogin}`);
        } else {
            window.location.href = "/";
        }
    }
    handleLogin();
}, []);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setName(storedName);
  }, []);

  useEffect(() => {
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].startsWith("Hello")) {
        const newHistory = [...prev];
        newHistory[0] = `Hello ${name},`;
        return newHistory;
      }
      return [`Hello ${name},`, ...prev];
    });
  }, [name]);

  useEffect(() => {
    if (!exited) inputRef.current?.focus();
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isProcessing, exited]);

  async function handleCommand(cmdLine: string) {
    if (!cmdLine.trim()) return;

    setIsProcessing(true);
    setHistory((prev) => [...prev, `$ ${getPrompt()} ${cmdLine}`]);

    const [cmdNameRaw, ...args] = cmdLine.trim().split(" ");
    const cmdName = cmdNameRaw.toLowerCase();

    const cmd = commands.find((c) => c.name === cmdName);

    const addHistory = (line: string) => {
      if (line === "__CLEAR__") {
        setHistory([]);
      } else {
        setHistory((prev) => [...prev, line]);
      }
    };

    if (cmd) {
      try {
        await cmd.execute(args, addHistory, { isRoot, setIsRoot, setName, name });
      } catch {
        addHistory("Error: Command execution failed.");
      }
    } else {
      addHistory(`bash: command not found: ${cmdName}`);
      addHistory(`Try 'help' for a list of commands.`);
    }

    setIsProcessing(false);
  }

  function getPrompt() {
    return isRoot ? "root@kali:~#" : `${name}@kali:~$`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isProcessing || exited) return;
    await handleCommand(input);
    setInput("");
  }

  return (
    <div className="relative bg-black h-screen w-screen select-none font-mono flex flex-col p-6 overflow-hidden text-green-400">
      <MatrixEffect />

      <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col h-full bg-black bg-opacity-90 rounded-lg shadow-[0_0_20px_#39ff14] p-6">
        <div className="flex-grow overflow-y-auto mb-6 space-y-1 text-green-400 text-lg drop-shadow-[0_0_10px_rgba(57,255,20,0.9)] scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-black">
          {history.map((line, i) => (
            <pre key={i} className="whitespace-pre-wrap">
              {line}
            </pre>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2"
          spellCheck={false}
          autoComplete="off"
        >
          <span className="font-extrabold text-green-500 drop-shadow-[0_0_15px_rgba(0,255,0,0.85)] select-none">
            {getPrompt()}
          </span>
          <input
            title="Terminal Input"
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing || exited}
            className="bg-transparent border-b-2 border-green-600 text-green-400 flex-grow text-lg font-semibold outline-none caret-green-400 disabled:opacity-50 disabled:cursor-not-allowed focus:border-green-400 transition-colors duration-300"
            autoFocus
          />
          <button
            type="submit"
            disabled={isProcessing || exited}
            className="px-3 py-1 bg-green-600 rounded text-black font-bold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run
          </button>
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
    const letters =
      "アァカサタナハマヤャラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  return (
    <>
         <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none opacity-20 z-0"
    />
    <ForDeveloper />
    </>
  );
}
    