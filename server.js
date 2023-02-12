const mongoose = require('mongoose')
const app = require('./app.js')
const PORT = process.env.PORT || 5000 
// Accessing dotenv file
require('dotenv')
  .config({path: './config.env'})

const DB = process.env.DB.replace(
 '<password>', 
  process.env.DB_PASSWORD
);

mongoose.set('strictQuery', true)
mongoose.connect(DB, { useNewUrlParser: true }) 
  .then(() => console.log('DB Connected'))

app.listen(PORT, () => {
   console.log(`Listening to PORT ${PORT}`)
}) 
