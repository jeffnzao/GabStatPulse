"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const GABON_REGIONS = [
  {
    name: "Libreville",
    x: 65,
    y: 35,
    population: 850000,
    lat: 0.4162,
    lng: 9.4673,
  },
  {
    name: "Port-Gentil",
    x: 45,
    y: 50,
    population: 120000,
    lat: -0.7193,
    lng: 8.7815,
  },
  {
    name: "Franceville",
    x: 75,
    y: 70,
    population: 50000,
    lat: -1.6333,
    lng: 13.5833,
  },
  { name: "Oyem", x: 60, y: 15, population: 60000, lat: 1.6167, lng: 11.5833 },
  {
    name: "Mouila",
    x: 50,
    y: 75,
    population: 25000,
    lat: -2.0833,
    lng: 10.8333,
  },
  {
    name: "Lambaréné",
    x: 55,
    y: 45,
    population: 8000,
    lat: 0.7,
    lng: 10.2333,
  },
];

interface SelectedRegion {
  name: string;
  population: number;
  problems: string[];
  stats: { label: string; value: string }[];
}

export function GabonMap() {
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(
    null
  );

  const handleRegionClick = (region: (typeof GABON_REGIONS)[0]) => {
    const problems = [
      "Coût de la vie",
      "Emploi limité",
      "Transport",
      "Internet",
      "Électricité",
    ];
    setSelectedRegion({
      name: region.name,
      population: region.population,
      problems: problems.slice(0, Math.floor(Math.random() * 5) + 2),
      stats: [
        { label: "Participants", value: Math.floor(Math.random() * 1000) + 100 },
        {
          label: "Sondages",
          value: Math.floor(Math.random() * 50) + 10,
        },
        {
          label: "Engagement",
          value: Math.floor(Math.random() * 40) + 60 + "%",
        },
      ],
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* SVG Map */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="relative w-full aspect-video bg-dark-800 rounded-lg overflow-hidden">
            {/* Simplified Gabon outline */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ background: "linear-gradient(135deg, #1a3a3a 0%, #0d2d2d 100%)" }}
            >
              {/* Country outline */}
              <path
                d="M 30 10 Q 50 5 65 15 L 75 25 Q 80 40 75 60 Q 70 80 55 85 Q 40 88 25 80 Q 15 70 20 50 Q 22 30 30 10"
                fill="#00D26A"
                opacity="0.1"
                stroke="#00D26A"
                strokeWidth="0.5"
              />

              {/* Regions as dots */}
              {GABON_REGIONS.map((region) => (
                <g key={region.name}>
                  <motion.circle
                    cx={region.x}
                    cy={region.y}
                    r="2"
                    fill="#00D26A"
                    stroke="#0066FF"
                    strokeWidth="0.5"
                    whileHover={{ r: 3.5 }}
                    onClick={() => handleRegionClick(region)}
                    className="cursor-pointer"
                  />
                  <motion.text
                    x={region.x}
                    y={region.y - 3}
                    textAnchor="middle"
                    className="text-xs fill-gray-200 cursor-pointer pointer-events-none"
                    fontSize="2"
                  >
                    {region.name.split(" ")[0]}
                  </motion.text>
                </g>
              ))}
            </svg>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Cliquez sur une région pour voir les statistiques
          </p>
        </CardContent>
      </Card>

      {/* Selected Region Details */}
      {selectedRegion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass border-primary-600/50">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                {selectedRegion.name}
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {selectedRegion.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 bg-dark-700/50 rounded text-center">
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-xl font-bold text-primary-500">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Problèmes principaux</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRegion.problems.map((problem, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="px-3 py-1 bg-primary-600/20 border border-primary-600/50 rounded-full text-sm"
                    >
                      {problem}
                    </motion.span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
