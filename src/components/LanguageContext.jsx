// src/components/LanguageContext.jsx
import {createContext, useContext, useState, useEffect, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {translateArticle} from "../utils/translationUtils"

const LanguageContext = createContext()

const translations = {
    ar: {
        // Site / Header
        urgent: "عاجل",
        oil_and_energy_1: "نفط ",
        oil_and_energy_2: "وطاقة",
        oil_energy_sub: "OIL & ENERGY",
        home: "الرئيسية",
        dark_mode: "الوضع الداكن",
        light_mode: "الوضع الفاتح",

        // Sidebar / Dashboard
        dashboard: "لوحة التحكم",
        admin: "مدير النظام",
        editor: "محرر",
        analytics: "الإحصاءات",
        published_news: "الأخبار المنشورة",
        add_article: "إضافة خبر جديد",
        top_news: "أبرز الأخبار",
        newsbar: "شريط الأخبار",
        manage_editors: "إدارة المحررين",
        manage_categories: "إدارة التصنيفات",
        settings: "الإعدادات",
        view_site: "عرض الموقع",
        logout: "تسجيل الخروج",

        // Footer
        about_desc: "بوابتكم الإخبارية المتخصصة في قطاع البترول والغاز والطاقة المتجددة. نقدم أحدث الأخبار والتقارير والتحليلات لأهل القطاع.",
        latest_news: "أحدث الأخبار",
        categories: "التصنيفات",
        privacy_policy: "سياسة الخصوصية",
        contact_us: "تواصل معنا",
        all_rights: "جميع الحقوق محفوظة © 2026 · نفط وطاقة",
        developed_by: "Developed by Abdelrhman Ahmed" ,

        // Home / Category / Article
        no_news_yet: "لا توجد أخبار منشورة حتى الآن",
        no_more_news: "لا توجد أخبار إضافية حتى الآن",
        latest_news_home: "آخر الأخبار",
        article_count: "مقال",
        view_all: "عرض الكل ←",
        back: "← العودة",
        no_news_cat: "لا توجد أخبار في هذا التصنيف بعد",
        article_not_found: "المقال غير موجود",
        back_to_home: "→ العودة إلى الرئيسية",
        related_articles: "مقالات ذات صلة",
        comments: "التعليقات",
        add_comment: "أضف تعليقك",
        name_label: "الاسم *",
        email_label: "البريد الإلكتروني *",
        comment_label: "التعليق *",
        name_placeholder: "اسمك",
        email_placeholder: "example@email.com",
        comment_placeholder: "شاركنا رأيك...",
        send_comment: "إرسال التعليق ←",
        email_wont_be_published: "البريد الإلكتروني لن يظهر للعموم",
        be_first_comment: "كن أول من يعلق على هذا المقال",
        comment_success: "✓ تم إرسال تعليقك بنجاح!",
        name_required: "يرجى إدخال الاسم",
        email_required: "يرجى إدخال بريد إلكتروني صحيح",
        comment_required: "يرجى كتابة تعليقك",

        // Analytics
        analytics_title_admin: "لوحة الإحصاءات",
        analytics_title_editor: "إحصاءاتي",
        analytics_sub_admin: "نظرة عامة على أداء الموقع",
        total_articles: "إجمالي المقالات",
        total_views: "إجمالي المشاهدات",
        total_comments: "إجمالي التعليقات",
        avg_views: "متوسط المشاهدات",
        most_viewed: "الأكثر مشاهدةً",
        category_dist: "توزيع التصنيفات",
        latest_articles: "آخر المقالات",
        by_publisher: "المقالات حسب الناشر",
        manage_comments: "إدارة التعليقات",
        no_articles_yet: "لا توجد مقالات بعد",
        no_comments_yet: "لا توجد تعليقات بعد",
        view_article: "عرض المقال",
        views_label: "مشاهدة",
        confirm_delete_comment: "هل أنت متأكد من حذف هذا التعليق؟",
        comment_deleted: "تم حذف التعليق",

        // ArticlesList
        article_deleted: "تم حذف الخبر بنجاح",
        featured: "مميز",
        mark_featured: "تمييز",
        view: "عرض",
        edit: "تعديل",
        delete: "حذف",
        yes_delete: "نعم، احذف",
        search_placeholder: "بحث بالعنوان أو التصنيف",

        // Login
        login_fields_required: "يرجى إدخال اسم المستخدم وكلمة المرور",
        login_invalid: "بيانات الدخول غير صحيحة",
        login_identity_required: "يرجى إدخال اسم المستخدم أو البريد الإلكتروني",
        login_recovery_sent: "تم إرسال تعليمات الاستعادة",
        login_btn: "تسجيل الدخول",
        sending: "جارٍ الإرسال",
        send_recovery: "إرسال تعليمات الاستعادة",

        // AdminSettings
        display_name_required: "الاسم الظاهر مطلوب",
        pw_wrong: "كلمة المرور الحالية غير صحيحة",
        pw_min_length: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
        pw_mismatch: "كلمة المرور الجديدة غير متطابقة",
        pw_changed: "تم تغيير كلمة المرور بنجاح",
        profile_saved: "تم الحفظ بنجاح",
        settings_sub: "إعدادات الملف الشخصي وكلمة المرور",
        profile_title: "الملف الشخصي",
        display_name_label: "الاسم الظاهر للقراء",
        display_name_placeholder: "مثال: قسم الأخبار",
        display_name_warning: "⚠ تغيير هذا الاسم سيحدّث جميع المقالات المنشورة تلقائياً",
        save_changes: "حفظ التغييرات",
        pw_note: "ملاحظة: في الوضع الحالي (localStorage) يُحفظ التغيير مؤقتاً.",
        current_pw: "كلمة المرور الحالية",
        current_pw_placeholder: "أدخل كلمة المرور الحالية",
        new_pw: "كلمة المرور الجديدة",
        pw_min_placeholder: "6 أحرف على الأقل",
        confirm_pw: "تأكيد كلمة المرور",
        confirm_pw_placeholder: "أعد كتابة كلمة المرور الجديدة",
        account_info: "معلومات الحساب",
        role_label: "الصلاحية",
        display_name_on_articles: "الاسم الظاهر على المقالات",
        storage_label: "التخزين",
        change_password: "تغيير كلمة المرور",

        // EditorsList
        manage_editors_title: "إدارة المحررين",
        add_editor: "إضافة محرر جديد",
        username_label: "اسم المستخدم",
        full_name_label: "الاسم الكامل",
        email_req: "البريد الإلكتروني مطلوب",
        password_req: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        username_req: "اسم المستخدم مطلوب",
        username_taken: "اسم المستخدم مستخدم بالفعل",
        email_taken: "البريد الإلكتروني مستخدم بالفعل",
        add_editor_btn: "+ إضافة محرر",
        save: "حفظ",
        cancel: "إلغاء",
        no_editors_yet: "لا يوجد محررون بعد",
        role_editor: "محرر",
        actions: "الإجراءات",
        change_password_btn: "تغيير كلمة المرور",
        delete_btn: "حذف",

        // AdminBar
        new_article: "خبر جديد",
        control_panel: "لوحة التحكم",
        role_admin: "مدير",

        // Privacy
        privacy_title: "سياسة الخصوصية",
        privacy_sub: "نحن في موقع نفط وطاقة نلتزم بحماية خصوصيتكم وضمان أمان بياناتكم الشخصية.",
        privacy_toc: "محتويات السياسة",
        privacy_priority: "خصوصيتكم أولويتنا",
        privacy_footer: "إذا كان لديكم أي استفسار حول هذه السياسة، تواصلوا معنا وسنكون سعداء بالإجابة على جميع أسئلتكم.",
        back_to_site: "العودة للموقع",

        // CategoriesList
        manage_categories_title: "إدارة التصنيفات",
        categories_drag_hint: "اسحب لإعادة الترتيب · انقر للتوسيع وإدارة التصنيفات الفرعية",
        add_main_category: "إضافة تصنيف رئيسي جديد",
        sub_count: "فرعي",
        subcategories_label: "التصنيفات الفرعية",
        no_subcats_yet: "لا توجد تصنيفات فرعية بعد",
        cat_placeholder: "مثال: بتروكيماويات",
        subcat_placeholder: "اسم التصنيف الفرعي...",
        no_cats_yet: "لا توجد تصنيفات بعد",
        cat_exists: "هذا التصنيف موجود بالفعل",
        cat_delete_confirm: "هل أنت متأكد من حذف هذا التصنيف؟",
        hide: "إخفاء",
        subcategories_btn: "فرعية",
        add: "إضافة",
        drag_to_reorder: "اسحب لإعادة الترتيب",

        // SidebarPicker
        sidebar_picker_title: "أبرز الأخبار — الصفحة الرئيسية",
        sidebar_picker_desc: "حددوا ما يصل إلى أربعة أخبار تظهر في القسم الجانبي. في حال عدم التحديد، تُعرض آخر أربعة أخبار تلقائياً.",
        sidebar_editor_note: "ملاحظة: يمكن لمدير النظام تجاوز تحديدك في أي وقت.",
        section_locked_title: "هذا القسم مقفل من مدير النظام",
        section_locked_desc: "قام مدير النظام بتحديد الأخبار يدوياً. لا يمكنك التعديل حتى يقوم المدير بإلغاء القفل.",
        section_locked_newsbar: "قام مدير النظام بتحديد شريط الأخبار. لا يمكنك التعديل حتى يقوم المدير بإلغاء القفل.",
        editor_picks_confirm: "هل أنت متأكد من مسح تحديد المحرر؟",
        admin_lock_confirm: "هل أنت متأكد من إلغاء قفلك؟ سيتمكن المحرر من التحديد مجدداً.",
        sidebar_admin_locked: "مدير النظام حدّد الأخبار — هذا التحديد يتجاوز صلاحيات المحرر",
        sidebar_editor_picked: "المحرر حدّد الأخبار يدوياً",
        sidebar_auto: "لا يوجد تحديد — تُعرض آخر أربعة أخبار تلقائياً",
        saved: "تم الحفظ",
        save_lock: "حفظ وقفل",
        save_picks: "حفظ التحديد",
        clear_my_picks: "إلغاء تحديدي",
        selected: "محدد",
        unlock: "إلغاء القفل",
        clear_editor_picks: "مسح تحديد المحرر",
        reset: "إعادة تعيين",

        // NewsbarPicker
        newsbar_title: "شريط الأخبار العاجلة",
        newsbar_desc: "تحكم في النصوص التي تظهر في الشريط المتحرك أعلى الصفحة.",
        newsbar_preview: "معاينة الشريط",
        newsbar_empty_preview: "سيظهر هنا شريط الأخبار...",
        add_from_articles: "إضافة من المقالات",
        choose_article: "اختر مقالاً...",
        add_custom_text: "إضافة نص مخصص",
        newsbar_custom_placeholder: "مثال: خام برنت يرتفع إلى 85 دولاراً للبرميل...",
        newsbar_no_items: "لا توجد عناصر — أضف من المقالات أو أكتب نصاً مخصصاً",
        items_count: "عنصر",
        custom_text: "نص",
        article_label: "مقال",
        newsbar_admin_locked: "مدير النظام حدّد شريط الأخبار — يتجاوز صلاحيات المحرر",
        newsbar_editor_picked: "المحرر حدّد شريط الأخبار يدوياً",
        newsbar_auto: "لا يوجد تحديد — يُعرض آخر 5 عناوين تلقائياً",

        // Category names (display) - IMPORTANT: These fix the "مطابقة" issue
        "Petroleum": "البترول",
        "Crude Oil": "نفط خام",
        "Natural Gas": "الغاز الطبيعي",
        "Renewable Energy": "الطاقة المتجددة",
        "Markets": "الأسواق",
        "Reports": "تقارير",
        "OPEC+": "أوبك+",
        "subcategories": "التصنيفات الفرعية",
        "subcategory": "تصنيف فرعي",
        "back_to": "العودة إلى ",
        // Privacy Policy
        "privacy_intro_title": "مقدمة",
        "privacy_intro_content": "أهلاً بكم في سياسة الخصوصية الخاصة بموقع \"نفط وطاقة\"، البوابة الإخبارية المتخصصة في قطاع البترول والغاز والطاقة المتجددة.\n\nتهدف هذه السياسة إلى إعلامكم بكيفية جمع معلوماتكم واستخدامها وحمايتها أثناء استخدامكم لموقعنا الإلكتروني. نحن نُولي خصوصيتكم أهمية قصوى ونلتزم بحمايتها وفق أعلى المعايير.\n\nباستخدامكم لهذا الموقع، فإنكم توافقون على الشروط والأحكام الواردة في هذه السياسة.",

        "privacy_collect_title": "المعلومات التي نجمعها",
        "privacy_collect_content": "قد نقوم بجمع أنواع مختلفة من المعلومات عند استخدامكم للموقع، وتشمل:\n\n• معلومات التعليقات: عند ترككم تعليقاً على أي مقال، نجمع الاسم والبريد الإلكتروني الذي تقدمونه طوعاً. البريد الإلكتروني لن يُعرض للعموم ويُستخدم فقط لأغراض التواصل الداخلي.\n\n• معلومات الاستخدام: نجمع بيانات مجهولة الهوية حول كيفية استخدامكم للموقع، مثل الصفحات التي تزورونها وعدد مرات المشاهدة، وذلك لتحسين تجربة المستخدم.\n\n• ملفات تعريف الارتباط (Cookies): يستخدم موقعنا ملفات الكوكيز لتحسين تجربة التصفح وحفظ تفضيلاتكم. يمكنكم تعطيل الكوكيز من إعدادات متصفحكم في أي وقت.",

        "privacy_use_title": "كيفية استخدام المعلومات",
        "privacy_use_content": "نستخدم المعلومات التي نجمعها للأغراض التالية:\n\n• تحسين محتوى الموقع وتجربة المستخدم بشكل مستمر.\n• إدارة وعرض التعليقات على المقالات.\n• تحليل أنماط الاستخدام لفهم اهتمامات قراءنا وتطوير المحتوى وفقاً لها.\n• ضمان الأمن والحماية من الاستخدام غير المشروع.\n• التواصل مع المستخدمين عند الضرورة وبموافقتهم المسبقة.",

        "privacy_protect_title": "حماية المعلومات",
        "privacy_protect_content": "نتخذ إجراءات تقنية وتنظيمية مناسبة لحماية معلوماتكم من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف، وتشمل هذه الإجراءات:\n\n• تشفير البيانات الحساسة باستخدام بروتوكولات الأمان المعتمدة.\n• تقييد الوصول إلى المعلومات الشخصية على الموظفين المصرح لهم فقط.\n• مراجعة ممارسات الأمان بشكل دوري وتحديثها باستمرار.\n\nمع ذلك، لا يوجد نظام أمان مضمون بنسبة 100%، لذا لا يمكننا ضمان الأمان المطلق لأي معلومات تُرسل إلينا.",

        "privacy_share_title": "مشاركة المعلومات مع أطراف ثالثة",
        "privacy_share_content": "نحن لا نقوم ببيع أو تأجير أو مشاركة معلوماتكم الشخصية مع أطراف ثالثة لأغراض تجارية دون موافقتكم الصريحة، باستثناء:\n\n• متطلبات القانون: قد نكشف عن معلوماتكم إذا كان ذلك مطلوباً بموجب القانون أو بأمر قضائي.\n• الخدمات التقنية: قد نستعين بمزودي خدمات تقنيين موثوقين لتشغيل الموقع، وهؤلاء ملزمون بحماية معلوماتكم.\n• الروابط الخارجية: قد يحتوي موقعنا على روابط لمواقع أخرى لا نتحكم فيها. ننصحكم بمراجعة سياسات الخصوصية لتلك المواقع.",

        "privacy_comments_title": "التعليقات وحقوق المستخدمين",
        "privacy_comments_content": "عند إضافة تعليق على أي مقال في موقعنا:\n\n• يُعرض اسمكم وتعليقكم للعموم تحت المقال المعني.\n• بريدكم الإلكتروني يُحفظ بشكل سري ولا يُعرض للزوار.\n• يحق لكم طلب حذف تعليقاتكم في أي وقت عبر التواصل معنا.\n• نحتفظ بالحق في حذف التعليقات المخالفة لسياسة الاستخدام أو التي تحتوي على محتوى مسيء أو مضلل.",

        "privacy_cookies_title": "ملفات تعريف الارتباط (Cookies)",
        "privacy_cookies_content": "يستخدم موقعنا ملفات الكوكيز لتحسين تجربة التصفح وتشمل:\n\n• كوكيز الأداء: لتحليل كيفية استخدام الزوار للموقع وتحسين أدائه.\n• كوكيز التفضيلات: لحفظ إعداداتكم مثل تفضيلات الوضع الداكن/الفاتح.\n\nيمكنكم التحكم في الكوكيز وتعطيلها من خلال إعدادات متصفحكم. يُرجى ملاحظة أن تعطيل الكوكيز قد يؤثر على بعض وظائف الموقع.",

        "privacy_intellectual_title": "حقوق الملكية الفكرية",
        "privacy_intellectual_content": "جميع المحتويات المنشورة على موقع \"نفط وطاقة\" من مقالات وتقارير وصور وتحليلات هي ملك حصري للموقع أو لأصحابها الأصليين المُشار إليهم.\n\n• يُمنع نسخ أو إعادة نشر أي محتوى دون الحصول على إذن كتابي مسبق.\n• يُمكن الاقتباس من المحتوى مع الإشارة الصريحة إلى المصدر \"نفط وطاقة\" مع رابط المقال الأصلي.\n• أي انتهاك لحقوق الملكية الفكرية سيُعرض صاحبه للمسؤولية القانونية.",

        "privacy_updates_title": "تحديثات السياسة",
        "privacy_updates_content": "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية أو تنظيمية.\n\nسنُعلمكم بأي تغييرات جوهرية عبر نشر السياسة المحدثة على هذه الصفحة مع تحديث تاريخ آخر تعديل.\n\nننصحكم بمراجعة هذه الصفحة بشكل دوري للاطلاع على أي تحديثات. استمراركم في استخدام الموقع بعد نشر التغييرات يُعدّ موافقة ضمنية عليها.\n\nآخر تحديث: مارس 2026",

        "privacy_contact_title": "تواصل معنا",
        "privacy_contact_content": "إذا كان لديكم أي استفسار أو طلب يتعلق بسياسة الخصوصية هذه أو بياناتكم الشخصية، فلا تترددوا في التواصل معنا:\n\n• عبر صفحة \"تواصل معنا\" على الموقع\n• أو عبر البريد الإلكتروني المخصص للدعم\n\nسنبذل قصارى جهدنا للرد على استفساراتكم في أقرب وقت ممكن.",
        "privacy_last_updated": "آخر تحديث: مارس 2026",
        // Login page
        "login_title": "تسجيل الدخول",
        "login_subtitle": "مرحباً بك في لوحة التحكم الإدارية",
        "login_identity_label": "اسم المستخدم أو البريد الإلكتروني",
        "login_identity_placeholder": "أدخل اسم المستخدم أو البريد الإلكتروني",
        "login_password_label": "كلمة المرور",
        "login_password_placeholder": "أدخل كلمة المرور",
        "login_forgot_password": "نسيت كلمة المرور؟",
        "login_remember": "تذكرني",
        "login_verifying": "جارٍ التحقق...",
        "login_support": "للدعم الفني تواصل مع مدير النظام",
        "login_welcome": "مرحباً بك،",

        "forgot_title": "استعادة كلمة المرور",
        "forgot_subtitle": "أدخل اسم المستخدم أو البريد الإلكتروني",
        "forgot_identity_placeholder": "أدخل اسم المستخدم أو البريد",
        "forgot_success_title": "تم الإرسال بنجاح",
        "forgot_success_message": "إذا كان الحساب موجوداً ستصلك تعليمات الاستعادة",
        "back_to_login": "العودة لتسجيل الدخول",
        "cat_name_required": "يرجى إدخال اسم التصنيف",
        "cat_added": "تم إضافة التصنيف بنجاح",
        "cat_deleted": "تم حذف التصنيف",
        "cat_updated": "تم تحديث التصنيف",
        "subcat_added": "تم إضافة التصنيف الفرعي",
        "subcat_deleted": "تم حذف التصنيف الفرعي",
        "subcat_reordered": "تم إعادة ترتيب التصنيفات الفرعية",
        "categories_reordered": "تم إعادة ترتيب التصنيفات",


    },
    en: {
        // Site / Header
        urgent: "Breaking",
        oil_and_energy_1: "Oil & ",
        oil_and_energy_2: "Energy",
        oil_energy_sub: "NEWS PORTAL",
        home: "Home",
        dark_mode: "Dark Mode",
        light_mode: "Light Mode",

        // Sidebar / Dashboard
        dashboard: "Dashboard",
        admin: "Admin",
        editor: "Editor",
        analytics: "Analytics",
        published_news: "Published News",
        add_article: "Add New Article",
        top_news: "Top News",
        newsbar: "Newsbar",
        manage_editors: "Manage Editors",
        manage_categories: "Manage Categories",
        settings: "Settings",
        view_site: "View Site",
        logout: "Logout",

        // Footer
        about_desc: "Your specialized news portal in the petroleum, gas, and renewable energy sector. We provide the latest news, reports, and analytics.",
        latest_news: "Latest News",
        categories: "Categories",
        privacy_policy: "Privacy Policy",
        contact_us: "Contact Us",
        all_rights: "All Rights Reserved © 2026 · Oil & Energy",
        developed_by: "Developed by Abdelrhman Ahmed",

        // Home / Category / Article
        no_news_yet: "No news published yet",
        no_more_news: "No more news yet",
        latest_news_home: "Latest News",
        article_count: "Article(s)",
        view_all: "View All →",
        back: "Back →",
        no_news_cat: "No news in this category yet",
        article_not_found: "Article not found",
        back_to_home: "← Back to Home",
        related_articles: "Related Articles",
        comments: "Comments",
        add_comment: "Add a Comment",
        name_label: "Name *",
        email_label: "Email ",
        comment_label: "Comment *",
        name_placeholder: "Your Name",
        email_placeholder: "example@email.com",
        comment_placeholder: "Share your thoughts...",
        send_comment: "Send Comment →",
        email_wont_be_published: "Your email will not be published",
        be_first_comment: "Be the first to comment on this article",
        comment_success: "✓ Comment sent successfully!",
        name_required: "Please enter your name",
        email_required: "Please enter a valid email",
        comment_required: "Please write your comment",

        // Analytics
        analytics_title_admin: "Analytics Dashboard",
        analytics_title_editor: "My Analytics",
        analytics_sub_admin: "Site performance overview",
        total_articles: "Total Articles",
        total_views: "Total Views",
        total_comments: "Total Comments",
        avg_views: "Avg. Views",
        most_viewed: "Most Viewed",
        category_dist: "Category Breakdown",
        latest_articles: "Latest Articles",
        by_publisher: "Articles by Publisher",
        manage_comments: "Manage Comments",
        no_articles_yet: "No articles yet",
        no_comments_yet: "No comments yet",
        view_article: "View Article",
        views_label: "views",
        confirm_delete_comment: "Are you sure you want to delete this comment?",
        comment_deleted: "Comment deleted",

        // ArticlesList
        article_deleted: "Article deleted successfully",
        featured: "Featured",
        mark_featured: "Feature",
        view: "View",
        edit: "Edit",
        delete: "Delete",
        yes_delete: "Yes, Delete",
        search_placeholder: "Search by title or category",

        // Login
        login_fields_required: "Please enter username and password",
        login_invalid: "Invalid credentials",
        login_identity_required: "Please enter username or email",
        login_recovery_sent: "Recovery instructions sent",
        login_btn: "Login",
        sending: "Sending",
        send_recovery: "Send Recovery Instructions",

        // AdminSettings
        display_name_required: "Display name is required",
        pw_wrong: "Current password is incorrect",
        pw_min_length: "New password must be at least 6 characters",
        pw_mismatch: "Passwords do not match",
        pw_changed: "Password changed successfully",
        profile_saved: "Saved successfully",
        settings_sub: "Profile and password settings",
        profile_title: "Profile",
        display_name_label: "Public Display Name",
        display_name_placeholder: "e.g. News Desk",
        display_name_warning: "⚠ Changing this name will update all published articles automatically",
        save_changes: "Save Changes",
        pw_note: "Note: In the current mode (localStorage) changes are temporary.",
        current_pw: "Current Password",
        current_pw_placeholder: "Enter current password",
        new_pw: "New Password",
        pw_min_placeholder: "At least 6 characters",
        confirm_pw: "Confirm Password",
        confirm_pw_placeholder: "Re-enter new password",
        account_info: "Account Info",
        role_label: "Role",
        display_name_on_articles: "Display Name on Articles",
        storage_label: "Storage",
        change_password: "Change Password",

        // EditorsList
        manage_editors_title: "Manage Editors",
        add_editor: "Add New Editor",
        username_label: "Username",
        full_name_label: "Full Name",
        email_req: "Email is required",
        password_req: "Password must be at least 6 characters",
        username_req: "Username is required",
        username_taken: "Username already taken",
        email_taken: "Email already in use",
        add_editor_btn: " Add Editor",
        save: "Save",
        cancel: "Cancel",
        no_editors_yet: "No editors yet",
        role_editor: "Editor",
        actions: "Actions",
        change_password_btn: "Change Password",
        delete_btn: "Delete",

        // AdminBar
        new_article: "New Article",
        control_panel: "Dashboard",
        role_admin: "Admin",

        // Privacy
        privacy_title: "Privacy Policy",
        privacy_sub: "At Oil & Energy, we are committed to protecting your privacy and the security of your personal data.",
        privacy_toc: "Table of Contents",
        privacy_priority: "Your Privacy is Our Priority",
        privacy_footer: "If you have any questions about this policy, contact us and we'll be happy to answer.",
        back_to_site: "Back to Site",

        // CategoriesList
        manage_categories_title: "Manage Categories",
        categories_drag_hint: "Drag to reorder · Click to expand and manage subcategories",
        add_main_category: "Add New Main Category",
        sub_count: "sub",
        subcategories_label: "Subcategories",
        no_subcats_yet: "No subcategories yet",
        cat_placeholder: "e.g. Petrochemicals",
        subcat_placeholder: "Subcategory name...",
        no_cats_yet: "No categories yet",
        cat_exists: "This category already exists",
        cat_delete_confirm: "Are you sure you want to delete this category?",
        hide: "Hide",
        subcategories_btn: "Sub",
        add: "Add",
        drag_to_reorder: "Drag to reorder",

        // SidebarPicker
        sidebar_picker_title: "Top News — Homepage",
        sidebar_picker_desc: "Select up to 4 articles to show in the sidebar. If none selected, the latest 4 articles are shown automatically.",
        sidebar_editor_note: "Note: The admin can override your selection at any time.",
        section_locked_title: "This section is locked by the admin",
        section_locked_desc: "The admin has manually selected articles. You cannot edit until the admin unlocks.",
        section_locked_newsbar: "The admin has set the newsbar. You cannot edit until the admin unlocks.",
        editor_picks_confirm: "Are you sure you want to clear the editor picks?",
        admin_lock_confirm: "Are you sure you want to unlock? The editor will be able to pick again.",
        sidebar_admin_locked: "Admin has selected the articles — overrides editor picks",
        sidebar_editor_picked: "Editor has manually selected articles",
        sidebar_auto: "No selection — showing latest 4 articles automatically",
        saved: "Saved",
        save_lock: "Save & Lock",
        save_picks: "Save Picks",
        clear_my_picks: "Clear My Picks",
        selected: "selected",
        unlock: "Unlock",
        clear_editor_picks: "Clear Editor Picks",
        reset: "Reset",

        // NewsbarPicker
        newsbar_title: "Breaking News Ticker",
        newsbar_desc: "Control the text that appears in the scrolling ticker at the top of the page.",
        newsbar_preview: "Ticker Preview",
        newsbar_empty_preview: "The ticker will appear here...",
        add_from_articles: "Add from Articles",
        choose_article: "Choose an article...",
        add_custom_text: "Add Custom Text",
        newsbar_custom_placeholder: "e.g. Brent crude rises to $85 per barrel...",
        newsbar_no_items: "No items — add from articles or write custom text",
        items_count: "item(s)",
        custom_text: "Text",
        article_label: "Article",
        newsbar_admin_locked: "Admin has set the newsbar — overrides editor",
        newsbar_editor_picked: "Editor has manually set the newsbar",
        newsbar_auto: "No selection — showing latest 5 headlines automatically",

        // Category names (display)
        "Petroleum": "Petroleum",
        "Crude Oil": "Crude Oil",
        "Natural Gas": "Natural Gas",
        "Renewable Energy": "Renewable Energy",
        "Markets": "Markets",
        "Reports": "Reports",
        "OPEC+": "OPEC+",
        "subcategories": "Subcategories",
        "subcategory": "Subcategory",
        "back_to": "Back to ",
        // Privacy Policy
        "privacy_intro_title": "Introduction",
        "privacy_intro_content": "Welcome to the Privacy Policy of \"Oil & Energy\" news portal, specialized in petroleum, gas, and renewable energy.\n\nThis policy informs you about how we collect, use, and protect your information while using our website. We take your privacy seriously and are committed to protecting it according to the highest standards.\n\nBy using this website, you agree to the terms and conditions outlined in this policy.",

        "privacy_collect_title": "Information We Collect",
        "privacy_collect_content": "We may collect various types of information when you use the site, including:\n\n• Comment Information: When you leave a comment on any article, we collect the name and email you voluntarily provide. Email is kept private and used only for internal communication.\n\n• Usage Information: We collect anonymous data about how you use the site, such as pages visited and view counts, to improve user experience.\n\n• Cookies: Our site uses cookies to enhance browsing and save preferences. You can disable cookies in your browser settings at any time.",

        "privacy_use_title": "How We Use Information",
        "privacy_use_content": "We use the information we collect for the following purposes:\n\n• Continuously improve site content and user experience.\n• Manage and display comments on articles.\n• Analyze usage patterns to understand reader interests and develop content accordingly.\n• Ensure security and protection against unauthorized use.\n• Communicate with users when necessary and with their prior consent.",

        "privacy_protect_title": "Information Protection",
        "privacy_protect_content": "We take appropriate technical and organizational measures to protect your information from unauthorized access, modification, disclosure, or destruction. These measures include:\n\n• Encrypting sensitive data using approved security protocols.\n• Restricting access to personal information to authorized personnel only.\n• Regularly reviewing and updating security practices.\n\nHowever, no security system is 100% guaranteed, so we cannot guarantee absolute security for any information you send to us.",

        "privacy_share_title": "Sharing Information with Third Parties",
        "privacy_share_content": "We do not sell, rent, or share your personal information with third parties for commercial purposes without your explicit consent, except:\n\n• Legal Requirements: We may disclose your information if required by law or court order.\n• Technical Services: We may use trusted third-party service providers to operate the site; they are obligated to protect your information.\n• External Links: Our site may contain links to other sites we do not control. We recommend reviewing their privacy policies.",

        "privacy_comments_title": "Comments and User Rights",
        "privacy_comments_content": "When you add a comment on any article on our site:\n\n• Your name and comment are publicly displayed under the relevant article.\n• Your email is kept private and not shown to visitors.\n• You have the right to request deletion of your comments at any time by contacting us.\n• We reserve the right to delete comments that violate our usage policy or contain offensive or misleading content.",

        "privacy_cookies_title": "Cookies",
        "privacy_cookies_content": "Our site uses cookies to improve browsing experience, including:\n\n• Performance Cookies: To analyze how visitors use the site and improve its performance.\n• Preference Cookies: To save your settings such as dark/light mode preferences.\n\nYou can control and disable cookies through your browser settings. Please note that disabling cookies may affect some site functionality.",

        "privacy_intellectual_title": "Intellectual Property Rights",
        "privacy_intellectual_content": "All content published on the \"Oil & Energy\" site, including articles, reports, images, and analyses, is the exclusive property of the site or its original credited owners.\n\n• Copying or republishing any content without prior written permission is prohibited.\n• Quoting content is allowed with clear attribution to \"Oil & Energy\" including a link to the original article.\n• Any violation of intellectual property rights will subject the violator to legal liability.",

        "privacy_updates_title": "Policy Updates",
        "privacy_updates_content": "We may update this Privacy Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.\n\nWe will notify you of any material changes by posting the updated policy on this page with a revised effective date.\n\nWe encourage you to review this page periodically for any updates. Your continued use of the site after changes are posted constitutes your acceptance of the updated terms.\n\nLast updated: March 2026",

        "privacy_contact_title": "Contact Us",
        "privacy_contact_content": "If you have any questions or requests regarding this Privacy Policy or your personal data, please contact us:\n\n• Via the \"Contact Us\" page on the site\n• Or via the dedicated support email\n\nWe will do our best to respond to your inquiries as soon as possible.",
        "privacy_last_updated": "Last updated: March 2026",
// Login page
        "login_title": "Login",
        "login_subtitle": "Welcome to the Admin Dashboard",
        "login_identity_label": "Username or Email",
        "login_identity_placeholder": "Enter username or email",
        "login_password_label": "Password",
        "login_password_placeholder": "Enter password",
        "login_forgot_password": "Forgot password?",
        "login_remember": "Remember me",
        "login_verifying": "Verifying...",
        "login_support": "For technical support, contact the system administrator",
        "login_welcome": "Welcome,",

        "forgot_title": "Recover Password",
        "forgot_subtitle": "Enter your username or email",
        "forgot_identity_placeholder": "Enter username or email",
        "forgot_success_title": "Sent successfully",
        "forgot_success_message": "If the account exists, you will receive recovery instructions",
        "back_to_login": "Back to Login",
        "cat_name_required": "Please enter a category name",
        "cat_added": "Category added successfully",
        "cat_deleted": "Category deleted",
        "cat_updated": "Category updated",
        "subcat_added": "Subcategory added successfully",
        "subcat_deleted": "Subcategory deleted",
        "subcat_reordered": "Subcategories reordered",
        "categories_reordered": "Categories reordered",

    }
}

// ── Non-blocking hook — shows Arabic instantly, updates in parallel ─
export function useTranslatedArticles(articles) {
    const {lang, setTranslatingCount, setTotalCount} = useLanguage()
    const [translated, setTranslated] = useState(articles)
    const abortRef = useRef(false)

    useEffect(() => {
        setTranslated(articles)
        if (lang === "ar" || !articles || articles.length === 0) {
            setTranslatingCount(0);
            setTotalCount(0);
            return
        }
        abortRef.current = false
        setTotalCount(articles.length)
        setTranslatingCount(articles.length)

        articles.forEach(async (article) => {
            const result = await translateArticle(article, "en")
            if (!abortRef.current) {
                setTranslatingCount((prev) => Math.max(0, prev - 1))
                setTranslated((prev) => prev.map((a) => a.id === article.id ? result : a))
            }
        })

        return () => {
            abortRef.current = true
        }
    }, [JSON.stringify(articles.map((a) => a.id)), lang])

    return {translatedArticles: translated, isTranslating: false}
}

// ── Small non-blocking indicator (bottom-right corner) ───────
export function TranslationIndicator() {
    const {translatingCount, totalCount, lang} = useLanguage()
    const isActive = lang === "en" && translatingCount > 0 && totalCount > 0
    const done = totalCount - translatingCount
    const pct = totalCount > 0 ? Math.round((done / totalCount) * 100) : 0

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    transition={{type: "spring", stiffness: 400, damping: 30}}
                    className="fixed bottom-5 right-5 z-[300] flex items-center gap-3 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl shadow-black/30 pointer-events-none"
                >
                    <svg className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <div className="flex items-center gap-2">
                        <span className="text-stone-400">Translating</span>
                        <div className="w-20 h-1 bg-stone-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-amber-400 rounded-full"
                                animate={{width: `${pct}%`}}
                                transition={{duration: 0.3}}
                            />
                        </div>
                        <span className="text-amber-400 tabular-nums">{done}/{totalCount}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ── Provider ──────────────────────────────────────────────────
export function LanguageProvider({children}) {
    const [lang, setLang] = useState(() => localStorage.getItem("oilpulse_lang") || "ar")
    const [translatingCount, setTranslatingCount] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        localStorage.setItem("oilpulse_lang", lang)
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = lang
        setTranslatingCount(0);
        setTotalCount(0)
    }, [lang])

    const toggleLang = () => setLang((prev) => prev === "ar" ? "en" : "ar")
    const t = (key) => translations[lang]?.[key] ?? key

    return (
        <LanguageContext.Provider
            value={{lang, toggleLang, t, setTranslatingCount, setTotalCount, translatingCount, totalCount}}>
            {children}
            <TranslationIndicator/>
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)