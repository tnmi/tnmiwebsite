import { useState, useEffect } from 'react'

export type Language = 'en' | 'fr'

export interface Translations {
  // Common
  loading: string
  save: string
  cancel: string
  delete: string
  edit: string
  update: string
  submit: string
  close: string
  back: string
  next: string
  previous: string
  search: string
  filter: string
  sort: string
  refresh: string
  export: string
  import: string
  download: string
  upload: string
  view: string
  add: string
  remove: string
  confirm: string
  yes: string
  no: string
  ok: string
  error: string
  success: string
  warning: string
  info: string
  required: string
  optional: string
  invalid: string
  valid: string

  // Navigation
  overview: string
  dashboard: string
  settings: string
  profile: string
  support: string
  billing: string
  logout: string
  login: string
  signup: string
  forgotPassword: string
  resetPassword: string
  changePassword: string
  myProducts: string
  myCompany: string

  // Auth
  email: string
  password: string
  confirmPassword: string
  currentPassword: string
  newPassword: string
  firstName: string
  lastName: string
  fullName: string
  signIn: string
  signUp: string
  signOut: string
  createAccount: string
  alreadyHaveAccount: string
  dontHaveAccount: string
  forgotYourPassword: string
  rememberMe: string
  staySignedIn: string
  passwordResetSent: string
  passwordResetError: string
  loginError: string
  signupError: string
  passwordUpdateSuccess: string
  passwordUpdateError: string
  profileUpdateSuccess: string
  profileUpdateError: string

  // Dashboard
  welcome: string
  welcomeBack: string
  recentActivity: string
  quickActions: string
  notifications: string
  messages: string
  tasks: string
  calendar: string
  reports: string
  analytics: string

  // Products
  products: string
  product: string
  addProduct: string
  editProduct: string
  deleteProduct: string
  productName: string
  productDescription: string
  productCategory: string
  productPrice: string
  productImage: string
  productFile: string
  uploadFile: string
  selectFile: string
  fileUploaded: string
  fileUploadError: string
  noProducts: string
  createProduct: string
  updateProduct: string
  productCreated: string
  productUpdated: string
  productDeleted: string
  trlLevel: string
  techSheet: string
  techSheetUrl: string

  // Settings
  personalInformation: string
  accountSettings: string
  privacySettings: string
  securitySettings: string
  notificationSettings: string
  languageSettings: string
  dataExport: string
  dataDeletion: string
  deleteAccount: string
  exportData: string
  deleteAllData: string
  privacyPolicy: string
  termsOfService: string
  dataPrivacy: string
  yourDataIsYours: string
  dataPrivacyDescription: string
  youAreAlwaysInControl: string
  clearAndHonestCommunication: string
  noHiddenMotives: string
  respectForYourChoices: string
  privacyQuestions: string
  exportError: string
  deleteConfirmation: string
  dataDeletedSuccessfully: string
  deleteError: string

  // Support
  supportTitle: string
  contactUs: string
  sendMessage: string
  message: string
  subject: string
  name: string
  phone: string
  company: string
  messageSent: string
  messageError: string
  responseTime: string
  commonTopics: string
  productInformation: string
  technicalSupport: string
  accountBilling: string
  partnershipInquiries: string

  // Form validation
  fieldRequired: string
  invalidEmail: string
  passwordTooShort: string
  passwordsDontMatch: string
  passwordMustBeDifferent: string
  currentPasswordIncorrect: string
  passwordTooWeak: string
  requiresRecentLogin: string
  tooManyAttempts: string
  saving: string
  updating: string
  uploading: string
  processing: string
  pleaseWait: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    view: 'View',
    add: 'Add',
    remove: 'Remove',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    required: 'Required',
    optional: 'Optional',
    invalid: 'Invalid',
    valid: 'Valid',

