// src/utils/categoryIconUtils.js
import { categoryIcons, OilDropIcon } from "../components/CategoryIcons"

export const getCategoryIcon = (categoryName) => {
    const nameMap = {
        "Petroleum": "Petroleum",
        "البترول": "Petroleum",
        "نفط خام": "Crude Oil",
        "Natural Gas": "Natural Gas",
        "الغاز الطبيعي": "Natural Gas",
        "غاز طبيعي": "Natural Gas",
        "Renewable Energy": "Renewable Energy",
        "الطاقة المتجددة": "Renewable Energy",
        "طاقة متجددة": "Renewable Energy",
        "Markets": "Markets",
        "الأسواق": "Markets",
        "أسواق": "Markets",
        "Reports": "Reports",
        "تقارير": "Reports",
        "OPEC+": "OPEC+",
        "أوبك+": "OPEC+",
    }
    const key = nameMap[categoryName] || categoryName
    return categoryIcons[key] || OilDropIcon
}