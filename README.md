# DJAZAIR RICH — Sultan Daro 🇩🇿

> **صناعة جزائرية بفخامة عالمية**  
> Premium Algerian handcrafted glass table landing page with smart RGB LED lighting.

---

## Features

- 🌍 Full **Arabic RTL** layout, mobile-first
- 📋 **Order form** (above the fold) with all 58 Algerian wilayas
- 📧 Orders sent via **[Resend](https://resend.com)** email API
- 💬 Floating **WhatsApp + Call** buttons
- 📸 3-column portrait gallery with mobile swipe slider
- 🔒 Payments **COD** (cash on delivery)
- ✨ Scroll-reveal animations

---

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/dripidin/djazair-rich-table.git
cd djazair-rich-table
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env and add your Resend API key
```

`.env`:
```
RESEND_API_KEY=re_your_key_here
PORT=3000
```

### 3. Run
```bash
npm start        # production
npm run dev      # development (auto-restarts on changes)
```

Open → **http://localhost:3000**

---

## Order Flow

```
Customer fills form
      ↓
POST /api/order  (fetch from browser)
      ↓
server.js  →  Resend API  →  📧 Email to dripidin@gmail.com
      ↓
Success modal + optional WhatsApp redirect
```

If the server is unreachable, the form automatically opens a pre-filled WhatsApp message as a fallback — **no order is ever lost**.

---

## Project Structure

```
djazair-rich-table/
├── index.html          # Main Arabic RTL page
├── style.css           # Full design system
├── script.js           # Frontend logic (form, slider, animations)
├── server.js           # Express + Resend backend
├── package.json
├── .env.example        # Environment variable template
├── .gitignore
├── image/              # Product images
└── fonts/              # Local font files
```

---

## Contact

📞 **+213 558 102 711**  
💬 [WhatsApp](https://wa.me/213558102711)

---

*© 2026 DJAZAIR RICH. All rights reserved. 🇩🇿*
