import { useLanguage } from "../../components/LanguageContext"
import { useState } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { useToast } from "../../components/ToastContext"

const defaultCategories = [
    { id: 1, name: "Petroleum", subcategories: [] },
    { id: 2, name: "Natural Gas", subcategories: [] },
    { id: 3, name: "Renewable Energy", subcategories: [] },
    { id: 4, name: "OPEC+", subcategories: [] },
    { id: 5, name: "Markets", subcategories: [] },
    { id: 6, name: "Reports", subcategories: [] },
]

function getStoredCategories() {
    const stored = localStorage.getItem("oilpulse_categories_v2")
    if (stored) {
        const parsed = JSON.parse(stored)
        // If stored names are Arabic, migrate them on the fly
        if (parsed.length > 0 && (parsed[0].name === "البترول" || parsed[0].name === "نفط خام")) {
            const engMap = {
                "البترول": "Petroleum", "نفط خام": "Crude Oil",
                "الغاز الطبيعي": "Natural Gas", "غاز طبيعي": "Natural Gas",
                "الطاقة المتجددة": "Renewable Energy", "طاقة متجددة": "Renewable Energy",
                "الأسواق": "Markets", "أسواق": "Markets",
                "تقارير": "Reports", "أوبك+": "OPEC+"
            }
            const migrated = parsed.map(cat => ({
                ...cat,
                name: engMap[cat.name] || cat.name,
                subcategories: cat.subcategories?.map(sub => engMap[sub] || sub) || []
            }))
            localStorage.setItem("oilpulse_categories_v2", JSON.stringify(migrated))
            return migrated
        }
        return parsed
    }
    return defaultCategories
}