    // Navigation
    overview: 'Overview',
    dashboard: 'Dashboard',
    settings: 'Settings',
    profile: 'Profile',
    support: 'Support',
    billing: 'Billing',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    changePassword: 'Change Password',
    myProducts: 'My Products',
    myCompany: 'My Company',

    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    fullName: 'Full Name',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    forgotYourPassword: 'Forgot your password?',
    rememberMe: 'Remember me',
    staySignedIn: 'Stay signed in',
    passwordResetSent: 'Password reset email sent!',
    passwordResetError: 'Failed to send password reset email',
    loginError: 'Login failed. Please check your credentials.',
    signupError: 'Sign up failed. Please try again.',
    passwordUpdateSuccess: 'Password updated successfully!',
    passwordUpdateError: 'Failed to update password',
    profileUpdateSuccess: 'Profile updated successfully!',
    profileUpdateError: 'Failed to update profile',

    // Dashboard
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    notifications: 'Notifications',
    messages: 'Messages',
    tasks: 'Tasks',
    calendar: 'Calendar',
    reports: 'Reports',
    analytics: 'Analytics',

    // Products
    products: 'Products',
    product: 'Product',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    productName: 'Product Name',
    productDescription: 'Product Description',
    productCategory: 'Product Category',
    productPrice: 'Product Price',
    productImage: 'Product Image',
    productFile: 'Product File',
    uploadFile: 'Upload File',
    selectFile: 'Select File',
    fileUploaded: 'File uploaded successfully',
    fileUploadError: 'Failed to upload file',
    noProducts: 'No products found',
    createProduct: 'Create Product',
    updateProduct: 'Update Product',
    productCreated: 'Product created successfully',
    productUpdated: 'Product updated successfully',
    productDeleted: 'Product deleted successfully',
    trlLevel: 'TRL Level',
    techSheet: 'Tech Sheet',
    techSheetUrl: 'Tech Sheet URL',

    // Settings
    personalInformation: 'Personal Information',
    accountSettings: 'Account Settings',
    privacySettings: 'Privacy Settings',
    securitySettings: 'Security Settings',
    notificationSettings: 'Notification Settings',
    languageSettings: 'Language Settings',
    dataExport: 'Data Export',
    dataDeletion: 'Data Deletion',
    deleteAccount: 'Delete Account',
    exportData: 'Export My Data',
    deleteAllData: 'Delete All My Data',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    dataPrivacy: 'Data Privacy',
    yourDataIsYours: 'Your Data is Yours',
    dataPrivacyDescription: 'We believe in full transparency and giving you genuine control over your personal information. Your data belongs to you, and protecting your privacy is our top priority.',
    youAreAlwaysInControl: 'You are always in control: You can export, update, or delete specific data whenever you want.',
    clearAndHonestCommunication: 'Clear and honest communication: We explain exactly how your data is used and stored—no vague terms or confusing policies.',
    noHiddenMotives: 'No hidden motives: We will never sell, rent, or share your personal information with anyone.',
    respectForYourChoices: 'Respect for your choices: We will never pressure you to share your data. The decision about your information is always yours.',
    privacyQuestions: 'If you have any questions about your privacy or how your data is handled, we\'re here to answer—no secrets, just honest answers.',

    // Support
    supportTitle: 'Support',
    contactUs: 'Contact Us',
    sendMessage: 'Send us a message',
    message: 'Message',
    subject: 'Subject',
    name: 'Name',
    phone: 'Phone',
    company: 'Company',
    messageSent: 'Message sent successfully!',
    messageError: 'Failed to send message',
    responseTime: 'We typically respond within 24 hours during business days.',
    commonTopics: 'Common Support Topics',
    productInformation: 'Product information and specifications',
    technicalSupport: 'Technical support and troubleshooting',
    accountBilling: 'Account and billing questions',
    partnershipInquiries: 'Partnership and collaboration inquiries',

    // Form validation
    fieldRequired: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDontMatch: 'Passwords do not match',
    passwordMustBeDifferent: 'New password must be different from current password',
    currentPasswordIncorrect: 'Current password is incorrect',
    passwordTooWeak: 'New password is too weak. Please choose a stronger password',
    requiresRecentLogin: 'For security reasons, please log out and log back in before changing your password',
    tooManyAttempts: 'Too many failed attempts. Please try again later',
    saving: 'Saving...',
    updating: 'Updating...',
    uploading: 'Uploading...',
    processing: 'Processing...',
    pleaseWait: 'Please wait...',
    
