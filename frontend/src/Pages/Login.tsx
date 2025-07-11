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
        if (username !== "root" && password !== "toor") {
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
            <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
                <div className="w-full max-w-md p-6 bg-black border border-green-700 rounded shadow-lg">
                    <h1 className="text-xl mb-4">
                        root@kali:~# <span className="text-green-400">login</span>
                    </h1>
                    <form className="space-y-4">
                        <div>
                            <label className="block">Username:</label>
                            <input
                                type="text"
                                placeholder="root"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black border border-green-600 text-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block">Password:</label>
                            <input
                                type="password"
                                placeholder="****"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-green-600 text-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-6 text-sm text-green-400">Linux Terminal Access Portal</div>
                </div>
            </div>
            {error && <TerminalToast message={errorMessage} />}
           <ForDeveloper /> 
        </>
    );
}
