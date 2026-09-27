import type { Localized } from "./types";

export type Lang = "fr" | "ar";

const dict = {
  "nav.home": { fr: "Accueil", ar: "الرئيسية" },
  "nav.shop": { fr: "Boutique", ar: "المتجر" },
  "nav.about": { fr: "À Propos", ar: "من نحن" },
  "nav.contact": { fr: "Contact", ar: "اتصل بنا" },
  "nav.admin": { fr: "Admin", ar: "الإدارة" },
  "nav.adminSpace": { fr: "Espace Admin", ar: "فضاء الإدارة" },
  "nav.vehicles": { fr: "Sélecteur Véhicule", ar: "اختيار السيارة" },
  "nav.calculator": { fr: "Calculateur Suspension", ar: "حاسبة التعليق" },
  "nav.visualizer": { fr: "Visualiseur 4x4", ar: "معاين 4x4" },
  "nav.gallery": { fr: "Nos Projets", ar: "مشاريعنا" },

  "topbar.official": {
    fr: "★ Distributeur Officiel Ironman 4x4 — Livraison 69 Wilayas — Paiement à la Livraison",
    ar: "★ الموزع الرسمي لآيرون مان 4x4 — توصيل 69 ولاية — الدفع عند الاستلام",
  },

  "hero.scroll": { fr: "Défiler", ar: "مرر للأسفل" },
  "hero.slide": { fr: "Diapositive", ar: "شريحة" },

  "cta.shop": { fr: "Commandez Maintenant", ar: "اطلب الآن" },
  "cta.whatsapp": { fr: "Commander via WhatsApp", ar: "اطلب عبر واتساب" },
  "cta.viewProduct": { fr: "Voir le Produit", ar: "عرض المنتج" },
  "cta.viewAll": { fr: "Voir Tout", ar: "عرض الكل" },
  "cta.explore": { fr: "Explorer", ar: "استكشف" },

  "selector.title": { fr: "Acheter par Véhicule", ar: "تسوق حسب السيارة" },
  "selector.brand": { fr: "Marque", ar: "الماركة" },
  "selector.model": { fr: "Modèle", ar: "الموديل" },
  "selector.year": { fr: "Année", ar: "السنة" },
  "selector.allBrands": { fr: "Toutes les marques", ar: "كل الماركات" },
  "selector.allModels": { fr: "Tous les modèles", ar: "كل الموديلات" },
  "selector.allYears": { fr: "Toutes les années", ar: "كل السنوات" },
  "selector.search": { fr: "Trouver mes pièces", ar: "اعثر على قطعي" },
  "selector.reset": { fr: "Réinitialiser", ar: "إعادة تعيين" },

  "product.inStock": { fr: "En Stock", ar: "متوفر" },
  "product.lowStock": { fr: "Stock Limité", ar: "كمية محدودة" },
  "product.outOfStock": { fr: "Rupture de Stock", ar: "غير متوفر" },
  "product.sku": { fr: "Réf.", ar: "المرجع" },
  "problem": { fr: "Le Problème", ar: "المشكلة" },
  "solution": { fr: "La Solution Dahra Motors", ar: "حل الضهرة موتورز" },
  "features": { fr: "Caractéristiques Clés", ar: "المميزات الرئيسية" },
  "specs": { fr: "Spécifications Techniques", ar: "المواصفات التقنية" },
  "fitment": { fr: "Compatibilité Véhicules", ar: "توافق السيارات" },
  "warranty": { fr: "Garantie", ar: "الضمان" },
  "related": { fr: "Produits Similaires", ar: "منتجات مشابهة" },
  "description": { fr: "Description", ar: "الوصف" },
  "qty": { fr: "Quantité", ar: "الكمية" },

  "shop.title": { fr: "Boutique Ironman 4x4", ar: "متجر آيرون مان 4x4" },
  "shop.subtitle": {
    fr: "Pièces et accessoires 100% d'origine — stock local en Algérie",
    ar: "قطع وإكسسوارات أصلية 100% — مخزون محلي في الجزائر",
  },
  "shop.allCategories": { fr: "Toutes Catégories", ar: "كل الفئات" },
  "shop.search": { fr: "Rechercher un produit, une référence...", ar: "ابحث عن منتج أو مرجع..." },
  "shop.sort": { fr: "Trier par", ar: "ترتيب حسب" },
  "shop.sortFeatured": { fr: "En vedette", ar: "المميزة" },
  "shop.sortPriceAsc": { fr: "Prix croissant", ar: "السعر تصاعدياً" },
  "shop.sortPriceDesc": { fr: "Prix décroissant", ar: "السعر تنازلياً" },
  "shop.sortName": { fr: "Nom A-Z", ar: "الاسم أ-ي" },
  "shop.results": { fr: "produit(s) trouvé(s)", ar: "منتج(ات) موجود" },
  "shop.noResults": {
    fr: "Aucun produit ne correspond à votre recherche.",
    ar: "لا توجد منتجات مطابقة لبحثك.",
  },
  "shop.vehicleFilter": { fr: "Filtre véhicule actif", ar: "فلتر السيارة مفعّل" },
  "shop.compatible": { fr: "Compatible avec votre véhicule", ar: "متوافق مع سيارتك" },

  "cod.title": { fr: "Commande Rapide — Paiement à la Livraison", ar: "طلب سريع — الدفع عند الاستلام" },
  "cod.subtitle": {
    fr: "Remplissez le formulaire, nous vous appelons pour confirmer. Vous payez à la réception.",
    ar: "املأ النموذج وسنتصل بك للتأكيد. تدفع عند الاستلام.",
  },
  "cod.name": { fr: "Nom complet *", ar: "الاسم الكامل *" },
  "cod.phone": { fr: "Téléphone *", ar: "رقم الهاتف *" },
  "cod.wilaya": { fr: "Wilaya *", ar: "الولاية *" },
  "cod.address": { fr: "Adresse de livraison *", ar: "عنوان التوصيل *" },
  "cod.note": { fr: "Note (optionnel)", ar: "ملاحظة (اختياري)" },
  "cod.submit": { fr: "Confirmer la Commande", ar: "تأكيد الطلب" },
  "cod.cancel": { fr: "Annuler", ar: "إلغاء" },
  "cod.total": { fr: "Total estimé", ar: "المجموع التقديري" },
  "cod.successTitle": { fr: "Commande Enregistrée !", ar: "تم تسجيل الطلب!" },
  "cod.successText": {
    fr: "Merci ! Notre équipe vous appellera dans les plus brefs délais pour confirmer votre commande. Référence :",
    ar: "شكراً لك! سيتصل بك فريقنا في أقرب وقت لتأكيد طلبك. المرجع:",
  },
  "cod.alsoWhatsapp": {
    fr: "Vous pouvez aussi confirmer instantanément via WhatsApp :",
    ar: "يمكنك أيضاً التأكيد فوراً عبر واتساب:",
  },
  "cod.required": { fr: "Veuillez remplir tous les champs obligatoires.", ar: "يرجى ملء جميع الحقول المطلوبة." },
  "cod.close": { fr: "Fermer", ar: "إغلاق" },

  "about.title": { fr: "À Propos de Dahra Motors", ar: "من نحن — الضهرة موتورز" },
  "about.officialRep": { fr: "Représentant Officiel & Distributeur Autorisé Ironman 4x4", ar: "الممثل الرسمي والموزع المعتمد لآيرون مان 4x4" },
  "about.mission": { fr: "Notre Mission", ar: "مهمتنا" },
  "about.missionText": {
    fr: "Nous apportons l'excellence 4x4 mondiale, une durabilité extrême et des garanties officielles directement aux passionnés de tout-terrain algériens. Chaque pièce vendue est 100% genuine, couverte par la garantie Ironman 4x4 et installable par nos techniciens certifiés.",
    ar: "نجلب التميز العالمي في الدفع الرباعي والمتانة الفائقة والضمانات الرسمية مباشرة إلى عشاق الطرق الوعرة الجزائريين. كل قطعة نبيعها أصلية 100%، مغطاة بضمان آيرون مان 4x4 ويمكن تركيبها من قبل فنيينا المعتمدين.",
  },

  "contact.title": { fr: "Contactez-Nous", ar: "اتصل بنا" },
  "contact.subtitle": {
    fr: "Showroom & atelier à Baraki (Alger) — réponse rapide sur WhatsApp",
    ar: "معرض وورشة في براقي (الجزائر) — رد سريع على واتساب",
  },
  "contact.phone": { fr: "Téléphone", ar: "الهاتف" },
  "contact.email": { fr: "Email", ar: "البريد الإلكتروني" },
  "contact.address": { fr: "Adresse", ar: "العنوان" },
  "contact.hours": { fr: "Horaires", ar: "أوقات العمل" },
  "contact.form.title": { fr: "Envoyez-nous un message", ar: "أرسل لنا رسالة" },
  "contact.form.message": { fr: "Message *", ar: "الرسالة *" },
  "contact.form.send": { fr: "Envoyer via WhatsApp", ar: "أرسل عبر واتساب" },
  "contact.follow": { fr: "Suivez-nous", ar: "تابعنا" },

  "footer.rights": { fr: "Tous droits réservés.", ar: "جميع الحقوق محفوظة." },
  "footer.quickLinks": { fr: "Liens Rapides", ar: "روابط سريعة" },
  "footer.categories": { fr: "Catégories", ar: "الفئات" },
  "footer.contact": { fr: "Contact", ar: "اتصال" },
  "footer.newsletter": { fr: "Restez informé des nouveautés Ironman 4x4", ar: "ابق على اطلاع بجديد آيرون مان 4x4" },
  "footer.emailPlaceholder": { fr: "Votre adresse email", ar: "بريدك الإلكتروني" },
  "footer.subscribe": { fr: "S'abonner", ar: "اشترك" },
  "footer.subscribed": { fr: "Merci ! Vous êtes abonné.", ar: "شكراً! تم اشتراكك." },
  "footer.official": {
    fr: "Distributeur Officiel & Autorisé Ironman 4x4",
    ar: "الموزع الرسمي والمعتمد لآيرون مان 4x4",
  },

  "admin.login": { fr: "Connexion Administrateur", ar: "تسجيل دخول المسؤول" },
  "admin.username": { fr: "Nom d'utilisateur", ar: "اسم المستخدم" },
  "admin.password": { fr: "Mot de passe", ar: "كلمة المرور" },
  "admin.signIn": { fr: "Se Connecter", ar: "تسجيل الدخول" },
  "admin.invalid": { fr: "Identifiants incorrects.", ar: "بيانات الدخول غير صحيحة." },
  "admin.logout": { fr: "Déconnexion", ar: "تسجيل الخروج" },
  "admin.dashboard": { fr: "Tableau de Bord", ar: "لوحة التحكم" },
  "admin.orders": { fr: "Commandes", ar: "الطلبات" },
  "admin.products": { fr: "Produits", ar: "المنتجات" },
  "admin.categoriesAdmin": { fr: "Catégories", ar: "الفئات" },
  "admin.heroAdmin": { fr: "Hero Slider", ar: "شريط الواجهة" },
  "admin.branding": { fr: "Logo & Branding", ar: "الشعار والعلامة" },
  "admin.contentAdmin": { fr: "Contenu & Copywriting", ar: "المحتوى والنصوص" },
  "admin.contactAdmin": { fr: "Contact & Réseaux", ar: "الاتصال والشبكات" },
  "admin.security": { fr: "Sécurité", ar: "الأمان" },
  "admin.viewSite": { fr: "Voir le Site", ar: "عرض الموقع" },
  "admin.backToSite": { fr: "Retour au site", ar: "العودة إلى الموقع" },
  "admin.save": { fr: "Enregistrer", ar: "حفظ" },
  "admin.saved": { fr: "Modifications enregistrées ✓", ar: "تم حفظ التعديلات ✓" },
  "admin.cancel": { fr: "Annuler", ar: "إلغاء" },
  "admin.edit": { fr: "Modifier", ar: "تعديل" },
  "admin.delete": { fr: "Supprimer", ar: "حذف" },
  "admin.add": { fr: "Ajouter", ar: "إضافة" },
  "admin.active": { fr: "Visible", ar: "ظاهر" },
  "admin.hidden": { fr: "Masqué", ar: "مخفي" },
  "admin.upload": { fr: "Téléverser une image", ar: "تحميل صورة" },
  "admin.orUrl": { fr: "…ou coller une URL d'image", ar: "…أو الصق رابط صورة" },
  "admin.noOrders": { fr: "Aucune commande pour le moment.", ar: "لا توجد طلبات حالياً." },
  "admin.confirmDelete": { fr: "Confirmer la suppression ?", ar: "تأكيد الحذف؟" },
  "admin.status.pending": { fr: "En attente", ar: "قيد الانتظار" },
  "admin.status.confirmed": { fr: "Confirmée", ar: "مؤكد" },
  "admin.status.shipped": { fr: "Expédiée", ar: "تم الشحن" },
  "admin.status.delivered": { fr: "Livrée", ar: "تم التسليم" },
  "admin.status.cancelled": { fr: "Annulée", ar: "ملغي" },
  "admin.securityNote": {
    fr: "Mettez à jour vos identifiants administrateur. Le mot de passe actuel est requis.",
    ar: "قم بتحديث بيانات الدخول. كلمة المرور الحالية مطلوبة.",
  },
  "admin.currentPassword": { fr: "Mot de passe actuel", ar: "كلمة المرور الحالية" },
  "admin.newUsername": { fr: "Nouveau nom d'utilisateur", ar: "اسم مستخدم جديد" },
  "admin.newPassword": { fr: "Nouveau mot de passe", ar: "كلمة مرور جديدة" },
  "admin.securityError": { fr: "Mot de passe actuel incorrect.", ar: "كلمة المرور الحالية غير صحيحة." },
  "admin.statsProducts": { fr: "Produits", ar: "المنتجات" },
  "admin.statsOrders": { fr: "Commandes", ar: "الطلبات" },
  "admin.statsRevenue": { fr: "Revenu (commandes)", ar: "الإيرادات (الطلبات)" },
  "admin.statsCategories": { fr: "Catégories", ar: "الفئات" },
  "admin.recentOrders": { fr: "Commandes Récentes", ar: "أحدث الطلبات" },
  "admin.galleryAdmin": { fr: "Galerie Builds", ar: "معرض التجهيزات" },
  "admin.videoSection": { fr: "Section Vidéo", ar: "قسم الفيديو" },

  "cod.installCheck": {
    fr: "Réserver un créneau d'installation à l'atelier Dahra Motors (Baraki)",
    ar: "احجز موعد تركيب في ورشة الضهرة موتورز (برقي)",
  },
  "cod.installDate": { fr: "Date souhaitée", ar: "التاريخ المطلوب" },
  "cod.installSlot": { fr: "Créneau horaire", ar: "الفترة الزمنية" },
  "cod.installBooked": { fr: "Installation réservée", ar: "تم حجز التركيب" },

  "calc.title": { fr: "Calculateur de Suspension", ar: "حاسبة نظام التعليق" },
  "calc.subtitle": {
    fr: "Sélectionnez votre véhicule et vos accessoires — nous calculons la charge ajoutée et recommandons le kit suspension Ironman 4x4 idéal.",
    ar: "اختر سيارتك وإكسسواراتك — نحسب الوزن المضاف ونوصي بطقم التعليق المثالي من آيرون مان 4x4.",
  },
  "calc.step1": { fr: "1 — Votre Véhicule", ar: "1 — سيارتك" },
  "calc.step2": { fr: "2 — Vos Accessoires", ar: "2 — إكسسواراتك" },
  "calc.totalWeight": { fr: "Charge ajoutée estimée", ar: "الوزن المضاف التقديري" },
  "calc.result": { fr: "Votre Kit Suspension Recommandé", ar: "طقم التعليق الموصى به" },
  "calc.classMedium": { fr: "Profil Medium Load", ar: "فئة الحمل المتوسط" },
  "calc.classHeavy": { fr: "Profil Heavy Duty", ar: "فئة المهام الشاقة" },
  "calc.selectFirst": {
    fr: "Sélectionnez votre véhicule pour voir la recommandation.",
    ar: "اختر سيارتك لعرض التوصية.",
  },
  "calc.why": {
    fr: "Basé sur le poids total de vos accessoires et le type de votre véhicule.",
    ar: "بناءً على الوزن الإجمالي لإكسسواراتك ونوع سيارتك.",
  },
  "calc.viewKit": { fr: "Voir la Fiche Produit", ar: "عرض صفحة المنتج" },
  "calc.noKit": {
    fr: "Contactez-nous pour une configuration sur mesure.",
    ar: "اتصل بنا للحصول على تجهيز مخصص.",
  },

  "viz.title": { fr: "Visualiseur 4x4 Interactif", ar: "معاين 4x4 التفاعلي" },
  "viz.subtitle": {
    fr: "Choisissez votre base, activez les accessoires et prévisualisez votre build instantanément. Glissez les éléments pour ajuster leur position.",
    ar: "اختر سيارتك، فعّل الإكسسوارات وشاهد تجهيزك فوراً. اسحب العناصر لتعديل موضعها.",
  },
  "viz.chooseBase": { fr: "Base Véhicule", ar: "السيارة الأساسية" },
  "viz.accessories": { fr: "Accessoires", ar: "الإكسسوارات" },
  "viz.bullbar": { fr: "Pare-Buffles Acier", ar: "مصعد أمامي فولاذي" },
  "viz.tent": { fr: "Tente de Toit", ar: "خيمة سقف" },
  "viz.led": { fr: "Barre LED", ar: "شريط إضاءة LED" },
  "viz.reset": { fr: "Réinitialiser le Build", ar: "إعادة تعيين التجهيز" },
  "viz.quote": { fr: "Demander un Devis pour ce Build", ar: "اطلب عرض سعر لهذا التجهيز" },
  "viz.stock": { fr: "Configuration d'origine", ar: "التجهيز الأصلي" },

  "gal.title": { fr: "Nos Projets — Build Gallery", ar: "مشاريعنا — معرض التجهيزات" },
  "gal.subtitle": {
    fr: "Avant / Après : les 4x4 de nos clients transformés par Dahra Motors avec des pièces Ironman 4x4 100% d'origine.",
    ar: "قبل / بعد: سيارات عملائنا التي جهزتها الضهرة موتورز بقطع آيرون مان 4x4 أصلية 100%.",
  },
  "gal.before": { fr: "Avant", ar: "قبل" },
  "gal.after": { fr: "Après", ar: "بعد" },
  "gal.videoReview": { fr: "Review Vidéo", ar: "مراجعة فيديو" },

  "ty.title": { fr: "Merci pour votre commande !", ar: "شكراً لطلبك!" },
  "ty.confirm": {
    fr: "Votre commande a bien été enregistrée chez Dahra Motors 4x4.",
    ar: "تم تسجيل طلبك بنجاح لدى الضهرة موتورز 4x4.",
  },
  "ty.reference": { fr: "Référence commande", ar: "مرجع الطلب" },
  "ty.callNote": {
    fr: "Notre équipe Dahra Motors vous appellera très prochainement pour vérifier et confirmer votre commande au",
    ar: "سيتصل بك فريق الضهرة موتورز قريباً جداً للتحقق من طلبك وتأكيده على الرقم",
  },
  "ty.summary": { fr: "Récapitulatif de la commande", ar: "ملخص الطلب" },
  "ty.customer": { fr: "Client", ar: "العميل" },
  "ty.delivery": { fr: "Livraison", ar: "التوصيل" },
  "ty.backShop": { fr: "Continuer mes achats", ar: "مواصلة التسوق" },
  "ty.whatsappHelp": { fr: "Confirmer aussi via WhatsApp", ar: "أكد أيضاً عبر واتساب" },
  "ty.noOrder": {
    fr: "Aucune commande récente trouvée.",
    ar: "لم يتم العثور على طلب حديث.",
  },
  "ty.smsAlert": {
    fr: "Envoyer l'alerte SMS de la commande",
    ar: "أرسل تنبيه الطلب عبر SMS",
  },

  "admin.analytics": { fr: "Analytics & Trafic", ar: "التحليلات وحركة الزوار" },
  "admin.selectUser": { fr: "Sélectionnez votre nom", ar: "اختر اسمك" },
  "admin.selectUserHint": {
    fr: "Pour accéder au tableau de bord",
    ar: "للوصول إلى لوحة التحكم",
  },
  "admin.activity": { fr: "Historique d'activité", ar: "سجل النشاط" },
  "admin.changeUser": { fr: "Changer", ar: "تغيير" },
  "admin.activityEmpty": {
    fr: "Aucune activité enregistrée pour le moment.",
    ar: "لا يوجد نشاط مسجل حالياً.",
  },

  "common.currency": { fr: "DA", ar: "دج" },
  "common.from": { fr: "À partir de", ar: "ابتداءً من" },
  "common.breadcrumb.home": { fr: "Accueil", ar: "الرئيسية" },
  "common.notFound": { fr: "Page introuvable", ar: "الصفحة غير موجودة" },
  "common.backHome": { fr: "Retour à l'accueil", ar: "العودة للرئيسية" },
} satisfies Record<string, Localized>;

export type TKey = keyof typeof dict;

export function translate(key: TKey, lang: Lang): string {
  return dict[key][lang];
}

export function loc(value: Localized, lang: Lang): string {
  return value[lang] || value.fr;
}

export function formatPrice(price: number, lang: Lang): string {
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ").format(price);
  return `${formatted} ${translate("common.currency", lang)}`;
}
