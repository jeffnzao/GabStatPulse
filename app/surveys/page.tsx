"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Users, Clock } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description?: string;
  category: string;
  region: string;
  createdAt: string;
  endDate: string;
  _count: { responses: number };
  creator: { name?: string; image?: string };
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    "Coût de la vie",
    "Emploi",
    "Transport",
    "Santé",
    "Internet",
    "Éducation",
    "Sécurité",
    "Électricité",
    "Eau",
    "Logement",
  ];

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/surveys");
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const filteredSurveys = selectedCategory
    ? surveys.filter((s) => s.category === selectedCategory)
    : surveys;

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, days);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Sondages actifs
          </h1>
          <p className="text-gray-400">
            Participez aux sondages et partagez votre avis sur les réalités du
            Gabon
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          <Button
            variant={selectedCategory === "" ? "primary" : "ghost"}
            onClick={() => setSelectedCategory("")}
          >
            Tous
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "primary" : "ghost"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Aucun sondage trouvé pour cette catégorie
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSurveys.map((survey) => {
              const daysRemaining = getDaysRemaining(survey.endDate);
              const isUrgent = daysRemaining <= 3;

              return (
                <motion.div key={survey.id} variants={itemVariants}>
                  <Link href={`/surveys/${survey.id}`}>
                    <Card className="glass hover:border-primary-600/50 transition h-full cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="group-hover:text-primary-500 transition">
                              {survey.title}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {survey.category}
                            </CardDescription>
                          </div>
                          {survey._count.responses > 100 && (
                            <Flame className="w-5 h-5 text-red-500 ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        {survey.description && (
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {survey.description}
                          </p>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-primary-600" />
                            <span>
                              {survey._count.responses} participant
                              {survey._count.responses !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span
                              className={
                                isUrgent
                                  ? "text-orange-500 font-semibold"
                                  : "text-gray-400"
                              }
                            >
                              {daysRemaining} jour
                              {daysRemaining !== 1 ? "s" : ""} restant
                              {daysRemaining === 0 ? "s" : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-primary-600" />
                            <span>{survey.region}</span>
                          </div>
                        </div>

                        <Link href={`/surveys/${survey.id}`} className="block">
                          <Button
                            variant="primary"
                            className="w-full mt-6"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Participer →
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
