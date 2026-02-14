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
  Globe,
} from "lucide-react";
import { Language, t } from "@/lib/i18n";

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
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<Language>("fr");

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

  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then((d) => setSchools(d.schools || []))
      .finally(() => setLoadingSchools(false));
  }, []);

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
      setError(t("register.error.passwordMismatch", lang));
      return;
    }

    if (password.length < 6) {
      setError(t("register.error.passwordShort", lang));
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
          language: lang,
          schoolId: selectedSchool,
          departmentId: selectedDepartment,
          classId: selectedClass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("register.error.generic", lang));
        return;
      }

      const { signIn } = await import("next-auth/react");
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t("error.generic", lang));
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
        {/* Language toggle - top right */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => setLang("fr")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === "fr"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              🇫🇷 FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === "en"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t("app.name", lang)}</h1>
          <p className="text-blue-200 mt-2">
            {t("app.tagline", lang)}
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
            {t("register.step1.title", lang)}
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
            {t("register.step2.title", lang)}
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
                {t("register.findSchool", lang)}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {t("register.findSchool.desc", lang)}
              </p>

              <div className="space-y-4">
                {/* School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <School className="w-4 h-4 inline mr-1" />
                    {t("register.school", lang)}
                  </label>
                  {loadingSchools ? (
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                      {t("register.school.loading", lang)}
                    </div>
                  ) : schools.length === 0 ? (
                    <div className="w-full px-4 py-3 border border-orange-200 bg-orange-50 rounded-lg text-orange-600 text-sm">
                      {t("register.school.none", lang)}
                    </div>
                  ) : (
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    >
                      <option value="">{t("register.school.placeholder", lang)}</option>
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
                      {t("register.department", lang)}
                    </label>
                    {loadingDepts ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        {t("loading", lang)}
                      </div>
                    ) : departments.length === 0 ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        {t("register.department.none", lang)}
                      </div>
                    ) : (
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      >
                        <option value="">{t("register.department.placeholder", lang)}</option>
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
                      {t("register.class", lang)}
                    </label>
                    {loadingClasses ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        {t("loading", lang)}
                      </div>
                    ) : classes.length === 0 ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-400 text-sm">
                        {t("register.class.none", lang)}
                      </div>
                    ) : (
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      >
                        <option value="">{t("register.class.placeholder", lang)}</option>
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
                      {t("register.selection", lang)}
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
                  {t("register.continue", lang)}
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
                    {t("register.createAccount", lang)}
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
                    {t("register.name", lang)}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("register.name.placeholder", lang)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("register.email", lang)}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("register.email.placeholder", lang)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("register.password", lang)}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("register.password.placeholder", lang)}
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
                    {t("register.confirmPassword", lang)}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("register.confirmPassword.placeholder", lang)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t("register.submitting", lang) : t("register.submit", lang)}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {t("register.hasAccount", lang)}{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {t("register.login", lang)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
