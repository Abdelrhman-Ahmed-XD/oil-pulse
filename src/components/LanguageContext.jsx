import {createContext, useContext, useState, useEffect, useRef} from "react"

const LanguageContext = createContext()

const translations = {
    ar: {
        urgent: "عاجل",
        oil_and_energy_1: "نفط ",
        oil_and_energy_2: "وطاقة",
        oil_energy_sub: "OIL & ENERGY",
        home: "الرئيسية",
        dark_mode: "الوضع الداكن",
        light_mode: "الوضع الفاتح",
        dashboard: "لوحة التحكم",
        admin: "مدير النظام",
        editor: "محرر",
        analytics: "الإحصاءات",
        published_news: "الأخبار المنشورة",
        add_article: "إضافة خبر جديد",
        top_news: "أبرز الأخبار",
        newsbar: "شريط الأخبار",
        manage_editors: "إدارة المحررين",
        manage_categories: "إدارة التصنيفات",
        settings: "الإعدادات",
        view_site: "عرض الموقع",
        logout: "تسجيل الخروج",
        about_desc: "بوابتكم الإخبارية المتخصصة في قطاع البترول والغاز والطاقة المتجددة. نقدم أحدث الأخبار والتقارير والتحليلات لأهل القطاع.",
        latest_news: "أحدث الأخبار",
        categories: "التصنيفات",
        privacy_policy: "سياسة الخصوصية",
        contact_us: "تواصل معنا",
        all_rights: "جميع الحقوق محفوظة © 2026 · نفط وطاقة",
        developed_by: "Developed by Abdelrhman Ahmed",
        no_news_yet: "لا توجد أخبار منشورة حتى الآن",
        no_more_news: "لا توجد أخبار إضافية حتى الآن",
        latest_news_home: "آخر الأخبار",
        article_count: "مقال",
        view_all: "عرض الكل ←",
        back: "← العودة",
        no_news_cat: "لا توجد أخبار في هذا التصنيف بعد",
        article_not_found: "المقال غير موجود",
        back_to_home: "→ العودة إلى الرئيسية",
        related_articles: "مقالات ذات صلة",
        comments: "التعليقات",
        add_comment: "أضف تعليقك",
        name_label: "الاسم *",
        email_label: "البريد الإلكتروني *",
        comment_label: "التعليق *",
        name_placeholder: "اسمك",
        email_placeholder: "example@email.com",
        comment_placeholder: "شاركنا رأيك...",
        send_comment: "إرسال التعليق ←",
        email_wont_be_published: "البريد الإلكتروني لن يظهر للعموم",
        be_first_comment: "كن أول من يعلق على هذا المقال",
        comment_success: "✓ تم إرسال تعليقك بنجاح!",
        name_required: "يرجى إدخال الاسم",
        email_required: "يرجى إدخال بريد إلكتروني صحيح",
        comment_required: "يرجى كتابة تعليقك",
        "البترول": "البترول", "نفط خام": "نفط خام",
        "الغاز الطبيعي": "الغاز الطبيعي", "غاز طبيعي": "غاز طبيعي",
        "الطاقة المتجددة": "الطاقة المتجددة", "طاقة متجددة": "طاقة متجددة",
        "الأسواق": "الأسواق", "أسواق": "أسواق",
        "تقارير": "تقارير", "أوبك+": "أوبك+",
    },
    en: {
        urgent: "Urgent",
        oil_and_energy_1: "Oil & ",
        oil_and_energy_2: "Energy",
        oil_energy_sub: "NEWS PORTAL",
        home: "Home",
        dark_mode: "Dark Mode",
        light_mode: "Light Mode",
        dashboard: "Dashboard",
        admin: "Admin",
        editor: "Editor",
        analytics: "Analytics",
        published_news: "Published News",
        add_article: "Add New Article",
        top_news: "Top News",
        newsbar: "Newsbar",
        manage_editors: "Manage Editors",
        manage_categories: "Manage Categories",
        settings: "Settings",
        view_site: "View Site",
        logout: "Logout",
        about_desc: "Your specialized news portal in the petroleum, gas, and renewable energy sector. We provide the latest news, reports, and analytics.",
        latest_news: "Latest News",
        categories: "Categories",
        privacy_policy: "Privacy Policy",
        contact_us: "Contact Us",
        all_rights: "All Rights Reserved © 2026 · Oil & Energy",
        developed_by: "Developed by Abdelrhman Ahmed",
        no_news_yet: "No news published yet",
        no_more_news: "No more news yet",
        latest_news_home: "Latest News",
        article_count: "Article(s)",
        view_all: "View All →",
        back: "Back →",
        no_news_cat: "No news in this category yet",
        article_not_found: "Article not found",
        back_to_home: "← Back to Home",
        related_articles: "Related Articles",
        comments: "Comments",
        add_comment: "Add a Comment",
        name_label: "Name *",
        email_label: "Email *",
        comment_label: "Comment *",
        name_placeholder: "Your Name",
        email_placeholder: "example@email.com",
        comment_placeholder: "Share your thoughts...",
        send_comment: "Send Comment →",
        email_wont_be_published: "Your email will not be published",
        be_first_comment: "Be the first to comment on this article",
        comment_success: "✓ Comment sent successfully!",
        name_required: "Please enter your name",
        email_required: "Please enter a valid email",
        comment_required: "Please write your comment",
        "البترول": "Petroleum", "نفط خام": "Crude Oil",
        "الغاز الطبيعي": "Natural Gas", "غاز طبيعي": "Natural Gas",
        "الطاقة المتجددة": "Renewable Energy", "طاقة متجددة": "Renewable Energy",
        "الأسواق": "Markets", "أسواق": "Markets",
        "تقارير": "Reports", "أوبك+": "OPEC+",
    }
}

