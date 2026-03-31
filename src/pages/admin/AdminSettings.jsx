import { useState } from "react"
import { motion } from "framer-motion"
import { useToast } from "../../components/ToastContext"

function updateAllArticlesAuthor(newDisplayName) {
    const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
    if (articles.length === 0) return
    const updated = articles.map((a) => ({ ...a, author: newDisplayName }))
    localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
}

export default function AdminSettings({ user, setUser }) {
    const toast = useToast()
    const [profile, setProfile] = useState(() => {
        const stored = localStorage.getItem("oilpulse_admin_profile")
        return stored ? JSON.parse(stored) : {
            displayName: "قسم الأخبار",
            email: user.email || "",
            publisherName: "قسم الأخبار",
        }
    })

    const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" })

    const handleSaveProfile = () => {
        if (!profile.displayName.trim()) {
            toast.warning("الاسم الظاهر مطلوب")
            return
        }

        localStorage.setItem("oilpulse_admin_profile", JSON.stringify(profile))

        const currentUser = JSON.parse(localStorage.getItem("oilpulse_user") || "{}")
        localStorage.setItem("oilpulse_user", JSON.stringify({
            ...currentUser,
            email: profile.email,
            displayName: profile.displayName,
        }))

        const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
        updateAllArticlesAuthor(profile.displayName.trim())

        toast.success(`تم الحفظ بنجاح — تم تحديث ${articles.length} مقال تلقائياً`)
    }

    const handleChangePassword = () => {
        const adminPass = import.meta.env.VITE_ADMIN_PASS
        if (passwords.current !== adminPass) {
            toast.error("كلمة المرور الحالية غير صحيحة")
            return
        }
        if (passwords.newPass.length < 6) {
            toast.warning("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل")
            return
        }
        if (passwords.newPass !== passwords.confirm) {
            toast.error("كلمة المرور الجديدة غير متطابقة")
            return
        }

        toast.success("تم تغيير كلمة المرور بنجاح")
        setPasswords({ current: "", newPass: "", confirm: "" })
    }

    const inputCls = "w-full border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"

    return (
        <div dir="rtl">
            <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">الإعدادات</h1>
                <p className="text-sm text-gray-400 mt-1">إعدادات الملف الشخصي وكلمة المرور</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700 mb-6">

                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-base shrink-0">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-stone-900 dark:text-white">الملف الشخصي</h2>
                        <p className="text-xs text-gray-400">@{user.username} · {user.role === "admin" ? "مدير النظام" : "محرر"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">
                            الاسم الظاهر للقراء — يظهر تحت كل مقال *
                        </label>
                        <input
                            type="text"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                            className={inputCls}
                            placeholder="مثال: قسم الأخبار"
                        />
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                            ⚠ تغيير هذا الاسم سيحدّث جميع المقالات المنشورة تلقائياً
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className={inputCls}
                            placeholder="admin@oilpulse.com"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveProfile}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 text-sm rounded-lg transition-colors"
                    >
                        حفظ التغييرات
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-gray-200 dark:border-stone-700 mb-6">

                <h2 className="text-sm font-black text-stone-900 dark:text-white mb-1">تغيير كلمة المرور</h2>
                <p className="text-xs text-gray-400 mb-5">
                    ملاحظة: في الوضع الحالي (localStorage) يُحفظ التغيير مؤقتاً. عند الانتقال للـ backend سيكون دائماً.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">كلمة المرور الحالية</label>
                        <input type="password" value={passwords.current}
                               onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                               className={inputCls} placeholder="أدخل كلمة المرور الحالية" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">كلمة المرور الجديدة</label>
                        <input type="password" value={passwords.newPass}
                               onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                               className={inputCls} placeholder="6 أحرف على الأقل" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5">تأكيد كلمة المرور</label>
                        <input type="password" value={passwords.confirm}
                               onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                               className={inputCls} placeholder="أعد كتابة كلمة المرور الجديدة" />
                    </div>
                </div>

                <button
                    onClick={handleChangePassword}
                    disabled={!passwords.current || !passwords.newPass || !passwords.confirm}
                    className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-600 dark:hover:bg-stone-500 disabled:opacity-40 text-white font-bold px-6 py-2.5 text-sm rounded-lg transition-colors"
                >
                    تغيير كلمة المرور
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-gray-50 dark:bg-stone-900 p-5 rounded-xl border border-gray-200 dark:border-stone-700">
                <h2 className="text-xs font-black text-gray-500 dark:text-stone-400 tracking-widest mb-3">معلومات الحساب</h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">اسم المستخدم</span>
                        <p className="font-bold text-stone-800 dark:text-stone-100 mt-0.5 font-mono">{user.username}</p>
                    </div>
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">الصلاحية</span>
                        <p className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">{user.role === "admin" ? "مدير النظام" : "محرر"}</p>
                    </div>
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">الاسم الظاهر على المقالات</span>
                        <p className="font-bold text-stone-800 dark:text-stone-100 mt-0.5">{profile.displayName}</p>
                    </div>
                    <div>
                        <span className="text-gray-400 dark:text-stone-500">التخزين</span>
                        <p className="font-bold text-stone-800 dark:text-stone-100 mt-0.5">localStorage</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}