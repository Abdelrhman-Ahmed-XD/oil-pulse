import { useLanguage } from "../../components/LanguageContext"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { OilDropIcon } from "../../components/CategoryIcons"
import { getArticles } from "../../data/articles"
import { useToast } from "../../components/ToastContext"

export default function Login() {
    const navigate = useNavigate()
    const toast = useToast()
    const { t, lang } = useLanguage()
    const isRtl = lang === "ar"
    const [mode, setMode] = useState("login")
    const [form, setForm] = useState({ identity: "", password: "", remember: false })
    const [forgotIdentity, setForgotIdentity] = useState("")
    const [loading, setLoading] = useState(false)
    const [forgotSent, setForgotSent] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Stats for decorative left side
    const articles = getArticles()
    const categories = JSON.parse(localStorage.getItem("oilpulse_categories") || "[]")

    // Load remembered identity on mount
    useEffect(() => {
        const remembered = localStorage.getItem("oilpulse_remember")
        if (remembered) setForm((prev) => ({ ...prev, identity: remembered, remember: true }))
    }, [])

    // ── Static users from .env ───────────────────────────────────
    const ENV_USERS = [
        { username: import.meta.env.VITE_ADMIN_USER, email: import.meta.env.VITE_ADMIN_EMAIL || "admin@oilpulse.com", password: import.meta.env.VITE_ADMIN_PASS, role: "admin" },
        { username: import.meta.env.VITE_EDITOR1_USER, email: import.meta.env.VITE_EDITOR1_EMAIL || "editor1@oilpulse.com", password: import.meta.env.VITE_EDITOR1_PASS, role: "editor" },
        { username: import.meta.env.VITE_EDITOR2_USER, email: import.meta.env.VITE_EDITOR2_EMAIL || "editor2@oilpulse.com", password: import.meta.env.VITE_EDITOR2_PASS, role: "editor" },
    ]

    // ── Merges .env users + dynamic editors created in EditorsList ──
    const getAllUsers = () => {
        const dynamicEditors = JSON.parse(localStorage.getItem("oilpulse_editors") || "[]")
            .map((e) => ({ ...e, role: "editor" }))
        const envUsernames = ENV_USERS.map((u) => u.username)
        const extraEditors = dynamicEditors.filter((e) => !envUsernames.includes(e.username))
        return [...ENV_USERS, ...extraEditors]
    }

    const handleLogin = () => {
        if (!form.identity.trim() || !form.password.trim()) {
            toast.warning(t("login_fields_required"))
            return
        }
        setLoading(true)
        setTimeout(() => {
            const USERS = getAllUsers()
            const user = USERS.find(
                (u) => (u.username === form.identity || u.email === form.identity) && u.password === form.password
            )
            if (user) {
                if (form.remember) {
                    localStorage.setItem("oilpulse_remember", form.identity)
                } else {
                    localStorage.removeItem("oilpulse_remember")
                }
                localStorage.setItem("oilpulse_user", JSON.stringify(user))
                toast.success(t("login_welcome") + " " + user.username)
                navigate("/admin/dashboard")
            } else {
                toast.error(t("login_invalid"))
                setLoading(false)
            }
        }, 600)
    }

    const handleForgot = () => {
        if (!forgotIdentity.trim()) {
            toast.warning(t("login_identity_required"))
            return
        }
        setLoading(true)
        setTimeout(() => {
            setLoading(false);
            setForgotSent(true)
            toast.info(t("login_recovery_sent"))
        }, 800)
    }

    return (
        <div className="min-h-screen bg-stone-950 flex" dir={isRtl ? "rtl" : "ltr"}>

            {/* Left — Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative overflow-hidden flex-col items-center justify-center p-16">
                <div className="absolute inset-0 opacity-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute border border-amber-400 rounded-full"
                             style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                    ))}
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }} className="relative z-10 text-center">
                    <div className="flex justify-center mb-6 icon-wrap">
                        <OilDropIcon size={100} />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-widest mb-3">
                        {t("oil_and_energy_1")}<span className="text-amber-400">{t("oil_and_energy_2")}</span>
                    </h1>
                    <p className="text-gray-400 text-sm tracking-widest mb-8">{t("oil_energy_sub")}</p>
                    <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6"></div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                        {t("about_desc")}
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12">
                    {[
                        { label: t("published_news"), value: articles.length },
                        { label: t("categories"), value: categories.length || 6 },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl font-black text-amber-400">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-10 icon-wrap">
                        <div className="flex justify-center mb-3"><OilDropIcon size={56} /></div>
                        <h1 className="text-2xl font-black text-white tracking-widest">
                            {t("oil_and_energy_1")}<span className="text-amber-400">{t("oil_and_energy_2")}</span>
                        </h1>
                    </div>

                    <AnimatePresence mode="wait">

                        {/* Login */}
                        {mode === "login" && (
                            <motion.div key="login"
                                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <h2 className="text-2xl font-black text-white mb-1">{t("login_title")}</h2>
                                <p className="text-gray-500 text-sm mb-8">{t("login_subtitle")}</p>

                                <div className="space-y-4">
                                    {/* Identity */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 tracking-widest">
                                            {t("login_identity_label")}
                                        </label>
                                        <input type="text" value={form.identity}
                                               onChange={(e) => setForm({ ...form, identity: e.target.value }) }
                                               className="w-full bg-stone-900 border border-stone-700 text-white px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors rounded-lg placeholder:text-gray-600"
                                               placeholder={t("login_identity_placeholder")} />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-bold text-gray-400 tracking-widest">{t("login_password_label")}</label>
                                            <button onClick={() => setMode("forgot") }
                                                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                                                {t("login_forgot_password")}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value }) }
                                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                                className="w-full bg-stone-900 border border-stone-700 text-white px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors rounded-lg placeholder:text-gray-600 pl-12"
                                                placeholder={t("login_password_placeholder")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            onClick={() => setForm({ ...form, remember: !form.remember })}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                                form.remember ? "bg-amber-500 border-amber-500" : "border-stone-600 group-hover:border-amber-400"
                                            }`}
                                        >
                                            {form.remember && (
                                                <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{t("login_remember")}</span>
                                    </label>

                                    <button onClick={handleLogin} disabled={loading}
                                            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3.5 text-sm tracking-widest transition-colors mt-2 rounded-lg">
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                                </svg>
                                                {t("login_verifying")}
                                            </span>
                                        ) : t("login_btn")}
                                    </button>
                                </div>

                                <p className="text-center text-xs text-gray-600 mt-8">{t("login_support")}</p>
                            </motion.div>
                        )}

                        {/* Forgot Password */}
                        {mode === "forgot" && (
                            <motion.div key="forgot"
                                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <button onClick={() => { setMode("login"); setForgotSent(false) }}
                                        className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors text-sm mb-6">
                                    {isRtl ? "→ " + t("back_to_login") : t("back_to_login") + " →"}
                                </button>
                                <h2 className="text-2xl font-black text-white mb-1">{t("forgot_title")}</h2>
                                <p className="text-gray-500 text-sm mb-8">{t("forgot_subtitle")}</p>

                                {forgotSent ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                                className="bg-green-950 border border-green-800 px-6 py-8 text-center rounded-xl">
                                        <div className="text-4xl mb-3">✅</div>
                                        <p className="text-green-400 font-bold mb-2">{t("forgot_success_title")}</p>
                                        <p className="text-gray-400 text-sm">{t("forgot_success_message")}</p>
                                        <button onClick={() => { setMode("login"); setForgotSent(false) }}
                                                className="mt-6 text-amber-400 hover:text-amber-300 text-sm font-bold transition-colors">
                                            {t("back_to_login")}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        <input type="text" value={forgotIdentity}
                                               onChange={(e) => setForgotIdentity(e.target.value) }
                                               onKeyDown={(e) => e.key === "Enter" && handleForgot()}
                                               className="w-full bg-stone-900 border border-stone-700 text-white px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors rounded-lg placeholder:text-gray-600"
                                               placeholder={t("forgot_identity_placeholder")} />
                                        <button onClick={handleForgot} disabled={loading}
                                                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3.5 text-sm tracking-widest rounded-lg transition-colors">
                                            {loading ? t("sending") + "..." : t("send_recovery")}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}