import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getArticles } from "../data/articles"
import { getCategoryIcon } from "../utils/categoryIconUtils"
import { useLanguage, useTranslatedArticles } from "../components/LanguageContext"
import { getCategoryColor, getDisplayCategorySync, categoryToEnglish, toEnglishCategory } from "../utils/categoryUtils"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" } })
}

const getEnglishCategoryName = (catName) => toEnglishCategory(catName)

const slugToCategoryMap = {
    oil: { name: "Petroleum", matchNames: ["Petroleum", "Crude Oil", "البترول", "نفط خام"], iconKey: "Petroleum" },
    gas: { name: "Natural Gas", matchNames: ["Natural Gas", "الغاز الطبيعي", "غاز طبيعي"], iconKey: "Natural Gas" },
    renewable: { name: "Renewable Energy", matchNames: ["Renewable Energy", "الطاقة المتجددة", "طاقة متجددة"], iconKey: "Renewable Energy" },
    markets: { name: "Markets", matchNames: ["Markets", "الأسواق", "أسواق"], iconKey: "Markets" },
    reports: { name: "Reports", matchNames: ["Reports", "تقارير"], iconKey: "Reports" },
    opec: { name: "OPEC+", matchNames: ["OPEC+", "أوبك+"], iconKey: "OPEC+" },
}

function resolveCategoryFromSlug(slug) {
    if (slugToCategoryMap[slug]) {
        const base = slugToCategoryMap[slug];
        const cats = JSON.parse(localStorage.getItem("oilpulse_categories_v2") || "[]");
        const matchedCat = cats.find(cat => cat.name === base.name || base.matchNames.includes(cat.name));
        return {
            name: base.name,
            matchNames: base.matchNames,
            isSubcategory: false,
            subcategories: matchedCat?.subcategories || [],
            iconKey: base.iconKey
        };
    }
    const cats = JSON.parse(localStorage.getItem("oilpulse_categories_v2") || "[]");
    for (const cat of cats) {
        const catSlug = cat.name.replace(/\s+/g, "-").toLowerCase();
        if (catSlug === slug) {
            return {
                name: cat.name,
                matchNames: [cat.name, getEnglishCategoryName(cat.name)],
                isSubcategory: false,
                subcategories: cat.subcategories || [],
                iconKey: cat.name
            };
        }
        for (const sub of (cat.subcategories || [])) {
            const subSlug = sub.replace(/\s+/g, "-").toLowerCase();
            if (subSlug === slug) {
                return {
                    name: sub,
                    matchNames: [sub, getEnglishCategoryName(sub)],
                    isSubcategory: true,
                    parentName: cat.name,
                    parentSlug: cat.name.replace(/\s+/g, "-").toLowerCase(),
                    subcategories: [],
                    iconKey: cat.name
                };
            }
        }
    }
    return { name: slug, matchNames: [slug], isSubcategory: false, subcategories: [], iconKey: slug };
}

const getDisplayCategory = (category, t) => getDisplayCategorySync(category, 'en', t)

