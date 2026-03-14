import { spawn } from "node:child_process"

const isWindows = process.platform === "win32"

function runTask(script) {
  if (isWindows) {
    return spawn("cmd.exe", ["/d", "/s", "/c", `pnpm run ${script}`], {
      stdio: "inherit",
      env: process.env,
    })
  }

  return spawn("pnpm", ["run", script], {
    stdio: "inherit",
    env: process.env,
  })
}

const tasks = [
  runTask("dev:api"),
  runTask("dev:web"),
]

let exiting = false

function shutdown(exitCode = 0) {
  if (exiting) {
    return
  }

  exiting = true

  for (const task of tasks) {
    if (!task.killed) {
      task.kill("SIGTERM")
    }
  }

  setTimeout(() => process.exit(exitCode), 120)
}

for (const task of tasks) {
  task.on("exit", (code) => {
    if (exiting) {
      return
    }

    shutdown(code ?? 0)
  })
}

process.on("SIGINT", () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))
