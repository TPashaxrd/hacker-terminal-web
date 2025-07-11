export type Command = {
  name: string;
  description: string;
  execute: (args: string[], addHistory: (line: string) => void) => Promise<void> | void;
};

export const commands: Command[] = [
  {
    name: "help",
    description: "Shows available commands",
    execute: async (_args: string[], addHistory) => {
      addHistory("Available commands: help, clear, echo [text], hack, start, exit");
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
}


];
