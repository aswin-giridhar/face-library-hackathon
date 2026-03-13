"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { registerTalent, uploadTalentImage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

const categories = [
  "Influencer",
  "Model",
  "Actor",
  "Sports Professional",
  "Celebrity",
  "Other",
];

const nationalities = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan",
  "Argentine", "Armenian", "Australian", "Austrian", "Azerbaijani",
  "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian",
  "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian",
  "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian",
  "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian",
  "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean",
  "Chinese", "Colombian", "Comorian", "Congolese", "Costa Rican",
  "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian",
  "Dominican", "Dutch", "East Timorese", "Ecuadorian", "Egyptian",
  "Emirati", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian",
  "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian",
  "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan",
  "Guinean", "Guyanese", "Haitian", "Honduran", "Hungarian",
  "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish",
  "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian",
  "Kazakh", "Kenyan", "Kiribati", "Korean", "Kosovar", "Kuwaiti",
  "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan",
  "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Malawian",
  "Malaysian", "Maldivian", "Malian", "Maltese", "Mauritanian",
  "Mauritian", "Mexican", "Moldovan", "Monacan", "Mongolian",
  "Montenegrin", "Moroccan", "Mozambican", "Namibian", "Nepalese",
  "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "Norwegian",
  "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian",
  "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese",
  "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran",
  "Samoan", "Saudi", "Senegalese", "Serbian", "Seychellois",
  "Sierra Leonean", "Singaporean", "Slovak", "Slovenian", "Somali",
  "South African", "South Sudanese", "Spanish", "Sri Lankan", "Sudanese",
  "Surinamese", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese",
  "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian",
  "Tunisian", "Turkish", "Turkmen", "Tuvaluan", "Ugandan", "Ukrainian",
  "Uruguayan", "Uzbek", "Venezuelan", "Vietnamese", "Yemeni",
  "Zambian", "Zimbabwean",
];

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

interface FormState {
  firstName: string;
  surname: string;
  email: string;
  confirmEmail: string;
  nationality: string;
  ethnicity: string;
  gender: string;
  category: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  agreedToTerms: boolean;
}

const initialForm: FormState = {
  firstName: "",
  surname: "",
  email: "",
  confirmEmail: "",
  nationality: "",
  ethnicity: "",
  gender: "",
  category: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  agreedToTerms: false,
};

