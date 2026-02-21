const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// ── Memory storage (no disk writes) ──────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ── Keys ──────────────────────────────────────────────────────────────────────
const KEY_DIR = path.join(__dirname, "keys");
if (!fs.existsSync(KEY_DIR)) fs.mkdirSync(KEY_DIR);

let publicKey, privateKey;

function loadOrCreateKeys() {
  const pubPath = path.join(KEY_DIR, "public.pem");
  const privPath = path.join(KEY_DIR, "private.pem");

  if (fs.existsSync(pubPath) && fs.existsSync(privPath)) {
    publicKey = fs.readFileSync(pubPath);
    privateKey = fs.readFileSync(privPath);
    console.log("Keys loaded from disk.");
  } else {
    const keys = crypto.generateKeyPairSync("dsa", {
      modulusLength: 2048,
      divisorLength: 224,
    });

    publicKey = keys.publicKey.export({ type: "spki", format: "pem" });
    privateKey = keys.privateKey.export({ type: "pkcs8", format: "pem" });

    fs.writeFileSync(pubPath, publicKey);
    fs.writeFileSync(privPath, privateKey);
    console.log("New DSA key pair generated and saved.");
  }
}

loadOrCreateKeys();

// ── Hash helper — now takes a Buffer, not a file path ─────────────────────────
function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

// ── POST /sign ────────────────────────────────────────────────────────────────
app.post("/sign", upload.single("pdf"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });

    const hash = hashBuffer(req.file.buffer); // ✅ buffer, not path

    const signer = crypto.createSign("SHA256");
    signer.update(hash);
    signer.end();

    const signature = signer.sign(privateKey, "base64");

    res.json({ success: true, signature });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /verify ──────────────────────────────────────────────────────────────
app.post("/verify", upload.single("pdf"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    if (!req.body.signature) return res.status(400).json({ error: "No signature provided." });

    const hash = hashBuffer(req.file.buffer); // ✅ buffer, not path

    const verifier = crypto.createVerify("SHA256");
    verifier.update(hash);
    verifier.end();

    const valid = verifier.verify(publicKey, req.body.signature, "base64");

    res.json({ success: true, valid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Error handler (multer file size, etc.) ────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large. Maximum size is 5MB." });
  }
  next(err);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});