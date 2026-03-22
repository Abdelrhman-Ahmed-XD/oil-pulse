import { convertMediaUrl, PLACEHOLDER_IMAGE } from "../utils/mediaUtils"
import DriveImage from "./DriveImage"

// Smart image that handles Google Drive, regular URLs, and missing images
export default function SmartImage({ src, alt, className }) {
    if (!src) {
        return <img src={PLACEHOLDER_IMAGE} alt={alt || ""} className={className} />
    }

    const info = convertMediaUrl(src)

    // Google Drive → always use DriveImage component (handles fallbacks + ☁️ card)
    if (info.source === "google-drive" && info.fileId) {
        return (
            <DriveImage
                fileId={info.fileId}
                viewUrl={info.viewUrl}
                alt={alt}
                className={className}
            />
        )
    }

    // Local base64 or direct URL
    return (
        <img
            src={info.converted || src}
            alt={alt || ""}
            className={className}
            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
        />
    )
}