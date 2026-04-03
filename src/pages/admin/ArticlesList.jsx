// src/pages/admin/ArticlesList.jsx
import { useLanguage } from "../../components/LanguageContext"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useToast } from "../../components/ToastContext"

export default function ArticlesList({ user }) {
    const navigate = useNavigate()
    const toast = useToast()
    const { t, lang } = useLanguage()
    const isRtl = lang === "ar"
    const [search, setSearch] = useState("")
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [articles, setArticles] = useState([])

    useEffect(() => {
        const allArticles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
        const filtered = user.role === "admin"
            ? allArticles
            : allArticles.filter((a) => a.publishedBy === user.username || a.author === user.username)
        setArticles(filtered)
    }, [user])

    const filtered = articles.filter((a) =>
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (id) => {
        const allArticles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
        const updated = allArticles.filter((a) => a.id !== id)
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        setConfirmDelete(null)
        setArticles(prev => prev.filter(a => a.id !== id))
        toast.success(t("article_deleted"))
    }

    const toggleFeatured = (id) => {
        const allArticles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
        const updated = allArticles.map((a) => ({ ...a, featured: a.id === id }))
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        setArticles(prev => prev.map(a => ({ ...a, featured: a.id === id })))
        toast.success(t("featured_updated"))
    }

    const formatDate = (dateStr) => {
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
            return dateStr
        }
        return dateStr
    }

    const categoryColors = {
        "Petroleum": "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300",
        "Crude Oil": "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300",
        "Natural Gas": "bg-blue-100 text-blue-800 dark:bg-blue-400/20 dark:text-blue-300",
        "Renewable Energy": "bg-green-100 text-green-800 dark:bg-green-400/20 dark:text-green-300",
        "Markets": "bg-red-100 text-red-800 dark:bg-red-400/20 dark:text-red-300",
        "Reports": "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
        "OPEC+": "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
    }

    const getCategoryName = (catName) => {
        if (lang === "en") {
            const engMap = {
                "البترول": "Petroleum",
                "نفط خام": "Crude Oil",
                "الغاز الطبيعي": "Natural Gas",
                "غاز طبيعي": "Natural Gas",
                "الطاقة المتجددة": "Renewable Energy",
                "طاقة متجددة": "Renewable Energy",
                "الأسواق": "Markets",
                "أسواق": "Markets",
                "تقارير": "Reports",
                "أوبك+": "OPEC+"
            }
            return engMap[catName] || catName
        }
        const araMap = {
            "Petroleum": "البترول",
            "Crude Oil": "نفط خام",
            "Natural Gas": "الغاز الطبيعي",
            "Renewable Energy": "الطاقة المتجددة",
            "Markets": "الأسواق",
            "Reports": "تقارير",
            "OPEC+": "أوبك+"
        }
        return araMap[catName] || catName
    }

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">{t("published_news")}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filtered.length} {t("article_count")}</p>
                </div>
                <button onClick={() => navigate("/admin/dashboard/new")}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 text-sm rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto">
                    <span>+</span><span>{t("add_article")}</span>
                </button>
            </div>

            <div className="mb-5">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-xl"
                    placeholder={`🔍 ${t("search_placeholder")}`}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-12 text-center text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-bold">{t("no_articles_yet")}</p>
                </div>
            ) : (
                <>
                    <div className="hidden lg:block rounded-xl border border-gray-200 dark:border-stone-700 overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead>
                            <tr className="bg-stone-100 dark:bg-stone-700 border-b border-gray-200 dark:border-stone-600">
                                <th className="px-6 py-4 text-center font-bold text-stone-600 dark:text-stone-200">{t("title")}</th>
                                <th className="px-6 py-4 text-center font-bold text-stone-600 dark:text-stone-200">{t("category")}</th>
                                <th className="px-6 py-4 text-center font-bold text-stone-600 dark:text-stone-200">{t("date")}</th>
                                {user.role === "admin" && (
                                    <th className="px-6 py-4 text-center font-bold text-stone-600 dark:text-stone-200">{t("publisher")}</th>
                                )}
                                <th className="px-6 py-4 text-center font-bold text-stone-600 dark:text-stone-200">{t("featured")}</th>
                                <th className="px-6 py-4 text-center font-bold text-stone-600 dark:text-stone-200">{t("actions")}</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-stone-800 divide-y divide-gray-100 dark:divide-stone-700/60">
                            {filtered.map((article) => (
                                <tr key={article.id} className="hover:bg-amber-50/40 dark:hover:bg-stone-700/40 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <p className="font-bold text-stone-800 dark:text-white line-clamp-2 leading-snug text-sm">
                                            {article.title}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${categoryColors[article.category] || "bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-300"}`}>
                                                {getCategoryName(article.category)}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-stone-500 dark:text-stone-400 text-xs whitespace-nowrap">
                                        {formatDate(article.date)}
                                    </td>
                                    {user.role === "admin" && (
                                        <td className="px-6 py-4 text-center">
                                                <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20 px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                                                    {article.publishedBy || article.author}
                                                </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-center">
                                        {user.role === "admin" && (
                                            <button
                                                onClick={() => toggleFeatured(article.id)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                                                    article.featured
                                                        ? "bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40"
                                                        : "bg-transparent text-stone-500 dark:text-stone-400 border-stone-300 dark:border-stone-600 hover:border-amber-400 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400"
                                                }`}>
                                                {article.featured ? `⭐ ${t("featured")}` : t("mark_featured")}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/article/${article.id}`)}
                                                className="text-xs border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-amber-400 hover:text-white hover:bg-amber-500 dark:hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap">
                                                {t("view")}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/dashboard/edit/${article.id}`)}
                                                className="text-xs border border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:text-white hover:border-blue-500 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap">
                                                {t("edit")}
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(article.id)}
                                                className="text-xs border border-red-300 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white hover:border-red-500 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap">
                                                {t("delete")}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="lg:hidden space-y-3">
                        {filtered.map((article, i) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4"
                            >
                                <div className="mb-3">
                                    <p className="font-bold text-stone-800 dark:text-white text-base leading-snug mb-2">{article.title}</p>
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-300"}`}>
                                            {getCategoryName(article.category)}
                                        </span>
                                        <span className="text-xs text-stone-400 dark:text-stone-500">{formatDate(article.date)}</span>
                                        {article.featured && (
                                            <span className="text-xs bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-bold">⭐ {t("featured")}</span>
                                        )}
                                    </div>
                                    {user.role === "admin" && article.publishedBy && (
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                                            📝 {t("publisher")}: {article.publishedBy}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap border-t border-gray-100 dark:border-stone-700 pt-3">
                                    <button
                                        onClick={() => navigate(`/article/${article.id}`)}
                                        className="text-xs border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-amber-400 hover:text-white hover:bg-amber-500 dark:hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-all duration-200">
                                        {t("view")}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/admin/dashboard/edit/${article.id}`)}
                                        className="text-xs border border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200">
                                        {t("edit")}
                                    </button>
                                    {user.role === "admin" && (
                                        <button
                                            onClick={() => toggleFeatured(article.id)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                                                article.featured
                                                    ? "bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40"
                                                    : "border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-amber-400 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400"
                                            }`}>
                                            {article.featured ? `⭐ ${t("featured")}` : t("mark_featured")}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setConfirmDelete(article.id)}
                                        className="text-xs border border-red-300 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 ml-auto">
                                        {t("delete")}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-stone-800 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-stone-600 shadow-2xl"
                        dir={isRtl ? "rtl" : "ltr"}>
                        <p className="text-4xl mb-3 text-center">🗑️</p>
                        <h3 className="text-lg font-black text-center text-stone-900 dark:text-white mb-2">{t("delete_article")}</h3>
                        <p className="text-sm text-gray-500 dark:text-stone-400 text-center mb-6">{t("delete_confirm")}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                                {t("yes_delete")}
                            </button>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 border border-gray-300 dark:border-stone-600 text-gray-700 dark:text-stone-300 hover:bg-gray-100 dark:hover:bg-stone-700 font-bold py-2.5 rounded-xl text-sm transition-colors">
                                {t("cancel")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}