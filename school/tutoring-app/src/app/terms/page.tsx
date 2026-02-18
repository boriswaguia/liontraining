"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Globe } from "lucide-react";

type Lang = "fr" | "en";

const content = {
  fr: {
    title: "Conditions d'Utilisation & Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour : 18 février 2026",
    backHome: "Retour à l'accueil",
    toc: "Table des matières",
    sections: [
      {
        id: "tos",
        title: "1. Conditions Générales d'Utilisation",
        content: `En accédant et en utilisant la plateforme LionLearn (ci-après « la Plateforme »), vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la Plateforme.

**1.1. Description du service**
LionLearn est une plateforme de tutorat intelligent propulsée par l'intelligence artificielle, destinée aux étudiants universitaires. Elle propose des exercices personnalisés, des flashcards, des guides d'étude, des plans de révision et un tuteur IA conversationnel.

**1.2. Inscription et compte**
- Vous devez fournir des informations exactes lors de l'inscription.
- Vous êtes responsable de la confidentialité de votre mot de passe.
- Un seul compte par personne est autorisé.
- L'administrateur se réserve le droit de désactiver tout compte en cas d'utilisation abusive.

**1.3. Utilisation acceptable**
Vous vous engagez à :
- Utiliser la Plateforme uniquement à des fins éducatives.
- Ne pas tenter de contourner les systèmes de quotas ou de crédits.
- Ne pas partager votre compte avec des tiers.
- Ne pas utiliser de moyens automatisés (bots, scripts) pour accéder à la Plateforme.

**1.4. Contenu généré par l'IA**
Le contenu généré par l'IA est fourni à titre d'aide à l'apprentissage. Il peut contenir des inexactitudes. LionLearn ne garantit pas l'exactitude, la complétude ou la fiabilité du contenu généré. Celui-ci ne remplace en aucun cas l'enseignement dispensé par vos professeurs.

**1.5. Crédits et abonnements**
- Les quotas gratuits quotidiens sont réinitialisés chaque jour.
- Les crédits achetés ne sont pas remboursables.
- Les abonnements sont activés par l'administration et ne sont pas renouvelés automatiquement.
- Les tarifs peuvent être modifiés avec un préavis raisonnable.

**1.6. Propriété intellectuelle**
- Les supports de cours mis à disposition restent la propriété de leurs auteurs et de l'établissement concerné.
- Le contenu généré par l'IA pour votre usage personnel peut être utilisé librement dans le cadre de vos études.
- Le code source, le design et la marque LionLearn sont protégés.`,
      },
      {
        id: "privacy",
        title: "2. Politique de Confidentialité",
        content: `La présente politique décrit comment LionLearn collecte, utilise et protège vos données personnelles, conformément à la loi n° 2010/012 du 21 décembre 2010 relative à la cybersécurité et à la cybercriminalité au Cameroun, et aux principes du Règlement Général sur la Protection des Données (RGPD).

**2.1. Données collectées**

| Donnée | Finalité | Base légale |
|--------|----------|-------------|
| Nom complet | Identification, personnalisation | Exécution du contrat |
| Adresse email | Authentification, communication | Exécution du contrat |
| Mot de passe (haché) | Sécurité du compte | Exécution du contrat |
| École, département, classe | Personnalisation du contenu | Exécution du contrat |
| Historique d'utilisation (exercices, quiz, chat) | Suivi de progression, recommandations IA | Intérêt légitime |
| Scores et progrès | Tableaux de bord, recommandations | Intérêt légitime |
| Données de connexion (IP, heure) | Sécurité, journalisation | Intérêt légitime |

**2.2. Utilisation des données**
Vos données sont utilisées pour :
- Fournir et personnaliser le service de tutorat.
- Générer des recommandations IA adaptées à votre niveau.
- Suivre votre progression académique.
- Gérer les quotas, crédits et abonnements.
- Améliorer la qualité du service.
- Communiquer avec vous concernant votre compte.

**2.3. Partage des données**
- **Google Gemini API** : Vos questions et le contexte des cours sont envoyés à l'API Google Gemini pour la génération de contenu. Google peut traiter ces données selon sa propre politique de confidentialité. Aucune donnée personnelle identifiable n'est volontairement incluse dans les requêtes à l'API.
- **Administrateurs de l'école** : Les administrateurs peuvent voir votre nom, email, progression et statistiques d'utilisation.
- **Aucune vente** : Vos données ne sont jamais vendues à des tiers.
- **Aucune publicité** : Vos données ne sont pas utilisées à des fins publicitaires.

**2.4. Conservation des données**
- Données de compte : conservées tant que le compte est actif.
- Historique d'activité : conservé pendant la durée de l'année académique en cours.
- Après suppression du compte : les données sont anonymisées ou supprimées dans un délai de 30 jours.

**2.5. Vos droits**
Vous disposez des droits suivants :
- **Accès** : demander une copie de vos données personnelles.
- **Rectification** : corriger des données inexactes.
- **Suppression** : demander la suppression de votre compte et données.
- **Portabilité** : obtenir vos données dans un format lisible.
- **Opposition** : vous opposer au traitement de vos données.

Pour exercer ces droits, contactez : **privacy@lionlearning.briskprototyping.com**

**2.6. Sécurité**
- Les mots de passe sont hachés avec bcrypt.
- Les communications sont chiffrées en HTTPS (TLS).
- L'accès aux données est limité aux administrateurs autorisés.
- Les journaux d'activité sont protégés et accessibles uniquement aux administrateurs.`,
      },
      {
        id: "cookies",
        title: "3. Politique de Cookies",
        content: `**3.1. Qu'est-ce qu'un cookie ?**
Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. Il permet au site de se souvenir de vos actions et préférences.

**3.2. Cookies utilisés par LionLearn**

| Cookie | Type | Durée | Finalité |
|--------|------|-------|----------|
| next-auth.session-token | Essentiel | Session (30 jours) | Maintenir votre connexion |
| next-auth.csrf-token | Essentiel | Session | Protection contre les attaques CSRF |
| next-auth.callback-url | Essentiel | Session | Redirection après connexion |
| lionlearn-cookie-consent | Fonctionnel | 1 an | Mémoriser votre choix de consentement cookies |
| lionlearn-lang | Fonctionnel | 1 an | Mémoriser votre préférence de langue |

**3.3. Cookies tiers**
LionLearn n'utilise **aucun cookie tiers** de tracking, publicité ou analytique (pas de Google Analytics, pas de Facebook Pixel, etc.).

**3.4. Gestion des cookies**
- **Cookies essentiels** : nécessaires au fonctionnement de la Plateforme, ils ne peuvent pas être désactivés.
- **Cookies fonctionnels** : vous pouvez les refuser via la bannière de consentement. Sans eux, certaines préférences ne seront pas mémorisées.
- Vous pouvez également gérer les cookies via les paramètres de votre navigateur.

**3.5. Consentement**
Lors de votre première visite, une bannière vous permet d'accepter ou de refuser les cookies non essentiels. Votre choix est enregistré pour 1 an.`,
      },
      {
        id: "contact",
        title: "4. Contact",
        content: `Pour toute question concernant ces conditions, votre vie privée ou l'utilisation de vos données :

- **Email** : privacy@lionlearning.briskprototyping.com
- **Plateforme** : https://lionlearning.briskprototyping.com

Ces conditions peuvent être mises à jour. En continuant à utiliser la Plateforme après une modification, vous acceptez les nouvelles conditions.`,
      },
    ],
  },
  en: {
    title: "Terms of Service & Privacy Policy",
    lastUpdated: "Last updated: February 18, 2026",
    backHome: "Back to home",
    toc: "Table of Contents",
    sections: [
      {
        id: "tos",
        title: "1. Terms of Service",
        content: `By accessing and using the LionLearn platform (hereinafter "the Platform"), you agree to be bound by these terms of use. If you do not agree to these terms, please do not use the Platform.

**1.1. Service Description**
LionLearn is an AI-powered intelligent tutoring platform designed for university students. It offers personalized exercises, flashcards, study guides, study plans, and a conversational AI tutor.

**1.2. Registration and Account**
- You must provide accurate information during registration.
- You are responsible for keeping your password confidential.
- Only one account per person is allowed.
- The administrator reserves the right to deactivate any account in case of misuse.

**1.3. Acceptable Use**
You agree to:
- Use the Platform exclusively for educational purposes.
- Not attempt to bypass quota or credit systems.
- Not share your account with third parties.
- Not use automated means (bots, scripts) to access the Platform.

**1.4. AI-Generated Content**
AI-generated content is provided as a learning aid. It may contain inaccuracies. LionLearn does not guarantee the accuracy, completeness, or reliability of generated content. It does not replace the teaching provided by your professors.

**1.5. Credits and Subscriptions**
- Free daily quotas reset each day.
- Purchased credits are non-refundable.
- Subscriptions are activated by administration and do not auto-renew.
- Prices may be changed with reasonable notice.

**1.6. Intellectual Property**
- Course materials provided remain the property of their authors and the respective institution.
- AI-generated content for your personal use may be freely used for your studies.
- The LionLearn source code, design, and brand are protected.`,
      },
      {
        id: "privacy",
        title: "2. Privacy Policy",
        content: `This policy describes how LionLearn collects, uses, and protects your personal data, in compliance with Cameroon's Law No. 2010/012 of December 21, 2010 on cybersecurity and cybercrime, and in alignment with the principles of the General Data Protection Regulation (GDPR).

**2.1. Data Collected**

| Data | Purpose | Legal Basis |
|------|---------|-------------|
| Full name | Identification, personalization | Contract performance |
| Email address | Authentication, communication | Contract performance |
| Password (hashed) | Account security | Contract performance |
| School, department, class | Content personalization | Contract performance |
| Usage history (exercises, quizzes, chat) | Progress tracking, AI recommendations | Legitimate interest |
| Scores and progress | Dashboards, recommendations | Legitimate interest |
| Connection data (IP, time) | Security, logging | Legitimate interest |

**2.2. Use of Data**
Your data is used to:
- Provide and personalize the tutoring service.
- Generate AI recommendations adapted to your level.
- Track your academic progress.
- Manage quotas, credits, and subscriptions.
- Improve service quality.
- Communicate with you regarding your account.

**2.3. Data Sharing**
- **Google Gemini API**: Your questions and course context are sent to the Google Gemini API for content generation. Google may process this data according to its own privacy policy. No personally identifiable information is intentionally included in API requests.
- **School administrators**: Administrators can see your name, email, progress, and usage statistics.
- **No selling**: Your data is never sold to third parties.
- **No advertising**: Your data is not used for advertising purposes.

**2.4. Data Retention**
- Account data: retained as long as the account is active.
- Activity history: retained for the duration of the current academic year.
- After account deletion: data is anonymized or deleted within 30 days.

**2.5. Your Rights**
You have the following rights:
- **Access**: request a copy of your personal data.
- **Rectification**: correct inaccurate data.
- **Deletion**: request deletion of your account and data.
- **Portability**: obtain your data in a readable format.
- **Objection**: object to the processing of your data.

To exercise these rights, contact: **privacy@lionlearning.briskprototyping.com**

**2.6. Security**
- Passwords are hashed with bcrypt.
- Communications are encrypted with HTTPS (TLS).
- Data access is limited to authorized administrators.
- Activity logs are protected and accessible only to administrators.`,
      },
      {
        id: "cookies",
        title: "3. Cookie Policy",
        content: `**3.1. What is a Cookie?**
A cookie is a small text file stored on your device when you visit a website. It allows the site to remember your actions and preferences.

**3.2. Cookies Used by LionLearn**

| Cookie | Type | Duration | Purpose |
|--------|------|----------|---------|
| next-auth.session-token | Essential | Session (30 days) | Maintain your login session |
| next-auth.csrf-token | Essential | Session | CSRF attack protection |
| next-auth.callback-url | Essential | Session | Post-login redirect |
| lionlearn-cookie-consent | Functional | 1 year | Remember your cookie consent choice |
| lionlearn-lang | Functional | 1 year | Remember your language preference |

**3.3. Third-Party Cookies**
LionLearn uses **no third-party** tracking, advertising, or analytics cookies (no Google Analytics, no Facebook Pixel, etc.).

**3.4. Cookie Management**
- **Essential cookies**: required for the Platform to function, they cannot be disabled.
- **Functional cookies**: you can refuse them via the consent banner. Without them, some preferences won't be remembered.
- You can also manage cookies through your browser settings.

**3.5. Consent**
On your first visit, a banner lets you accept or refuse non-essential cookies. Your choice is saved for 1 year.`,
      },
      {
        id: "contact",
        title: "4. Contact",
        content: `For any questions about these terms, your privacy, or the use of your data:

- **Email**: privacy@lionlearning.briskprototyping.com
- **Platform**: https://lionlearning.briskprototyping.com

These terms may be updated. By continuing to use the Platform after a change, you accept the new terms.`,
      },
    ],
  },
};

