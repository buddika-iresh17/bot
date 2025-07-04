module.exports = (conn) => {
//╭────────────●●►
const { downloadContentFromMessage, getContentType } = require("@whiskeysockets/baileys");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat, downloadMediaMessage, getAnti, setAnti} = require('./connect')
const { cmd, commands } = require('./command')
const config = require('./config');
//╰────────────●●►
const axios = require("axios")
const os = require("os")
//╭────────────●●►
const fs = require("fs");
//╰────────────●●►
const fse = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
//╭────────────●●►
const FormData = require('form-data');
//╰────────────●●►
//===========
const ffmpeg = require('fluent-ffmpeg');
//=========
//===========convert api================
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
//==============song api================
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
//=============google trslart===========
const googleTTS = require('google-tts-api')
//========================
//============ YT SEARCH=======
const dl = require('@bochilteam/scraper')  
const l = console.log
const ytdl = require('yt-search');
var videotime = 60000 // 1000 min
//====================== AI API ================
const GEMINI_API_KEY = config.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
//============================================
//========== MOVIE API ==============
const API_URL = "https://api.skymansion.site/movies-dl/search";
const DOWNLOAD_URL = "https://api.skymansion.site/movies-dl/download";
const API_KEY = config.MOVIE_API_KEY;
//================SETTINGS COMMAND===================
const getBotOwner = (conn) => conn.user.id.split(":")[0];

const settingsMap = {
"1": { key: "MODE", trueVal: "private", falseVal: "public", label: "Bot Mode" },
"2": { key: "AUTO_REACT", trueVal: "true", falseVal: "false", label: "Auto-React" },
"3": { key: "AUTO_READ_STATUS", trueVal: "true", falseVal: "false", label: "Auto-Read-Status" },
"4": { key: "AUTO_STATUS_REPLY", trueVal: "true", falseVal: "false", label: "Auto-Status-Reply" },
"5": { key: "AUTOLIKESTATUS", trueVal: "true", falseVal: "false", label: "Auto-like-status" },
"6": { key: "READ_MESSAGE", trueVal: "true", falseVal: "false", label: "Read-message" },
"7": { key: "ANTI_DEL_PATH", label: "Anti-delete Path", customOptions: ["log", "chat", "inbox"] },
"8": { key: "ANTIDELETE", trueVal: "true", falseVal: "false", label: "Anti-Delete" }
};

