import { useState } from "react";
import TerminalToast from "../Components/TerminalToast";
import ForDeveloper from "../Components/ForDeveloper";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit() {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      setError(true);
      setTimeout(() => setError(false), 4000);
      return;
    }
    if (username !== "root" || password !== "toor") {
      setErrorMessage("Invalid username or password.");
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
      <div className="min-h-screen bg-black bg-opacity-95 text-pink-400 font-mono flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#12071a] border border-pink-600 rounded-lg shadow-[0_0_25px_#ff00c8] p-8">
          <h1 className="text-2xl font-extrabold mb-6 select-none text-pink-500 tracking-widest">
            <span className="text-pink-600">root@kali</span>:~#{" "}
            <span className="text-pink-400">login</span>
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-5"
            spellCheck={false}
          >
            <div>
              <label htmlFor="username" className="block mb-1 select-none text-pink-400">
                Username:
              </label>
              <input
                id="username"
                type="text"
                placeholder="root"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-pink-600 rounded px-3 py-2 text-pink-300 placeholder-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 transition"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 select-none text-pink-400">
                Password:
              </label>
              <input
                id="password"
                type="password"
                placeholder="****"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-pink-600 rounded px-3 py-2 text-pink-300 placeholder-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 transition"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-700 to-pink-400 hover:from-pink-400 hover:to-pink-700 text-black font-bold py-2 rounded shadow-[0_0_25px_#ff00c8] transition"
            >
              Login
            </button>
          </form>
          <p className="mt-8 text-center text-pink-400 text-xs select-none tracking-widest">
            Linux Terminal Access Portal — Hacker Mode
          </p>
        </div>
      </div>

      {error && <TerminalToast message={errorMessage} />}

      <ForDeveloper />
    </>
  );
}
