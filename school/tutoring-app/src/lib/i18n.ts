export type Language = "fr" | "en";

const translations = {
  // ============= COMMON =============
  "app.name": { fr: "LionLearn", en: "LionLearn" },
  "app.tagline": {
    fr: "Plateforme de tutorat intelligent",
    en: "Intelligent Tutoring Platform",
  },
  "app.tagline.student": {
    fr: "Plateforme de tutorat intelligent pour étudiants",
    en: "Intelligent Tutoring Platform for Students",
  },
  loading: { fr: "Chargement...", en: "Loading..." },
  "error.generic": { fr: "Une erreur est survenue", en: "An error occurred" },
  save: { fr: "Enregistrer", en: "Save" },
  cancel: { fr: "Annuler", en: "Cancel" },
  delete: { fr: "Supprimer", en: "Delete" },
  close: { fr: "Fermer", en: "Close" },
  back: { fr: "Retour", en: "Back" },
  next: { fr: "Suivant", en: "Next" },
  generate: { fr: "Générer", en: "Generate" },
  generating: { fr: "Génération en cours...", en: "Generating..." },
  seeAll: { fr: "Voir tout →", en: "See all →" },
  seeDetails: { fr: "Voir détails →", en: "See details →" },
  none: { fr: "Aucun", en: "None" },

  // ============= LANGUAGE PICKER =============
  "lang.label": { fr: "Langue", en: "Language" },
  "lang.fr": { fr: "Français", en: "French" },
  "lang.en": { fr: "Anglais", en: "English" },

  // ============= LOGIN =============
  "login.title": { fr: "Connexion", en: "Login" },
  "login.email": { fr: "Adresse email", en: "Email address" },
  "login.email.placeholder": {
    fr: "votre.email@example.com",
    en: "your.email@example.com",
  },
  "login.password": { fr: "Mot de passe", en: "Password" },
  "login.password.placeholder": {
    fr: "Votre mot de passe",
    en: "Your password",
  },
  "login.submit": { fr: "Se connecter", en: "Sign in" },
  "login.submitting": { fr: "Connexion...", en: "Signing in..." },
  "login.error": {
    fr: "Email ou mot de passe incorrect",
    en: "Invalid email or password",
  },
  "login.noAccount": { fr: "Pas encore de compte ?", en: "No account yet?" },
  "login.register": { fr: "S'inscrire", en: "Sign up" },
  "login.demo": { fr: "Compte démo :", en: "Demo account:" },

  // ============= REGISTER =============
  "register.step1.title": { fr: "Mon École", en: "My School" },
  "register.step2.title": { fr: "Mon Compte", en: "My Account" },
  "register.findSchool": {
    fr: "Trouvez votre école",
    en: "Find your school",
  },
  "register.findSchool.desc": {
    fr: "Sélectionnez votre établissement, département et classe",
    en: "Select your institution, department and class",
  },
  "register.school": { fr: "École / Université", en: "School / University" },
  "register.school.placeholder": {
    fr: "Choisir une école...",
    en: "Choose a school...",
  },
  "register.school.loading": {
    fr: "Chargement des écoles...",
    en: "Loading schools...",
  },
  "register.school.none": {
    fr: "Aucune école disponible. Contactez l'administrateur.",
    en: "No schools available. Contact the administrator.",
  },
  "register.department": {
    fr: "Département / Filière",
    en: "Department / Program",
  },
  "register.department.placeholder": {
    fr: "Choisir un département...",
    en: "Choose a department...",
  },
  "register.department.none": {
    fr: "Aucun département pour cette école",
    en: "No departments for this school",
  },
  "register.class": { fr: "Classe / Niveau", en: "Class / Level" },
  "register.class.placeholder": {
    fr: "Choisir une classe...",
    en: "Choose a class...",
  },
  "register.class.none": {
    fr: "Aucune classe pour ce département",
    en: "No classes for this department",
  },
  "register.selection": { fr: "Votre sélection :", en: "Your selection:" },
  "register.continue": { fr: "Continuer", en: "Continue" },
  "register.createAccount": {
    fr: "Créer votre compte",
    en: "Create your account",
  },
  "register.name": { fr: "Nom complet", en: "Full name" },
  "register.name.placeholder": {
    fr: "Votre nom et prénom",
    en: "Your full name",
  },
  "register.email": { fr: "Adresse email", en: "Email address" },
  "register.email.placeholder": {
    fr: "votre.email@example.com",
    en: "your.email@example.com",
  },
  "register.password": { fr: "Mot de passe", en: "Password" },
  "register.password.placeholder": {
    fr: "Au moins 6 caractères",
    en: "At least 6 characters",
  },
  "register.confirmPassword": {
    fr: "Confirmer le mot de passe",
    en: "Confirm password",
  },
  "register.confirmPassword.placeholder": {
    fr: "Confirmez votre mot de passe",
    en: "Confirm your password",
  },
  "register.submit": { fr: "S'inscrire", en: "Sign up" },
  "register.submitting": {
    fr: "Inscription en cours...",
    en: "Signing up...",
  },
  "register.hasAccount": { fr: "Déjà inscrit ?", en: "Already registered?" },
  "register.login": { fr: "Se connecter", en: "Sign in" },
  "register.error.passwordMismatch": {
    fr: "Les mots de passe ne correspondent pas",
    en: "Passwords do not match",
  },
  "register.error.passwordShort": {
    fr: "Le mot de passe doit contenir au moins 6 caractères",
    en: "Password must be at least 6 characters",
  },
  "register.error.generic": {
    fr: "Erreur lors de l'inscription",
    en: "Registration error",
  },

  // ============= SIDEBAR =============
  "nav.dashboard": { fr: "Tableau de Bord", en: "Dashboard" },
  "nav.courses": { fr: "Mes Cours", en: "My Courses" },
  "nav.progress": { fr: "Mon Progrès", en: "My Progress" },
  "nav.studyGuides": { fr: "Guides d'Étude", en: "Study Guides" },
  "nav.exercises": { fr: "Exercices", en: "Exercises" },
  "nav.flashcards": { fr: "Flashcards", en: "Flashcards" },
  "nav.chat": { fr: "Tuteur IA", en: "AI Tutor" },
  "nav.planner": { fr: "Plan d'Étude", en: "Study Planner" },
  "nav.admin": { fr: "Administration", en: "Administration" },
  "nav.admin.schools": { fr: "Écoles", en: "Schools" },
  "nav.admin.departments": { fr: "Départements", en: "Departments" },
  "nav.admin.classes": { fr: "Classes", en: "Classes" },
  "nav.admin.courses": { fr: "Cours", en: "Courses" },
  "nav.admin.users": { fr: "Utilisateurs", en: "Users" },
  "nav.admin.activity": { fr: "Journal d'activité", en: "Activity Log" },
  "nav.admin.analytics": { fr: "Tableau de bord", en: "Analytics" },
  "nav.admin.settings": { fr: "Réglages IA", en: "AI Settings" },
  "nav.admin.creditPacks": { fr: "Packs Crédits", en: "Credit Packs" },
  "nav.credits": { fr: "Mes Crédits", en: "My Credits" },
  "admin.settings.title": {
    fr: "Recommandations quotidiennes",
    en: "Daily Recommendations",
  },
  "admin.settings.subtitle": {
    fr: "Gérez l'agent IA qui génère du contenu personnalisé pour chaque étudiant",
    en: "Manage the AI agent that generates personalized content for each student",
  },
  "admin.analytics.title": {
    fr: "Tableau de bord analytique",
    en: "Analytics Dashboard",
  },
  "admin.analytics.subtitle": {
    fr: "Vue d'ensemble de l'activité et des performances de la plateforme",
    en: "Overview of platform activity and performance",
  },
  "admin.activity.title": {
    fr: "Journal d'activité",
    en: "Activity Log",
  },
  "admin.activity.subtitle": {
    fr: "Suivez toutes les actions des utilisateurs sur la plateforme",
    en: "Track all user actions on the platform",
  },
  "nav.logout": { fr: "Déconnexion", en: "Logout" },
  "nav.subtitle.default": {
    fr: "Plateforme de tutorat",
    en: "Tutoring Platform",
  },

  // ============= DASHBOARD =============
  "dash.welcome": { fr: "Bienvenue,", en: "Welcome," },
  "dash.subtitle": {
    fr: "Votre espace de tutorat personnalisé",
    en: "Your personalized tutoring space",
  },
  "dash.enrolledCourses": { fr: "Cours Inscrits", en: "Enrolled Courses" },
  "dash.studyGuides": { fr: "Guides d'Étude", en: "Study Guides" },
  "dash.exercises": { fr: "Exercices", en: "Exercises" },
  "dash.flashcards": { fr: "Flashcards", en: "Flashcards" },
  "dash.chatSessions": { fr: "Conversations IA", en: "AI Chats" },
  "dash.studyPlans": { fr: "Plans d'Étude", en: "Study Plans" },
  "dash.quickActions": { fr: "Actions Rapides", en: "Quick Actions" },
  "dash.askQuestion": { fr: "Poser une Question", en: "Ask a Question" },
  "dash.askQuestion.desc": {
    fr: "Discutez avec le tuteur IA",
    en: "Chat with the AI tutor",
  },
  "dash.practice": { fr: "S'entraîner", en: "Practice" },
  "dash.practice.desc": {
    fr: "Générer des exercices",
    en: "Generate exercises",
  },
  "dash.review": { fr: "Réviser", en: "Review" },
  "dash.review.desc": {
    fr: "Flashcards de révision",
    en: "Review flashcards",
  },
  "dash.myProgress": { fr: "Mon Progrès", en: "My Progress" },
  "dash.totalXp": { fr: "XP Total", en: "Total XP" },
  "dash.bestStreak": { fr: "Meilleure Série", en: "Best Streak" },
  "dash.successRate": { fr: "Taux de Réussite", en: "Success Rate" },
  "dash.badges": { fr: "Badges", en: "Badges" },
  "dash.myCourses": { fr: "Mes Cours", en: "My Courses" },
  "dash.semester": { fr: "Semestre", en: "Semester" },

  // ============= COURSES =============
  "courses.title": { fr: "Mes Cours", en: "My Courses" },
  "courses.enroll": { fr: "S'inscrire", en: "Enroll" },
  "courses.enrolled": { fr: "Inscrit", en: "Enrolled" },
  "courses.hours": { fr: "h", en: "h" },
  "courses.semester": { fr: "Semestre", en: "Semester" },
  "courses.students": { fr: "étudiants", en: "students" },

  // ============= STUDY GUIDES =============
  "guides.title": { fr: "Guides d'Étude", en: "Study Guides" },
  "guides.subtitle": {
    fr: "Résumés simplifiés de vos cours, générés par IA",
    en: "AI-generated simplified summaries of your courses",
  },
  "guides.course": { fr: "Cours", en: "Course" },
  "guides.selectCourse": {
    fr: "Choisir un cours...",
    en: "Choose a course...",
  },
  "guides.newGuide": {
    fr: "Générer un Nouveau Guide",
    en: "Generate a New Guide",
  },
  "guides.chapter": {
    fr: "Chapitre (optionnel)",
    en: "Chapter (optional)",
  },
  "guides.chapter.placeholder": {
    fr: "Ex: Nombres complexes",
    en: "e.g. Complex numbers",
  },
  "guides.generate": { fr: "Générer", en: "Generate" },
  "guides.generating": {
    fr: "Génération...",
    en: "Generating...",
  },
  "guides.myGuides": { fr: "Mes Guides", en: "My Guides" },
  "guides.previous": { fr: "Guides précédents", en: "Previous guides" },
  "guides.noPrevious": {
    fr: "Aucun guide créé",
    en: "No guides created",
  },
  "guides.markRead": { fr: "Guide lu et compris", en: "Guide read and understood" },
  "guides.markUnread": { fr: "Marquer comme lu", en: "Mark as read" },
  "guides.selectOrGenerate": {
    fr: "Sélectionnez un guide ou générez-en un nouveau",
    en: "Select a guide or generate a new one",
  },

  // ============= EXERCISES =============
  "exercises.title": { fr: "Exercices Pratiques", en: "Practice Exercises" },
  "exercises.subtitle": {
    fr: "Exercices avec solutions détaillées, générés par IA",
    en: "AI-generated exercises with detailed solutions",
  },
  "exercises.newExercises": {
    fr: "Générer des Exercices",
    en: "Generate Exercises",
  },
  "exercises.course": { fr: "Cours", en: "Course" },
  "exercises.selectCourse": { fr: "Choisir...", en: "Choose..." },
  "exercises.topic": { fr: "Sujet", en: "Topic" },
  "exercises.topic.placeholder": {
    fr: "Ex: Matrices",
    en: "e.g. Matrices",
  },
  "exercises.difficulty": { fr: "Difficulté", en: "Difficulty" },
  "exercises.easy": { fr: "Facile", en: "Easy" },
  "exercises.medium": { fr: "Moyen", en: "Medium" },
  "exercises.hard": { fr: "Difficile", en: "Hard" },
  "exercises.count": { fr: "Nombre", en: "Count" },
  "exercises.countUnit": { fr: "exercices", en: "exercises" },
  "exercises.generate": {
    fr: "Générer",
    en: "Generate",
  },
  "exercises.generating": { fr: "Génération...", en: "Generating..." },
  "exercises.myExercises": { fr: "Mes Exercices", en: "My Exercises" },
  "exercises.previous": { fr: "Exercices précédents", en: "Previous exercises" },
  "exercises.noPrevious": {
    fr: "Aucun exercice. Générez-en pour commencer !",
    en: "No exercises yet. Generate some to start!",
  },
  "exercises.selectOrGenerate": {
    fr: "Sélectionnez ou générez des exercices",
    en: "Select or generate exercises",
  },
  "exercises.question": { fr: "Question", en: "Question" },
  "exercises.solution": { fr: "Solution", en: "Solution" },
  "exercises.showSolution": {
    fr: "Voir la solution",
    en: "Show solution",
  },
  "exercises.hideSolution": {
    fr: "Masquer la solution",
    en: "Hide solution",
  },
  "exercises.score": { fr: "Score :", en: "Score:" },
  "exercises.scoreRecorded": { fr: "Score enregistré", en: "Score recorded" },
  "exercises.xpEarned": { fr: "XP gagné !", en: "XP earned!" },
  "exercises.overallMastery": { fr: "Maîtrise globale:", en: "Overall mastery:" },
  "exercises.adaptedDifficulty": { fr: "Difficulté adaptée:", en: "Adapted difficulty:" },
  "exercises.selfEval": {
    fr: "Comment avez-vous réussi ? (Auto-évaluation)",
    en: "How did you do? (Self-assessment)",
  },
  "exercises.notUnderstood": { fr: "Pas compris", en: "Not understood" },
  "exercises.difficult": { fr: "Difficile", en: "Difficult" },
  "exercises.average": { fr: "Moyen", en: "Average" },
  "exercises.good": { fr: "Bien", en: "Good" },
  "exercises.perfect": { fr: "Parfait !", en: "Perfect!" },
  "exercises.saving": { fr: "Enregistrement...", en: "Saving..." },
  "exercises.saveScore": { fr: "Enregistrer", en: "Save" },

  // ============= FLASHCARDS =============
  "flash.title": { fr: "Flashcards de Révision", en: "Review Flashcards" },
  "flash.subtitle": {
    fr: "Cartes de révision pour mémoriser les concepts clés",
    en: "Review cards to memorize key concepts",
  },
  "flash.newDeck": { fr: "Créer un Nouveau Deck", en: "Create a New Deck" },
  "flash.course": { fr: "Cours", en: "Course" },
  "flash.selectCourse": { fr: "Choisir un cours...", en: "Choose a course..." },
  "flash.topic": { fr: "Sujet (optionnel)", en: "Topic (optional)" },
  "flash.topic.placeholder": {
    fr: "Ex: Algèbre de Boole",
    en: "e.g. Boolean Algebra",
  },
  "flash.generate": { fr: "Créer les Flashcards", en: "Create Flashcards" },
  "flash.generating": { fr: "Génération...", en: "Generating..." },
  "flash.myDecks": { fr: "Mes Decks", en: "My Decks" },
  "flash.previous": { fr: "Decks précédents", en: "Previous decks" },
  "flash.noPrevious": {
    fr: "Aucun deck. Créez-en un pour réviser !",
    en: "No decks yet. Create one to review!",
  },
  "flash.selectOrCreate": {
    fr: "Sélectionnez un deck ou créez-en un nouveau",
    en: "Select a deck or create a new one",
  },
  "flash.cardOf": { fr: "Carte", en: "Card" },
  "flash.of": { fr: "sur", en: "of" },
  "flash.restart": { fr: "Recommencer", en: "Restart" },
  "flash.question": { fr: "Question", en: "Question" },
  "flash.answer": { fr: "Réponse", en: "Answer" },
  "flash.clickToFlip": {
    fr: "Cliquez pour retourner",
    en: "Click to flip",
  },
  "flash.deckComplete": {
    fr: "Deck terminé ! Comment vous sentez-vous ?",
    en: "Deck complete! How do you feel?",
  },
  "flash.rateConfidence": {
    fr: "Évaluez votre niveau de confiance sur ce deck",
    en: "Rate your confidence level on this deck",
  },
  "flash.veryUnclear": { fr: "Très flou", en: "Very unclear" },
  "flash.difficult": { fr: "Difficile", en: "Difficult" },
  "flash.average": { fr: "Moyen", en: "Average" },
  "flash.good": { fr: "Bien", en: "Good" },
  "flash.mastered": { fr: "Maîtrisé", en: "Mastered" },
  "flash.deckReviewed": { fr: "Deck révisé", en: "Deck reviewed" },
  "flash.confidence": { fr: "Confiance:", en: "Confidence:" },
  "flash.reviewAgain": { fr: "Réviser à nouveau", en: "Review again" },
  "flash.reviewed": { fr: "Révisé", en: "Reviewed" },
  "flash.cards": { fr: "cartes", en: "cards" },

  // ============= CHAT =============
  "chat.title": { fr: "Tuteur IA", en: "AI Tutor" },
  "chat.subtitle": {
    fr: "Posez vos questions, le tuteur vous explique avec patience",
    en: "Ask your questions, the tutor explains patiently",
  },
  "chat.newConversation": {
    fr: "Nouvelle conversation",
    en: "New conversation",
  },
  "chat.selectCourse": {
    fr: "Choisir un cours...",
    en: "Choose a course...",
  },
  "chat.inputPlaceholder": {
    fr: "Posez votre question...",
    en: "Ask your question...",
  },
  "chat.inputDisabled": {
    fr: "Choisissez d'abord un cours...",
    en: "Choose a course first...",
  },
  "chat.send": { fr: "Envoyer", en: "Send" },
  "chat.welcomeTitle": {
    fr: "Bonjour ! Je suis votre tuteur IA 🎓",
    en: "Hello! I'm your AI tutor 🎓",
  },
  "chat.welcomeDesc": {
    fr: "Choisissez un cours et posez-moi vos questions. Je vous expliquerai les concepts avec patience et des exemples concrets.",
    en: "Choose a course and ask me your questions. I'll explain concepts with patience and concrete examples.",
  },
  "chat.thinking": { fr: "Je réfléchis...", en: "Thinking..." },
  "chat.errorMessage": {
    fr: "Désolé, une erreur est survenue. Veuillez réessayer.",
    en: "Sorry, an error occurred. Please try again.",
  },
  "chat.previous": { fr: "Conversations", en: "Conversations" },
  "chat.noPrevious": {
    fr: "Aucune conversation. Commencez à discuter !",
    en: "No conversations yet. Start chatting!",
  },
  "chat.context.exercise": {
    fr: "Discussion sur un exercice",
    en: "Discussing an exercise",
  },
  "chat.context.flashcard": {
    fr: "Discussion sur des flashcards",
    en: "Discussing flashcards",
  },
  "chat.context.studyGuide": {
    fr: "Discussion sur un guide d'étude",
    en: "Discussing a study guide",
  },
  "chat.context.studyPlan": {
    fr: "Discussion sur un plan d'étude",
    en: "Discussing a study plan",
  },
  "discuss.withAI": {
    fr: "Discuter avec l'IA",
    en: "Discuss with AI",
  },

  // ============= PLANNER =============
  "planner.title": { fr: "Plan d'Étude", en: "Study Planner" },
  "planner.subtitle": {
    fr: "Programme de révision personnalisé par IA",
    en: "AI-personalized study schedule",
  },
  "planner.newPlan": {
    fr: "Créer un Plan de Révision",
    en: "Create a Study Plan",
  },
  "planner.course": { fr: "Cours", en: "Course" },
  "planner.selectCourse": { fr: "Choisir...", en: "Choose..." },
  "planner.startDate": { fr: "Date début", en: "Start date" },
  "planner.endDate": { fr: "Date fin (examen)", en: "End date (exam)" },
  "planner.hoursPerDay": { fr: "Heures/jour", en: "Hours/day" },
  "planner.generate": { fr: "Créer le Plan", en: "Create Plan" },
  "planner.generating": { fr: "Création...", en: "Creating..." },
  "planner.myPlans": { fr: "Mes Plans", en: "My Plans" },
  "planner.previous": { fr: "Plans existants", en: "Existing plans" },
  "planner.noPrevious": {
    fr: "Aucun plan. Créez-en un pour organiser vos révisions !",
    en: "No plans yet. Create one to organize your study!",
  },
  "planner.selectOrCreate": {
    fr: "Sélectionnez un plan ou créez-en un nouveau",
    en: "Select a plan or create a new one",
  },
  "planner.to": { fr: "au", en: "to" },
  "planner.completed": { fr: "complété", en: "completed" },
  "planner.planComplete": { fr: "Plan terminé !", en: "Plan completed!" },
  "planner.congratulations": {
    fr: "Félicitations ! Vous avez complété toutes les tâches de ce plan.",
    en: "Congratulations! You've completed all tasks in this plan.",
  },
  "planner.tasks": { fr: "tâches", en: "tasks" },
  "planner.allDone": {
    fr: "Toutes les tâches sont terminées !",
    en: "All tasks completed!",
  },

  // ============= PROGRESS =============
  "progress.title": { fr: "Mon Progrès", en: "My Progress" },
  "progress.subtitle": {
    fr: "Suivez votre progression et vos accomplissements",
    en: "Track your progress and achievements",
  },
  "progress.loading": {
    fr: "Chargement de vos progrès...",
    en: "Loading your progress...",
  },
  "progress.loadError": {
    fr: "Erreur lors du chargement des progrès.",
    en: "Error loading progress.",
  },
  "progress.overview": { fr: "Vue d'ensemble", en: "Overview" },
  "progress.mastery": { fr: "Maîtrise", en: "Mastery" },
  "progress.xp": { fr: "XP", en: "XP" },
  "progress.streak": { fr: "Série", en: "Streak" },
  "progress.consecutiveDays": { fr: "jours consécutifs", en: "consecutive days" },
  "progress.successRate": { fr: "Réussite", en: "Success" },
  "progress.mastered": { fr: "Maîtrisés", en: "Mastered" },
  "progress.achievements": { fr: "Réalisations", en: "Achievements" },
  "progress.courseProgress": {
    fr: "Progrès par cours",
    en: "Progress by course",
  },
  "progress.courseMastery": {
    fr: "Maîtrise par Cours",
    en: "Mastery by Course",
  },
  "progress.topicMastery": {
    fr: "Maîtrise par sujet",
    en: "Mastery by topic",
  },
  "progress.topicDetail": {
    fr: "Détail par Sujet",
    en: "Detail by Topic",
  },
  "progress.noData": {
    fr: "Commencez à étudier pour voir vos progrès !",
    en: "Start studying to see your progress!",
  },
  "progress.noDataSub": {
    fr: "Générez des exercices, flashcards ou guides d'étude",
    en: "Generate exercises, flashcards or study guides",
  },
  "progress.noTopics": {
    fr: "Aucun sujet pratiqué pour ce cours",
    en: "No topics practiced for this course",
  },
  "progress.level": { fr: "Niveau", en: "Level" },
  "progress.xpToward": { fr: "XP vers niveau", en: "XP toward level" },
  "progress.practiced": { fr: "pratiqué", en: "practiced" },
  "progress.times": { fr: "fois", en: "times" },
  "progress.ofTopics": { fr: "sur", en: "of" },
  "progress.topicsStudied": { fr: "sujets étudiés", en: "topics studied" },
  "progress.badges": { fr: "Badges", en: "Badges" },
  "progress.noBadges": {
    fr: "Pas encore de badges. Continuez à étudier !",
    en: "No badges yet. Keep studying!",
  },
  "progress.badgesToUnlock": {
    fr: "Badges à Débloquer",
    en: "Badges to Unlock",
  },
  "progress.excellent": {
    fr: "Excellent travail ! Vous êtes sur la bonne voie !",
    en: "Excellent work! You're on the right track!",
  },
  "progress.goodProgress": {
    fr: "Bon progrès ! Continuez comme ça !",
    en: "Good progress! Keep it up!",
  },
  "progress.progressing": {
    fr: "Vous progressez ! Concentrez-vous sur vos points faibles.",
    en: "You're progressing! Focus on your weak points.",
  },
  "progress.keepGoing": {
    fr: "Chaque effort compte ! N'abandonnez pas.",
    en: "Every effort counts! Don't give up.",
  },
  "progress.masteredCount": {
    fr: "Vous avez maîtrisé",
    en: "You have mastered",
  },
  "progress.topicSingular": { fr: "sujet", en: "topic" },
  "progress.topicPlural": { fr: "sujets", en: "topics" },
  "progress.bestStreak": {
    fr: "Votre meilleure série est de",
    en: "Your best streak is",
  },
  "progress.daySingular": { fr: "jour", en: "day" },
  "progress.dayPlural": { fr: "jours", en: "days" },
  "progress.startStreak": {
    fr: "Commencez votre série en étudiant chaque jour !",
    en: "Start your streak by studying every day!",
  },
  // ---- Progress: badge descriptions ----
  "badge.firstStep": { fr: "Premier Pas", en: "First Step" },
  "badge.firstStep.desc": { fr: "Compléter 1 exercice", en: "Complete 1 exercise" },
  "badge.inShape": { fr: "En Forme", en: "In Shape" },
  "badge.inShape.desc": { fr: "Compléter 5 exercices", en: "Complete 5 exercises" },
  "badge.perfectScore": { fr: "Score Parfait", en: "Perfect Score" },
  "badge.perfectScore.desc": { fr: "100% à un exercice", en: "100% on an exercise" },
  "badge.regular": { fr: "Régulier", en: "Regular" },
  "badge.regular.desc": { fr: "3 jours de série", en: "3-day streak" },
  "badge.determined": { fr: "Déterminé", en: "Determined" },
  "badge.determined.desc": { fr: "7 jours de série", en: "7-day streak" },
  "badge.expert": { fr: "Expert", en: "Expert" },
  "badge.expert.desc": { fr: "80% de maîtrise", en: "80% mastery" },
  // ---- Progress: mastery labels ----
  "mastery.excellent": { fr: "Excellent", en: "Excellent" },
  "mastery.good": { fr: "Bon", en: "Good" },
  "mastery.average": { fr: "Moyen", en: "Average" },
  "mastery.beginner": { fr: "Débutant", en: "Beginner" },
  "mastery.discover": { fr: "À découvrir", en: "To discover" },

  // ============= CREDITS & QUOTAS =============
  "credits.title": { fr: "Mes Crédits", en: "My Credits" },
  "credits.subtitle": {
    fr: "Gérez votre quota gratuit et vos crédits",
    en: "Manage your free quota and credits",
  },
  "credits.balance": { fr: "Solde", en: "Balance" },
  "credits.unit": { fr: "crédits", en: "credits" },
  "credits.dailyFree": { fr: "Quota gratuit du jour", en: "Today's free quota" },
  "credits.generations": { fr: "Générations IA", en: "AI Generations" },
  "credits.chatMessages": { fr: "Messages chat", en: "Chat messages" },
  "credits.genDesc": {
    fr: "Exercices, guides, flashcards, plans d'étude",
    en: "Exercises, guides, flashcards, study plans",
  },
  "credits.chatDesc": {
    fr: "Messages envoyés au tuteur IA",
    en: "Messages sent to the AI tutor",
  },
  "credits.resetInfo": {
    fr: "Le quota gratuit se réinitialise chaque jour à minuit UTC. Au-delà, les crédits sont utilisés.",
    en: "The free quota resets every day at midnight UTC. Beyond that, credits are used.",
  },
  "credits.tab.costs": { fr: "Coûts", en: "Costs" },
  "credits.tab.packs": { fr: "Acheter", en: "Buy" },
  "credits.tab.history": { fr: "Historique", en: "History" },
  "credits.costsTitle": {
    fr: "Coût en crédits par action",
    en: "Credit cost per action",
  },
  "credits.costsNote": {
    fr: "Les crédits ne sont utilisés qu'après épuisement du quota gratuit quotidien.",
    en: "Credits are only used after the daily free quota is exhausted.",
  },
  "credits.action.exercise": { fr: "Exercice", en: "Exercise" },
  "credits.action.study_guide": { fr: "Guide d'étude", en: "Study guide" },
  "credits.action.flashcards": { fr: "Flashcards", en: "Flashcards" },
  "credits.action.chat": { fr: "Message chat", en: "Chat message" },
  "credits.action.study_plan": { fr: "Plan d'étude", en: "Study plan" },
  "credits.popular": { fr: "Populaire", en: "Popular" },
  "credits.perCredit": { fr: "crédit", en: "credit" },
  "credits.buy": { fr: "Acheter", en: "Buy" },
  "credits.noPacks": {
    fr: "Aucun pack disponible pour le moment",
    en: "No packs available at the moment",
  },
  "credits.noHistory": {
    fr: "Aucune transaction",
    en: "No transactions yet",
  },
  "credits.balanceAfter": { fr: "Solde après", en: "Balance after" },
  "credits.quotaExceeded": {
    fr: "Quota épuisé ! Achetez des crédits pour continuer.",
    en: "Quota exhausted! Buy credits to continue.",
  },
  "credits.insufficientCredits": {
    fr: "Crédits insuffisants",
    en: "Insufficient credits",
  },
  "credits.needed": { fr: "nécessaires", en: "needed" },
  "credits.buyCredits": { fr: "Acheter des crédits", en: "Buy credits" },

  // ============= SUBSCRIPTIONS =============
  "credits.subscriber": { fr: "Abonné Premium", en: "Premium Subscriber" },
  "credits.tab.subscription": { fr: "Abonnement", en: "Subscription" },
  "credits.sub.active": { fr: "Abonnement actif", en: "Active Subscription" },
  "credits.sub.monthly": { fr: "Mensuel", en: "Monthly" },
  "credits.sub.annual": { fr: "Annuel", en: "Annual" },
  "credits.sub.month": { fr: "mois", en: "month" },
  "credits.sub.year": { fr: "an", en: "year" },
  "credits.sub.expiresOn": { fr: "Expire le", en: "Expires on" },
  "credits.sub.daysLeft": { fr: "Jours restants", en: "Days remaining" },
  "credits.sub.unlimitedAccess": {
    fr: "Accès illimité à toutes les fonctionnalités IA",
    en: "Unlimited access to all AI features",
  },
  "credits.sub.title": {
    fr: "Passez à l'illimité",
    en: "Go Unlimited",
  },
  "credits.sub.desc": {
    fr: "Abonnez-vous pour un accès illimité à toutes les fonctionnalités IA, sans quotas ni crédits.",
    en: "Subscribe for unlimited access to all AI features, no quotas or credits needed.",
  },
  "credits.sub.subscribe": { fr: "S'abonner", en: "Subscribe" },
  "credits.sub.bestValue": { fr: "Meilleur rapport", en: "Best value" },
  "credits.sub.save33": {
    fr: "Économisez 33% vs mensuel",
    en: "Save 33% vs monthly",
  },
  "credits.sub.feat.unlimited": {
    fr: "Générations IA illimitées",
    en: "Unlimited AI generations",
  },
  "credits.sub.feat.allFeatures": {
    fr: "Chat, exercices, flashcards, guides, plans",
    en: "Chat, exercises, flashcards, guides, plans",
  },
  "credits.sub.feat.noLimits": {
    fr: "Aucun quota quotidien",
    en: "No daily quotas",
  },
  "credits.sub.feat.bestPrice": {
    fr: "Meilleur prix par mois",
    en: "Best price per month",
  },
  "credits.sub.upsell": {
    fr: "Passez Premium !",
    en: "Go Premium!",
  },
  "credits.sub.upsellDesc": {
    fr: "Abonnez-vous pour un accès illimité — plus jamais de quotas épuisés.",
    en: "Subscribe for unlimited access — never run out of quotas again.",
  },
  "credits.sub.seeSubscriptions": {
    fr: "Voir les abonnements",
    en: "See subscriptions",
  },
  "credits.sub.contactInfo": {
    fr: "Pour souscrire, contactez l'administration de votre école.",
    en: "To subscribe, contact your school's administration.",
  },
  "credits.bonusCredits": { fr: "Crédits bonus", en: "Bonus credits" },

  // ============= ADMIN CREDIT PACKS =============
  "admin.creditPacks.title": { fr: "Packs de Crédits", en: "Credit Packs" },
  "admin.creditPacks.subtitle": {
    fr: "Gérez les packs de crédits disponibles à l'achat",
    en: "Manage credit packs available for purchase",
  },
  "admin.creditPacks.add": { fr: "Nouveau pack", en: "New pack" },
  "admin.creditPacks.edit": { fr: "Modifier le pack", en: "Edit pack" },
  "admin.creditPacks.name": { fr: "Nom", en: "Name" },
  "admin.creditPacks.credits": { fr: "Crédits", en: "Credits" },
  "admin.creditPacks.price": { fr: "Prix", en: "Price" },
  "admin.creditPacks.priceFCFA": { fr: "Prix (FCFA)", en: "Price (FCFA)" },
  "admin.creditPacks.perCredit": { fr: "Par crédit", en: "Per credit" },
  "admin.creditPacks.status": { fr: "Statut", en: "Status" },
  "admin.creditPacks.sortOrder": { fr: "Ordre", en: "Order" },
  "admin.creditPacks.empty": {
    fr: "Aucun pack de crédits. Créez-en un pour commencer.",
    en: "No credit packs. Create one to get started.",
  },
  "admin.creditPacks.costsTitle": {
    fr: "Coûts par action (pour les étudiants)",
    en: "Costs per action (for students)",
  },
  "admin.creditPacks.freeTierInfo": {
    fr: "Tier gratuit : 5 générations IA + 15 messages chat par jour. Au-delà, les crédits sont consommés.",
    en: "Free tier: 5 AI generations + 15 chat messages per day. Beyond that, credits are consumed.",
  },

  // ============= API / REGISTER ERRORS =============
  "api.register.required": {
    fr: "Nom, email et mot de passe sont obligatoires",
    en: "Name, email and password are required",
  },
  "api.register.passwordShort": {
    fr: "Le mot de passe doit contenir au moins 6 caractères",
    en: "Password must be at least 6 characters",
  },
  "api.register.selectSchool": {
    fr: "Veuillez sélectionner votre école, département et classe",
    en: "Please select your school, department and class",
  },
  "api.register.classNotFound": {
    fr: "Classe non trouvée",
    en: "Class not found",
  },
  "api.register.inconsistent": {
    fr: "Sélection incohérente",
    en: "Inconsistent selection",
  },
  "api.register.emailExists": {
    fr: "Un compte avec cet email existe déjà",
    en: "An account with this email already exists",
  },
  "api.register.success": {
    fr: "Compte créé avec succès",
    en: "Account created successfully",
  },
  "api.register.error": {
    fr: "Erreur lors de la création du compte",
    en: "Error creating account",
  },

  // ============= COURSE CATEGORIES =============
  "cat.math": { fr: "Mathématiques", en: "Mathematics" },
  "cat.cs": { fr: "Informatique", en: "Computer Science" },
  "cat.electronics": { fr: "Électronique", en: "Electronics" },
  "cat.language": { fr: "Langues", en: "Languages" },
  "cat.business": { fr: "Gestion", en: "Business" },
  "cat.law": { fr: "Droit", en: "Law" },
  "cat.science": { fr: "Sciences", en: "Sciences" },
} as const;

