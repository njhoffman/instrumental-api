module.exports = {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // in development, an explicit public path is used when the assets are served webpack by to fix:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development : (config) => ({
    dbName: 'better_musician_dev'
  }),
  test: (config) => ({
    dbName: 'better_musician_test'
  }),
  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production : (config) => ({
    dbName: 'better_musician',
    apiPort   : process.env.API_PORT || 88
  })
};
