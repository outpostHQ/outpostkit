/* eslint-disable camelcase */
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';
import progress from 'rollup-plugin-progress';
import externals from 'rollup-plugin-node-externals';
import { rimrafSync } from 'rimraf';

rimrafSync('dist');

const inputFiles = ['./src/index.ts'];

/** @type {import('rollup').RollupOptions} */

const prodConfig_CJS = {
  input: inputFiles,
  output: {
    format: 'cjs',
    sourcemap: false,
    dir: 'dist/cjs',
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'named',
  },

  external: [/node_modules/],
  plugins: [
    progress({
      clearLine: false, // default: true
    }),
    externals({
      deps: true,
      devDeps: true,
    }),
    resolve(),
    typescript({
      tsconfig: 'tsconfig-cjs.build.json',
    }),
    terser(),
    summary({
      showBrotliSize: true,
      showGzippedSize: true,
      showMinifiedSize: true,
    }),
  ],
};
/** @type {import('rollup').RollupOptions} */

const prodConfig_ESM = {
  input: inputFiles,
  output: {
    format: 'esm',
    sourcemap: false,
    dir: 'dist/esm',
    preserveModules: true,
    entryFileNames: '[name].js',
  },

  external: [/node_modules/],
  plugins: [
    progress({
      clearLine: false, // default: true
    }),
    externals({
      deps: true,
      devDeps: true,
    }),
    resolve(),
    typescript({
      tsconfig: 'tsconfig-esm.build.json',
    }),
    terser(),
    summary({
      showBrotliSize: true,
      showGzippedSize: true,
      showMinifiedSize: true,
    }),
  ],
};

export default [prodConfig_CJS, prodConfig_ESM];
