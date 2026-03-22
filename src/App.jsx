import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Category from "./pages/Category"
import Article from "./pages/Article"
import Login from "./pages/admin/Login"
import Dashboard from "./pages/admin/Dashboard"
import PrivacyPolicy from "./pages/PrivacyPolicy"

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>

                {/* Admin Routes — no Header/Footer */}
                <Route path="/admin" element={<Login />} />
                <Route path="/admin/dashboard/*" element={<Dashboard />} />

                {/* Public Routes — with Header/Footer */}
                <Route path="/*" element={
                    <div dir="rtl">
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/category/:slug" element={<Category />} />
                            <Route path="/article/:id" element={<Article />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                        </Routes>
                        <Footer />
                    </div>
                } />

            </Routes>
        </BrowserRouter>
    )
}

export default App