import {useParams, useNavigate} from "react-router-dom"
import {motion} from "framer-motion"
import {useEffect, useState} from "react"
import {getArticles} from "../data/articles"
import {convertMediaUrl} from "../utils/mediaUtils"
import SmartImage from "../components/SmartImage"
import {useLanguage, useTranslatedArticles} from "../components/LanguageContext"

const categoryColors = {
    "نفط خام": "bg-amber-100 text-amber-700", "البترول": "bg-amber-100 text-amber-700",
    "طاقة متجددة": "bg-green-100 text-green-700", "الطاقة المتجددة": "bg-green-100 text-green-700",
    "غاز طبيعي": "bg-blue-100 text-blue-700", "الغاز الطبيعي": "bg-blue-100 text-blue-700",
    "أسواق": "bg-red-100 text-red-700", "الأسواق": "bg-red-100 text-red-700",
    "تقارير": "bg-purple-100 text-purple-700", "أوبك+": "bg-purple-100 text-purple-700",
}

function trackView(id) {
    const views = JSON.parse(localStorage.getItem("oilpulse_views") || "{}")
    views[id] = (views[id] || 0) + 1
    localStorage.setItem("oilpulse_views", JSON.stringify(views))
}

function RenderBlock({block}) {
    const info = convertMediaUrl(block.url)

    switch (block.type) {
        case "text":
            return (
                <p className="text-stone-700 dark:text-stone-300 leading-loose text-base whitespace-pre-line mb-6">
                    {block.content}
                </p>
            )
        case "divider":
            return <hr className="border-gray-200 dark:border-stone-700 my-8"/>
        case "image":
            return (
                <figure className="mb-6">
                    {block._localFile
                        ? <img src={block.url} alt={block.caption || ""}
                               className="w-full rounded-xl object-cover max-h-96"/>
                        : <SmartImage src={block.url} alt={block.caption || ""}
                                      className="w-full rounded-xl object-cover max-h-96"/>
                    }
                    {block.caption &&
                        <figcaption className="text-center text-sm text-gray-400 mt-2">{block.caption}</figcaption>}
                </figure>
            )
        case "video":
            return (
                <figure className="mb-6">
                    <div className="aspect-video rounded-xl overflow-hidden bg-black">
                        {info.source === "google-drive"
                            ? <iframe src={`https://drive.google.com/file/d/${info.fileId}/preview`}
                                      className="w-full h-full" allowFullScreen allow="autoplay"
                                      title={block.caption || "فيديو"} style={{border: "none"}}/>
                            : block._localFile
                                ? <video controls className="w-full h-full">
                                    <source src={block.url}/>
                                </video>
                                : <iframe src={info.converted} className="w-full h-full" allowFullScreen
                                          title={block.caption || "فيديو"}/>
                        }
                    </div>
                    {block.caption &&
                        <figcaption className="text-center text-sm text-gray-400 mt-2">{block.caption}</figcaption>}
                </figure>
            )
        case "audio":
            return (
                <figure className="mb-6 bg-gray-50 dark:bg-stone-800 rounded-xl p-4">
                    {info.source === "google-drive"
                        ? <iframe src={`https://drive.google.com/file/d/${info.fileId}/preview`} className="w-full h-20"
                                  style={{border: "none"}} allow="autoplay" title={block.caption || "صوت"}/>
                        : <audio controls className="w-full">
                            <source src={block.url}/>
                        </audio>
                    }
                    {block.caption && <p className="text-center text-sm text-gray-400 mt-2">{block.caption}</p>}
                </figure>
            )
        case "pdf":
            return (
                <figure className="mb-6">
                    <iframe
                        src={info.source === "google-drive" ? `https://drive.google.com/file/d/${info.fileId}/preview` : info.converted}
                        className="w-full h-96 rounded-xl border border-gray-200 dark:border-stone-700"
                        style={{border: "none"}} title={block.caption || "PDF"}
                    />
                    {block.caption &&
                        <figcaption className="text-center text-sm text-gray-400 mt-2">{block.caption}</figcaption>}
                </figure>
            )
        default:
            return null
    }
}

