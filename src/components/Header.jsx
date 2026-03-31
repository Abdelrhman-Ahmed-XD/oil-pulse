import {useState} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {useLocation, Link} from "react-router-dom"
import {OilDropIcon} from "./CategoryIcons"
import {useDarkMode} from "./useDarkMode"
import {getNewsbarItems} from "../pages/admin/NewsbarPicker"
import {useLanguage} from "./LanguageContext"

const defaultCategories = [
    {id: 1, name: "البترول", subcategories: []},
    {id: 2, name: "الغاز الطبيعي", subcategories: []},
    {id: 3, name: "الطاقة المتجددة", subcategories: []},
    {id: 4, name: "الأسواق", subcategories: []},
    {id: 5, name: "تقارير", subcategories: []},
]

function toSlug(name) {
    const map = {
        "البترول": "oil", "نفط خام": "oil",
        "الغاز الطبيعي": "gas", "غاز طبيعي": "gas",
        "الطاقة المتجددة": "renewable", "طاقة متجددة": "renewable",
        "الأسواق": "markets", "أسواق": "markets",
        "تقارير": "reports", "أوبك+": "opec",
    }
    return map[name] || name.replace(/\s+/g, "-").toLowerCase()
}

function getNavCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    if (stored) return JSON.parse(stored)
    return defaultCategories
}

