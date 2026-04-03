import { useNavigate } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { getArticles } from "../data/articles"
import SmartImage from "../components/SmartImage"
import { getCategoryIcon } from "../utils/categoryIconUtils"
import { useLanguage, useTranslatedArticles } from "../components/LanguageContext"

// Map Arabic category names to English for consistent translation
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
}

// Category colors for badges
const categoryColors = {
    "Petroleum": "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300",
    "Crude Oil": "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300",
    "Natural Gas": "bg-blue-100 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300",
    "Renewable Energy": "bg-green-100 text-green-700 dark:bg-green-400/20 dark:text-green-300",
    "Markets": "bg-red-100 text-red-700 dark:bg-red-400/20 dark:text-red-300",
    "Reports": "bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300",
    "OPEC+": "bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300",
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

export default function Home() {
    const navigate = useNavigate()
    const { lang, t } = useLanguage()
    const isRtl = lang === "ar"

    const rawArticles = getArticles()
    const { translatedArticles: allArticles } = useTranslatedArticles(rawArticles)

    const featured = allArticles.find((a) => a.featured) || allArticles[0] || null
    const rest = featured ? allArticles.filter((a) => a.id !== featured.id) : []
    const sidebarArticles = featured ? getSidebarArticles(allArticles, featured.id) : []

    if (!featured) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400" dir={isRtl ? "rtl" : "ltr"}>
                <p className="text-5xl mb-4">📭</p>
                <p className="text-lg font-bold">{t("no_news_yet")}</p>
            </main>
        )
    }

    // Get display category name (translated)
    const getDisplayCategory = (category) => {
        const englishName = categoryToEnglish[category] || category
        return t(englishName)
    }

    // Get category color class
    const getCategoryColor = (category) => {
        const englishName = categoryToEnglish[category] || category
        return categoryColors[englishName] || "bg-gray-100 text-gray-700"
    }

    // Category Badge with Icon inside
    const CategoryBadge = ({ category, size = "md" }) => {
        const Icon = getCategoryIcon(category)
        const iconSize = size === "lg" ? 18 : size === "sm" ? 12 : 14
        const padding = size === "lg" ? "px-3 py-1.5" : "px-2 py-0.5"
        const textSize = size === "lg" ? "text-xs" : "text-[11px]"

        return (
            <div className={`inline-flex items-center gap-1.5 rounded-full ${getCategoryColor(category)} ${padding} ${textSize} font-bold`}>
                <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="flex items-center"
                >
                    <Icon size={iconSize} />
                </motion.div>
                <span>{getDisplayCategory(category)}</span>
            </div>
        )
    }

    // Author and Date row with text emojis
    const AuthorDateRow = ({ author, date }) => (
        <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
                <span>✍</span>
                <span>{author}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{date}</span>
            </div>
        </div>
    )

    return (
        <main className="max-w-7xl mx-auto px-4 py-10" dir={isRtl ? "rtl" : "ltr"}>

            {/* HERO */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
                <AnimatedCard className="lg:col-span-3 cursor-pointer group" i={0}>
                    <div onClick={() => navigate(`/article/${featured.id}`)}>
                        <div className="overflow-hidden mb-5 rounded-xl shadow-md">
                            <SmartImage src={featured.image} alt={featured.title}
                                        className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"/>
                        </div>
                        <CategoryBadge category={featured.category} size="lg" />
                        <h1 className="text-3xl font-black text-stone-900 dark:text-white mt-3 mb-3 leading-snug group-hover:text-amber-600 transition-colors">
                            {featured.title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-4">{featured.excerpt}</p>
                        <AuthorDateRow author={featured.author} date={formatDate(featured.date, lang)} />
                    </div>
                </AnimatedCard>

                {/* Sidebar */}
                <div className={`lg:col-span-2 border-gray-100 dark:border-stone-800 ${isRtl ? "border-r pr-6" : "border-l pl-6"}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-black tracking-widest text-stone-900 dark:text-white">{t("top_news")}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
                    </div>
                    <div className="flex flex-col">
                        {sidebarArticles.map((article, i) => (
                            <AnimatedCard key={article.id} i={i + 1} className="group cursor-pointer">
                                <div className="flex gap-4 py-4 border-b border-gray-100 dark:border-stone-800 last:border-none"
                                     onClick={() => navigate(`/article/${article.id}`)}>
                                    <div className="overflow-hidden shrink-0 rounded-lg shadow-sm w-28 h-20">
                                        <SmartImage src={article.image} alt={article.title}
                                                    className="w-28 h-20 object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <CategoryBadge category={article.category} size="sm" />
                                            <h3 className="text-sm font-bold text-stone-800 dark:text-gray-200 mt-2 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </div>
                                        <AuthorDateRow author={article.author} date={formatDate(article.date, lang)} />
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
                    <span className="text-lg font-black tracking-widest text-stone-900 dark:text-white">{t("latest_news_home")}</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
                </div>
            </AnimatedCard>

            {/* NEWS GRID */}
            {rest.length === 0 ? (
                <div className="text-center py-10 text-gray-400"><p>{t("no_more_news")}</p></div>
            ) : (
                <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rest.map((article) => (
                        <motion.div key={article.id} className="cursor-pointer group" variants={cardVariant}
                                    onClick={() => navigate(`/article/${article.id}`)}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                            <div className="overflow-hidden mb-4 rounded-xl shadow-md">
                                <SmartImage src={article.image} alt={article.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"/>
                            </div>
                            <CategoryBadge category={article.category} size="md" />
                            <h2 className="text-base font-bold text-stone-900 dark:text-white mt-3 mb-2 leading-snug group-hover:text-amber-600 transition-colors">
                                {article.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-3">{article.excerpt}</p>
                            <AuthorDateRow author={article.author} date={formatDate(article.date, lang)} />
                        </motion.div>
                    ))}
                </StaggerGrid>
            )}

        </main>
    )
}