// src/components/Footer.jsx
import { motion } from "framer-motion"
import { categoryIcons, OilDropIcon } from "./CategoryIcons"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "./LanguageContext"

// Default categories with bilingual names
const defaultCategories = [
    { id: 1, nameEn: "Petroleum", nameAr: "البترول", subcategories: [] },
    { id: 2, nameEn: "Natural Gas", nameAr: "الغاز الطبيعي", subcategories: [] },
    { id: 3, nameEn: "Renewable Energy", nameAr: "الطاقة المتجددة", subcategories: [] },
    { id: 4, nameEn: "OPEC+", nameAr: "أوبك+", subcategories: [] },
    { id: 5, nameEn: "Markets", nameAr: "الأسواق", subcategories: [] },
    { id: 6, nameEn: "Reports", nameAr: "تقارير", subcategories: [] },
]

// Generate slug from English name
function toSlug(nameEn) {
    if (!nameEn) return ""
    const map = {
        "Petroleum": "oil",
        "Crude Oil": "oil",
        "Natural Gas": "gas",
        "Renewable Energy": "renewable",
        "Markets": "markets",
        "Reports": "reports",
        "OPEC+": "opec",
    }
    return map[nameEn] || nameEn.replace(/\s+/g, "-").toLowerCase()
}

function getFooterCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed
    }
    return defaultCategories
}

// Helper to get icon for a category (based on English name)
function getCategoryIconByName(categoryNameEn) {
    const iconMap = {
        "Petroleum": categoryIcons["Petroleum"],
        "Crude Oil": categoryIcons["Crude Oil"],
        "Natural Gas": categoryIcons["Natural Gas"],
        "Renewable Energy": categoryIcons["Renewable Energy"],
        "Markets": categoryIcons["Markets"],
        "Reports": categoryIcons["Reports"],
        "OPEC+": categoryIcons["OPEC+"],
    }
    return iconMap[categoryNameEn] || OilDropIcon
}

export default function Footer() {
    const categories = getFooterCategories()
    const navigate = useNavigate()
    const { lang, t } = useLanguage()
    const isRtl = lang === "ar"

    return (
        <footer className="bg-stone-900 text-white mt-20" dir={isRtl ? "rtl" : "ltr"}>

            {/* Top amber accent line */}
            <div className="h-1 bg-gradient-to-l from-amber-600 via-amber-400 to-amber-600"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16">

                    {/* Logo & About */}
                    <div>
                        <div onClick={() => navigate("/")} className="flex items-center gap-3 mb-5 group icon-wrap w-fit cursor-pointer">
                            <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                                <OilDropIcon size={44} />
                            </motion.div>
                            <div>
                                <span className="text-2xl font-black tracking-widest text-white group-hover:text-amber-400 transition-colors duration-200">
                                    {t("oil_and_energy_1")}<span className="text-amber-400">{t("oil_and_energy_2")}</span>
                                </span>
                                <p className="text-xs text-gray-500 tracking-widest mt-0.5">{t("oil_energy_sub")}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
                            {t("about_desc")}
                        </p>
                        <div className="flex gap-3">
                            <div onClick={() => navigate("/")} className="text-xs text-gray-500 hover:text-amber-400 border border-stone-700 hover:border-amber-500 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-amber-500/10 cursor-pointer">
                                {t("home")}
                            </div>
                            <div onClick={() => navigate("/")} className="text-xs text-gray-500 hover:text-amber-400 border border-stone-700 hover:border-amber-500 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-amber-500/10 cursor-pointer">
                                {t("latest_news")}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-xs font-black tracking-widest text-amber-400 mb-5 uppercase flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-amber-400 rounded-full"></span>
                            {t("categories")}
                        </h4>
                        <ul className="space-y-1">
                            {categories.map((cat) => {
                                const displayName = lang === "ar" ? cat.nameAr : cat.nameEn
                                const Icon = getCategoryIconByName(cat.nameEn)
                                const catSlug = toSlug(cat.nameEn)
                                return (
                                    <li key={cat.id}>
                                        <div
                                            onClick={() => navigate(`/category/${catSlug}`)}
                                            className="flex items-center gap-3 group py-2 px-3 rounded-lg hover:bg-stone-800 transition-all duration-200 cursor-pointer"
                                        >
                                            {Icon && (
                                                <motion.div className="w-7 h-7 shrink-0"
                                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                >
                                                    <Icon size={26} />
                                                </motion.div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors duration-200 font-semibold">
                                                    {displayName}
                                                </span>
                                                {cat.subcategories?.length > 0 && (
                                                    <div className="flex flex-wrap gap-x-3 mt-0.5">
                                                        {cat.subcategories.map((sub) => {
                                                            const subDisplayName = lang === "ar" ? sub.nameAr : sub.nameEn
                                                            const subSlug = sub.nameEn.replace(/\s+/g, "-").toLowerCase()
                                                            return (
                                                                <button
                                                                    key={sub.nameEn}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        navigate(`/category/${subSlug}`)
                                                                    }}
                                                                    className="text-xs text-gray-600 hover:text-amber-400 transition-colors"
                                                                >
                                                                    · {subDisplayName}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            <motion.span className="text-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity" initial={false}>
                                                {isRtl ? "←" : "→"}
                                            </motion.span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                        <p className="text-xs text-gray-500 text-center sm:text-right">
                            {t("all_rights")}
                        </p>
                        <span className="hidden sm:block text-gray-700">·</span>
                        <a
                            href="https://www.linkedin.com/in/abdelrhman-ahmed-fathy2004/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5 group"
                        >
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <span>{t("developed_by")}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400">↗</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div onClick={() => navigate("/privacy")} className="text-xs text-gray-500 hover:text-amber-400 transition-colors duration-200 relative group cursor-pointer">
                            {t("privacy_policy")}
                            <span className="absolute -bottom-0.5 right-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                        </div>
                        <a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors duration-200 relative group">
                            {t("contact_us")}
                            <span className="absolute -bottom-0.5 right-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}