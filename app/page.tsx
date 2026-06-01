"use client";

import { motion, type Variants, type Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart, TrendingUp, Users } from "lucide-react";
import { mockStats, gabonIndicators } from "@/lib/mockData";

interface GlobalStats {
  totalSurveys: number;
  totalParticipants: number;
  totalUsers: number;
  regionStats: Array<{ name: string; participants: number }>;
}

const categories = [
  { name: "Coût de la vie", icon: "💰", color: "from-red-500 to-pink-500" },
  { name: "Emploi",         icon: "💼", color: "from-blue-500 to-cyan-500" },
  { name: "Transport",      icon: "🚗", color: "from-purple-500 to-pink-500" },
  { name: "Santé",          icon: "🏥", color: "from-red-500 to-orange-500" },
  { name: "Internet",       icon: "📡", color: "from-blue-500 to-purple-500" },
  { name: "Éducation",      icon: "📚", color: "from-yellow-500 to-orange-500" },
  { name: "Sécurité",       icon: "🛡️", color: "from-gray-500 to-black" },
  { name: "Électricité",    icon: "⚡", color: "from-yellow-500 to-red-500" },
  { name: "Eau",            icon: "💧", color: "from-blue-500 to-teal-500" },
  { name: "Logement",       icon: "🏠", color: "from-orange-500 to-red-500" },
];

const easeOut: Easing = "easeOut";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

export default function Home() {
  const [stats, setStats] = useState<GlobalStats>(mockStats);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: GlobalStats) => setStats(data))
      .catch(() => setStats(mockStats));
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              Comprendre les réalités du Gabon
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              grâce aux données citoyennes en temps réel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/surveys">
                <Button variant="primary" size="lg">Voir les sondages</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="secondary" size="lg">Participer maintenant</Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { title: "Sondages",     value: stats.totalSurveys,      icon: BarChart },
              { title: "Participants", value: stats.totalParticipants,  icon: Users },
              { title: "Utilisateurs", value: stats.totalUsers,         icon: Users },
              { title: "Tendances",    value: "📊",                    icon: TrendingUp },
            ].map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="glass hover:border-primary-600/50 transition">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
                          <p className="text-3xl font-bold">
                            {typeof stat.value === "string"
                              ? stat.value
                              : stat.value.toLocaleString()}
                          </p>
                        </div>
                        <IconComponent className="w-12 h-12 text-primary-600 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Indicateurs Gabon */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-dark-800/30"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-4 gradient-text"
          >
            Indicateurs clés du Gabon
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-400 mb-12"
          >
            Basés sur les réponses citoyennes agrégées
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {gabonIndicators.slice(0, 10).map((ind, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="glass hover:border-primary-600/50 transition">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{ind.icon}</div>
                    <p className="text-xs text-gray-400 mb-1">{ind.category}</p>
                    <p className="text-2xl font-bold text-primary-500">{ind.value}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {ind.trend === "up" ? "↑" : ind.trend === "down" ? "↓" : "→"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Catégories de sondages
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {categories.map((category, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link href={`/surveys?category=${category.name}`}>
                  <Card className="glass hover:border-primary-600/50 transition h-full cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <p className="font-semibold group-hover:text-primary-500 transition">
                        {category.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Trending Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-dark-800/30"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold mb-12 gradient-text"
          >
            🔥 Tendances actuelles
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { title: "Coût de la vie au Gabon",   trending: "📈 +45% cette semaine", participants: 1250 },
              { title: "Situation d'emploi 2026",   trending: "📈 +32% cette semaine", participants: 890 },
              { title: "Accès à l'internet",        trending: "📉 -15% cette semaine", participants: 650 },
              { title: "Transport & mobilité",      trending: "🔥 Très tendance",       participants: 2100 },
            ].map((trend, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="glass hover:border-primary-600/50 transition">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{trend.title}</h3>
                    <p className="text-primary-500 mb-4">{trend.trending}</p>
                    <p className="text-gray-400">{trend.participants.toLocaleString()} participants</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="glass border-primary-600/30 bg-gradient-to-r from-primary-600/10 to-accent-600/10">
            <CardContent className="p-12 text-center">
              <motion.h3 variants={itemVariants} className="text-3xl font-bold mb-6">
                Prêt à partager votre avis ?
              </motion.h3>
              <motion.p variants={itemVariants} className="text-gray-400 mb-8 text-lg">
                Participez aux sondages et contribuez à la compréhension des réalités gabonaises
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link href="/auth/signup">
                  <Button variant="primary" size="lg">S&apos;inscrire gratuitement</Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
