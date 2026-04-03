import { useLanguage } from "../../components/LanguageContext"
import { useEffect, useState } from "react"
import { useNavigate, Routes, Route } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "./Sidebar"
import ArticlesList from "./ArticlesList"
import ArticleForm from "./ArticleForm"
import EditorsList from "./EditorsList"
import CategoriesList from "./CategoriesList"
import SidebarPicker from "./SidebarPicker"
import NewsbarPicker from "./NewsbarPicker"
import Analytics from "./Analytics"
import AdminSettings from "./AdminSettings"
import { useDarkMode } from "../../components/useDarkMode"

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const { t, lang } = useLanguage()
    const isRtl = lang === "ar"
    const [mobileOpen, setMobileOpen] = useState(false)
    const { dark, toggle } = useDarkMode()

    useEffect(() => {
        const stored = localStorage.getItem("oilpulse_user")
        if (!stored) { navigate("/admin"); return }
        setUser(JSON.parse(stored))
    }, [])

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-stone-950 flex" dir={isRtl ? "rtl" : "ltr"}>

            {/* ── Desktop Sidebar — always visible, static in flow ── */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0">
                <div className="sticky top-0 h-screen overflow-y-auto">
                    <Sidebar user={user} dark={dark} onToggleDark={toggle} />
                </div>
            </div>

            {/* ── Mobile Sidebar Drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        {/* Drawer */}
                        <motion.div
                            key="drawer"
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full z-50 lg:hidden">
                            <Sidebar user={user} dark={dark} onToggleDark={toggle} onClose={() => setMobileOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0 flex flex-col">

                {/* Mobile topbar */}
                <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 px-4 py-3 flex items-center justify-between shadow-sm">
                    <span className="text-base font-black text-stone-900 dark:text-white">
                        {t("oil_and_energy_1")}<span className="text-amber-500">{t("oil_and_energy_2")}</span>
                    </span>
                    <div className="flex items-center gap-3">
                        {/* Dark mode toggle — mobile */}
                        <button
                            onClick={toggle}
                            aria-label={t("dark_mode")}
                            style={{
                                width: "40px", height: "22px", borderRadius: "11px",
                                backgroundColor: dark ? "#F59E0B" : "#D1D5DB",
                                position: "relative", border: "none", cursor: "pointer",
                                flexShrink: 0, outline: "none", transition: "background-color 0.3s ease",
                            }}>
                            <motion.div
                                style={{
                                    position: "absolute", top: "2px", width: "18px", height: "18px",
                                    borderRadius: "50%", backgroundColor: "#ffffff",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "10px", lineHeight: 1,
                                }}
                                animate={{ left: dark ? "20px" : "2px" }}
                                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}>
                                {dark ? "🌙" : "☀️"}
                            </motion.div>
                        </button>
                        <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors">
                            <svg className="w-5 h-5 text-stone-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Routes>
                        <Route index element={<Analytics user={user} />} />
                        <Route path="articles" element={<ArticlesList user={user} />} />
                        <Route path="new" element={<ArticleForm user={user} />} />
                        <Route path="edit/:id" element={<ArticleForm user={user} isEdit />} />
                        <Route path="sidebar" element={<SidebarPicker user={user} />} />
                        <Route path="newsbar" element={<NewsbarPicker user={user} />} />
                        <Route path="settings" element={<AdminSettings user={user} setUser={setUser} />} />
                        {user.role === "admin" && (
                            <>
                                <Route path="editors" element={<EditorsList />} />
                                <Route path="categories" element={<CategoriesList />} />
                            </>
                        )}
                    </Routes>
                </main>
            </div>

        </div>
    )
}