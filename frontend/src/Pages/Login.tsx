import { useState } from "react";
import TerminalToast from "../Components/TerminalToast";

export default function KaliHollywoodLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit() {
    if (!username || !password) {
      setErrorMessage("Enter both username and password, hacker!");
      setError(true);
      setTimeout(() => setError(false), 4000);
      return;
    }
    if (username !== "neo" || password !== "matrix") {
      setErrorMessage("Access Denied. Try again, choomba.");
      setError(true);
      setTimeout(() => setError(false), 4000);
      return;
    }
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    window.location.href = "/terminal";
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-6">
        <div className="relative w-full max-w-lg bg-black bg-opacity-90 border border-red-600 rounded-lg shadow-[0_0_30px_#ff0000] p-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/glitch-noise.png')] opacity-20 pointer-events-none animate-glitch"></div>

          <h1 className="relative z-10 text-4xl font-extrabold text-red-600 uppercase tracking-widest mb-8 select-none">
            <span className="drop-shadow-[0_0_5px_red]">KALI LOGIN</span>
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="relative z-10 space-y-6"
            spellCheck={false}
          >
            <div>
              <label
                htmlFor="username"
                className="block text-red-400 uppercase mb-2 tracking-wider select-none"
              >
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                placeholder="neo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-red-600 rounded px-4 py-3 text-white placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 caret-red-500 tracking-wider text-lg transition"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-red-400 uppercase mb-2 tracking-wider select-none"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                placeholder="matrix"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-red-600 rounded px-4 py-3 text-white placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 caret-red-500 tracking-wider text-lg transition"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-600 text-white font-extrabold py-3 rounded shadow-[0_0_15px_#ff0000] tracking-widest transition"
            >
              ENTER THE MATRIX
            </button>
          </form>

      {error && <TerminalToast message={errorMessage} />}

        </div>
      </div>
    </>
  );
}
