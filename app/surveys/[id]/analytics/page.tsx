"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CustomBarChart, 
  CustomLineChart, 
  CustomPieChart 
} from "@/components/charts";
import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, Share2 } from "lucide-react";
import { GabonMap } from "@/components/maps/gabon-map";

export default function SurveyAnalytics() {
  const params = useParams();
  const surveyId = params.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const mockData = {
    title: "Coût de la vie au Gabon",
    totalResponses: 1250,
    participationRate: 78,
    trend: "rising",
    trendValue: "+23%",
    demographics: [
      { name: "18-25", value: 280 },
      { name: "25-35", value: 450 },
      { name: "35-50", value: 380 },
      { name: "50+", value: 140 },
    ],
    categoryDistribution: [
      { name: "Alimentation", value: 450 },
      { name: "Transport", value: 320 },
      { name: "Logement", value: 280 },
      { name: "Santé", value: 200 },
    ],
    timeline: [
      { name: "Jour 1", value: 150 },
      { name: "Jour 2", value: 220 },
      { name: "Jour 3", value: 310 },
      { name: "Jour 4", value: 380 },
      { name: "Jour 5", value: 420 },
      { name: "Jour 6", value: 490 },
      { name: "Jour 7", value: 1250 },
    ],
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            {mockData.title}
          </h1>
          <p className="text-gray-400">Analyse complète des réponses</p>
        </motion.div>

        {/* KPI Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total réponses",
              value: mockData.totalResponses,
              icon: Users,
            },
            {
              title: "Taux participation",
              value: mockData.participationRate + "%",
              icon: TrendingUp,
            },
            {
              title: "Tendance",
              value: mockData.trendValue,
              icon: TrendingUp,
              color: "text-green-500",
            },
            {
              title: "Durée",
              value: "7 jours",
              icon: Clock,
            },
          ].map((kpi, idx) => {
            const IconComponent = kpi.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-gray-400 text-sm">{kpi.title}</p>
                        <p className={`text-3xl font-bold mt-2 ${kpi.color || ""}`}>
                          {kpi.value}
                        </p>
                      </div>
                      <IconComponent className="w-8 h-8 text-primary-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* Timeline */}
          <motion.div variants={itemVariants}>
            <Card className="glass">
              <CardHeader>
                <CardTitle>Évolution des réponses</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomLineChart data={mockData.timeline} height={300} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Demographics */}
          <motion.div variants={itemVariants}>
            <Card className="glass">
              <CardHeader>
                <CardTitle>Distribution par âge</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomBarChart data={mockData.demographics} height={300} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          {/* Category Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="glass">
              <CardHeader>
                <CardTitle>Catégories principales</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={mockData.categoryDistribution} height={300} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Regional Analysis */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Analyse par région</CardTitle>
                <CardDescription>Répartition géographique des participants</CardDescription>
              </CardHeader>
              <CardContent>
                <GabonMap />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <button className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Exporter en CSV
                </button>
                <button className="flex-1 px-6 py-3 bg-accent-600 hover:bg-accent-500 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Exporter en PDF
                </button>
                <button className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
