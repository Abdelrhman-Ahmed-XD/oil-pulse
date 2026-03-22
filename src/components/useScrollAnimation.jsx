import { useRef } from "react"
import { useInView } from "framer-motion"

export function useScrollAnimation(threshold = 0.15) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: threshold })

    const variants = {
        hidden: { opacity: 0, y: 28 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
        }
    }

    return { ref, isInView, variants }
}