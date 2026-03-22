import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getArticles } from "../data/articles"
import { categoryIcons } from "../components/CategoryIcons"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" }
    })
}

const categoryColors = {
    "نفط خام": "bg-amber-100 text-amber-700",
    "البترول": "bg-amber-100 text-amber-700",
    "طاقة متجددة": "bg-green-100 text-green-700",
    "الطاقة المتجددة": "bg-green-100 text-green-700",
    "غاز طبيعي": "bg-blue-100 text-blue-700",
    "الغاز الطبيعي": "bg-blue-100 text-blue-700",
    "أسواق": "bg-red-100 text-red-700",
    "الأسواق": "bg-red-100 text-red-700",
    "تقارير": "bg-purple-100 text-purple-700",
    "أوبك+": "bg-purple-100 text-purple-700",
}

// Maps hardcoded slugs to ALL possible category name variants in articles
const slugToNames = {
    oil: ["نفط خام", "البترول"],
    gas: ["غاز طبيعي", "الغاز الطبيعي"],
    renewable: ["طاقة متجددة", "الطاقة المتجددة"],
    markets: ["أسواق", "الأسواق"],
    reports: ["تقارير"],
    opec: ["أوبك+"],
}

// Display name for page title (first variant)
const slugToDisplayName = {
    oil: "البترول",
    gas: "الغاز الطبيعي",
    renewable: "الطاقة المتجددة",
    markets: "الأسواق",
    reports: "تقارير",
    opec: "أوبك+",
}

// Icon lookup — try all variants
const iconNames = {
    oil: "نفط خام",
    gas: "غاز طبيعي",
    renewable: "طاقة متجددة",
    markets: "أسواق",
    reports: "تقارير",
    opec: "أوبك+",
}

function resolveCategoryFromSlug(slug) {
    // 1. Hardcoded slug
    if (slugToNames[slug]) {
        const cats = JSON.parse(localStorage.getItem("oilpulse_categories_v2") || "[]")
        const displayName = slugToDisplayName[slug]
        // Find matching cat for subcategories
        const match = cats.find((c) =>
            slugToNames[slug].includes(c.name) || c.name === displayName
        )
        return {
            name: displayName,
            matchNames: slugToNames[slug],
            isSubcategory: false,
            subcategories: match?.subcategories || [],
            iconKey: iconNames[slug],
        }
    }

    // 2. Dynamic category from localStorage
    const cats = JSON.parse(localStorage.getItem("oilpulse_categories_v2") || "[]")
    for (const cat of cats) {
        const catSlug = cat.name.replace(/\s+/g, "-").toLowerCase()
        if (catSlug === slug) {
            return {
                name: cat.name,
                matchNames: [cat.name],
                isSubcategory: false,
                subcategories: cat.subcategories || [],
                iconKey: cat.name,
            }
        }
        // Check subcategories
        for (const sub of (cat.subcategories || [])) {
            const subSlug = sub.replace(/\s+/g, "-").toLowerCase()
            if (subSlug === slug) {
                return {
                    name: sub,
                    matchNames: [sub],
                    isSubcategory: true,
                    parentName: cat.name,
                    parentSlug: cat.name.replace(/\s+/g, "-").toLowerCase(),
                    subcategories: [],
                    iconKey: cat.name,
                }
            }
        }
    }

    return { name: slug, matchNames: [slug], isSubcategory: false, subcategories: [], iconKey: slug }
}

