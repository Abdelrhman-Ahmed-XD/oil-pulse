import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }
    })
}

function StatCard({ label, value, icon, color = "amber", i = 0 }) {
    const colors = {
        amber: "border-amber-200 bg-amber-50 text-amber-600",
        blue: "border-blue-200 bg-blue-50 text-blue-600",
        green: "border-green-200 bg-green-50 text-green-600",
        purple: "border-purple-200 bg-purple-50 text-purple-600",
        red: "border-red-200 bg-red-50 text-red-600",
    }
    return (
        <motion.div className={`border p-5 rounded-xl ${colors[color]}`}
                    initial="hidden" animate="visible" custom={i} variants={fadeUp}>
            <div className="flex items-start justify-between mb-2">
                <span className="text-xl opacity-60">{icon}</span>
            </div>
            <p className="text-3xl font-black mb-1">{value}</p>
            <p className="text-xs font-semibold opacity-70">{label}</p>
        </motion.div>
    )
}

function SectionTitle({ title, i = 0 }) {
    return (
        <motion.div className="flex items-center gap-4 mb-5"
                    initial="hidden" animate="visible" custom={i} variants={fadeUp}>
            <span className="text-base font-black tracking-widest text-stone-900">{title}</span>
            <div className="flex-1 h-px bg-gray-200"></div>
        </motion.div>
    )
}

// Get all comments across all articles
function getAllComments(articles) {
    const all = []
    articles.forEach((a) => {
        const comments = JSON.parse(localStorage.getItem(`oilpulse_comments_${a.id}`) || "[]")
        comments.forEach((c) => all.push({ ...c, articleTitle: a.title, articleId: a.id }))
    })
    return all.sort((a, b) => b.timestamp - a.timestamp)
}

