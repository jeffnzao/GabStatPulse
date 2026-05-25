"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user] = useState({
    name: "Jean Ondoua",
    email: "jean.ondoua@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    region: "Libreville",
    badges: ["Observateur", "Analyste"],
    stats: {
      surveys: 24,
      responses: 156,
      accuracy: 92,
    },
  });

  const allBadges = [
    {
      name: "Observateur",
      description: "Premiers pas dans la plateforme",
      icon: "👁️",
      earned: true,
    },
    {
      name: "Analyste",
      description: "5 sondages complétés",
      icon: "📊",
      earned: true,
    },
    {
      name: "Citoyen engagé",
      description: "25 participations",
      icon: "🙌",
      earned: false,
      progress: 156 + "/" + 250,
    },
    {
      name: "Influenceur",
      description: "50+ participants à ses sondages",
      icon: "⭐",
      earned: false,
      progress: "2/50",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary-600 to-accent-600"></div>
            <CardContent className="p-6 -mt-12 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="relative w-24 h-24 rounded-full border-4 border-dark-800 overflow-hidden bg-dark-700">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-primary-500 font-semibold mt-2">
                    📍 {user.region}
                  </p>
                </div>

                <div className="flex gap-2 md:flex-col lg:flex-row">
                  <Button variant="secondary">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </Button>
                  <Button variant="ghost">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnecter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { title: "Sondages participés", value: user.stats.surveys },
            { title: "Réponses données", value: user.stats.responses },
            { title: "Précision", value: user.stats.accuracy + "%" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Card className="glass text-center">
                <CardContent className="p-6">
                  <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
                  <p className="text-4xl font-bold gradient-text">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="w-5 h-5 text-primary-600" />
                Insignes et réalisations
              </CardTitle>
              <CardDescription>
                Déverrouillez des insignes en participant aux sondages
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allBadges.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className={`p-4 rounded-lg text-center transition ${
                      badge.earned
                        ? "bg-primary-600/20 border border-primary-600/50"
                        : "bg-dark-700 border border-dark-600 opacity-60"
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      {badge.description}
                    </p>
                    {badge.earned ? (
                      <span className="inline-block px-3 py-1 bg-primary-600/30 rounded-full text-xs text-primary-400">
                        Déverrouillé
                      </span>
                    ) : (
                      <span className="inline-block text-xs text-gray-500">
                        {badge.progress}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Historique récent</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Coût de la vie au Gabon", date: "Il y a 2 jours" },
                  {
                    title: "État de l'emploi 2026",
                    date: "Il y a 5 jours",
                  },
                  {
                    title: "Accès à l'internet",
                    date: "Il y a 1 semaine",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="flex justify-between items-center pb-4 border-b border-dark-700 last:border-0"
                  >
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.date}</p>
                    </div>
                    <span className="text-primary-500">✓</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
