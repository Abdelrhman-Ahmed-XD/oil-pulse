import {useLanguage} from "../../components/LanguageContext"
import {useState} from "react"
import {motion} from "framer-motion"
import {useToast} from "../../components/ToastContext"

function updateAllArticlesAuthor(newDisplayName) {
    const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
    if (articles.length === 0) return
    const updated = articles.map((a) => ({...a, author: newDisplayName}))
    localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
}

export default function AdminSettings({user, setUser}) {
    const toast = useToast()
    const {t, lang} = useLanguage()
    const isRtl = lang === "ar"
    const [profile, setProfile] = useState(() => {
        const stored = localStorage.getItem("oilpulse_admin_profile")
        return stored ? JSON.parse(stored) : {
            displayName: "News Desk",
            email: user.email || "",
            publisherName: "News Desk",
        }
    })

    const [passwords, setPasswords] = useState({current: "", newPass: "", confirm: ""})

    const handleSaveProfile = () => {
        if (!profile.displayName.trim()) {
            toast.warning(t("display_name_required"))
            return
        }

        localStorage.setItem("oilpulse_admin_profile", JSON.stringify(profile))

        const currentUser = JSON.parse(localStorage.getItem("oilpulse_user") || "{}")
        localStorage.setItem("oilpulse_user", JSON.stringify({
            ...currentUser,
            email: profile.email,
            displayName: profile.displayName,
        }))

        const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
        updateAllArticlesAuthor(profile.displayName.trim())

        toast.success(`${t("profile_saved")} — ${articles.length} ${t("article_count")}`)
    }

    const handleChangePassword = () => {
        const adminPass = import.meta.env.VITE_ADMIN_PASS
        if (passwords.current !== adminPass) {
            toast.error(t("pw_wrong"))
            return
        }
        if (passwords.newPass.length < 6) {
            toast.warning(t("pw_min_length"))
            return
        }
        if (passwords.newPass !== passwords.confirm) {
            toast.error(t("pw_mismatch"))
            return
        }

        toast.success(t("pw_changed"))
        setPasswords({current: "", newPass: "", confirm: ""})
    }

    const inputCls = "w-full border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <motion.div className="mb-8" initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}}>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">{t("settings")}</h1>
                <p className="text-sm text-gray-400 mt-1">{t("settings_sub")}</p>
            </motion.div>

            {/* Profile Section */}
            <motion.div
                initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{delay: 0.05}}
                className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700 mb-6">

                <div className="flex items-center gap-3 mb-5">
                    <div
                        className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-base shrink-0">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-stone-900 dark:text-white">{t("profile_title")}</h2>
                        <p className="text-xs text-gray-400">@{user.username} · {user.role === "admin" ? t("admin") : t("editor")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">
                            {t("display_name_label")} *
                        </label>
                        <input
                            type="text"
                            value={profile.displayName}
                            onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                            className={inputCls}
                            placeholder={t("display_name_placeholder")}
                        />
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                            ⚠ {t("display_name_warning")}
                        </p>
                    </div>
                    <div>
                        <label
                            className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">{t("email_label")}</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className={inputCls}
                            placeholder="admin@oilpulse.com"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveProfile}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 text-sm rounded-lg transition-colors"
                    >
                        {t("save_changes")}
                    </button>
                </div>
            </motion.div>

            {/* Change Password Section */}
            <motion.div
                initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}}
                className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700 mb-6">

                <h2 className="text-sm font-black text-stone-900 dark:text-white mb-1">{t("change_password")}</h2>
                <p className="text-xs text-gray-400 mb-5">
                    {t("pw_note")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="sm:col-span-2">
                        <label
                            className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">{t("current_pw")}</label>
                        <input type="password" value={passwords.current}
                               onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                               className={inputCls} placeholder={t("current_pw_placeholder")}/>
                    </div>
                    <div>
                        <label
                            className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">{t("new_pw")}</label>
                        <input type="password" value={passwords.newPass}
                               onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                               className={inputCls} placeholder={t("pw_min_placeholder")}/>
                    </div>
                    <div>
                        <label
                            className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">{t("confirm_pw")}</label>
                        <input type="password" value={passwords.confirm}
                               onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                               className={inputCls} placeholder={t("confirm_pw_placeholder")}/>
                    </div>
                </div>

                <button
                    onClick={handleChangePassword}
                    disabled={!passwords.current || !passwords.newPass || !passwords.confirm}
                    className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-600 dark:hover:bg-stone-500 disabled:opacity-40 text-white font-bold px-6 py-2.5 text-sm rounded-lg transition-colors"
                >
                    {t("change_password")}
                </button>
            </motion.div>

            {/* Account Info Section */}
            <motion.div
                initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{delay: 0.15}}
                className="bg-gray-50 dark:bg-stone-900 p-5 rounded-xl border border-gray-200 dark:border-stone-700">
                <h2 className="text-xs font-black text-gray-500 dark:text-stone-400 tracking-widest mb-3">{t("account_info")}</h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">{t("username_label")}</span>
                        <p className="font-bold text-stone-800 dark:text-stone-100 mt-0.5 font-mono">{user.username}</p>
                    </div>
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">{t("role_label")}</span>
                        <p className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">{user.role === "admin" ? t("admin") : t("editor")}</p>
                    </div>
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">{t("display_name_on_articles")}</span>
                        <p className="font-bold text-stone-800 dark:text-stone-100 mt-0.5">{profile.displayName}</p>
                    </div>
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">{t("storage_label")}</span>
                        <p className="font-bold text-stone-800 dark:text-stone-100 mt-0.5">localStorage</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}