    // Data export/delete
    exportError: 'Failed to export data. Please try again.',
    deleteConfirmation: 'Are you sure you want to delete all your data? This action cannot be undone.',
    dataDeletedSuccessfully: 'All your data has been deleted successfully.',
    deleteError: 'Failed to delete data. Please try again.',
  },
  fr: {
    // Common
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    update: 'Mettre à jour',
    submit: 'Soumettre',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    refresh: 'Actualiser',
    export: 'Exporter',
    import: 'Importer',
    download: 'Télécharger',
    upload: 'Téléverser',
    view: 'Voir',
    add: 'Ajouter',
    remove: 'Supprimer',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Info',
    required: 'Requis',
    optional: 'Optionnel',
    invalid: 'Invalide',
    valid: 'Valide',

    // Navigation
    overview: 'Aperçu',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    profile: 'Profil',
    support: 'Support',
    billing: 'Facturation',
    logout: 'Déconnexion',
    login: 'Connexion',
    signup: 'S\'inscrire',
    forgotPassword: 'Mot de passe oublié',
    resetPassword: 'Réinitialiser le mot de passe',
    changePassword: 'Changer le mot de passe',
    myProducts: 'Mes Produits',
    myCompany: 'Mon Entreprise',

    // Auth
    email: 'E-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    fullName: 'Nom complet',
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    signOut: 'Se déconnecter',
    createAccount: 'Créer un compte',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    forgotYourPassword: 'Mot de passe oublié ?',
    rememberMe: 'Se souvenir de moi',
    staySignedIn: 'Rester connecté',
    passwordResetSent: 'E-mail de réinitialisation envoyé !',
    passwordResetError: 'Échec de l\'envoi de l\'e-mail de réinitialisation',
    loginError: 'Échec de la connexion. Veuillez vérifier vos identifiants.',
    signupError: 'Échec de l\'inscription. Veuillez réessayer.',
    passwordUpdateSuccess: 'Mot de passe mis à jour avec succès !',
    passwordUpdateError: 'Échec de la mise à jour du mot de passe',
    profileUpdateSuccess: 'Profil mis à jour avec succès !',
    profileUpdateError: 'Échec de la mise à jour du profil',

    // Dashboard
    welcome: 'Bienvenue',
    welcomeBack: 'Bon retour',
    recentActivity: 'Activité récente',
    quickActions: 'Actions rapides',
    notifications: 'Notifications',
    messages: 'Messages',
    tasks: 'Tâches',
    calendar: 'Calendrier',
    reports: 'Rapports',
    analytics: 'Analyses',

    // Products
    products: 'Produits',
    product: 'Produit',
    addProduct: 'Ajouter un produit',
    editProduct: 'Modifier le produit',
    deleteProduct: 'Supprimer le produit',
    productName: 'Nom du produit',
    productDescription: 'Description du produit',
    productCategory: 'Catégorie du produit',
    productPrice: 'Prix du produit',
    productImage: 'Image du produit',
    productFile: 'Fichier du produit',
    uploadFile: 'Téléverser un fichier',
    selectFile: 'Sélectionner un fichier',
    fileUploaded: 'Fichier téléversé avec succès',
    fileUploadError: 'Échec du téléversement du fichier',
    noProducts: 'Aucun produit trouvé',
    createProduct: 'Créer un produit',
    updateProduct: 'Mettre à jour le produit',
    productCreated: 'Produit créé avec succès',
    productUpdated: 'Produit mis à jour avec succès',
    productDeleted: 'Produit supprimé avec succès',
    trlLevel: 'Niveau TRL',
    techSheet: 'Fiche technique',
    techSheetUrl: 'URL de la fiche technique',

    // Settings
    personalInformation: 'Informations personnelles',
    accountSettings: 'Paramètres du compte',
    privacySettings: 'Paramètres de confidentialité',
    securitySettings: 'Paramètres de sécurité',
    notificationSettings: 'Paramètres de notification',
    languageSettings: 'Paramètres de langue',
    dataExport: 'Exportation des données',
    dataDeletion: 'Suppression des données',
    deleteAccount: 'Supprimer le compte',
    exportData: 'Exporter mes données',
    deleteAllData: 'Supprimer toutes mes données',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    dataPrivacy: 'Confidentialité des données',
    yourDataIsYours: 'Vos données vous appartiennent',
    dataPrivacyDescription: 'Nous croyons en la transparence totale et vous donner un contrôle authentique sur vos informations personnelles. Vos données vous appartiennent, et protéger votre vie privée est notre priorité absolue.',
    youAreAlwaysInControl: 'Vous êtes toujours en contrôle : Vous pouvez exporter, mettre à jour ou supprimer des données spécifiques quand vous le souhaitez.',
    clearAndHonestCommunication: 'Communication claire et honnête : Nous expliquons exactement comment vos données sont utilisées et stockées—aucun terme vague ou politique confuse.',
    noHiddenMotives: 'Aucun motif caché : Nous ne vendrons, louerons ou partagerons jamais vos informations personnelles avec qui que ce soit.',
    respectForYourChoices: 'Respect de vos choix : Nous ne vous pousserons jamais à partager vos données. La décision concernant vos informations vous appartient toujours.',
    privacyQuestions: 'Si vous avez des questions sur votre vie privée ou la façon dont vos données sont traitées, nous sommes là pour répondre—aucun secret, juste des réponses honnêtes.',

    // Support
    supportTitle: 'Support',
    contactUs: 'Nous contacter',
    sendMessage: 'Envoyez-nous un message',
    message: 'Message',
    subject: 'Sujet',
    name: 'Nom',
    phone: 'Téléphone',
    company: 'Entreprise',
    messageSent: 'Message envoyé avec succès !',
    messageError: 'Échec de l\'envoi du message',
    responseTime: 'Nous répondons généralement dans les 24 heures pendant les jours ouvrables.',
    commonTopics: 'Sujets de support courants',
    productInformation: 'Informations et spécifications des produits',
    technicalSupport: 'Support technique et dépannage',
    accountBilling: 'Questions sur le compte et la facturation',
    partnershipInquiries: 'Demandes de partenariat et de collaboration',

    // Form validation
    fieldRequired: 'Ce champ est requis',
    invalidEmail: 'Veuillez entrer une adresse e-mail valide',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    passwordsDontMatch: 'Les mots de passe ne correspondent pas',
    passwordMustBeDifferent: 'Le nouveau mot de passe doit être différent de l\'actuel',
    currentPasswordIncorrect: 'Le mot de passe actuel est incorrect',
    passwordTooWeak: 'Le nouveau mot de passe est trop faible. Veuillez choisir un mot de passe plus fort',
    requiresRecentLogin: 'Pour des raisons de sécurité, veuillez vous déconnecter et vous reconnecter avant de changer votre mot de passe',
    tooManyAttempts: 'Trop de tentatives échouées. Veuillez réessayer plus tard',
    saving: 'Enregistrement...',
    updating: 'Mise à jour...',
    uploading: 'Téléversement...',
    processing: 'Traitement...',
    pleaseWait: 'Veuillez patienter...',
    
    // Data export/delete
    exportError: 'Échec de l\'exportation des données. Veuillez réessayer.',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action ne peut pas être annulée.',
    dataDeletedSuccessfully: 'Toutes vos données ont été supprimées avec succès.',
    deleteError: 'Échec de la suppression des données. Veuillez réessayer.',
  }
}

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: keyof Translations): string => {
    return translations[language][key] || key
  }

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    // Store in localStorage for persistence
    localStorage.setItem('language', newLanguage)
  }

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage)
    }
  }, [])

  return { language, setLanguage: changeLanguage, t }
} 