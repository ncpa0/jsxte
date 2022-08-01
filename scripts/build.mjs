import esbuild from "esbuild";
import path from "path";
import { walk } from "node-os-walk";

// get first process argument
const argv = process.argv[2];

if (argv !== "esmodule" && argv !== "commonjs") {
  console.error("Invalid target, allowed values: 'esmodule', 'commonjs'");
  process.exit(1);
}

const format = argv === "esmodule" ? "esm" : "cjs";
const outDir = format === "esm" ? "./dist/esm" : "./dist/cjs";

const ALLOWED_EXTENSIONS = [
  ".ts",
  ".js",
  ".cjs",
  ".mjs",
  ".mts",
  ".cts",
  ".tsx",
  ".jsx",
];

/**
 * @param {string} relativePath
 * @param {string[]} rest
 */
function p(relativePath, ...rest) {
  return path.resolve(process.cwd(), relativePath, ...rest);
}

/**
 * @param {string} str
 * @param {string[]} suffixes
 */
function endsWith(str, ...suffixes) {
  for (const suffix of suffixes) {
    if (str.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}

/** @param {string} ext */
const ESbuildImportExtensionPlugin = (ext) => ({
  name: "esbuild-esm-import-plugin",
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.importer) return { path: args.path + ext, external: true };
    });
  },
});

/**
 * @param {{
 *   entrypoint: string;
 *   outfile: string;
 *   format: "esm" | "cjs";
 *   ext: string;
 * }} options
 */
async function buildFile({ entrypoint, outfile, format, ext }) {
  await esbuild.build({
    target: "es6",
    outfile,
    tsconfig: path.resolve(process.cwd(), "tsconfig.build.json"),
    entryPoints: [entrypoint],
    format: format,
    bundle: true,
    outExtension: {
      ".js": ext,
    },
    plugins: [ESbuildImportExtensionPlugin(ext)],
  });
}

/**
 * @param {{
 *   rootDir: string;
 *   outDir: string;
 *   format: "esm" | "cjs";
 *   ext?: string;
 * }} options
 */
async function build(options) {
  const { format, outDir, rootDir } = options;
  const ext = options.ext ?? (format === "esm" ? ".mjs" : ".cjs");

  for await (const [root, _, files] of walk(rootDir)) {
    for (const file of files) {
      if (endsWith(file.name, ...ALLOWED_EXTENSIONS)) {
        const fileName = path.parse(file.name).name;
        const filepath = path.resolve(root, file.name);
        const filepathRel = path.relative(rootDir, filepath);
        const fileOutDirRel = path.dirname(filepathRel);

        buildFile({
          entrypoint: filepath,
          outfile: path.resolve(outDir, fileOutDirRel, fileName + ext),
          format,
          ext,
        });
      }
    }
  }
}

async function main() {
  /** @type Array<Promise<void>> */
  const operations = [];

  operations.push(
    build({
      rootDir: p("./src"),
      outDir: p(outDir),
      format,
    })
  );

  if (format === "cjs") {
    const legacyDir = "./dist/legacy";

    // Build for legacy environments that do not support .cjs extensions
    operations.push(
      build({
        rootDir: p("./src"),
        outDir: p(legacyDir),
        format: "cjs",
        ext: ".js",
      })
    );
  }

  await Promise.all(operations);
}

main();
