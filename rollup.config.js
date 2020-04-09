import typescript from "rollup-plugin-typescript";
import replace from "rollup-plugin-replace";
import babel from 'rollup-plugin-babel';

export default [
  {
    input: './src/main.ts',
    output: {
      name: 'base-promise',
      format: 'umd',
      file: './dist/index.js',
      sourcemap: true,
    },
    watch: {
      include: "src/**"
    },
    plugins: [
      typescript(),
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        'env': JSON.stringify(process.env.NODE_ENV),
      })
    ]
  }
];
