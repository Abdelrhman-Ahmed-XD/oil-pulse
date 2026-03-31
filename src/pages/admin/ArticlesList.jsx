// src/pages/admin/ArticlesList.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useToast } from "../../components/ToastContext"

export default function ArticlesList({ user }) {
    const navigate = useNavigate()
    const toast = useToast()
    const [search, setSearch] = useState("")
    const [confirmDelete, setConfirmDelete] = useState(null)

    const allArticles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
    const articles = user.role === "admin"
        ? allArticles
        : allArticles.filter((a) => a.publishedBy === user.username || a.author === user.username)

    const filtered = articles.filter((a) =>
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.includes(search)
    )

    const handleDelete = (id) => {
        const updated = allArticles.filter((a) => a.id !== id)
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        setConfirmDelete(null)
        toast.success("تم حذف الخبر بنجاح")
        setTimeout(() => window.location.reload(), 1000)
    }

    const toggleFeatured = (id) => {
        const updated = allArticles.map((a) => ({ ...a, featured: a.id === id }))
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        toast.info("تم تحديث حالة التمييز")
        setTimeout(() => window.location.reload(), 1000)
    }

    const categoryColors = {
        "نفط خام":        "bg-amber-100  text-amber-800  dark:bg-amber-400/20  dark:text-amber-300",
        "البترول":        "bg-amber-100  text-amber-800  dark:bg-amber-400/20  dark:text-amber-300",
        "غاز طبيعي":     "bg-blue-100   text-blue-800   dark:bg-blue-400/20   dark:text-blue-300",
        "الغاز الطبيعي": "bg-blue-100   text-blue-800   dark:bg-blue-400/20   dark:text-blue-300",
        "طاقة متجددة":   "bg-green-100  text-green-800  dark:bg-green-400/20  dark:text-green-300",
        "أسواق":          "bg-red-100    text-red-800    dark:bg-red-400/20    dark:text-red-300",
        "تقارير":         "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
        "أوبك+":          "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
    }

    return (
        <div dir="rtl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">الأخبار المنشورة</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filtered.length} خبر</p>
                </div>
                <button onClick={() => navigate("/admin/dashboard/new")}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 text-sm rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto">
                    <span>+</span><span>إضافة خبر جديد</span>
                </button>
            </div>

            <div className="mb-5">
                <input
                    type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-xl"
                    placeholder="🔍 بحث بالعنوان أو التصنيف..."
                />
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-12 text-center text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-bold">لا توجد أخبار</p>
                </div>
            ) : (
                <>
                    <div className="hidden lg:block rounded-xl border border-gray-200 dark:border-stone-700 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-stone-100 dark:bg-stone-700 text-right border-b border-gray-200 dark:border-stone-600">
                                <th className="px-5 py-3.5 font-bold text-stone-600 dark:text-stone-200">العنوان</th>
                                <th className="px-5 py-3.5 font-bold text-stone-600 dark:text-stone-200">التصنيف</th>
                                <th className="px-5 py-3.5 font-bold text-stone-600 dark:text-stone-200">التاريخ</th>
                                {user.role === "admin" && <th className="px-5 py-3.5 font-bold text-stone-600 dark:text-stone-200">الناشر</th>}
                                <th className="px-5 py-3.5 font-bold text-stone-600 dark:text-stone-200">مميز</th>
                                <th className="px-5 py-3.5 font-bold text-stone-600 dark:text-stone-200 text-center">إجراءات</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-stone-800 divide-y divide-gray-100 dark:divide-stone-700/60">
                            {filtered.map((article) => (
                                <tr key={article.id} className="hover:bg-amber-50/40 dark:hover:bg-stone-700/40 transition-colors">
                                    <td className="px-5 py-4 max-w-xs">
                                        <p className="font-bold text-stone-800 dark:text-stone-100 line-clamp-2 leading-snug">
                                            {article.title}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-300"}`}>
                                                {article.category}
                                            </span>
                                    </td>
                                    <td className="px-5 py-4 text-stone-500 dark:text-stone-400 text-xs whitespace-nowrap">
                                        {article.date}
                                    </td>
                                    {user.role === "admin" && (
                                        <td className="px-5 py-4">
                                                <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold">
                                                    {article.publishedBy || article.author}
                                                </span>
                                        </td>
                                    )}
                                    <td className="px-5 py-4">
                                        {user.role === "admin" && (
                                            <button onClick={() => toggleFeatured(article.id)}
                                                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                                                        article.featured
                                                            ? "bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40"
                                                            : "bg-transparent text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-600 hover:border-amber-400 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400"
                                                    }`}>
                                                {article.featured ? "⭐ مميز" : "تمييز"}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => navigate(`/article/${article.id}`)}
                                                    className="text-xs border border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-300 hover:border-amber-400 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400 px-3 py-1.5 rounded-lg transition-colors">
                                                عرض
                                            </button>
                                            <button onClick={() => navigate(`/admin/dashboard/edit/${article.id}`)}
                                                    className="text-xs border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 px-3 py-1.5 rounded-lg transition-colors">
                                                تعديل
                                            </button>
                                            <button onClick={() => setConfirmDelete(article.id)}
                                                    className="text-xs border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 px-3 py-1.5 rounded-lg transition-colors">
                                                حذف
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
                            <motion.div key={article.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-stone-800 dark:text-stone-100 text-sm leading-snug mb-2">{article.title}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-300"}`}>
                                                {article.category}
                                            </span>
                                            <span className="text-xs text-stone-400 dark:text-stone-500">{article.date}</span>
                                            {article.featured && (
                                                <span className="text-xs bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">⭐ مميز</span>
                                            )}
                                        </div>
                                        {user.role === "admin" && article.publishedBy && (
                                            <span className="text-xs text-blue-500 dark:text-blue-400 font-semibold mt-1.5 block">✏️ {article.publishedBy}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap border-t border-gray-100 dark:border-stone-700 pt-3">
                                    <button onClick={() => navigate(`/article/${article.id}`)}
                                            className="text-xs border border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-300 hover:border-amber-400 hover:text-amber-600 px-3 py-1.5 rounded-lg transition-colors">
                                        عرض
                                    </button>
                                    <button onClick={() => navigate(`/admin/dashboard/edit/${article.id}`)}
                                            className="text-xs border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                        تعديل
                                    </button>
                                    {user.role === "admin" && (
                                        <button onClick={() => toggleFeatured(article.id)}
                                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                                                    article.featured
                                                        ? "bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40"
                                                        : "border-stone-200 dark:border-stone-600 text-stone-400 dark:text-stone-500 hover:border-amber-400 dark:hover:border-amber-500"
                                                }`}>
                                            {article.featured ? "⭐ مميز" : "تمييز"}
                                        </button>
                                    )}
                                    <button onClick={() => setConfirmDelete(article.id)}
                                            className="text-xs border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors mr-auto">
                                        حذف
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-stone-800 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-stone-600 shadow-2xl"
                        dir="rtl">
                        <p className="text-2xl mb-3 text-center">🗑️</p>
                        <h3 className="text-lg font-black text-center text-stone-900 dark:text-white mb-2">حذف الخبر</h3>
                        <p className="text-sm text-gray-500 dark:text-stone-400 text-center mb-6">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(confirmDelete)}
                                    className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                                نعم، احذف
                            </button>
                            <button onClick={() => setConfirmDelete(null)}
                                    className="flex-1 border border-gray-200 dark:border-stone-600 text-gray-600 dark:text-stone-300 hover:bg-gray-50 dark:hover:bg-stone-700 font-bold py-2.5 rounded-xl text-sm transition-colors">
                                إلغاء
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}