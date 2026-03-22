import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const sections = [
    {
        id: 1,
        title: "مقدمة",
        icon: "📋",
        content: `أهلاً بكم في سياسة الخصوصية الخاصة بموقع "نفط وطاقة"، البوابة الإخبارية المتخصصة في قطاع البترول والغاز والطاقة المتجددة.

تهدف هذه السياسة إلى إعلامكم بكيفية جمع معلوماتكم واستخدامها وحمايتها أثناء استخدامكم لموقعنا الإلكتروني. نحن نُولي خصوصيتكم أهمية قصوى ونلتزم بحمايتها وفق أعلى المعايير.

باستخدامكم لهذا الموقع، فإنكم توافقون على الشروط والأحكام الواردة في هذه السياسة.`
    },
    {
        id: 2,
        title: "المعلومات التي نجمعها",
        icon: "📊",
        content: `قد نقوم بجمع أنواع مختلفة من المعلومات عند استخدامكم للموقع، وتشمل:

• معلومات التعليقات: عند تركم تعليقاً على أي مقال، نجمع الاسم والبريد الإلكتروني الذي تقدمونه طوعاً. البريد الإلكتروني لن يُعرض للعموم ويُستخدم فقط لأغراض التواصل الداخلي.

• معلومات الاستخدام: نجمع بيانات مجهولة الهوية حول كيفية استخدامكم للموقع، مثل الصفحات التي تزورونها وعدد مرات المشاهدة، وذلك لتحسين تجربة المستخدم.

• ملفات تعريف الارتباط (Cookies): يستخدم موقعنا ملفات الكوكيز لتحسين تجربة التصفح وحفظ تفضيلاتكم. يمكنكم تعطيل الكوكيز من إعدادات متصفحكم في أي وقت.`
    },
    {
        id: 3,
        title: "كيفية استخدام المعلومات",
        icon: "🔍",
        content: `نستخدم المعلومات التي نجمعها للأغراض التالية:

• تحسين محتوى الموقع وتجربة المستخدم بشكل مستمر.
• إدارة وعرض التعليقات على المقالات.
• تحليل أنماط الاستخدام لفهم اهتمامات قراءنا وتطوير المحتوى وفقاً لها.
• ضمان الأمن والحماية من الاستخدام غير المشروع.
• التواصل مع المستخدمين عند الضرورة وبموافقتهم المسبقة.`
    },
    {
        id: 4,
        title: "حماية المعلومات",
        icon: "🔒",
        content: `نتخذ إجراءات تقنية وتنظيمية مناسبة لحماية معلوماتكم من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف، وتشمل هذه الإجراءات:

• تشفير البيانات الحساسة باستخدام بروتوكولات الأمان المعتمدة.
• تقييد الوصول إلى المعلومات الشخصية على الموظفين المصرح لهم فقط.
• مراجعة ممارسات الأمان بشكل دوري وتحديثها باستمرار.

مع ذلك، لا يوجد نظام أمان مضمون بنسبة 100%، لذا لا يمكننا ضمان الأمان المطلق لأي معلومات تُرسل إلينا.`
    },
    {
        id: 5,
        title: "مشاركة المعلومات مع أطراف ثالثة",
        icon: "🤝",
        content: `نحن لا نقوم ببيع أو تأجير أو مشاركة معلوماتكم الشخصية مع أطراف ثالثة لأغراض تجارية دون موافقتكم الصريحة، باستثناء:

• متطلبات القانون: قد نكشف عن معلوماتكم إذا كان ذلك مطلوباً بموجب القانون أو بأمر قضائي.
• الخدمات التقنية: قد نستعين بمزودي خدمات تقنيين موثوقين لتشغيل الموقع، وهؤلاء ملزمون بحماية معلوماتكم.
• الروابط الخارجية: قد يحتوي موقعنا على روابط لمواقع أخرى لا نتحكم فيها. ننصحكم بمراجعة سياسات الخصوصية لتلك المواقع.`
    },
    {
        id: 6,
        title: "التعليقات وحقوق المستخدمين",
        icon: "💬",
        content: `عند إضافة تعليق على أي مقال في موقعنا:

• يُعرض اسمكم وتعليقكم للعموم تحت المقال المعني.
• بريدكم الإلكتروني يُحفظ بشكل سري ولا يُعرض للزوار.
• يحق لكم طلب حذف تعليقاتكم في أي وقت عبر التواصل معنا.
• نحتفظ بالحق في حذف التعليقات المخالفة لسياسة الاستخدام أو التي تحتوي على محتوى مسيء أو مضلل.`
    },
    {
        id: 7,
        title: "ملفات تعريف الارتباط (Cookies)",
        icon: "🍪",
        content: `يستخدم موقعنا ملفات الكوكيز لتحسين تجربة التصفح وتشمل:

• كوكيز الأداء: لتحليل كيفية استخدام الزوار للموقع وتحسين أدائه.
• كوكيز التفضيلات: لحفظ إعداداتكم مثل تفضيلات الوضع الداكن/الفاتح.

يمكنكم التحكم في الكوكيز وتعطيلها من خلال إعدادات متصفحكم. يُرجى ملاحظة أن تعطيل الكوكيز قد يؤثر على بعض وظائف الموقع.`
    },
    {
        id: 8,
        title: "حقوق الملكية الفكرية",
        icon: "©️",
        content: `جميع المحتويات المنشورة على موقع "نفط وطاقة" من مقالات وتقارير وصور وتحليلات هي ملك حصري للموقع أو لأصحابها الأصليين المُشار إليهم.

• يُمنع نسخ أو إعادة نشر أي محتوى دون الحصول على إذن كتابي مسبق.
• يُمكن الاقتباس من المحتوى مع الإشارة الصريحة إلى المصدر "نفط وطاقة" مع رابط المقال الأصلي.
• أي انتهاك لحقوق الملكية الفكرية سيُعرض صاحبه للمسؤولية القانونية.`
    },
    {
        id: 9,
        title: "تحديثات السياسة",
        icon: "🔄",
        content: `قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية أو تنظيمية.

سنُعلمكم بأي تغييرات جوهرية عبر نشر السياسة المحدثة على هذه الصفحة مع تحديث تاريخ آخر تعديل.

ننصحكم بمراجعة هذه الصفحة بشكل دوري للاطلاع على أي تحديثات. استمراركم في استخدام الموقع بعد نشر التغييرات يُعدّ موافقة ضمنية عليها.

آخر تحديث: مارس 2026`
    },
    {
        id: 10,
        title: "تواصل معنا",
        icon: "📧",
        content: `إذا كان لديكم أي استفسار أو طلب يتعلق بسياسة الخصوصية هذه أو بياناتكم الشخصية، فلا تترددوا في التواصل معنا:

• عبر صفحة "تواصل معنا" على الموقع
• أو عبر البريد الإلكتروني المخصص للدعم

سنبذل قصارى جهدنا للرد على استفساراتكم في أقرب وقت ممكن.`
    },
]

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
    })
}

