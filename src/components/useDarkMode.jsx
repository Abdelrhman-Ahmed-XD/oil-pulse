import { useState, useEffect } from "react"

export function useDarkMode() {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem("oilpulse_dark") === "true"
    })

    // Apply on first render too
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("oilpulse_dark", String(dark))
    }, [dark])

    // Also apply immediately on mount before React renders
    useEffect(() => {
        const saved = localStorage.getItem("oilpulse_dark")
        if (saved === "true") {
            document.documentElement.classList.add("dark")
        }
    }, [])

    const toggle = () => setDark((prev) => !prev)

    return { dark, toggle }
}