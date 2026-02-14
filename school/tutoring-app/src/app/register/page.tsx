"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Eye,
  EyeOff,
  School,
  Building2,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

interface SchoolItem {
  id: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
}

interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

interface ClassItem {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  description: string | null;
}

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: school select, 2: personal info

  // School selection state
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Personal info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load schools on mount
  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then((d) => setSchools(d.schools || []))
      .finally(() => setLoadingSchools(false));
  }, []);

  // Load departments when school changes
  useEffect(() => {
    if (!selectedSchool) {
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }
    setLoadingDepts(true);
    setSelectedDepartment("");
    setSelectedClass("");
    setClasses([]);
    fetch(`/api/schools/${selectedSchool}/departments`)
      .then((r) => r.json())
      .then((d) => setDepartments(d.departments || []))
      .finally(() => setLoadingDepts(false));
  }, [selectedSchool]);

  // Load classes when department changes
  useEffect(() => {
    if (!selectedDepartment) {
      setClasses([]);
      setSelectedClass("");
      return;
    }
    setLoadingClasses(true);
    setSelectedClass("");
    fetch(`/api/departments/${selectedDepartment}/classes`)
      .then((r) => r.json())
      .then((d) => setClasses(d.classes || []))
      .finally(() => setLoadingClasses(false));
  }, [selectedDepartment]);

  const canProceedToStep2 =
    selectedSchool && selectedDepartment && selectedClass;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          schoolId: selectedSchool,
          departmentId: selectedDepartment,
          classId: selectedClass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      // Auto-login after registration
      const { signIn } = await import("next-auth/react");
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const selectedSchoolObj = schools.find((s) => s.id === selectedSchool);
  const selectedDeptObj = departments.find((d) => d.id === selectedDepartment);
  const selectedClassObj = classes.find((c) => c.id === selectedClass);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">LionLearn</h1>
          <p className="text-blue-200 mt-2">
            Plateforme de tutorat intelligent
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              step === 1
                ? "bg-white text-blue-600"
                : "bg-blue-500 text-white"
            }`}
          >
            {step > 1 ? <Check className="w-4 h-4" /> : <School className="w-4 h-4" />}
            Mon École
          </div>
          <ChevronRight className="w-4 h-4 text-blue-300" />
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              step === 2
                ? "bg-white text-blue-600"
                : "bg-blue-900/30 text-blue-200"
            }`}
          >
            <Users className="w-4 h-4" />
            Mon Compte
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Trouvez votre école
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Sélectionnez votre établissement, département et classe
              </p>

              <div className="space-y-4">
                {/* School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <School className="w-4 h-4 inline mr-1" />
                    École / Université
                  </label>
                  {loadingSchools ? (
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                      Chargement des écoles...
                    </div>
                  ) : schools.length === 0 ? (
                    <div className="w-full px-4 py-3 border border-orange-200 bg-orange-50 rounded-lg text-orange-600 text-sm">
                      Aucune école disponible. Contactez l&apos;administrateur.
                    </div>
                  ) : (
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    >
                      <option value="">Choisir une école...</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shortName} — {s.city}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Department */}
                {selectedSchool && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      Département / Filière
                    </label>
                    {loadingDepts ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        Chargement...
                      </div>
                    ) : departments.length === 0 ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        Aucun département pour cette école
                      </div>
                    ) : (
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      >
                        <option value="">Choisir un département...</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.code} — {d.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Class */}
                {selectedDepartment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Users className="w-4 h-4 inline mr-1" />
                      Classe / Niveau
                    </label>
                    {loadingClasses ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        Chargement...
                      </div>
                    ) : classes.length === 0 ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        Aucune classe pour ce département
                      </div>
                    ) : (
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      >
                        <option value="">Choisir une classe...</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.academicYear})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Selection summary */}
                {canProceedToStep2 && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      Votre sélection :
                    </p>
                    <p className="text-sm text-blue-800">
                      {selectedSchoolObj?.shortName} →{" "}
                      {selectedDeptObj?.code} →{" "}
                      {selectedClassObj?.name} ({selectedClassObj?.academicYear})
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setError("");
                    setStep(2);
                  }}
                  disabled={!canProceedToStep2}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continuer
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Créer votre compte
                  </h2>
                  <p className="text-xs text-gray-400">
                    {selectedSchoolObj?.shortName} · {selectedDeptObj?.code} ·{" "}
                    {selectedClassObj?.name}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom et prénom"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Au moins 6 caractères"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Inscription en cours..." : "S'inscrire"}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Déjà inscrit ?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