export default function TermsPage() {
  const [lang, setLang] = useState<Lang>("fr");
  const c = content[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{c.backHome}</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setLang("fr")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  lang === "fr" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  lang === "en" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LionLearn</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{c.title}</h2>
        <p className="text-sm text-gray-500 mb-8">{c.lastUpdated}</p>

        {/* Table of Contents */}
        <nav className="bg-white rounded-xl border p-4 mb-8">
          <h3 className="font-medium text-gray-700 mb-2">{c.toc}</h3>
          <ul className="space-y-1">
            {c.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-blue-600 hover:text-blue-800 text-sm hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <div className="space-y-10">
          {c.sections.map((section) => (
            <section key={section.id} id={section.id} className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h3>
              <div
                className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-800 prose-table:text-sm prose-td:py-2 prose-th:py-2"
                dangerouslySetInnerHTML={{
                  __html: section.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n\n/g, "</p><p>")
                    .replace(/\n- /g, "</p><ul><li>")
                    .replace(/\n/g, "<br>")
                    .replace(/<\/li><ul>/g, "</li>")
                    .replace(
                      /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g,
                      (_, header: string, body: string) => {
                        const ths = header.split("|").filter(Boolean).map((h: string) => `<th class="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase border-b">${h.trim()}</th>`).join("");
                        const rows = body.trim().split("\n").map((row: string) => {
                          const tds = row.split("|").filter(Boolean).map((cell: string) => `<td class="px-3 py-2 border-b border-gray-100">${cell.trim()}</td>`).join("");
                          return `<tr>${tds}</tr>`;
                        }).join("");
                        return `<table class="w-full border-collapse border rounded-lg overflow-hidden my-3"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
                      }
                    ),
                }}
              />
            </section>
          ))}
        </div>

        <div className="text-center mt-8 mb-16 text-sm text-gray-400">
          © {new Date().getFullYear()} LionLearn. All rights reserved.
        </div>
      </main>
    </div>
  );
}
