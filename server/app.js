const express = require('express')
const chalk = require('chalk')
const config = require('config')
const mongoose = require('mongoose')
const initDatabase = require('./startUp/initDatabase')
const routes = require('./routes')
require('dotenv').config();

const app = express()
const PORT = config.get('port') ?? 8080

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', routes)

// if (process.env.NODE_ENV === 'production') {
//   console.log('production');
// } else {
//   console.log('development');
// }

async function start() {
  try {
    mongoose.connection.once('open', () => initDatabase())
    await mongoose.connect(process.env.MONGO_URI)
    console.log(chalk.bgGreen('MongoDB connected'))
    app.listen(PORT, () => console.log(chalk.green(`Server has been started on PORT ${PORT}...`)))
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1)
  }
}

start()
