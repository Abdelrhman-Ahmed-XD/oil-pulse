import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../components/LanguageContext"

// Map Arabic category names to English
const categoryToEnglish = {
    "الأسواق": "Markets",
    "أسواق": "Markets",
    "تقارير": "Reports",
    "تقرير": "Reports",
    "البترول": "Petroleum",
    "نفط خام": "Crude Oil",
    "الغاز الطبيعي": "Natural Gas",
    "غاز طبيعي": "Natural Gas",
    "الطاقة المتجددة": "Renewable Energy",
    "طاقة متجددة": "Renewable Energy",
    "أوبك+": "OPEC+",
    "أولك": "OPEC+",
    "اولك": "OPEC+",
}

// Category colors for badges
const categoryColors = {
    "Petroleum": "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300",
    "Crude Oil": "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300",
    "Natural Gas": "bg-blue-100 text-blue-800 dark:bg-blue-400/20 dark:text-blue-300",
    "Renewable Energy": "bg-green-100 text-green-800 dark:bg-green-400/20 dark:text-green-300",
    "Markets": "bg-red-100 text-red-800 dark:bg-red-400/20 dark:text-red-300",
    "Reports": "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
    "OPEC+": "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
}

// Format date function
const formatDate = (dateStr, lang) => {
    if (!dateStr) return ""

    if (lang === "en") {
        if (dateStr.includes("January") || dateStr.includes("February") || dateStr.includes("March") ||
            dateStr.includes("April") || dateStr.includes("May") || dateStr.includes("June") ||
            dateStr.includes("July") || dateStr.includes("August") || dateStr.includes("September") ||
            dateStr.includes("October") || dateStr.includes("November") || dateStr.includes("December")) {
            return dateStr
        }

        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        let converted = dateStr
        arabicNumbers.forEach((a, i) => {
            converted = converted.replace(new RegExp(a, 'g'), englishNumbers[i])
        })

        const monthMap = {
            'يناير': 'January', 'فبراير': 'February', 'مارس': 'March',
            'أبريل': 'April', 'مايو': 'May', 'يونيو': 'June',
            'يوليو': 'July', 'أغسطس': 'August', 'سبتمبر': 'September',
            'أكتوبر': 'October', 'نوفمبر': 'November', 'ديسمبر': 'December'
        }

        const parts = converted.split(' ')
        if (parts.length === 3) {
            const day = parts[0]
            const arabicMonth = parts[1]
            const year = parts[2]
            const englishMonth = monthMap[arabicMonth] || arabicMonth
            return `${englishMonth} ${day}, ${year}`
        }
        return converted
    }
    return dateStr
}

// Get display category name (translated)
const getDisplayCategory = (category, t) => {
    const englishName = categoryToEnglish[category] || category
    return t(englishName)
}

// Get category color class
const getCategoryColor = (category) => {
    const englishName = categoryToEnglish[category] || category
    return categoryColors[englishName] || "bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-300"
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }
    })
}

function StatCard({ label, value, icon, color = "amber", i = 0 }) {
    const colors = {
        amber: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
        blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        green: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
        purple: "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
        red: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    }
    return (
        <motion.div className={`border p-4 sm:p-5 rounded-xl ${colors[color]}`}
                    initial="hidden" animate="visible" custom={i} variants={fadeUp}>
            <span className="text-xl opacity-60 block mb-2">{icon}</span>
            <p className="text-2xl sm:text-3xl font-black mb-1">{value}</p>
            <p className="text-xs font-semibold opacity-70">{label}</p>
        </motion.div>
    )
}

function SectionTitle({ title, i = 0 }) {
    return (
        <motion.div className="flex items-center gap-4 mb-4"
                    initial="hidden" animate="visible" custom={i} variants={fadeUp}>
            <span className="text-sm sm:text-base font-black tracking-widest text-stone-900 dark:text-white">{title}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
        </motion.div>
    )
}

function getAllComments(articles) {
    const all = []
    articles.forEach((a) => {
        const comments = JSON.parse(localStorage.getItem(`oilpulse_comments_${a.id}`) || "[]")
        comments.forEach((c) => all.push({ ...c, articleTitle: a.title, articleId: a.id }))
    })
    return all.sort((a, b) => b.timestamp - a.timestamp)
}

function PublisherBadge({ article }) {
    if (!article.publishedBy) return null
    return (
        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 px-2 py-0.5 rounded text-xs font-bold">
            ✏️ {article.publishedBy}
        </span>
    )
}