export type TranslationKey = keyof typeof translations;

/**
 * Translate a key to the given language.
 * Falls back to French if the key or language is not found.
 */
export function t(key: TranslationKey, lang: Language = "fr"): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.fr;
}

/**
 * Get all navigation items translated for the given language.
 */
export function getNavigation(lang: Language) {
  return [
    { name: t("nav.dashboard", lang), href: "/dashboard" },
    { name: t("nav.courses", lang), href: "/courses" },
    { name: t("nav.progress", lang), href: "/progress" },
    { name: t("nav.studyGuides", lang), href: "/study-guides" },
    { name: t("nav.exercises", lang), href: "/exercises" },
    { name: t("nav.flashcards", lang), href: "/flashcards" },
    { name: t("nav.chat", lang), href: "/chat" },
    { name: t("nav.planner", lang), href: "/planner" },
  ];
}

export function getAdminNavigation(lang: Language) {
  return [
    { name: t("nav.admin.schools", lang), href: "/admin/schools" },
    { name: t("nav.admin.departments", lang), href: "/admin/departments" },
    { name: t("nav.admin.classes", lang), href: "/admin/classes" },
    { name: t("nav.admin.courses", lang), href: "/admin/courses" },
    { name: t("nav.admin.users", lang), href: "/admin/users" },
    { name: t("nav.admin.activity", lang), href: "/admin/activity" },
    { name: t("nav.admin.analytics", lang), href: "/admin/analytics" },
    { name: t("nav.admin.settings", lang), href: "/admin/settings" },
  ];
}
