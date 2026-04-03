import { motion } from "framer-motion"
import { getCategoryIcon } from "../utils/categoryIconUtils"
import { OilDropIcon } from "./CategoryIcons"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "./LanguageContext"

// Helper to get category display name safely (same as Header.jsx)
const getCatName = (cat, lang) => {
    if (lang === "ar") return cat.nameAr || cat.name || ""
    return cat.nameEn || cat.name || ""
}

// Helper to get subcategory display name safely (supports string or object)
const getSubName = (sub, lang) => {
    if (typeof sub === "string") return sub
    if (lang === "ar") return sub.nameAr || sub.name || ""
    return sub.nameEn || sub.name || ""
}

// Helper to get subcategory English name for slug (supports string or object)
const getSubEnName = (sub) => {
    if (typeof sub === "string") return sub
    return sub.nameEn || sub.name || ""
}

function getFooterCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure each category has nameEn/nameAr fallbacks
        const normalized = parsed.map(cat => ({
            id: cat.id,
            nameEn: cat.nameEn || cat.name || "Unknown",
            nameAr: cat.nameAr || cat.name || "غير معروف",
            subcategories: (cat.subcategories || []).map(sub => {
                // Convert legacy string subcategories to object
                if (typeof sub === "string") {
                    return { nameEn: sub, nameAr: sub }
                }
                return {
                    nameEn: sub.nameEn || sub.name || "Unknown",
                    nameAr: sub.nameAr || sub.name || "غير معروف"
                }
            })
        }))
        return normalized
    }
    // Default categories (English names, Arabic will be displayed via t() when needed)
    return [
        { id: 1, nameEn: "Petroleum", nameAr: "البترول", subcategories: [] },
        { id: 2, nameEn: "Natural Gas", nameAr: "الغاز الطبيعي", subcategories: [] },
        { id: 3, nameEn: "Renewable Energy", nameAr: "الطاقة المتجددة", subcategories: [] },
        { id: 4, nameEn: "OPEC+", nameAr: "أوبك+", subcategories: [] },
        { id: 5, nameEn: "Markets", nameAr: "الأسواق", subcategories: [] },
        { id: 6, nameEn: "Reports", nameAr: "تقارير", subcategories: [] },
    ]
}

function toSlug(name) {
    if (!name) return ""
    const map = {
        "Petroleum": "oil", "Natural Gas": "gas", "Renewable Energy": "renewable",
        "Markets": "markets", "Reports": "reports", "OPEC+": "opec"
    }
    return map[name] || name.replace(/\s+/g, "-").toLowerCase()
}

export default function Footer() {
    const navigate = useNavigate()
    const { lang, t } = useLanguage()
    const isRtl = lang === "ar"
    const categories = getFooterCategories()

    const getCategoryIconByName = (name) => {
        return getCategoryIcon(name) || OilDropIcon
    }

    return (
        <footer className="bg-stone-900 text-white mt-20" dir={isRtl ? "rtl" : "ltr"}>
            <div className="h-1 bg-gradient-to-l from-amber-600 via-amber-400 to-amber-600"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left column: Logo & About */}
                    <div>
                        <div onClick={() => navigate("/")} className="flex items-center gap-3 mb-5 group cursor-pointer">
                            <motion.div whileHover={{ scale: 1.1, rotate: -5 }}><OilDropIcon size={44} /></motion.div>
                            <div>
                                <span className="text-2xl font-black tracking-widest text-white">{t("oil_and_energy_1")}<span className="text-amber-400">{t("oil_and_energy_2")}</span></span>
                                <p className="text-xs text-gray-500 tracking-widest mt-0.5">{t("oil_energy_sub")}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">{t("about_desc")}</p>
                        <div className="flex gap-3">
                            <div onClick={() => navigate("/")} className="text-xs text-gray-500 hover:text-amber-400 border border-stone-700 px-3 py-1.5 rounded-lg cursor-pointer">{t("home")}</div>
                            <div onClick={() => navigate("/")} className="text-xs text-gray-500 hover:text-amber-400 border border-stone-700 px-3 py-1.5 rounded-lg cursor-pointer">{t("latest_news")}</div>
                        </div>
                    </div>

                    {/* Right column: Categories with icons */}
                    <div>
                        <h4 className="text-xs font-black tracking-widest text-amber-400 mb-5 uppercase flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-amber-400 rounded-full"></span>{t("categories")}
                        </h4>
                        <ul className="space-y-1">
                            {categories.map(cat => {
                                const displayName = getCatName(cat, lang)
                                const slug = toSlug(cat.nameEn)
                                const Icon = getCategoryIconByName(cat.nameEn)
                                return (
                                    <li key={cat.id}>
                                        <div onClick={() => navigate(`/category/${slug}`)} className="flex items-center gap-3 group py-2 px-3 rounded-lg hover:bg-stone-800 cursor-pointer">
                                            <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><Icon size={26} /></motion.div>
                                            <div className="flex-1">
                                                <span className="text-sm text-gray-400 group-hover:text-amber-400">{displayName}</span>
                                                {cat.subcategories?.length > 0 && (
                                                    <div className="flex flex-wrap gap-x-3 mt-0.5">
                                                        {cat.subcategories.map((sub, idx) => {
                                                            const subDisplay = getSubName(sub, lang)
                                                            const subSlug = toSlug(getSubEnName(sub))
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/category/${subSlug}`) }}
                                                                    className="text-xs text-gray-600 hover:text-amber-400"
                                                                >
                                                                    · {subDisplay}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-gray-600 text-xs opacity-0 group-hover:opacity-100">{isRtl ? "←" : "→"}</span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">{t("all_rights")}</p>
                    <div className="flex gap-4">
                        <div onClick={() => navigate("/privacy")} className="text-xs text-gray-500 hover:text-amber-400 cursor-pointer">{t("privacy_policy")}</div>
                        <a href="#" className="text-xs text-gray-500 hover:text-amber-400">{t("contact_us")}</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}