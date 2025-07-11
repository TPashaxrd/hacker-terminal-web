export default function NoPage() {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
            <div className="w-full max-w-2xl p-6 bg-black border border-green-700 rounded shadow-lg">
                <h1 className="text-xl mb-4">root@kali:~# <span className="text-green-400">cd /404</span></h1>

                <p className="mb-2">bash: cd: /404: No such file or directory</p>
                <p className="mb-6">root@kali:~# <span className="animate-pulse">_</span></p>

                <div className="mt-6 text-sm text-green-400">
                    <p>💀 You seem lost in the matrix, soldier.</p>
                    <p>🧠 Page not found. Trace your steps carefully.</p>
                </div>
            </div>
        </div>
    );
}
