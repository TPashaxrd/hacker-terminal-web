export type CommandContext = {
  isRoot: boolean;
  setIsRoot: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Command = {
  name: string;
  description: string;
  execute: (
    args: string[],
    addHistory: (line: string) => void,
    ctx: CommandContext
  ) => Promise<void> | void;
};
export const commands: Command[] = [
{
  name: "help",
  description: "Shows available commands",
  execute: async (_args: string[], addHistory) => {
    addHistory("Available commands:\n");
    addHistory("  🟢 help                - Shows available commands");
    addHistory("  🟢 clear               - Clears the terminal");
    addHistory("  🟢 echo [text]         - Prints the input text");
    addHistory("  🟢 hack                - Simulates a hacking process");
    addHistory("  🟢 start               - Starts the terminal");
    addHistory("  🟢 exit                - Exits the terminal");
    addHistory("  🟢 change-name [name]  - Change your username");
    addHistory("  🔐 sudo su             - Become root");
    addHistory("  🔥 sudo rm -rf /       - Simulated system wipe");
    addHistory("  👤 whoami              - Show current user");
  }
},
  {
    name: "clear",
    description: "Clears the terminal",
    execute: (_args: string[], addHistory) => {
      addHistory("__CLEAR__");
    }
  },
  {
    name: "echo",
    description: "Prints the input text",
    execute: (args: string[], addHistory) => {
      const text = args.join(" ");
      addHistory(text);
    }
  },
  {
    name: "hack",
    description: "Simulates a hacking process",
    execute: async (_args: string[], addHistory) => {
      const hackSteps = [
        "Initializing hack module...",
        "Bypassing firewall...",
        "Accessing mainframe...",
        "Extracting data packets...",
        "Encrypting payload...",
        "Hack complete! 💀💻",
      ];
      for (const step of hackSteps) {
        addHistory(step);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  },
  {
    name: "start",
    description: "Starts the terminal",
    execute: async (_args: string[], addHistory) => {
      addHistory("Starting terminal...");
      await new Promise(r => setTimeout(r, 800));
      addHistory("Terminal started successfully!");
    }
  },
  {
    name: "exit",
    description: "Exits the terminal",
    execute: async (_args: string[], addHistory) => {
      addHistory("Exiting terminal...");
      await new Promise(r => setTimeout(r, 800));
      addHistory("Terminal exited successfully!");
    }
  },
{
  name: "change-name",
  description: "Change your username stored in localStorage",
  execute: async (args: string[], addHistory) => {
    if (args.length === 0) {
      addHistory("Usage: change-name [new_username]");
      return;
    }

    const username = args.join(" ");
    try {
      localStorage.setItem("username", username);
      addHistory(`Username changed successfully to: ${username}`);
    } catch (e) {
      addHistory("Error: Could not save the username.");
    }
  }
},
{
  name: "sudo",
  description: "Superuser command: supports 'sudo su' and 'sudo rm -rf /'",
  execute: async (args, addHistory, { isRoot, setIsRoot }) => {
    if (args.length === 1 && args[0] === "su") {
      addHistory("Switching to root user...");
      await new Promise(r => setTimeout(r, 700));
      setIsRoot(true);
      addHistory("You are now root. Don't fuck it up!");
    } else if (args.length === 3 && args[0] === "rm" && args[1] === "-rf" && args[2] === "/") {
      if (!isRoot) {
        addHistory("Permission denied: You must be root to run this command.");
        addHistory("Try: sudo su");
        return;
      }

      addHistory("sudo: starting system wipe...");

      const deleteLines = [
        "Deleting /home/user/documents...",
        "Deleting /home/user/pictures...",
        "Deleting /var/logs...",
        "Deleting /etc/config...",
        "Deleting /usr/bin/scripts...",
        "Deleting /tmp files...",
        "Deleting /opt/apps...",
        "Deleting /root files...",
      ];

      for (const line of deleteLines) {
        addHistory(line);
        await new Promise(r => setTimeout(r, 700));
      }

      for (let i = 0; i < 10; i++) {
        const deletingLine = "DELETING ".repeat(20);
        addHistory(deletingLine);
        await new Promise(r => setTimeout(r, 150));
      }

      const scaryMessages = [
        "System failure detected!",
        "Kernel panic - not syncing: Fatal exception",
        "Segmentation fault at 0x00000000",
        "Memory dump in progress...",
        "Rebooting system...",
      ];

      for (const msg of scaryMessages) {
        addHistory(msg);
        await new Promise(r => setTimeout(r, 1200));
      }

      addHistory("⚠️ Warning: This is only a simulation! No files were harmed.");
      addHistory("__CLEAR__");
    } else {
      addHistory(`sudo: command not found or insufficient permissions: sudo ${args.join(" ")}`);
    }
  }
},
{
  name: "help",
  description: "Shows available commands",
  execute: async (args, addHistory, ctx) => {
    addHistory("Available commands: help, clear, echo [text], hack, start, exit, sudo su, sudo rm -rf /, whoami");
  }
},
{
  name: "whoami",
  description: "Displays current user",
  execute: async (_, addHistory, { isRoot }) => {
    addHistory(isRoot ? "root" : "user");
  }
}
];