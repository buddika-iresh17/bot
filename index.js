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

const GITHUB_ZIP_URL = 'https://github.com/buddika-iresh17/BOT-ZIP/raw/refs/heads/main/MANISHA-MD.zip';
const DOWNLOAD_PATH = path.resolve(__dirname, 'bot_temp');
const ZIP_PATH = path.join(DOWNLOAD_PATH, 'repo.zip');
const EXTRACT_PATH = path.join(DOWNLOAD_PATH, 'extracted');
const ZIP_PASSWORD = 'manisha19@';
const ENV_PATH = path.resolve(__dirname, 'config.env');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let botProcess = null;

// Helper: find system 7z executable path
function find7zBinary() {
  const possiblePaths = [
    '/usr/bin/7z',           // common Linux
    '/usr/local/bin/7z',     // macOS Homebrew
    'C:\\Program Files\\7-Zip\\7z.exe',  // Windows default install path
    'C:\\Program Files (x86)\\7-Zip\\7z.exe'
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }

  // fallback to just '7z' to use system PATH
  return '7z';
}

const SEVEN_ZIP_BIN = find7zBinary();

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/config.env', (req, res) => {
  if (fs.existsSync(ENV_PATH)) {
    res.type('text/plain').send(fs.readFileSync(ENV_PATH, 'utf-8'));
  } else {
    res.status(404).send('');
  }
});

app.post('/save-config', async (req, res) => {
  const SESSION_ID = req.body.SESSION_ID;

  if (!SESSION_ID || SESSION_ID.trim() === '') {
    return res.status(400).send('SESSION_ID is required');
  }

  // Normalize checkbox inputs: if checkbox absent = false
  function toBool(val) {
    return val === 'true' ? 'true' : 'false';
  }

  const configContent = `SESSION_ID=${SESSION_ID.trim()}
MODE=${req.body.MODE || 'private'}
PREFIX=${req.body.PREFIX || '.'}
AUTO_REACT=${toBool(req.body.AUTO_REACT)}
ANTI_DEL_PATH=${req.body.ANTI_DEL_PATH || 'inbox'}
DEV=${req.body.DEV || ''}
READ_MESSAGE=${toBool(req.body.READ_MESSAGE)}
AUTO_READ_STATUS=${toBool(req.body.AUTO_READ_STATUS)}
AUTO_STATUS_REPLY=${toBool(req.body.AUTO_STATUS_REPLY)}
AUTO_STATUS_REACT=${toBool(req.body.AUTO_STATUS_REACT)}
AUTOLIKESTATUS=${toBool(req.body.AUTOLIKESTATUS)}
AUTO_TYPING=${toBool(req.body.AUTO_TYPING !== undefined ? req.body.AUTO_TYPING : 'true')}
AUTO_RECORDING=${toBool(req.body.AUTO_RECORDING !== undefined ? req.body.AUTO_RECORDING : 'true')}
ALWAYS_ONLINE=${toBool(req.body.ALWAYS_ONLINE !== undefined ? req.body.ALWAYS_ONLINE : 'true')}
ANTI_CALL=${toBool(req.body.ANTI_CALL)}
BAD_NUMBER_BLOCKER=${toBool(req.body.BAD_NUMBER_BLOCKER)}
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

  console.log(chalk.blue(`Extracting ZIP using 7z binary at: ${SEVEN_ZIP_BIN}`));

  await new Promise((resolve, reject) => {
    const extractor = extractFull(ZIP_PATH, EXTRACT_PATH, {
      password: ZIP_PASSWORD,
      $bin: SEVEN_ZIP_BIN,
    });
    extractor.on('end', () => {
      console.log(chalk.green('Extraction complete.'));
      resolve();
    });
    extractor.on('error', (err) => {
      console.error('Extraction error:', err);
      reject(err);
    });
  });

  const mainFolder = getFirstFolder(EXTRACT_PATH);

  // Generate config.js dynamically from config.env
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