cmd({
pattern: "settings",
alias: ["config"],
react: "⚙️",
desc: "Change bot settings via reply (owner only).",
category: "settings",
filename: __filename,
}, async (conn, mek, m, { from }) => {
try {
const senderNumber = m.sender.split("@")[0];
const botOwner = getBotOwner(conn);

if (senderNumber !== botOwner) {  
  return conn.sendMessage(from, { text: "*📛 Only the bot owner can use this command!*" });  
}  

const sentMsg = await conn.sendMessage(from, {  
  image: { url: config.ALIVE_IMG },  
  caption:  
    `╔═══╣❍*ꜱᴇᴛᴛɪɴɢ*❍╠═══⫸\n` +  
    `╠➢ 1️⃣. ʙᴏᴛ ᴍᴏᴅᴇ (ᴘʀɪᴠᴀᴛᴇ / ᴘᴜʙʟɪᴄ)\n` +  
    `╠➢ 2️⃣. ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛ (ᴏɴ / ᴏꜰꜰ)\n` +  
    `╠➢ 3️⃣. ᴀᴜᴛᴏ-ʀᴇᴀᴅ-ꜱᴛᴀᴛᴜꜱ (ᴏɴ / ᴏꜰꜰ)\n` +  
    `╠➢ 4️⃣. ᴀᴜᴛᴏ-ꜱᴛᴀᴛᴜꜱ-ʀᴇᴘʟʏ (ᴏɴ / ᴏꜰꜰ)\n` +  
    `╠➢ 5️⃣. ᴀᴜᴛᴏ-ꜱᴛᴀᴛᴜꜱ-ʟɪᴋᴇ (ᴏɴ / ᴏꜰꜰ)\n` +  
    `╠➢ 6️⃣. ʀᴇᴀᴅ-ᴍᴇꜱꜱᴀɢᴇ (ᴏɴ / ᴏꜰꜰ)\n` +
    `╠➢ 7️⃣. ᴀɴᴛɪ-ᴅᴇʟᴇᴛ-ᴘᴀᴛʜ (ʟᴏɢ / ᴄʜᴀᴛ / ɪɴʙᴏx)\n` +  
    `╠➢ 8️⃣. ᴀɴᴛɪ-ᴅᴇʟᴇᴛᴇ (ᴏɴ / ᴏꜰꜰ)\n` + 
    `╠➢ 🔢. ʀᴇᴘʟʏ ᴡɪᴛʜ ɴᴜᴍʙᴇʀ\n` + 
    `╚════════════════════⫸\n\n` +  
    `> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`  
});  

const menuMessageID = sentMsg.key.id;  

const menuListener = async (msgData) => {  
  try {  
    const received = msgData.messages[0];  
    if (!received || received.key.remoteJid !== from) return;  

    const message = received.message;  
    if (!message) return;  

    const sender = (received.key.participant || received.key.remoteJid).split("@")[0];  
    const isReply = message.extendedTextMessage?.contextInfo?.stanzaId === menuMessageID;  
    const text = message.conversation || message.extendedTextMessage?.text;  

    if (!isReply || sender !== botOwner || !text) return;  

    const settingOption = text.trim();  
    const setting = settingsMap[settingOption];  

    if (!setting) {  
      await conn.sendMessage(from, { text: "❌ Invalid option. Please reply with a number from 1 to 10." });  
      return;  
    }  

    const settingMsg = await conn.sendMessage(from, {  
      text: setting.customOptions  
        ? `╔═════⫸\n╠➢*${setting.label}:*\n╠➢${setting.customOptions.map((opt, i) => `${i + 1}. ${opt.toUpperCase()}`).join("\n")}\n╠➢ _Reply with number._\n╚═══════⫸`  
        : `╔═════⫸\n╠➢*${setting.label}:*\n\n╠➢1. ${setting.trueVal.toUpperCase()}\n╠➢2. ${setting.falseVal.toUpperCase()}\n╠➢ _Reply with number._\n╚════⫸`  
    });  

    const toggleID = settingMsg.key.id;  

    const toggleListener = async (msgData2) => {  
      try {  
        const received2 = msgData2.messages[0];  
        if (!received2 || received2.key.remoteJid !== from) return;  

        const message2 = received2.message;  
        if (!message2) return;  

        const sender2 = (received2.key.participant || received2.key.remoteJid).split("@")[0];  
        const isReplyToToggle = message2.extendedTextMessage?.contextInfo?.stanzaId === toggleID;  
        const text2 = message2.conversation || message2.extendedTextMessage?.text;  

        if (!isReplyToToggle || sender2 !== botOwner || !text2) return;  

        const response = text2.trim();  

        if (setting.customOptions) {  
          const index = parseInt(response) - 1;  
          if (index >= 0 && index < setting.customOptions.length) {  
            config[setting.key] = setting.customOptions[index];  
            await conn.sendMessage(from, {  
              text: `✅ *${setting.label} set to ${setting.customOptions[index].toUpperCase()}.*`  
            });  
            conn.ev.off("messages.upsert", toggleListener);  
          } else {  
            await conn.sendMessage(from, { text: "❌ Invalid option. Please choose a valid number." });  
          }  
        } else {  
          if (setting.key === "ANTIDELETE") {  
            const enable = response === "1";  
            await setAnti(enable);  
            await conn.sendMessage(from, {  
              text: `✅ *${setting.label} set to ${enable ? "ON" : "OFF"}.*`  
            });  
            conn.ev.off("messages.upsert", toggleListener);  
          } else {  
            if (response === "1") {  
              config[setting.key] = setting.trueVal;  
              await conn.sendMessage(from, {  
                text: `✅ *${setting.label} set to ${setting.trueVal.toUpperCase()}.*`  
              });  
              conn.ev.off("messages.upsert", toggleListener);  
            } else if (response === "2") {  
              config[setting.key] = setting.falseVal;  
              await conn.sendMessage(from, {  
                text: `✅ *${setting.label} set to ${setting.falseVal.toUpperCase()}.*`  
              });  
              conn.ev.off("messages.upsert", toggleListener);  
            } else {  
              await conn.sendMessage(from, { text: "❌ Invalid option. Please reply with 1 or 2." });  
            }  
          }  
        }  
      } catch (err2) {  
        console.error("Toggle Error:", err2);  
      }  
    };  

    conn.ev.on("messages.upsert", toggleListener);  
    conn.ev.off("messages.upsert", menuListener);  

  } catch (err) {  
    console.error("Settings Menu Error:", err);  
  }  
};  

conn.ev.on("messages.upsert", menuListener);

} catch (err) {
console.error("Settings Command Error:", err);
}
});
//===================DOWNLOAD COMMAND======================
// song download 
cmd({ 
    pattern: "song", 
    alias: ["song"], 
    react: "🎶", 
    desc: "Download YouTube song", 
    category: "download", 
    use: '.song <query>', 
    filename: __filename 
}, async (conn, mek, m, { from, sender, reply, q }) => { 
    try {
        if (!q) return reply("Please provide a song name or YouTube link.");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("No results found!");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("Download failed. Try again later.");

    await conn.sendMessage(from, {
    audio: { url: data.result.downloadUrl },
    mimetype: "audio/mpeg",
    fileName: `${song.title}.mp3`,
    contextInfo: {
        externalAdReply: {
            title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
            body: "MANISHA-MD SONG DOWNLOAD",
            mediaType: 1,
            thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
            sourceUrl: '',
            mediaUrl: '',
            showAdAttribution: true,
            renderLargerThumbnail: true
        }
    }
}, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred. Please try again.");
    }
});

//video download
cmd({
    pattern: "video",
    alias: ["ytvideo", "mp4"],
    react: "📽",
    desc: "Download YouTube video (MP4)",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What video do you want to download? Please provide a search term.");

        await reply("🔍 *Searching for your video, please wait...*");

        const search = await ytsearch(q);
        if (!search.results.length) return reply("❌ No results found for your query.");

        const { title, thumbnail, timestamp, url } = search.results[0];
        const videoUrl = encodeURIComponent(url);

        // Try primary API
        const api1 = `https://apis-keith.vercel.app/download/dlmp4?url=${videoUrl}`;
        const api2 = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${videoUrl}`;

        let data;

        try {
            const res1 = await fetch(api1);
            data = await res1.json();
            if (!data?.status || !data?.result?.downloadUrl) throw new Error("Primary API failed");
        } catch {
            const res2 = await fetch(api2);
            data = await res2.json();
            if (!data?.success || !data?.result?.download_url) throw new Error("Both APIs failed");
        }

        const downloadUrl = data.result.downloadUrl || data.result.download_url;

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `╔══╣❍ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ❍╠═══⫸\n╠➢📌 *ᴛɪᴛʟᴇ:* ${title}\n╠➢⏱️ *ᴅᴜʀᴀᴛɪᴏɴ:* ${timestamp}\n╚════════════════════⫸\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            caption: `🎬 *Video Downloaded Successfully!*\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});


//mp4 download

cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "download", 
    use: '.video < YT URL OR NAME >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("PROVIDE URL OR NAME");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `╔══╣❍ᴍᴘ4 ᴅᴏᴡɴʟᴏᴀᴅ❍╠═══⫸\n╠➢ *ᴛɪᴛʟᴇ:* ${yts.title}\n╠➢ *ᴅᴜʀᴀᴛɪᴏɴ:* ${yts.timestamp}\n╠➢ *ᴠɪᴡᴇꜱ:* ${yts.views}\n╠➢ *ᴀᴜᴛʜᴏʀ:* ${yts.author.name}\n╠➢ *ʟɪɴᴋ:* ${yts.url}\n╚═════════════════⫸\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

        // Send video directly with caption
        await conn.sendMessage(
            from, 
            { 
                video: { url: data.result.download_url }, 
                caption: ytmsg,
                mimetype: "video/mp4"
            }, 
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});





cmd({
    pattern: "pindl",
    alias: ["pinterestdl", "pin", "pin2", "pindownload"],
    desc: "Download media from Pinterest",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, quoted, from, reply }) => {
    try {
        if (args.length < 1) {
            return reply('❎ Please provide a valid Pinterest URL.');
        }

        const pinterestUrl = args[0];
        if (!pinterestUrl.includes('pinterest')) {
            return reply('❎ That doesn\'t look like a Pinterest link!');
        }

        const res = await axios.get(`https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`);

        if (!res.data.success || !res.data.result.media || res.data.result.media.length === 0) {
            return reply('❎ Failed to fetch media. Try another link.');
        }

        const { title = 'No Title', description = 'No Description', media } = res.data.result;

        const video = media.find(m => m.type.includes('720p') || m.type.includes('video'));
        const image = media.find(m => m.type.toLowerCase().includes('image') || m.type.toLowerCase().includes('thumbnail'));

        const caption =
`╔══╣❍ᴘɪɴᴛᴇʀᴇꜱᴛᴅʟ❍╠═══⫸\n` +
`╠➢ *ᴛɪᴛʟᴇ* - ${title}\n` +
`╠➢ *ᴛʏᴘᴇ* - ${video ? 'Video' : 'Image'}\n` +
`╚══════════════════⫸\n\n` +
`> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

        if (video) {
            await conn.sendMessage(from, { video: { url: video.download_url }, caption }, { quoted: mek });
        } else if (image) {
            await conn.sendMessage(from, { image: { url: image.download_url }, caption }, { quoted: mek });
        } else {
            return reply('❎ Could not find downloadable media in this post.');
        }

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❎ An error occurred while processing the Pinterest link.');
    }
});

cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `╔══╣❍ᴛᴡɪᴛᴛᴇʀ❍╠═══⫸\n╠➢ *ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ:* ${desc || "No description"}\n\n╠➢ *ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴏᴘᴛɪᴏɴꜱ*\n╠➢ 1. *SD Quality*\n╠➢ 2. *HD Quality*\n\n╠➢ *ᴀᴜᴅɪᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴏᴘᴛɪᴏɴꜱ*\n╠➢ 3. *Audio*\n╠➢ 4. *Document*\n╠➢ 4. *Voice*\n╠➢ *ʀᴇᴘʟʏ ᴡɪᴛʜ ᴛʜᴇ ɴᴜᴍʙᴇʀ*\n╚═══════════════⫸\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb },
      caption: caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, {
          react: { text: '⬇️', key: receivedMsg.key }
        });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: video_sd },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: video_hd },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "3":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mpeg"
            }, { quoted: receivedMsg });
            break;

          case "4":
            await conn.sendMessage(senderID, {
              document: { url: video_sd },
              mimetype: "audio/mpeg",
              fileName: "Twitter_Audio.mp3",
              caption: "📥 *Audio Downloaded as Document*"
            }, { quoted: receivedMsg });
            break;

          case "5":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mp4",
              ptt: true
            }, { quoted: receivedMsg });
            break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.");
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// G-Drive-DL

cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
}); 


cmd({
  pattern: "ig",
  alias: ["insta", "Instagram","ig"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *DOWNLOAD SUCCESSFULLY!*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// MediaFire-dl

cmd({
  pattern: "mediafire",
  alias: ["mfire","mf"],
  desc: "To download MediaFire files.",
  react: "🍿",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid MediaFire link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `╔══╣❍ᴍᴇᴅɪᴀꜰɪʀᴇ❍╠═══⫸\n╠➢ *ꜰɪʟᴇ ɴᴀᴍᴇ:* ${file_name}\n╠➢ *ꜰɪʟᴇ ᴛʏᴘᴇ:* ${mime_type}\n╚════════════⫸\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;
    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});
        

cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `╔══╣❍ᴀᴘᴋ❍╠═══⫸\n*ɴᴀᴍᴇ:* ${app.name}\n╠➢ *ꜱɪᴢᴇ:* ${appSize}ᴍʙ\n╠➢ *ᴘᴀᴄᴋᴀɢᴇ:* ${app.package}\n╠➢ *ᴜᴘᴅᴀᴛᴇᴅ:* ${app.updated}\n╠➢ *ᴅᴇᴠᴇᴘʟᴏᴘᴇʀ:* ${app.developer.name}\n╚═════════════⫸\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});
              
cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🖼️",
    desc: "Search and download Google images",
    category: "download",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply(" Please provide a search query\nExample: .img dogs");
        }

        await reply(`🔍 Searching images for "${query}"...`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        // Validate response
        if (!response.data?.success || !response.data.results?.length) {
            return reply("❌ No images found. Try different keywords");
        }

        const results = response.data.results;
        // Get 5 random images
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                { 
                    image: { url: imageUrl },
                    caption: `📷 Result for: ${query}\n *MANISHA-MD*`
                },
                { quoted: mek }
            );
            // Add delay between sends to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Image Search Error:', error);
        reply(`❌ Error: ${error.message || "Failed to fetch images"}`);
    }
});