export default function Analytics({ user }) {
    const navigate = useNavigate()
    const { lang, t } = useLanguage()
    const isRtl = lang === "ar"
    const allArticles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
    const viewsData = JSON.parse(localStorage.getItem("oilpulse_views") || "{}")

    const myArticles = user.role === "admin"
        ? allArticles
        : allArticles.filter((a) => a.publishedBy === user.username || a.author === user.username)

    const articlesWithViews = useMemo(() =>
            myArticles.map((a) => ({ ...a, views: viewsData[a.id] || 0 })),
        [myArticles.length]
    )

    const totalViews = articlesWithViews.reduce((sum, a) => sum + a.views, 0)
    const avgViews = myArticles.length > 0 ? Math.round(totalViews / myArticles.length) : 0

    const allComments = useMemo(() => getAllComments(myArticles), [myArticles.length])
    const [comments, setComments] = useState(allComments)

    const deleteComment = (articleId, commentId) => {
        if (!confirm(t("confirm_delete_comment"))) return
        const key = `oilpulse_comments_${articleId}`
        const existing = JSON.parse(localStorage.getItem(key) || "[]")
        localStorage.setItem(key, JSON.stringify(existing.filter((c) => c.id !== commentId)))
        setComments((prev) => prev.filter((c) => !(c.id === commentId && c.articleId === articleId)))
    }

    const categoryMap = {}
    myArticles.forEach((a) => {
        const englishCat = categoryToEnglish[a.category] || a.category
        categoryMap[englishCat] = (categoryMap[englishCat] || 0) + 1
    })
    const topCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])
    const maxCatCount = topCategories[0]?.[1] || 1

    const topArticles = [...articlesWithViews].sort((a, b) => b.views - a.views).slice(0, 5)
    const latestArticles = [...myArticles].slice(0, 5)

    const publisherMap = {}
    allArticles.forEach((a) => {
        const pub = a.publishedBy || a.author || "Unknown"
        publisherMap[pub] = (publisherMap[pub] || 0) + 1
    })
    const publisherBreakdown = Object.entries(publisherMap).sort((a, b) => b[1] - a[1])

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeUp}>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                    {user.role === "admin" ? t("analytics_title_admin") : t("analytics_title_editor")}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    {user.role === "admin" ? t("analytics_sub_admin") : `${t("analytics_title_editor")} — ${user.username}`}
                </p>
            </motion.div>

            {/* Stat Cards */}
            <div className={`grid grid-cols-2 gap-3 mb-8 ${user.role === "admin" ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
                <StatCard label={t("total_articles")} value={myArticles.length} icon="📰" color="amber" i={0} />
                <StatCard label={t("total_views")} value={totalViews} icon="👁" color="blue" i={1} />
                <StatCard label={t("total_comments")} value={comments.length} icon="💬" color="purple" i={2} />
                {user.role === "admin" && <StatCard label={t("avg_views")} value={avgViews} icon="📊" color="red" i={3} />}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">

                {/* Top Articles */}
                <div>
                    <SectionTitle title={t("most_viewed")} i={5} />
                    {topArticles.length === 0 ? (
                        <div className="bg-white dark:bg-stone-800 p-8 text-center text-gray-400 text-sm rounded-xl border border-gray-200 dark:border-stone-700">{t("no_articles_yet")}</div>
                    ) : (
                        <div className="space-y-2">
                            {topArticles.map((article, i) => (
                                <motion.div key={article.id}
                                            className="bg-white dark:bg-stone-800 flex items-center gap-3 px-3 sm:px-4 py-3 cursor-pointer hover:border-amber-300 dark:hover:border-amber-600 border border-gray-200 dark:border-stone-700 rounded-xl transition-colors"
                                            initial="hidden" animate="visible" custom={i + 6} variants={fadeUp}
                                            onClick={() => navigate(`/article/${article.id}`)}>
                                    <span className="text-xl sm:text-2xl font-black text-gray-200 dark:text-stone-600 w-6 sm:w-8 shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 line-clamp-2">{article.title}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getCategoryColor(article.category)}`}>
                                                {getDisplayCategory(article.category, t)}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-stone-500">{formatDate(article.date, lang)}</span>
                                            {user.role === "admin" && <PublisherBadge article={article} />}
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-left">
                                        <p className="text-sm font-black text-amber-600 dark:text-amber-400">{article.views}</p>
                                        <p className="text-xs text-gray-400">{t("views_label")}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Category Breakdown */}
                    <div>
                        <SectionTitle title={t("category_dist")} i={5} />
                        {topCategories.length === 0 ? (
                            <div className="bg-white dark:bg-stone-800 p-6 text-center text-gray-400 text-sm rounded-xl border border-gray-200 dark:border-stone-700">No data</div>
                        ) : (
                            <div className="space-y-3">
                                {topCategories.map(([cat, count], i) => (
                                    <motion.div key={cat} initial="hidden" animate="visible" custom={i + 6} variants={fadeUp}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(cat)}`}>
                                                {getDisplayCategory(cat, t)}
                                            </span>
                                            <span className="text-xs text-gray-400">{count} {t("article_count")}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-stone-700 h-2 rounded-full">
                                            <motion.div className="bg-amber-500 h-2 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(count / maxCatCount) * 100}%` }}
                                                        transition={{ duration: 0.8, delay: i * 0.1 }} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Latest Articles */}
                    <div>
                        <SectionTitle title={t("latest_articles")} i={6} />
                        {latestArticles.length === 0 ? (
                            <div className="bg-white dark:bg-stone-800 p-6 text-center text-gray-400 text-sm rounded-xl border border-gray-200 dark:border-stone-700">{t("no_articles_yet")}</div>
                        ) : (
                            <div className="space-y-2">
                                {latestArticles.map((article, i) => (
                                    <motion.div key={article.id}
                                                className="bg-white dark:bg-stone-800 flex items-center gap-3 px-3 sm:px-4 py-3 cursor-pointer hover:border-amber-300 dark:hover:border-amber-600 border border-gray-200 dark:border-stone-700 rounded-xl transition-colors"
                                                initial="hidden" animate="visible" custom={i + 7} variants={fadeUp}
                                                onClick={() => navigate(`/article/${article.id}`)}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 line-clamp-1">{article.title}</p>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getCategoryColor(article.category)}`}>
                                                    {getDisplayCategory(article.category, t)}
                                                </span>
                                                <span className="text-xs text-gray-400 dark:text-stone-500">{formatDate(article.date, lang)}</span>
                                                <span className="text-xs text-gray-400">· {article.author}</span>
                                                {user.role === "admin" && <PublisherBadge article={article} />}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Publisher Breakdown — admin only */}
            {user.role === "admin" && publisherBreakdown.length > 0 && (
                <div className="mt-8">
                    <SectionTitle title={t("by_publisher")} i={7} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {publisherBreakdown.map(([publisher, count]) => (
                            <div key={publisher} className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl px-4 py-4 text-center">
                                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-lg mx-auto mb-2">
                                    {publisher.charAt(0).toUpperCase()}
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 truncate">{publisher}</p>
                                <p className="text-xl sm:text-2xl font-black text-amber-500 mt-1">{count}</p>
                                <p className="text-xs text-gray-400">articles</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comments */}
            <div className="mt-10">
                <SectionTitle title={`${t("manage_comments")} (${comments.length})`} i={8} />
                {comments.length === 0 ? (
                    <div className="bg-white dark:bg-stone-800 p-10 text-center text-gray-400 rounded-xl border border-gray-200 dark:border-stone-700">
                        <p className="text-3xl mb-2">💬</p>
                        <p className="text-sm">{t("no_comments_yet")}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {comments.map((comment, i) => (
                            <motion.div key={`${comment.articleId}_${comment.id}`}
                                        className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl px-4 py-4"
                                        initial="hidden" animate="visible" custom={i} variants={fadeUp}>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black shrink-0 text-sm">
                                        {comment.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="text-sm font-bold text-stone-800 dark:text-stone-100">{comment.name}</span>
                                            <span className="text-xs text-gray-400">{comment.date}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-2">{comment.body}</p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold truncate">📰 {comment.articleTitle}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-stone-700">
                                    <button onClick={() => navigate(`/article/${comment.articleId}`)}
                                            className="text-xs border border-gray-200 dark:border-stone-600 text-gray-500 dark:text-stone-400 hover:border-amber-400 hover:text-amber-600 px-3 py-1.5 rounded-lg transition-colors">
                                        {t("view_article")}
                                    </button>
                                    <button onClick={() => deleteComment(comment.articleId, comment.id)}
                                            className="text-xs border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}