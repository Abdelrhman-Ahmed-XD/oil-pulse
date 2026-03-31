import { createContext, useContext, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ToastContext = createContext(null)

// ── Toast icons ──────────────────────────────────────────────
const ICONS = {
    success: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15"/>
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    error: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15"/>
            <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    warning: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14.5 13H1.5L8 2z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
        </svg>
    ),
    info: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15"/>
            <circle cx="8" cy="5.5" r="0.75" fill="currentColor"/>
            <path d="M8 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
}

const STYLES = {
    success: "bg-white dark:bg-stone-800 border-green-400 dark:border-green-500 text-green-700 dark:text-green-300",
    error:   "bg-white dark:bg-stone-800 border-red-400   dark:border-red-500   text-red-700   dark:text-red-300",
    warning: "bg-white dark:bg-stone-800 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300",
    info:    "bg-white dark:bg-stone-800 border-blue-400  dark:border-blue-500  text-blue-700  dark:text-blue-300",
}

const PROGRESS_COLOR = {
    success: "bg-green-400 dark:bg-green-500",
    error:   "bg-red-400   dark:bg-red-500",
    warning: "bg-amber-400 dark:bg-amber-500",
    info:    "bg-blue-400  dark:bg-blue-500",
}

// ── Single Toast ─────────────────────────────────────────────
function Toast({ toast, onRemove }) {
    const { id, type = "info", message, duration = 3500 } = toast

    return (
        <motion.div
            layout
            // Changed animation to slide down from the top
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            // Added fully responsive width classes
            className={`relative flex items-start gap-3 px-4 py-3 rounded-xl border-r-4 shadow-xl shadow-black/10 dark:shadow-black/30 w-full sm:w-[320px] max-w-full overflow-hidden cursor-pointer select-none pointer-events-auto ${STYLES[type]}`}
            onClick={() => onRemove(id)}
            role="alert"
            dir="rtl"
        >
            <span className="mt-0.5">{ICONS[type]}</span>
            <p className="text-sm font-semibold leading-snug flex-1">{message}</p>
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(id) }}
                className="text-current opacity-40 hover:opacity-80 transition-opacity text-xs font-bold mt-0.5 shrink-0"
            >
                ✕
            </button>
            <motion.div
                className={`absolute bottom-0 right-0 h-0.5 ${PROGRESS_COLOR[type]}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
            />
        </motion.div>
    )
}

// ── Toast Container ──────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
    return (
        <div
            // Positioned top-right for desktop, top-center full width for mobile
            className="fixed top-4 inset-x-4 sm:left-auto sm:right-6 sm:top-6 z-[200] flex flex-col gap-3 pointer-events-none items-center sm:items-start"
            aria-live="polite"
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto w-full sm:w-auto">
                        <Toast toast={t} onRemove={removeToast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    )
}

// ── Provider ─────────────────────────────────────────────────
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const timers = useRef({})

    const removeToast = useCallback((id) => {
        clearTimeout(timers.current[id])
        delete timers.current[id]
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const addToast = useCallback((message, type = "info", duration = 3500) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        // Prepended new toasts so they appear at the top and push older ones down
        setToasts((prev) => [{ id, message, type, duration }, ...prev].slice(0, 4))
        timers.current[id] = setTimeout(() => removeToast(id), duration)
        return id
    }, [removeToast])

    const toast = {
        success: (msg, dur)  => addToast(msg, "success", dur),
        error:   (msg, dur)  => addToast(msg, "error",   dur),
        warning: (msg, dur)  => addToast(msg, "warning", dur),
        info:    (msg, dur)  => addToast(msg, "info",    dur),
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

// ── Hook ─────────────────────────────────────────────────────
export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
    return ctx
}