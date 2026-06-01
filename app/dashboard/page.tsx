"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CustomBarChart, 
  CustomLineChart, 
  CustomPieChart 
} from "@/components/charts";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Zap, Calendar } from "lucide-react";

interface DashboardStats {
  totalSurveys: number;
  totalParticipants: number;
  totalUsers: number;
  regionStats: Array<{ name: string; participants: number }>;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("30days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const mockChartData = [
    { name: "Lun", value: 120 },
    { name: "Mar", value: 150 },
    { name: "Mer", value: 180 },
    { name: "Jeu", value: 220 },
    { name: "Ven", value: 250 },
    { name: "Sam", value: 200 },
    { name: "Dim", value: 180 },
  ];

  const mockCategoryData = [
    { name: "Coût de la vie", value: 450 },
    { name: "Emploi", value: 320 },
    { name: "Transport", value: 280 },
    { name: "Santé", value: 200 },
    { name: "Internet", value: 150 },
  ];

  const mockRegionData = (stats?.regionStats || []).map((r) => ({ name: r.name, value: r.participants }));

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
        {/* Header with Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Tableau de bord
              </h1>
              <p className="text-gray-400">
                Analysez les tendances et statistiques en temps réel
              </p>
            </div>

            {/* Period Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Période
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Aujourd'hui", value: "today" },
                  { label: "7 jours", value: "7days" },
                  { label: "30 jours", value: "30days" },
                  { label: "90 jours", value: "90days" },
                  { label: "Cette année", value: "year" },
                  { label: "Personnalisée", value: "custom" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={timeFilter === option.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Custom Date Range */}
              {timeFilter === "custom" && (
                <div className="flex gap-2 mt-3">
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    placeholder="Du"
                    className="h-8 text-xs bg-dark-700 border-dark-600"
                  />
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    placeholder="Au"
                    className="h-8 text-xs bg-dark-700 border-dark-600"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Sondages actifs",
              value: stats?.totalSurveys || 0,
              icon: BarChart3,
              trend: "+12%",
              color: "from-primary-600 to-primary-500",
            },
            {
              title: "Participants",
              value: stats?.totalParticipants || 0,
              icon: Users,
              trend: "+28%",
              color: "from-accent-600 to-accent-500",
            },
            {
              title: "Utilisateurs",
              value: stats?.totalUsers || 0,
              icon: Users,
              trend: "+8%",
              color: "from-purple-600 to-purple-500",
            },
            {
              title: "Engagement",
              value: "87%",
              icon: Zap,
              trend: "+5%",
              color: "from-orange-600 to-orange-500",
            },
          ].map((kpi, idx) => {
            const IconComponent = kpi.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="glass overflow-hidden group hover:border-primary-600/50 transition">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-2">
                          {kpi.title}
                        </p>
                        <p className="text-3xl font-bold">
                          {typeof kpi.value === "number"
                            ? kpi.value.toLocaleString()
                            : kpi.value}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color}`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-green-400 text-sm font-semibold">
                      {kpi.trend} ce mois
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mb-8"
        >
          {["day", "week", "month", "year"].map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "primary" : "ghost"}
              onClick={() => setTimeFilter(filter)}
              className="capitalize"
            >
              {filter === "day"
                ? "Jour"
                : filter === "week"
                  ? "Semaine"
                  : filter === "month"
                    ? "Mois"
                    : "Année"}
            </Button>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* Responses Over Time */}
          <motion.div variants={itemVariants}>
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  Réponses par jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomLineChart
                  data={mockChartData}
                  height={300}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Categories */}
          <motion.div variants={itemVariants}>
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle>Catégories populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomBarChart
                  data={mockCategoryData}
                  height={300}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Distribution Pie Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Distribution par région</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart
                  data={mockRegionData}
                  height={300}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Activité par région</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRegionData.map((region, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold">
                          {region.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {region.value} participants
                        </span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(region.value / Math.max(...mockRegionData.map(r => r.value))) * 100}%`,
                          }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