//===============MOVIE COMMAND=======================
cmd({
    pattern: "sinhalasub",
    alias: ["moviedl", "films"],
    react: '🎬',
    category: "movie",
    desc: "Search and download movies from PixelDrain",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q || q.trim() === '') return await reply('❌ Please provide a movie name! (e.g., Deadpool)');

        // Fetch movie search results
        const searchUrl = `${API_URL}?q=${encodeURIComponent(q)}&api_key=${API_KEY}`;
        let response = await fetchJson(searchUrl);

        if (!response || !response.SearchResult || !response.SearchResult.result.length) {
            return await reply(`❌ No results found for: *${q}*`);
        }

        const selectedMovie = response.SearchResult.result[0]; // Select first result
        const detailsUrl = `${DOWNLOAD_URL}/?id=${selectedMovie.id}&api_key=${API_KEY}`;
        let detailsResponse = await fetchJson(detailsUrl);

        if (!detailsResponse || !detailsResponse.downloadLinks || !detailsResponse.downloadLinks.result.links.driveLinks.length) {
            return await reply('❌ No PixelDrain download links found.');
        }

        // Select the 720p PixelDrain link
        const pixelDrainLinks = detailsResponse.downloadLinks.result.links.driveLinks;
        const selectedDownload = pixelDrainLinks.find(link => link.quality === "SD 480p");
        
        if (!selectedDownload || !selectedDownload.link.startsWith('http')) {
            return await reply('❌ No valid 480p PixelDrain link available.');
        }

        // Convert to direct download link
        const fileId = selectedDownload.link.split('/').pop();
        const directDownloadLink = `https://pixeldrain.com/api/file/${fileId}?download`;
        
        
        // Download movie
        const filePath = path.join(__dirname, `${selectedMovie.title}-480p.mp4`);
        const writer = fs.createWriteStream(filePath);
        
        const { data } = await axios({
            url: directDownloadLink,
            method: 'GET',
            responseType: 'stream'
        });

        data.pipe(writer);

        writer.on('finish', async () => {
            await conn.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                fileName: `${selectedMovie.title}-480p.mp4`,
                caption: `📌 Quality: 480p\n✅ *Download Complete!*\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`,
                quoted: mek 
            });
            fs.unlinkSync(filePath);
        });

        writer.on('error', async (err) => {
            console.error('Download Error:', err);
            await reply('❌ Failed to download movie. Please try again.');
        });
    } catch (error) {
        console.error('Error in movie command:', error);
        await reply('❌ Sorry, something went wrong. Please try again later.');
    }
});

//=============OWNER COMMAND =================
cmd({
    pattern: "restart",
    desc: "Restart the bot",
    react: "🔄",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        const { exec } = require("child_process");
        reply("MANISHA-MD Restarting ⏳...");
        await sleep(1500);
        exec("pm2 restart all");
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});


cmd({
  pattern: "vv",
  alias: ["viewonce", 'retrive'],
  react: '🐳',
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (conn, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) {
      return await conn.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    if (!match.quoted) {
      return await conn.sendMessage(from, {
        text: "*🍁 Please reply to a view once message!*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await conn.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    await conn.sendMessage(from, messageContent, options);
  } catch (error) {
    console.error("vv Error:", error);
    await conn.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message
    }, { quoted: message });
  }
});


cmd({
  pattern: "post",
  alias: ["poststatus", "status", "story", "repost", "reshare"],
  react: '📝',
  desc: "Posts replied media to bot's status",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner-only command.*"
      }, { quoted: message });
    }

    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType) {
      return await client.sendMessage(message.chat, {
        text: "*Please reply to an image, video, or audio file.*"
      }, { quoted: message });
    }

    const buffer = await quotedMsg.download();
    const mtype = quotedMsg.mtype;
    const caption = quotedMsg.text || '';

    let statusContent = {};

    switch (mtype) {
      case "imageMessage":
        statusContent = {
          image: buffer,
          caption: caption
        };
        break;
      case "videoMessage":
        statusContent = {
          video: buffer,
          caption: caption
        };
        break;
      case "audioMessage":
        statusContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quotedMsg.ptt || false
        };
        break;
      default:
        return await client.sendMessage(message.chat, {
          text: "Only image, video, and audio files can be posted to status."
        }, { quoted: message });
    }

    await client.sendMessage("status@broadcast", statusContent);

    await client.sendMessage(message.chat, {
      text: "✅ Status Uploaded Successfully."
    }, { quoted: message });

  } catch (error) {
    console.error("Status Error:", error);
    await client.sendMessage(message.chat, {
      text: "❌ Failed to post status:\n" + error.message
    }, { quoted: message });
  }
});



cmd({
    pattern: "jid",
    alias: ["id", "chatid", "gjid"],  
    desc: "Get full JID of current chat/user (Creator Only)",
    react: "🆔",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, isCreator, reply, sender 
}) => {
    try {
        if (!isCreator) {
            return reply("❌ *Command Restricted* - Only my creator can use this.");
        }

        if (isGroup) {
            // Ensure group JID ends with @g.us
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;
            return reply(`👥 *Group JID:*\n\`\`\`${groupJID}\`\`\``);
        } else {
            // Ensure user JID ends with @s.whatsapp.net
            const userJID = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
            return reply(`👤 *User JID:*\n\`\`\`${userJID}\`\`\``);
        }

    } catch (e) {
        console.error("JID Error:", e);
        reply(`⚠️ Error fetching JID:\n${e.message}`);
    }
});


cmd({
    pattern: "block",
    desc: "Blocks a person",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply("Please mention a user or reply to their message.");
    }

    try {
        await conn.updateBlockStatus(jid, "block");
        await react("✅");
        reply(`Successfully blocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("Block command error:", error);
        await react("❌");
        reply("Failed to block the user.");
    }
});

cmd({
    pattern: "unblock",
    desc: "Unblocks a person",
    category: "owner",
    react: "✅",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply("Please mention a user or reply to their message.");
    }

    try {
        await conn.updateBlockStatus(jid, "unblock");
        await react("✅");
        reply(`Successfully unblocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("Unblock command error:", error);
        await react("❌");
        reply("Failed to unblock the user.");
    }
});


cmd({
    pattern: "blocklist",
    desc: "Show list of blocked users",
    category: "owner",
    react: "📛",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    try {
        const blocklist = await conn.fetchBlocklist();
        if (blocklist.length === 0) {
            await react("ℹ️");
            return reply("No users are currently blocked.");
        }

        let text = "🚫 *Blocked Users List:*\n\n";
        blocklist.forEach((jid, i) => {
            text += `${i + 1}. @${jid.split("@")[0]}\n`;
        });

        await react("✅");
        reply(text, { mentions: blocklist });
    } catch (err) {
        console.error(err);
        await react("❌");
        reply("Couldn't retrieve block list.");
    }
});

cmd({
    pattern: "setpp",
    desc: "Set new profile picture",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    if (!m.quoted || !m.quoted.imageMessage) {
        await react("❌");
        return reply("Please reply to an image to set as profile picture.");
    }

    try {
        const media = await m.quoted.download();
        await conn.updateProfilePicture(conn.user.id, media);
        await react("✅");
        reply("Profile picture updated successfully.");
    } catch (err) {
        console.error(err);
        await react("❌");
        reply("Failed to update profile picture.");
    }
});
//================MAIN COMMAND================

cmd({
      pattern: "owner",
      alias: ["owner"],
      desc: "Bot owner",
      category: "main",
      react: "👨‍💻",
      filename: __filename
    },
    
    async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try{
          
          // Status message to be sent
          let desc = `╔══╣❍ᴏᴡɴᴇʀ❍╠═══⫸
╠➢ *ᴏᴡɴᴇʀ :* *94721551183 ...*
╠➢ *ᴡʜᴀᴛꜱᴀᴘᴘ ᴄʜᴀɴɴᴇʟ :* *https://whatsapp.com/channel/0029VbAdMtMGk1G1R9Yg2L3x*
╚═════════════════⫸

> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`

          // Sending the image with caption
await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: desc},{quoted: mek });

      } catch (e) {
          console.error(e);
          reply(`*Error:* ${e.message}`);
      }
    });

