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
        "@opensea/seaport-js": "seaport",
        ethers: "ethers",
        http: "http",
        https: "https",
      },
    },
    external: ["ethers", "@opensea/seaport-js", "http", "https"],
    plugins: [
      resolve({ skip: ["ethers", "@opensea/seaport-js", "http", "https"] }),
      commonjs({
        exclude: ["ethers", "@opensea/seaport-js", "http", "https"],
      }),
      terser(),
    ],
  },
]
