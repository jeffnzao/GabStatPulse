"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Clock, Users, ArrowLeft } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[];
  order: number;
}

interface Survey {
  id: string;
  title: string;
  description?: string;
  category: string;
  region: string;
  endDate: string;
  questions: Question[];
  _count: { responses: number };
  creator: { name?: string };
}

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${surveyId}`);
        const data = await response.json();
        setSurvey(data);
      } catch (error) {
        console.error("Error fetching survey:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedAnswers = survey?.questions.map((q) => ({
        questionId: q.id,
        text: answers[q.id] || "",
      }));

      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/surveys"), 2000);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la soumission");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Erreur lors de la soumission");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-400 mb-6">Sondage non trouvé</p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(survey.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {success && (
            <Card className="mb-6 border-green-500/50 bg-green-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-green-400 font-semibold">
                  ✓ Votre réponse a été enregistrée avec succès !
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="glass mb-6">
            <CardHeader>
              <CardTitle className="text-3xl gradient-text mb-2">
                {survey.title}
              </CardTitle>
              <CardDescription className="text-base">
                {survey.description}
              </CardDescription>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-3 bg-dark-700/50 rounded">
                  <p className="text-gray-400 text-sm">Catégorie</p>
                  <p className="font-semibold">{survey.category}</p>
                </div>
                <div className="p-3 bg-dark-700/50 rounded">
                  <p className="text-gray-400 text-sm">Région</p>
                  <p className="font-semibold">{survey.region}</p>
                </div>
                <div className="p-3 bg-dark-700/50 rounded">
                  <p className="text-gray-400 text-sm">Participants</p>
                  <p className="font-semibold">{survey._count.responses}</p>
                </div>
                <div className="p-3 bg-dark-700/50 rounded">
                  <p className="text-gray-400 text-sm">Temps restant</p>
                  <p className="font-semibold">{daysRemaining} j</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {survey.questions.map((question, idx) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <Label className="text-base font-semibold mb-4 block">
                      {idx + 1}. {question.text}
                    </Label>

                    <div className="space-y-3">
                      {question.type === "yes_no" && (
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value="Oui"
                              onChange={(e) =>
                                handleAnswerChange(question.id, e.target.value)
                              }
                              className="w-4 h-4 rounded-full"
                            />
                            Oui
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value="Non"
                              onChange={(e) =>
                                handleAnswerChange(question.id, e.target.value)
                              }
                              className="w-4 h-4 rounded-full"
                            />
                            Non
                          </label>
                        </div>
                      )}

                      {(question.type === "single" || question.type === "multiple") &&
                        question.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 cursor-pointer p-3 rounded hover:bg-dark-700/50 transition"
                          >
                            <input
                              type={
                                question.type === "single" ? "radio" : "checkbox"
                              }
                              name={question.id}
                              value={option}
                              onChange={(e) =>
                                handleAnswerChange(question.id, e.target.value)
                              }
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}

                      {question.type === "scale" && (
                        <div className="flex gap-2">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                handleAnswerChange(question.id, option)
                              }
                              className={`flex-1 py-2 rounded font-semibold transition ${
                                answers[question.id] === option
                                  ? "bg-primary-600 text-white"
                                  : "bg-dark-700 hover:bg-dark-600"
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
                          value={(answers[question.id] as string) || ""}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          className="w-full h-24 px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={submitting}
            >
              Soumettre mes réponses
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
