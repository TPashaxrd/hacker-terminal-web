type Props = {
    message: string;
};

export default function TerminalToast({ message }: Props) {
    return (
        <div className="fixed bottom-6 left-6 bg-black border border-red-600 text-red-400 font-mono px-4 py-2 rounded shadow-md z-50 animate-pulse">
            ⚠️ bash: {message}
        </div>
    );
}
