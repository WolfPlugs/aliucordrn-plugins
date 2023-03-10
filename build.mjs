import { spawnSync } from "child_process";
import { platform } from "process";
import { existsSync } from "fs";
import { join } from "path";
import { argv, cwd, exit } from "process";

function check(bool, message) {
    if (!bool) {
        console.error(message);
        exit(1);
    }
}

let watch;
let plugin = argv[2];
if (plugin === "--watch") {
    watch = true;
    plugin = argv[3];
}

check(!!plugin, `Usage: ${argv.join(" ")} <PLUGIN>`);
const files = ["index.ts", "index.tsx"];
const file = files.find(file => existsSync(join(plugin, file)));
const path = join(plugin, file);
check(existsSync(path), `No such file: ${path}`);

const proc = spawnSync((platform === "win32") ? ".\\node_modules\\.bin\\rollup.cmd" : "node_modules/.bin/rollup", ["-c", "--configPlugin", "typescript", watch && "--watch"].filter(Boolean), {
    stdio: "inherit",
    cwd: cwd(),
    env: {
        plugin
    }
});

if (proc.error) {
    console.error(proc.error)
}