cmd({
      pattern: "repo",
      alias: ["repo"],
      desc: "Bot github repo",
      category: "main",
      react: "🧨",
      filename: __filename
    },
    
    async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try{
          
          // Status message to be sent
          let desc = `╔══╣❍ʀᴇᴘᴏ❍╠═══⫸
╠➢ *ʀᴇᴘᴏ:* *https://github.com/manisha-Official18/MANISHA-MD*
╠➢ *ᴏᴡɴᴇʀ :* *94721551183 ...*
╠➢ *ᴠᴇʀꜱɪᴏɴ :* *1.0 ...*
╠➢ *ᴡʜᴀᴛꜱᴀᴘᴘ ᴄʜᴀɴɴᴇʟ : https://whatsapp.com/channel/0029VbAdMtMGk1G1R9Yg2L3x*
╚════════════════⫸

> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`

          // Sending the image with caption
await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: desc},{quoted: mek });

      } catch (e) {
          console.error(e);
          reply(`*Error:* ${e.message}`);
      }
    });

cmd({
      pattern: "alive",
      alias: ["online"],
      desc: "Chek Bot Alive",
      category: "main",
      react: "👋",
      filename: __filename
    },
    
    async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try{
          
          // Status message to be sent
          let desc = `╔══╣❍ᴀʟɪᴠᴇ❍╠═══⫸
╠➢ *ᴘᴏᴡᴇʀꜰᴜʟʟ ᴊᴀᴠᴀꜱᴄʀɪᴘᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ...*
╠➢ *ᴏᴡɴᴇʀ : 94721551183 ...*
╠➢ *ᴠᴇʀꜱɪᴏɴ :* *1.0 ...*
╠➢ *ᴡʜᴀᴛꜱᴀᴘᴘ ᴄʜᴀɴɴᴇʟ : https://whatsapp.com/channel/0029VbAdMtMGk1G1R9Yg2L3x*
╚═════════════════⫸

> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`

          // Sending the image with caption
await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: desc},{quoted: mek });

      } catch (e) {
          console.error(e);
          reply(`*Error:* ${e.message}`);
      }
    });

//==========menu==============
cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "main",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuCaption = `╭━━━〔 *ᴍᴀɴɪꜱʜᴀ-ᴍᴅ* 〕━━━┈⊷
┃★╭──────────────
┃★│ 👑 Owner : *ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*
┃★│ ⚙️ Mode : *${config.MODE}*
┃★│ 🔣 Prefix : *${config.PREFIX}*
┃★│ 🏷️ Version : *1.0*
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
╭━━〔 *ᴍᴇɴᴜ ʟɪꜱᴛ* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈│ *1*   📥 *Download Menu*
┃◈│ *2*   😄 *Fun Menu*
┃◈│ *3*   👑 *Owner Menu*
┃◈│ *4*   🤖 *AI Menu*
┃◈│ *5*   🔄 *Convert Menu*
┃◈│ *6*   📌 *Other Menu*
┃◈│ *7*   🏠 *Main Menu*
┃◈│ *8*   🎬 *Movie Menu*
┃◈│ *9*   🛠️ *Tool Menu*
┃◈│ *10*  🔍 *Search Menu*
┃◈│ *11*  ⚙️ *Settings Menu*
┃◈│ *12*  👥 *Group Menu*
┃◈╰───────────┈⊷
╰──────────────┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: menuCaption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

        conn.ev.on("messages.upsert", async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg.message) return;

            const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const senderID = receivedMsg.key.remoteJid;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (isReplyToBot) {
                await conn.sendMessage(senderID, {
                    react: { text: '⬇️', key: receivedMsg.key }
                });

                switch (receivedText.trim()) {
                    case "1":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 📥 *Download Menu*  📥〕━━━┈⊷
┃★╭──────────────
┃★│ • song [name]
┃★│ • video [name]
┃★│ • mp4 [name]
┃★│ • apk [name]
┃★│ • ig [url]
┃★│ • pindl [url]
┃★│ • mediafire [url]
┃★│ • twitter [url]
┃★│ • gdrive [url]
┃★│ • img [query]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "2":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 😄 *Fun Menu* 😄 〕━━━┈⊷
┃★╭──────────────
┃★│ • hack
┃★│ • animegirl
┃★│ • fact
┃★│ • dog
┃★│ • joke
┃★│ • spam
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "3":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 👑 *Owner Menu* 👑 〕━━━┈⊷
┃★╭──────────────
┃★│ • restart
┃★│ • block
┃★│ • unblock
┃★│ • blocklist
┃★│ • setpp
┃★│ • vv
┃★│ • jid
┃★│ • post
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "4":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 🤖 *AI Menu* 🤖 〕━━━┈⊷
┃★╭──────────────
┃★│ • gemini [query]
┃★│ • deepseek [query]
┃★│ • ai [query]
┃★│ • openai [query]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "5":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 🔄 *Convert Menu* 🔄 〕━━━┈⊷
┃★╭──────────────
┃★│ • sticker [image]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "6":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 📌 *Other Menu* 📌 〕━━━┈⊷
┃★╭──────────────
┃★│ • githubstalk [username]
┃★│ • twitterxstalki [username]
┃★│ • trt
┃★│ • weather
┃★│ • tts
┃★│ • vcc 
┃★│ • newsletter
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "7":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 🏠 *Main Menu* 🏠 〕━━━┈⊷
┃★╭──────────────
┃★│ • alive
┃★│ • owner
┃★│ • allmenu
┃★│ • repo
┃★│ • ping
┃★│ • system
┃★│ • runtime
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "8":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔🎬 *Movie Menu* 🎬 〕━━━┈⊷
┃★╭──────────────
┃★│ • sinhalasub [name]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "9":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 🛠️ *Tool Menu* 🛠️〕━━━┈⊷
┃★╭──────────────
┃★│ • gitclone [repo link]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    case "10":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 🔍 *Search Menu* 🔍〕━━━┈⊷
┃★╭──────────────
┃★│ • yts
┃★│ • mvs
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;
                        
                     case "11":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 ⚙️ *Settings Menu* ⚙️ 〕━━━┈⊷
┃★╭──────────────
┃★│ • settings
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;
                        
                     case "12":
                        await conn.sendMessage(senderID, {
                            text: `╭━━━〔 👥 *Group Menu* 👥 〕━━━┈⊷
┃★╭──────────────
┃★│ • mute
┃★│ • unmute
┃★│ • lock
┃★│ • unlock
┃★│ • archive
┃★│ • unarchive
┃★│ • kickall
┃★│ • promote
┃★│ • demote
┃★│ • acceptall
┃★│ • rejectall
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
                        }, { quoted: receivedMsg });
                        break;

                    default:
                        await conn.sendMessage(senderID, {
                            text: "❌ Invalid option! Please reply with a valid number from *1 to 11*."
                        }, { quoted: receivedMsg });
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
        reply("❌ An error occurred while processing your request. Please try again.");
    }
});

//==========ALL MENU=================
cmd({
      pattern: "allmenu",
      alias: ["panel"],
      desc: "Get Bot Menu",
      category: "main",
      react: "📁",
      filename: __filename
}, async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
let menu = {
download: '',
ai: '',
main: '',
owner: '',
fun: '',
search: '',
Convert: '',
other: '',
tool: '',
movie: '',
settings: ''
};

for (let i = 0; i < commands.length; i++) {
if (commands[i].pattern && !commands[i].dontAddCommandList) {
menu[commands[i].category] += `.${commands[i].pattern}\n`;
 }
}
   

let desc = `╔══╣❍ᴀʟʟ ᴍᴇɴᴜ❍╠═══⫸
╠➢ *ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}*
╠➢ *ʀᴀᴍ ᴜꜱᴀɢᴇ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB*
╠➢ *ᴘʟᴀᴛꜰᴏʀᴍ : ${os.hostname()}*
╠➢ *ᴠᴇʀꜱɪᴏɴ : 1.0*
╚══════════════⫸
╔════════════════⫸
 📥 *Download Menu*
 ──────
 ${menu.download}
 
 👑 *Owner Menu*
 ──────
 ${menu.owner}
 
 🤖 *AI Menu*
 ──────
 ${menu.ai}
 
 🏠 *Main Menu*
 ──────
 ${menu.main}
 
 😄 *Fun Menu*
 ──────
 ${menu.fun}
 
 🔍 *Search Menu*
 ──────
 ${menu.search}
 
 🔄 *Convert Menu*
 ──────
 ${menu.convert}
 
 📌 *Other Menu*
 ──────
 ${menu.other}
 
 🛠️ *Tool Menu*
 ──────
 ${menu.tool}
 
 🎬 *movie Menu*
 ──────
 ${menu.movie}
 
 ⚙️ *settings menu*
 ──────
 ${menu.settings}
╚═════════════════⫸

> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`

await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: desc},{quoted: mek});

 } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);

