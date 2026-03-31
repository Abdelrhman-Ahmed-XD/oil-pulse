import { useState } from "react"

const defaultCategories = [
    { id: 1, name: "نفط خام", subcategories: [] },
    { id: 2, name: "غاز طبيعي", subcategories: [] },
    { id: 3, name: "طاقة متجددة", subcategories: [] },
    { id: 4, name: "أوبك+", subcategories: [] },
    { id: 5, name: "أسواق", subcategories: [] },
    { id: 6, name: "تقارير", subcategories: [] },
]

function loadCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    if (stored) return JSON.parse(stored)
    return defaultCategories
}

function saveCategories(cats) {
    localStorage.setItem("oilpulse_categories_v2", JSON.stringify(cats))
    localStorage.setItem("oilpulse_categories", JSON.stringify(cats.map((c) => c.name)))
}

export default function CategoriesList() {
    const [categories, setCategories] = useState(loadCategories())
    const [newCat, setNewCat] = useState("")
    const [newSubInputs, setNewSubInputs] = useState({})
    const [error, setError] = useState("")
    const [expandedId, setExpandedId] = useState(null)

    // Drag state for categories
    const [dragCatIdx, setDragCatIdx] = useState(null)

    // Drag state for subcategories
    const [dragSubInfo, setDragSubInfo] = useState(null) // { catId, subIdx }

    const save = (updated) => {
        setCategories(updated)
        saveCategories(updated)
    }

    // ── ADD CATEGORY ──
    const handleAddCat = () => {
        if (!newCat.trim()) return setError("يرجى إدخال اسم التصنيف")
        if (categories.find((c) => c.name === newCat.trim())) return setError("هذا التصنيف موجود بالفعل")
        save([...categories, { id: Date.now(), name: newCat.trim(), subcategories: [] }])
        setNewCat("")
        setError("")
    }

    // ── REMOVE CATEGORY ──
    const handleRemoveCat = (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا التصنيف وكل تصنيفاته الفرعية؟")) return
        save(categories.filter((c) => c.id !== id))
    }

    // ── ADD SUBCATEGORY ──
    const handleAddSub = (catId) => {
        const subName = (newSubInputs[catId] || "").trim()
        if (!subName) return
        save(categories.map((c) => {
            if (c.id !== catId) return c
            if (c.subcategories.includes(subName)) return c
            return { ...c, subcategories: [...c.subcategories, subName] }
        }))
        setNewSubInputs((prev) => ({ ...prev, [catId]: "" }))
    }

    // ── REMOVE SUBCATEGORY ──
    const handleRemoveSub = (catId, sub) => {
        save(categories.map((c) => {
            if (c.id !== catId) return c
            return { ...c, subcategories: c.subcategories.filter((s) => s !== sub) }
        }))
    }

    // ── DRAG CATEGORIES ──
    const handleCatDragStart = (i) => setDragCatIdx(i)

    const handleCatDragOver = (e, i) => {
        e.preventDefault()
        if (dragCatIdx === null || dragCatIdx === i) return
        const updated = [...categories]
        const [moved] = updated.splice(dragCatIdx, 1)
        updated.splice(i, 0, moved)
        setDragCatIdx(i)
        save(updated)
    }

    const handleCatDragEnd = () => setDragCatIdx(null)

    // ── DRAG SUBCATEGORIES ──
    const handleSubDragStart = (catId, subIdx) => {
        setDragSubInfo({ catId, subIdx })
    }

    const handleSubDragOver = (e, catId, subIdx) => {
        e.preventDefault()
        if (!dragSubInfo || dragSubInfo.catId !== catId || dragSubInfo.subIdx === subIdx) return
        const updated = categories.map((c) => {
            if (c.id !== catId) return c
            const subs = [...c.subcategories]
            const [moved] = subs.splice(dragSubInfo.subIdx, 1)
            subs.splice(subIdx, 0, moved)
            return { ...c, subcategories: subs }
        })
        setDragSubInfo({ catId, subIdx })
        save(updated)
    }

    const handleSubDragEnd = () => setDragSubInfo(null)

    return (
        <div>
            <h1 className="text-2xl font-black text-stone-900 mb-2">إدارة التصنيفات</h1>
            <p className="text-sm text-gray-400 mb-8">
                اسحب التصنيفات لإعادة ترتيبها. افتح أي تصنيف لإضافة تصنيفات فرعية وإعادة ترتيبها.
            </p>

            {/* Add Category */}
            <div className="bg-white p-6 mb-6">
                <h2 className="text-xs font-black text-gray-500 tracking-widest mb-4">إضافة تصنيف رئيسي جديد</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="اسم التصنيف..."
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddCat()}
                        className="flex-1 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <button onClick={handleAddCat}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 text-sm tracking-widest transition-colors">
                        + إضافة
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            {/* Categories List */}
            <div className="space-y-2">
                {categories.map((cat, i) => (
                    <div
                        key={cat.id}
                        draggable
                        onDragStart={() => handleCatDragStart(i)}
                        onDragOver={(e) => handleCatDragOver(e, i)}
                        onDragEnd={handleCatDragEnd}
                        className={`bg-white border transition-all ${
                            dragCatIdx === i ? "border-amber-400 opacity-60 scale-95" : "border-gray-100"
                        }`}
                    >
                        {/* Category Row */}
                        <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-gray-300 cursor-grab text-xl select-none shrink-0" title="اسحب لإعادة الترتيب">
                ⠿
              </span>
                            <span className="text-xs font-black text-gray-300 w-5 shrink-0 text-left">{i + 1}</span>
                            <span className="flex-1 font-bold text-stone-800">{cat.name}</span>
                            {cat.subcategories.length > 0 && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 font-bold">
                  {cat.subcategories.length} فرعي
                </span>
                            )}
                            <button
                                onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
                                className="text-xs border border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-600 px-3 py-1 transition-colors"
                            >
                                {expandedId === cat.id ? "إغلاق ▲" : "تصنيفات فرعية ▼"}
                            </button>
                            <button
                                onClick={() => handleRemoveCat(cat.id)}
                                className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 transition-colors"
                            >
                                حذف
                            </button>
                        </div>

                        {/* Subcategories Panel */}
                        {expandedId === cat.id && (
                            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">

                                {/* Add Subcategory */}
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="text"
                                        placeholder="اسم التصنيف الفرعي..."
                                        value={newSubInputs[cat.id] || ""}
                                        onChange={(e) => setNewSubInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddSub(cat.id)}
                                        className="flex-1 border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400 bg-white"
                                    />
                                    <button onClick={() => handleAddSub(cat.id)}
                                            className="bg-stone-800 hover:bg-stone-700 text-white font-bold px-5 text-xs tracking-widest transition-colors">
                                        + إضافة
                                    </button>
                                </div>

                                {/* Subcategories — draggable */}
                                {cat.subcategories.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-2">لا توجد تصنيفات فرعية بعد</p>
                                ) : (
                                    <div className="space-y-1.5">
                                        <p className="text-xs text-gray-400 mb-2">اسحب لإعادة الترتيب</p>
                                        {cat.subcategories.map((sub, si) => (
                                            <div
                                                key={sub}
                                                draggable
                                                onDragStart={() => handleSubDragStart(cat.id, si)}
                                                onDragOver={(e) => handleSubDragOver(e, cat.id, si)}
                                                onDragEnd={handleSubDragEnd}
                                                className={`flex items-center gap-3 bg-white border border-gray-200 px-3 py-2 transition-all ${
                                                    dragSubInfo?.catId === cat.id && dragSubInfo?.subIdx === si
                                                        ? "border-amber-400 opacity-60"
                                                        : ""
                                                }`}
                                            >
                                                <span className="text-gray-300 cursor-grab text-sm select-none">⠿</span>
                                                <span className="text-xs font-black text-gray-300 w-4">{si + 1}</span>
                                                <span className="flex-1 text-sm font-semibold text-stone-700">{sub}</span>
                                                <button onClick={() => handleRemoveSub(cat.id, sub)}
                                                        className="text-red-400 hover:text-red-600 transition-colors text-xs px-1">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}