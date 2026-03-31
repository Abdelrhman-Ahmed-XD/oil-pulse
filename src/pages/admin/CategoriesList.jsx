import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const defaultCategories = [
    { id: 1, name: "نفط خام", subcategories: [] },
    { id: 2, name: "غاز طبيعي", subcategories: [] },
    { id: 3, name: "طاقة متجددة", subcategories: [] },
    { id: 4, name: "أوبك+", subcategories: [] },
    { id: 5, name: "أسواق", subcategories: [] },
    { id: 6, name: "تقارير", subcategories: [] },
]

function getStoredCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    return stored ? JSON.parse(stored) : defaultCategories
}

export default function CategoriesList() {
    const [categories, setCategories] = useState(getStoredCategories())
    const [newCatName, setNewCatName] = useState("")
    const [newSubInputs, setNewSubInputs] = useState({})
    const [editingCat, setEditingCat] = useState(null)
    const [editingCatName, setEditingCatName] = useState("")
    const [dragIdx, setDragIdx] = useState(null)
    const [expandedCat, setExpandedCat] = useState(null)

    const save = (updated) => {
        setCategories(updated)
        localStorage.setItem("oilpulse_categories_v2", JSON.stringify(updated))
        localStorage.setItem("oilpulse_categories", JSON.stringify(updated.map((c) => c.name)))
    }

    const addCategory = () => {
        if (!newCatName.trim()) return
        if (categories.find((c) => c.name === newCatName.trim())) return alert("هذا التصنيف موجود بالفعل")
        save([...categories, { id: Date.now(), name: newCatName.trim(), subcategories: [] }])
        setNewCatName("")
    }

    const removeCategory = (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا التصنيف؟")) return
        save(categories.filter((c) => c.id !== id))
    }

    const startEditCat = (cat) => { setEditingCat(cat.id); setEditingCatName(cat.name) }

    const saveEditCat = (id) => {
        if (!editingCatName.trim()) return
        save(categories.map((c) => c.id === id ? { ...c, name: editingCatName.trim() } : c))
        setEditingCat(null)
    }

    const addSubcategory = (catId) => {
        const val = (newSubInputs[catId] || "").trim()
        if (!val) return
        save(categories.map((c) => c.id === catId
            ? { ...c, subcategories: [...(c.subcategories || []), val] }
            : c
        ))
        setNewSubInputs({ ...newSubInputs, [catId]: "" })
    }

    const removeSubcategory = (catId, sub) => {
        save(categories.map((c) => c.id === catId
            ? { ...c, subcategories: c.subcategories.filter((s) => s !== sub) }
            : c
        ))
    }

    const handleDragStart = (i) => setDragIdx(i)
    const handleDragOver = (e, i) => {
        e.preventDefault()
        if (dragIdx === null || dragIdx === i) return
        const b = [...categories]
        const [moved] = b.splice(dragIdx, 1)
        b.splice(i, 0, moved)
        setDragIdx(i)
        save(b)
    }

    return (
        <div dir="rtl">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mb-2">إدارة التصنيفات</h1>
            <p className="text-sm text-gray-400 mb-6">اسحب لإعادة الترتيب · انقر للتوسيع وإدارة التصنيفات الفرعية</p>

            {/* Add Category */}
            <div className="bg-white dark:bg-stone-800 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-stone-700 mb-6">
                <h2 className="text-xs font-black text-gray-500 dark:text-stone-400 tracking-widest mb-3">إضافة تصنيف رئيسي جديد</h2>
                <div className="flex gap-3">
                    <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                           onKeyDown={(e) => e.key === "Enter" && addCategory()}
                           className="flex-1 border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"
                           placeholder="مثال: بتروكيماويات" />
                    <button onClick={addCategory}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 text-sm rounded-lg transition-colors whitespace-nowrap">
                        + إضافة
                    </button>
                </div>
            </div>

            {/* Categories List */}
            <div className="space-y-2">
                {categories.map((cat, i) => (
                    <div key={cat.id}
                         draggable
                         onDragStart={() => handleDragStart(i)}
                         onDragOver={(e) => handleDragOver(e, i)}
                         onDragEnd={() => setDragIdx(null)}
                         className={`bg-white dark:bg-stone-800 rounded-xl border transition-all ${
                             dragIdx === i ? "border-amber-400 opacity-60" : "border-gray-200 dark:border-stone-700"
                         }`}>

                        {/* Category Row */}
                        <div className="flex items-center gap-3 px-4 py-3.5">
                            <span className="text-gray-300 dark:text-stone-600 cursor-grab active:cursor-grabbing text-base select-none shrink-0">⠿</span>
                            <span className="text-stone-400 dark:text-stone-500 text-sm font-bold w-5 shrink-0">{i + 1}</span>

                            {editingCat === cat.id ? (
                                <input type="text" value={editingCatName}
                                       onChange={(e) => setEditingCatName(e.target.value)}
                                       onKeyDown={(e) => e.key === "Enter" && saveEditCat(cat.id)}
                                       className="flex-1 border border-amber-400 bg-white dark:bg-stone-700 text-stone-800 dark:text-white px-3 py-1.5 text-sm outline-none rounded-lg" autoFocus />
                            ) : (
                                <span className="flex-1 font-bold text-stone-800 dark:text-stone-100 text-sm">{cat.name}</span>
                            )}

                            {cat.subcategories?.length > 0 && editingCat !== cat.id && (
                                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-stone-700 px-2 py-0.5 rounded-full shrink-0">
                                    {cat.subcategories.length} فرعي
                                </span>
                            )}

                            <div className="flex items-center gap-1.5 shrink-0">
                                {editingCat === cat.id ? (
                                    <>
                                        <button onClick={() => saveEditCat(cat.id)} className="text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold px-2.5 py-1 rounded-lg">✓</button>
                                        <button onClick={() => setEditingCat(null)} className="text-xs border border-gray-300 dark:border-stone-600 text-gray-500 dark:text-stone-400 px-2.5 py-1 rounded-lg">✕</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditCat(cat)} className="text-xs border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 px-2.5 py-1 rounded-lg transition-colors">تعديل</button>
                                        <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                                                className="text-xs border border-gray-200 dark:border-stone-600 text-gray-600 dark:text-stone-400 hover:border-amber-300 px-2.5 py-1 rounded-lg transition-colors">
                                            {expandedCat === cat.id ? "إخفاء" : "فرعية"}
                                        </button>
                                        <button onClick={() => removeCategory(cat.id)} className="text-xs border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 px-2.5 py-1 rounded-lg transition-colors">حذف</button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Subcategories */}
                        <AnimatePresence>
                            {expandedCat === cat.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-stone-700 pt-3">
                                        <p className="text-xs font-bold text-gray-400 dark:text-stone-500 mb-3">التصنيفات الفرعية</p>

                                        <div className="space-y-2 mb-3">
                                            {(cat.subcategories || []).length === 0 ? (
                                                <p className="text-xs text-gray-400 dark:text-stone-500 italic">لا توجد تصنيفات فرعية بعد</p>
                                            ) : (
                                                cat.subcategories.map((sub) => (
                                                    <div key={sub} className="flex items-center gap-3 bg-gray-50 dark:bg-stone-700 px-3 py-2 rounded-lg">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                                                        <span className="flex-1 text-sm text-stone-700 dark:text-stone-200">{sub}</span>
                                                        <button onClick={() => removeSubcategory(cat.id, sub)}
                                                                className="text-xs text-red-400 hover:text-red-600 transition-colors px-1">✕</button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <input type="text"
                                                   value={newSubInputs[cat.id] || ""}
                                                   onChange={(e) => setNewSubInputs({ ...newSubInputs, [cat.id]: e.target.value })}
                                                   onKeyDown={(e) => e.key === "Enter" && addSubcategory(cat.id)}
                                                   className="flex-1 border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-3 py-2 text-xs outline-none focus:border-amber-400 rounded-lg"
                                                   placeholder="اسم التصنيف الفرعي..." />
                                            <button onClick={() => addSubcategory(cat.id)}
                                                    className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-600 dark:hover:bg-stone-500 text-white font-bold px-4 text-xs rounded-lg transition-colors">
                                                + إضافة
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-10 text-center text-gray-400">
                    <p className="text-3xl mb-3">🗂️</p>
                    <p className="font-bold text-sm">لا توجد تصنيفات بعد</p>
                </div>
            )}
        </div>
    )
}