function CommentsSection({articleId}) {
    const {lang, t} = useLanguage()
    const storageKey = `oilpulse_comments_${articleId}`
    const [comments, setComments] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "[]"))
    const [form, setForm] = useState({name: "", email: "", body: ""})
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name.trim()) return setError(t("name_required"))
        if (!form.email.trim() || !form.email.includes("@")) return setError(t("email_required"))
        if (!form.body.trim()) return setError(t("comment_required"))

        const newComment = {
            id: Date.now(),
            name: form.name.trim(), email: form.email.trim(), body: form.body.trim(),
            date: new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }),
            timestamp: Date.now(),
        }

        const updated = [newComment, ...comments]
        setComments(updated)
        localStorage.setItem(storageKey, JSON.stringify(updated))
        setForm({name: "", email: "", body: ""})
        setSubmitted(true);
        setError("")
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
                <span className="text-xl font-black text-stone-900 dark:text-white">
                    {t("comments")} {comments.length > 0 &&
                    <span className="mx-2 text-sm font-bold text-gray-400">({comments.length})</span>}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
            </div>

            <div
                className="bg-gray-50 dark:bg-stone-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-stone-700">
                <h3 className="text-sm font-bold text-stone-800 dark:text-white mb-4">{t("add_comment")}</h3>
                {submitted && <motion.div initial={{opacity: 0, y: -8}} animate={{opacity: 1, y: 0}}
                                          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm rounded-lg mb-4">{t("comment_success")}</motion.div>}
                {error && <motion.div initial={{opacity: 0, y: -8}} animate={{opacity: 1, y: 0}}
                                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm rounded-lg mb-4">{error}</motion.div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t("name_label")}</label>
                            <input type="text" value={form.name} onChange={(e) => {
                                setForm({...form, name: e.target.value});
                                setError("")
                            }}
                                   className="w-full border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"
                                   placeholder={t("name_placeholder")}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t("email_label")}</label>
                            <input type="email" value={form.email} onChange={(e) => {
                                setForm({...form, email: e.target.value});
                                setError("")
                            }}
                                   className="w-full border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg"
                                   placeholder={t("email_placeholder")}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">{t("comment_label")}</label>
                        <textarea value={form.body} onChange={(e) => {
                            setForm({...form, body: e.target.value});
                            setError("")
                        }} rows={4}
                                  className="w-full border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 rounded-lg resize-none"
                                  placeholder={t("comment_placeholder")}/>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">{t("email_wont_be_published")}</p>
                        <button type="submit"
                                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-2.5 text-sm rounded-lg transition-colors">{t("send_comment")}</button>
                    </div>
                </form>
            </div>

            {comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400"><p className="text-3xl mb-2">💬</p><p
                    className="text-sm">{t("be_first_comment")}</p></div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <motion.div key={comment.id} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                    className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-lg shrink-0">{comment.name.charAt(0)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1"><span
                                        className="text-sm font-bold text-stone-800 dark:text-white">{comment.name}</span><span
                                        className="text-xs text-gray-400">{comment.date}</span></div>
                                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{comment.body}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Article() {
    const {id} = useParams()
    const navigate = useNavigate()
    const {lang, t} = useLanguage()
    const isRtl = lang === "ar"

    const rawArticles = getArticles()
    // isTranslating always false — no spinner, article shows immediately in Arabic
    // then text updates progressively as translations arrive in background
    const {translatedArticles: allArticles} = useTranslatedArticles(rawArticles)

    const article = allArticles.find((a) => a.id === parseInt(id))

    useEffect(() => {
        if (article) trackView(article.id)
    }, [id, article])

    if (!article) {
        return (
            <div className="text-center py-20 text-gray-400" dir={isRtl ? "rtl" : "ltr"}>
                <p className="text-5xl mb-4">📭</p>
                <p className="text-lg font-bold">{t("article_not_found")}</p>
                <button onClick={() => navigate("/")}
                        className="mt-6 text-amber-600 font-bold text-sm hover:text-amber-500 transition-colors">
                    {t("back_to_home")}
                </button>
            </div>
        )
    }

    const related = allArticles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)
    const blocks = article.blocks || []
    const hasOldBody = article.body && blocks.length === 0

    return (
        <main className="max-w-4xl mx-auto px-4 py-10" dir={isRtl ? "rtl" : "ltr"}>
            <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-amber-600 font-bold mb-8 hover:text-amber-500 transition-colors">
                {t("back_to_home")}
            </button>

            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
                        {t(article.category)}
                    </span>
                    {article.subcategory && (
                        <>
                            <span className="text-gray-400 text-xs font-bold">{isRtl ? "←" : "→"}</span>
                            <span
                                className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 dark:bg-stone-700 text-gray-600 dark:text-gray-300">
                                {t(article.subcategory)}
                            </span>
                        </>
                    )}
                </div>
                <h1 className="text-4xl font-black text-stone-900 dark:text-white mt-2 mb-4 leading-snug">{article.title}</h1>
                {article.excerpt &&
                    <p className={`text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-6 border-amber-400 ${isRtl ? "border-r-4 pr-4" : "border-l-4 pl-4"}`}>{article.excerpt}</p>}
                <div
                    className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-stone-800">
                    <span>✍ {article.author}</span><span>·</span><span>📅 {article.date}</span>
                </div>
            </motion.div>

            {article.image && (
                <motion.div className="mb-10 rounded-xl overflow-hidden article-img" initial={{opacity: 0}}
                            animate={{opacity: 1}} transition={{duration: 0.6, delay: 0.2}}>
                    <SmartImage src={article.image} alt={article.title} className="w-full h-96 object-cover"/>
                </motion.div>
            )}

            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.6, delay: 0.3}}>
                {blocks.map((block) => <RenderBlock key={block.id} block={block}/>)}
                {hasOldBody &&
                    <p className="text-stone-700 dark:text-stone-300 leading-loose text-base whitespace-pre-line mb-12">{article.body}</p>}
            </motion.div>

            {related.length > 0 && (
                <div className="mt-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span
                            className="text-lg font-black text-stone-900 dark:text-white">{t("related_articles")}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-stone-700"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {related.map((rel) => (
                            <div key={rel.id} className="cursor-pointer group"
                                 onClick={() => navigate(`/article/${rel.id}`)}>
                                <div className="overflow-hidden mb-3 rounded-xl article-img">
                                    <SmartImage src={rel.image} alt={rel.title}
                                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"/>
                                </div>
                                <h3 className="text-sm font-bold text-stone-800 dark:text-gray-200 group-hover:text-amber-600 transition-colors leading-snug">{rel.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <CommentsSection articleId={article.id}/>
        </main>
    )
}