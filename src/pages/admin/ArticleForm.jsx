// src/pages/admin/ArticleForm.jsx
import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { convertMediaUrl, extractDriveFileId } from "../../utils/mediaUtils"
import { useToast } from "../../components/ToastContext"
import { useLanguage } from "../../components/LanguageContext"

const defaultCategories = [
    { id: 1, name: "Petroleum", subcategories: [] },
    { id: 2, name: "Natural Gas", subcategories: [] },
    { id: 3, name: "Renewable Energy", subcategories: [] },
    { id: 4, name: "Markets", subcategories: [] },
    { id: 5, name: "Reports", subcategories: [] },
]

function getPublisherName(username) {
    const profile = JSON.parse(localStorage.getItem("oilpulse_admin_profile") || "{}")
    return profile.displayName || username || ""
}

function getCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed
    }
    return defaultCategories
}

const inputCls = "w-full border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-3 py-2 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
const inputCls4 = "w-full border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-3 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
const selectCls = "w-full border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white px-4 py-3 text-sm outline-none focus:border-amber-400 rounded-lg"

// Drive Preview Component
function DrivePreview({ fileId, type }) {
    return (
        <div className="mt-2 rounded-xl overflow-hidden border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            {type === "image" ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                        src={`https://drive.google.com/file/d/${fileId}/preview`}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                        title="Image Preview"
                        allow="autoplay"
                    />
                </div>
            ) : type === "video" ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                        src={`https://drive.google.com/file/d/${fileId}/preview`}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                        title="Video Preview"
                        allow="autoplay"
                        allowFullScreen
                    />
                </div>
            ) : type === "audio" ? (
                <iframe
                    src={`https://drive.google.com/file/d/${fileId}/preview`}
                    className="w-full" style={{ height: "80px", border: "none" }}
                    title="Audio Preview"
                    allow="autoplay"
                />
            ) : type === "pdf" ? (
                <iframe
                    src={`https://drive.google.com/file/d/${fileId}/preview`}
                    className="w-full" style={{ height: "300px", border: "none" }}
                    title="PDF Preview"
                />
            ) : null}
            <div className="px-3 py-2 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-t border-blue-100 dark:border-blue-800">
                <span>☁️</span>
                <span>Google Drive — File detected successfully</span>
                <a href={`https://drive.google.com/file/d/${fileId}/view`} target="_blank" rel="noopener noreferrer"
                   className="mr-auto text-blue-500 hover:text-blue-700 font-bold flex items-center gap-1">Open ↗</a>
            </div>
        </div>
    )
}

function UrlStatus({ status }) {
    if (status === "idle") return null
    return (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mt-2 ${
                        status === "loading" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800" :
                            status === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800" :
                                status === "drive" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800" :
                                    "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800"
                    }`}>
            {status === "loading" && <>
                <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <span>Checking...</span></>}
            {status === "success" && <><span>✅</span><span>Success</span></>}
            {status === "drive" && <><span>☁️</span><span>Google Drive link valid</span></>}
            {status === "error" && <><span>❌</span><span>Failed to load — check that the file is publicly shared</span></>}
        </motion.div>
    )
}

// Media Drop Zone
function MediaDropZone({ accept, onFile, children, className = "" }) {
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef(null)

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) onFile(file)
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true)
    }
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true)
    }
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false)
    }

    return (
        <div
            onDrop={handleDrop} onDragOver={handleDragOver}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl cursor-pointer transition-all text-center py-8 px-4 ${
                dragging
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 scale-[1.01]"
                    : "border-gray-300 dark:border-stone-600 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-gray-50 dark:hover:bg-stone-700"
            } ${className}`}
        >
            <input ref={inputRef} type="file" accept={accept} className="hidden"
                   onChange={(e) => {
                       if (e.target.files?.[0]) {
                           onFile(e.target.files[0]);
                           e.target.value = ""
                       }
                   }}/>
            {children(dragging)}
        </div>
    )
}

