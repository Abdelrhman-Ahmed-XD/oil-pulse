import {useNavigate, useLocation} from "react-router-dom"
import {motion} from "framer-motion"
import {useLanguage} from "../../components/LanguageContext"

export default function Sidebar({user, onClose, dark, onToggleDark}) {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const {lang, toggleLang, t} = useLanguage()

    const isRtl = lang === "ar"

    const handleLogout = () => {
        localStorage.removeItem("oilpulse_user")
        navigate("/admin")
    }

    const navItems = [
        {label: t("analytics"), path: "/admin/dashboard", icon: "📊"},
        {label: t("published_news"), path: "/admin/dashboard/articles", icon: "📋"},
        {label: t("add_article"), path: "/admin/dashboard/new", icon: "✏️"},
        {label: t("top_news"), path: "/admin/dashboard/sidebar", icon: "⭐"},
        {label: t("newsbar"), path: "/admin/dashboard/newsbar", icon: "📰"},
        ...(user.role === "admin" ? [
            {label: t("manage_editors"), path: "/admin/dashboard/editors", icon: "👥"},
            {label: t("manage_categories"), path: "/admin/dashboard/categories", icon: "🗂️"},
            {label: t("settings"), path: "/admin/dashboard/settings", icon: "⚙️"},
        ] : [
            {label: t("settings"), path: "/admin/dashboard/settings", icon: "⚙️"},
        ]),
    ]

    const handleNav = (path) => {
        navigate(path)
        onClose?.()
    }

    return (
        <aside
            className="w-64 bg-stone-900 text-white flex flex-col h-full"
            dir={isRtl ? "rtl" : "ltr"}
        >
            {/* Header */}
            <div className="px-5 py-5 border-b border-stone-700 flex items-center justify-between shrink-0">
                <div>
                    <span className="text-lg font-black tracking-widest">
                        {t("oil_and_energy_1")}<span className="text-amber-400">{t("oil_and_energy_2")}</span>
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">{t("dashboard")}</p>
                </div>
                {/* X button — mobile only */}
                {onClose && (
                    <button onClick={onClose}
                            className="lg:hidden text-gray-400 hover:text-white p-1 rounded transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                )}
            </div>

            {/* User info */}
            <div className="px-5 py-4 border-b border-stone-700 shrink-0">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-sm shrink-0">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{user.username}</p>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 font-bold rounded-full">
                            {user.role === "admin" ? t("admin") : t("editor")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.path
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            className={`w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2.5 text-sm font-semibold flex items-center gap-3 rounded-xl transition-all ${
                                isActive
                                    ? "bg-amber-500 text-black shadow-sm"
                                    : "text-gray-400 hover:bg-stone-800 hover:text-white"
                            }`}
                        >
                            <span className="text-base shrink-0">{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 py-4 border-t border-stone-700 space-y-0.5 shrink-0">
                {/* Language Toggle */}
                <div
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                    onClick={toggleLang}>
                    <div className="flex items-center gap-3">
                        <span className="text-base">🌍</span>
                        <span className="text-xs text-gray-400">{lang === "ar" ? "English" : "العربية"}</span>
                    </div>
                    <span className="text-xs font-bold text-stone-500">{lang === "ar" ? "EN" : "AR"}</span>
                </div>

                {/* Dark mode toggle */}
                <div
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-colors">
                    <div className="flex items-center gap-3">
                        <span className="text-base">{dark ? "🌙" : "☀️"}</span>
                        <span className="text-xs text-gray-400">{dark ? t("dark_mode") : t("light_mode")}</span>
                    </div>
                    <button
                        onClick={onToggleDark}
                        aria-label="Toggle Theme"
                        style={{
                            width: "36px", height: "20px", borderRadius: "10px",
                            backgroundColor: dark ? "#F59E0B" : "#4b5563",
                            position: "relative", border: "none", cursor: "pointer",
                            flexShrink: 0, outline: "none", transition: "background-color 0.3s ease",
                        }}>
                        <motion.div
                            style={{
                                position: "absolute", top: "2px", width: "16px", height: "16px",
                                borderRadius: "50%", backgroundColor: "#ffffff",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                            }}
                            animate={{left: dark ? "18px" : "2px"}}
                            transition={{type: "spring", stiffness: 500, damping: 30, mass: 0.8}}
                        />
                    </button>
                </div>

                <button
                    onClick={() => {
                        navigate("/");
                        onClose?.()
                    }}
                    className={`w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2.5 text-xs text-gray-400 hover:text-white flex items-center gap-3 rounded-xl hover:bg-stone-800 transition-colors`}
                >
                    <span>🌐</span>
                    <span>{t("view_site")}</span>
                </button>
                <button
                    onClick={handleLogout}
                    className={`w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2.5 text-xs text-red-400 hover:text-red-300 flex items-center gap-3 rounded-xl hover:bg-stone-800 transition-colors`}
                >
                    <span>🚪</span>
                    <span>{t("logout")}</span>
                </button>
            </div>
        </aside>
    )
}