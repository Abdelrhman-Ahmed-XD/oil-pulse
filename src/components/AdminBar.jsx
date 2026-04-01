import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useLanguage } from "./LanguageContext"

export default function AdminBar({ user, onClose }) {
    const navigate = useNavigate()
    const { t, lang } = useLanguage()

    if (!user) return null

    return (
        <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[60] h-10 bg-stone-900 text-white flex items-center px-4 gap-3"
            dir={lang === "ar" ? "rtl" : "ltr"}
        >
            {/* User info */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xs">
                    {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white hidden sm:block">{user.username}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    user.role === "admin"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                }`}>
                    {user.role === "admin" ? t("role_admin") : t("role_editor")}
                </span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-stone-700 shrink-0"></div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-1">
                <button
                    onClick={() => navigate("/admin/dashboard/new")}
                    className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black px-3 py-1 rounded-lg transition-colors"
                >
                    <span>+</span>
                    <span className="hidden sm:block">{t("new_article")}</span>
                </button>

                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center gap-1.5 text-xs font-bold border border-stone-600 hover:border-amber-500 hover:text-amber-400 text-stone-300 px-3 py-1 rounded-lg transition-colors"
                >
                    <span>⚙</span>
                    <span className="hidden sm:block">{t("control_panel")}</span>
                </button>
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="shrink-0 text-stone-500 hover:text-white transition-colors p-1 rounded"
                aria-label="إخفاء الشريط"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </motion.div>
    )
}