// Smart URL Input
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
        if (result.source === "google-drive") setUrlStatus("drive")
        else if (result.type === "image") setUrlStatus("loading")
        else setUrlStatus("success")
    }

    const clear = () => {
        setInputVal("");
        setApplied(false);
        setUrlStatus("idle");
        onChange("")
    }
    const effectiveType = blockType || info?.type || "link"

    return (
        <div>
            <div className="flex gap-2">
                <input type="text" value={inputVal}
                       onChange={(e) => {
                           setInputVal(e.target.value);
                           if (applied) {
                               setApplied(false);
                               setUrlStatus("idle")
                           }
                       }}
                       onKeyDown={(e) => e.key === "Enter" && apply()}
                       className="flex-1 border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-3 py-2 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
                       placeholder={placeholder}
                />
                {!applied
                    ? <button type="button" onClick={apply}
                              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 text-xs rounded-lg transition-colors whitespace-nowrap">Apply ✓</button>
                    : <button type="button" onClick={clear}
                              className="border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-4 text-xs rounded-lg transition-colors whitespace-nowrap">Clear ✕</button>
                }
            </div>

            {applied && value && info?.source === "google-drive" && info?.fileId && (
                <><UrlStatus status={urlStatus}/><DrivePreview fileId={info.fileId} type={effectiveType}/></>
            )}
            {applied && value && info?.source === "youtube" && (
                <><UrlStatus status="success"/>
                    <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black">
                        <iframe src={info.converted} className="w-full h-full" allowFullScreen title="Video"/>
                    </div>
                </>
            )}
            {applied && value && info?.source === "direct" && info?.type === "image" && (
                <><UrlStatus status={urlStatus}/>
                    <div className="mt-2 relative rounded-xl overflow-hidden">
                        <img src={info.converted} alt="Preview" className="w-full h-44 object-cover rounded-xl"
                             onLoad={() => setUrlStatus("success")} onError={() => setUrlStatus("error")}/>
                        {urlStatus === "loading" && (
                            <div className="absolute inset-0 bg-gray-100 dark:bg-stone-700 rounded-xl flex items-center justify-center">
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
                <><UrlStatus status="success"/>
                    <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black">
                        <video controls className="w-full h-full">
                            <source src={value}/>
                        </video>
                    </div>
                </>
            )}
            {applied && value && info?.source === "direct" && info?.type === "audio" && (
                <><UrlStatus status="success"/>
                    <div className="mt-2 bg-gray-50 dark:bg-stone-700 rounded-xl p-3 border border-gray-200 dark:border-stone-600">
                        <audio controls className="w-full">
                            <source src={value}/>
                        </audio>
                    </div>
                </>
            )}
            {applied && value && info?.source === "direct" && info?.type === "pdf" && (
                <><UrlStatus status="success"/>
                    <div className="mt-2 h-64 rounded-xl overflow-hidden border border-gray-300 dark:border-stone-600">
                        <iframe src={value} className="w-full h-full" style={{ border: "none" }} title="PDF"/>
                    </div>
                </>
            )}
        </div>
    )
}

const BLOCK_TYPES = [
    { type: "text", label: "Text", icon: "¶" },
    { type: "image", label: "Image", icon: "🖼️" },
    { type: "video", label: "Video", icon: "🎬" },
    { type: "audio", label: "Audio", icon: "🎵" },
    { type: "pdf", label: "PDF", icon: "📄" },
    { type: "divider", label: "Divider", icon: "―" },
]

function createBlock(type) {
    return {
        id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        content: "",
        url: "",
        caption: ""
    }
}

// Image Drop Zone
function ImageDropZone({ value, onChange }) {
    const toast = useToast()
    const { t } = useLanguage()
    const [urlMode, setUrlMode] = useState(true)

    const processFile = (file) => {
        if (!file.type.startsWith("image/")) {
            toast.warning(t("select_image") || "Please select an image file")
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => onChange(e.target.result)
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")
    if (isLocal) return (
        <div className="relative group">
            <img src={value} alt="Preview" className="w-full h-44 object-cover rounded-xl"/>
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Uploaded</div>
            <button type="button" onClick={() => onChange("")}
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
        </div>
    )

    const tabCls = (active) => `text-xs px-3 py-1.5 border rounded-lg transition-colors ${active ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 dark:border-stone-600 text-gray-600 dark:text-stone-400 hover:border-amber-300"}`

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)} className={tabCls(!urlMode)}>📁 Upload / Drag & Drop</button>
                <button type="button" onClick={() => setUrlMode(true)} className={tabCls(urlMode)}>🔗 URL Link</button>
            </div>
            {!urlMode ? (
                <MediaDropZone accept="image/*" onFile={processFile}>
                    {(dragging) => (<>
                        <div className="text-4xl mb-3">{dragging ? "📥" : "🖼️"}</div>
                        <p className="text-sm font-bold text-gray-600 dark:text-stone-300">{dragging ? "Drop image here!" : "Drag image here or click to select"}</p>
                        <p className="text-xs text-gray-400 mt-1">JPG · PNG · WEBP · GIF</p></>)}
                </MediaDropZone>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="Paste image URL or Google Drive link..." blockType="image"/>
            )}
        </div>
    )
}

