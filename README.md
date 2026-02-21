# 🔐 PDF Digital Signature Tool (DSA)

A full-stack web application to **cryptographically sign and verify PDF documents** using the Digital Signature Algorithm (DSA). Built with React + Node.js.

---

## ✨ Features

- 📄 Upload any PDF and generate a DSA digital signature
- ✅ Verify a signature against a PDF to confirm it hasn't been tampered with
- 🔒 Keys are generated once and stored securely on the server
- ⚡ Files are processed in memory — nothing is stored on disk
- 📱 Fully responsive — works on mobile and desktop
- 🚫 5MB file size limit with instant client-side validation

---

## 🛠 Tech Stack

**Frontend**
- React + TypeScript (Vite)
- Tailwind CSS

**Backend**
- Node.js + Express
- Multer (memory storage)
- Node.js built-in `crypto` module (DSA)

---

## 📁 Project Structure

```
├── backend/
│   ├── keys/              # DSA key pair (auto-generated, never commit)
│   ├── index.js           # Express server
│   ├── package.json
│   └── .gitignore
└── frontend/
    ├── src/
    │   ├── App.tsx         # Main UI
    │   └── components/
    ├── package.json
    └── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Start the backend
```bash
cd backend
npm install
node index.js
```
Server runs on `http://localhost:5000`. DSA keys are auto-generated in `keys/` on first run.

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

---

## 🔑 How It Works

```
SIGN
Upload PDF → Hash with SHA-256 → Sign hash with DSA private key → Returns base64 signature

VERIFY
Upload PDF → Hash with SHA-256 → Verify hash against signature using DSA public key → Valid / Invalid
```

The PDF itself is never stored. Files live in RAM only for the duration of the request and are discarded immediately after.

---

## 🌐 Deployment

| Service | Purpose |
|---------|---------|
| [Render](https://render.com) | Backend (Node.js) — Free tier |
| [Vercel](https://vercel.com) | Frontend (React/Vite) — Free tier |

### Environment Variables

**Backend (Render)**
| Variable | Value |
|----------|-------|
| `FRONTEND_URL` | Your Vercel deployment URL |

**Frontend (Vercel)**
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your Render deployment URL |

### ⚠️ Important — Keys on Render
Render's free tier has an ephemeral filesystem. Add your DSA keys as **Secret Files** in Render's dashboard:
- `keys/private.pem`
- `keys/public.pem`

This ensures keys survive redeploys and previously generated signatures stay valid.

---

## ⚙️ API Endpoints

### `POST /sign`
Signs a PDF and returns a base64 DSA signature.

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `pdf` | File | PDF file (max 5MB) |

**Response:**
```json
{
  "success": true,
  "signature": "base64encodedSignature..."
}
```

---

### `POST /verify`
Verifies a DSA signature against a PDF.

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `pdf` | File | PDF file (max 5MB) |
| `signature` | String | Base64 DSA signature |

**Response:**
```json
{
  "success": true,
  "valid": true
}
```

---

## 🔒 Security Notes

- The **private key never leaves the server**
- Files are processed in memory — no uploads are saved to disk
- CORS is restricted to the frontend domain in production
- Client-side validation rejects non-PDF files and files over 5MB instantly

---

## 📜 License

MIT