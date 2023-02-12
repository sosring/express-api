const PORT = process.env.PORT || 5000 
require('dotenv').config({path: './config.env'})

const app = require('./app.js')

app.listen(PORT, () => {
   console.log(`Listening to PORT ${PORT}`)
}) 
