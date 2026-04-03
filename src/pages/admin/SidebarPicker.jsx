import { useLanguage } from "../../components/LanguageContext"
import { useState } from "react"
import { getArticles } from "../../data/articles"

// Map Arabic category names to English
const categoryToEnglish = {
    "الأسواق": "Markets",
    "أسواق": "Markets",
    "تقارير": "Reports",
    "تقرير": "Reports",
    "البترول": "Petroleum",
    "نفط خام": "Crude Oil",
    "الغاز الطبيعي": "Natural Gas",
    "غاز طبيعي": "Natural Gas",
    "الطاقة المتجددة": "Renewable Energy",
    "طاقة متجددة": "Renewable Energy",
    "أوبك+": "OPEC+",
    "اولك": "OPEC+",
}

// Category colors for badges
const categoryColors = {
    "Petroleum": "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300",
    "Crude Oil": "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300",
    "Natural Gas": "bg-blue-100 text-blue-800 dark:bg-blue-400/20 dark:text-blue-300",
    "Renewable Energy": "bg-green-100 text-green-800 dark:bg-green-400/20 dark:text-green-300",
    "Markets": "bg-red-100 text-red-800 dark:bg-red-400/20 dark:text-red-300",
    "Reports": "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
    "OPEC+": "bg-purple-100 text-purple-800 dark:bg-purple-400/20 dark:text-purple-300",
}

// Get display category name (translated)
const getDisplayCategory = (category, t) => {
    const englishName = categoryToEnglish[category] || category
    return t(englishName)
}

// Get category color class
const getCategoryColor = (category) => {
    const englishName = categoryToEnglish[category] || category
    return categoryColors[englishName] || "bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-300"
}

const ADMIN_KEY = "oilpulse_sidebar_admin"
const EDITOR_KEY = "oilpulse_sidebar_editor"

function loadItems(key) {
    return JSON.parse(localStorage.getItem(key) || "[]")
}

function saveItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items))
}

export function getSidebarItems() {
    const adminItems = loadItems(ADMIN_KEY)
    if (adminItems.length > 0) return adminItems

    const editorItems = loadItems(EDITOR_KEY)
    if (editorItems.length > 0) return editorItems

    const articles = getArticles()
    return articles.slice(0, 4).map((a) => a.id)
}

export default function SidebarPicker({ user }) {
    const { t, lang } = useLanguage()
    const isRtl = lang === "ar"
    const isAdmin = user.role === "admin"

    const allArticles = getArticles()
    const adminPicks = loadItems(ADMIN_KEY)
    const editorPicks = loadItems(EDITOR_KEY)

    const adminHasLocked = adminPicks.length > 0
    const currentSource = adminHasLocked ? "admin" : editorPicks.length > 0 ? "editor" : "auto"

    const myCurrentPicks = isAdmin ? adminPicks : editorPicks
    const [selected, setSelected] = useState(myCurrentPicks)
    const [saved, setSaved] = useState(false)

    const isBlocked = !isAdmin && adminHasLocked

    const toggle = (id) => {
        if (isBlocked) return
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
        )
        setSaved(false)
    }

    const handleSave = () => {
        if (isBlocked) return
        const key = isAdmin ? ADMIN_KEY : EDITOR_KEY
        localStorage.setItem(key, JSON.stringify(selected))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        if (isBlocked) return
        const key = isAdmin ? ADMIN_KEY : EDITOR_KEY
        localStorage.removeItem(key)
        setSelected([])
        setSaved(false)
    }

    const handleClearEditorPicks = () => {
        if (!confirm(t("editor_picks_confirm"))) return
        localStorage.removeItem(EDITOR_KEY)
        setSaved(false)
    }

    const handleClearAdminLock = () => {
        if (!confirm(t("admin_lock_confirm"))) return
        localStorage.removeItem(ADMIN_KEY)
        setSelected([])
        setSaved(false)
    }

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white mb-2">{t("sidebar_picker_title")}</h1>
            <p className="text-sm text-gray-400 mb-6">{t("sidebar_picker_desc")}</p>

            {/* Status Banner */}
            <div className={`px-4 py-3 text-sm mb-4 border rounded-lg flex items-center justify-between ${
                currentSource === "admin"
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                    : currentSource === "editor"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                        : "bg-gray-50 dark:bg-stone-800 border-gray-200 dark:border-stone-700 text-gray-500 dark:text-stone-400"
            }`}>
                <span>
                    {currentSource === "admin" && `🔒 ${t("sidebar_admin_locked")}`}
                    {currentSource === "editor" && `✏️ ${t("sidebar_editor_picked")}`}
                    {currentSource === "auto" && `🔄 ${t("sidebar_auto")}`}
                </span>

                {isAdmin && (
                    <div className="flex items-center gap-2 mr-4">
                        {adminHasLocked && (
                            <button onClick={handleClearAdminLock}
                                    className="text-xs border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white px-3 py-1 rounded transition-colors">
                                {t("unlock")}
                            </button>
                        )}
                        {editorPicks.length > 0 && !adminHasLocked && (
                            <button onClick={handleClearEditorPicks}
                                    className="text-xs border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-colors">
                                {t("clear_editor_picks")}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isBlocked && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-4 mb-6 rounded-lg text-center">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">🔒 {t("section_locked_title")}</p>
                    <p className="text-xs text-red-400 dark:text-red-500">{t("section_locked_desc")}</p>
                </div>
            )}

            {/* Article Selection */}
            <div className={`space-y-2 mb-6 ${isBlocked ? "opacity-40 pointer-events-none select-none" : ""}`}>
                {allArticles.map((article) => {
                    const isSelected = selected.includes(article.id)
                    const isDisabled = !isSelected && selected.length >= 4
                    return (
                        <div
                            key={article.id}
                            onClick={() => toggle(article.id)}
                            className={`flex items-center gap-4 px-4 py-3 border rounded-xl transition-all cursor-pointer ${
                                isSelected
                                    ? "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                                    : isDisabled
                                        ? "border-gray-100 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 opacity-40 cursor-not-allowed"
                                        : "border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-amber-300 dark:hover:border-amber-600"
                            }`}
                        >
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300 dark:border-stone-500"
                            }`}>
                                {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 line-clamp-1">{article.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getCategoryColor(article.category)}`}>
                                        {getDisplayCategory(article.category, t)}
                                    </span>
                                </div>
                            </div>
                            {isSelected && (
                                <span className="text-xs bg-amber-500 text-black px-2 py-0.5 font-bold shrink-0 rounded">
                                    {selected.indexOf(article.id) + 1}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>

            {!isBlocked && (
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={selected.length === 0}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-8 py-3 text-sm tracking-widest rounded-lg transition-colors">
                        {saved ? `✓ ${t("saved")}` : isAdmin ? `🔒 ${t("save_lock")}` : t("save_picks")}
                    </button>
                    <button
                        onClick={handleReset}
                        className="border border-gray-200 dark:border-stone-600 text-gray-500 dark:text-stone-400 hover:border-red-300 hover:text-red-500 px-6 py-3 text-sm rounded-lg transition-colors">
                        {t("clear_my_picks")}
                    </button>
                    <span className="text-xs text-gray-400 mr-auto">{selected.length}/4 {t("selected")}</span>
                </div>
            )}

            {!isAdmin && !isBlocked && (
                <p className="text-xs text-gray-400 mt-3">{t("sidebar_editor_note")}</p>
            )}
        </div>
    )
}