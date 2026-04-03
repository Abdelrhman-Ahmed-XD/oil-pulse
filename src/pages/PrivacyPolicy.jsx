import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../components/LanguageContext"

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
    })
}

export default function PrivacyPolicy() {
    const navigate = useNavigate()
    const { t, lang } = useLanguage()
    const isRtl = lang === "ar"

    // Dynamic sections based on translation keys
    const sections = [
        { id: 1, title: t("privacy_intro_title"), icon: "📋", contentKey: "privacy_intro_content" },
        { id: 2, title: t("privacy_collect_title"), icon: "📊", contentKey: "privacy_collect_content" },
        { id: 3, title: t("privacy_use_title"), icon: "🔍", contentKey: "privacy_use_content" },
        { id: 4, title: t("privacy_protect_title"), icon: "🔒", contentKey: "privacy_protect_content" },
        { id: 5, title: t("privacy_share_title"), icon: "🤝", contentKey: "privacy_share_content" },
        { id: 6, title: t("privacy_comments_title"), icon: "💬", contentKey: "privacy_comments_content" },
        { id: 7, title: t("privacy_cookies_title"), icon: "🍪", contentKey: "privacy_cookies_content" },
        { id: 8, title: t("privacy_intellectual_title"), icon: "©️", contentKey: "privacy_intellectual_content" },
        { id: 9, title: t("privacy_updates_title"), icon: "🔄", contentKey: "privacy_updates_content" },
        { id: 10, title: t("privacy_contact_title"), icon: "📧", contentKey: "privacy_contact_content" },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10" dir={isRtl ? "rtl" : "ltr"}>

            {/* Back button */}
            <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-amber-600 font-bold mb-8 hover:text-amber-500 transition-colors">
                {isRtl ? "→ العودة" : "← Back"}
            </button>

            {/* Header */}
            <motion.div className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
                    🔒 {t("privacy_title")}
                </div>
                <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-4">
                    {t("privacy_title")}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
                    {t("privacy_sub")}
                </p>
                <div className="mt-4 text-xs text-gray-400">{t("privacy_last_updated") || "Last updated: March 2026"}</div>
            </motion.div>

            {/* Table of Contents */}
            <motion.div
                className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 rounded-2xl p-6 mb-10"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h2 className="text-sm font-black text-amber-700 dark:text-amber-400 mb-4 tracking-widest">{t("privacy_toc")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sections.map((s) => (
                        <a key={s.id} href={`#section-${s.id}`}
                           className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group">
                            <span className="text-amber-400 text-xs font-black">{s.id}.</span>
                            <span className="group-hover:underline">{s.title}</span>
                        </a>
                    ))}
                </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-6">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.id}
                        id={`section-${section.id}`}
                        className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-2xl p-6 sm:p-8 scroll-mt-24"
                        initial="hidden" animate="visible" custom={i} variants={fadeUp}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl shrink-0">
                                {section.icon}
                            </div>
                            <h2 className="text-lg font-black text-stone-900 dark:text-white">
                                {section.id}. {section.title}
                            </h2>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line">
                            {t(section.contentKey)}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer note */}
            <motion.div className="mt-10 text-center bg-stone-900 dark:bg-stone-950 text-white rounded-2xl p-8"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-lg font-black mb-2">{t("privacy_priority")}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                    {t("privacy_footer")}
                </p>
                <button onClick={() => navigate(-1)}
                        className="mt-5 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-2.5 text-sm rounded-lg transition-colors">
                    {t("back_to_site")}
                </button>
            </motion.div>

        </main>
    )
}