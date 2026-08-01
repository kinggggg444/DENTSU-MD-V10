<div align="center">

<img src="https://raw.githubusercontent.com/kinggggg444/DENTSU-MD-V10/main/assets/dentsu-md-v10-banner.jpg" alt="DENTSU MD V10" width="100%" style="border-radius:16px; max-width:800px"/>

# 🤖 DENTSU MD V10

**WhatsApp Multi-Session Bot • 200+ Commands • by NatsuTech's 🇨🇬**

[![WhatsApp Channel](https://img.shields.io/badge/📢_WhatsApp_Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VbC1s7fFnSz1YhZYc01h)
[![Telegram Channel](https://img.shields.io/badge/✈️_Telegram_Channel-0088cc?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/DPLOIEMENT_DUN_BOT2)
[![Telegram Contact](https://img.shields.io/badge/💬_Telegram_Contact-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/Natsu_or_Dentsu)
[![YouTube](https://img.shields.io/badge/▶️_YouTube_Tutorials-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@Natsu-ras)

</div>

---

## 📋 About

**DENTSU MD V10** is a professional multi-session WhatsApp bot developed by **NatsuTech's 🇨🇬**. It supports 200+ commands covering AI, downloading, games, group management, and much more. Connect without a QR code using the **Pairing Code** system.

| Field | Value |
|---|---|
| **Name** | DENTSU MD V10 |
| **Developer** | NatsuTech's 🇨🇬 |
| **Version** | V10.0 |
| **Prefix** | `.` |
| **Mode** | Public |
| **Multi-Session** | 50 max |
| **Connection** | Pairing Code (no QR) |

---

## ⚡ Quick Deploy

### 🚂 Option 1 — Railway (Recommended)

**1. Fork this repo**

Click **Fork** at the top right to get your own copy.

**2. New Railway project**

1. Go to [railway.com](https://railway.com) → **New Project → Deploy from GitHub**
2. Select your fork `DENTSU-MD-V10`
3. Railway auto-detects the `railway.json` ✅

**3. Environment variables**

In Railway → Variables, add:

```env
BOT_NAME=DENTSU MD V10
DEV_NAME=NatsuTech's 🇨🇬
PREFIX=.
MODE=public
OWNER_NUMBER=242053323191
MAX_SESSIONS=50
MENU_IMAGE=https://raw.githubusercontent.com/kinggggg444/DENTSU-MD-V10/main/assets/dentsu-md-v10-banner.jpg
CHANNEL_LINK=https://whatsapp.com/channel/0029VbC1s7fFnSz1YhZYc01h
TELEGRAM=https://t.me/Natsu_or_Dentsu
NODE_ENV=production
```

**4. Deploy**

Click **Deploy** and wait 2–3 minutes. Your Railway URL will look like:
`https://dentsu-md-v10.up.railway.app`

---

### 🌐 Option 2 — Pairing Site (Vercel)

The `frontend/` folder contains a modern React site for getting your pairing code.

**1. Import to Vercel**
- Root Directory: `frontend`
- Framework Preset: `Vite`

**2. Vercel environment variable**
```env
VITE_API_URL=https://your-railway-url.up.railway.app
```

**3. Deploy** — your pairing site is live in 1 minute!

---

## 🔗 WhatsApp Connection

Once your bot is deployed:

1. Open your Railway service URL (or Vercel site)
2. Enter your WhatsApp number **with country code** (e.g. `242053323191`)
3. Receive your **8-character pairing code**
4. In WhatsApp → **Menu → Linked Devices → Link a Device → Link with phone number**
5. Enter the code — your bot is connected! ✅

---

## 📱 Available Commands (200+)

| Category | Examples | Menu |
|---|---|---|
| 🧠 **Artificial Intelligence** | `.gpt`, `.gemini`, `.deepseek` | `.aimenu` |
| 👥 **Group Management** | `.tagall`, `.kick`, `.promote` | `.groupmenu` |
| 👑 **Owner / Admin** | `.broadcast`, `.mode`, `.block` | `.ownermenu` |
| 🎉 **Fun & Social** | `.truth`, `.dare`, `.ship` | `.funmenu` |
| 🎮 **Games** | `.rps`, `.hangman`, `.math` | `.gamemenu` |
| 🎵 **Audio & Voice** | `.tts`, `.say`, `.bass` | `.soundmenu` |
| 📥 **Downloader** | `.ytmp3`, `.fb`, `.insta`, `.tiktok` | `.dlmenu` |
| 📸 **Media & Stickers** | `.sticker`, `.remini`, `.blur` | `.mediamenu` |
| 🔍 **Search** | `.img`, `.yts`, `.github` | `.searchmenu` |
| 🖼️ **Random Images** | `.waifu`, `.neko`, `.carimage` | `.randommenu` |
| 🎌 **Anime** | `.neko`, `.manga`, `.lyrics` | `.animemenu` |
| 🔧 **Utilities** | `.weather`, `.wiki`, `.calc` | `.othermenu` |

---

## 📞 Contacts & Support

| Platform | Link |
|---|---|
| 📱 **WhatsApp (main)** | [+242 053 323 191](https://wa.me/242053323191) |
| ✈️ **Telegram (contact)** | [@Natsu_or_Dentsu](https://t.me/Natsu_or_Dentsu) |
| 📢 **WhatsApp Channel** | [Join](https://whatsapp.com/channel/0029VbC1s7fFnSz1YhZYc01h) |
| 📡 **Telegram Channel (deploy)** | [@DPLOIEMENT_DUN_BOT2](https://t.me/DPLOIEMENT_DUN_BOT2) |
| ▶️ **YouTube (tutorials)** | [@Natsu-ras](https://youtube.com/@Natsu-ras) |

---

## 🛠️ Full Environment Variables

```env
# ── Bot Core ──────────────────────────
BOT_NAME=DENTSU MD V10
DEV_NAME=NatsuTech's 🇨🇬
PREFIX=.
MODE=public              # public | self

# ── Owner ─────────────────────────────
OWNER_NUMBER=242053323191

# ── Sessions ──────────────────────────
MAX_SESSIONS=50

# ── Media ─────────────────────────────
MENU_IMAGE=https://raw.githubusercontent.com/kinggggg444/DENTSU-MD-V10/main/assets/dentsu-md-v10-banner.jpg

# ── Social Links ──────────────────────
CHANNEL_LINK=https://whatsapp.com/channel/0029VbC1s7fFnSz1YhZYc01h
GROUP_LINK=https://chat.whatsapp.com/GtXASqDdchAFvEJ95cQQ0F
TELEGRAM=https://t.me/Natsu_or_Dentsu

# ── CORS (if separate Vercel frontend) ──
FRONTEND_URL=https://your-site.vercel.app
NODE_ENV=production
```

---

## 🏗️ Project Structure

```
DENTSU-MD-V10/
├── index.js              # Main entry point
├── railway.json          # Railway deployment config
├── package.json
├── assets/
│   └── dentsu-md-v10-banner.jpg  # Bot banner image
├── src/
│   ├── bot.js            # Baileys connection logic
│   ├── web.js            # Express server + pairing API
│   ├── config.js         # Central configuration
│   ├── commands.js       # 200+ commands
│   ├── handlers/
│   │   └── message.js    # Message handler
│   └── plugins/
│       ├── media.js      # Stickers, images, videos
│       └── owner.js      # Owner commands
└── frontend/             # Pairing site (Vercel)
    ├── src/
    │   ├── App.jsx       # Main interface
    │   ├── i18n.js       # 10 languages
    │   └── index.css     # Dark + WhatsApp green design
    └── vercel.json       # Vercel config
```

---

<div align="center">

**Made with ❤️ by [NatsuTech's 🇨🇬](https://t.me/Natsu_or_Dentsu)**

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/242053323191)
[![Telegram](https://img.shields.io/badge/Telegram-0088cc?style=flat-square&logo=telegram&logoColor=white)](https://t.me/Natsu_or_Dentsu)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://youtube.com/@Natsu-ras)

*DENTSU MD V10 — The next-generation WhatsApp bot 🚀*

*Developed by NatsuTech's 🇨🇬*

</div>
