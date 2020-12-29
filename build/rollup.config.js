// rollup.config.js
import fs from 'fs';
import path from 'path';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import minimist from 'minimist';
import findIndex from 'lodash.findindex';

const esbrowserslist = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n');

const esbrowserslistmodern = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = {
  input: 'src/entry.ts',
  plugins: {
    preVue: [
      alias({
        entries: [
          {
            find: '@',
            replacement: `${path.resolve(projectRoot, 'src')}`,
          },
        ],
        customResolver: resolve({
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        }),
      }),
    ],
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    vue: {
      normalizer: '~vue-runtime-helpers/dist/normalize-component.js',
      styleInjector: '~vue-runtime-helpers/dist/inject-style/browser.js',
      styleInjectorSSR: '~vue-runtime-helpers/dist/inject-style/server.js',
      css: true,
      template: {
        isProduction: true,
        compilerOptions: {
          modules: [
            {
              preTransformNode(astEl) {
                if (process.env.NODE_ENV === 'production') {
                  const { attrsMap, attrsList } = astEl;
                  if (attrsMap['data-test']) {
                    delete attrsMap['data-test'];
                    const index = findIndex(attrsList, (x) => x.name === 'data-test');
                    attrsList.splice(index, 1);
                  }
                }
                return astEl;
              },
            },
          ],
        },
      },
    },
    postVue: [
    ],
    babel: {
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      babelHelpers: 'bundled',
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  'vue',
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: 'Vue',
};

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === 'esm') {
  const esConfig = {
    ...baseConfig,
    input: 'src/entry.esm.ts',
    external,
    output: {
      file: 'dist/vue-socials.esm.js',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: esbrowserslist,
            },
          ],
        ],
      }),
      commonjs(),
      copy({
        targets: [
          { src: 'src/vue-socials.d.ts', dest: 'dist/types' },
        ],
      }),
    ],
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/vue-socials.cjs.js',
      format: 'cjs',
      name: 'VueSocials',
      exports: 'auto',
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue({
        ...baseConfig.plugins.vue,
        template: {
          ...baseConfig.plugins.vue.template,
          optimizeSSR: true,
        },
      }),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
      commonjs(),
    ],
  };
  buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'iife') {
  const unpkgConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/vue-socials.iife.js',
      format: 'iife',
      name: 'VueSocials',
      exports: 'auto',
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
      commonjs(),
      terser({
        output: {
          ecma: 5,
        },
      }),
    ],
  };
  buildFormats.push(unpkgConfig);
}

if (!argv.format || argv.format === 'modern-esm') {
  const esConfig = {
    ...baseConfig,
    input: 'src/entry.esm.ts',
    external,
    output: {
      file: 'dist/vue-socials.modern.esm.js',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue({
        css: true,
        template: {
          isProduction: true,
          compilerOptions: {
            modules: [
              {
                preTransformNode(astEl) {
                  if (process.env.NODE_ENV === 'production') {
                    const { attrsMap, attrsList } = astEl;
                    if (attrsMap['data-test']) {
                      delete attrsMap['data-test'];
                      const index = findIndex(attrsList, (x) => x.name === 'data-test');
                      attrsList.splice(index, 1);
                    }
                  }
                  return astEl;
                },
              },
            ],
          },
        },
      }),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: esbrowserslistmodern,
            },
          ],
        ],
      }),
      commonjs(),
    ],
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'modern-cjs') {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/vue-socials.modern.cjs.js',
      format: 'cjs',
      name: 'VueSocials',
      exports: 'auto',
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue({
        css: true,
        template: {
          optimizeSSR: true,
          isProduction: true,
          compilerOptions: {
            modules: [
              {
                preTransformNode(astEl) {
                  if (process.env.NODE_ENV === 'production') {
                    const { attrsMap, attrsList } = astEl;
                    if (attrsMap['data-test']) {
                      delete attrsMap['data-test'];
                      const index = findIndex(attrsList, (x) => x.name === 'data-test');
                      attrsList.splice(index, 1);
                    }
                  }
                  return astEl;
                },
              },
            ],
          },
        },
      }),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: esbrowserslistmodern,
            },
          ],
        ],
      }),
      commonjs(),
    ],
  };
  buildFormats.push(umdConfig);
}

// Export config
export default buildFormats;