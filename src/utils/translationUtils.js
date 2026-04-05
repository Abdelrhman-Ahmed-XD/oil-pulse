// // src/utils/translationUtils.js
// // ─────────────────────────────────────────────────────────────
// // All translation goes through LibreTranslate (libretranslate.de).
// // No API key required. Falls back silently on network errors.
// //
// // CACHING STRATEGY:
// //   • UI strings (categories, labels)  → sessionStorage  (cleared on tab close)
// //   • Article title + excerpt          → localStorage    (persists, keyed by content hash)
// //   • Article body blocks              → localStorage    (persists, keyed by content hash)
// //
// //   Content-hash keys mean: if the admin edits an article, the old
// //   cache is automatically bypassed and fresh translation is fetched.
// // ─────────────────────────────────────────────────────────────
//
// const LT_URL    = "https://libretranslate.de/translate"
// const SEPARATOR = " ||| "
//
// // ── Tiny hash so cache keys reflect actual content ────────────
// function simpleHash(str) {
//     let h = 0
//     for (let i = 0; i < str.length; i++) {
//         h = Math.imul(31, h) + str.charCodeAt(i) | 0
//     }
//     return (h >>> 0).toString(36)
// }
//
// // ── Storage helpers ───────────────────────────────────────────
// function cacheGet(key, storage = localStorage) {
//     try {
//         const raw = storage.getItem(key)
//         return raw ? JSON.parse(raw) : null
//     } catch { return null }
// }
//
// function cacheSet(key, value, storage = localStorage) {
//     try { storage.setItem(key, JSON.stringify(value)) } catch { }
// }
//
// // ── Core LibreTranslate call ──────────────────────────────────
// async function ltTranslate(text) {
//     if (!text || !text.trim()) return text
//     const res = await fetch(LT_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             q: text,
//             source: "ar",
//             target: "en",
//             format: "text",
//         }),
//     })
//     if (!res.ok) throw new Error(`LibreTranslate ${res.status}`)
//     const data = await res.json()
//     return data.translatedText || text
// }
//
// // ── Batch translate (joins with separator → one API call) ─────
// export async function translateBatch(texts, targetLang = "en") {
//     const nonEmpty = texts.map((t, i) => ({ i, t })).filter(({ t }) => t && t.trim())
//     if (nonEmpty.length === 0 || targetLang !== "en") return texts
//
//     try {
//         const joined     = nonEmpty.map(({ t }) => t).join(SEPARATOR)
//         const translated = await ltTranslate(joined)
//         const parts      = translated.split(SEPARATOR)
//         const result     = [...texts]
//         nonEmpty.forEach(({ i }, idx) => {
//             result[i] = parts[idx]?.trim() ?? texts[i]
//         })
//         return result
//     } catch {
//         return texts // silent fallback — show Arabic
//     }
// }
//
// // ── Translate a single string ─────────────────────────────────
// export async function translateText(text, targetLang = "en") {
//     if (!text || !text.trim() || targetLang !== "en") return text
//     const key    = `lt_ui_${simpleHash(text)}`
//     const cached = cacheGet(key, sessionStorage)
//     if (cached) return cached
//     try {
//         const result = await ltTranslate(text)
//         cacheSet(key, result, sessionStorage)
//         return result
//     } catch { return text }
// }
//
// // ── Translate a full article object ──────────────────────────
// // Cache key = content hash → edits auto-bust the cache.
// export async function translateArticle(article, targetLang = "en") {
//     if (targetLang !== "en") return article
//
//     const translated = { ...article }
//
//     // Title + excerpt
//     const teHash     = simpleHash((article.title || "") + (article.excerpt || ""))
//     const teCacheKey = `lt_te_${article.id}_${teHash}`
//     const teCached   = cacheGet(teCacheKey)
//
//     if (teCached) {
//         translated.title   = teCached.title   ?? article.title
//         translated.excerpt = teCached.excerpt ?? article.excerpt
//     } else {
//         try {
//             const [title, excerpt] = await translateBatch(
//                 [article.title || "", article.excerpt || ""], targetLang
//             )
//             translated.title   = title
//             translated.excerpt = excerpt
//             cacheSet(teCacheKey, { title, excerpt })
//         } catch { /* keep Arabic */ }
//     }
//
//     // Body blocks
//     if (article.blocks?.length > 0) {
//         const blockHash  = simpleHash(article.blocks.map(b => (b.content || "") + (b.caption || "")).join(""))
//         const blockKey   = `lt_blocks_${article.id}_${blockHash}`
//         const blockCached = cacheGet(blockKey)
//
//         if (blockCached) {
//             translated.blocks = blockCached
//         } else {
//             try {
//                 const textContents = article.blocks.map(b => b.type === "text" ? (b.content || "") : "")
//                 const captions     = article.blocks.map(b => b.caption || "")
//                 const all          = await translateBatch([...textContents, ...captions], targetLang)
//                 const half         = article.blocks.length
//                 const blocks       = article.blocks.map((b, i) => ({
//                     ...b,
//                     ...(b.type === "text" && b.content ? { content: all[i] }       : {}),
//                     ...(b.caption                       ? { caption: all[i + half] } : {}),
//                 }))
//                 translated.blocks = blocks
//                 cacheSet(blockKey, blocks)
//             } catch { /* keep Arabic blocks */ }
//         }
//     } else if (article.body) {
//         const bodyHash  = simpleHash(article.body)
//         const bodyKey   = `lt_body_${article.id}_${bodyHash}`
//         const bodyCached = cacheGet(bodyKey)
//         if (bodyCached) {
//             translated.body = bodyCached
//         } else {
//             try {
//                 const result = await ltTranslate(article.body)
//                 translated.body = result
//                 cacheSet(bodyKey, result)
//             } catch { /* keep Arabic body */ }
//         }
//     }
//
//     return translated
// }
//
// // ── Translate a dynamic UI string (admin-added category name) ─
// // sessionStorage: fast within session, no stale accumulation.
// export async function translateUIString(text, targetLang = "en") {
//     if (!text || targetLang !== "en") return text
//     const key    = `lt_ui_${simpleHash(text)}`
//     const cached = cacheGet(key, sessionStorage)
//     if (cached) return cached
//     try {
//         const result = await ltTranslate(text)
//         cacheSet(key, result, sessionStorage)
//         return result
//     } catch { return text }
// }
//
//


