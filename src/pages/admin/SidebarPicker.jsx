import { useState } from "react"

const defaultArticles = [
    { id: 1, title: "أوبك+ تمدد خفض الإنتاج حتى نهاية الربع الثالث 2026", category: "أوبك+" },
    { id: 2, title: "الطاقة الشمسية تتجاوز الفحم لأول مرة في تاريخ أوروبا", category: "طاقة متجددة" },
    { id: 3, title: "العراق يرفع طاقته التكريرية بافتتاح مصفاة الفاو الكبرى", category: "نفط خام" },
    { id: 4, title: "أسعار الغاز الطبيعي تتراجع 8% بسبب وفرة الإمدادات الأمريكية", category: "غاز طبيعي" },
    { id: 5, title: "المملكة العربية السعودية تضخ 50 مليار دولار في مشاريع الهيدروجين", category: "طاقة متجددة" },
    { id: 6, title: "برنت يتخطى 85 دولاراً للمرة الأولى منذ ثلاثة أشهر", category: "أسواق" },
]

export default function SidebarPicker({ user }) {
    const isAdmin = user.role === "admin"

    const storedArticles = JSON.parse(localStorage.getItem("oilpulse_articles") || "null")
    const articles = (storedArticles && storedArticles.length > 0) ? storedArticles : defaultArticles

    const adminPicks = JSON.parse(localStorage.getItem("oilpulse_sidebar_admin") || "[]")
    const editorPicks = JSON.parse(localStorage.getItem("oilpulse_sidebar_editor") || "[]")

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
        const key = isAdmin ? "oilpulse_sidebar_admin" : "oilpulse_sidebar_editor"
        localStorage.setItem(key, JSON.stringify(selected))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        if (isBlocked) return
        const key = isAdmin ? "oilpulse_sidebar_admin" : "oilpulse_sidebar_editor"
        localStorage.removeItem(key)
        setSelected([])
        setSaved(false)
    }

    const handleClearEditorPicks = () => {
        if (!confirm("هل أنت متأكد من مسح تحديد المحرر؟")) return
        localStorage.removeItem("oilpulse_sidebar_editor")
        setSaved(false)
    }

    const handleClearAdminLock = () => {
        if (!confirm("هل أنت متأكد من إلغاء قفلك؟ سيتمكن المحرر من التحديد مجدداً.")) return
        localStorage.removeItem("oilpulse_sidebar_admin")
        setSelected([])
        setSaved(false)
    }

    return (
        <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white mb-2">أبرز الأخبار — الصفحة الرئيسية</h1>
            <p className="text-sm text-gray-400 mb-6">
                حددوا ما يصل إلى أربعة أخبار تظهر في القسم الجانبي.
                في حال عدم التحديد، تُعرض آخر أربعة أخبار تلقائياً.
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
                    {currentSource === "admin" && "🔒 مدير النظام حدّد الأخبار — هذا التحديد يتجاوز صلاحيات المحرر"}
                    {currentSource === "editor" && "✏️ المحرر حدّد الأخبار يدوياً"}
                    {currentSource === "auto" && "🔄 لا يوجد تحديد — تُعرض آخر أربعة أخبار تلقائياً"}
                </span>

                {isAdmin && (
                    <div className="flex items-center gap-2 mr-4">
                        {adminHasLocked && (
                            <button onClick={handleClearAdminLock}
                                    className="text-xs border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white px-3 py-1 rounded transition-colors">
                                إلغاء القفل
                            </button>
                        )}
                        {editorPicks.length > 0 && !adminHasLocked && (
                            <button onClick={handleClearEditorPicks}
                                    className="text-xs border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-colors">
                                مسح تحديد المحرر
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isBlocked && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-4 mb-6 rounded-lg text-center">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">🔒 هذا القسم مقفل من مدير النظام</p>
                    <p className="text-xs text-red-400 dark:text-red-500">
                        قام مدير النظام بتحديد الأخبار يدوياً. لا يمكنك التعديل حتى يقوم المدير بإلغاء القفل.
                    </p>
                </div>
            )}

            {/* Article Selection */}
            <div className={`space-y-2 mb-6 ${isBlocked ? "opacity-40 pointer-events-none select-none" : ""}`}>
                {articles.map((article) => {
                    const isSelected = selected.includes(article.id)
                    const isDisabled = !isSelected && selected.length >= 4
                    return (
                        <div
                            key={article.id}
                            onClick={() => toggle(article.id)}
                            className={`flex items-center gap-4 px-4 py-3 border rounded-xl transition-all ${
                                isSelected
                                    ? "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                                    : isDisabled
                                        ? "border-gray-100 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 opacity-40 cursor-not-allowed"
                                        : "border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-amber-300 dark:hover:border-amber-600 cursor-pointer"
                            }`}
                        >
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300 dark:border-stone-500"
                            }`}>
                                {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 line-clamp-1">{article.title}</p>
                                <p className="text-xs text-gray-400 dark:text-stone-500 mt-0.5">{article.category}</p>
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
                        {saved ? "✓ تم الحفظ" : isAdmin ? "🔒 حفظ وقفل" : "حفظ التحديد"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="border border-gray-200 dark:border-stone-600 text-gray-500 dark:text-stone-400 hover:border-red-300 hover:text-red-500 px-6 py-3 text-sm rounded-lg transition-colors">
                        إلغاء تحديدي
                    </button>
                    <span className="text-xs text-gray-400 mr-auto">{selected.length}/4 محدد</span>
                </div>
            )}

            {!isAdmin && !isBlocked && (
                <p className="text-xs text-gray-400 mt-3">
                    ملاحظة: يمكن لمدير النظام تجاوز تحديدك في أي وقت.
                </p>
            )}
        </div>
    )
}