const fs = require("fs");

const sourcePath =
  "C:/Users/kauar/AppData/Roaming/Code/User/workspaceStorage/70c99f5a55ce744c79cf19c6535da1ac/GitHub.copilot-chat/chat-session-resources/c6c384d9-ce27-4883-997a-de239daa00f0/call_ineSZhoP9KnwUzkHH5H6XzGD__vscode-1793913781696/content.txt";
const targetDir = process.cwd();

const raw = fs.readFileSync(sourcePath, "utf8");
const data = JSON.parse(raw);

for (const [size, dataUrl] of Object.entries(data)) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const outPath = `${targetDir}/icone-${size}.png`;
  fs.writeFileSync(outPath, Buffer.from(base64, "base64"));
}

console.log("icons-written");