// src/utils/translationUtils.js
// ─────────────────────────────────────────────────────────────
// Uses Google Translate unofficial API — works from browser,
// no API key needed, same endpoint your code originally used.
//
// CACHING:
//   • Article title + excerpt → localStorage (content-hash key)
//   • Article body            → localStorage (content-hash key)
//   • UI strings              → sessionStorage (cleared on tab close)
//
// Content-hash keys: if admin edits article, old cache is bypassed
// automatically without any manual invalidation.
// ─────────────────────────────────────────────────────────────

const SEPARATOR = " ||| "

// ── Tiny hash so cache keys reflect actual content ────────────
function simpleHash(str) {
    let h = 0
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(31, h) + str.charCodeAt(i) | 0
    }
    return (h >>> 0).toString(36)
}

// ── Storage helpers ───────────────────────────────────────────
function cacheGet(key, storage = localStorage) {
    try {
        const raw = storage.getItem(key)
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

function cacheSet(key, value, storage = localStorage) {
    try { storage.setItem(key, JSON.stringify(value)) } catch { }
}

// ── Core Google Translate call ────────────────────────────────
async function googleTranslate(text, targetLang = "en") {
    if (!text || !text.trim()) return text
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res  = await fetch(url)
    const data = await res.json()
    return data[0].map((item) => item[0]).join("") || text
}

// ── Batch translate (one API call for multiple strings) ───────
export async function translateBatch(texts, targetLang = "en") {
    const nonEmpty = texts.map((t, i) => ({ i, t })).filter(({ t }) => t && t.trim())
    if (nonEmpty.length === 0) return texts
    try {
        const joined     = nonEmpty.map(({ t }) => t).join(SEPARATOR)
        const translated = await googleTranslate(joined, targetLang)
        const parts      = translated.split(SEPARATOR)
        const result     = [...texts]
        nonEmpty.forEach(({ i }, idx) => {
            result[i] = parts[idx]?.trim() ?? texts[i]
        })
        return result
    } catch {
        return texts
    }
}

// ── Translate a single string ─────────────────────────────────
export async function translateText(text, targetLang = "en") {
    if (!text || !text.trim()) return text
    const key    = `oilpulse_ui_${simpleHash(text)}_${targetLang}`
    const cached = cacheGet(key, sessionStorage)
    if (cached) return cached
    try {
        const result = await googleTranslate(text, targetLang)
        cacheSet(key, result, sessionStorage)
        return result
    } catch { return text }
}

// ── Translate a full article object ──────────────────────────
// Cache key = content hash → edits auto-bust the cache.
export async function translateArticle(article, targetLang = "en") {
    if (targetLang !== "en") return article

    const translated = { ...article }

    // Title + excerpt
    const teHash     = simpleHash((article.title || "") + (article.excerpt || ""))
    const teCacheKey = `oilpulse_te_${article.id}_${teHash}`
    const teCached   = cacheGet(teCacheKey)

    if (teCached) {
        translated.title   = teCached.title   ?? article.title
        translated.excerpt = teCached.excerpt ?? article.excerpt
    } else {
        try {
            const [title, excerpt] = await translateBatch(
                [article.title || "", article.excerpt || ""], targetLang
            )
            translated.title   = title
            translated.excerpt = excerpt
            cacheSet(teCacheKey, { title, excerpt })
        } catch { /* keep Arabic */ }
    }

    // Body blocks
    if (article.blocks?.length > 0) {
        const blockHash   = simpleHash(article.blocks.map(b => (b.content || "") + (b.caption || "")).join(""))
        const blockKey    = `oilpulse_blocks_${article.id}_${blockHash}`
        const blockCached = cacheGet(blockKey)

        if (blockCached) {
            translated.blocks = blockCached
        } else {
            try {
                const textContents = article.blocks.map(b => b.type === "text" ? (b.content || "") : "")
                const captions     = article.blocks.map(b => b.caption || "")
                const all          = await translateBatch([...textContents, ...captions], targetLang)
                const half         = article.blocks.length
                const blocks       = article.blocks.map((b, i) => ({
                    ...b,
                    ...(b.type === "text" && b.content ? { content: all[i] }        : {}),
                    ...(b.caption                       ? { caption: all[i + half] } : {}),
                }))
                translated.blocks = blocks
                cacheSet(blockKey, blocks)
            } catch { /* keep Arabic */ }
        }
    } else if (article.body) {
        const bodyHash   = simpleHash(article.body)
        const bodyKey    = `oilpulse_body_${article.id}_${bodyHash}`
        const bodyCached = cacheGet(bodyKey)
        if (bodyCached) {
            translated.body = bodyCached
        } else {
            try {
                const result = await googleTranslate(article.body, targetLang)
                translated.body = result
                cacheSet(bodyKey, result)
            } catch { /* keep Arabic */ }
        }
    }

    return translated
}

// ── Translate a dynamic UI string (admin-added category name) ─
export async function translateUIString(text, targetLang = "en") {
    if (!text || targetLang !== "en") return text
    const key    = `oilpulse_ui_${simpleHash(text)}_${targetLang}`
    const cached = cacheGet(key, sessionStorage)
    if (cached) return cached
    try {
        const result = await googleTranslate(text, targetLang)
        cacheSet(key, result, sessionStorage)
        return result
    } catch { return text }
}


