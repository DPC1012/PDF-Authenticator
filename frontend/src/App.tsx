import { useState, useRef } from "react"

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}



function FileDropZone({
  label,
  file,
  accentClass,
  onChange,
}: {
  label: string
  file: File | null
  accentClass: string
  onChange: (f: File | null) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

const accept = (files: FileList | null) => {
  const f = files?.[0]
  if (!f) return
  if (f.type !== "application/pdf") return alert("Please select a PDF file.")
  if (f.size > 5 * 1024 * 1024) return alert("File too large. Maximum size is 5MB.")
  onChange(f)
}

  const dragBorder = accentClass === "sky" ? "border-sky-400 bg-sky-400/10" : "border-violet-400 bg-violet-400/10"

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => ref.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        accept(e.dataTransfer.files)
      }}
      className={`
        group relative flex flex-col items-center justify-center gap-2
        rounded-xl border-2 border-dashed cursor-pointer select-none
        px-3 py-5 sm:px-4 sm:py-6
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
        ${
          drag
            ? dragBorder
            : file
            ? "border-emerald-500/60 bg-emerald-500/5"
            : "border-slate-600 bg-slate-800/40 hover:border-slate-400 hover:bg-slate-800/70 active:bg-slate-800/90"
        }
      `}
    >
      <input
        ref={ref}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          accept(e.target.files)
          e.target.value = ""
        }}
      />

      <div
        className={`
        rounded-full p-2.5 sm:p-3 transition-colors shrink-0
        ${
          file
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
        }
      `}
      >
        {file ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
      </div>

      <div className="text-center min-w-0 w-full">
        {file ? (
          <>
            <p className="text-sm font-medium text-emerald-400 truncate px-2">{file.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB · tap to replace</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">PDF only · drag & drop or click</p>
            <p className="text-xs text-slate-500 mt-0.5 sm:hidden">PDF only · tap to browse</p>
          </>
        )}
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  disabled,
  loading,
  loadingLabel,
  label,
  color,
}: {
  onClick: () => void
  disabled: boolean
  loading: boolean
  loadingLabel: string
  label: string
  color: "sky" | "violet"
}) {
  const active =
    color === "sky"
      ? "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 active:scale-[0.98]"
      : "bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-500/20 active:scale-[0.98]"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200
        min-h-12 touch-manipulation
        ${disabled ? "bg-slate-700 text-slate-500 cursor-not-allowed" : active}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner />
          {loadingLabel}
        </span>
      ) : label}
    </button>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-sm overflow-hidden">
      {children}
    </div>
  )
}

function PanelHeader({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  color: "sky" | "violet"
}) {
  const bg = color === "sky" ? "bg-sky-500/15 text-sky-400" : "bg-violet-500/15 text-violet-400"
  return (
    <div className="flex items-center gap-3 border-b border-slate-700/60 px-4 py-3.5 sm:px-6 sm:py-4">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-white leading-tight">{title}</h2>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [signFile, setSignFile] = useState<File | null>(null)
  const [verifyFile, setVerifyFile] = useState<File | null>(null)
  const [generatedSignature, setGeneratedSignature] = useState("")
  const [verifySignatureInput, setVerifySignatureInput] = useState("")
  const [status, setStatus] = useState<null | boolean>(null)
  const [signing, setSigning] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [copied, setCopied] = useState(false)

  const setVerifyFileAndReset = (f: File | null) => {
    setVerifyFile(f)
    setStatus(null)
  }

  const setVerifySignatureAndReset = (v: string) => {
    setVerifySignatureInput(v)
    setStatus(null)
  }

  const handleSign = async () => {
    if (!signFile) return
    setSigning(true)
    try {
      const formData = new FormData()
      formData.append("pdf", signFile)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sign`, { method: "POST", body: formData })
      const data = await res.json()
      setGeneratedSignature(data.signature)
    } finally {
      setSigning(false)
    }
  }

  const handleVerify = async () => {
    if (!verifyFile || !verifySignatureInput) return
    setVerifying(true)
    try {
      const formData = new FormData()
      formData.append("pdf", verifyFile)
      formData.append("signature", verifySignatureInput)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/verify`, { method: "POST", body: formData })
      const data = await res.json()
      setStatus(data.valid)
    } finally {
      setVerifying(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedSignature) return
    await navigator.clipboard.writeText(generatedSignature)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const textareaBase =
    "w-full resize-none rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-3 sm:px-4 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none transition-colors"

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="h-0.75 w-full bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 sm:px-4 text-[10px] sm:text-xs font-semibold tracking-widest text-sky-400 uppercase mb-4 sm:mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            DSA · Digital Signature Algorithm
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            PDF Signature Tool
          </h1>
          <p className="mt-2 sm:mt-3 text-slate-400 text-xs sm:text-sm max-w-md mx-auto px-2">
            Cryptographically sign and verify PDF documents using the Digital Signature Algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Panel>
            <PanelHeader
              color="sky"
              title="Sign Document"
              subtitle="Generate a DSA signature for your PDF"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              }
            />

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <FileDropZone label="Upload PDF to sign" file={signFile} accentClass="sky" onChange={setSignFile} />

              <ActionButton
                onClick={handleSign}
                disabled={!signFile || signing}
                loading={signing}
                loadingLabel="Signing…"
                label="Sign Document"
                color="sky"
              />

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Generated Signature
                </label>
                <textarea
                  readOnly
                  value={generatedSignature}
                  placeholder="Signature will appear here after signing…"
                  rows={4}
                  className={textareaBase}
                />
              </div>

              <button
                onClick={handleCopy}
                disabled={!generatedSignature}
                className={`
                  w-full rounded-xl py-3 text-sm font-semibold border transition-all duration-200
                  min-h-12 touch-manipulation
                  ${
                    !generatedSignature
                      ? "border-slate-700 bg-transparent text-slate-600 cursor-not-allowed"
                      : copied
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
                  }
                `}
              >
                {copied ? "✓  Copied to clipboard" : "Copy Signature"}
              </button>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              color="violet"
              title="Verify Document"
              subtitle="Validate a signature against a PDF"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
            />

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <FileDropZone label="Upload PDF to verify" file={verifyFile} accentClass="violet" onChange={setVerifyFileAndReset} />

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Paste Signature
                </label>
                <textarea
                  value={verifySignatureInput}
                  onChange={(e) => setVerifySignatureAndReset(e.target.value)}
                  placeholder="Paste the DSA signature here…"
                  rows={4}
                  className={`${textareaBase} focus:border-violet-500/60`}
                />
              </div>

              <ActionButton
                onClick={handleVerify}
                disabled={!verifyFile || !verifySignatureInput || verifying}
                loading={verifying}
                loadingLabel="Verifying…"
                label="Verify Signature"
                color="violet"
              />

              {status !== null && (
                <div
                  className={`
                  flex items-center gap-3 rounded-xl border px-3 py-3 sm:px-4
                  ${status ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"}
                `}
                >
                  <span className={`text-lg sm:text-xl shrink-0 ${status ? "text-emerald-400" : "text-red-400"}`}>
                    {status ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${status ? "text-emerald-400" : "text-red-400"}`}>
                      {status ? "Signature Valid" : "Signature Invalid"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {status
                        ? "This document has not been tampered with."
                        : "The document or signature could not be verified."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>

        <p className="mt-8 sm:mt-10 text-center text-[10px] sm:text-xs text-slate-600">
          Signatures are generated server-side using DSA · Keys never leave your server
        </p>
      </div>
    </div>
  )
}