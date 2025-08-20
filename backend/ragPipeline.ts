import { spawn } from "child_process";
import path from "path";

export function runRagPipeline(query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.resolve("llama_runner.py");

    const child = spawn("python", [pythonScript, query]);

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}
