import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import AdminBar from "./components/AdminBar"
import Home from "./pages/Home"
import Category from "./pages/Category"
import Article from "./pages/Article"
import Login from "./pages/admin/Login"
import Dashboard from "./pages/admin/Dashboard"
import PrivacyPolicy from "./pages/PrivacyPolicy"

// ── Public layout wrapper — shows AdminBar + Header + content + Footer ──
function PublicLayout() {
    const { pathname } = useLocation()
    const [barVisible, setBarVisible] = useState(false)

    // Read user from localStorage and re-check on every navigation
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("oilpulse_user")
        return stored ? JSON.parse(stored) : null
    })

    useEffect(() => {
        const stored = localStorage.getItem("oilpulse_user")
        setUser(stored ? JSON.parse(stored) : null)
        // Reset bar visibility whenever we navigate (bar starts shown again)
        setBarVisible(true)
    }, [pathname])

    const showBar = !!user && barVisible

    return (
        <div dir="rtl">
            {/* AdminBar — only when logged in */}
            {showBar && (
                <AdminBar
                    user={user}
                    onClose={() => setBarVisible(false)}
                />
            )}

            {/* Push content down by the bar height (40px) when bar is visible */}
            <div className={showBar ? "pt-10" : ""}>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:slug" element={<Category />} />
                    <Route path="/article/:id" element={<Article />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                </Routes>
                <Footer />
            </div>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Admin Routes — no Header/Footer/AdminBar */}
                <Route path="/admin" element={<Login />} />
                <Route path="/admin/dashboard/*" element={<Dashboard />} />

                {/* Public Routes — with AdminBar + Header + Footer */}
                <Route path="/*" element={<PublicLayout />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App