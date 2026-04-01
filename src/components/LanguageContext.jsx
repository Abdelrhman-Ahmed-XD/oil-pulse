import {createContext, useContext, useState, useEffect, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"

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
        developed_by: "تطوير عبدالرحمن أحمد",
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
        // Analytics
        analytics_title_admin: "لوحة الإحصاءات",
        analytics_title_editor: "إحصاءاتي",
        analytics_sub_admin: "نظرة عامة على أداء الموقع",
        total_articles: "إجمالي المقالات",
        total_views: "إجمالي المشاهدات",
        total_comments: "إجمالي التعليقات",
        avg_views: "متوسط المشاهدات",
        most_viewed: "الأكثر مشاهدةً",
        category_dist: "توزيع التصنيفات",
        latest_articles: "آخر المقالات",
        by_publisher: "المقالات حسب الناشر",
        manage_comments: "إدارة التعليقات",
        no_articles_yet: "لا توجد مقالات بعد",
        no_comments_yet: "لا توجد تعليقات بعد",
        view_article: "عرض المقال",
        delete: "حذف",
        views_label: "مشاهدة",
        confirm_delete_comment: "هل أنت متأكد من حذف هذا التعليق؟",
        comment_deleted: "تم حذف التعليق",
        // EditorsList
        manage_editors_title: "إدارة المحررين",
        add_editor: "إضافة محرر جديد",
        username_label: "اسم المستخدم",
        full_name_label: "الاسم الكامل",
        email_req: "البريد الإلكتروني مطلوب",
        password_req: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        username_req: "اسم المستخدم مطلوب",
        username_taken: "اسم المستخدم مستخدم بالفعل",
        email_taken: "البريد الإلكتروني مستخدم بالفعل",
        add_editor_btn: "+ إضافة محرر",
        change_password: "تغيير كلمة المرور",
        save: "حفظ",
        cancel: "إلغاء",
        no_editors_yet: "لا يوجد محررون بعد",
        role_editor: "محرر",
        // AdminBar
        new_article: "خبر جديد",
        control_panel: "لوحة التحكم",
        role_admin: "مدير",
        // Privacy
        privacy_title: "سياسة الخصوصية",
        privacy_sub: "نحن في موقع نفط وطاقة نلتزم بحماية خصوصيتكم وضمان أمان بياناتكم الشخصية.",
        privacy_toc: "محتويات السياسة",
        privacy_priority: "خصوصيتكم أولويتنا",
        privacy_footer: "إذا كان لديكم أي استفسار حول هذه السياسة، تواصلوا معنا وسنكون سعداء بالإجابة على جميع أسئلتكم.",
        back_to_site: "العودة للموقع",
        // Category names
        "البترول": "البترول", "نفط خام": "نفط خام",
        "الغاز الطبيعي": "الغاز الطبيعي", "غاز طبيعي": "غاز طبيعي",
        "الطاقة المتجددة": "الطاقة المتجددة", "طاقة متجددة": "طاقة متجددة",
        "الأسواق": "الأسواق", "أسواق": "أسواق",
        "تقارير": "تقارير", "أوبك+": "أوبك+",
    },
    en: {
        urgent: "Breaking",
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
        // Analytics
        analytics_title_admin: "Analytics Dashboard",
        analytics_title_editor: "My Analytics",
        analytics_sub_admin: "Site performance overview",
        total_articles: "Total Articles",
        total_views: "Total Views",
        total_comments: "Total Comments",
        avg_views: "Avg. Views",
        most_viewed: "Most Viewed",
        category_dist: "Category Breakdown",
        latest_articles: "Latest Articles",
        by_publisher: "Articles by Publisher",
        manage_comments: "Manage Comments",
        no_articles_yet: "No articles yet",
        no_comments_yet: "No comments yet",
        view_article: "View Article",
        delete: "Delete",
        views_label: "views",
        confirm_delete_comment: "Are you sure you want to delete this comment?",
        comment_deleted: "Comment deleted",
        // EditorsList
        manage_editors_title: "Manage Editors",
        add_editor: "Add New Editor",
        username_label: "Username",
        full_name_label: "Full Name",
        email_req: "Email is required",
        password_req: "Password must be at least 6 characters",
        username_req: "Username is required",
        username_taken: "Username already taken",
        email_taken: "Email already in use",
        add_editor_btn: "+ Add Editor",
        change_password: "Change Password",
        save: "Save",
        cancel: "Cancel",
        no_editors_yet: "No editors yet",
        role_editor: "Editor",
        // AdminBar
        new_article: "New Article",
        control_panel: "Dashboard",
        role_admin: "Admin",
        // Privacy
        privacy_title: "Privacy Policy",
        privacy_sub: "At Oil & Energy, we are committed to protecting your privacy and the security of your personal data.",
        privacy_toc: "Table of Contents",
        privacy_priority: "Your Privacy is Our Priority",
        privacy_footer: "If you have any questions about this policy, contact us and we'll be happy to answer.",
        back_to_site: "Back to Site",
        // Category names
        "البترول": "Petroleum", "نفط خام": "Crude Oil",
        "الغاز الطبيعي": "Natural Gas", "غاز طبيعي": "Natural Gas",
        "الطاقة المتجددة": "Renewable Energy", "طاقة متجددة": "Renewable Energy",
        "الأسواق": "Markets", "أسواق": "Markets",
        "تقارير": "Reports", "أوبك+": "OPEC+",
    }
}

