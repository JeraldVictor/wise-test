const { createServer } = require('http')
const app = require('./src/app.js')
const { PORT } = require('./src/constants.js')

createServer(app).listen(PORT, () => {
  console.log('⚙️  Server is running on port: ' + PORT)
})
