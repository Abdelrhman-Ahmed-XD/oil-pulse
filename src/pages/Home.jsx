import { useNavigate } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { getArticles } from "../data/articles"
import SmartImage from "../components/SmartImage"

const categoryColors = {
    "أوبك+": "bg-purple-100 text-purple-700",
    "طاقة متجددة": "bg-green-100 text-green-700",
    "نفط خام": "bg-amber-100 text-amber-700",
    "البترول": "bg-amber-100 text-amber-700",
    "غاز طبيعي": "bg-blue-100 text-blue-700",
    "الغاز الطبيعي": "bg-blue-100 text-blue-700",
    "أسواق": "bg-red-100 text-red-700",
    "الأسواق": "bg-red-100 text-red-700",
    "تقارير": "bg-purple-100 text-purple-700",
}

const gridContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const cardVariant = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 } })
}

function AnimatedCard({ children, i = 0, className = "" }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.15 })
    return (
        <motion.div ref={ref} className={className} initial="hidden"
                    animate={isInView ? "visible" : "hidden"} custom={i} variants={fadeUp}>
            {children}
        </motion.div>
    )
}

function StaggerGrid({ children, className = "" }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })
    return (
        <motion.div ref={ref} className={className} variants={gridContainer}
                    initial="hidden" animate={isInView ? "visible" : "hidden"}>
            {children}
        </motion.div>
    )
}

function getSidebarArticles(allArticles, featuredId) {
    const nonFeatured = allArticles.filter((a) => a.id !== featuredId)
    const adminPicks = JSON.parse(localStorage.getItem("oilpulse_sidebar_admin") || "null")
    if (adminPicks?.length > 0) {
        const picked = adminPicks.map((id) => allArticles.find((a) => a.id === id)).filter(Boolean)
        if (picked.length > 0) return picked
    }
    const editorPicks = JSON.parse(localStorage.getItem("oilpulse_sidebar_editor") || "null")
    if (editorPicks?.length > 0) {
        const picked = editorPicks.map((id) => allArticles.find((a) => a.id === id)).filter(Boolean)
        if (picked.length > 0) return picked
    }
    return nonFeatured.slice(0, 4)
}

export default function Home() {
    const navigate = useNavigate()
    const allArticles = getArticles()
    const featured = allArticles.find((a) => a.featured) || allArticles[0] || null
    const rest = featured ? allArticles.filter((a) => a.id !== featured.id) : []
    const sidebarArticles = featured ? getSidebarArticles(allArticles, featured.id) : []

    if (!featured) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400" dir="rtl">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-lg font-bold">لا توجد أخبار منشورة حتى الآن</p>
            </main>
        )
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-10" dir="rtl">

            {/* HERO */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
                <AnimatedCard className="lg:col-span-3 cursor-pointer group" i={0}>
                    <div onClick={() => navigate(`/article/${featured.id}`)}>
                        <div className="overflow-hidden mb-5 rounded-xl shadow-md">
                            <SmartImage src={featured.image} alt={featured.title}
                                        className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[featured.category] || "bg-gray-100 text-gray-700"}`}>
              {featured.category}
            </span>
                        <h1 className="text-3xl font-black text-stone-900 dark:text-white mt-3 mb-3 leading-snug group-hover:text-amber-600 transition-colors">
                            {featured.title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-4">{featured.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-100 dark:border-stone-800 pt-4">
                            <span>✍ {featured.author}</span><span>·</span><span>📅 {featured.date}</span>
                        </div>
                    </div>
                </AnimatedCard>

                {/* Sidebar */}
                <div className="lg:col-span-2 border-r border-gray-100 dark:border-stone-800 pr-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-black tracking-widest text-stone-900 dark:text-white">أبرز الأخبار</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
                    </div>
                    <div className="flex flex-col">
                        {sidebarArticles.map((article, i) => (
                            <AnimatedCard key={article.id} i={i + 1} className="group cursor-pointer">
                                <div className="flex gap-4 py-4 border-b border-gray-100 dark:border-stone-800 last:border-none"
                                     onClick={() => navigate(`/article/${article.id}`)}>
                                    <div className="overflow-hidden shrink-0 rounded-lg shadow-sm w-28 h-20">
                                        <SmartImage src={article.image} alt={article.title}
                                                    className="w-28 h-20 object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
                        {article.category}
                      </span>
                                            <h3 className="text-sm font-bold text-stone-800 dark:text-gray-200 mt-2 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-2">{article.date}</span>
                                    </div>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* DIVIDER */}
            <AnimatedCard>
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-lg font-black tracking-widest text-stone-900 dark:text-white">آخر الأخبار</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
                </div>
            </AnimatedCard>

            {/* NEWS GRID */}
            {rest.length === 0 ? (
                <div className="text-center py-10 text-gray-400"><p>لا توجد أخبار إضافية حتى الآن</p></div>
            ) : (
                <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rest.map((article) => (
                        <motion.div key={article.id} className="cursor-pointer group" variants={cardVariant}
                                    onClick={() => navigate(`/article/${article.id}`)}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                            <div className="overflow-hidden mb-4 rounded-xl shadow-md">
                                <SmartImage src={article.image} alt={article.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
                {article.category}
              </span>
                            <h2 className="text-base font-bold text-stone-900 dark:text-white mt-3 mb-2 leading-snug group-hover:text-amber-600 transition-colors">
                                {article.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-3">{article.excerpt}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-400 border-t border-gray-100 dark:border-stone-800 pt-3">
                                <span>{article.author}</span><span>·</span><span>{article.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </StaggerGrid>
            )}

        </main>
    )
}