cmd({
    pattern: "system",
    react: "♠️",
    alias: ["uptime","status","runtime"],
    desc: "cheack uptime",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let status = `╔══╣❍ꜱʏꜱᴛᴇᴍ❍╠═══⫸
╠➢ *ᴜᴘᴛɪᴍᴇ :* ${runtime(process.uptime())}
╠➢ *ʀᴀᴍ ᴜꜱᴀɢᴇ :* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
╠➢ *ʜᴏꜱᴛɴᴀᴍᴇ :* ${os.hostname()}
╚════════════════⫸
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`
await conn.sendMessage(from,{image:{url: config.ALIVE_IMG},caption:`${status}`},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})

cmd({
    pattern: "ping",
    alias: ["speed"],
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: `*MANISHA-MD SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`},{quoted: mek});
        
    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
      pattern: "runtime",
      desc: "Chek Bot Runtime",
      category: "main",
      react: "⏰",
      filename: __filename
    }, async (conn, mek, m, { from, reply }) => {
      try {
      
      let desc = `╔══╣❍ʀᴜɴᴛɪᴍᴇ❍╠═══⫸\n╠➢ *🚀 ʀᴜɴᴛɪᴍᴇ :* ${runtime(process.uptime())}\n╚═════════════════⫸\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`

          // Sending the image with caption
          await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: desc},{quoted: mek});
          
      } catch (e) {
          console.error(e);
          reply(`*Error:* ${e.message}`);
      }
    });
    

//================AI COMMAND===================
cmd({
  pattern: "gemini",
  alias: ["ai","chatgpt"],
  react: '🤖',
  desc: "Ask anything to Google Gemini AI.",
  category: "ai",
  use: ".gemini <Your Quoestion>",
  filename: __filename
}, async (conn, mek, msg, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    const text = args.join(" ");
    if (!text) {
      return reply(`❗️ Please GFive Me A Question`);
    }

    const prompt = `my name is ${pushname}, Your name is manisha AI. you are a WhatsApp AI Bot. you were made by මනිෂ coder. answer in the language the person talking to you speak. Answer in a way that doesn't sound like you're a bot. think you are human and answer. Use meaningful emojis. my question is: ${text}`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await axios.post(
      GEMINI_API_URL,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.candidates || !response.data.candidates[0]?.content?.parts) {
      return reply("❌ error in the answer. 😢");
    }
    
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    await reply(`${aiResponse}`);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    reply("❌ Error in the quation 😢");
  }
});


cmd({
    pattern: "ai",
    alias: ["bot", "dj", "gpt", "gpt4", "bing"],
    desc: "Chat with an AI model",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for the AI.\nExample: `.ai Hello`");

        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`🤖 *AI Response:*\n\n${data.message}`);
        await react("✅");
    } catch (e) {
        console.error("Error in AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with the AI.");
    }
});
//============OTHER COMMAND==================
cmd({
    pattern: "vcc",
    desc: "🎴 Generate Virtual Credit Cards (VCCs)",
    react: "💳",
    category: "other",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    const apiUrl = `https://api.siputzx.my.id/api/tools/vcc-generator?type=MasterCard&count=5`;

    try {
        const response = await axios.get(apiUrl);
        const result = response.data;

        if (!result.status || !result.data || result.data.length === 0) {
            return reply("❌ Unable to generate VCCs. Please try again later.");
        }

        let responseMessage = `🎴 *Generated VCCs* (Type: Mastercard, Count: 5):\n\n`;

        result.data.forEach((card, index) => {
            responseMessage += `#️⃣ *Card ${index + 1}:*\n`;
            responseMessage += `🔢 *Card Number:* ${card.cardNumber}\n`;
            responseMessage += `📅 *Expiration Date:* ${card.expirationDate}\n`;
            responseMessage += `🧾 *Cardholder Name:* ${card.cardholderName}\n`;
            responseMessage += `🔒 *CVV:* ${card.cvv}\n\n`;
        });

        return reply(responseMessage);
    } catch (error) {
        console.error("Error fetching VCC data:", error);
        return reply("❌ An error occurred while generating VCCs. Please try again later.");
    }
});

cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a city name. Usage: .weather [city name]");
        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
        const city = q;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;
        const weather = `╔══╣❍ᴡᴇᴀᴛʜᴇʀ❍╠═══⫸
🌍 *ᴡᴇᴀᴛʜᴇʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ ꜰᴏʀ ${data.name}, ${data.sys.country}* 🌍
🌡️ *ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴇ*: ${data.main.temp}°C
🌡️ *ꜰᴇᴇʟꜱ ʟɪᴋᴇ*: ${data.main.feels_like}°C
🌡️ *ᴍɪɴ ᴛᴇᴍᴘ*: ${data.main.temp_min}°C
🌡️ *ᴍᴀx ᴛᴇᴍᴘ*: ${data.main.temp_max}°C
💧 *ʜᴜᴍɪᴅɪᴛʏ*: ${data.main.humidity}%
☁️ *ᴡᴇᴀᴛʜᴇʀ*: ${data.weather[0].main}
🌫️ *ꜱᴇꜱᴄʀɪᴘᴛɪᴏɴ*: ${data.weather[0].description}
💨 *ᴡɪɴᴅ ꜱᴘᴇᴇᴅ*: ${data.wind.speed} m/s
🔽 *ᴘʀᴇꜱꜱᴜʀᴇ*: ${data.main.pressure} hPa
╚═══════════════════⫸
> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;
        return reply(weather);
    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 City not found. Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the weather information. Please try again later.");
    }
});

cmd({
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "other",
    react: "📚",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("Please provide a GitHub username.");
        }

        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `╔══╣❍ɢɪᴛʜᴜʙꜱᴛᴀʀʟᴋ❍╠═══⫸
👤 *ᴜꜱᴇʀ ɴᴀᴍᴇ*: ${data.name || data.login}

🔗 *ɢɪᴛʜᴜʙ ᴜʀʟ*:(${data.html_url})

📝 *ʙɪᴏ*: ${data.bio || 'Not available'}

🏙️ *ʟᴏᴄᴀᴛɪᴏɴ*: ${data.location || 'Unknown'}

📊 *ᴘᴜʙʟɪᴄ ʀᴇᴘᴏ*: ${data.public_repos}

👥 *ꜰᴏʟʟᴏᴡᴇʀꜱ*: ${data.followers} | Following: ${data.following}

📅 *ᴄʀᴇᴀᴛʀᴅ ᴅᴀᴛᴇ*: ${new Date(data.created_at).toDateString()}

🔭 *ᴘᴜʙʟɪᴄ ɢɪꜱᴛꜱ*: ${data.public_gists}

╚═══════════════════⫸

> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

        await conn.sendMessage(from, { image: { url: data.avatar_url }, caption: userInfo }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error fetching data🤕: ${e.response ? e.response.data.message : e.message}`);
    }
});

cmd({
  pattern: "twitterxstalk",
  alias: ["twitterstalk", "twtstalk"],
  desc: "Get details about a Twitter/X user.",
  react: "🔍",
  category: "other",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Twitter/X username.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const apiUrl = `https://delirius-apiofc.vercel.app/tools/xstalk?username=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.status || !data.data) {
      return reply("⚠️ Failed to fetch Twitter/X user details. Ensure the username is correct.");
    }

    const user = data.data;
    const verifiedBadge = user.verified ? "✅" : "❌";

    const caption = `╔══╣❍ᴛᴡɪᴛᴛᴇʀ/xꜱᴛᴀʟᴋ❍╠═══⫸\n`
      + `╠➢👤 *ɴᴀᴍᴇ:* ${user.name}\n`
      + `╠➢🔹 *ᴜꜱᴇʀɴᴀᴍᴇ:* @${user.username}\n`
      + `╠➢✔️ *ᴠᴇʀɪꜰɪᴇᴅ:* ${verifiedBadge}\n`
      + `╠➢👥 *ꜰᴏʟʟᴏᴡᴇʀꜱ:* ${user.followers_count}\n`
      + `╠➢👤 *ꜰᴏʟʟᴏᴡɪɴɢ:* ${user.following_count}\n`
      + `╠➢📝 *ᴛᴡᴇᴇᴛꜱ:* ${user.tweets_count}\n`
      + `╠➢📅 *ᴊᴏɪɴ:* ${user.created}\n`
      + `╠➢🔗 *ᴘʀᴏꜰɪʟᴇ:* [Click Here](${user.url})\n`
      + `╚══════════════════⫸\n\n`
      + `> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

    await conn.sendMessage(from, {
      image: { url: user.avatar },
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});


cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages",
    react: "⚡",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) return reply("❗ Please provide a language code and text. Usage: .translate [language code] [text]");

        const targetLang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;

        const response = await axios.get(url);
        const translation = response.data.responseData.translatedText;

        const translationMessage = `╔══╣❍ᴛʀᴀɴꜱʟᴀᴛᴇᴅ❍╠═══⫸
