// ── Shared URL converter ──────────────────────────────────────

export function extractDriveFileId(url) {
    if (!url) return null
    const patterns = [
        /drive\.google\.com\/file\/d\/([^\/\?&]+)/,
        /drive\.google\.com\/open\?.*id=([^&\?\/]+)/,
        /drive\.google\.com\/uc\?.*id=([^&\?\/]+)/,
        /id=([^&\?\/]+)/,
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

// All possible Google Drive image URL formats to try
export function getDriveImageUrls(fileId) {
    return [
        // Format 1: export=view (most common)
        `https://drive.google.com/uc?export=view&id=${fileId}`,
        // Format 2: thumbnail API
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
        // Format 3: lh3 CDN
        `https://lh3.googleusercontent.com/d/${fileId}`,
        // Format 4: export=download
        `https://drive.google.com/uc?export=download&id=${fileId}`,
    ]
}

export function convertMediaUrl(url) {
    if (!url) return { converted: url, type: "link", source: "direct" }

    // ── Google Drive ──
    const fileId = extractDriveFileId(url)

    if (fileId && url.includes("drive.google.com")) {
        const lower = url.toLowerCase()
        const isVideo = lower.includes("video") || lower.match(/\.(mp4|mov|avi|mkv)(\?|$)/)
        const isAudio = lower.includes("audio") || lower.match(/\.(mp3|wav|ogg|m4a)(\?|$)/)
        const isPdf = lower.includes("pdf") || lower.match(/\.pdf(\?|$)/)

        if (isVideo || isAudio || isPdf) {
            return {
                converted: `https://drive.google.com/file/d/${fileId}/preview`,
                type: isVideo ? "video" : isAudio ? "audio" : "pdf",
                source: "google-drive",
                fileId,
                viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
                previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
            }
        }

        // For images — primary URL is export=view
        return {
            converted: `https://drive.google.com/uc?export=view&id=${fileId}`,
            type: "image",
            source: "google-drive",
            fileId,
            viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
            previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
            // Fallback URLs to try if primary fails
            fallbackUrls: getDriveImageUrls(fileId),
        }
    }

    // ── YouTube ──
    const ytMatch =
        url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) ||
        url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) ||
        url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/)

    if (ytMatch) {
        const videoId = ytMatch[1]
        return {
            converted: `https://www.youtube.com/embed/${videoId}`,
            type: "video",
            source: "youtube",
            videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        }
    }

    // ── Direct file types ──
    const lower = url.toLowerCase().split("?")[0]
    if (lower.match(/\.(jpg|jpeg|png|webp|gif|svg)$/))
        return { converted: url, type: "image", source: "direct" }
    if (lower.match(/\.(mp4|mov|avi|mkv)$/))
        return { converted: url, type: "video", source: "direct" }
    if (lower.match(/\.(mp3|wav|ogg|aac|m4a)$/))
        return { converted: url, type: "audio", source: "direct" }
    if (lower.match(/\.pdf$/))
        return { converted: url, type: "pdf", source: "direct" }

    return { converted: url, type: "link", source: "direct" }
}

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23f5f5f4'/%3E%3Ctext x='400' y='210' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='64' fill='%23d6d3d1'%3E%F0%9F%9B%A2%EF%B8%8F%3C/text%3E%3C/svg%3E"