function NavLink({to, children, active}) {
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

function DarkToggle({dark, toggle}) {
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
                animate={{left: dark ? "22px" : "2px"}}
                transition={{type: "spring", stiffness: 500, damping: 30, mass: 0.8}}>
                {dark ? "🌙" : "☀️"}
            </motion.div>
        </button>
    )
}

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState(null)
    const [mobileExpanded, setMobileExpanded] = useState(null)
    const {pathname} = useLocation()
    const {dark, toggle} = useDarkMode()
    const {lang, toggleLang, t} = useLanguage()
    const navCategories = getNavCategories()

    const newsbarItems = getNewsbarItems()
    const newsbarTexts = newsbarItems.map((i) => i.text)
    const repeated = [...newsbarTexts, ...newsbarTexts]

    const isActive = (slug) => pathname.startsWith(`/category/${slug}`)
    const isRtl = lang === "ar"

    return (
        <header
            className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-800 shadow-sm"
            dir={isRtl ? "rtl" : "ltr"}>
            {/* ── Newsbar ── */}
            <div className="bg-stone-900 dark:bg-black text-white py-2 overflow-hidden">
                <div className="flex items-center gap-4 px-4">
                    <span
                        className="text-amber-400 font-bold text-xs shrink-0 border border-amber-400 px-2 py-0.5 rounded">
                        {t("urgent")}
                    </span>
                    <div className="overflow-hidden w-full">
                        <motion.div
                            className="flex gap-16 whitespace-nowrap text-sm"
                            animate={{x: isRtl ? ["0%", "-50%"] : ["-50%", "0%"]}}
                            transition={{
                                duration: Math.max(20, newsbarTexts.length * 8),
                                repeat: Infinity,
                                ease: "linear"
                            }}>
                            {repeated.map((text, i) => <span key={i} className="opacity-90">{text}</span>)}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── Main Header ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0 icon-wrap group">
                    <motion.div whileHover={{scale: 1.1, rotate: -5}}
                                transition={{type: "spring", stiffness: 400, damping: 15}}>
                        <OilDropIcon size={36}/>
                    </motion.div>
                    <div className={`flex flex-col ${isRtl ? "items-end" : "items-start"}`}>
                        <span
                            className="text-xl font-black tracking-widest text-stone-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors duration-200">
                            {t("oil_and_energy_1")}<span className="text-amber-500">{t("oil_and_energy_2")}</span>
                        </span>
                        <span
                            className="text-xs text-gray-400 tracking-widest leading-tight">{t("oil_energy_sub")}</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
                    <NavLink to="/" active={pathname === "/"}>{t("home")}</NavLink>

                    {navCategories.map((cat) => {
                        const slug = toSlug(cat.name)
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
                                        {t(cat.name)}
                                        {hasSubs && (
                                            <motion.span
                                                className={`text-xs opacity-40 ${isRtl ? "mr-0.5" : "ml-0.5"}`}
                                                animate={{rotate: openDropdown === cat.id ? 180 : 0}}
                                                transition={{duration: 0.2}}>
                                                ▾
                                            </motion.span>
                                        )}
                                    </Link>
                                    <span
                                        className={`absolute -bottom-1 h-0.5 bg-amber-500 rounded-full transition-all duration-300 ${
                                            isActive(slug) ? "w-full" : "w-0 group-hover:w-full"
                                        }`}/>
                                </div>

                                <AnimatePresence>
                                    {hasSubs && openDropdown === cat.id && (
                                        <motion.div
                                            initial={{opacity: 0, y: -8, scale: 0.95}}
                                            animate={{opacity: 1, y: 0, scale: 1}}
                                            exit={{opacity: 0, y: -8, scale: 0.95}}
                                            transition={{duration: 0.15, ease: "easeOut"}}
                                            className={`absolute top-full ${isRtl ? "right-0" : "left-0"} mt-3 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 shadow-xl min-w-48 z-50 rounded-xl overflow-hidden`}>
                                            {cat.subcategories.map((sub, i) => (
                                                <motion.div key={sub}
                                                            initial={{opacity: 0, x: isRtl ? -10 : 10}}
                                                            animate={{opacity: 1, x: 0}}
                                                            transition={{delay: i * 0.05}}>
                                                    <Link to={`/category/${sub.replace(/\s+/g, "-").toLowerCase()}`}
                                                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-700 transition-all border-b border-gray-50 dark:border-stone-700 last:border-none group">
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"></span>
                                                        {t(sub)}
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </nav>

                {/* Right — toggle + mobile */}
                <div className="flex items-center gap-4 shrink-0">
                    <button onClick={toggleLang}
                            className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors uppercase">
                        {lang === "ar" ? "EN" : "عربي"}
                    </button>
                    <DarkToggle dark={dark} toggle={toggle}/>
                    <button
                        className="md:hidden flex flex-col gap-1.5 text-stone-900 dark:text-white p-1"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu">
                        <motion.span animate={{rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0}}
                                     className="block w-5 h-0.5 bg-current rounded-full origin-center"/>
                        <motion.span animate={{opacity: menuOpen ? 0 : 1}}
                                     className="block w-5 h-0.5 bg-current rounded-full"/>
                        <motion.span animate={{rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0}}
                                     className="block w-5 h-0.5 bg-current rounded-full origin-center"/>
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        exit={{opacity: 0, height: 0}}
                        className="md:hidden bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-800 overflow-hidden">

                        <motion.div initial={{opacity: 0, x: isRtl ? -20 : 20}} animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.05}}>
                            <Link to="/" onClick={() => setMenuOpen(false)}
                                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-semibold border-b border-gray-100 dark:border-stone-800 transition-colors ${
                                      pathname === "/" ? "text-amber-500 bg-amber-50 dark:bg-stone-800" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-800"
                                  }`}>
                                {pathname === "/" &&
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>}
                                {t("home")}
                            </Link>
                        </motion.div>

                        {navCategories.map((cat, idx) => {
                            const slug = toSlug(cat.name)
                            const hasSubs = cat.subcategories && cat.subcategories.length > 0
                            const isExpanded = mobileExpanded === cat.id
                            return (
                                <motion.div key={cat.id}
                                            initial={{opacity: 0, x: isRtl ? -20 : 20}}
                                            animate={{opacity: 1, x: 0}}
                                            transition={{delay: 0.05 * (idx + 1)}}>
                                    <div
                                        className={`flex items-center border-b border-gray-100 dark:border-stone-800 transition-colors ${
                                            isActive(slug) ? "bg-amber-50 dark:bg-stone-800" : "hover:bg-gray-50 dark:hover:bg-stone-800"
                                        }`}>
                                        <Link to={`/category/${slug}`} onClick={() => setMenuOpen(false)}
                                              className={`flex-1 flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-colors ${
                                                  isActive(slug) ? "text-amber-500" : "text-gray-700 dark:text-gray-200"
                                              }`}>
                                            {isActive(slug) && <span
                                                className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>}
                                            {t(cat.name)}
                                        </Link>
                                        {hasSubs && (
                                            <button
                                                onClick={() => setMobileExpanded(isExpanded ? null : cat.id)}
                                                className="px-4 py-3.5 text-gray-400 hover:text-amber-500 transition-colors">
                                                <motion.span animate={{rotate: isExpanded ? 180 : 0}}
                                                             className="block text-xs">▾
                                                </motion.span>
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {hasSubs && isExpanded && (
                                            <motion.div
                                                initial={{opacity: 0, height: 0}}
                                                animate={{opacity: 1, height: "auto"}}
                                                exit={{opacity: 0, height: 0}}
                                                className="bg-gray-50 dark:bg-stone-800 overflow-hidden">
                                                {cat.subcategories.map((sub, si) => (
                                                    <motion.div key={sub}
                                                                initial={{opacity: 0, x: isRtl ? -10 : 10}}
                                                                animate={{opacity: 1, x: 0}}
                                                                transition={{delay: si * 0.05}}>
                                                        <Link to={`/category/${sub.replace(/\s+/g, "-").toLowerCase()}`}
                                                              onClick={() => setMenuOpen(false)}
                                                              className="flex items-center gap-3 px-10 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-stone-700 transition-colors">
                                                            <span
                                                                className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                                                            {t(sub)}
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}

                        <div className="px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-stone-800">
                            <span className="text-xs text-gray-400">{dark ? t("dark_mode") : t("light_mode")}</span>
                            <DarkToggle dark={dark} toggle={toggle}/>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    )
}