import { useState } from "react"

const defaultEditors = [
    { username: "editor1", email: "editor1@oilpulse.com", password: "editor123", fullName: "editor1", role: "editor" },
    { username: "editor2", email: "editor2@oilpulse.com", password: "press456", fullName: "editor2", role: "editor" },
]

export default function EditorsList() {
    const [editors, setEditors] = useState(
        JSON.parse(localStorage.getItem("oilpulse_editors") || JSON.stringify(defaultEditors))
    )
    const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "" })
    const [error, setError] = useState("")
    const [changingPassword, setChangingPassword] = useState(null)
    const [newPassword, setNewPassword] = useState("")

    const saveEditors = (updated) => {
        setEditors(updated)
        localStorage.setItem("oilpulse_editors", JSON.stringify(updated))
    }

    const handleAdd = () => {
        if (!form.username.trim()) return setError("اسم المستخدم مطلوب")
        if (!form.email.trim()) return setError("البريد الإلكتروني مطلوب")
        if (!form.password.trim() || form.password.length < 6) return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        if (editors.find((e) => e.username === form.username)) return setError("اسم المستخدم مستخدم بالفعل")
        if (editors.find((e) => e.email === form.email)) return setError("البريد الإلكتروني مستخدم بالفعل")

        saveEditors([...editors, { ...form, fullName: form.fullName || form.username, role: "editor" }])
        setForm({ username: "", email: "", password: "", fullName: "" })
        setError("")
    }

    const handleRemove = (username) => {
        if (!confirm(`هل أنت متأكد من حذف المحرر "${username}"؟`)) return
        saveEditors(editors.filter((e) => e.username !== username))
    }

    const handleChangePassword = (username) => {
        if (!newPassword.trim() || newPassword.length < 6) return alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        saveEditors(editors.map((e) => e.username === username ? { ...e, password: newPassword } : e))
        setChangingPassword(null)
        setNewPassword("")
    }

    return (
        <div>
            <h1 className="text-2xl font-black text-stone-900 mb-8">إدارة المحررين</h1>

            {/* Add Editor Form */}
            <div className="bg-white p-6 mb-6">
                <h2 className="text-xs font-black text-gray-500 tracking-widest mb-4">إضافة محرر جديد</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 tracking-widest">اسم المستخدم *</label>
                        <input
                            type="text"
                            placeholder="username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 tracking-widest">البريد الإلكتروني *</label>
                        <input
                            type="email"
                            placeholder="editor@oilpulse.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 tracking-widest">كلمة المرور *</label>
                        <input
                            type="text"
                            placeholder="6 أحرف على الأقل"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 tracking-widest">الاسم الكامل</label>
                        <input
                            type="text"
                            placeholder="اختياري"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
                <button
                    onClick={handleAdd}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-2.5 text-sm tracking-widest transition-colors"
                >
                    + إضافة محرر
                </button>
            </div>

            {/* Editors Table */}
            <div className="bg-white overflow-hidden">
                <table className="w-full text-sm" dir="rtl">
                    <thead>
                    <tr className="bg-stone-900 text-white">
                        <th className="px-5 py-4 text-right font-bold">الاسم الكامل</th>
                        <th className="px-5 py-4 text-right font-bold">اسم المستخدم</th>
                        <th className="px-5 py-4 text-right font-bold">البريد الإلكتروني</th>
                        <th className="px-5 py-4 text-right font-bold">الصلاحية</th>
                        <th className="px-5 py-4 text-center font-bold">الإجراءات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {editors.map((editor, i) => (
                        <>
                            <tr key={editor.username} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-5 py-4 font-semibold text-stone-800">{editor.fullName || editor.username}</td>
                                <td className="px-5 py-4 text-gray-500 font-mono text-xs">{editor.username}</td>
                                <td className="px-5 py-4 text-gray-500 text-xs">{editor.email}</td>
                                <td className="px-5 py-4">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 font-bold">محرر</span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => { setChangingPassword(editor.username); setNewPassword("") }}
                                            className="text-xs border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-600 px-3 py-1 transition-colors"
                                        >
                                            تغيير كلمة المرور
                                        </button>
                                        <button
                                            onClick={() => handleRemove(editor.username)}
                                            className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 transition-colors"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Change Password Row */}
                            {changingPassword === editor.username && (
                                <tr key={`pwd-${editor.username}`} className="bg-amber-50 border-t border-amber-200">
                                    <td colSpan={5} className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-500">كلمة المرور الجديدة:</span>
                                            <input
                                                type="text"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleChangePassword(editor.username)}
                                                className="border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 w-48"
                                                placeholder="6 أحرف على الأقل"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleChangePassword(editor.username)}
                                                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-1.5 text-xs transition-colors"
                                            >
                                                حفظ
                                            </button>
                                            <button
                                                onClick={() => { setChangingPassword(null); setNewPassword("") }}
                                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    </tbody>
                </table>

                {editors.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-3xl mb-3">👥</p>
                        <p className="font-bold text-sm">لا يوجد محررون بعد</p>
                    </div>
                )}
            </div>
        </div>
    )
}