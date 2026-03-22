import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function ArticlesList({ user }) {
    const navigate = useNavigate()
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
        window.location.reload()
    }

    const toggleFeatured = (id) => {
        const updated = allArticles.map((a) => ({ ...a, featured: a.id === id }))
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        window.location.reload()
    }

    const categoryColors = {
        "نفط خام": "bg-amber-100 text-amber-700", "البترول": "bg-amber-100 text-amber-700",
        "غاز طبيعي": "bg-blue-100 text-blue-700", "الغاز الطبيعي": "bg-blue-100 text-blue-700",
        "طاقة متجددة": "bg-green-100 text-green-700",
        "أسواق": "bg-red-100 text-red-700",
        "تقارير": "bg-purple-100 text-purple-700", "أوبك+": "bg-purple-100 text-purple-700",
    }

    return (
        <div dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-stone-900">الأخبار المنشورة</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filtered.length} خبر</p>
                </div>
                <button onClick={() => navigate("/admin/dashboard/new")}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 text-sm rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto">
                    <span>+</span><span>إضافة خبر جديد</span>
                </button>
            </div>

            {/* Search */}
            <div className="mb-5">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                       className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-xl bg-white"
                       placeholder="🔍 بحث بالعنوان أو التصنيف..." />
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-bold">لا توجد أخبار</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-stone-900 text-white text-right">
                                <th className="px-5 py-4 font-bold">العنوان</th>
                                <th className="px-5 py-4 font-bold">التصنيف</th>
                                <th className="px-5 py-4 font-bold">التاريخ</th>
                                {user.role === "admin" && <th className="px-5 py-4 font-bold">الناشر</th>}
                                <th className="px-5 py-4 font-bold">مميز</th>
                                <th className="px-5 py-4 font-bold text-center">إجراءات</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((article, i) => (
                                <tr key={article.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-5 py-4 max-w-xs">
                                        <p className="font-bold text-stone-800 line-clamp-2 leading-snug">{article.title}</p>
                                    </td>
                                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                        {article.category}
                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{article.date}</td>
                                    {user.role === "admin" && (
                                        <td className="px-5 py-4">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">
                          {article.publishedBy || article.author}
                        </span>
                                        </td>
                                    )}
                                    <td className="px-5 py-4">
                                        {user.role === "admin" && (
                                            <button onClick={() => toggleFeatured(article.id)}
                                                    className={`text-xs font-bold px-2 py-1 rounded-lg border transition-colors ${
                                                        article.featured
                                                            ? "bg-amber-100 text-amber-700 border-amber-300"
                                                            : "bg-gray-100 text-gray-500 border-gray-200 hover:border-amber-300"
                                                    }`}>
                                                {article.featured ? "⭐ مميز" : "تمييز"}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => navigate(`/article/${article.id}`)}
                                                    className="text-xs border border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-600 px-3 py-1.5 rounded-lg transition-colors">
                                                عرض
                                            </button>
                                            <button onClick={() => navigate(`/admin/dashboard/edit/${article.id}`)}
                                                    className="text-xs border border-blue-200 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                                تعديل
                                            </button>
                                            <button onClick={() => setConfirmDelete(article.id)}
                                                    className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                                حذف
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-3">
                        {filtered.map((article, i) => (
                            <motion.div key={article.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-stone-800 text-sm leading-snug mb-1">{article.title}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                        {article.category}
                      </span>
                                            <span className="text-xs text-gray-400">{article.date}</span>
                                            {article.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">⭐ مميز</span>}
                                        </div>
                                        {user.role === "admin" && article.publishedBy && (
                                            <span className="text-xs text-blue-500 font-semibold mt-1 block">✏️ {article.publishedBy}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap border-t border-gray-100 pt-3">
                                    <button onClick={() => navigate(`/article/${article.id}`)}
                                            className="text-xs border border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-600 px-3 py-1.5 rounded-lg transition-colors">
                                        عرض
                                    </button>
                                    <button onClick={() => navigate(`/admin/dashboard/edit/${article.id}`)}
                                            className="text-xs border border-blue-200 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                        تعديل
                                    </button>
                                    {user.role === "admin" && (
                                        <button onClick={() => toggleFeatured(article.id)}
                                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                                                    article.featured ? "bg-amber-100 text-amber-700 border-amber-300" : "border-gray-200 text-gray-500 hover:border-amber-300"
                                                }`}>
                                            {article.featured ? "⭐ مميز" : "تمييز"}
                                        </button>
                                    )}
                                    <button onClick={() => setConfirmDelete(article.id)}
                                            className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors mr-auto">
                                        حذف
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* Delete confirm modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full" dir="rtl">
                        <p className="text-2xl mb-3 text-center">🗑️</p>
                        <h3 className="text-lg font-black text-center text-stone-900 mb-2">حذف الخبر</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(confirmDelete)}
                                    className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                                نعم، احذف
                            </button>
                            <button onClick={() => setConfirmDelete(null)}
                                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2.5 rounded-xl text-sm transition-colors">
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}