const { rspack } = require('@rspack/core')
class Plugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('Plugin', (compilation) => {
      compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(
        'Plugin',
        (_loaderContext, module) => {
          // When the SASS loader is not working, this plugin will not be executed either
          return 'not work'
        }
      )
    })
  }
}

const config = {
  entry: './index',
  stats: 'errors-warnings',
  ignoreWarnings: [/Using \/ for division outside/],
  plugins: [new Plugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
              },
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [{ loader: 'sass-loader' }],
      },
    ],
  },
  experiments: {
    css: true,
  },
}

const compiler = rspack(config)

compiler.run((err, stats) => {
  if (err) {
    console.error(err)
    return
  }

  console.log(
    stats.toString({
      colors: true,
    })
  )
})
