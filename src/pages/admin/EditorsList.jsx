import { useState } from "react"

const defaultEditors = [
    { username: "editor1", email: "editor1@oilpulse.com", password: "editor123", fullName: "editor1", role: "editor" },
    { username: "editor2", email: "editor2@oilpulse.com", password: "press456", fullName: "editor2", role: "editor" },
]

function getAdminProfile() {
    return JSON.parse(localStorage.getItem("oilpulse_admin_profile") || JSON.stringify({
        username: import.meta.env.VITE_ADMIN_USER || "admin",
        email: import.meta.env.VITE_ADMIN_EMAIL || "admin@oilpulse.com",
        displayName: "قسم الأخبار",
    }))
}

export default function EditorsList() {
    const [editors, setEditors] = useState(
        JSON.parse(localStorage.getItem("oilpulse_editors") || JSON.stringify(defaultEditors))
    )
    const [adminProfile, setAdminProfile] = useState(getAdminProfile())
    const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "" })
    const [error, setError] = useState("")
    const [changingPassword, setChangingPassword] = useState(null)
    const [newPassword, setNewPassword] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [adminSaved, setAdminSaved] = useState(false)

    const saveEditors = (updated) => {
        setEditors(updated)
        localStorage.setItem("oilpulse_editors", JSON.stringify(updated))
    }

    const handleSaveAdmin = () => {
        localStorage.setItem("oilpulse_admin_profile", JSON.stringify(adminProfile))
        const currentUser = JSON.parse(localStorage.getItem("oilpulse_user") || "{}")
        if (currentUser.role === "admin") {
            localStorage.setItem("oilpulse_user", JSON.stringify({ ...currentUser, displayName: adminProfile.displayName, email: adminProfile.email }))
        }
        setAdminSaved(true)
        setTimeout(() => setAdminSaved(false), 2000)
    }

    const handleAdd = () => {
        if (!form.username.trim()) return setError("اسم المستخدم مطلوب")
        if (!form.email.trim()) return setError("البريد الإلكتروني مطلوب")
        if (!form.password.trim() || form.password.length < 6) return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        if (editors.find((e) => e.username === form.username)) return setError("اسم المستخدم مستخدم بالفعل")
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

    const startEdit = (editor) => {
        setEditingId(editor.username)
        setEditForm({ fullName: editor.fullName || editor.username, email: editor.email })
    }

    const handleSaveEdit = (username) => {
        if (!editForm.email.trim() || !editForm.email.includes("@")) return alert("يرجى إدخال بريد إلكتروني صحيح")
        saveEditors(editors.map((e) => e.username === username ? { ...e, fullName: editForm.fullName, email: editForm.email } : e))
        setEditingId(null)
    }

    return (
        <div dir="rtl">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 mb-6">إدارة المحررين والحسابات</h1>

            {/* Admin Profile */}
            <div className="bg-white p-5 sm:p-6 mb-6 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-sm shrink-0">A</div>
                    <div>
                        <h2 className="text-sm font-black text-stone-900">حساب مدير النظام</h2>
                        <p className="text-xs text-gray-400">الاسم الذي يظهر على جميع المقالات</p>
                    </div>
                    <span className="mr-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 font-bold rounded">مدير</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">الاسم الظاهر على المقالات *</label>
                        <input type="text" value={adminProfile.displayName}
                               onChange={(e) => setAdminProfile({ ...adminProfile, displayName: e.target.value })}
                               className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"
                               placeholder="مثال: قسم الأخبار" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">البريد الإلكتروني</label>
                        <input type="email" value={adminProfile.email}
                               onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                               className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"
                               placeholder="admin@oilpulse.com" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSaveAdmin}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 text-xs tracking-widest rounded-lg transition-colors">
                        {adminSaved ? "✓ تم الحفظ" : "حفظ التغييرات"}
                    </button>
                    {adminSaved && <span className="text-xs text-green-600 font-semibold">✓ تم التحديث بنجاح</span>}
                </div>
            </div>

            {/* Add Editor */}
            <div className="bg-white p-5 sm:p-6 mb-6 border border-gray-200 rounded-xl">
                <h2 className="text-xs font-black text-gray-500 tracking-widest mb-4">إضافة محرر جديد</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">اسم المستخدم *</label>
                        <input type="text" placeholder="username" value={form.username}
                               onChange={(e) => setForm({ ...form, username: e.target.value })}
                               className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">البريد الإلكتروني *</label>
                        <input type="email" placeholder="editor@oilpulse.com" value={form.email}
                               onChange={(e) => setForm({ ...form, email: e.target.value })}
                               className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">كلمة المرور *</label>
                        <input type="text" placeholder="6 أحرف على الأقل" value={form.password}
                               onChange={(e) => setForm({ ...form, password: e.target.value })}
                               className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">الاسم الكامل</label>
                        <input type="text" placeholder="اختياري" value={form.fullName}
                               onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                               className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
                <button onClick={handleAdd}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 text-sm rounded-lg transition-colors">
                    + إضافة محرر
                </button>
            </div>

            {/* Editors — Desktop Table */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm" dir="rtl">
                    <thead>
                    <tr className="bg-stone-900 text-white text-right">
                        <th className="px-5 py-4 font-bold">الاسم الكامل</th>
                        <th className="px-5 py-4 font-bold">اسم المستخدم</th>
                        <th className="px-5 py-4 font-bold">البريد الإلكتروني</th>
                        <th className="px-5 py-4 font-bold text-center">الإجراءات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {editors.map((editor, i) => (
                        <>
                            <tr key={editor.username} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-5 py-4">
                                    {editingId === editor.username ? (
                                        <input type="text" value={editForm.fullName}
                                               onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                               className="border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-amber-400 rounded-lg w-full" />
                                    ) : (
                                        <span className="font-semibold text-stone-800">{editor.fullName || editor.username}</span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-gray-500 font-mono text-xs">{editor.username}</td>
                                <td className="px-5 py-4">
                                    {editingId === editor.username ? (
                                        <input type="email" value={editForm.email}
                                               onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                               className="border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-amber-400 rounded-lg w-full" />
                                    ) : (
                                        <span className="text-gray-500 text-xs">{editor.email}</span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    {editingId === editor.username ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleSaveEdit(editor.username)} className="text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1 rounded-lg">حفظ ✓</button>
                                            <button onClick={() => setEditingId(null)} className="text-xs border border-gray-300 text-gray-500 px-3 py-1 rounded-lg">إلغاء</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => startEdit(editor)} className="text-xs border border-blue-200 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-lg transition-colors">تعديل</button>
                                            <button onClick={() => { setChangingPassword(editor.username); setNewPassword("") }} className="text-xs border border-gray-300 text-gray-600 hover:border-amber-400 px-3 py-1 rounded-lg transition-colors">كلمة المرور</button>
                                            <button onClick={() => handleRemove(editor.username)} className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg transition-colors">حذف</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                            {changingPassword === editor.username && (
                                <tr key={`pwd-${editor.username}`} className="bg-amber-50 border-t border-amber-200">
                                    <td colSpan={4} className="px-5 py-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-xs font-bold text-gray-500">كلمة المرور الجديدة:</span>
                                            <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                                   className="border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-amber-400 rounded-lg" placeholder="6 أحرف على الأقل" autoFocus />
                                            <button onClick={() => handleChangePassword(editor.username)} className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-1.5 text-xs rounded-lg">حفظ</button>
                                            <button onClick={() => { setChangingPassword(null); setNewPassword("") }} className="text-xs text-gray-400 hover:text-gray-600">إلغاء</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    </tbody>
                </table>
                {editors.length === 0 && (
                    <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-3">👥</p><p className="font-bold text-sm">لا يوجد محررون بعد</p></div>
                )}
            </div>

            {/* Editors — Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {editors.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
                        <p className="text-3xl mb-3">👥</p><p className="font-bold text-sm">لا يوجد محررون بعد</p>
                    </div>
                ) : editors.map((editor) => (
                    <div key={editor.username} className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black shrink-0">
                                {(editor.fullName || editor.username).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                {editingId === editor.username ? (
                                    <div className="space-y-2">
                                        <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                               className="w-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-amber-400 rounded-lg" placeholder="الاسم الكامل" />
                                        <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                               className="w-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-amber-400 rounded-lg" placeholder="البريد الإلكتروني" />
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-bold text-stone-800 text-sm">{editor.fullName || editor.username}</p>
                                        <p className="text-xs text-gray-400 font-mono">{editor.username}</p>
                                        <p className="text-xs text-gray-500">{editor.email}</p>
                                    </>
                                )}
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 font-bold rounded shrink-0">محرر</span>
                        </div>

                        {changingPassword === editor.username && (
                            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs font-bold text-gray-500 mb-2">كلمة المرور الجديدة:</p>
                                <div className="flex gap-2">
                                    <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                           className="flex-1 border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-amber-400 rounded-lg" placeholder="6 أحرف على الأقل" autoFocus />
                                    <button onClick={() => handleChangePassword(editor.username)} className="bg-amber-500 text-black font-bold px-3 text-xs rounded-lg">حفظ</button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap border-t border-gray-100 pt-3">
                            {editingId === editor.username ? (
                                <>
                                    <button onClick={() => handleSaveEdit(editor.username)} className="text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-lg">حفظ ✓</button>
                                    <button onClick={() => setEditingId(null)} className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-lg">إلغاء</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => startEdit(editor)} className="text-xs border border-blue-200 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">تعديل</button>
                                    <button onClick={() => { setChangingPassword(changingPassword === editor.username ? null : editor.username); setNewPassword("") }} className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg transition-colors">كلمة المرور</button>
                                    <button onClick={() => handleRemove(editor.username)} className="text-xs border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors mr-auto">حذف</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}