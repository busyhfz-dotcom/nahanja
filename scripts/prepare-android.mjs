import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

if (!existsSync("android")) {
  execSync("npx cap add android", { stdio: "inherit" });
} else {
  execSync("npx cap sync android", { stdio: "inherit" });
}