export default function PrivacyPolicy() {
    const navigate = useNavigate()

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10" dir="rtl">

            {/* Back button */}
            <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-amber-600 font-bold mb-8 hover:text-amber-500 transition-colors">
                → العودة
            </button>

            {/* Header */}
            <motion.div className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
                    🔒 سياسة الخصوصية
                </div>
                <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-4">
                    سياسة الخصوصية
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
                    نحن في موقع <span className="text-amber-600 font-bold">نفط وطاقة</span> نلتزم بحماية خصوصيتكم وضمان أمان بياناتكم الشخصية.
                </p>
                <div className="mt-4 text-xs text-gray-400">آخر تحديث: مارس 2026</div>
            </motion.div>

            {/* Table of Contents */}
            <motion.div
                className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 rounded-2xl p-6 mb-10"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h2 className="text-sm font-black text-amber-700 dark:text-amber-400 mb-4 tracking-widest">محتويات السياسة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sections.map((s) => (
                        <a key={s.id} href={`#section-${s.id}`}
                           className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group">
                            <span className="text-amber-400 text-xs font-black">{s.id}.</span>
                            <span className="group-hover:underline">{s.title}</span>
                        </a>
                    ))}
                </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-6">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.id}
                        id={`section-${section.id}`}
                        className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-2xl p-6 sm:p-8 scroll-mt-24"
                        initial="hidden" animate="visible" custom={i} variants={fadeUp}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl shrink-0">
                                {section.icon}
                            </div>
                            <h2 className="text-lg font-black text-stone-900 dark:text-white">
                                {section.id}. {section.title}
                            </h2>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line pr-13">
                            {section.content}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer note */}
            <motion.div className="mt-10 text-center bg-stone-900 dark:bg-stone-950 text-white rounded-2xl p-8"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-lg font-black mb-2">خصوصيتكم أولويتنا</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                    إذا كان لديكم أي استفسار حول هذه السياسة، تواصلوا معنا وسنكون سعداء بالإجابة على جميع أسئلتكم.
                </p>
                <button onClick={() => navigate(-1)}
                        className="mt-5 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-2.5 text-sm rounded-lg transition-colors">
                    العودة للموقع
                </button>
            </motion.div>

        </main>
    )
}