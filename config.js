const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "BycRgDja#LWoUdcYkpYXQCbqPUJEondSin_M2-BUs-faYy6Hv8Iw",
    MODE: process.env.MODE || "private",
    PREFIX: process.env.PREFIX || ".",
    AUTO_REACT: process.env.AUTO_REACT || "false",
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",
    DEV: process.env.DEV || "94721551183",
    READ_MESSAGE: process.env.READ_MESSAGE || "false",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "false",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
    AUTOLIKESTATUS: process.env.AUTOLIKESTATUS || "false",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://imgur.com/a/oa6dzbF",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyBP9qAGQUHjtIPuaZcyvSnbZDGSyHUD6bc",
    MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|decd54b4fa030634e54d6c87fdffbb95f0bb9fb5",
    OMDB_API_KEY: process.env.OMDB_API_KEY || "76cb7f39" // omdbapi.com
    };
    