const CategoryBadge = ({ category, size = "md" }) => {
    const Icon = getCategoryIcon(category);
    const iconSize = size === "lg" ? 18 : size === "sm" ? 12 : 14;
    const padding = size === "lg" ? "px-3 py-1.5" : size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1";
    const textSize = size === "lg" ? "text-xs" : size === "sm" ? "text-[10px]" : "text-[11px]";
    const { t } = useLanguage();
    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full ${getCategoryColor(category)} ${padding} ${textSize} font-bold`}>
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }} className="flex items-center">
                <Icon size={iconSize} />
            </motion.div>
            <span>{getDisplayCategory(category, t)}</span>
        </div>
    );
};



export default function Category() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { lang, t, formatDate } = useLanguage();
    const isRtl = lang === "ar";

    const rawArticles = getArticles();
    const { translatedArticles: allArticles } = useTranslatedArticles(rawArticles);

    const { name, matchNames, isSubcategory, parentName, parentSlug, subcategories, iconKey } = resolveCategoryFromSlug(slug);
    const Icon = getCategoryIcon(iconKey || name);

    const normalize = (s) => s?.trim().toLowerCase();

    const categoryArticles = allArticles.filter((a) => {
        if (isSubcategory) {
            return normalize(a.subcategory) === normalize(name);
        } else {
            const articleCat = normalize(a.category);
            return matchNames.some(m => normalize(m) === articleCat);
        }
    });

    const ArticleCard = ({ article, i, onClick }) => (
        <motion.div className="cursor-pointer group" initial="hidden" animate="visible" custom={i} variants={fadeUp}
                    onClick={onClick} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
            <div className="article-img overflow-hidden mb-3">
                <img src={article.image} alt={article.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <CategoryBadge category={article.category} size="sm" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-white mt-2 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                {article.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-stone-400 leading-relaxed mt-1 line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 dark:border-stone-800 pt-2 mt-2">
                <span>✍ {article.author}</span>
                <span>·</span>
                <span>📅 {formatDate(article.date)}</span>
            </div>
        </motion.div>
    );

    if (isSubcategory) {
        const articles = categoryArticles;
        return (
            <main className="max-w-7xl mx-auto px-4 py-10" dir={isRtl ? "rtl" : "ltr"}>
                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => navigate(`/category/${parentSlug}`)}
                            className="text-xs text-gray-400 hover:text-amber-500 transition-colors mb-2 flex items-center gap-1">
                        {isRtl ? "←" : "→"} {getDisplayCategory(parentName, t)}
                    </button>
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <motion.div className="shrink-0" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                                <Icon size={48} />
                            </motion.div>
                        )}
                        <div>
                            <h1 className="text-2xl font-black text-stone-900 dark:text-white">{getDisplayCategory(name, t)}</h1>
                            <p className="text-sm text-gray-400">{articles.length} {t("article_count")}</p>
                        </div>
                    </div>
                </motion.div>
                {articles.length === 0 ? (
                    <div className="text-center py-20 text-gray-400"><p className="text-lg font-bold">{t("no_news_cat")}</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, i) => <ArticleCard key={article.id} article={article} i={i} onClick={() => navigate(`/article/${article.id}`)} />)}
                    </div>
                )}
            </main>
        );
    }

    const mainArticles = categoryArticles.filter((a) => !a.subcategory || a.subcategory === "");
    const subcategoryGroups = subcategories
        .map((sub) => ({
            name: sub,
            slug: sub.replace(/\s+/g, "-").toLowerCase(),
            articles: categoryArticles.filter((a) => normalize(a.subcategory) === normalize(sub))
        }))
        .filter((g) => g.articles.length > 0);
    const totalCount = categoryArticles.length;

    return (
        <main className="max-w-7xl mx-auto px-4 py-10" dir={isRtl ? "rtl" : "ltr"}>
            <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-4">
                    {Icon && (
                        <motion.div className="shrink-0" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Icon size={52} />
                        </motion.div>
                    )}
                    <div>
                        <h1 className="text-3xl font-black text-stone-900 dark:text-white">{getDisplayCategory(name, t)}</h1>
                        <p className="text-sm text-gray-400">{totalCount} {t("article_count")}</p>
                    </div>
                </div>
                <div className="h-px bg-gray-100 dark:bg-stone-800"></div>
            </motion.div>

            {mainArticles.length > 0 && (
                <section className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mainArticles.map((article, i) => <ArticleCard key={article.id} article={article} i={i} onClick={() => navigate(`/article/${article.id}`)} />)}
                    </div>
                </section>
            )}

            {subcategoryGroups.map((group, gi) => (
                <section key={group.name} className="mb-14">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black text-stone-900 dark:text-white">{getDisplayCategory(group.name, t)}</h2>
                            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">{group.articles.length} {t("article_count")}</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-stone-800"></div>
                        <button onClick={() => navigate(`/category/${group.slug}`)}
                                className="text-xs text-amber-600 hover:text-amber-500 font-bold transition-colors whitespace-nowrap">
                            {lang === "ar" ? "عرض التصنيف الفرعي" : "View Subcategory"} {isRtl ? "←" : "→"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.articles.slice(0, 3).map((article, i) => <ArticleCard key={article.id} article={article} i={i + gi * 3} onClick={() => navigate(`/article/${article.id}`)} />)}
                    </div>
                </section>
            ))}

            {totalCount === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <div className="flex justify-center mb-4 opacity-20">{Icon && <Icon size={80} />}</div>
                    <p className="text-lg font-bold">{t("no_news_cat")}</p>
                </div>
            )}
        </main>
    );
}