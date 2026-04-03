// src/utils/translationUtils.js
const SEPARATOR = " ||| "

export async function translateBatch(texts, targetLang = "en") {
    const nonEmpty = texts.map((t, i) => ({ i, t })).filter(({ t }) => t && t.trim())
    if (nonEmpty.length === 0) return texts
    try {
        const joined = nonEmpty.map(({ t }) => t).join(SEPARATOR)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(joined)}`
        const res = await fetch(url)
        const data = await res.json()
        const full = data[0].map((item) => item[0]).join("")
        const parts = full.split(SEPARATOR)
        const result = [...texts]
        nonEmpty.forEach(({ i }, idx) => { result[i] = parts[idx]?.trim() ?? texts[i] })
        return result
    } catch {
        return texts
    }
}

export async function translateText(text, targetLang = "en") {
    if (!text || !text.trim()) return text
    const [result] = await translateBatch([text], targetLang)
    return result
}

function safeCacheSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { }
}

export async function translateArticle(article, targetLang = "en") {
    const cacheKey = `oilpulse_trans_${article.id}_${targetLang}`
    let cached = null
    try { const r = localStorage.getItem(cacheKey); if (r) cached = JSON.parse(r) } catch { }

    const translated = { ...article }

    if (cached) {
        translated.title   = cached.title   ?? article.title
        translated.excerpt = cached.excerpt ?? article.excerpt
    } else {
        const [title, excerpt] = await translateBatch(
            [article.title || "", article.excerpt || ""], targetLang
        )
        translated.title   = title
        translated.excerpt = excerpt
        safeCacheSet(cacheKey, { title, excerpt })
    }

    if (article.blocks?.length > 0) {
        const textContents = article.blocks.map((b) => b.type === "text" ? (b.content || "") : "")
        const captions     = article.blocks.map((b) => b.caption || "")
        const all          = await translateBatch([...textContents, ...captions], targetLang)
        const half = article.blocks.length
        translated.blocks = article.blocks.map((b, i) => ({
            ...b,
            ...(b.type === "text" && b.content ? { content: all[i] } : {}),
            ...(b.caption ? { caption: all[i + half] } : {}),
        }))
    } else if (article.body) {
        translated.body = await translateText(article.body, targetLang)
    }

    return translated
}