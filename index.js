const express = require('express')
const http = require('http')
const fileUpload = require('express-fileupload')
const unzipper = require('unzipper')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = process.env.PORT || 3000

app.use(fileUpload())

// Serve the upload page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.botzip) {
    return res.status(400).send('No file uploaded')
  }

  const botzip = req.files.botzip
  const uploadsDir = path.join(__dirname, 'uploads')
  const extractDir = path.join(__dirname, 'extracted')

  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
  if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true })

  const uploadPath = path.join(uploadsDir, botzip.name)

  try {
    await botzip.mv(uploadPath)
  } catch (e) {
    return res.status(500).send('Failed to save uploaded file')
  }

  // Extract zip
  fs.createReadStream(uploadPath)
    .pipe(unzipper.Extract({ path: extractDir }))
    .on('close', () => {
      const startScript = path.join(extractDir, 'index.js')

      if (!fs.existsSync(startScript)) {
        return res.status(400).send('No index.js found in extracted bot folder')
      }

      // Run the bot start script
      const botProcess = exec(`node ${startScript}`, { cwd: extractDir })

      // Send logs to server console + emit to all connected clients
      botProcess.stdout.on('data', data => {
        process.stdout.write(`[BOT STDOUT]: ${data}`)
        io.emit('bot-log', data.toString())
      })

      botProcess.stderr.on('data', data => {
        process.stderr.write(`[BOT STDERR]: ${data}`)
        io.emit('bot-log', data.toString())
      })

      botProcess.on('close', code => {
        console.log(`Bot process exited with code ${code}`)
        io.emit('bot-log', `\n[Bot process exited with code ${code}]\n`)
      })

      res.send('Bot uploaded, extracted, and started! Open this page to see logs.')
    })
    .on('error', err => {
      res.status(500).send('Failed to extract zip: ' + err.message)
    })
})

// Socket.io connection log (optional)
io.on('connection', socket => {
  console.log('Client connected for bot logs')
  socket.on('disconnect', () => {
    console.log('Client disconnected from bot logs')
  })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})