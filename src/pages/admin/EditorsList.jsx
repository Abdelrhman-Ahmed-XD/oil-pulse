import React, { useState } from "react"
import { useLanguage } from "../../components/LanguageContext"
import { useToast } from "../../components/ToastContext"

const defaultEditors = [
    { username: "editor1", email: "editor1@oilpulse.com", password: "editor123", fullName: "Editor One", role: "editor" },
    { username: "editor2", email: "editor2@oilpulse.com", password: "press456", fullName: "Editor Two", role: "editor" },
]

export default function EditorsList() {
    const { t, lang } = useLanguage()
    const toast = useToast()
    const isRtl = lang === "ar"
    const [editors, setEditors] = useState(
        JSON.parse(localStorage.getItem("oilpulse_editors") || JSON.stringify(defaultEditors))
    )
    const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "" })
    const [error, setError] = useState("")
    const [changingPassword, setChangingPassword] = useState(null)
    const [changingEmail, setChangingEmail] = useState(null)
    const [newPassword, setNewPassword] = useState("")
    const [newEmail, setNewEmail] = useState("")

    const saveEditors = (updated) => {
        setEditors(updated)
        localStorage.setItem("oilpulse_editors", JSON.stringify(updated))
    }

    const handleAdd = () => {
        if (!form.username.trim()) {
            setError(t("username_req"))
            toast.warning(t("username_req"))
            return
        }
        if (!form.email.trim()) {
            setError(t("email_req"))
            toast.warning(t("email_req"))
            return
        }
        if (!form.password.trim() || form.password.length < 6) {
            setError(t("password_req"))
            toast.warning(t("password_req"))
            return
        }
        if (editors.find((e) => e.username === form.username)) {
            setError(t("username_taken"))
            toast.error(t("username_taken"))
            return
        }
        if (editors.find((e) => e.email === form.email)) {
            setError(t("email_taken"))
            toast.error(t("email_taken"))
            return
        }

        saveEditors([...editors, { ...form, fullName: form.fullName || form.username, role: "editor" }])
        setForm({ username: "", email: "", password: "", fullName: "" })
        setError("")
        toast.success(`Editor "${form.username}" added successfully`)
    }

    const handleRemove = (username) => {
        if (!confirm(`Are you sure you want to delete editor "${username}"?`)) return
        saveEditors(editors.filter((e) => e.username !== username))
        toast.success(`Editor "${username}" removed successfully`)
    }

    const handleChangePassword = (username) => {
        if (!newPassword.trim() || newPassword.length < 6) {
            toast.warning(t("password_req"))
            return
        }
        saveEditors(editors.map((e) => e.username === username ? { ...e, password: newPassword } : e))
        setChangingPassword(null)
        setNewPassword("")
        toast.success(`Password changed for "${username}"`)
    }

    const handleChangeEmail = (username) => {
        if (!newEmail.trim() || !newEmail.includes("@")) {
            toast.warning(t("email_req"))
            return
        }
        if (editors.find((e) => e.email === newEmail)) {
            toast.error(t("email_taken"))
            return
        }
        saveEditors(editors.map((e) => e.username === username ? { ...e, email: newEmail } : e))
        setChangingEmail(null)
        setNewEmail("")
        toast.success(`Email changed for "${username}" to ${newEmail}`)
    }

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white mb-8">{t("manage_editors_title")}</h1>

            {/* Add Editor Form */}
            <div className="bg-white dark:bg-stone-800 p-6 mb-6 rounded-xl border border-gray-200 dark:border-stone-700">
                <h2 className="text-xs font-black text-gray-500 dark:text-stone-400 tracking-widest mb-4">{t("add_editor")}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1 tracking-widest">{t("username_label")} *</label>
                        <input
                            type="text"
                            placeholder="username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1 tracking-widest">{t("email_label")} *</label>
                        <input
                            type="email"
                            placeholder="editor@oilpulse.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1 tracking-widest">{t("password_label") || "Password"} *</label>
                        <input
                            type="text"
                            placeholder="6 characters minimum"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1 tracking-widest">{t("full_name_label")}</label>
                        <input
                            type="text"
                            placeholder="Optional"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            className="w-full border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 placeholder:text-gray-400 dark:placeholder:text-stone-500 px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg transition-colors"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
                <button
                    onClick={handleAdd}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-2.5 text-sm tracking-widest rounded-lg transition-colors"
                >
                    + {t("add_editor_btn")}
                </button>
            </div>

            {/* Editors Table */}
            <div className="bg-white dark:bg-stone-800 overflow-hidden rounded-xl border border-gray-200 dark:border-stone-700 overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead>
                    <tr className="bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-100">
                        <th className="px-5 py-4 text-center font-bold">{t("full_name_label")}</th>
                        <th className="px-5 py-4 text-center font-bold">{t("username_label")}</th>
                        <th className="px-5 py-4 text-center font-bold">{t("email_label")}</th>
                        <th className="px-5 py-4 text-center font-bold">{t("role_label") || "Role"}</th>
                        <th className="px-5 py-4 text-center font-bold">{t("actions")}</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-stone-800 divide-y divide-gray-100 dark:divide-stone-700/60">
                    {editors.map((editor) => (
                        <React.Fragment key={editor.username}>
                            <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-700/40 transition-colors">
                                <td className="px-5 py-4 text-center font-semibold text-stone-800 dark:text-stone-100">{editor.fullName || editor.username}</td>
                                <td className="px-5 py-4 text-center text-gray-500 dark:text-stone-400 font-mono text-xs">{editor.username}</td>
                                <td className="px-5 py-4 text-center">
                                    {changingEmail === editor.username ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 px-2 py-1 text-xs outline-none focus:border-amber-400 rounded w-40"
                                                placeholder="new@email.com"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleChangeEmail(editor.username)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => { setChangingEmail(null); setNewEmail("") }}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 text-xs rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 dark:text-stone-400 text-xs">{editor.email}</span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded font-bold">{t("role_editor")}</span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => { setChangingEmail(editor.username); setNewEmail(editor.email) }}
                                            className="text-xs border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white px-2 py-1 rounded-lg transition-all duration-200"
                                        >
                                            Change Email
                                        </button>
                                        <button
                                            onClick={() => { setChangingPassword(editor.username); setNewPassword("") }}
                                            className="text-xs border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-amber-500 hover:text-white px-2 py-1 rounded-lg transition-all duration-200"
                                        >
                                            Change Password
                                        </button>
                                        <button
                                            onClick={() => handleRemove(editor.username)}
                                            className="text-xs border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Change Password Row */}
                            {changingPassword === editor.username && (
                                <tr className="bg-amber-50 dark:bg-amber-900/10 border-t border-amber-200 dark:border-amber-800">
                                    <td colSpan={5} className="px-5 py-3 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-xs font-bold text-gray-500">{t("new_pw")}:</span>
                                            <input
                                                type="text"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleChangePassword(editor.username)}
                                                className="border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 px-3 py-1.5 text-sm outline-none focus:border-amber-400 rounded-lg w-48"
                                                placeholder="6 characters minimum"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleChangePassword(editor.username)}
                                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-1.5 text-xs rounded-lg transition-colors"
                                            >
                                                {t("save")}
                                            </button>
                                            <button
                                                onClick={() => { setChangingPassword(null); setNewPassword("") }}
                                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {t("cancel")}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

                {editors.length === 0 && (
                    <div className="text-center py-12 text-gray-400 dark:text-stone-500">
                        <p className="text-3xl mb-3">👥</p>
                        <p className="font-bold text-sm">{t("no_editors_yet")}</p>
                    </div>
                )}
            </div>
        </div>
    )
}