export default function CategoriesList() {
    const { t, lang } = useLanguage()
    const isRtl = lang === "ar"
    const toast = useToast()
    const [categories, setCategories] = useState(getStoredCategories())
    const [newCatName, setNewCatName] = useState("")
    const [newSubInputs, setNewSubInputs] = useState({})
    const [editingCat, setEditingCat] = useState(null)
    const [editingCatName, setEditingCatName] = useState("")
    const [expandedCat, setExpandedCat] = useState(null)

    const save = (updated, actionMessage) => {
        setCategories(updated)
        localStorage.setItem("oilpulse_categories_v2", JSON.stringify(updated))
        localStorage.setItem("oilpulse_categories", JSON.stringify(updated.map((c) => c.name)))
        if (actionMessage) toast.success(actionMessage)
    }

    const addCategory = () => {
        if (!newCatName.trim()) {
            toast.warning(t("cat_name_required"))
            return
        }
        const englishName = newCatName.trim()
        if (categories.find((c) => c.name.toLowerCase() === englishName.toLowerCase())) {
            toast.warning(t("cat_exists"))
            return
        }
        save([...categories, { id: Date.now(), name: englishName, subcategories: [] }], t("cat_added"))
        setNewCatName("")
    }

    const removeCategory = (id, name) => {
        if (!confirm(t("cat_delete_confirm"))) return
        save(categories.filter((c) => c.id !== id), t("cat_deleted") + ": " + t(name))
    }

    const startEditCat = (cat) => { setEditingCat(cat.id); setEditingCatName(cat.name) }

    const saveEditCat = (id) => {
        if (!editingCatName.trim()) return
        save(categories.map((c) => c.id === id ? { ...c, name: editingCatName.trim() } : c), t("cat_updated"))
        setEditingCat(null)
    }

    const addSubcategory = (catId) => {
        const val = (newSubInputs[catId] || "").trim()
        if (!val) return
        save(categories.map((c) => c.id === catId
            ? { ...c, subcategories: [...(c.subcategories || []), val] }
            : c
        ), t("subcat_added"))
        setNewSubInputs({ ...newSubInputs, [catId]: "" })
    }

    const removeSubcategory = (catId, sub) => {
        save(categories.map((c) => c.id === catId
            ? { ...c, subcategories: c.subcategories.filter((s) => s !== sub) }
            : c
        ), t("subcat_deleted"))
    }

    const reorderSubcategories = (catId, fromIndex, toIndex) => {
        const category = categories.find(c => c.id === catId)
        if (!category) return
        const reordered = [...category.subcategories]
        const [removed] = reordered.splice(fromIndex, 1)
        reordered.splice(toIndex, 0, removed)
        save(categories.map(c => c.id === catId ? { ...c, subcategories: reordered } : c), t("subcat_reordered"))
    }

    const handleSubDragStart = (e, catId, fromIndex) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ catId, fromIndex }))
        e.dataTransfer.effectAllowed = "move"
    }

    const handleSubDragOver = (e, catId, toIndex) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        const dragData = JSON.parse(e.dataTransfer.getData("text/plain"))
        if (dragData && dragData.catId === catId && dragData.fromIndex !== toIndex) {
            reorderSubcategories(catId, dragData.fromIndex, toIndex)
            e.dataTransfer.setData("text/plain", JSON.stringify({ catId, fromIndex: toIndex }))
        }
    }

    const [dragIdx, setDragIdx] = useState(null)
    const handleCatDragStart = (i) => setDragIdx(i)
    const handleCatDragOver = (e, i) => {
        e.preventDefault()
        if (dragIdx === null || dragIdx === i) return
        const updated = [...categories]
        const [moved] = updated.splice(dragIdx, 1)
        updated.splice(i, 0, moved)
        setDragIdx(i)
        save(updated, t("categories_reordered"))
    }
    const handleCatDragEnd = () => setDragIdx(null)

    const inputCls = "w-full border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mb-2">{t("manage_categories_title")}</h1>
            <p className="text-sm text-gray-400 mb-6">{t("categories_drag_hint")}</p>

            {/* Add Category */}
            <div className="bg-white dark:bg-stone-800 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-stone-700 mb-6">
                <h2 className="text-xs font-black text-gray-500 dark:text-stone-400 tracking-widest mb-3">{t("add_main_category")}</h2>
                <div className="flex gap-3">
                    <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                           onKeyDown={(e) => e.key === "Enter" && addCategory()}
                           className={inputCls}
                           placeholder={t("cat_placeholder")} />
                    <button onClick={addCategory}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 text-sm rounded-lg transition-colors whitespace-nowrap">
                        + {t("add")}
                    </button>
                </div>
            </div>

            {/* Categories List with Reorder */}
            <Reorder.Group axis="y" values={categories} onReorder={(newOrder) => save(newOrder, t("categories_reordered"))}>
                {categories.map((cat, i) => (
                    <Reorder.Item key={cat.id} value={cat} className="mb-2">
                        <div className="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700">
                            <div className="flex items-center gap-3 px-4 py-3.5">
                                <span className="text-gray-300 dark:text-stone-600 cursor-grab active:cursor-grabbing text-base select-none shrink-0">⠿</span>
                                <span className="text-stone-400 dark:text-stone-500 text-sm font-bold w-5 shrink-0">{i + 1}</span>

                                {editingCat === cat.id ? (
                                    <input type="text" value={editingCatName}
                                           onChange={(e) => setEditingCatName(e.target.value)}
                                           onKeyDown={(e) => e.key === "Enter" && saveEditCat(cat.id)}
                                           className="flex-1 border border-amber-400 bg-white dark:bg-stone-700 text-stone-800 dark:text-white px-3 py-1.5 text-sm outline-none rounded-lg" autoFocus />
                                ) : (
                                    <span className="flex-1 font-bold text-stone-800 dark:text-stone-100 text-sm">{t(cat.name)}</span>
                                )}

                                {cat.subcategories?.length > 0 && editingCat !== cat.id && (
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-stone-700 px-2 py-0.5 rounded-full shrink-0">
                                        {cat.subcategories.length} {t("sub_count")}
                                    </span>
                                )}

                                <div className="flex items-center gap-1.5 shrink-0">
                                    {editingCat === cat.id ? (
                                        <>
                                            <button onClick={() => saveEditCat(cat.id)} className="text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold px-2.5 py-1 rounded-lg">✓</button>
                                            <button onClick={() => setEditingCat(null)} className="text-xs border border-gray-300 dark:border-stone-600 text-gray-500 dark:text-stone-400 hover:bg-gray-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors">✕</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEditCat(cat)} className="text-xs border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors">{t("edit")}</button>
                                            <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                                                    className="text-xs border border-gray-200 dark:border-stone-600 text-gray-600 dark:text-stone-400 hover:bg-gray-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                                                {expandedCat === cat.id ? t("hide") : t("subcategories_btn")}
                                            </button>
                                            <button onClick={() => removeCategory(cat.id, cat.name)} className="text-xs border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors">{t("delete")}</button>
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
                                            <p className="text-xs font-bold text-gray-400 dark:text-stone-500 mb-3">
                                                {t("subcategories_label")}
                                                <span className="mr-2 text-amber-500 text-[10px]">({t("drag_to_reorder")})</span>
                                            </p>

                                            <div className="space-y-2 mb-3">
                                                {(cat.subcategories || []).length === 0 ? (
                                                    <p className="text-xs text-gray-400 dark:text-stone-500 italic">{t("no_subcats_yet")}</p>
                                                ) : (
                                                    cat.subcategories.map((sub, subIdx) => (
                                                        <div key={sub}
                                                             draggable
                                                             onDragStart={(e) => handleSubDragStart(e, cat.id, subIdx)}
                                                             onDragOver={(e) => handleSubDragOver(e, cat.id, subIdx)}
                                                             className="flex items-center gap-3 bg-gray-50 dark:bg-stone-700 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing">
                                                            <span className="text-gray-400 dark:text-stone-500 text-xs select-none">⠿</span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                                                            <span className="flex-1 text-sm text-stone-700 dark:text-stone-200">{t(sub)}</span>
                                                            <button onClick={() => removeSubcategory(cat.id, sub)}
                                                                    className="text-xs text-red-400 hover:text-red-600 hover:bg-red-500 hover:text-white px-1.5 py-0.5 rounded transition-colors">✕</button>
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
                                                       placeholder={t("subcat_placeholder")} />
                                                <button onClick={() => addSubcategory(cat.id)}
                                                        className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-600 dark:hover:bg-stone-500 text-white font-bold px-4 text-xs rounded-lg transition-colors">
                                                    + {t("add")}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {categories.length === 0 && (
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-10 text-center text-gray-400">
                    <p className="text-3xl mb-3">🗂️</p>
                    <p className="font-bold text-sm">{t("no_cats_yet")}</p>
                </div>
            )}
        </div>
    )
}