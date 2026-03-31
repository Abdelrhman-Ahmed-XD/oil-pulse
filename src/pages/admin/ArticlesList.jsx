import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function ArticlesList({ user }) {
    const navigate = useNavigate()
    const [articles, setArticles] = useState([])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
        setArticles(stored)
    }, [])

    const handleDelete = (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا الخبر؟")) return
        const updated = articles.filter((a) => a.id !== id)
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        setArticles(updated)
    }

    const handleFeature = (id) => {
        const updated = articles.map((a) => ({ ...a, featured: a.id === id }))
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        setArticles(updated)
    }

    const canDelete = (article) => user.role === "admin" || article.author === user.username

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black text-stone-900">الأخبار المنشورة</h1>
                <button
                    onClick={() => navigate("/admin/dashboard/new")}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2 text-sm tracking-widest transition-colors"
                >
                    + إضافة خبر جديد
                </button>
            </div>

            {articles.length === 0 ? (
                <div className="bg-white p-16 text-center text-gray-400">
                    <p className="text-4xl mb-4">📭</p>
                    <p className="font-bold">لا توجد أخبار منشورة حتى الآن</p>
                </div>
            ) : (
                <div className="bg-white overflow-hidden">
                    <table className="w-full text-sm" dir="rtl">
                        <thead>
                        <tr className="bg-stone-900 text-white">
                            <th className="px-6 py-4 text-right font-bold tracking-wide">عنوان الخبر</th>
                            <th className="px-4 py-4 text-right font-bold tracking-wide">التصنيف</th>
                            <th className="px-4 py-4 text-right font-bold tracking-wide">المحرر</th>
                            <th className="px-4 py-4 text-right font-bold tracking-wide">تاريخ النشر</th>
                            <th className="px-4 py-4 text-center font-bold tracking-wide">خبر رئيسي</th>
                            <th className="px-4 py-4 text-center font-bold tracking-wide">الإجراءات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {articles.map((article, i) => (
                            <tr key={article.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-6 py-4 font-semibold text-stone-800 max-w-xs">
                                    <p className="line-clamp-2">{article.title}</p>
                                </td>
                                <td className="px-4 py-4">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 font-bold">
                      {article.category}
                    </span>
                                </td>
                                <td className="px-4 py-4 text-gray-500">{article.author}</td>
                                <td className="px-4 py-4 text-gray-500 text-xs">{article.date}</td>
                                <td className="px-4 py-4 text-center">
                                    <button
                                        onClick={() => handleFeature(article.id)}
                                        className={`text-lg transition-colors ${article.featured ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
                                        title="تعيين كخبر رئيسي"
                                    >
                                        ★
                                    </button>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/dashboard/edit/${article.id}`)}
                                            className="text-xs border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-600 px-3 py-1 transition-colors"
                                        >
                                            تعديل
                                        </button>
                                        {canDelete(article) && (
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 transition-colors"
                                            >
                                                حذف
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}