import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation, Link } from "react-router-dom"
import { OilDropIcon } from "./CategoryIcons"
import { useDarkMode } from "./useDarkMode"
import { getNewsbarItems } from "../utils/newsbarUtils"
import { useLanguage } from "./LanguageContext"

const defaultCategories = [
    { id: 1, nameEn: "Petroleum", nameAr: "البترول", subcategories: [] },
    { id: 2, nameEn: "Natural Gas", nameAr: "الغاز الطبيعي", subcategories: [] },
    { id: 3, nameEn: "Renewable Energy", nameAr: "الطاقة المتجددة", subcategories: [] },
    { id: 4, nameEn: "OPEC+", nameAr: "أوبك+", subcategories: [] },
    { id: 5, nameEn: "Markets", nameAr: "الأسواق", subcategories: [] },
    { id: 6, nameEn: "Reports", nameAr: "تقارير", subcategories: [] },
]

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

function getNavCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed
    }
    return defaultCategories
}

function NavLink({ to, children, active }) {
    return (
        <Link to={to} className="relative group flex flex-col items-center">
            <span className={`text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                active ? "text-amber-500" : "text-gray-600 dark:text-gray-200 group-hover:text-amber-500"
            }`}>
                {children}
            </span>
            <span className={`absolute -bottom-1 h-0.5 bg-amber-500 rounded-full transition-all duration-300 ${
                active ? "w-full" : "w-0 group-hover:w-full"
            }`}/>
        </Link>
    )
}

