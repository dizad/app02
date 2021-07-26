const path = require('path');

//for anything that is /api then we want to add a proxy for localhost:5000
//the outputdir is for sending the built files where you want it.
module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  lintOnSave: false, //turn off lint,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000'
      }
    }
  }
}