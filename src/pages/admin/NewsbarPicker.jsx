// src/pages/admin/NewsbarPicker.jsx - TOP of file
import { useLanguage } from "../../components/LanguageContext"
import { useState } from "react"
import { getArticles } from "../../data/articles"
import { getNewsbarItems } from "../../utils/newsbarUtils"  // Add this import

const ADMIN_KEY = "oilpulse_newsbar_admin"
const EDITOR_KEY = "oilpulse_newsbar_editor"

// Remove the getNewsbarItems function from here - it's now in newsbarUtils.js

// Rest of your component remains the same...

function loadItems(key) {
    return JSON.parse(localStorage.getItem(key) || "[]")
}

function saveItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items))
}


export default function NewsbarPicker({ user }) {
    const { t, lang } = useLanguage()
    const isRtl = lang === "ar"
    const isAdmin = user.role === "admin"
    const myKey = isAdmin ? ADMIN_KEY : EDITOR_KEY

    const allArticles = getArticles()
    const adminItems = loadItems(ADMIN_KEY)
    const editorItems = loadItems(EDITOR_KEY)
    const adminHasLocked = adminItems.length > 0
    const isBlocked = !isAdmin && adminHasLocked

    const [items, setItems] = useState(loadItems(myKey))
    const [customText, setCustomText] = useState("")
    const [selectedArticleId, setSelectedArticleId] = useState("")
    const [saved, setSaved] = useState(false)
    const [dragIdx, setDragIdx] = useState(null)

    const currentSource = adminHasLocked ? "admin" : editorItems.length > 0 ? "editor" : "auto"

    const addCustom = () => {
        if (!customText.trim()) return
        setItems([...items, { id: `custom_${Date.now()}`, text: customText.trim(), type: "custom" }])
        setCustomText("")
        setSaved(false)
    }

    const addArticle = () => {
        if (!selectedArticleId) return
        const article = allArticles.find((a) => a.id === parseInt(selectedArticleId))
        if (!article) return
        if (items.find((i) => i.articleId === article.id)) return
        setItems([...items, { id: `article_${article.id}`, text: article.title, articleId: article.id, type: "article" }])
        setSelectedArticleId("")
        setSaved(false)
    }

    const removeItem = (id) => { setItems(items.filter((i) => i.id !== id)); setSaved(false) }

    const editItem = (id, text) => { setItems(items.map((i) => i.id === id ? { ...i, text } : i)); setSaved(false) }

    const handleDragStart = (i) => setDragIdx(i)
    const handleDragOver = (e, i) => {
        e.preventDefault()
        if (dragIdx === null || dragIdx === i) return
        const b = [...items]
        const [moved] = b.splice(dragIdx, 1)
        b.splice(i, 0, moved)
        setDragIdx(i)
        setItems(b)
    }

    const handleSave = () => {
        saveItems(myKey, items)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        saveItems(myKey, [])
        setItems([])
        setSaved(false)
    }

    const handleClearEditor = () => {
        if (!confirm(t("editor_picks_confirm"))) return
        saveItems(EDITOR_KEY, [])
        setSaved(false)
    }

    const handleClearAdminLock = () => {
        if (!confirm(t("admin_lock_confirm"))) return
        saveItems(ADMIN_KEY, [])
        setItems([])
        setSaved(false)
    }

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white mb-2">{t("newsbar_title")}</h1>
            <p className="text-sm text-gray-400 mb-6">
                {t("newsbar_desc")}
            </p>

            {/* Status Banner */}
            <div className={`px-4 py-3 text-sm mb-4 border rounded-lg flex items-center justify-between ${
                currentSource === "admin"
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                    : currentSource === "editor"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                        : "bg-gray-50 dark:bg-stone-800 border-gray-200 dark:border-stone-700 text-gray-500 dark:text-stone-400"
            }`}>
                <span>
                    {currentSource === "admin" && `🔒 ${t("newsbar_admin_locked")}`}
                    {currentSource === "editor" && `✏️ ${t("newsbar_editor_picked")}`}
                    {currentSource === "auto" && `🔄 ${t("newsbar_auto")}`}
                </span>
                {isAdmin && (
                    <div className="flex gap-2 mr-4">
                        {adminHasLocked && (
                            <button onClick={handleClearAdminLock}
                                    className="text-xs border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white px-3 py-1 rounded transition-colors">
                                {t("unlock")}
                            </button>
                        )}
                        {editorItems.length > 0 && !adminHasLocked && (
                            <button onClick={handleClearEditor}
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
                    <p className="text-xs text-red-400 dark:text-red-500">{t("section_locked_newsbar")}</p>
                </div>
            )}

            <div className={isBlocked ? "opacity-40 pointer-events-none select-none" : ""}>

                {/* Live Preview */}
                <div className="mb-6 bg-stone-900 text-white rounded-xl overflow-hidden">
                    <div className="px-4 py-1.5 bg-stone-800 text-xs text-gray-400 font-bold tracking-widest">{t("newsbar_preview")}</div>
                    <div className="py-2 overflow-hidden px-4 flex items-center gap-4">
                        <span className="text-amber-400 font-bold text-xs shrink-0 border border-amber-400 px-2 py-0.5 rounded">{t("urgent")}</span>
                        <div className="overflow-hidden flex-1">
                            {items.length === 0 ? (
                                <span className="text-gray-500 text-sm italic">{t("newsbar_empty_preview")}</span>
                            ) : (
                                <div className="flex gap-10 text-sm whitespace-nowrap">
                                    {items.map((item) => <span key={item.id}>{item.text}</span>)}
                                    <span className="text-gray-600">·</span>
                                    {items.map((item) => <span key={`r_${item.id}`}>{item.text}</span>)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add from Articles */}
                <div className="bg-white dark:bg-stone-800 p-5 rounded-xl border border-gray-200 dark:border-stone-700 mb-4">
                    <h3 className="text-xs font-black text-gray-500 dark:text-stone-400 tracking-widest mb-3">{t("add_from_articles")}</h3>
                    <div className="flex gap-3">
                        <select value={selectedArticleId} onChange={(e) => setSelectedArticleId(e.target.value)}
                                className="flex-1 border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg">
                            <option value="">{t("choose_article")}</option>
                            {allArticles.map((a) => (
                                <option key={a.id} value={a.id}>{a.title}</option>
                            ))}
                        </select>
                        <button onClick={addArticle} disabled={!selectedArticleId}
                                className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-600 dark:hover:bg-stone-500 disabled:opacity-40 text-white font-bold px-5 text-xs rounded-lg transition-colors">
                            + {t("add_article")}
                        </button>
                    </div>
                </div>

                {/* Add custom text */}
                <div className="bg-white dark:bg-stone-800 p-5 rounded-xl border border-gray-200 dark:border-stone-700 mb-6">
                    <h3 className="text-xs font-black text-gray-500 dark:text-stone-400 tracking-widest mb-3">{t("add_custom_text")}</h3>
                    <div className="flex gap-3">
                        <input type="text" value={customText}
                               onChange={(e) => setCustomText(e.target.value)}
                               onKeyDown={(e) => e.key === "Enter" && addCustom()}
                               className="flex-1 border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"
                               placeholder={t("newsbar_custom_placeholder")} />
                        <button onClick={addCustom} disabled={!customText.trim()}
                                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold px-5 text-xs rounded-lg transition-colors">
                            + {t("add_custom_text")}
                        </button>
                    </div>
                </div>

                {/* Items List */}
                {items.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-stone-700 rounded-xl">
                        <p className="text-3xl mb-2">📰</p>
                        <p className="text-sm">{t("newsbar_no_items")}</p>
                    </div>
                ) : (
                    <div className="space-y-2 mb-6">
                        <p className="text-xs text-gray-500 dark:text-stone-400 mb-2">{t("drag_to_reorder")}</p>
                        {items.map((item, i) => (
                            <div key={item.id}
                                 draggable
                                 onDragStart={() => handleDragStart(i)}
                                 onDragOver={(e) => handleDragOver(e, i)}
                                 onDragEnd={() => setDragIdx(null)}
                                 className={`flex items-center gap-3 bg-white dark:bg-stone-800 border rounded-xl px-4 py-3 transition-all ${
                                     dragIdx === i ? "border-amber-400 opacity-60" : "border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600"
                                 }`}
                            >
                                <span className="text-gray-300 dark:text-stone-600 cursor-grab select-none">⠿</span>
                                <span className="text-xs text-gray-400 dark:text-stone-500 w-5 shrink-0">{i + 1}</span>
                                <span className={`text-xs shrink-0 px-2 py-0.5 rounded-full font-bold ${
                                    item.type === "custom"
                                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                }`}>
                                    {item.type === "custom" ? t("custom_text") : t("article_label")}
                                </span>
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => editItem(item.id, e.target.value)}
                                    className="flex-1 text-sm text-stone-800 dark:text-stone-100 border-0 outline-none bg-transparent focus:bg-gray-50 dark:focus:bg-stone-700 px-2 py-0.5 rounded"
                                />
                                <button onClick={() => removeItem(item.id)}
                                        className="text-red-400 hover:text-red-600 text-xs px-1 shrink-0">✕</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button onClick={handleSave} disabled={items.length === 0}
                            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold px-8 py-3 text-sm tracking-widest rounded-lg transition-colors">
                        {saved ? `✓ ${t("saved")}` : isAdmin ? `🔒 ${t("save_lock")}` : t("save_picks")}
                    </button>
                    <button onClick={handleReset}
                            className="border border-gray-300 dark:border-stone-600 text-gray-500 dark:text-stone-400 hover:border-red-300 hover:text-red-500 px-6 py-3 text-sm rounded-lg transition-colors">
                        {t("reset")}
                    </button>
                    <span className="text-xs text-gray-400 mr-auto">{items.length} {t("items_count")}</span>
                </div>
            </div>
        </div>
    )
}