// Video Drop Zone - Fixed for local upload
function VideoDropZone({ value, onChange }) {
    const toast = useToast()
    const { t } = useLanguage()
    const [urlMode, setUrlMode] = useState(true)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState("")

    const processFile = (file) => {
        setError("")

        if (!file.type.startsWith("video/")) {
            toast.warning(t("select_video") || "Please select a video file")
            return
        }

        // Check file size - warn if > 5MB (localStorage limit)
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > 5) {
            const warningMsg = `Video file is ${fileSizeMB.toFixed(1)}MB. Large videos may fail to save due to browser storage limits. For best results, use YouTube or Google Drive links.`
            setError(warningMsg)
            toast.warning(warningMsg)
            return
        }

        // Show warning for medium files (2-5MB)
        if (fileSizeMB > 2) {
            toast.info(`Video size: ${fileSizeMB.toFixed(1)}MB. May affect performance. Consider using YouTube/Drive link.`)
        }

        // For now, store as base64 (frontend-only)
        // In production, this would upload to YouTube via backend
        const reader = new FileReader()
        reader.onload = (e) => {
            onChange(e.target.result)
            setUploadProgress(100)
            setTimeout(() => setUploadProgress(0), 1000)
            toast.success("Video uploaded (temporary - use URL for permanent storage)")
        }
        reader.onerror = () => {
            setError("Failed to read video file")
            toast.error("Failed to read video file")
        }
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100)
                setUploadProgress(progress)
            }
        }
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")
    if (isLocal) return (
        <div className="relative group rounded-xl overflow-hidden">
            <video controls className="w-full rounded-xl">
                <source src={value}/>
            </video>
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Uploaded (Local)</div>
            <div className="absolute bottom-2 left-2 right-2 bg-yellow-500 text-black text-[10px] px-2 py-1 rounded text-center">
                ⚠️ Local only - may not persist. Use URL for permanent storage.
            </div>
            <button type="button" onClick={() => onChange("")}
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
        </div>
    )

    const tabCls = (active) => `text-xs px-3 py-1.5 border rounded-lg transition-colors ${active ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 dark:border-stone-600 text-gray-600 dark:text-stone-400 hover:border-amber-300"}`

    return (
        <div className="space-y-3">
            {/* Warning banner */}

            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)} className={tabCls(!urlMode)}>📁 Upload (Limited)</button>
                <button type="button" onClick={() => setUrlMode(true)} className={tabCls(urlMode)}>🔗 YouTube / Drive URL (Recommended)</button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-2 rounded-lg">
                    ❌ {error}
                </div>
            )}

            {!urlMode ? (
                <div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mb-3">
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-center">{uploadProgress}% uploaded</p>
                        </div>
                    )}
                    <MediaDropZone accept="video/*" onFile={processFile}>
                        {(dragging) => (<>
                            <div className="text-4xl mb-3">{dragging ? "📥" : "🎬"}</div>
                            <p className="text-sm font-bold text-gray-600 dark:text-stone-300">{dragging ? "Drop video here!" : "Drag video here or click to select"}</p>
                            <p className="text-xs text-gray-400 mt-1">MP4 · MOV · AVI · WEBM (Max 5MB recommended)</p>
                            <p className="text-xs text-amber-500 mt-2">💡 Tip: Use YouTube URL for large videos</p>
                        </>)}
                    </MediaDropZone>
                </div>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="YouTube URL or Google Drive link..." blockType="video"/>
            )}
        </div>
    )
}