╠➢*ᴏʀɪɢɪɴᴀʟ*: ${textToTranslate}
╠➢*ᴛʀᴀɴꜱʟᴀᴛᴇᴅ*: ${translation}
╠➢*ʟᴀɴɢᴜᴀɢᴇ*: ${targetLang.toUpperCase()}
╚════════════════════⫸

> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

        return reply(translationMessage);
    } catch (e) {
        console.log(e);
        return reply("⚠️ An error occurred data while translating the your text. Please try again later🤕");
    }
});


cmd({
    pattern: "tts",
    desc: "download songs",
    category: "other",
    react: "👧",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("Need some text.")
    const url = googleTTS.getAudioUrl(q, {
  lang: 'hi-IN',
  slow: false,
  host: 'https://translate.google.com',
})
await conn.sendMessage(from, { audio: { url: url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek })
    }catch(a){
reply(`${a}`)
}
})

cmd({
  pattern: "newsletter",
  alias: ["cjid", "id"],
  react: "📡",
  desc: "Get WhatsApp Channel info from link",
  category: "other",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
  try {
    if (!q)
      return reply(`❎ *Please provide a WhatsApp Channel link.*\n\n📌 *Example:*\n.newsletter https://whatsapp.com/channel/xxxxxxxxxx`);

    const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match)
      return reply(`⚠️ *Invalid channel link!*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx`);

    const inviteId = match[1];
    let metadata;

    try {
      metadata = await conn.newsletterMetadata("invite", inviteId);
    } catch {
      return reply("🚫 *Failed to fetch channel info.*\nDouble-check the link and try again.");
    }

    if (!metadata?.id)
      return reply("❌ *Channel not found or inaccessible.*");

    const infoText = `
╔══╣❍ɴᴇᴡꜱʟᴇᴛᴛᴇʀ❍╠═══⫸
╠➢ 🔖 *ID:* ${metadata.id}
╠➢ 🗂️ *Name:* ${metadata.name}
╠➢ 👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}
╠➢ 🗓️ *Created:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("id-ID") : "Unknown"}
╚════════════════════════⫸
`;

    if (metadata.preview) {
      await conn.sendMessage(from, {
        image: { url: `https://pps.whatsapp.net${metadata.preview}` },
        caption: infoText
      }, { quoted: m });
    } else {
      reply(infoText);
    }

  } catch (err) {
    console.error("❌ Newsletter Error:", err);
    reply("⚠️ *An unexpected error occurred while fetching the channel info.*");
  }
});

cmd({
  pattern: "bug",
  alias: ["reportbug", "bugreport"],
  desc: "Report a bug to the bot owner",
  category: "other",
  react: "🐞",
  filename: __filename
},
async (conn, mek, m, {
  from,
  q,
  pushname,
  sender,
  reply,
  isOwner
}) => {
  try {
    if (!q) return reply("❗ *Please describe the bug.*\n\n📌 Example:\n.bug The .play command is not working properly.");

    const ownerNumber = ["94721551183@s.whatsapp.net"]; // ⬅️ Replace with your number or multiple owners

    const bugMsg = `*🐞 Bug Report Received!*\n\n` +
                   `👤 *From:* ${pushname} (${sender.split("@")[0]})\n` +
                   `🌐 *Chat:* ${from.endsWith("@g.us") ? "Group" : "Private"}\n` +
                   `📝 *Message:*\n${q}`;

    // Send the bug message to each owner
    for (let admin of ownerNumber) {
      await conn.sendMessage(admin, { text: bugMsg });
    }

    // Confirmation to sender
    reply("✅ *Bug report sent successfully!*\nThank you for your feedback. 🛠️");

  } catch (e) {
    console.error(e);
    reply(`❌ *Error:* ${e.message}`);
  }
});

//===================TOOL COMMAND===========
cmd({
    pattern: "gitclone",
    desc: "Download a GitHub repository as a ZIP file.",
    category: "tool",
    react: "🕊️",
    use: "<github_link>",
    filename: __filename
}, 
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Where is the link?\nExample:\n.gitclone repolink");

        if (!q.includes("github.com")) return reply("Invalid GitHub link!");

        let match = q.match(/(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i);
        if (!match) return reply("Invalid GitHub link format!");

        let [, owner, repo] = match;
        repo = repo.replace(/.git$/, '');
        let zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;

        let response = await fetch(zipUrl, { method: "HEAD" });
        let filename = response.headers.get("content-disposition").match(/attachment; filename=(.*)/)[1];

        await conn.sendMessage(from, {
            document: { url: zipUrl },
            fileName: filename + ".zip",
            mimetype: "application/zip"
        }, { quoted: mek });

    } catch (error) {
        console.error("GitClone Error:", error);
        reply("An error occurred while downloading the repository.");
    }
});

//=============
cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: '.yts ',
    react: "🔎",
    desc: "Search and get details from youtube.",
    category: "search",
    filename: __filename

},

async(conn, mek, m,{from, l, quoted, body, isCmd, umarmd, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply('*Please give me words to search*')
try {
let yts = require("yt-search")
var arama = await yts(q);
} catch(e) {
    l(e)
return await conn.sendMessage(from , { text: '*Error !!*' }, { quoted: mek } )
}
var mesaj = '';
arama.all.map((video) => {
mesaj += ' *🖲️' + video.title + '*\n🔗 ' + video.url + '\n\n'
});
await conn.sendMessage(from , { text:  mesaj }, { quoted: mek } )
} catch (e) {
    l(e)
  reply('*Error !!*')
}
});

cmd({
    pattern: "mvs",
    desc: "Fetch detailed information about a movie.",
    category: "search",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const movieName = args.join(' ');
        if (!movieName) {
            return reply("📽️ ρℓєαѕє ρяσνι∂є тнє ηαмє σƒ тнє мσνιє.");
        }

        const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${config.OMDB_API_KEY}`;
        const response = await axios.get(apiUrl);

        const data = response.data;
        if (data.Response === "False") {
            return reply("🚫 Movie not found.");
        }

        const movieInfo = `╔══╣❍ᴍᴏᴠɪᴇ ɪɴꜰᴏ❍╠═══⫸
╠➢🎥 *ᴛɪᴛʟᴇ:* ${data.Title}
╠➢📅 *ʏᴇᴀʀ:* ${data.Year}
╠➢🌟 *ʀᴀᴛᴇᴅ:* ${data.Rated}
╠➢📆 *ʀᴇʟᴇᴀꜱᴇᴅ:* ${data.Released}
╠➢⏳ *ʀᴜɴᴛɪᴍᴇ:* ${data.Runtime}
╠➢🎭 *ɢᴇɴʀᴇ:* ${data.Genre}
╠➢🎬 *ᴅɪʀᴇᴄᴛᴏʀ:* ${data.Director}
╠➢✍️ *ᴡʀɪᴛᴇʀ:* ${data.Writer}
╠➢🎭 *ᴀᴄᴛᴏʀꜱ:* ${data.Actors}
╠➢📝 *ᴘʟᴏᴛ:* ${data.Plot}
╠➢🌍 *ʟᴀɴɢᴜᴀɢᴇ:* ${data.Language}
╠➢🇺🇸 *ᴄᴏᴜɴᴛʀʏ:* ${data.Country}
╠➢🏆 *ᴀᴡᴀʀᴅꜱ:* ${data.Awards}
╠➢⭐ *ɪᴍᴅʙ ʀᴀᴛɪɴɢ:* ${data.imdbRating}
╠➢🗳️ *ɪᴍᴅʙ ᴠᴏᴛᴇꜱ:* ${data.imdbVotes}
╚═══════════════════⫸
`;

        // Define the image URL
        const imageUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : config.ALIVE_IMG;

        // Send the movie information along with the poster image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `${movieInfo}\n> *ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ єяяσя: ${e.message}`);
    }
});

//===============FUN COMMAND============
cmd({
    pattern: "animegirl",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "👩‍🦰",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { image: { url: data.url }, caption: '*MANISHA-MD RANDOM ANIME GIRL IMAGES* ♥️\n\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime girl image*: ${e.message}`);
    }
});


