import { defineConfig } from "rollup";
import { aliucordPlugin, makeManifest, makePluginZip } from "@aliucord/rollup-plugin";
import { existsSync } from "fs";
import { join } from "path";

const files = ["index.ts", "index.tsx"];
const file = files.find((f) => existsSync(join(`${process.env.plugin}`, f)));

export default defineConfig({
    input: `${process.env.plugin}/${file}`,
    output: {
        file: `dist/${process.env.plugin}.js`
    },
    plugins: [
        aliucordPlugin({
            autoDeploy: !!process.env.ROLLUP_WATCH,
        }),
        makeManifest({
            baseManifest: "baseManifest.json",
            manifest: `${process.env.plugin}/manifest.json`
	}),
        makePluginZip()
    ]
});