// Audio Drop Zone
function AudioDropZone({ value, onChange }) {
    const toast = useToast()
    const { t } = useLanguage()
    const [urlMode, setUrlMode] = useState(true)

    const processFile = (file) => {
        if (!file.type.startsWith("audio/")) {
            toast.warning(t("select_audio") || "Please select an audio file")
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => onChange(e.target.result)
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")
    if (isLocal) return (
        <div className="relative group bg-gray-50 dark:bg-stone-700 rounded-xl p-4 border border-gray-200 dark:border-stone-600">
            <audio controls className="w-full">
                <source src={value}/>
            </audio>
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Uploaded</div>
            <button type="button" onClick={() => onChange("")}
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
        </div>
    )

    const tabCls = (active) => `text-xs px-3 py-1.5 border rounded-lg transition-colors ${active ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 dark:border-stone-600 text-gray-600 dark:text-stone-400 hover:border-amber-300"}`

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)} className={tabCls(!urlMode)}>📁 Upload / Drag & Drop</button>
                <button type="button" onClick={() => setUrlMode(true)} className={tabCls(urlMode)}>🔗 URL Link</button>
            </div>
            {!urlMode ? (
                <MediaDropZone accept="audio/*" onFile={processFile}>
                    {(dragging) => (<>
                        <div className="text-4xl mb-3">{dragging ? "📥" : "🎵"}</div>
                        <p className="text-sm font-bold text-gray-600 dark:text-stone-300">{dragging ? "Drop audio here!" : "Drag audio here or click"}</p>
                        <p className="text-xs text-gray-400 mt-1">MP3 · WAV · OGG · M4A</p></>)}
                </MediaDropZone>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="Audio URL or Google Drive link..." blockType="audio"/>
            )}
        </div>
    )
}

// PDF Drop Zone
function PdfDropZone({ value, onChange }) {
    const toast = useToast()
    const { t } = useLanguage()
    const [urlMode, setUrlMode] = useState(true)

    const processFile = (file) => {
        if (file.type !== "application/pdf") {
            toast.warning(t("select_pdf") || "Please select a PDF file")
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => onChange(e.target.result)
        reader.readAsDataURL(file)
    }

    const isLocal = value?.startsWith("data:")
    if (isLocal) return (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-stone-600">
            <iframe src={value} className="w-full h-64" style={{ border: "none" }} title="PDF"/>
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Uploaded</div>
            <button type="button" onClick={() => onChange("")}
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
        </div>
    )

    const tabCls = (active) => `text-xs px-3 py-1.5 border rounded-lg transition-colors ${active ? "bg-amber-500 text-black border-amber-500" : "border-gray-300 dark:border-stone-600 text-gray-600 dark:text-stone-400 hover:border-amber-300"}`

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(false)} className={tabCls(!urlMode)}>📁 Upload / Drag & Drop</button>
                <button type="button" onClick={() => setUrlMode(true)} className={tabCls(urlMode)}>🔗 URL Link</button>
            </div>
            {!urlMode ? (
                <MediaDropZone accept=".pdf,application/pdf" onFile={processFile}>
                    {(dragging) => (<>
                        <div className="text-4xl mb-3">{dragging ? "📥" : "📄"}</div>
                        <p className="text-sm font-bold text-gray-600 dark:text-stone-300">{dragging ? "Drop PDF here!" : "Drag PDF here or click"}</p>
                        <p className="text-xs text-gray-400 mt-1">PDF only</p></>)}
                </MediaDropZone>
            ) : (
                <SmartUrlInput value={value} onChange={onChange} placeholder="PDF URL or Google Drive link..." blockType="pdf"/>
            )}
        </div>
    )
}