// ── Google Translate ──────────────────────────────────────────
export async function translateText(text, targetLang = "en") {
    if (!text || !text.trim()) return text
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
        const res = await fetch(url)
        const data = await res.json()
        return data[0].map((item) => item[0]).join("")
    } catch {
        return text
    }
}

// ── Safe localStorage write — silently skips on quota error ──
function safeCacheSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // QuotaExceededError — ignore, translation still works, just won't be cached
    }
}

// ── Translate one article ─────────────────────────────────────
// QUOTA FIX: Only caches title + excerpt (small).
// body and blocks are translated live and NOT stored in localStorage.
export async function translateArticle(article, targetLang = "en") {
    const cacheKey = `oilpulse_trans_${article.id}_${targetLang}`

    // Try to load cached lightweight fields
    let cached = null
    try {
        const raw = localStorage.getItem(cacheKey)
        if (raw) cached = JSON.parse(raw)
    } catch { /* ignore */ }

    const translated = { ...article }

    if (cached) {
        // Use cached title/excerpt, then translate body/blocks fresh (not cached)
        translated.title   = cached.title   ?? article.title
        translated.excerpt = cached.excerpt ?? article.excerpt
    } else {
        // Translate title + excerpt, cache only these
        translated.title   = article.title   ? await translateText(article.title,   targetLang) : article.title
        translated.excerpt = article.excerpt ? await translateText(article.excerpt, targetLang) : article.excerpt
        safeCacheSet(cacheKey, { title: translated.title, excerpt: translated.excerpt })
    }

    // Always translate body + blocks live (never cached — too large)
    if (article.body) {
        translated.body = await translateText(article.body, targetLang)
    }
    if (article.blocks?.length > 0) {
        translated.blocks = await Promise.all(
            article.blocks.map(async (block) => {
                if (block.type === "text" && block.content)
                    return { ...block, content: await translateText(block.content, targetLang) }
                if (block.caption)
                    return { ...block, caption: await translateText(block.caption, targetLang) }
                return block
            })
        )
    }

    return translated
}

// ── Non-blocking translation hook ────────────────────────────
// Shows Arabic INSTANTLY, swaps in English article-by-article
// as API calls finish in the background. No spinner ever.
export function useTranslatedArticles(articles) {
    const { lang } = useLanguage()
    const [translated, setTranslated] = useState(articles)
    const abortRef = useRef(false)

    useEffect(() => {
        setTranslated(articles)
        if (lang === "ar" || !articles || articles.length === 0) return

        abortRef.current = false

        const translateInBackground = async () => {
            for (const article of articles) {
                if (abortRef.current) break
                const result = await translateArticle(article, "en")
                if (abortRef.current) break
                setTranslated((prev) =>
                    prev.map((a) => (a.id === article.id ? result : a))
                )
            }
        }

        translateInBackground()
        return () => { abortRef.current = true }
    }, [JSON.stringify(articles.map((a) => a.id)), lang])

    // Always false — callers must NOT block UI on this
    return { translatedArticles: translated, isTranslating: false }
}

// ── Provider ──────────────────────────────────────────────────
export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("oilpulse_lang") || "ar")

    useEffect(() => {
        localStorage.setItem("oilpulse_lang", lang)
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = lang
    }, [lang])

    const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"))
    const t = (key) => translations[lang]?.[key] ?? key

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)