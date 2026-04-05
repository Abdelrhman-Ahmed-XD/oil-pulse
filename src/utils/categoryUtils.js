// src/utils/categoryUtils.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for category metadata.
// Import from here everywhere — no more duplicate maps.
// ─────────────────────────────────────────────────────────────
import { translateUIString } from "./translationUtils"

// ── Arabic → English canonical name map ──────────────────────
// Covers all stored Arabic variants the admin might have used.
export const categoryToEnglish = {
    "البترول":        "Petroleum",
    "نفط خام":        "Crude Oil",
    "الغاز الطبيعي":  "Natural Gas",
    "غاز طبيعي":      "Natural Gas",
    "الطاقة المتجددة":"Renewable Energy",
    "طاقة متجددة":    "Renewable Energy",
    "الأسواق":        "Markets",
    "أسواق":          "Markets",
    "تقارير":         "Reports",
    "تقرير":          "Reports",
    "أوبك+":          "OPEC+",
}

// ── English canonical → Tailwind color classes ────────────────
export const categoryColors = {
    "Petroleum":        "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300",
    "Crude Oil":        "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300",
    "Natural Gas":      "bg-blue-100  text-blue-700  dark:bg-blue-400/20  dark:text-blue-300",
    "Renewable Energy": "bg-green-100 text-green-700 dark:bg-green-400/20 dark:text-green-300",
    "Markets":          "bg-red-100   text-red-700   dark:bg-red-400/20   dark:text-red-300",
    "Reports":          "bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300",
    "OPEC+":            "bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300",
}

// ── Resolve canonical English name from any input ─────────────
// Works for Arabic stored values, English names, and unknown names.
export function toEnglishCategory(name) {
    return categoryToEnglish[name] || name
}

// ── Get Tailwind color class ──────────────────────────────────
export function getCategoryColor(name) {
    return categoryColors[toEnglishCategory(name)] || "bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-300"
}

// ── Get display name for current language ─────────────────────
// For Arabic: uses t() which looks up the hardcoded AR translations.
// For English:
//   1. If it's a known category → use t() which returns the EN string.
//   2. If it's an admin-added category (unknown) → translateUIString()
//      which hits LibreTranslate and caches in sessionStorage.
//
// Usage:
//   const name = await getDisplayCategory(article.category, lang, t)
//
export async function getDisplayCategory(name, lang, t) {
    if (lang === "ar") {
        // In Arabic mode, t() maps English keys back to Arabic display names.
        // If name is already Arabic, return as-is.
        const english = toEnglishCategory(name)
        const arLabel = t(english)
        // If t() didn't find it (returned the key), return the original Arabic name
        return arLabel === english ? name : arLabel
    }
    // English mode
    const english = toEnglishCategory(name)
    const fromT   = t(english)
    // t() found a hardcoded EN string
    if (fromT !== english) return fromT
    // Unknown category added by admin — translate it live
    return await translateUIString(name, "en")
}

// ── Sync version (no await) for places that can't be async ───
// Returns the known English name or the original if unknown.
// Unknown admin-added categories will show Arabic until translated.
export function getDisplayCategorySync(name, lang, t) {
    if (lang === "ar") {
        const english = toEnglishCategory(name)
        const arLabel = t(english)
        return arLabel === english ? name : arLabel
    }
    const english = toEnglishCategory(name)
    const fromT   = t(english)
    return fromT !== english ? fromT : english
}