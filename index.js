const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');
const chalk = require('chalk');
const { extractFull } = require('node-7z');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = 3000;

const GITHUB_ZIP_URL = 'https://github.com/buddika-iresh17/BOT-ZIP/raw/refs/heads/main/MANISHA-MD2.zip';
const DOWNLOAD_PATH = path.resolve(__dirname, 'bot_temp');
const ZIP_PATH = path.join(DOWNLOAD_PATH, 'repo.zip');
const EXTRACT_PATH = path.join(DOWNLOAD_PATH, 'extracted');
const ZIP_PASSWORD = '';
const ENV_PATH = path.resolve(__dirname, 'config.env');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let botProcess = null;

// Serve the HTML form at /settings
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve current config.env content to prefill form fields
app.get('/config.env', (req, res) => {
  if (fs.existsSync(ENV_PATH)) {
    res.type('text/plain').send(fs.readFileSync(ENV_PATH, 'utf-8'));
  } else {
    res.status(404).send('');
  }
});

// Handle config form submission and bot setup/run
app.post('/save-config', async (req, res) => {
  const SESSION_ID = req.body.SESSION_ID;

  if (!SESSION_ID || SESSION_ID.trim() === '') {
    return res.status(400).send('SESSION_ID is required');
  }

  // Build config.env content string with defaults and submitted values
  const configContent = `SESSION_ID=${SESSION_ID.trim()}
MODE=${req.body.MODE || 'private'}
PREFIX=${req.body.PREFIX || '.'}
AUTO_REACT=${req.body.AUTO_REACT || 'false'}
ANTI_DEL_PATH=${req.body.ANTI_DEL_PATH || 'inbox'}
DEV=${req.body.DEV || ''}
READ_MESSAGE=${req.body.READ_MESSAGE || 'false'}
AUTO_READ_STATUS=${req.body.AUTO_READ_STATUS || 'false'}
AUTO_STATUS_REPLY=${req.body.AUTO_STATUS_REPLY || 'false'}
AUTO_STATUS_REACT=${req.body.AUTO_STATUS_REACT || 'false'}
AUTOLIKESTATUS=${req.body.AUTOLIKESTATUS || 'false'}
AUTO_TYPING=${req.body.AUTO_TYPING || 'true'}
AUTO_RECORDING=${req.body.AUTO_RECORDING || 'true'}
ALWAYS_ONLINE=${req.body.ALWAYS_ONLINE || 'true'}
ANTI_CALL=${req.body.ANTI_CALL || 'false'}
BAD_NUMBER_BLOCKER=${req.body.BAD_NUMBER_BLOCKER || 'false'}
UNIFIED_PROTECTION=${req.body.UNIFIED_PROTECTION || 'kick'}
`;

  try {
    fs.writeFileSync(ENV_PATH, configContent, 'utf-8');
  } catch (err) {
    console.error('Failed to write config.env:', err);
    return res.status(500).send('Failed to save config');
  }

  try {
    await setupAndRunBot();
    res.send('Config saved and bot started successfully!');
  } catch (err) {
    console.error('Setup and run failed:', err);
    res.status(500).send('Bot setup failed: ' + err.message);
  }
});

async function setupAndRunBot() {
  if (botProcess) {
    botProcess.kill();
    botProcess = null;
  }

  if (fs.existsSync(DOWNLOAD_PATH)) {
    fs.rmSync(DOWNLOAD_PATH, { recursive: true, force: true });
  }
  fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
  fs.mkdirSync(EXTRACT_PATH, { recursive: true });

  console.log(chalk.blue('Downloading GitHub ZIP...'));
  const response = await axios.get(GITHUB_ZIP_URL, { responseType: 'arraybuffer' });
  fs.writeFileSync(ZIP_PATH, response.data);
  console.log(chalk.green('ZIP downloaded.'));

  // Detect 7z binary path depending on OS
  const SEVEN_ZIP_BIN = process.platform === 'win32'
    ? 'C:\\Program Files\\7-Zip\\7z.exe'  // Update if your path is different on Windows
    : '/usr/bin/7z';                      // Common path on Linux/Mac

  await new Promise((resolve, reject) => {
    const extractor = extractFull(ZIP_PATH, EXTRACT_PATH, {
      password: ZIP_PASSWORD,
      $bin: SEVEN_ZIP_BIN,
    });
    extractor.on('end', () => {
      console.log(chalk.green('Extraction complete.'));
      resolve();
    });
    extractor.on('error', (err) => reject(err));
  });

  const mainFolder = getFirstFolder(EXTRACT_PATH);

  // Generate config.js dynamically from config.env file content
  const envData = fs.readFileSync(ENV_PATH, 'utf-8');
  const configJsContent = envData
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      const [key, val] = line.split('=');
      if (!key) return '';
      const safeVal = val.replace(/[`\\]/g, '\\$&');
      return `${key}: \`${safeVal}\``;
    })
    .join(',\n');

  const fullConfigJs = `module.exports = {\n${configJsContent}\n};\n`;
  fs.writeFileSync(path.join(mainFolder, 'config.js'), fullConfigJs, 'utf-8');
  console.log(chalk.green('config.js created from config.env.'));

  const entryPoint = findEntryPoint(mainFolder);
  if (!entryPoint) throw new Error('Could not find start.js or index.js');

  botProcess = spawn('node', [entryPoint], { stdio: 'inherit' });
  botProcess.on('close', (code) => {
    console.log(chalk.yellow(`Bot exited with code ${code}`));
    botProcess = null;
  });
}

function getFirstFolder(basePath) {
  const items = fs.readdirSync(basePath);
  const folder = items.find(f => fs.statSync(path.join(basePath, f)).isDirectory());
  return folder ? path.join(basePath, folder) : basePath;
}

function findEntryPoint(basePath) {
  const files = ['start.js', 'index.js'];
  for (const file of files) {
    const full = path.join(basePath, file);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/settings`);
});
