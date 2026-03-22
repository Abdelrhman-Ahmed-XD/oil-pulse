import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { convertMediaUrl, extractDriveFileId } from "../../utils/mediaUtils"

const defaultCategories = [
    { id: 1, name: "نفط خام", subcategories: [] },
    { id: 2, name: "غاز طبيعي", subcategories: [] },
    { id: 3, name: "طاقة متجددة", subcategories: [] },
    { id: 4, name: "أوبك+", subcategories: [] },
    { id: 5, name: "أسواق", subcategories: [] },
    { id: 6, name: "تقارير", subcategories: [] },
]

function getCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    return stored ? JSON.parse(stored) : defaultCategories
}

// ── Drive Preview ─────────────────────────────────────────────
// Shows iframe directly in the editor
function DrivePreview({ fileId, type }) {
    return (
        <div className="mt-2 rounded-xl overflow-hidden border border-blue-200 bg-blue-50">
            {type === "image" ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                        src={`https://drive.google.com/file/d/${fileId}/preview`}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                        title="معاينة الصورة"
                        allow="autoplay"
                    />
                </div>
            ) : type === "video" ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                        src={`https://drive.google.com/file/d/${fileId}/preview`}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                        title="معاينة الفيديو"
                        allow="autoplay"
                        allowFullScreen
                    />
                </div>
            ) : type === "audio" ? (
                <iframe
                    src={`https://drive.google.com/file/d/${fileId}/preview`}
                    className="w-full"
                    style={{ height: "80px", border: "none" }}
                    title="معاينة الصوت"
                    allow="autoplay"
                />
            ) : type === "pdf" ? (
                <iframe
                    src={`https://drive.google.com/file/d/${fileId}/preview`}
                    className="w-full"
                    style={{ height: "300px", border: "none" }}
                    title="معاينة PDF"
                />
            ) : null}
            <div className="px-3 py-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border-t border-blue-100">
                <span>☁️</span>
                <span>Google Drive — تم التعرف على الملف بنجاح</span>
                <a href={`https://drive.google.com/file/d/${fileId}/view`} target="_blank" rel="noopener noreferrer"
                   className="mr-auto text-blue-500 hover:text-blue-700 font-bold flex items-center gap-1">فتح ↗</a>
            </div>
        </div>
    )
}

// ── URL Status ────────────────────────────────────────────────
function UrlStatus({ status, type }) {
    if (status === "idle") return null
    return (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mt-2 ${
                        status === "loading" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                            status === "success" ? "bg-green-50 text-green-700 border border-green-100" :
                                status === "drive" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                    "bg-red-50 text-red-600 border border-red-100"
                    }`}>
            {status === "loading" && <><svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg><span>جارٍ التحقق...</span></>}
            {status === "success" && <><span>✅</span><span>تم بنجاح</span></>}
            {status === "drive" && <><span>☁️</span><span>رابط Google Drive صالح</span></>}
            {status === "error" && <><span>❌</span><span>تعذّر تحميل الملف — تأكد أن الرابط صحيح والملف مشارك للعموم</span></>}
        </motion.div>
    )
}

// ── Media Drop Zone ───────────────────────────────────────────
function MediaDropZone({ accept, onFile, children, className = "" }) {
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef(null)

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) onFile(file)
    }
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(false) }

    return (
        <div
            onDrop={handleDrop} onDragOver={handleDragOver}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl cursor-pointer transition-all text-center py-8 px-4 ${
                dragging ? "border-amber-400 bg-amber-50 scale-[1.01]" : "border-gray-300 hover:border-amber-300 hover:bg-gray-50"
            } ${className}`}
        >
            <input ref={inputRef} type="file" accept={accept} className="hidden"
                   onChange={(e) => { if (e.target.files?.[0]) { onFile(e.target.files[0]); e.target.value = "" } }} />
            {children(dragging)}
        </div>
    )
}