cmd({
    pattern: "dog",
    desc: "Fetch a random dog image.",
    category: "fun",
    react: "🐶",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://dog.ceo/api/breeds/image/random`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { image: { url: data.message }, caption: 'MANISHA-MD DOWNLOAD DOG IMAGE\n\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error Fetching Dog Image: ${e.message}`);
    }
});

cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke || !joke.setup || !joke.punchline) {
      return reply("❌ Failed to fetch a joke. Please try again.");
    }

    const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

    return reply(jokeMessage);
  } catch (error) {
    console.error("❌ Error in joke command:", error);
    return reply("⚠️ An error occurred while fetching the joke. Please try again.");
  }
});

cmd({
  pattern: "fact",
  desc: "🧠 Get a random fun fact",
  react: "🧠",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    const fact = response.data.text;

    if (!fact) {
      return reply("❌ Failed to fetch a fun fact. Please try again.");
    }

    const factMessage = `🧠 *Random Fun Fact* 🧠\n\n${fact}\n\nIsn't that interesting? 😄\n\n> _*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

    return reply(factMessage);
  } catch (error) {
    console.error("❌ Error in fact command:", error);
    return reply("⚠️ An error occurred while fetching a fun fact. Please try again later.");
  }
});

cmd({
    pattern: "hack",
    desc: "Displays a dynamic and playful 'Hacking' message for fun.",
    category: "fun",
    react: "👨‍💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const steps = [
            '💻 *MANISHA-MD HACK STARTING...* 💻',
            '',
            '*Initializing hacking tools...* 🛠️',
            '*Connecting to remote servers...* 🌐',
            '',
            '```[██████████] 10%``` ⏳'                                            ,
            '```[████████████████████] 20%``` ⏳'                                   ,
            '```[██████████████████████████████] 30%``` ⏳'                               ,
            '```[████████████████████████████████████████] 40%``` ⏳'                            ,
            '```[██████████████████████████████████████████████████] 50%``` ⏳'                       ,
            '```[████████████████████████████████████████████████████████████] 60%``` ⏳'                 ,
            '```[██████████████████████████████████████████████████████████████████████] 70%``` ⏳'            ,
            '```[████████████████████████████████████████████████████████████████████████████████] 80%``` ⏳'        ,
            '```[██████████████████████████████████████████████████████████████████████████████████████████] 90%``` ⏳'    ,
            '```[████████████████████████████████████████████████████████████████████████████████████████████████████] 100%``` ✅',
            '',
            '🔒 *System Breach: Successful!* 🔓',
            '🚀 *Command Execution: Complete!* 🎯',
            '',
            '*📡 Transmitting data...* 📤',
            '*🕵️‍♂️ Ensuring stealth...* 🤫',
            '*🔧 Finalizing operations...* 🏁',
            '*🔧 Awais Get Your All Data...* 🎁',
            '',
            '⚠️ *Note:* All actions are for demonstration purposes only.',
            '⚠️ *Reminder:* Ethical hacking is the only way to ensure security.',
            '⚠️ *Reminder:* Strong hacking is the only way to ensure security.',
            '',
            ' * YOUR DATA HACK SUCCESSFULLY*'
        ];

        for (const line of steps) {
            await conn.sendMessage(from, { text: line }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay as needed
        }
    } catch (e) {
        console.log(e);
        reply(`❌ *Error!* ${e.message}`);
    }
});

cmd(
  {
    pattern: "spam",
    alias: ["repeat", "spammsg"],
    desc: "Repeat a message multiple times",
    category: "fun",
    filename: __filename,
  },
  async (conn, mek, m, { from, args, reply }) => {
    try {
      if (args.length < 2) {
        return reply("❎ Usage: .spam <count> <message>");
      }

      const count = parseInt(args[0]);

      if (isNaN(count) || count < 1 || count > 50) {
        return reply("❎ Please provide a valid number between 1 and 50.");
      }

      const message = args.slice(1).join(" ");

      for (let i = 0; i < count; i++) {
        await conn.sendMessage(from, { text: message }, { quoted: mek });
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay to prevent ban
      }
    } catch (e) {
      console.error(e);
      reply("❌ Error occurred: " + (e.message || e));
    }
  }
);

cmd({
    pattern: "ringtone",
    alias: ["ringtones", "ring"],
    desc: "Get a random ringtone from the API.",
    react: "🎵",
    category: "fun",
    filename: __filename,
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("Please provide a search query! Example: .ringtone Suna");
        }

        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`);

        if (!data.status || !data.result || data.result.length === 0) {
            return reply("No ringtones found for your query. Please try a different keyword.");
        }

        const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

        await conn.sendMessage(
            from,
            {
                audio: { url: randomRingtone.dl_link },
                mimetype: "audio/mpeg",
                fileName: `${randomRingtone.title}.mp3`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error in ringtone command:", error);
        reply("Sorry, something went wrong while fetching the ringtone. Please try again later.");
    }
});


//==================CONVERT COMMAND====================

cmd(
  {
    pattern: "sticker",
    alias: ["s", "stick"],
    react: '🔃',
    desc: "Convert an image to a sticker",
    category: "convert",
    filename: __filename,
  },
  async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner,  groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, }  ) => {
    try {
      // Ensure the message contains an image or video to convert to a sticker
      if (!quoted || !(quoted.imageMessage || quoted.videoMessage)) {
        return reply(
          "Please reply to an image or video to convert it to a sticker."
        );
      }

      // Download the media from the quoted message
      const media = await downloadMediaMessage(quoted, "stickerInput");
      if (!media) return reply("Failed to download the media. Try again!");

      // Create the sticker from the media
      const sticker = new Sticker(media, {
        pack: "MANISHA-MD", // Sticker pack name
        author: "MANISHA-MD", // Sticker author name
        type: StickerTypes.FULL, // Sticker type (FULL or CROPPED)
        quality: 50, // Quality of the output sticker (0–100)
      });

      const buffer = await sticker.toBuffer();
      await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply(`Error: ${e.message || e}`);
    }
  }
);

cmd({
  pattern: "npm",
  desc: "Search for a package on npm.",
  react: '📦',
  category: "convert",
  filename: __filename,
  use: ".npm <package-name>"
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    // Check if a package name is provided
    if (!args.length) {
      return reply("Please provide the name of the npm package you want to search for. Example: .npm express");
    }

    const packageName = args.join(" ");
    const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    // Fetch package details from npm registry
    const response = await axios.get(apiUrl);
    if (response.status !== 200) {
      throw new Error("Package not found or an error occurred.");
    }

    const packageData = response.data;
    const latestVersion = packageData["dist-tags"].latest;
    const description = packageData.description || "No description available.";
    const npmUrl = `https://www.npmjs.com/package/${packageName}`;
    const license = packageData.license || "Unknown";
    const repository = packageData.repository ? packageData.repository.url : "Not available";

    // Create the response message
    const message = `╔══╣❍ɴᴘᴍ ꜱᴇᴀʀᴄʜ❍╠═══⫸
╠➢*🔰 ɴᴘᴍ ᴘᴀᴄᴋᴀɢᴇ:* ${packageName}
╠➢*📄 ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ:* ${description}
╠➢*⏸️ ʟᴀꜱᴛ ᴠᴇʀꜱɪᴏɴ:* ${latestVersion}
╠➢*🪪 ʟɪᴄᴇɴꜱᴇ:* ${license}
╠➢*🪩 ʀᴇᴘᴏꜱɪᴛᴏʀʏ:* ${repository}
╠➢*🔗 ɴᴘᴍ ᴜʀʟ:* ${npmUrl}
╚═══════════════════⫸
_*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍᴀɴɪꜱʜᴀ ᴄᴏᴅᴇʀ*_`;

    // Send the message
    await conn.sendMessage(from, { text: message }, { quoted: mek });

  } catch (error) {
    console.error("Error:", error);

    // Send detailed error logs to WhatsApp
    const errorMessage = `
*❌ NPM Command Error Logs*

*Error Message:* ${error.message}
*Stack Trace:* ${error.stack || "Not available"}
*Timestamp:* ${new Date().toISOString()}
`;

    await conn.sendMessage(from, { text: errorMessage }, { quoted: mek });
    reply("An error occurred while fetching the npm package details.");
  }
});

