import { useEffect, useState } from "react"
import { useNavigate, Routes, Route } from "react-router-dom"
import Sidebar from "./Sidebar"
import ArticlesList from "./ArticlesList"
import ArticleForm from "./ArticleForm"
import EditorsList from "./EditorsList"
import CategoriesList from "./CategoriesList"
import SidebarPicker from "./SidebarPicker"
import NewsbarPicker from "./NewsbarPicker"
import Analytics from "./Analytics"

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const stored = localStorage.getItem("oilpulse_user")
        if (!stored) { navigate("/admin"); return }
        setUser(JSON.parse(stored))
    }, [])

    if (!user) return null

    return (
        <div className="flex min-h-screen bg-gray-100" dir="rtl">
            <Sidebar user={user} />
            <main className="flex-1 p-8 overflow-y-auto">
                <Routes>
                    <Route index element={<Analytics user={user} />} />
                    <Route path="articles" element={<ArticlesList user={user} />} />
                    <Route path="new" element={<ArticleForm user={user} />} />
                    <Route path="edit/:id" element={<ArticleForm user={user} isEdit />} />
                    <Route path="sidebar" element={<SidebarPicker user={user} />} />
                    <Route path="newsbar" element={<NewsbarPicker user={user} />} />
                    {user.role === "admin" && (
                        <>
                            <Route path="editors" element={<EditorsList />} />
                            <Route path="categories" element={<CategoriesList />} />
                        </>
                    )}
                </Routes>
            </main>
        </div>
    )
}