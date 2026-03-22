import { useNavigate, useLocation } from "react-router-dom"

export default function Sidebar({ user, onClose }) {
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

    const handleNav = (path) => {
        navigate(path)
        onClose?.()
    }

    return (
        <aside className="w-72 sm:w-64 bg-stone-900 text-white h-full flex flex-col" dir="rtl">

            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-700 flex items-center justify-between">
                <div>
          <span className="text-xl font-black tracking-widest">
            نفط <span className="text-amber-400">وطاقة</span>
          </span>
                    <p className="text-xs text-gray-400 mt-0.5">لوحة التحكم</p>
                </div>
                {/* Close button — mobile only */}
                <button onClick={onClose}
                        className="lg:hidden text-gray-400 hover:text-white p-1 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* User info */}
            <div className="px-6 py-4 border-b border-stone-700">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-sm shrink-0">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user.username}</p>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 font-bold rounded">
              {user.role === "admin" ? "مدير النظام" : "محرر"}
            </span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <button key={item.path} onClick={() => handleNav(item.path)}
                            className={`w-full text-right px-4 py-3 text-sm font-semibold flex items-center gap-3 rounded-xl transition-all ${
                                pathname === item.path
                                    ? "bg-amber-500 text-black shadow-md"
                                    : "text-gray-300 hover:bg-stone-800 hover:text-white"
                            }`}>
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-stone-700 space-y-1">
                <button onClick={() => { navigate("/"); onClose?.() }}
                        className="w-full text-right px-4 py-2.5 text-xs text-gray-400 hover:text-white flex items-center gap-3 rounded-xl hover:bg-stone-800 transition-colors">
                    <span>🌐</span><span>عرض الموقع</span>
                </button>
                <button onClick={handleLogout}
                        className="w-full text-right px-4 py-2.5 text-xs text-red-400 hover:text-red-300 flex items-center gap-3 rounded-xl hover:bg-stone-800 transition-colors">
                    <span>🚪</span><span>تسجيل الخروج</span>
                </button>
            </div>

        </aside>
    )
}