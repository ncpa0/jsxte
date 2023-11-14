import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/index.tsx"],
    jsxImportSource: "jsxte",
  })
  .catch(() => process.exit(1));
