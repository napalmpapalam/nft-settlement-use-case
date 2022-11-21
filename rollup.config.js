import commonjs from "@rollup/plugin-commonjs";
import rollupJson from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import bundleSize from "rollup-plugin-bundle-size";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

const packageJson = require("./package.json");

export default [
  {
    context: "this", // https://rollupjs.org/guide/en/#error-this-is-undefined
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      // Webpack 5 by default doesnt provide support for node native module. So adding polyfill
      nodePolyfills({
        include: ["buffer", "stream", "events"],
      }),
      nodeResolve({ preferBuiltins: false, browser: true }),
      commonjs(),
      rollupJson(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
      terser(),
      bundleSize(),
    ],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];
