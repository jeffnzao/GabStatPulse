"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Table2,
  Filter,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { formatResponsesForExport, exportToCSV } from "@/lib/exportUtils";

interface Survey {
  id: string;
  title: string;
  category: string;
  region: string;
  _count: { responses: number };
}

interface ExportFilters {
  surveyId: string;
  startDate: string;
  endDate: string;
  anonymousOnly: boolean;
  connectedOnly: boolean;
}

export default function AdminExportsPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [filters, setFilters] = useState<ExportFilters>({
    surveyId: "",
    startDate: "",
    endDate: "",
    anonymousOnly: false,
    connectedOnly: false,
  });
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Récupérer les sondages de l'utilisateur
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/surveys");
        const data = await response.json();
        setSurveys(data || []);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setMessage({ type: "error", text: "Impossible de charger les sondages" });
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Sélectionner un sondage
  const handleSelectSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setFilters({ ...filters, surveyId: survey.id });
    setMessage(null);
  };

  // Exporter en CSV
  const handleExportCSV = async () => {
    if (!selectedSurvey) return;

    try {
      setExporting(true);
      setMessage(null);

      // Récupérer les réponses avec filtres
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.anonymousOnly) queryParams.append("anonymousOnly", "true");
      if (filters.connectedOnly) queryParams.append("connectedOnly", "true");

      const response = await fetch(
        `/api/surveys/${selectedSurvey.id}/responses?${queryParams}`,
        { method: "GET" }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setMessage({
            type: "error",
            text: "Vous n'avez pas l'autorisation d'exporter ce sondage",
          });
          return;
        }
        throw new Error("Erreur lors de la récupération des données");
      }

      const { data } = await response.json();

      // Formater et exporter
      const formattedData = data.map((response: any) => ({
        ID: response.id,
        Date: new Date(response.createdAt).toLocaleDateString("fr-GA"),
        Utilisateur: response.user?.name || "Anonyme",
        Email: response.user?.email || "-",
        Région: response.region || "-",
        Réponses: response.answers
          .map((a: any) => `${a.questionId}: ${a.text}`)
          .join(" | "),
      }));

      exportToCSV(
        formattedData,
        `${selectedSurvey.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`
      );

      setMessage({
        type: "success",
        text: `Export CSV réussi (${formattedData.length} réponses)`,
      });
    } catch (error) {
      console.error("Export error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erreur lors de l'export",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-dark-700/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Exporter les réponses
          </h1>
          <p className="text-gray-400 mb-8">
            Téléchargez les réponses des sondages en CSV, Excel ou PDF
          </p>
        </motion.div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card
              className={
                message.type === "success"
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-red-500/50 bg-red-500/10"
              }
            >
              <CardContent className="p-4 flex items-center gap-3">
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <p
                  className={
                    message.type === "success"
                      ? "text-green-300"
                      : "text-red-300"
                  }
                >
                  {message.text}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Survey List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary-500" />
                    Sondages
                  </CardTitle>
                  <CardDescription>
                    {surveys.length} sondage{surveys.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {surveys.map((survey) => (
                    <button
                      key={survey.id}
                      onClick={() => handleSelectSurvey(survey)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedSurvey?.id === survey.id
                          ? "bg-primary-600/30 border border-primary-500"
                          : "bg-dark-700/50 hover:bg-dark-700"
                      }`}
                    >
                      <p className="font-semibold text-sm line-clamp-2">
                        {survey.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {survey._count.responses} réponse
                        {survey._count.responses !== 1 ? "s" : ""}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Export Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {selectedSurvey ? (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>{selectedSurvey.title}</CardTitle>
                    <CardDescription>
                      {selectedSurvey.category} • {selectedSurvey.region}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Filters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-gray-300">
                        Filtres
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate" className="text-xs">
                            Date de début
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                              setFilters({ ...filters, startDate: e.target.value })
                            }
                            className="mt-1 bg-dark-700 border-dark-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-xs">
                            Date de fin
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                              setFilters({ ...filters, endDate: e.target.value })
                            }
                            className="mt-1 bg-dark-700 border-dark-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.anonymousOnly}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                anonymousOnly: e.target.checked,
                                connectedOnly: false,
                              })
                            }
                            className="w-4 h-4 rounded accent-primary-500"
                          />
                          <span className="text-sm text-gray-300">
                            Réponses anonymes uniquement
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.connectedOnly}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                connectedOnly: e.target.checked,
                                anonymousOnly: false,
                              })
                            }
                            className="w-4 h-4 rounded accent-primary-500"
                          />
                          <span className="text-sm text-gray-300">
                            Utilisateurs connectés uniquement
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="space-y-3 pt-4 border-t border-dark-700">
                      <h3 className="font-semibold text-sm text-gray-300">
                        Format d'export
                      </h3>

                      <Button
                        onClick={handleExportCSV}
                        disabled={exporting}
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        {exporting ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Export en cours...
                          </>
                        ) : (
                          <>
                            <Table2 className="w-4 h-4" />
                            Exporter en CSV
                          </>
                        )}
                      </Button>

                      <Button
                        disabled
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 opacity-50"
                      >
                        <FileText className="w-4 h-4" />
                        Excel (bientôt)
                      </Button>

                      <Button
                        disabled
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 opacity-50"
                      >
                        <FileText className="w-4 h-4" />
                        PDF (bientôt)
                      </Button>
                    </div>

                    {/* Statistics */}
                    <div className="pt-4 border-t border-dark-700 space-y-2">
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-300">
                          {selectedSurvey._count.responses}
                        </span>{" "}
                        réponse{selectedSurvey._count.responses !== 1 ? "s" : ""}{" "}
                        au total
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass flex items-center justify-center h-96">
                  <CardContent className="text-center">
                    <Download className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Sélectionnez un sondage pour commencer l'export
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
