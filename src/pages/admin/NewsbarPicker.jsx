import { useState } from "react"
import { getArticles } from "../../data/articles"

// ── Storage keys ──────────────────────────────────────────────
const ADMIN_KEY = "oilpulse_newsbar_admin"
const EDITOR_KEY = "oilpulse_newsbar_editor"

function loadItems(key) {
    return JSON.parse(localStorage.getItem(key) || "[]")
}

function saveItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items))
}

// ── Shared logic ──────────────────────────────────────────────
export function getNewsbarItems() {
    const adminItems = loadItems(ADMIN_KEY)
    if (adminItems.length > 0) return adminItems

    const editorItems = loadItems(EDITOR_KEY)
    if (editorItems.length > 0) return editorItems

    // Fallback: latest 5 article titles
    const articles = getArticles()
    return articles.slice(0, 5).map((a) => ({ id: `auto_${a.id}`, text: a.title, articleId: a.id }))
}

export default function NewsbarPicker({ user }) {
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

    // ── Add custom text ──
    const addCustom = () => {
        if (!customText.trim()) return
        setItems([...items, { id: `custom_${Date.now()}`, text: customText.trim(), type: "custom" }])
        setCustomText("")
        setSaved(false)
    }

    // ── Add article ──
    const addArticle = () => {
        if (!selectedArticleId) return
        const article = allArticles.find((a) => a.id === parseInt(selectedArticleId))
        if (!article) return
        if (items.find((i) => i.articleId === article.id)) return
        setItems([...items, { id: `article_${article.id}`, text: article.title, articleId: article.id, type: "article" }])
        setSelectedArticleId("")
        setSaved(false)
    }

    // ── Remove ──
    const removeItem = (id) => { setItems(items.filter((i) => i.id !== id)); setSaved(false) }

    // ── Edit text ──
    const editItem = (id, text) => { setItems(items.map((i) => i.id === id ? { ...i, text } : i)); setSaved(false) }

    // ── Drag & drop reorder ──
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

    // ── Save ──
    const handleSave = () => {
        saveItems(myKey, items)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    // ── Reset my picks ──
    const handleReset = () => {
        saveItems(myKey, [])
        setItems([])
        setSaved(false)
    }

    // ── Admin: clear editor lock ──
    const handleClearEditor = () => {
        if (!confirm("هل أنت متأكد من مسح تحديد المحرر؟")) return
        saveItems(EDITOR_KEY, [])
        setSaved(false)
    }

    // ── Admin: clear own lock ──
    const handleClearAdminLock = () => {
        if (!confirm("هل أنت متأكد من إلغاء قفلك؟ سيتمكن المحرر من التحديد مجدداً.")) return
        saveItems(ADMIN_KEY, [])
        setItems([])
        setSaved(false)
    }

    return (
        <div>
            <h1 className="text-2xl font-black text-stone-900 mb-2">شريط الأخبار العاجلة</h1>
            <p className="text-sm text-gray-400 mb-6">
                تحكم في النصوص التي تظهر في الشريط المتحرك أعلى الصفحة.
                يمكنك إضافة عناوين من المقالات أو كتابة نصوص مخصصة.
            </p>

            {/* Status Banner */}
            <div className={`px-4 py-3 text-sm mb-4 border rounded-lg flex items-center justify-between ${
                currentSource === "admin" ? "bg-amber-50 border-amber-300 text-amber-800" :
                    currentSource === "editor" ? "bg-blue-50 border-blue-200 text-blue-700" :
                        "bg-gray-50 border-gray-200 text-gray-500"
            }`}>
        <span>
          {currentSource === "admin" && "🔒 مدير النظام حدّد شريط الأخبار — يتجاوز صلاحيات المحرر"}
            {currentSource === "editor" && "✏️ المحرر حدّد شريط الأخبار يدوياً"}
            {currentSource === "auto" && "🔄 لا يوجد تحديد — يُعرض آخر 5 عناوين تلقائياً"}
        </span>
                {isAdmin && (
                    <div className="flex gap-2 mr-4">
                        {adminHasLocked && (
                            <button onClick={handleClearAdminLock}
                                    className="text-xs border border-amber-400 text-amber-700 hover:bg-amber-500 hover:text-white px-3 py-1 rounded transition-colors">
                                إلغاء القفل
                            </button>
                        )}
                        {editorItems.length > 0 && !adminHasLocked && (
                            <button onClick={handleClearEditor}
                                    className="text-xs border border-red-300 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-colors">
                                مسح تحديد المحرر
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Blocked message for editor */}
            {isBlocked && (
                <div className="bg-red-50 border border-red-200 px-4 py-4 mb-6 rounded-lg text-center">
                    <p className="text-sm font-bold text-red-600 mb-1">🔒 هذا القسم مقفل من مدير النظام</p>
                    <p className="text-xs text-red-400">قام مدير النظام بتحديد شريط الأخبار. لا يمكنك التعديل حتى يقوم المدير بإلغاء القفل.</p>
                </div>
            )}

            <div className={isBlocked ? "opacity-40 pointer-events-none select-none" : ""}>

                {/* Live Preview */}
                <div className="mb-6 bg-stone-900 text-white rounded-xl overflow-hidden">
                    <div className="px-4 py-1.5 bg-stone-800 text-xs text-gray-400 font-bold tracking-widest">معاينة الشريط</div>
                    <div className="py-2 overflow-hidden px-4 flex items-center gap-4">
                        <span className="text-amber-400 font-bold text-xs shrink-0 border border-amber-400 px-2 py-0.5">عاجل</span>
                        <div className="overflow-hidden flex-1">
                            {items.length === 0 ? (
                                <span className="text-gray-500 text-sm italic">سيظهر هنا شريط الأخبار...</span>
                            ) : (
                                <div className="flex gap-10 text-sm whitespace-nowrap animate-pulse-once">
                                    {items.map((item) => <span key={item.id}>{item.text}</span>)}
                                    <span className="text-gray-600">·</span>
                                    {items.map((item) => <span key={`r_${item.id}`}>{item.text}</span>)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add from Articles */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 mb-4">
                    <h3 className="text-xs font-black text-gray-500 tracking-widest mb-3">إضافة من المقالات</h3>
                    <div className="flex gap-3">
                        <select value={selectedArticleId} onChange={(e) => setSelectedArticleId(e.target.value)}
                                className="flex-1 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 bg-white rounded-lg">
                            <option value="">اختر مقالاً...</option>
                            {allArticles.map((a) => (
                                <option key={a.id} value={a.id}>{a.title}</option>
                            ))}
                        </select>
                        <button onClick={addArticle} disabled={!selectedArticleId}
                                className="bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-white font-bold px-5 text-xs rounded-lg transition-colors">
                            + إضافة
                        </button>
                    </div>
                </div>

                {/* Add custom text */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 mb-6">
                    <h3 className="text-xs font-black text-gray-500 tracking-widest mb-3">إضافة نص مخصص</h3>
                    <div className="flex gap-3">
                        <input type="text" value={customText}
                               onChange={(e) => setCustomText(e.target.value)}
                               onKeyDown={(e) => e.key === "Enter" && addCustom()}
                               className="flex-1 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"
                               placeholder="مثال: خام برنت يرتفع إلى 85 دولاراً للبرميل..." />
                        <button onClick={addCustom} disabled={!customText.trim()}
                                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold px-5 text-xs rounded-lg transition-colors">
                            + إضافة
                        </button>
                    </div>
                </div>

                {/* Items List */}
                {items.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-3xl mb-2">📰</p>
                        <p className="text-sm">لا توجد عناصر — أضف من المقالات أو أكتب نصاً مخصصاً</p>
                    </div>
                ) : (
                    <div className="space-y-2 mb-6">
                        <p className="text-xs text-gray-500 mb-2">اسحب لإعادة الترتيب:</p>
                        {items.map((item, i) => (
                            <div key={item.id}
                                 draggable
                                 onDragStart={() => handleDragStart(i)}
                                 onDragOver={(e) => handleDragOver(e, i)}
                                 onDragEnd={() => setDragIdx(null)}
                                 className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 transition-all ${
                                     dragIdx === i ? "border-amber-400 opacity-60" : "border-gray-200 hover:border-gray-300"
                                 }`}
                            >
                                <span className="text-gray-300 cursor-grab select-none">⠿</span>
                                <span className="text-xs text-gray-400 w-5 shrink-0">{i + 1}</span>
                                <span className={`text-xs shrink-0 px-2 py-0.5 rounded-full font-bold ${
                                    item.type === "custom"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-amber-100 text-amber-700"
                                }`}>
                  {item.type === "custom" ? "نص" : "مقال"}
                </span>
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => editItem(item.id, e.target.value)}
                                    className="flex-1 text-sm text-stone-800 border-0 outline-none bg-transparent focus:bg-gray-50 px-2 py-0.5 rounded"
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
                        {saved ? "✓ تم الحفظ" : isAdmin ? "🔒 حفظ وقفل" : "حفظ التحديد"}
                    </button>
                    <button onClick={handleReset}
                            className="border border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500 px-6 py-3 text-sm rounded-lg transition-colors">
                        إعادة تعيين
                    </button>
                    <span className="text-xs text-gray-400 mr-auto">{items.length} عنصر</span>
                </div>
            </div>
        </div>
    )
}