import { useNavigate, useLocation } from "react-router-dom"

export default function Sidebar({ user }) {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const handleLogout = () => {
        localStorage.removeItem("oilpulse_user")
        navigate("/admin")
    }

    const navItems = [
        { label: "الإحصاءات", path: "/admin/dashboard", icon: "📊" },
        { label: "الأخبار المنشورة", path: "/admin/dashboard/articles", icon: "📋" },
        { label: "إضافة خبر جديد", path: "/admin/dashboard/new", icon: "✏️" },
        { label: "أبرز الأخبار", path: "/admin/dashboard/sidebar", icon: "⭐" },
        { label: "شريط الأخبار", path: "/admin/dashboard/newsbar", icon: "📰" },
        ...(user.role === "admin" ? [
            { label: "إدارة المحررين", path: "/admin/dashboard/editors", icon: "👥" },
            { label: "إدارة التصنيفات", path: "/admin/dashboard/categories", icon: "🗂️" },
        ] : []),
    ]

    return (
        <aside className="w-64 bg-stone-900 text-white min-h-screen flex flex-col shrink-0" dir="rtl">

            <div className="px-6 py-6 border-b border-stone-700">
        <span className="text-xl font-black tracking-widest">
          نفط <span className="text-amber-400">وطاقة</span>
        </span>
                <p className="text-xs text-gray-400 mt-1">لوحة التحكم الإدارية</p>
            </div>

            <div className="px-6 py-4 border-b border-stone-700">
                <p className="text-xs text-gray-400">مرحباً،</p>
                <p className="text-sm font-bold text-white">{user.username}</p>
                <span className="text-xs bg-amber-500 text-black px-2 py-0.5 font-bold mt-1 inline-block rounded">
          {user.role === "admin" ? "مدير النظام" : "محرر"}
        </span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <button key={item.path} onClick={() => navigate(item.path)}
                            className={`w-full text-right px-4 py-3 text-sm font-semibold flex items-center gap-3 rounded-lg transition-colors ${
                                pathname === item.path
                                    ? "bg-amber-500 text-black"
                                    : "text-gray-300 hover:bg-stone-800 hover:text-white"
                            }`}>
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-stone-700 space-y-1">
                <button onClick={() => navigate("/")}
                        className="w-full text-right px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-2 rounded-lg hover:bg-stone-800">
                    🌐 عرض الموقع
                </button>
                <button onClick={handleLogout}
                        className="w-full text-right px-4 py-2 text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 rounded-lg hover:bg-stone-800">
                    🚪 تسجيل الخروج
                </button>
            </div>

        </aside>
    )
}