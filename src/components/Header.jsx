import { useState, useEffect, useRef } from "react"
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
        const normalized = parsed.map(cat => ({
            id: cat.id,
            nameEn: cat.nameEn || cat.name || "Unknown",
            nameAr: cat.nameAr || cat.name || "غير معروف",
            subcategories: (cat.subcategories || []).map(sub => {
                if (typeof sub === "string") return { nameEn: sub, nameAr: sub }
                return {
                    nameEn: sub.nameEn || sub.name || "Unknown",
                    nameAr: sub.nameAr || sub.name || "غير معروف"
                }
            })
        }))
        return normalized
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
    const [newsbarTexts, setNewsbarTexts] = useState([])
    const { pathname } = useLocation()
    const { dark, toggle } = useDarkMode()
    const { lang, toggleLang, t } = useLanguage()
    const navCategories = getNavCategories()

    const headerRef = useRef(null)

    // Keep --drawer-top in sync with actual header height (newsbar + nav bar)
    useEffect(() => {
        const update = () => {
            if (headerRef.current) {
                const h = headerRef.current.getBoundingClientRect().height
                document.documentElement.style.setProperty("--drawer-top", `${h}px`)
            }
        }
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    const isRtl = lang === "ar"
    const isActive = (slug) => pathname.startsWith(`/category/${slug}`)

    useEffect(() => {
        setMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        const loadNewsbar = async () => {
            const items = getNewsbarItems()
            let texts = items.map(i => i.text)
            if (lang === "en") {
                texts = await Promise.all(texts.map(txt => translateNewsbarText(txt, "en")))
            }
            setNewsbarTexts(texts)
        }
        loadNewsbar()
    }, [lang])

    // Two copies is enough — we translate exactly -50% for a seamless loop
    const repeatedTexts = [...newsbarTexts, ...newsbarTexts]

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-800 shadow-sm"
            dir={isRtl ? "rtl" : "ltr"}>

            <style>{`
                /*
                 * Newsbar ticker — seamless infinite loop, works on all screen sizes.
                 *
                 * Key insight: the scrolling track must never be constrained by its
                 * parent's width. We use position:absolute + left:0 + width:max-content
                 * so the track is as wide as its content regardless of the viewport.
                 * The wrapper is position:relative with overflow:hidden to clip it.
                 *
                 * Two copies, translateX(-50%) = exactly one copy width → perfect loop.
                 * Works identically on mobile and desktop, LTR and RTL.
                 */
                @keyframes tickerScroll {
                    0%   { transform: translateX(0) translateY(-50%); }
                    100% { transform: translateX(-50%) translateY(-50%); }
                }
                .newsbar-wrapper {
                    position: relative;
                    overflow: hidden;
                    flex: 1;
                    min-width: 0;
                    height: 1.75rem;
                }
                .newsbar-track {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    display: flex;
                    width: max-content;
                    align-items: center;
                    animation: tickerScroll 40s linear infinite;
                    will-change: transform;
                }
                .newsbar-track:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Newsbar – seamless CSS ticker, mobile-safe */}
            <div className="bg-stone-900 dark:bg-black text-white py-2 border-b border-stone-800">
                <div className={`flex items-center ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Badge is fixed outside the scroll track */}
                    <span className="text-amber-400 font-bold text-xs shrink-0 border border-amber-400 px-2 py-0.5 rounded z-10 bg-stone-900 dark:bg-black mx-3">
                        {t("urgent")}
                    </span>
                    {/* Wrapper clips the absolutely-positioned track */}
                    <div className="newsbar-wrapper">
                        <div className="newsbar-track">
                            {repeatedTexts.map((text, i) => (
                                <span key={i} className="text-sm opacity-90 whitespace-nowrap">
                                    {text}
                                    <span className="text-amber-500/40 mx-6"></span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header – unchanged */}
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
                        const nameEn = cat.nameEn
                        const displayName = lang === "ar" ? t(nameEn) : nameEn
                        const slug = toSlug(nameEn)
                        const hasSubs = cat.subcategories && cat.subcategories.length > 0
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
                                                const subNameEn = typeof sub === "string" ? sub : (sub.nameEn || sub.name)
                                                const subDisplayName = lang === "ar" ? t(subNameEn) : subNameEn
                                                const subSlug = toSlug(subNameEn)
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
                    <button onClick={toggleLang} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors uppercase hidden sm:block">
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

            {/* Mobile Menu – fixed positioning for both LTR and RTL */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Backdrop – starts below the header, not covering it */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm z-[101] md:hidden"
                            style={{ top: "var(--drawer-top)" }}
                        />
                        {/* Drawer – starts right below the header */}
                        <motion.div
                            initial={{ x: isRtl ? "100%" : "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: isRtl ? "100%" : "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`fixed inset-x-auto bottom-0 ${isRtl ? "right-0" : "left-0"} w-[78%] max-w-xs bg-stone-950 z-[102] shadow-2xl md:hidden flex flex-col`}
                            style={{ top: "var(--drawer-top)" }}
                            dir={isRtl ? "rtl" : "ltr"}
                        >
                            {/* Header */}
                            <div className="px-6 py-5 flex items-center justify-between border-b border-stone-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-5 bg-amber-500 rounded-full"/>
                                    <span className="font-black text-white text-sm tracking-[0.2em] uppercase">
                                        {isRtl ? "القائمة" : "Menu"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleLang}
                                        className="text-[10px] font-black text-amber-400 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all">
                                        {lang === "ar" ? "EN" : "عربي"}
                                    </button>
                                    <button
                                        onClick={() => setMenuOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all text-lg leading-none">
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Nav links */}
                            <div className="flex-1 overflow-y-auto py-4">
                                {/* Home */}
                                <Link
                                    to="/"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-6 py-3.5 group transition-all ${
                                        pathname === "/" ? "text-amber-400 bg-amber-500/10" : "text-stone-300 hover:text-white hover:bg-stone-800/60"
                                    }`}>
                                    <span className={`w-1 h-4 rounded-full transition-all ${pathname === "/" ? "bg-amber-400" : "bg-transparent group-hover:bg-stone-600"}`}/>
                                    <span className="font-bold text-base">{t("home")}</span>
                                </Link>

                                {/* Divider */}
                                <div className="mx-6 my-2 border-t border-stone-800/60"/>

                                {navCategories.map((cat, idx) => {
                                    const catNameEn = cat.nameEn
                                    const catDisplayName = lang === "ar" ? t(catNameEn) : catNameEn
                                    const catSlug = toSlug(catNameEn)
                                    const hasSubs = cat.subcategories && cat.subcategories.length > 0
                                    const active = isActive(catSlug)
                                    return (
                                        <div key={cat.id}>
                                            <Link
                                                to={`/category/${catSlug}`}
                                                onClick={() => setMenuOpen(false)}
                                                className={`flex items-center gap-3 px-6 py-3.5 group transition-all ${
                                                    active ? "text-amber-400 bg-amber-500/10" : "text-stone-300 hover:text-white hover:bg-stone-800/60"
                                                }`}>
                                                <span className={`w-1 h-4 rounded-full transition-all ${active ? "bg-amber-400" : "bg-transparent group-hover:bg-stone-600"}`}/>
                                                <span className="font-bold text-base">{catDisplayName}</span>
                                            </Link>
                                            {hasSubs && (
                                                <div className={`${isRtl ? "pr-10 border-r-2 mr-6" : "pl-10 border-l-2 ml-6"} border-stone-800 mb-1`}>
                                                    {cat.subcategories.map((sub, sIdx) => {
                                                        const subNameEn = typeof sub === "string" ? sub : (sub.nameEn || sub.name)
                                                        const subDisplayName = lang === "ar" ? t(subNameEn) : subNameEn
                                                        const subSlug = toSlug(subNameEn)
                                                        return (
                                                            <Link
                                                                key={sIdx}
                                                                to={`/category/${subSlug}`}
                                                                onClick={() => setMenuOpen(false)}
                                                                className="block py-2 text-sm text-stone-500 hover:text-amber-400 transition-colors font-medium">
                                                                {subDisplayName}
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Footer strip */}
                            <div className="px-6 py-4 border-t border-stone-800 flex items-center gap-2">
                                <span className="text-amber-500 font-black text-xs tracking-widest uppercase">نفط</span>
                                <span className="text-white font-black text-xs tracking-widest uppercase">وطاقة</span>
                                <span className="text-stone-700 text-xs mx-1">·</span>
                                <span className="text-stone-500 text-xs">Oil & Energy</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}