// ── Smart URL Input ───────────────────────────────────────────
function SmartUrlInput({ value, onChange, placeholder, blockType }) {
    const [inputVal, setInputVal] = useState(value || "")
    const [applied, setApplied] = useState(!!value)
    const [urlStatus, setUrlStatus] = useState(value ? "drive" : "idle")

    const info = value ? convertMediaUrl(value) : null

    const apply = () => {
        if (!inputVal.trim()) return
        const result = convertMediaUrl(inputVal.trim())
        onChange(inputVal.trim())
        setApplied(true)
        if (result.source === "google-drive") {
            setUrlStatus("drive")
        } else if (result.type === "image") {
            setUrlStatus("loading")
        } else {
            setUrlStatus("success")
        }
    }

    const clear = () => { setInputVal(""); setApplied(false); setUrlStatus("idle"); onChange("") }

    const effectiveType = blockType || info?.type || "link"

    return (
        <div>
            <div className="flex gap-2">
                <input type="text" value={inputVal}
                       onChange={(e) => { setInputVal(e.target.value); if (applied) { setApplied(false); setUrlStatus("idle") } }}
                       onKeyDown={(e) => e.key === "Enter" && apply()}
                       className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
                       placeholder={placeholder}
                />
                {!applied
                    ? <button type="button" onClick={apply} className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 text-xs rounded-lg transition-colors whitespace-nowrap">تطبيق ✓</button>
                    : <button type="button" onClick={clear} className="border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-4 text-xs rounded-lg transition-colors whitespace-nowrap">حذف ✕</button>
                }
            </div>

            {applied && value && info?.source === "google-drive" && info?.fileId && (
                <>
                    <UrlStatus status={urlStatus} type={effectiveType} />
                    <DrivePreview fileId={info.fileId} type={effectiveType} />
                </>
            )}

            {applied && value && info?.source === "youtube" && (
                <>
                    <UrlStatus status="success" type="video" />
                    <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black">
                        <iframe src={info.converted} className="w-full h-full" allowFullScreen title="فيديو" />
                    </div>
                </>
            )}

            {applied && value && info?.source === "direct" && info?.type === "image" && (
                <>
                    <UrlStatus status={urlStatus} type="image" />
                    <div className="mt-2 relative rounded-xl overflow-hidden">
                        <img src={info.converted} alt="معاينة" className="w-full h-44 object-cover rounded-xl"
                             onLoad={() => setUrlStatus("success")}
                             onError={() => setUrlStatus("error")} />
                        {urlStatus === "loading" && (
                            <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
                                <svg className="animate-spin w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                            </div>
                        )}
                    </div>
                </>
            )}

            {applied && value && info?.source === "direct" && info?.type === "video" && (
                <>
                    <UrlStatus status="success" type="video" />
                    <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black">
                        <video controls className="w-full h-full"><source src={value} /></video>
                    </div>
                </>
            )}

            {applied && value && info?.source === "direct" && info?.type === "audio" && (
                <>
                    <UrlStatus status="success" type="audio" />
                    <div className="mt-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
                        <audio controls className="w-full"><source src={value} /></audio>
                    </div>
                </>
            )}

            {applied && value && info?.source === "direct" && info?.type === "pdf" && (
                <>
                    <UrlStatus status="success" type="pdf" />
                    <div className="mt-2 h-64 rounded-xl overflow-hidden border border-gray-300">
                        <iframe src={value} className="w-full h-full" style={{ border: "none" }} title="PDF" />
                    </div>
                </>
            )}
        </div>
    )
}

// ── Block Types ───────────────────────────────────────────────
const BLOCK_TYPES = [
    { type: "text", label: "فقرة نصية", icon: "¶" },
    { type: "image", label: "صورة", icon: "🖼️" },
    { type: "video", label: "فيديو", icon: "🎬" },
    { type: "audio", label: "صوت", icon: "🎵" },
    { type: "pdf", label: "PDF", icon: "📄" },
    { type: "divider", label: "فاصل", icon: "―" },
]

function createBlock(type) {
    return { id: `block_${Date.now()}_${Math.random().toString(36).substr(2,9)}`, type, content: "", url: "", caption: "" }
}