// Block Editor
function BlockEditor({ blocks, onChange }) {
    const dragIndexRef = useRef(null)
    const [dragVisualIdx, setDragVisualIdx] = useState(null)
    const { t } = useLanguage()

    const update = useCallback((id, changes) =>
        onChange(prev => prev.map((b) => b.id === id ? { ...b, ...changes } : b)), [onChange])

    const remove = useCallback((id) =>
        onChange(prev => prev.filter((b) => b.id !== id)), [onChange])

    const moveUp = (i) => {
        if (i === 0) return;
        onChange(prev => {
            const b = [...prev];
            [b[i - 1], b[i]] = [b[i], b[i - 1]];
            return b
        })
    }
    const moveDown = (i) => {
        onChange(prev => {
            if (i >= prev.length - 1) return prev;
            const b = [...prev];
            [b[i], b[i + 1]] = [b[i + 1], b[i]];
            return b
        })
    }

    const handleDragStart = (e, i) => {
        dragIndexRef.current = i;
        setDragVisualIdx(i);
        e.dataTransfer.effectAllowed = "move"
    }
    const handleDragOver = (e, i) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move"
        const from = dragIndexRef.current
        if (from === null || from === i) return
        onChange(prev => {
            const b = [...prev];
            const [moved] = b.splice(from, 1);
            b.splice(i, 0, moved);
            dragIndexRef.current = i;
            return b
        })
        setDragVisualIdx(i)
    }
    const handleDragEnd = () => {
        dragIndexRef.current = null;
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
                     className={`border bg-white dark:bg-stone-800 rounded-xl transition-colors ${
                         dragVisualIdx === i ? "border-amber-400 shadow-md" : "border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600"
                     }`}
                     style={{ opacity: dragVisualIdx === i ? 0.7 : 1 }}
                >
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-700 rounded-t-xl">
                        <span className="text-gray-400 dark:text-stone-500 cursor-grab active:cursor-grabbing text-base select-none">⠿</span>
                        <span className="text-xs font-bold text-gray-600 dark:text-stone-300">
                            {BLOCK_TYPES.find(t => t.type === block.type)?.icon} {BLOCK_TYPES.find(t => t.type === block.type)?.label}
                        </span>
                        <div className="flex items-center gap-1 mr-auto">
                            <button onClick={() => moveUp(i)} disabled={i === 0}
                                    className="text-gray-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 px-1.5 py-0.5 text-xs hover:bg-gray-200 dark:hover:bg-stone-600 rounded">↑</button>
                            <button onClick={() => moveDown(i)} disabled={i === blocks.length - 1}
                                    className="text-gray-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 px-1.5 py-0.5 text-xs hover:bg-gray-200 dark:hover:bg-stone-600 rounded">↓</button>
                            <button onClick={() => remove(block.id)}
                                    className="text-red-400 hover:text-white hover:bg-red-500 px-1.5 py-0.5 text-xs rounded">✕</button>
                        </div>
                    </div>

                    <div className="p-3">
                        {block.type === "text" && (
                            <textarea value={block.content}
                                      onChange={(e) => update(block.id, { content: e.target.value })}
                                      rows={4} className={`${inputCls} resize-y`}
                                      placeholder="Write your paragraph here..."/>
                        )}
                        {block.type === "divider" && (
                            <div className="py-3 text-center text-gray-400 dark:text-stone-500 text-sm select-none border border-dashed border-gray-300 dark:border-stone-600 rounded-lg">
                                ―――――― Divider ――――――
                            </div>
                        )}
                        {block.type === "image" && (
                            <div className="space-y-2">
                                {block._localFile && block.url ? (
                                    <div className="relative group">
                                        <img src={block.url} alt="Preview" className="w-full h-44 object-cover rounded-xl"/>
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Uploaded</div>
                                        <button type="button" onClick={() => update(block.id, { url: "", _localFile: false })}
                                                className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100">✕</button>
                                    </div>
                                ) : (
                                    <ImageDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })}/>
                                )}
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className={inputCls} placeholder="Caption (optional)..."/>
                            </div>
                        )}
                        {block.type === "video" && (
                            <div className="space-y-2">
                                <VideoDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })}/>
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className={inputCls} placeholder="Caption (optional)..."/>
                            </div>
                        )}
                        {block.type === "audio" && (
                            <div className="space-y-2">
                                <AudioDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })}/>
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className={inputCls} placeholder="Caption (optional)..."/>
                            </div>
                        )}
                        {block.type === "pdf" && (
                            <div className="space-y-2">
                                <PdfDropZone value={block.url} onChange={(url) => update(block.id, { url, _localFile: url?.startsWith("data:") })}/>
                                <input type="text" value={block.caption}
                                       onChange={(e) => update(block.id, { caption: e.target.value })}
                                       className={inputCls} placeholder="Caption (optional)..."/>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-stone-700">
                <p className="w-full text-xs text-gray-500 dark:text-stone-400 mb-1">+ Add block:</p>
                {BLOCK_TYPES.map((bt) => (
                    <button key={bt.type} type="button"
                            onClick={() => onChange(prev => [...prev, createBlock(bt.type)])}
                            className="flex items-center gap-1.5 text-xs border border-dashed border-gray-400 dark:border-stone-600 text-gray-600 dark:text-stone-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-3 py-2 rounded-lg transition-colors">
                        <span>{bt.icon}</span><span>{bt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

// Preview Modal
function PreviewModal({ form, blocks, onClose }) {
    const { t } = useLanguage()
    const categoryColors = {
        "Petroleum": "bg-amber-100 text-amber-700",
        "Crude Oil": "bg-amber-100 text-amber-700",
        "Natural Gas": "bg-blue-100 text-blue",
        "Renewable Energy": "bg-green-100 text-green-700",
        "Markets": "bg-red-100 text-red-700",
        "Reports": "bg-purple-100 text-purple-700",
        "OPEC+": "bg-purple-100 text-purple-700",
    }

    const renderBlock = (block) => {
        const info = convertMediaUrl(block.url)
        const fileId = info?.fileId
        switch (block.type) {
            case "text":
                return <p key={block.id} className="text-stone-700 dark:text-stone-300 leading-loose text-base whitespace-pre-line mb-6">{block.content}</p>
            case "divider":
                return <hr key={block.id} className="border-gray-200 dark:border-stone-700 my-8"/>
            case "image":
                return (
                    <figure key={block.id} className="mb-6">
                        {block._localFile ? <img src={block.url} alt={block.caption} className="w-full rounded-xl object-cover max-h-96"/>
                            : fileId ? <DrivePreview fileId={fileId} type="image"/>
                                : <img src={info?.converted || block.url} alt={block.caption} className="w-full rounded-xl object-cover max-h-96"
                                       onError={(e) => e.target.style.display = "none"}/>}
                        {block.caption && !fileId &&
                            <figcaption className="text-center text-sm text-gray-400 mt-2">{block.caption}</figcaption>}
                    </figure>
                )
            case "video":
                return (
                    <figure key={block.id} className="mb-6">
                        {fileId ? <DrivePreview fileId={fileId} type="video"/>
                            : <div className="aspect-video rounded-xl overflow-hidden bg-black">
                                {block._localFile ? <video controls className="w-full h-full">
                                        <source src={block.url}/>
                                    </video>
                                    : <iframe src={info?.converted} className="w-full h-full" allowFullScreen title={block.caption || "Video"}/>}
                            </div>}
                    </figure>
                )
            case "audio":
                return (
                    <figure key={block.id} className="mb-6 bg-gray-50 rounded-xl p-4">
                        {fileId ? <DrivePreview fileId={fileId} type="audio"/>
                            : <audio controls className="w-full">
                                <source src={block.url}/>
                            </audio>}
                    </figure>
                )
            case "pdf":
                return (
                    <figure key={block.id} className="mb-6">
                        {fileId ? <DrivePreview fileId={fileId} type="pdf"/>
                            : <iframe src={block._localFile ? block.url : info?.converted}
                                      className="w-full h-96 rounded-xl" style={{ border: "none" }} title="PDF"/>}
                    </figure>
                )
            default:
                return null
        }
    }

    const coverInfo = form.image ? convertMediaUrl(form.image) : null

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-white dark:bg-stone-950 overflow-y-auto" dir="ltr">
            <div className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-600 dark:text-stone-300">Article Preview</span>
                </div>
                <button onClick={onClose}
                        className="text-sm font-bold text-gray-500 dark:text-stone-400 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-stone-600 px-4 py-2 hover:border-gray-500 rounded-lg">✕ Close</button>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[form.category] || "bg-gray-100 text-gray-700"}`}>{t(form.category)}</span>
                    {form.subcategory && <><span className="text-gray-400 text-xs">→</span><span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">{t(form.subcategory)}</span></>}
                </div>
                <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-4 leading-snug">{form.title || <span className="text-gray-300">Article Title...</span>}</h1>
                {form.excerpt && <p className="text-lg text-gray-500 leading-relaxed mb-6 border-l-4 border-amber-400 pl-4">{form.excerpt}</p>}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-stone-700">
                    <span>✍ {form.author}</span><span>·</span>
                    <span>📅 {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                {form.image && (
                    <div className="mb-10 rounded-xl overflow-hidden">
                        {coverInfo?.fileId ? <DrivePreview fileId={coverInfo.fileId} type="image"/>
                            : <img src={coverInfo?.converted || form.image} alt={form.title} className="w-full h-96 object-cover"
                                   onError={(e) => e.target.style.display = "none"}/>}
                    </div>
                )}
                <div>
                    {blocks.length === 0 && !form.image
                        ? <div className="text-center py-16 text-gray-300 border-2 border-dashed border-gray-200 dark:border-stone-700 rounded-xl">
                            <p className="text-4xl mb-2">📝</p><p className="text-sm">No content yet</p></div>
                        : blocks.map(renderBlock)}
                </div>
            </div>
        </motion.div>
    )
}

// Cover Image Upload
function CoverImageUpload({ value, onChange }) {
    const { t } = useLanguage()
    return (
        <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-stone-400 mb-3 tracking-widest">{t("cover_image")}</label>
            <ImageDropZone value={value} onChange={onChange}/>
        </div>
    )
}

// Main Form
export default function ArticleForm({ user, isEdit = false }) {
    const navigate = useNavigate()
    const { id } = useParams()
    const toast = useToast()
    const { lang, t } = useLanguage()
    const isRtl = lang === "ar"

    const categories = getCategories()

    const [form, setForm] = useState({
        title: "",
        category: categories[0]?.name || "",
        subcategory: "",
        excerpt: "",
        image: "",
        author: getPublisherName(user.username)
    })
    const [blocks, setBlocks] = useState([])
    const [showPreview, setShowPreview] = useState(false)

    const selectedCat = categories.find((c) => c.name === form.category)
    const subcategories = selectedCat?.subcategories || []

    const handleBlocksChange = useCallback((updater) => {
        if (typeof updater === "function") setBlocks(updater)
        else setBlocks(updater)
    }, [])

    useEffect(() => {
        if (isEdit && id) {
            const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
            const article = articles.find((a) => a.id === parseInt(id))
            if (article) {
                setForm({
                    title: article.title || "",
                    category: article.category || categories[0]?.name || "",
                    subcategory: article.subcategory || "",
                    excerpt: article.excerpt || "",
                    image: article.image || "",
                    author: article.author || getPublisherName(user.username)
                })
                setBlocks(article.blocks || [])
            }
        }
    }, [isEdit, id, user.username])

    const handleChange = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value, ...(field === "category" ? { subcategory: "" } : {}) }))

    const handleSubmit = () => {
        if (!form.title.trim()) {
            toast.warning(t("title_required") || "Article title is required")
            return
        }

        const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")

        const articleData = {
            ...form,
            blocks,
            body: blocks.filter(b => b.type === "text").map(b => b.content).join("\n\n"),
            publishedBy: user.username
        }

        if (isEdit) {
            localStorage.setItem("oilpulse_articles", JSON.stringify(articles.map((a) => a.id === parseInt(id) ? { ...a, ...articleData } : a)))
            toast.success(lang === "ar" ? "تم تعديل الخبر بنجاح" : "Article updated successfully")
        } else {
            localStorage.setItem("oilpulse_articles", JSON.stringify([{
                ...articleData,
                id: Date.now(),
                date: new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }),
                featured: articles.length === 0
            }, ...articles]))
            toast.success(lang === "ar" ? "تم نشر الخبر بنجاح" : "Article published successfully")
        }

        setTimeout(() => navigate("/admin/dashboard/articles"), 1500)
    }

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black text-stone-900 dark:text-white">
                    {isEdit ? (lang === "ar" ? "تعديل الخبر" : "Edit Article") : t("add_article")}
                </h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowPreview(true)}
                            className="border border-gray-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-amber-400 hover:text-amber-600 px-5 py-2 text-sm font-bold rounded-lg transition-colors">
                        👁 {lang === "ar" ? "معاينة" : "Preview"}
                    </button>
                    <button onClick={() => navigate("/admin/dashboard/articles")}
                            className="text-sm text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-200">
                        {t("back")}
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700">
                    <label className="block text-xs font-bold text-gray-600 dark:text-stone-400 mb-2 tracking-widest">
                        {lang === "ar" ? "عنوان الخبر *" : "Article Title *"}
                    </label>
                    <input type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)}
                           className={inputCls4}
                           placeholder={lang === "ar" ? "أدخل عنوان الخبر..." : "Enter title..."}/>
                </div>

                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700 grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-stone-400 mb-2 tracking-widest">
                            {lang === "ar" ? "التصنيف الرئيسي *" : "Main Category *"}
                        </label>
                        <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className={selectCls}>
                            {categories.map((cat) => <option key={cat.id} value={cat.name}>{t(cat.name)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-stone-400 mb-2 tracking-widest">
                            {lang === "ar" ? "التصنيف الفرعي (اختياري)" : "Subcategory (Optional)"}
                        </label>
                        <select value={form.subcategory || ""} onChange={(e) => handleChange("subcategory", e.target.value)}
                                disabled={subcategories.length === 0} className={`${selectCls} disabled:opacity-40`}>
                            <option value="">{subcategories.length === 0 ? (lang === "ar" ? "لا توجد تصنيفات فرعية" : "No subcategories") : (lang === "ar" ? "بدون تصنيف فرعي" : "No subcategory")}</option>
                            {subcategories.map((sub) => <option key={sub} value={sub}>{t(sub)}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700">
                    <label className="block text-xs font-bold text-gray-600 dark:text-stone-400 mb-2 tracking-widest">
                        {lang === "ar" ? "مقدمة الخبر" : "Excerpt"}
                    </label>
                    <input type="text" value={form.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)}
                           className={inputCls4}
                           placeholder={lang === "ar" ? "جملة مختصرة تظهر في بطاقة الخبر..." : "Short summary..."}/>
                </div>

                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700">
                    <CoverImageUpload value={form.image} onChange={(val) => handleChange("image", val)}/>
                </div>

                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700">
                    <div className="flex items-center gap-3 mb-4">
                        <label className="text-xs font-bold text-gray-600 dark:text-stone-400 tracking-widest">
                            {lang === "ar" ? "محتوى الخبر" : "Article Content"}
                        </label>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
                        <span className="text-xs text-gray-500 dark:text-stone-400 bg-gray-100 dark:bg-stone-700 px-2 py-0.5 rounded-full border border-gray-200 dark:border-stone-600">
                            {blocks.length} {lang === "ar" ? "كتلة" : "blocks"}
                        </span>
                    </div>
                    <BlockEditor blocks={blocks} onChange={handleBlocksChange}/>
                </div>

                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700">
                    <label className="block text-xs font-bold text-gray-600 dark:text-stone-400 mb-2 tracking-widest">
                        {lang === "ar" ? "الاسم الظاهر للقراء" : "Public Display Name"}
                    </label>
                    <div className="w-full border border-gray-200 dark:border-stone-600 bg-gray-50 dark:bg-stone-700 px-4 py-3 text-sm flex items-center justify-between rounded-lg">
                        <span className="font-semibold text-stone-700 dark:text-stone-200">{form.author}</span>
                        <span className="text-xs text-gray-500 dark:text-stone-400 bg-gray-200 dark:bg-stone-600 px-2 py-0.5 rounded border border-gray-300 dark:border-stone-500">
                            {lang === "ar" ? "مقفل من الإعدادات" : "Locked via Settings"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 pb-8">
                    <button onClick={handleSubmit}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 text-sm tracking-widest rounded-lg">
                        {isEdit ? (lang === "ar" ? "حفظ التعديلات" : "Save Changes") : (lang === "ar" ? "نشر الخبر" : "Publish Article")}
                    </button>
                    <button onClick={() => setShowPreview(true)}
                            className="border border-gray-300 dark:border-stone-600 text-gray-600 dark:text-stone-300 hover:border-amber-400 hover:text-amber-600 px-8 py-3 text-sm font-bold rounded-lg">
                        👁 {lang === "ar" ? "معاينة" : "Preview"}
                    </button>
                    <button onClick={() => navigate("/admin/dashboard/articles")}
                            className="border border-gray-300 dark:border-stone-600 text-gray-500 dark:text-stone-400 hover:border-gray-500 px-6 py-3 text-sm rounded-lg">
                        {lang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showPreview && <PreviewModal form={form} blocks={blocks} onClose={() => setShowPreview(false)}/>}
            </AnimatePresence>
        </div>
    )
}