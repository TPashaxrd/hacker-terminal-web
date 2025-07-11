import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARS = "01";
const FONT_SIZE = 14;
const COMMANDS = {
  help: "Show available commands",
  clear: "Clear the terminal screen",
  exit: "Close the terminal",
  hollywood: "Enable/disable Hollywood effect",
  theme: "Change terminal theme (kali/dark/light)",
  echo: "Display a line of text",
  neofetch: "Show system information",
  banner: "Display ASCII art banner",
};

type Theme = {
  name: string;
  bg: string;
  text: string;
  accent: string;
  matrixStart: [number, number, number];
  matrixEnd: [number, number, number];
};

const THEMES: Record<string, Theme> = {
  kali: {
    name: "kali",
    bg: "bg-black",
    text: "text-green-400",
    accent: "border-green-600",
    matrixStart: [0, 255, 0],
    matrixEnd: [0, 180, 0],
  },
  dark: {
    name: "dark",
    bg: "bg-gray-900",
    text: "text-purple-400",
    accent: "border-purple-600",
    matrixStart: [150, 0, 255],
    matrixEnd: [80, 0, 180],
  },
  light: {
    name: "light",
    bg: "bg-gray-100",
    text: "text-blue-800",
    accent: "border-blue-500",
    matrixStart: [0, 0, 255],
    matrixEnd: [0, 0, 180],
  },
};

const KALI_LOGO = [
  "   __ ___             _____",
  "  / // (_)__  __ __  / ___/",
  " / _  / / _ \\/ // / / /__  ",
  "/_//_/_/_//_/\\_, /  \\___/  ",
  "            /___/          ",
];

function getRandomChar() {
  return CHARS.charAt(Math.floor(Math.random() * CHARS.length));
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  return a.map((c, i) => Math.floor(c + (b[i] - c) * t)) as [number, number, number];
}

