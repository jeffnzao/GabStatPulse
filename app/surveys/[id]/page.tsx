"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Calendar, MapPin, ArrowLeft, BarChart3, AlertCircle } from "lucide-react";
import type { Survey, SurveyQuestion } from "@/types";

// ─── Validation Schema ──────────────────────────────────────────────────────
const createAnswerSchema = (questions: SurveyQuestion[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  
  for (const q of questions) {
    if (q.type === "yes_no") {
      shape[q.id] = z.enum(["Oui", "Non"], { message: "Veuillez sélectionner une réponse" });
    } else if (q.type === "single") {
      shape[q.id] = z.string().min(1, "Veuillez sélectionner une option");
    } else if (q.type === "multiple") {
      shape[q.id] = z.string().min(1, "Veuillez sélectionner au moins une option");
    } else if (q.type === "scale") {
      shape[q.id] = z.string().min(1, "Veuillez évaluer");
    } else if (q.type === "text") {
      shape[q.id] = z.string().min(1, "Veuillez entrer votre réponse").max(500, "Réponse trop longue");
    } else {
      shape[q.id] = z.string().optional();
    }
  }
  
  return z.object(shape);
};

// ─── Loading Skeleton ──────────────────────────────────────────────────────
function SurveyLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-6 h-10 w-20 bg-dark-700 rounded animate-pulse" />
        
        {/* Main card skeleton */}
        <Card className="glass mb-6">
          <CardHeader>
            <div className="h-8 w-3/4 bg-dark-700 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-dark-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-2/3 bg-dark-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-dark-700 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Questions skeleton */}
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="glass mb-6">
            <CardContent className="p-6">
              <div className="h-6 w-3/4 bg-dark-700 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {Array(3).fill(0).map((_, j) => (
                  <div key={j} className="h-10 bg-dark-700 rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="border-red-500/50 bg-red-500/10 max-w-md">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Erreur</h2>
          <p className="text-gray-300 mb-6">{message}</p>
          <Button 
            onClick={() => router.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Not Found State ──────────────────────────────────────────────────────
function NotFoundState() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="border-amber-500/50 bg-amber-500/10 max-w-md">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-amber-400 mb-2">Sondage introuvable</h2>
          <p className="text-gray-300 mb-6">Le sondage que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button 
            onClick={() => router.push("/surveys")}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voir tous les sondages
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── No Questions State ──────────────────────────────────────────────────────
function NoQuestionsState() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-400 mb-2">Pas de questions</h2>
            <p className="text-gray-300">Ce sondage ne contient pas encore de questions.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Success State ──────────────────────────────────────────────────────────
function SuccessState() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/surveys");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
    >
      <Card className="border-green-500/50 bg-green-500/10 max-w-md pointer-events-auto">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl mb-4"
          >
            ✓
          </motion.div>
          <h2 className="text-xl font-bold text-green-400 mb-2">
            Merci pour votre participation !
          </h2>
          <p className="text-gray-300 text-sm">
            Redirection en cours...
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Question Renderer ──────────────────────────────────────────────────────
interface QuestionRendererProps {
  question: SurveyQuestion;
  index: number;
  control: any;
  errors: any;
}

function QuestionRenderer({ question, index, control, errors }: QuestionRendererProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="glass">
        <CardContent className="p-6">
          <Label className="text-base font-semibold mb-4 block">
            <span className="text-primary-500">Q{index + 1}.</span> {question.text}
          </Label>

          <Controller
            name={question.id}
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {question.type === "yes_no" && (
                  <div className="flex gap-4">
                    {["Oui", "Non"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg hover:bg-dark-700/50 transition"
                      >
                        <input
                          type="radio"
                          value={option}
                          checked={field.value === option}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 rounded-full accent-primary-500"
                        />
                        <span className="text-gray-100">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "single" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-dark-700/50 transition"
                      >
                        <input
                          type="radio"
                          value={option}
                          checked={field.value === option}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 rounded-full accent-primary-500"
                        />
                        <span className="text-gray-100">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "multiple" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-dark-700/50 transition"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={field.value?.includes(option) || false}
                          onChange={(e) => {
                            const current = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...current, option]);
                            } else {
                              field.onChange(current.filter((v: string) => v !== option));
                            }
                          }}
                          className="w-4 h-4 rounded accent-primary-500"
                        />
                        <span className="text-gray-100">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "scale" && question.options && (
                  <div className="flex gap-2">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => field.onChange(option)}
                        className={`flex-1 py-2 px-2 rounded-lg font-semibold transition ${
                          field.value === option
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/50"
                            : "bg-dark-700 text-gray-300 hover:bg-dark-600"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "text" && (
                  <textarea
                    placeholder="Votre réponse..."
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    maxLength={500}
                    className="w-full h-24 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600/50 resize-none"
                  />
                )}

                {errors[question.id] && (
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors[question.id]?.message}
                  </p>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────
export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch survey
  const fetchSurvey = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSurvey(null);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
        return;
      }

      const data: Survey = await response.json();
      
      // Validate that survey has questions
      if (!data.questions || !Array.isArray(data.questions)) {
        data.questions = [];
      }

      setSurvey(data);
    } catch (err) {
      console.error("[Survey fetch] Error:", err);
      setError(err instanceof Error ? err.message : "Impossible de charger le sondage");
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    if (surveyId) {
      fetchSurvey();
    }
  }, [surveyId, fetchSurvey]);

  // Setup form validation
  const validationSchema = survey?.questions?.length ? createAnswerSchema(survey.questions) : z.object({});
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: survey?.questions?.length ? zodResolver(validationSchema) : undefined,
    mode: "onChange",
  });

  // Submit form
  const onSubmit = async (data: Record<string, any>) => {
    if (!survey) return;

    try {
      setSubmitting(true);
      setError(null);

      // Préparer les réponses
      const answers = Object.entries(data).map(([questionId, value]) => ({
        questionId,
        value: Array.isArray(value) ? value : String(value),
      }));

      // Appeler l'API de soumission
      const response = await fetch(`/api/surveys/${survey.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          surveyId: survey.id,
          answers 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Erreur lors de la soumission");
      }

      setSuccess(true);
    } catch (err) {
      console.error("[Survey submission] Error:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la soumission");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render States ──────────────────────────────────────────────────────
  if (loading) {
    return <SurveyLoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!survey) {
    return <NotFoundState />;
  }

  const questions = survey.questions ?? [];
  if (questions.length === 0) {
    return <NoQuestionsState />;
  }

  if (success) {
    return <SuccessState />;
  }

  // Calculate days remaining
  const daysRemaining = Math.ceil(
    (new Date(survey.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const participationRate = survey._count?.responses ? 
    Math.round((survey._count.responses / 100) * 100) : 0;

  // ─── Main Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-dark-700/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass mb-8 border-primary-500/20">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <CardTitle className="text-3xl lg:text-4xl gradient-text mb-2">
                    {survey.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-300">
                    {survey.description}
                  </CardDescription>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-dark-700">
                <motion.div whileHover={{ y: -2 }} className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Catégorie</p>
                  <p className="font-semibold text-lg mt-1">{survey.category}</p>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Région</p>
                  <p className="font-semibold text-lg mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    {survey.region}
                  </p>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Participants</p>
                  <p className="font-semibold text-lg mt-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-500" />
                    {survey._count?.responses ?? 0}
                  </p>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Temps restant</p>
                  <p className="font-semibold text-lg mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    {daysRemaining}j
                  </p>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Taux de participation</p>
                  <p className="text-sm font-semibold text-primary-500">{participationRate}%</p>
                </div>
                <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(participationRate, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {error && (
            <Card className="border-red-500/50 bg-red-500/10 mb-6">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Questions */}
          <AnimatePresence mode="wait">
            {questions.map((question, idx) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                index={idx}
                control={control}
                errors={errors}
              />
            ))}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: questions.length * 0.05 + 0.2 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 font-semibold py-3"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block mr-2"
                  >
                    ⏳
                  </motion.span>
                  Envoi en cours...
                </>
              ) : (
                "Soumettre mes réponses"
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
