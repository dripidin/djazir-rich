/* ==========================================================================
   DJAZAIR RICH — Express + Resend Server
   Serves the static site and handles order form submissions via email
   ========================================================================== */

import express    from 'express';
import { Resend } from 'resend';
import path       from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ---------- Config ---------- */
const PORT        = process.env.PORT || 3000;
const RESEND_KEY  = process.env.RESEND_API_KEY;   // set in .env (never commit the key)
const TO_EMAIL    = 'dripidin@gmail.com';
const FROM_EMAIL  = 'onboarding@resend.dev';   // change to your verified domain when ready

if (!RESEND_KEY) {
  console.error('\n❌  RESEND_API_KEY is missing. Create a .env file — see .env.example\n');
  process.exit(1);
}

const app    = express();
const resend = new Resend(RESEND_KEY);

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files (HTML, CSS, JS, images, fonts)
app.use(express.static(__dirname));

/* ---------- POST /api/order ---------- */
app.post('/api/order', async (req, res) => {
  const { full_name, phone, wilaya } = req.body;

  // Basic server-side validation
  if (!full_name || !phone || !wilaya) {
    return res.status(400).json({
      success: false,
      message: 'يرجى ملء جميع الحقول المطلوبة.'
    });
  }

  // Build a beautiful Arabic HTML email
  const emailHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      background-color: #F5F0E8;
      margin: 0; padding: 0;
      direction: rtl;
    }
    .wrapper {
      max-width: 560px;
      margin: 32px auto;
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(61,41,20,0.12);
    }
    .header {
      background: #3D2914;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #C9B99A;
      font-size: 22px;
      margin: 0 0 4px;
    }
    .header p {
      color: rgba(201,185,154,0.7);
      font-size: 13px;
      margin: 0;
    }
    .badge {
      display: inline-block;
      background: #C4973A;
      color: #3D2914;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.1em;
      padding: 4px 12px;
      border-radius: 99px;
      margin-bottom: 12px;
    }
    .body { padding: 32px 28px; }
    .alert {
      background: #FFF8EC;
      border: 2px solid #C4973A;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 24px;
      font-size: 15px;
      color: #3D2914;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    td {
      padding: 12px 14px;
      font-size: 15px;
      border-bottom: 1px solid #EDE6DA;
      color: #2C2C2C;
    }
    td:first-child {
      font-weight: 700;
      color: #3D2914;
      width: 40%;
      background: #FAF6EF;
    }
    .cta-wrap { text-align: center; margin: 28px 0 8px; }
    .cta {
      display: inline-block;
      background: #25D366;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 10px;
      text-decoration: none;
    }
    .footer {
      background: #FAF6EF;
      padding: 20px 28px;
      text-align: center;
      font-size: 12px;
      color: #917D6A;
      border-top: 1px solid #EDE6DA;
    }
  </style>
</head>
<body>
<div class="wrapper">
  <!-- Header -->
  <div class="header">
    <div class="badge">🇩🇿 طلب جديد</div>
    <h1>DJAZAIR RICH — Sultan Daro</h1>
    <p>صناعة جزائرية بفخامة عالمية</p>
  </div>

  <!-- Body -->
  <div class="body">
    <div class="alert">
      ✅ تم استلام طلب جديد من الموقع الإلكتروني!
    </div>

    <table>
      <tr>
        <td>👤 الاسم الكامل</td>
        <td>${escapeHtml(full_name)}</td>
      </tr>
      <tr>
        <td>📞 رقم الهاتف</td>
        <td dir="ltr" style="text-align:right;">${escapeHtml(phone)}</td>
      </tr>
      <tr>
        <td>📍 الولاية</td>
        <td>${escapeHtml(wilaya)}</td>
      </tr>
      <tr>
        <td>⏰ وقت الطلب</td>
        <td dir="ltr" style="text-align:right;">${new Date().toLocaleString('ar-DZ', { timeZone: 'Africa/Algiers' })}</td>
      </tr>
    </table>

    <div class="cta-wrap">
      <a
        href="https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً ${full_name}، شكراً لطلبك طاولة سلطان دارو 🪑\nسنتصل بك قريباً لتأكيد الطلب والتوصيل إلى ولاية ${wilaya}.\n\nفريق DJAZAIR RICH 🇩🇿`)}"
        class="cta"
      >
        💬 الرد عبر واتساب
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    DJAZAIR RICH — Sultan Daro &nbsp;|&nbsp; 📞 +213 558 102 711<br>
    صناعة جزائرية بفخامة عالمية 🇩🇿
  </div>
</div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      TO_EMAIL,
      subject: `🪑 طلب جديد — ${full_name} (${wilaya})`,
      html:    emailHtml,
      // Reply-To allows you to reply directly to the customer's phone hint
      headers: {
        'X-Customer-Phone': phone,
        'X-Customer-Wilaya': wilaya,
      }
    });

    console.log(`[ORDER] ✅ Email sent | ID: ${result.data?.id} | ${full_name} | ${wilaya}`);

    return res.json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سنتصل بك قريباً.'
    });

  } catch (err) {
    console.error('[ORDER] ❌ Resend error:', err);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الإرسال. يرجى التواصل عبر واتساب.'
    });
  }
});

/* ---------- Catch-all: serve index.html for any unknown route ---------- */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ---------- Start ---------- */
app.listen(PORT, () => {
  console.log(`\n✅  DJAZAIR RICH server running → http://localhost:${PORT}\n`);
});

/* ---------- Helpers ---------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