// ── Google Translate — batch multiple strings in one API call ─
// Much faster than one-by-one: sends all text joined by a unique
// separator, gets back all translations in one round trip.
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
        nonEmpty.forEach(({ i }, idx) => {
            result[i] = parts[idx]?.trim() ?? texts[i]
        })
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

// ── Safe localStorage write ───────────────────────────────────
function safeCacheSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota — skip */ }
}

// ── Translate one article — batch all fields in ONE API call ──
export async function translateArticle(article, targetLang = "en") {
    const cacheKey = `oilpulse_trans_${article.id}_${targetLang}`
    let cached = null
    try { const r = localStorage.getItem(cacheKey); if (r) cached = JSON.parse(r) } catch { }

    const translated = { ...article }

    // ── Headline fields — cacheable (small) ──────────────────
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

    // ── Body blocks — live, NOT cached (too large for localStorage) ─
    if (article.blocks?.length > 0) {
        const textBlocks  = article.blocks.map((b) => b.type === "text" ? (b.content || "") : "")
        const captions    = article.blocks.map((b) => b.caption || "")
        const allStrings  = [...textBlocks, ...captions]
        const translated_ = await translateBatch(allStrings, targetLang)
        const half = article.blocks.length
        translated.blocks = article.blocks.map((b, i) => ({
            ...b,
            ...(b.type === "text" && b.content ? { content: translated_[i] } : {}),
            ...(b.caption ? { caption: translated_[i + half] } : {}),
        }))
    } else if (article.body) {
        translated.body = await translateText(article.body, targetLang)
    }

    return translated
}

// ── Non-blocking translation hook ────────────────────────────
// Shows Arabic INSTANTLY, translates ALL articles in parallel
// (Promise.all), updates state once when all done.
// A tiny indicator in the UI shows progress without blocking.
export function useTranslatedArticles(articles) {
    const { lang, setTranslatingCount, setTotalCount } = useLanguage()
    const [translated, setTranslated] = useState(articles)
    const abortRef = useRef(false)

    useEffect(() => {
        setTranslated(articles)
        if (lang === "ar" || !articles || articles.length === 0) {
            setTranslatingCount(0)
            setTotalCount(0)
            return
        }

        abortRef.current = false
        setTotalCount(articles.length)
        setTranslatingCount(articles.length)

        // Translate ALL articles in parallel — much faster than sequential
        let doneCount = 0
        const promises = articles.map(async (article) => {
            const result = await translateArticle(article, "en")
            if (!abortRef.current) {
                doneCount++
                setTranslatingCount((prev) => Math.max(0, prev - 1))
                // Update this article in state immediately as it finishes
                setTranslated((prev) => prev.map((a) => a.id === article.id ? result : a))
            }
            return result
        })

        Promise.all(promises).then(() => {
            if (!abortRef.current) setTranslatingCount(0)
        })

        return () => { abortRef.current = true }
    }, [JSON.stringify(articles.map((a) => a.id)), lang])

    return { translatedArticles: translated, isTranslating: false }
}

// ── Translation progress indicator ───────────────────────────
// Small pill at the bottom of the screen, non-blocking.
export function TranslationIndicator() {
    const { translatingCount, totalCount, lang } = useLanguage()
    const isActive = lang === "en" && translatingCount > 0 && totalCount > 0
    const done = totalCount - translatingCount
    const pct = totalCount > 0 ? Math.round((done / totalCount) * 100) : 0

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed bottom-5 right-5 z-[300] flex items-center gap-3 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl shadow-black/30 pointer-events-none"
                >
                    {/* Spinner */}
                    <svg className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                        <span className="text-stone-400">Translating</span>
                        <div className="w-20 h-1 bg-stone-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-amber-400 rounded-full"
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-amber-400 tabular-nums">{done}/{totalCount}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ── Provider ──────────────────────────────────────────────────
export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("oilpulse_lang") || "ar")
    const [translatingCount, setTranslatingCount] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        localStorage.setItem("oilpulse_lang", lang)
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = lang
        // Reset indicator when switching language
        setTranslatingCount(0)
        setTotalCount(0)
    }, [lang])

    const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"))
    const t = (key) => translations[lang]?.[key] ?? key

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t, setTranslatingCount, setTotalCount, translatingCount, totalCount }}>
            {children}
            <TranslationIndicator />
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)