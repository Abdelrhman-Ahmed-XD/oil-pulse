import { useState, useEffect } from "react"
import { getDriveImageUrls } from "../utils/mediaUtils"

export default function DriveImage({ fileId, viewUrl, alt, className, onLoad, onError }) {
    const urls = getDriveImageUrls(fileId)
    const [urlIndex, setUrlIndex] = useState(0)
    const [failed, setFailed] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setUrlIndex(0)
        setFailed(false)
        setLoaded(false)
    }, [fileId])

    const handleError = () => {
        if (urlIndex < urls.length - 1) {
            setUrlIndex((prev) => prev + 1)
        } else {
            setFailed(true)
            onError?.()
        }
    }

    const handleLoad = () => {
        setLoaded(true)
        onLoad?.()
    }

    if (failed) {
        return (
            <div
                className={`flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-blue-200 ${className || ""}`}
                style={{ minHeight: "200px" }}
            >
                <div className="text-4xl mb-2">☁️</div>
                <p className="text-sm font-bold text-blue-600">صورة من Google Drive</p>
                <p className="text-xs text-gray-400 mt-1 text-center px-4">
                    تظهر بشكل كامل بعد النشر على النطاق الحقيقي
                </p>
                {viewUrl && (
                    <a
                        href={viewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-xs text-blue-500 hover:text-blue-700 font-bold border border-blue-200 px-3 py-1 rounded-lg"
                    >
                        فتح في Drive ↗
                    </a>
                )}
            </div>
        )
    }

    return (
        <div className="relative">
            {!loaded && (
                <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-2 rounded-xl z-10">
                    <svg className="animate-spin w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs text-gray-400">
            جارٍ تحميل الصورة... ({urlIndex + 1}/{urls.length})
          </span>
                </div>
            )}
            <img
                key={urls[urlIndex]}
                src={urls[urlIndex]}
                alt={alt || ""}
                className={className}
                onLoad={handleLoad}
                onError={handleError}
                style={{ opacity: loaded ? 1 : 0 }}
            />
        </div>
    )
}