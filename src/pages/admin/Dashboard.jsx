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

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("oilpulse_user")
        if (!stored) { navigate("/admin"); return }
        setUser(JSON.parse(stored))
    }, [])

    if (!user) return null

    return (
        <div className="flex min-h-screen bg-gray-100" dir="rtl">

            {/* ── Mobile overlay ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar — fixed on desktop, drawer on mobile ── */}
            <div className={`
        fixed top-0 right-0 h-full z-50 transition-transform duration-300 lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
                <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* ── Main content ── */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                {/* Mobile topbar */}
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-black text-stone-900">
            نفط <span className="text-amber-500">وطاقة</span>
          </span>
                    <button onClick={() => setSidebarOpen(true)}
                            className="flex flex-col gap-1 p-1">
                        <span className="block w-5 h-0.5 bg-stone-800 rounded-full"></span>
                        <span className="block w-5 h-0.5 bg-stone-800 rounded-full"></span>
                        <span className="block w-5 h-0.5 bg-stone-800 rounded-full"></span>
                    </button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route index element={<Analytics user={user} />} />
                        <Route path="articles" element={<ArticlesList user={user} />} />
                        <Route path="new" element={<ArticleForm user={user} />} />
                        <Route path="edit/:id" element={<ArticleForm user={user} isEdit />} />
                        <Route path="sidebar" element={<SidebarPicker user={user} />} />
                        <Route path="newsbar" element={<NewsbarPicker user={user} />} />
                        {user.role === "admin" && (
                            <>
                                <Route path="editors" element={<EditorsList />} />
                                <Route path="categories" element={<CategoriesList />} />
                            </>
                        )}
                    </Routes>
                </div>
            </main>
        </div>
    )
}