export default function Analytics({ user }) {
    const navigate = useNavigate()

    const allArticles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
    const viewsData = JSON.parse(localStorage.getItem("oilpulse_views") || "{}")

    const myArticles = user.role === "admin"
        ? allArticles
        : allArticles.filter((a) => a.author === user.username)

    const articlesWithViews = useMemo(() =>
            myArticles.map((a) => ({ ...a, views: viewsData[a.id] || 0 })),
        [myArticles.length, Object.keys(viewsData).length]
    )

    const totalViews = articlesWithViews.reduce((sum, a) => sum + a.views, 0)
    const avgViews = myArticles.length > 0 ? Math.round(totalViews / myArticles.length) : 0

    // Comments
    const allComments = useMemo(() => getAllComments(myArticles), [myArticles.length])
    const [comments, setComments] = useState(allComments)

    const deleteComment = (articleId, commentId) => {
        if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return
        const key = `oilpulse_comments_${articleId}`
        const existing = JSON.parse(localStorage.getItem(key) || "[]")
        const updated = existing.filter((c) => c.id !== commentId)
        localStorage.setItem(key, JSON.stringify(updated))
        setComments((prev) => prev.filter((c) => !(c.id === commentId && c.articleId === articleId)))
    }

    // Category breakdown
    const categoryMap = {}
    myArticles.forEach((a) => { categoryMap[a.category] = (categoryMap[a.category] || 0) + 1 })
    const topCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])
    const maxCatCount = topCategories[0]?.[1] || 1

    const topArticles = [...articlesWithViews].sort((a, b) => b.views - a.views).slice(0, 5)
    const latestArticles = [...myArticles].slice(0, 5)

    return (
        <div dir="rtl">
            <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
                <h1 className="text-2xl font-black text-stone-900">
                    {user.role === "admin" ? "لوحة الإحصاءات — مدير النظام" : "إحصاءاتي"}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    {user.role === "admin"
                        ? "نظرة عامة على أداء الموقع والمحتوى المنشور"
                        : `نظرة عامة على مقالاتك باسم "${user.username}"`}
                </p>
            </motion.div>

            {/* Stat Cards */}
            <div className={`grid gap-4 mb-10 ${user.role === "admin" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"}`}>
                <StatCard label="إجمالي المقالات" value={myArticles.length} icon="📰" color="amber" i={0} />
                <StatCard label="إجمالي المشاهدات" value={totalViews} icon="👁" color="blue" i={1} />
                <StatCard label="إجمالي التعليقات" value={comments.length} icon="💬" color="purple" i={2} />
                {user.role === "admin" && (
                    <StatCard label="متوسط المشاهدات" value={avgViews} icon="📊" color="red" i={3} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Top Articles */}
                <div>
                    <SectionTitle title="الأكثر مشاهدةً" i={5} />
                    {topArticles.length === 0 ? (
                        <div className="bg-white p-8 text-center text-gray-400 text-sm rounded-xl border border-gray-200">لا توجد مقالات بعد</div>
                    ) : (
                        <div className="space-y-2">
                            {topArticles.map((article, i) => (
                                <motion.div key={article.id}
                                            className="bg-white flex items-center gap-4 px-4 py-3 cursor-pointer hover:border-amber-300 border border-gray-200 rounded-xl transition-colors"
                                            initial="hidden" animate="visible" custom={i + 6} variants={fadeUp}
                                            onClick={() => navigate(`/article/${article.id}`)}>
                                    <span className="text-2xl font-black text-gray-200 w-8 shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-stone-800 line-clamp-1">{article.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{article.category} · {article.date}</p>
                                    </div>
                                    <div className="shrink-0 text-left">
                                        <p className="text-sm font-black text-amber-600">{article.views}</p>
                                        <p className="text-xs text-gray-400">مشاهدة</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-10">

                    {/* Category Breakdown */}
                    <div>
                        <SectionTitle title="توزيع التصنيفات" i={5} />
                        {topCategories.length === 0 ? (
                            <div className="bg-white p-8 text-center text-gray-400 text-sm rounded-xl border border-gray-200">لا توجد بيانات</div>
                        ) : (
                            <div className="space-y-3">
                                {topCategories.map(([cat, count], i) => (
                                    <motion.div key={cat} initial="hidden" animate="visible" custom={i + 6} variants={fadeUp}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-semibold text-stone-700">{cat}</span>
                                            <span className="text-xs text-gray-400">{count} مقال</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full">
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
                        <SectionTitle title="آخر المقالات" i={6} />
                        {latestArticles.length === 0 ? (
                            <div className="bg-white p-8 text-center text-gray-400 text-sm rounded-xl border border-gray-200">لا توجد مقالات بعد</div>
                        ) : (
                            <div className="space-y-2">
                                {latestArticles.map((article, i) => (
                                    <motion.div key={article.id}
                                                className="bg-white flex items-center gap-3 px-4 py-3 cursor-pointer hover:border-amber-300 border border-gray-200 rounded-xl transition-colors"
                                                initial="hidden" animate="visible" custom={i + 7} variants={fadeUp}
                                                onClick={() => navigate(`/article/${article.id}`)}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-stone-800 line-clamp-1">{article.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{article.author} · {article.date}</p>
                                        </div>
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 font-bold shrink-0 rounded">
                      {article.category}
                    </span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Comments Management */}
            <div className="mt-12">
                <SectionTitle title={`إدارة التعليقات (${comments.length})`} i={8} />
                {comments.length === 0 ? (
                    <div className="bg-white p-10 text-center text-gray-400 rounded-xl border border-gray-200">
                        <p className="text-3xl mb-2">💬</p>
                        <p className="text-sm">لا توجد تعليقات بعد</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {comments.map((comment, i) => (
                            <motion.div key={`${comment.articleId}_${comment.id}`}
                                        className="bg-white border border-gray-200 rounded-xl px-5 py-4"
                                        initial="hidden" animate="visible" custom={i} variants={fadeUp}>
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black shrink-0">
                                        {comment.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap mb-1">
                                            <span className="text-sm font-bold text-stone-800">{comment.name}</span>
                                            <span className="text-xs text-gray-400">{comment.email}</span>
                                            <span className="text-xs text-gray-300">·</span>
                                            <span className="text-xs text-gray-400">{comment.date}</span>
                                        </div>
                                        <p className="text-sm text-stone-600 leading-relaxed mb-2">{comment.body}</p>
                                        <p className="text-xs text-amber-600 font-semibold truncate">
                                            📰 {comment.articleTitle}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => navigate(`/article/${comment.articleId}`)}
                                            className="text-xs border border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-600 px-3 py-1.5 rounded-lg transition-colors">
                                            عرض المقال
                                        </button>
                                        <button
                                            onClick={() => deleteComment(comment.articleId, comment.id)}
                                            className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}