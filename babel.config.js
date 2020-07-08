const plugins = [
  ['@babel/plugin-proposal-decorators', { legacy: true }],               // 修饰器
  '@babel/plugin-proposal-class-properties',                             // class 相关
  '@babel/plugin-proposal-do-expressions',                               // do {} 语法
  '@babel/plugin-proposal-export-default-from',                          // export module from 语法
  '@babel/plugin-proposal-export-namespace-from',                        // export * as module from 语法
  '@babel/plugin-proposal-logical-assignment-operators',                 // x ??= y 语法
  '@babel/plugin-proposal-nullish-coalescing-operator',                  // x ?? y 语法
  '@babel/plugin-proposal-numeric-separator',                            // 1_000_000 语法
  '@babel/plugin-proposal-optional-chaining',                            // x?.y 语法
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }], // 管道函数
  '@babel/plugin-proposal-throw-expressions',                            // var e = throw new Error(err) 语法
  '@babel/plugin-syntax-top-level-await'                                 // top-level await
];

exports.plugins = plugins;

module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: ['node >= 10']
        },
        modules: 'commonjs',
        useBuiltIns: 'usage',
        bugfixes: true,
        corejs: 3
      }]
    ],
    plugins: plugins.concat([
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: { version: 3, proposals: true },
          helpers: true,
          regenerator: false,
          useESModules: true
        }
      ]
    ])
  };
};