function rgbToString(rgb: [number, number, number]) {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

export default function HollywoodTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hollywoodActive, setHollywoodActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(THEMES.kali);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize terminal
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([
        "",
        ...KALI_LOGO,
        "",
        "Kali Linux Hollywood Terminal v2.1",
        "Based on the original Hollywood tool",
        "",
        "Type 'help' for available commands",
        "",
      ]);
    }
  }, [isOpen, history.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [history, isOpen]);

  useEffect(() => {
    if (!isOpen || !hollywoodActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / FONT_SIZE);
    const speeds = new Array(columns).fill(0).map(() => 0.5 + Math.random() * 2);
    const positions = new Array(columns).fill(0).map(() => Math.random() * -height);
    const opacities = new Array(columns).fill(0).map(() => 0.1 + Math.random() * 0.9);

    let animationId: number;
    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    function draw(time: number) {
      if (time - lastTime < interval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx!.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx!.fillRect(0, 0, width, height);

      ctx!.font = `bold ${FONT_SIZE}px monospace`;

      for (let i = 0; i < columns; i++) {
        const x = i * FONT_SIZE;
        let y = positions[i];
        const speed = speeds[i];
        const opacity = opacities[i];
        for (let j = 0; j < 20; j++) {
          const charY = y - j * FONT_SIZE;
          if (charY < -FONT_SIZE) continue;
          if (charY > height) break;

          const t = (j / 20) * (1 - (charY / height));
          const color = lerpColor(theme.matrixStart, theme.matrixEnd, t);
          ctx!.fillStyle = rgbToString(color);
          ctx!.globalAlpha = opacity * (1 - j / 25);
          ctx!.fillText(getRandomChar(), x, charY);
        }

        positions[i] += speed * 10;
        if (positions[i] > height + FONT_SIZE * 20) {
          positions[i] = -FONT_SIZE;
          speeds[i] = 0.5 + Math.random() * 2;
          opacities[i] = 0.1 + Math.random() * 0.9;
        }
      }

      if (ctx) {
        ctx!.globalAlpha = 1.0;
      }
      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, hollywoodActive, theme]);

  const addLine = useCallback((line: string) => {
    setHistory((h) => [...h, line]);
  }, []);

  const handleCommand = useCallback(
    (cmdLine: string) => {
      if (!cmdLine.trim()) return;

      addLine(`┌──(${theme.text.split('-')[1]}-kali)-[~]`);
      addLine(`└─$ ${cmdLine}`);

      const [cmd, ...args] = cmdLine.trim().split(/\s+/);
      const lowerCmd = cmd.toLowerCase();

      switch (lowerCmd) {
        case "clear":
          setHistory([]);
          break;
        case "help":
          addLine("Available commands:");
          Object.entries(COMMANDS).forEach(([name, desc]) => {
            addLine(`  ${name.padEnd(10)} - ${desc}`);
          });
          break;
        case "exit":
          addLine("Closing terminal...");
          setTimeout(() => setIsOpen(false), 300);
          break;
        case "hollywood":
          setHollywoodActive(!hollywoodActive);
          addLine(`Hollywood effect ${hollywoodActive ? "disabled" : "enabled"}`);
          break;
        case "theme":
          if (!args[0]) {
            addLine("Current theme: " + theme.name);
            addLine("Available themes: " + Object.keys(THEMES).join(", "));
          } else if (THEMES[args[0]]) {
            setTheme(THEMES[args[0]]);
            addLine(`Theme set to ${args[0]}`);
          } else {
            addLine(`Unknown theme: ${args[0]}`);
          }
          break;
        case "echo":
          addLine(args.join(" "));
          break;
        case "neofetch":
          KALI_LOGO.forEach(line => addLine(line));
          addLine("");
          addLine("OS: Kali Linux Hollywood");
          addLine("Host: Virtual Terminal");
          addLine("Theme: " + theme.name);
          addLine("Effect: " + (hollywoodActive ? "active" : "inactive"));
          break;
        case "banner":
          addLine("  ____  _   _ _      _          _ ");
          addLine(" |  _ \\| | | | |    | |        | |");
          addLine(" | |_) | |_| | |    | |__   ___| |");
          addLine(" |  _ <|  _  | |    | '_ \\ / _ \\ |");
          addLine(" | |_) | | | | |____| | | |  __/_|");
          addLine(" |____/|_| |_|______|_| |_|\\___(_)");
          break;
        default:
          addLine(`Command '${cmd}' not found`);
          addLine("Try 'help' for available commands");
      }
    },
    [addLine, hollywoodActive, theme]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && !input) {
      const lastCmd = history
        .slice()
        .reverse()
        .find((h) => h.startsWith("└─$ "));
      if (lastCmd) setInput(lastCmd.substring(4));
    }
  };

  const toggleTerminal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTerminal}
          className={`p-3 rounded-full shadow-lg ${theme.bg} ${theme.accent} border-2 ${theme.text}`}
          title="Open Hollywood Terminal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </motion.button>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className={`relative ${theme.bg} border-2 ${theme.accent} rounded-lg shadow-2xl flex flex-col overflow-hidden`}
            style={{ width: 640, height: isMinimized ? 60 : 480 }}
          >
            <header
              className={`flex justify-between items-center p-2 ${theme.accent} border-b cursor-pointer`}
              onClick={toggleMinimize}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${theme.bg} ${theme.accent} border`}></div>
                <h1 className={`text-sm font-bold ${theme.text}`}>
                  kali@hollywood:~{isMinimized ? " (minimized)" : ""}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMinimize();
                  }}
                  className={`p-1 ${theme.text} hover:opacity-70`}
                  title={isMinimized ? "Restore" : "Minimize"}
                >
                  {isMinimized ? "+" : "_"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className={`p-1 ${theme.text} hover:opacity-70`}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </header>

            {!isMinimized && (
              <>
                {hollywoodActive && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
                  />
                )}
                <div
                  className={`flex-grow overflow-y-auto px-4 pt-2 pb-3 text-sm font-mono ${theme.text} relative z-10`}
                  style={{ height: 360 }}
                >
                  {history.map((line, i) => (
                    <pre key={i} className="whitespace-pre-wrap">
                      {line}
                    </pre>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <form
                  onSubmit={onSubmit}
                  className={`flex items-center p-3 ${theme.accent} border-t`}
                  spellCheck={false}
                >
                  <span className={`mr-2 select-none ${theme.text} font-mono`}>
                    └─$
                  </span>
                  <input
                    className={`flex-grow ${theme.bg} outline-none ${theme.text} caret-green-600 font-mono text-base`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type commands here..."
                    autoFocus
                    autoComplete="off"
                  />
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}