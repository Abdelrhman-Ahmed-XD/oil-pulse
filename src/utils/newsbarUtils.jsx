// src/utils/newsbarUtils.js
import { getArticles } from "../data/articles"

const ADMIN_KEY = "oilpulse_newsbar_admin"
const EDITOR_KEY = "oilpulse_newsbar_editor"

function loadItems(key) {
    return JSON.parse(localStorage.getItem(key) || "[]")
}

export function getNewsbarItems() {
    const adminItems = loadItems(ADMIN_KEY)
    if (adminItems.length > 0) return adminItems

    const editorItems = loadItems(EDITOR_KEY)
    if (editorItems.length > 0) return editorItems

    const articles = getArticles()
    return articles.slice(0, 5).map((a) => ({ id: `auto_${a.id}`, text: a.title, articleId: a.id }))
}