//==================GROUP COMMAND=======================
const ONLGROUP = "🛑 This command only works in groups."
const ADMIN = "🛑 You must be a group admin to use this command."
const botAdmin = "🛑 I need to be an admin to do that."

// MUTE
cmd({
    pattern: "mute",
    react: "🔇",
    desc: "Close group (only admins can send messages)",
    category: "group",
    use: '.mute',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply(ONLGROUP)
    if (!isBotAdmins) return reply(botAdmin)
    if (!isAdmins) return reply(ADMIN)
    await conn.groupSettingUpdate(from, 'announcement')
    await conn.sendMessage(from, { text: "🔇 Group has been muted. Only admins can send messages." })
})

// UNMUTE
cmd({
    pattern: "unmute",
    react: "🔊",
    desc: "Open group (all members can send messages)",
    category: "group",
    use: '.unmute',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply(ONLGROUP)
    if (!isBotAdmins) return reply(botAdmin)
    if (!isAdmins) return reply(ADMIN)
    await conn.groupSettingUpdate(from, 'not_announcement')
    await conn.sendMessage(from, { text: "🔊 Group has been unmuted." })
})

// LOCK
cmd({
    pattern: "lock",
    react: "🔐",
    desc: "Lock group (only admins can send)",
    category: "group",
    use: '.lock',
    filename: __filename
}, async (conn, mek, m, args) => {
    const { from, isGroup, isBotAdmins, isAdmins, reply } = args
    if (!isGroup) return reply(ONLGROUP)
    if (!isBotAdmins) return reply(botAdmin)
    if (!isAdmins) return reply(ADMIN)
    await conn.groupSettingUpdate(from, 'announcement')
    await conn.sendMessage(from, { text: "🔐 Group has been locked." })
})

// UNLOCK
cmd({
    pattern: "unlock",
    react: "🔓",
    desc: "Unlock group",
    category: "group",
    use: '.unlock',
    filename: __filename
}, async (conn, mek, m, args) => {
    const { from, isGroup, isBotAdmins, isAdmins, reply } = args
    if (!isGroup) return reply(ONLGROUP)
    if (!isBotAdmins) return reply(botAdmin)
    if (!isAdmins) return reply(ADMIN)
    await conn.groupSettingUpdate(from, 'not_announcement')
    await conn.sendMessage(from, { text: "🔓 Group has been unlocked." })
})

// ARCHIVE
cmd({
    pattern: "archive",
    react: "📦",
    desc: "Archive group chat",
    category: "group",
    use: '.archive',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await conn.chatModify({ archive: true, lastMessages: [{ key: mek.key }] }, from)
    reply("📦 Group has been archived.")
})

// UNARCHIVE
cmd({
    pattern: "unarchive",
    react: "📂",
    desc: "Unarchive group chat",
    category: "group",
    use: '.unarchive',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await conn.chatModify({ archive: false, lastMessages: [{ key: mek.key }] }, from)
    reply("📂 Group has been unarchived.")
})

// KICKALL
cmd({
    pattern: "kickall",
    react: "🥾",
    desc: "Kick all non-admins from group",
    category: "group",
    use: '.kickall',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, participants, groupAdmins, reply }) => {
    if (!isGroup) return reply(ONLGROUP)
    if (!isBotAdmins) return reply(botAdmin)
    if (!isAdmins) return reply(ADMIN)
    let targets = participants.filter(p => !groupAdmins.includes(p.id)).map(p => p.id)
    if (targets.length === 0) return reply("✅ No non-admins to kick.")
    await conn.groupParticipantsUpdate(from, targets, 'remove')
    reply("🥾 All non-admins have been removed.")
})

// PROMOTE
cmd({
    pattern: "promote",
    react: "⬆️",
    desc: "Promote user to admin",
    category: "group",
    use: '.promote @user',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, quoted, mentionByTag, reply }) => {
    if (!isGroup) return reply(ONLGROUP)
    if (!isBotAdmins) return reply(botAdmin)
    if (!isAdmins) return reply(ADMIN)
    let user = mentionByTag[0] || quoted?.sender
    if (!user) return reply("🧑 Please tag or reply to the user to promote.")
    await conn.groupParticipantsUpdate(from, [user], "promote")
    reply("✅ User has been promoted.")
})

// DEMOTE
cmd({
    pattern: "demote",
    react: "⬇️",
    desc: "Demote admin to member",
    category: "group",
    use: '.demote @user',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, quoted, mentionByTag, reply }) => {
    if (!isGroup) return reply(ONLGROUP)
    if (!isBotAdmins) return reply(botAdmin)
    if (!isAdmins) return reply(ADMIN)
    let user = mentionByTag[0] || quoted?.sender
    if (!user) return reply("🧑 Please tag or reply to the user to demote.")
    await conn.groupParticipantsUpdate(from, [user], "demote")
    reply("✅ User has been demoted.")
})

// Command to list all pending group join requests
cmd({
    pattern: "requestlist",
    desc: "Shows pending group join requests",
    category: "group",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ This command can only be used in groups.");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ Only group admins can use this command.");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ I need to be an admin to view join requests.");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: 'ℹ️', key: m.key }
            });
            return reply("ℹ️ No pending join requests.");
        }

        let text = `📋 *Pending Join Requests (${requests.length})*\n\n`;
        requests.forEach((user, i) => {
            text += `${i+1}. @${user.jid.split('@')[0]}\n`;
        });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });
        return reply(text, { mentions: requests.map(u => u.jid) });
    } catch (error) {
        console.error("Request list error:", error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        return reply("❌ Failed to fetch join requests.");
    }
});

// Command to accept all pending join requests
cmd({
    pattern: "acceptall",
    desc: "Accepts all pending group join requests",
    category: "group",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ This command can only be used in groups.");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ Only group admins can use this command.");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ I need to be an admin to accept join requests.");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: 'ℹ️', key: m.key }
            });
            return reply("ℹ️ No pending join requests to accept.");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "approve");
        
        await conn.sendMessage(from, {
            react: { text: '👍', key: m.key }
        });
        return reply(`✅ Successfully accepted ${requests.length} join requests.`);
    } catch (error) {
        console.error("Accept all error:", error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        return reply("❌ Failed to accept join requests.");
    }
});

// Command to reject all pending join requests
cmd({
    pattern: "rejectall",
    desc: "Rejects all pending group join requests",
    category: "group",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ This command can only be used in groups.");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ Only group admins can use this command.");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ I need to be an admin to reject join requests.");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: 'ℹ️', key: m.key }
            });
            return reply("ℹ️ No pending join requests to reject.");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "reject");
        
        await conn.sendMessage(from, {
            react: { text: '👎', key: m.key }
        });
        return reply(`✅ Successfully rejected ${requests.length} join requests.`);
    } catch (error) {
        console.error("Reject all error:", error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        return reply("❌ Failed to reject join requests.");
    }
});

cmd({
    pattern: "settings2",
    react: "⚙️",
    desc: "Shows bot settings list.",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isAdmins, reply, prefix
}) => {
    try {
        if (!isOwner) return reply("⛔️ You are not allowed to use this command!");

      
        let buttons = [
            {
                buttonId: `.system`,
                buttonText: { displayText: "🔧 System" },
                type: 1,
            },
            {
                buttonId: `.ping`,
                buttonText: { displayText: "📶 Ping" },
                type: 1,
            },
        ];

        let buttonMessage = {
            image: { url: Config.ALIVE_IMG},
            caption: `
⦁──HASI-MD Settings──⦁

1️⃣ Anti Link: .setvar ANTILINK:true/false  
2️⃣ Auto Reaction: .setvar AUTO_REACTION:true/false  
3️⃣ Auto Status Saver: .setvar AUTO_STATUS_SAVER:true/false  
4️⃣ MongoDB URI: .setvar MONGODB_URI:your_mongodb_url  
5️⃣ OpenAI API Key: .setvar OPENAI_API_KEY:key  
6️⃣ Owner Number: .setvar OWNER_NUMBER:94xxxxxxxxx  
7️⃣ Prefix: .setvar PREFIX:.  
8️⃣ Work Type: .setvar WORKTYPE:public/private

...and more environment variables.

© Hasi-MD V1.1
`,
            footer: "🤖 manisha Bot System",
            buttons: buttons,
            headerType: 4
        };

        return await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        return reply(`❌ An error occurred: ${e}`);
    }
});
//============= module.exports simble===================
};
//========================================================