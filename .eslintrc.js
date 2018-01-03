module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.wpy files
  plugins: [
    'html'
  ],
  settings: {
    'html/html-extensions': ['.html', '.wpy']
  },
  globals: {
    'wx': true
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0,
    'eol-last': 0, // 文件末尾不强制换行
    'curly': [0, "all"], // 必须使用 if(){} 中的{}
    'comma-dangle': [0, "never"],//对象字面量项尾不能有逗号
    'camelcase': 0, // 强制驼峰法命名
    'no-return-assign': 0,
    'no-cond-assign': 0
  }
}