export default function TalentRegisterPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image must be under 10 MB.");
      return;
    }
    setPhotoFile(file);
    setErrorMsg("");
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): string | null => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.surname.trim()) return "Surname is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.confirmEmail.trim()) return "Please confirm your email.";
    if (form.email.toLowerCase() !== form.confirmEmail.toLowerCase())
      return "Email addresses do not match.";
    if (!form.nationality) return "Please select your nationality.";
    if (!form.gender) return "Please select your gender.";
    if (!form.category) return "Please select a category.";
    if (!form.agreedToTerms) return "You must agree to the terms and conditions.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const socialMedia: Record<string, string> = {};
      if (form.instagram.trim()) socialMedia.instagram = form.instagram.trim();
      if (form.tiktok.trim()) socialMedia.tiktok = form.tiktok.trim();
      if (form.youtube.trim()) socialMedia.youtube = form.youtube.trim();

      const payload: Record<string, unknown> = {
        user_id: user?.user_id,
        name: `${form.firstName.trim()} ${form.surname.trim()}`,
        email: form.email.trim(),
        nationality: form.nationality,
        ethnicity: form.ethnicity.trim() || undefined,
        gender: form.gender,
        categories: form.category,
        social_media: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
        min_price_per_use: 100,
        max_license_duration_days: 365,
        allow_ai_training: false,
        allow_video_generation: true,
        allow_image_generation: true,
      };

      const res = await registerTalent(payload);
      const talentId = res.id;

      if (photoFile && talentId) {
        await uploadTalentImage(talentId, photoFile);
      }

      setUser({
        user_id: res.user_id || res.id,
        email: form.email.trim(),
        name: `${form.firstName.trim()} ${form.surname.trim()}`,
        role: "talent",
        profile_id: talentId,
      });

      setStatus("success");
      router.push("/talent/dashboard");
    } catch {
      setStatus("error");
      setErrorMsg("Registration failed. Please try again.");
    }
  };

  const inputClasses =
    "w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors";

  const selectClasses =
    "w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors appearance-none";

  const labelClasses = "block font-body text-sm font-medium text-[#0B0B0F] mb-1.5";

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="border-b border-[#E0E0DA] bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0B0B0F]">
              <span className="font-display text-sm font-bold italic text-[#0B0B0F]">
                FL
              </span>
            </div>
            <span className="font-body text-sm font-bold tracking-[0.15em] text-[#0B0B0F]">
              FACE LIBRARY
            </span>
          </Link>
          <Link
            href="/login"
            className="font-body text-sm text-[#6B6B73] hover:text-[#0B0B0F] transition-colors"
          >
            Already have an account? <span className="font-medium text-[#0B0B0F] underline">Sign in</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-light text-[#0B0B0F] mb-2">
            Join Face Library
          </h1>
          <p className="font-body text-[15px] text-[#6B6B73]">
            Create your digital likeness profile
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Category Selection */}
              <div className="bg-white rounded-xl border border-[#E0E0DA] p-6">
                <h2 className="font-display text-lg font-medium text-[#0B0B0F] mb-1">
                  Category
                </h2>
                <p className="font-body text-sm text-[#6B6B73] mb-5">
                  Select the category that best describes you
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                        form.category === cat
                          ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                          : "border-[#E0E0DA] hover:border-[#C0C0BA]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          form.category === cat
                            ? "border-[#1E3A5F]"
                            : "border-[#C0C0BA]"
                        }`}
                      >
                        {form.category === cat && (
                          <div className="w-2 h-2 rounded-full bg-[#1E3A5F]" />
                        )}
                      </div>
                      <span className="font-body text-sm text-[#0B0B0F]">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white rounded-xl border border-[#E0E0DA] p-6">
                <h2 className="font-display text-lg font-medium text-[#0B0B0F] mb-1">
                  Personal Details
                </h2>
                <p className="font-body text-sm text-[#6B6B73] mb-5">
                  This information will be used for your profile
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className={labelClasses}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="surname" className={labelClasses}>
                      Surname <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="surname"
                      type="text"
                      required
                      value={form.surname}
                      onChange={(e) => update("surname", e.target.value)}
                      placeholder="Enter your surname"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="nationality" className={labelClasses}>
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="nationality"
                        required
                        value={form.nationality}
                        onChange={(e) => update("nationality", e.target.value)}
                        className={selectClasses}
                        style={{
                          color: form.nationality ? "#0B0B0F" : "#9B9BA3",
                        }}
                      >
                        <option value="" disabled>
                          Select nationality
                        </option>
                        {nationalities.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className="text-[#6B6B73]"
                        >
                          <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ethnicity" className={labelClasses}>
                      Ethnicity{" "}
                      <span className="text-[#9B9BA3] font-normal">(optional)</span>
                    </label>
                    <input
                      id="ethnicity"
                      type="text"
                      value={form.ethnicity}
                      onChange={(e) => update("ethnicity", e.target.value)}
                      placeholder="e.g. Caucasian, Asian, etc."
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className={labelClasses}>
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="gender"
                        required
                        value={form.gender}
                        onChange={(e) => update("gender", e.target.value)}
                        className={selectClasses}
                        style={{
                          color: form.gender ? "#0B0B0F" : "#9B9BA3",
                        }}
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        {genderOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className="text-[#6B6B73]"
                        >
                          <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl border border-[#E0E0DA] p-6">
                <h2 className="font-display text-lg font-medium text-[#0B0B0F] mb-1">
                  Contact
                </h2>
                <p className="font-body text-sm text-[#6B6B73] mb-5">
                  We will use this to send you updates and notifications
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmEmail" className={labelClasses}>
                      Confirm Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmEmail"
                      type="email"
                      required
                      value={form.confirmEmail}
                      onChange={(e) => update("confirmEmail", e.target.value)}
                      placeholder="Re-enter your email"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl border border-[#E0E0DA] p-6">
                <h2 className="font-display text-lg font-medium text-[#0B0B0F] mb-1">
                  Social Media
                </h2>
                <p className="font-body text-sm text-[#6B6B73] mb-5">
                  Help brands find and verify your online presence
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="instagram" className={labelClasses}>
                      Instagram
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-[#9B9BA3]">
                        @
                      </span>
                      <input
                        id="instagram"
                        type="text"
                        value={form.instagram}
                        onChange={(e) => update("instagram", e.target.value)}
                        placeholder="username"
                        className={`${inputClasses} pl-8`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="tiktok" className={labelClasses}>
                      TikTok
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-[#9B9BA3]">
                        @
                      </span>
                      <input
                        id="tiktok"
                        type="text"
                        value={form.tiktok}
                        onChange={(e) => update("tiktok", e.target.value)}
                        placeholder="username"
                        className={`${inputClasses} pl-8`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="youtube" className={labelClasses}>
                      YouTube
                    </label>
                    <input
                      id="youtube"
                      type="text"
                      value={form.youtube}
                      onChange={(e) => update("youtube", e.target.value)}
                      placeholder="Channel name or URL"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Photo Upload & Submit */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <div className="bg-white rounded-xl border border-[#E0E0DA] p-6 lg:sticky lg:top-6">
                <h2 className="font-display text-lg font-medium text-[#0B0B0F] mb-1">
                  Profile Photo
                </h2>
                <p className="font-body text-sm text-[#6B6B73] mb-5">
                  Upload a clear, high-quality headshot
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {photoPreview ? (
                  <div className="relative group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#E0E0DA]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white rounded-lg font-body text-sm font-medium text-[#0B0B0F] hover:bg-[#FAFAF8] transition-colors"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-body text-sm font-medium text-white border border-white/30 hover:bg-white/30 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-[3/4] rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center text-center px-6 transition-colors ${
                      isDragging
                        ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                        : "border-[#E0E0DA] hover:border-[#C0C0BA] bg-[#FAFAF8]"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F0F0EC] flex items-center justify-center mb-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#6B6B73]"
                      >
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 8L12 3L7 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 3V15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-body text-sm font-medium text-[#0B0B0F] mb-1">
                      Drag and drop your photo
                    </p>
                    <p className="font-body text-xs text-[#6B6B73] mb-3">
                      or click to browse
                    </p>
                    <p className="font-body text-xs text-[#9B9BA3]">
                      JPG, PNG or WebP. Max 10 MB.
                    </p>
                  </div>
                )}
              </div>

              {/* Terms & Submit (visible on larger screens in sidebar) */}
              <div className="bg-white rounded-xl border border-[#E0E0DA] p-6">
                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={form.agreedToTerms}
                      onChange={(e) => update("agreedToTerms", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        form.agreedToTerms
                          ? "bg-[#0B0B0F] border-[#0B0B0F]"
                          : "border-[#C0C0BA] bg-white"
                      }`}
                    >
                      {form.agreedToTerms && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="font-body text-sm text-[#6B6B73] leading-snug">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#0B0B0F] underline hover:no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#0B0B0F] underline hover:no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                    , and confirm the information provided is accurate.
                  </span>
                </label>

                {/* Error Message */}
                {errorMsg && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <p className="font-body text-sm text-red-600">{errorMsg}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-semibold py-3.5 px-6 rounded-lg hover:bg-[#1a1a22] active:bg-[#000000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating Profile...
                    </span>
                  ) : (
                    "Create Profile"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
