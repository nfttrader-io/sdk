import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import pkg from "./package.json"

export default [
  {
    input: pkg.main,
    output: {
      name: "NFTTrader",
      file: pkg.browser,
      format: "iife",
      sourcemap: true,
      exports: "named",
      globals: {
        ethers: "ethers",
        http: "http",
        https: "https",
      },
    },
    external: ["ethers", "http", "https"],
    plugins: [
      resolve({ skip: ["ethers", "http", "https"] }),
      commonjs({
        exclude: ["ethers", "http", "https"],
      }),
      terser(),
    ],
  },
]