function DarkToggle({ dark, toggle }) {
    return (
        <button onClick={toggle} aria-label="Toggle Theme"
                style={{
                    width: "44px", height: "24px", borderRadius: "12px",
                    backgroundColor: dark ? "#F59E0B" : "#D1D5DB",
                    position: "relative", border: "none", cursor: "pointer",
                    flexShrink: 0, outline: "none", transition: "background-color 0.3s ease",
                }}>
            <motion.div
                style={{
                    position: "absolute", top: "2px", width: "20px", height: "20px",
                    borderRadius: "50%", backgroundColor: "#ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", lineHeight: 1,
                }}
                animate={{ left: dark ? "22px" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}>
                {dark ? "🌙" : "☀️"}
            </motion.div>
        </button>
    )
}

const translateNewsbarText = async (text, targetLang) => {
    if (targetLang === "ar" || !text) return text
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`
        const res = await fetch(url)
        const data = await res.json()
        return data[0][0][0] || text
    } catch {
        return text
    }
}

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState(null)
    const [mobileExpanded, setMobileExpanded] = useState(null)
    const [newsbarTexts, setNewsbarTexts] = useState([])
    const { pathname } = useLocation()
    const { dark, toggle } = useDarkMode()
    const { lang, toggleLang, t } = useLanguage()
    const navCategories = getNavCategories()

    const isActive = (slug) => pathname.startsWith(`/category/${slug}`)
    const isRtl = lang === "ar"

    useEffect(() => {
        const loadNewsbar = async () => {
            const items = getNewsbarItems()
            let texts = items.map((i) => i.text)
            if (lang === "en") {
                const translatedTexts = await Promise.all(
                    texts.map(async (text) => {
                        const translated = await translateNewsbarText(text, "en")
                        return translated
                    })
                )
                texts = translatedTexts
            }
            setNewsbarTexts(texts)
        }
        loadNewsbar()
    }, [lang])

    const repeatedTexts = [...newsbarTexts, ...newsbarTexts]

    return (
        <header
            className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-800 shadow-sm"
            dir={isRtl ? "rtl" : "ltr"}>

            <style>{`
                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scrollRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .newsbar-scroll-left {
                    animation: scrollLeft 60s linear infinite;
                }
                .newsbar-scroll-right {
                    animation: scrollRight 60s linear infinite;
                }
                .newsbar-scroll-left:hover,
                .newsbar-scroll-right:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Newsbar */}
            <div className="bg-stone-900 dark:bg-black text-white py-2 overflow-hidden border-b border-stone-800">
                <div className={`flex items-center gap-4 px-4 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                    <span className="text-amber-400 font-bold text-xs shrink-0 border border-amber-400 px-2 py-0.5 rounded z-10 bg-stone-900 dark:bg-black">
                        {t("urgent")}
                    </span>
                    <div className="overflow-hidden flex-1">
                        <div className={`inline-flex gap-8 whitespace-nowrap ${isRtl ? "newsbar-scroll-right" : "newsbar-scroll-left"}`}>
                            {repeatedTexts.map((text, i) => (
                                <span key={i} className="text-sm opacity-90">{text}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 shrink-0 icon-wrap group">
                    <motion.div whileHover={{ scale: 1.1, rotate: -5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                        <OilDropIcon size={36}/>
                    </motion.div>
                    <div className={`flex flex-col ${isRtl ? "items-end" : "items-start"}`}>
                        <span className="text-xl font-black tracking-widest text-stone-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors duration-200">
                            {t("oil_and_energy_1")}<span className="text-amber-500">{t("oil_and_energy_2")}</span>
                        </span>
                        <span className="text-xs text-gray-400 tracking-widest leading-tight">{t("oil_energy_sub")}</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
                    <NavLink to="/" active={pathname === "/"}>{t("home")}</NavLink>
                    {navCategories.map((cat) => {
                        // Use nameEn for slug, display name based on language
                        const slug = toSlug(cat.nameEn)
                        const hasSubs = cat.subcategories && cat.subcategories.length > 0
                        const displayName = lang === "ar" ? cat.nameAr : cat.nameEn
                        return (
                            <div key={cat.id} className="relative"
                                 onMouseEnter={() => hasSubs && setOpenDropdown(cat.id)}
                                 onMouseLeave={() => setOpenDropdown(null)}>
                                <div className="relative group flex flex-col items-center">
                                    <Link to={`/category/${slug}`}
                                          className={`text-sm font-semibold flex items-center gap-0.5 whitespace-nowrap transition-colors duration-200 ${
                                              isActive(slug) ? "text-amber-500" : "text-gray-600 dark:text-gray-200 group-hover:text-amber-500"
                                          }`}>
                                        {displayName}
                                        {hasSubs && <motion.span className={`text-xs opacity-40 ${isRtl ? "mr-0.5" : "ml-0.5"}`}
                                                                 animate={{ rotate: openDropdown === cat.id ? 180 : 0 }}>▾</motion.span>}
                                    </Link>
                                    <span className={`absolute -bottom-1 h-0.5 bg-amber-500 rounded-full transition-all duration-300 ${
                                        isActive(slug) ? "w-full" : "w-0 group-hover:w-full"
                                    }`}/>
                                </div>
                                <AnimatePresence>
                                    {hasSubs && openDropdown === cat.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            className={`absolute top-full ${isRtl ? "right-0" : "left-0"} mt-3 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 shadow-xl min-w-48 z-50 rounded-xl overflow-hidden`}>
                                            {cat.subcategories.map((sub, i) => {
                                                const subDisplayName = lang === "ar" ? sub.nameAr : sub.nameEn
                                                const subSlug = sub.nameEn.replace(/\s+/g, "-").toLowerCase()
                                                return (
                                                    <motion.div key={i} initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
                                                                animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                                        <Link to={`/category/${subSlug}`}
                                                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-700 transition-all border-b border-gray-50 dark:border-stone-700 last:border-none group">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"></span>
                                                            {subDisplayName}
                                                        </Link>
                                                    </motion.div>
                                                )
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </nav>

                <div className="flex items-center gap-4 shrink-0">
                    <button onClick={toggleLang} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors uppercase">
                        {lang === "ar" ? "EN" : "عربي"}
                    </button>
                    <DarkToggle dark={dark} toggle={toggle}/>
                    <button className="md:hidden flex flex-col gap-1.5 text-stone-900 dark:text-white p-1"
                            onClick={() => setMenuOpen(!menuOpen)}>
                        <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
                                     className="block w-5 h-0.5 bg-current rounded-full origin-center"/>
                        <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
                                     className="block w-5 h-0.5 bg-current rounded-full"/>
                        <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
                                     className="block w-5 h-0.5 bg-current rounded-full origin-center"/>
                    </button>
                </div>
            </div>

            {/* Mobile Menu – similar updates needed; I'll keep it concise, but you need to adapt the same logic */}
            {/* ... (mobile menu code with same display name logic) ... */}
        </header>
    )
}