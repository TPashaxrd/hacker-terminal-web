import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARS = "0123456789ABCDEFabcdef";
const FONT_SIZE = 14;
const COMMANDS = {
  help: "Show available commands",
  clear: "Clear the terminal screen",
  balance: "Show your BTC balance",
  send: "Send BTC to address",
  history: "Show transaction history",
  wallet: "Show wallet information",
  network: "Show network status",
  mining: "Start/stop mining simulation",
  exit: "Close terminal",
};

function getRandomChar() {
  return CHARS.charAt(Math.floor(Math.random() * CHARS.length));
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  return a.map((c, i) => Math.floor(c + (b[i] - c) * t)) as [number, number, number];
}

function rgbToString(rgb: [number, number, number]) {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

function generateBTCAddress() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let addr = Math.random() > 0.5 ? "bc1" : "3";
  for (let i = 0; i < 25 + Math.floor(Math.random() * 10); i++) {
    addr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return addr;
}

function generateTxId() {
  return Array.from({ length: 64 }, () => 
    "0123456789abcdef".charAt(Math.floor(Math.random() * 16))).join("");
}

export default function BTCTerminal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "┌─────────────────────────────────────────────────────┐",
    "│      Bitcoin Network Terminal v1.4.2                │",
    "│      Simulated Environment - Not Real BTC           │",
    "└─────────────────────────────────────────────────────┘",
    "",
    "Type 'help' for available commands",
    "",
  ]);
  const [blink, setBlink] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const [mining, setMining] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.042069);
  const [walletAddress] = useState(generateBTCAddress());
  const bottomRef = useRef<HTMLDivElement>(null);

  // Drag state
  const posRef = useRef({ x: window.innerWidth / 2 - 300, y: 50 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [history, open, maximized]);

  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();

    const width = canvas.width;
    const height = canvas.height;

    const columns = Math.floor(width / FONT_SIZE);
    const speeds = new Array(columns).fill(0).map(() => 1 + Math.random() * 3);
    const positions = new Array(columns).fill(0);
    const opacities = new Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.7);

    // Bitcoin orange gradient
    const colorStart: [number, number, number] = [255, 165, 0];
    const colorEnd: [number, number, number] = [180, 100, 0];

    let animationId: number;
    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    const draw = (time: number) => {
      if (time - lastTime < interval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < columns; i++) {
        const x = i * FONT_SIZE;
        let y = positions[i];

        for (let j = 0; j < 5; j++) {
          const charY = y - j * FONT_SIZE;
          if (charY < 0) continue;
          if (charY > height) break;

          const t = (j / 5) * (1 - (charY / height));
          const color = lerpColor(colorStart, colorEnd, t);
          ctx.fillStyle = rgbToString(color);
          ctx.globalAlpha = opacities[i] * (1 - j / 5);

          const char = Math.random() < 0.3 
            ? generateBTCAddress().charAt(Math.floor(Math.random() * 5))
            : getRandomChar();

          ctx.fillText(char, x, charY);
        }

        positions[i] += speeds[i] * 2;
        if (positions[i] * FONT_SIZE > height + 50) {
          positions[i] = 0;
          speeds[i] = 1 + Math.random() * 3;
          opacities[i] = 0.3 + Math.random() * 0.7;
        }
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(draw);
    };

    draw(0);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [open, maximized]);

  useEffect(() => {
    if (!mining) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const minedAmount = 0.0001 + Math.random() * 0.001;
        setWalletBalance(b => b + minedAmount);
        addLine(`Mined ${minedAmount.toFixed(6)} BTC! New balance: ${(walletBalance + minedAmount).toFixed(6)} BTC`);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [mining, walletBalance]);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setBlink(v => !v), 600);
    return () => clearInterval(interval);
  }, [open]);

  const addLine = useCallback((line: string) => {
    setHistory(h => [...h, line]);
  }, []);

  const handleCommand = useCallback((cmdLine: string) => {
    if (!cmdLine.trim()) return;

    addLine(`┌──(bitcoin)-[~]`);
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
          addLine(`  ${name.padEnd(8)} - ${desc}`);
        });
        break;
      case "balance":
        addLine(`Wallet balance: ${walletBalance.toFixed(6)} BTC`);
        addLine(`Address: ${walletAddress}`);
        break;
      case "send":
        if (args.length < 2) {
          addLine("Usage: send <address> <amount>");
          addLine("Example: send bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq 0.01");
        } else {
          const amount = parseFloat(args[1]);
          if (isNaN(amount) || amount <= 0) {
            addLine("Invalid amount");
          } else if (amount > walletBalance) {
            addLine("Insufficient balance");
          } else {
            setWalletBalance(b => b - amount);
            const txId = generateTxId();
            addLine(`Sending ${amount.toFixed(6)} BTC to ${args[0]}...`);
            setTimeout(() => {
              addLine(`Transaction confirmed! TXID: ${txId}`);
              addLine(`New balance: ${(walletBalance - amount).toFixed(6)} BTC`);
            }, 2000);
          }
        }
        break;
      case "history":
        addLine("Recent transactions:");
        for (let i = 0; i < 3; i++) {
          const txType = Math.random() > 0.5 ? "Received" : "Sent";
          const amount = (Math.random() * 0.1).toFixed(6);
          const address = generateBTCAddress();
          const txId = generateTxId();
          addLine(`${txType} ${amount} BTC ${txType === "Sent" ? "to" : "from"} ${address}`);
          addLine(`  TXID: ${txId}`);
        }
        break;
      case "wallet":
        addLine(`Wallet Address: ${walletAddress}`);
        addLine(`Balance: ${walletBalance.toFixed(6)} BTC`);
        addLine(`Transactions: ${Math.floor(walletBalance * 100)}`);
        break;
      case "network":
        addLine("Bitcoin Network Status:");
        addLine(`  Height: ${Math.floor(800000 + Math.random() * 10000)}`);
        addLine(`  Difficulty: ${(25 + Math.random() * 5).toFixed(2)} T`);
        addLine(`  Hashrate: ${(150 + Math.random() * 50).toFixed(2)} EH/s`);
        addLine(`  Nodes: ${Math.floor(10000 + Math.random() * 5000)}`);
        break;
      case "mining":
        setMining(m => !m);
        addLine(`Mining ${!mining ? "started" : "stopped"}`);
        break;
      case "exit":
        addLine("Closing terminal...");
        setTimeout(() => onClose(), 300);
        break;
      default:
        addLine(`Command not found: ${cmd}`);
        addLine("Try 'help' for available commands");
    }
  }, [addLine, walletBalance, walletAddress, mining, onClose]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    posRef.current = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    };
    containerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25 }}
          ref={containerRef}
          className={`fixed bg-black bg-opacity-95 border-2 border-yellow-500 rounded-lg shadow-2xl z-50 flex flex-col select-none overflow-hidden`}
          style={{
            width: maximized ? "95vw" : 640,
            height: maximized ? "90vh" : 480,
            cursor: dragging.current ? "grabbing" : "default",
            transform: `translate(${posRef.current.x}px, ${posRef.current.y}px)`,
          }}
        >
          <header
            className="flex justify-between items-center p-2 border-b border-yellow-500 cursor-move bg-black bg-opacity-90"
            onMouseDown={onMouseDown}
            title="Drag to move"
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <h1 className="text-sm font-bold text-yellow-400">
                bitcoin@terminal:~{maximized ? " [maximized]" : ""}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="w-6 h-6 flex items-center justify-center text-yellow-400 hover:bg-yellow-500 hover:bg-opacity-20 rounded"
                onClick={() => setMaximized(m => !m)}
                title={maximized ? "Restore" : "Maximize"}
              >
                {maximized ? "🗗" : "⬜"}
              </button>
              <button
                className="w-6 h-6 flex items-center justify-center text-yellow-400 hover:bg-red-500 hover:bg-opacity-20 rounded"
                onClick={onClose}
                title="Close"
              >
                ✕
              </button>
            </div>
          </header>

          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          />

          <div
            className={`flex-grow overflow-y-auto px-4 pt-2 pb-3 text-sm font-mono text-yellow-300 relative z-10`}
            style={{ height: maximized ? "calc(90vh - 100px)" : 380 }}
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
            className="flex items-center p-3 border-t border-yellow-500 bg-black bg-opacity-80 relative z-10"
            spellCheck={false}
          >
            <span className="mr-2 select-none text-yellow-400 font-mono">
              └─$
            </span>
            <input
              className="flex-grow bg-transparent outline-none text-yellow-300 caret-yellow-500 font-mono text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command (try 'help', 'balance', 'mining')..."
              autoFocus
              autoComplete="off"
            />
            <span
              className={`ml-2 font-mono font-bold ${
                blink ? "text-yellow-400" : "text-transparent"
              }`}
            >
              █
            </span>
          </form>

          <div className="flex justify-between items-center px-3 py-1 text-xs text-yellow-400 bg-black bg-opacity-80 border-t border-yellow-500">
            <span>BTC {mining ? "⛏ Mining" : "Online"}</span>
            <span>Balance: {walletBalance.toFixed(6)} BTC</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}