function ArticleCard({ article, i, onClick }) {
    return (
        <motion.div
            className="cursor-pointer group"
            initial="hidden"
            animate="visible"
            custom={i}
            variants={fadeUp}
            onClick={onClick}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
            <div className="article-img overflow-hidden mb-3">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
          {article.category}
        </span>
                {article.subcategory && (
                    <>
                        <span className="text-gray-400 text-xs font-bold">←</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-stone-700 text-gray-600 dark:text-gray-300">
              {article.subcategory}
            </span>
                    </>
                )}
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-snug mb-1.5 group-hover:text-amber-600 transition-colors">
                {article.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-stone-400 leading-relaxed mb-2 line-clamp-2">
                {article.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 dark:border-stone-800 pt-2">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.date}</span>
            </div>
        </motion.div>
    )
}

export default function Category() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const allArticles = getArticles()

    const { name, matchNames, isSubcategory, parentName, parentSlug, subcategories, iconKey } = resolveCategoryFromSlug(slug)
    const Icon = categoryIcons[iconKey]

    // ── SUBCATEGORY PAGE ──
    if (isSubcategory) {
        const articles = allArticles.filter((a) => a.subcategory === name)
        return (
            <main className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <button
                        onClick={() => navigate(`/category/${parentSlug}`)}
                        className="text-xs text-gray-400 hover:text-amber-500 transition-colors mb-2 flex items-center gap-1"
                    >
                        ← {parentName}
                    </button>
                    <div className="flex items-center gap-4">
                        {Icon && <div className="shrink-0 icon-wrap"><Icon size={48} /></div>}
                        <div>
                            <h1 className="text-2xl font-black text-stone-900 dark:text-white">{name}</h1>
                            <p className="text-sm text-gray-400">{articles.length} مقال</p>
                        </div>
                    </div>
                </motion.div>

                {articles.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg font-bold">لا توجد أخبار في هذا التصنيف بعد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, i) => (
                            <ArticleCard key={article.id} article={article} i={i}
                                         onClick={() => navigate(`/article/${article.id}`)} />
                        ))}
                    </div>
                )}
            </main>
        )
    }

    // ── MAIN CATEGORY PAGE ──
    // Match articles by ANY of the name variants
    const allCatArticles = allArticles.filter((a) => matchNames.includes(a.category))

    // Articles with no subcategory
    const mainArticles = allCatArticles.filter((a) => !a.subcategory)

    // Articles grouped by subcategory — in dashboard order
    const subcategoryGroups = subcategories
        .map((sub) => ({
            name: sub,
            slug: sub.replace(/\s+/g, "-").toLowerCase(),
            articles: allCatArticles.filter((a) => a.subcategory === sub),
        }))
        .filter((g) => g.articles.length > 0)

    const totalCount = allCatArticles.length

    return (
        <main className="max-w-7xl mx-auto px-4 py-10" dir="rtl">

            {/* Page Header */}
            <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-4">
                    {Icon && <div className="shrink-0 icon-wrap"><Icon size={52} /></div>}
                    <div>
                        <h1 className="text-3xl font-black text-stone-900 dark:text-white">{name}</h1>
                        <p className="text-sm text-gray-400">{totalCount} مقال</p>
                    </div>
                </div>
                <div className="h-px bg-gray-100 dark:bg-stone-800"></div>
            </motion.div>

            {/* Main articles (no subcategory) */}
            {mainArticles.length > 0 && (
                <section className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mainArticles.map((article, i) => (
                            <ArticleCard key={article.id} article={article} i={i}
                                         onClick={() => navigate(`/article/${article.id}`)} />
                        ))}
                    </div>
                </section>
            )}

            {/* Subcategory sections */}
            {subcategoryGroups.map((group, gi) => (
                <section key={group.name} className="mb-14">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black text-stone-900 dark:text-white">{group.name}</h2>
                            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                {group.articles.length} مقال
              </span>
                        </div>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-stone-800"></div>
                        <button
                            onClick={() => navigate(`/category/${group.slug}`)}
                            className="text-xs text-amber-600 hover:text-amber-500 font-bold transition-colors whitespace-nowrap"
                        >
                            عرض الكل ←
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.articles.slice(0, 3).map((article, i) => (
                            <ArticleCard key={article.id} article={article} i={i + gi * 3}
                                         onClick={() => navigate(`/article/${article.id}`)} />
                        ))}
                    </div>
                </section>
            ))}

            {/* Empty */}
            {totalCount === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <div className="flex justify-center mb-4 opacity-20 icon-wrap">
                        {Icon && <Icon size={80} />}
                    </div>
                    <p className="text-lg font-bold">لا توجد أخبار في هذا التصنيف بعد</p>
                </div>
            )}

        </main>
    )
}