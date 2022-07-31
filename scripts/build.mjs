// const esbuild = require("esbuild");
// const path = require("path");
import esbuild from "esbuild";
import path from "path";

// get first process argument
const argv = process.argv.at(2);

if (argv !== "esmodule" && argv !== "commonjs") {
  console.error("Invalid target, allowed values: 'esmodule', 'commonjs'");
  process.exit(1);
}

const format = argv === "esmodule" ? "esm" : "cjs";
const outDir = format === "esm" ? "./dist/esm" : "./dist/cjs";

const ext = format === "esm" ? ".mjs" : ".cjs";

async function main() {
  await esbuild.build({
    outfile: path.resolve(process.cwd(), outDir, `index${ext}`),
    tsconfig: path.resolve(process.cwd(), "tsconfig.build.json"),
    entryPoints: [path.resolve(process.cwd(), "src/index.ts")],
    format: format,
    bundle: true,
  });

  await esbuild.build({
    outfile: path.resolve(process.cwd(), outDir, `jsx-runtime${ext}`),
    tsconfig: path.resolve(process.cwd(), "tsconfig.build.json"),
    entryPoints: [path.resolve(process.cwd(), "src/jsx/jsx-runtime.ts")],
    format: format,
    bundle: true,
  });

  if (format === "cjs") {
    const legacyDir = "./dist/legacy";

    await esbuild.build({
      outfile: path.resolve(process.cwd(), legacyDir, `index.js`),
      tsconfig: path.resolve(process.cwd(), "tsconfig.build.json"),
      entryPoints: [path.resolve(process.cwd(), "src/index.ts")],
      format: "cjs",
      bundle: true,
    });

    await esbuild.build({
      outfile: path.resolve(process.cwd(), legacyDir, `jsx-runtime.js`),
      tsconfig: path.resolve(process.cwd(), "tsconfig.build.json"),
      entryPoints: [path.resolve(process.cwd(), "src/jsx/jsx-runtime.ts")],
      format: "cjs",
      bundle: true,
    });
  }
}

main();