// ── Image Drop Zone ───────────────────────────────────────────
function ImageDropZone({ value, onChange }) {
    const [urlMode, setUrlMode] = useState(true)

    const processFile = (file) => {
        if (!file.type.startsWith("image/")) { alert("يرجى اختيار ملف صورة"); return }
        const reader = new FileReader()
        reader.onload = (e) => { onChange(e.target.result); }
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")

    if (isLocal) {
        return (
            <div className="relative group">
                <img src={value} alt="معاينة" className="w-full h-44 object-cover rounded-xl" />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ تم الرفع</div>
                <button type="button" onClick={() => onChange("")}
                        className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${!urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    📁 رفع / سحب وإفلات
                </button>
                <button type="button" onClick={() => setUrlMode(true)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    🔗 رابط URL
                </button>
            </div>

            {!urlMode ? (
                <MediaDropZone accept="image/*" onFile={processFile}>
                    {(dragging) => (
                        <>
                            <div className="text-4xl mb-3">{dragging ? "📥" : "🖼️"}</div>
                            <p className="text-sm font-bold text-gray-600">{dragging ? "أفلت الصورة هنا!" : "اسحب صورة هنا أو انقر للاختيار"}</p>
                            <p className="text-xs text-gray-400 mt-1">JPG · PNG · WEBP · GIF</p>
                        </>
                    )}
                </MediaDropZone>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="الصق رابط الصورة أو Google Drive..." blockType="image" />
            )}
        </div>
    )
}

// ── Video Drop Zone ───────────────────────────────────────────
function VideoDropZone({ value, onChange }) {
    const [urlMode, setUrlMode] = useState(true)

    const processFile = (file) => {
        if (!file.type.startsWith("video/")) { alert("يرجى اختيار ملف فيديو"); return }
        const reader = new FileReader()
        reader.onload = (e) => onChange(e.target.result)
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")

    if (isLocal) {
        return (
            <div className="relative group rounded-xl overflow-hidden">
                <video controls className="w-full rounded-xl"><source src={value} /></video>
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ تم الرفع</div>
                <button type="button" onClick={() => onChange("")}
                        className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${!urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    📁 رفع / سحب وإفلات
                </button>
                <button type="button" onClick={() => setUrlMode(true)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    🔗 رابط URL
                </button>
            </div>
            {!urlMode ? (
                <MediaDropZone accept="video/*" onFile={processFile}>
                    {(dragging) => (
                        <>
                            <div className="text-4xl mb-3">{dragging ? "📥" : "🎬"}</div>
                            <p className="text-sm font-bold text-gray-600">{dragging ? "أفلت الفيديو هنا!" : "اسحب فيديو هنا أو انقر للاختيار"}</p>
                            <p className="text-xs text-gray-400 mt-1">MP4 · MOV · AVI</p>
                        </>
                    )}
                </MediaDropZone>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="رابط YouTube أو Google Drive..." blockType="video" />
            )}
        </div>
    )
}

// ── Audio Drop Zone ───────────────────────────────────────────
function AudioDropZone({ value, onChange }) {
    const [urlMode, setUrlMode] = useState(true)

    const processFile = (file) => {
        if (!file.type.startsWith("audio/")) { alert("يرجى اختيار ملف صوتي"); return }
        const reader = new FileReader()
        reader.onload = (e) => onChange(e.target.result)
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")

    if (isLocal) {
        return (
            <div className="relative group bg-gray-50 rounded-xl p-4 border border-gray-200">
                <audio controls className="w-full"><source src={value} /></audio>
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ تم الرفع</div>
                <button type="button" onClick={() => onChange("")}
                        className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${!urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    📁 رفع / سحب وإفلات
                </button>
                <button type="button" onClick={() => setUrlMode(true)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    🔗 رابط URL
                </button>
            </div>
            {!urlMode ? (
                <MediaDropZone accept="audio/*" onFile={processFile}>
                    {(dragging) => (
                        <>
                            <div className="text-4xl mb-3">{dragging ? "📥" : "🎵"}</div>
                            <p className="text-sm font-bold text-gray-600">{dragging ? "أفلت الملف الصوتي هنا!" : "اسحب ملفاً صوتياً هنا أو انقر"}</p>
                            <p className="text-xs text-gray-400 mt-1">MP3 · WAV · OGG</p>
                        </>
                    )}
                </MediaDropZone>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="رابط الصوت أو Google Drive..." blockType="audio" />
            )}
        </div>
    )
}

// ── PDF Drop Zone ─────────────────────────────────────────────
function PdfDropZone({ value, onChange }) {
    const [urlMode, setUrlMode] = useState(true)

    const processFile = (file) => {
        if (file.type !== "application/pdf") { alert("يرجى اختيار ملف PDF"); return }
        const reader = new FileReader()
        reader.onload = (e) => onChange(e.target.result)
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")

    if (isLocal) {
        return (
            <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                <iframe src={value} className="w-full h-64" style={{ border: "none" }} title="PDF" />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ تم الرفع</div>
                <button type="button" onClick={() => onChange("")}
                        className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${!urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    📁 رفع / سحب وإفلات
                </button>
                <button type="button" onClick={() => setUrlMode(true)}
                        className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${urlMode ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 text-gray-600 hover:border-amber-300"}`}>
                    🔗 رابط URL
                </button>
            </div>
            {!urlMode ? (
                <MediaDropZone accept=".pdf,application/pdf" onFile={processFile}>
                    {(dragging) => (
                        <>
                            <div className="text-4xl mb-3">{dragging ? "📥" : "📄"}</div>
                            <p className="text-sm font-bold text-gray-600">{dragging ? "أفلت ملف PDF هنا!" : "اسحب ملف PDF هنا أو انقر"}</p>
                            <p className="text-xs text-gray-400 mt-1">PDF فقط</p>
                        </>
                    )}
                </MediaDropZone>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="رابط PDF أو Google Drive..." blockType="pdf" />
            )}
        </div>
    )
}

// ── Block Editor ──────────────────────────────────────────────
function BlockEditor({ blocks, onChange }) {
    // Use ref for drag to avoid re-renders causing flicker
    const dragIndexRef = useRef(null)
    const [dragVisualIdx, setDragVisualIdx] = useState(null)

    const update = useCallback((id, changes) =>
        onChange(prev => prev.map((b) => b.id === id ? { ...b, ...changes } : b)), [onChange])

    const remove = useCallback((id) =>
        onChange(prev => prev.filter((b) => b.id !== id)), [onChange])

    const moveUp = (i) => {
        if (i === 0) return
        onChange(prev => { const b = [...prev]; [b[i-1],b[i]]=[b[i],b[i-1]]; return b })
    }

    const moveDown = (i) => {
        onChange(prev => {
            if (i >= prev.length - 1) return prev
            const b = [...prev]; [b[i],b[i+1]]=[b[i+1],b[i]]; return b
        })
    }

    const handleDragStart = (e, i) => {
        dragIndexRef.current = i
        setDragVisualIdx(i)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e, i) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        const from = dragIndexRef.current
        if (from === null || from === i) return
        onChange(prev => {
            const b = [...prev]
            const [moved] = b.splice(from, 1)
            b.splice(i, 0, moved)
            dragIndexRef.current = i
            return b
        })
        setDragVisualIdx(i)
    }

    const handleDragEnd = () => {
        dragIndexRef.current = null
        setDragVisualIdx(null)
    }

    return (
        <div className="space-y-3">
            {blocks.map((block, i) => (
                <div key={block.id}
                     draggable
                     onDragStart={(e) => handleDragStart(e, i)}
                     onDragOver={(e) => handleDragOver(e, i)}
                     onDragEnd={handleDragEnd}
                     className={`border bg-white rounded-xl transition-colors ${
                         dragVisualIdx === i ? "border-amber-400 shadow-md" : "border-gray-200 hover:border-gray-300"
                     }`}
                     style={{ opacity: dragVisualIdx === i ? 0.7 : 1 }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                        <span className="text-gray-400 cursor-grab active:cursor-grabbing text-base select-none">⠿</span>
                        <span className="text-xs font-bold text-gray-600">
              {BLOCK_TYPES.find(t=>t.type===block.type)?.icon} {BLOCK_TYPES.find(t=>t.type===block.type)?.label}
            </span>
                        <div className="flex items-center gap-1 mr-auto">
                            <button onClick={() => moveUp(i)} disabled={i===0}
                                    className="text-gray-400 hover:text-stone-700 disabled:opacity-20 px-1.5 py-0.5 text-xs hover:bg-gray-200 rounded">↑</button>
                            <button onClick={() => moveDown(i)} disabled={i===blocks.length-1}
                                    className="text-gray-400 hover:text-stone-700 disabled:opacity-20 px-1.5 py-0.5 text-xs hover:bg-gray-200 rounded">↓</button>
                            <button onClick={() => remove(block.id)}
                                    className="text-red-400 hover:text-white hover:bg-red-500 px-1.5 py-0.5 text-xs rounded">✕</button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                        {block.type === "text" && (
                            <textarea value={block.content}
                                      onChange={(e) => update(block.id, { content: e.target.value })}
                                      rows={4} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-400 resize-y rounded-lg"
                                      placeholder="اكتب الفقرة هنا..." />
                        )}

                        {block.type === "divider" && (
                            <div className="py-3 text-center text-gray-400 text-sm select-none border border-dashed border-gray-300 rounded-lg">
                                ―――――― فاصل ――――――
                            </div>
                        )}

                        {block.type === "image" && (
                            <div className="space-y-2">
                                {block._localFile && block.url ? (
                                    <div className="relative group">
                                        <img src={block.url} alt="معاينة" className="w-full h-44 object-cover rounded-xl" />
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ تم الرفع</div>
                                        <button type="button" onClick={() => update(block.id, { url: "", _localFile: false })}
                                                className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100">✕</button>
                                    </div>
                                ) : (
                                    <ImageDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })} />
                                )}
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-400 rounded-lg"
                                       placeholder="تعليق توضيحي (اختياري)..." />
                            </div>
                        )}

                        {block.type === "video" && (
                            <div className="space-y-2">
                                <VideoDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })} />
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-400 rounded-lg"
                                       placeholder="تعليق توضيحي (اختياري)..." />
                            </div>
                        )}

                        {block.type === "audio" && (
                            <div className="space-y-2">
                                <AudioDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })} />
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-400 rounded-lg"
                                       placeholder="تعليق توضيحي (اختياري)..." />
                            </div>
                        )}

                        {block.type === "pdf" && (
                            <div className="space-y-2">
                                <PdfDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })} />
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-400 rounded-lg"
                                       placeholder="تعليق توضيحي (اختياري)..." />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Add Block */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                <p className="w-full text-xs text-gray-500 mb-1">+ إضافة كتلة:</p>
                {BLOCK_TYPES.map((bt) => (
                    <button key={bt.type} type="button"
                            onClick={() => onChange(prev => [...prev, createBlock(bt.type)])}
                            className="flex items-center gap-1.5 text-xs border border-dashed border-gray-400 text-gray-600 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors">
                        <span>{bt.icon}</span><span>{bt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

// ── Preview Modal ─────────────────────────────────────────────
function PreviewModal({ form, blocks, onClose }) {
    const categoryColors = {
        "نفط خام": "bg-amber-100 text-amber-700", "البترول": "bg-amber-100 text-amber-700",
        "غاز طبيعي": "bg-blue-100 text-blue-700", "الغاز الطبيعي": "bg-blue-100 text-blue-700",
        "طاقة متجددة": "bg-green-100 text-green-700", "الطاقة المتجددة": "bg-green-100 text-green-700",
        "أسواق": "bg-red-100 text-red-700", "الأسواق": "bg-red-100 text-red-700",
        "تقارير": "bg-purple-100 text-purple-700", "أوبك+": "bg-purple-100 text-purple-700",
    }

    const renderBlock = (block) => {
        const info = convertMediaUrl(block.url)
        const fileId = info?.fileId

        switch (block.type) {
            case "text": return <p key={block.id} className="text-stone-700 leading-loose text-base whitespace-pre-line mb-6">{block.content}</p>
            case "divider": return <hr key={block.id} className="border-gray-200 my-8" />
            case "image": return (
                <figure key={block.id} className="mb-6">
                    {block._localFile
                        ? <img src={block.url} alt={block.caption} className="w-full rounded-xl object-cover max-h-96" />
                        : fileId
                            ? <DrivePreview fileId={fileId} type="image" />
                            : <img src={info?.converted || block.url} alt={block.caption} className="w-full rounded-xl object-cover max-h-96" onError={(e) => e.target.style.display="none"} />
                    }
                    {block.caption && !fileId && <figcaption className="text-center text-sm text-gray-400 mt-2">{block.caption}</figcaption>}
                </figure>
            )
            case "video": return (
                <figure key={block.id} className="mb-6">
                    {fileId
                        ? <DrivePreview fileId={fileId} type="video" />
                        : <div className="aspect-video rounded-xl overflow-hidden bg-black">
                            {block._localFile
                                ? <video controls className="w-full h-full"><source src={block.url} /></video>
                                : <iframe src={info?.converted} className="w-full h-full" allowFullScreen title={block.caption || "فيديو"} />
                            }
                        </div>
                    }
                    {block.caption && !fileId && <figcaption className="text-center text-sm text-gray-400 mt-2">{block.caption}</figcaption>}
                </figure>
            )
            case "audio": return (
                <figure key={block.id} className="mb-6 bg-gray-50 rounded-xl p-4">
                    {fileId
                        ? <DrivePreview fileId={fileId} type="audio" />
                        : block._localFile
                            ? <audio controls className="w-full"><source src={block.url} /></audio>
                            : <audio controls className="w-full"><source src={block.url} /></audio>
                    }
                </figure>
            )
            case "pdf": return (
                <figure key={block.id} className="mb-6">
                    {fileId
                        ? <DrivePreview fileId={fileId} type="pdf" />
                        : <iframe src={block._localFile ? block.url : info?.converted} className="w-full h-96 rounded-xl" style={{border:"none"}} title="PDF" />
                    }
                </figure>
            )
            default: return null
        }
    }

    const coverInfo = form.image ? convertMediaUrl(form.image) : null

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-white overflow-y-auto" dir="rtl">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-600">معاينة المقال</span>
                </div>
                <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-800 border border-gray-300 px-4 py-2 hover:border-gray-500 rounded-lg">✕ إغلاق</button>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[form.category] || "bg-gray-100 text-gray-700"}`}>{form.category}</span>
                    {form.subcategory && <><span className="text-gray-400 text-xs">←</span><span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">{form.subcategory}</span></>}
                </div>
                <h1 className="text-4xl font-black text-stone-900 mb-4 leading-snug">{form.title || <span className="text-gray-300">عنوان الخبر...</span>}</h1>
                {form.excerpt && <p className="text-lg text-gray-500 leading-relaxed mb-6 border-r-4 border-amber-400 pr-4">{form.excerpt}</p>}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-200">
                    <span>✍ {form.author}</span><span>·</span>
                    <span>📅 {new Date().toLocaleDateString("ar-EG", { year:"numeric", month:"long", day:"numeric" })}</span>
                </div>
                {form.image && (
                    <div className="mb-10 rounded-xl overflow-hidden">
                        {coverInfo?.fileId
                            ? <DrivePreview fileId={coverInfo.fileId} type="image" />
                            : <img src={coverInfo?.converted || form.image} alt={form.title} className="w-full h-96 object-cover" onError={(e) => e.target.style.display="none"} />
                        }
                    </div>
                )}
                <div>
                    {blocks.length === 0 && !form.image
                        ? <div className="text-center py-16 text-gray-300 border-2 border-dashed border-gray-200 rounded-xl"><p className="text-4xl mb-2">📝</p><p className="text-sm">لا يوجد محتوى بعد</p></div>
                        : blocks.map(renderBlock)
                    }
                </div>
            </div>
        </motion.div>
    )
}

// ── Cover Image Upload ────────────────────────────────────────
function CoverImageUpload({ value, onChange }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-600 mb-3 tracking-widest">صورة الغلاف</label>
            <ImageDropZone value={value} onChange={onChange} />
        </div>
    )
}

// ── Main Form ─────────────────────────────────────────────────
export default function ArticleForm({ user, isEdit = false }) {
    const navigate = useNavigate()
    const { id } = useParams()
    const categories = getCategories()

    const [form, setForm] = useState({ title: "", category: categories[0]?.name || "", subcategory: "", excerpt: "", image: "", author: user.username })
    const [blocks, setBlocks] = useState([])
    const [showPreview, setShowPreview] = useState(false)
    const [success, setSuccess] = useState(false)

    const selectedCat = categories.find((c) => c.name === form.category)
    const subcategories = selectedCat?.subcategories || []

    // Stable onChange for BlockEditor to prevent re-renders
    const handleBlocksChange = useCallback((updater) => {
        if (typeof updater === "function") {
            setBlocks(updater)
        } else {
            setBlocks(updater)
        }
    }, [])

    useEffect(() => {
        if (isEdit && id) {
            const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
            const article = articles.find((a) => a.id === parseInt(id))
            if (article) {
                setForm({ title: article.title||"", category: article.category||categories[0]?.name||"", subcategory: article.subcategory||"", excerpt: article.excerpt||"", image: article.image||"", author: article.author||user.username })
                setBlocks(article.blocks || [])
            }
        }
    }, [isEdit, id])

    const handleChange = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value, ...(field === "category" ? { subcategory: "" } : {}) }))

    const handleSubmit = () => {
        if (!form.title.trim()) return alert("عنوان الخبر مطلوب")
        const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
        const articleData = { ...form, blocks, body: blocks.filter(b=>b.type==="text").map(b=>b.content).join("\n\n") }
        if (isEdit) {
            localStorage.setItem("oilpulse_articles", JSON.stringify(articles.map((a) => a.id===parseInt(id) ? {...a,...articleData} : a)))
        } else {
            localStorage.setItem("oilpulse_articles", JSON.stringify([{...articleData, id:Date.now(), date:new Date().toLocaleDateString("ar-EG",{year:"numeric",month:"long",day:"numeric"}), featured:articles.length===0}, ...articles]))
        }
        setSuccess(true)
        setTimeout(() => navigate("/admin/dashboard/articles"), 1500)
    }

    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-black text-stone-900">{isEdit ? "تعديل الخبر" : "إضافة خبر جديد"}</h1>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowPreview(true)} className="border border-gray-300 text-stone-600 hover:border-amber-400 hover:text-amber-600 px-5 py-2 text-sm font-bold rounded-lg transition-colors">👁 معاينة</button>
                        <button onClick={() => navigate("/admin/dashboard/articles")} className="text-sm text-gray-500 hover:text-gray-700">→ العودة</button>
                    </div>
                </div>

                {success && <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 text-sm mb-6 rounded-lg">✓ تم {isEdit?"تعديل":"نشر"} الخبر بنجاح.</div>}

                <div className="space-y-5">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-600 mb-2 tracking-widest">عنوان الخبر *</label>
                        <input type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)}
                               className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-amber-400 rounded-lg"
                               placeholder="أدخل عنوان الخبر..." />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 tracking-widest">التصنيف الرئيسي *</label>
                            <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}
                                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-amber-400 bg-white rounded-lg">
                                {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 tracking-widest">التصنيف الفرعي <span className="text-gray-400 font-normal">(اختياري)</span></label>
                            <select value={form.subcategory||""} onChange={(e) => handleChange("subcategory", e.target.value)}
                                    disabled={subcategories.length===0}
                                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-amber-400 bg-white rounded-lg disabled:opacity-40">
                                <option value="">{subcategories.length===0 ? "لا توجد تصنيفات فرعية" : "بدون تصنيف فرعي"}</option>
                                {subcategories.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-600 mb-2 tracking-widest">مقدمة الخبر</label>
                        <input type="text" value={form.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)}
                               className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-amber-400 rounded-lg"
                               placeholder="جملة مختصرة تظهر في بطاقة الخبر..." />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <CoverImageUpload value={form.image} onChange={(val) => handleChange("image", val)} />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <label className="text-xs font-bold text-gray-600 tracking-widest">محتوى الخبر</label>
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">{blocks.length} كتلة</span>
                        </div>
                        <BlockEditor blocks={blocks} onChange={handleBlocksChange} />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-600 mb-2 tracking-widest">اسم المحرر</label>
                        <div className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm flex items-center justify-between rounded-lg">
                            <span className="font-semibold text-stone-700">{form.author}</span>
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded border border-gray-300">مقفل</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pb-8">
                        <button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 text-sm tracking-widest rounded-lg">{isEdit?"حفظ التعديلات":"نشر الخبر"} ←</button>
                        <button onClick={() => setShowPreview(true)} className="border border-gray-300 text-gray-600 hover:border-amber-400 hover:text-amber-600 px-8 py-3 text-sm font-bold rounded-lg">👁 معاينة</button>
                        <button onClick={() => navigate("/admin/dashboard/articles")} className="border border-gray-300 text-gray-500 hover:border-gray-500 px-6 py-3 text-sm rounded-lg">إلغاء</button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showPreview && <PreviewModal form={form} blocks={blocks} onClose={() => setShowPreview(false)} />}
            </AnimatePresence>
        </>
    )
}