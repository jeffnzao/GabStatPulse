"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LocationFields,
  defaultLocationData,
  type LocationData,
} from "@/components/ui/location-fields";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Settings, LogOut, Pencil, X, Check } from "lucide-react";

// ─── Données mock initiales ───────────────────────────────────────────────────
const MOCK_USER = {
  name: "Jean Ondoua",
  email: "jean.ondoua@example.com",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
  badges: ["Observateur", "Analyste"],
  stats: { surveys: 24, responses: 156, accuracy: 92 },
  // Localisation
  location: {
    country: "Gabon",
    residesInGabon: true,
    province: "Estuaire",
    ville: "Libreville",
    commune: "1er Arrondissement",
  } as LocationData,
};

const ALL_BADGES = [
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
    progress: "156/250",
  },
  {
    name: "Influenceur",
    description: "50+ participants à ses sondages",
    icon: "⭐",
    earned: false,
    progress: "2/50",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildLocationLabel(loc: LocationData): string {
  if (!loc.country) return "Non renseigné";
  if (loc.country === "Gabon" || loc.residesInGabon) {
    const parts = [loc.commune, loc.ville, loc.province].filter(Boolean);
    return parts.length ? parts.join(", ") : loc.country;
  }
  return loc.country;
}

export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);

  // État du formulaire d'édition
  const [editName, setEditName] = useState(user.name);
  const [editLocation, setEditLocation] = useState<LocationData>(user.location);

  const startEdit = () => {
    setEditName(user.name);
    setEditLocation(user.location);
    setEditing(true);
    setSaveOk(false);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    setSaving(true);
    try {
      // En dev / sans session réelle → mise à jour locale + appel API optionnel
      await new Promise((r) => setTimeout(r, 600)); // simule latence
      setUser((prev) => ({
        ...prev,
        name: editName,
        location: editLocation,
      }));
      setSaveOk(true);
      setTimeout(() => setEditing(false), 900);
    } finally {
      setSaving(false);
    }
  };

  const locationLabel = buildLocationLabel(user.location);

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* ── En-tête profil ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary-600 to-accent-600" />
            <CardContent className="p-6 -mt-12 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="relative w-24 h-24 rounded-full border-4 border-dark-800 overflow-hidden bg-dark-700 shrink-0">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold mb-1 truncate">
                    {user.name}
                  </h1>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-primary-500 font-semibold mt-2 text-sm flex items-center gap-1">
                    <span>📍</span>
                    <span>{locationLabel}</span>
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button variant="secondary" onClick={startEdit}>
                    <Settings className="w-4 h-4 mr-2" />
                    Modifier
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

        {/* ── Formulaire d'édition (drawer inline) ── */}
        <AnimatePresence>
          {editing && (
            <motion.div
              key="edit-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <Card className="glass border-primary-600/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-primary-500" />
                    Modifier le profil
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nom complet</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={saving}
                      placeholder="Votre nom"
                    />
                  </div>

                  {/* Localisation */}
                  <LocationFields
                    value={editLocation}
                    onChange={setEditLocation}
                    disabled={saving}
                  />

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="primary"
                      onClick={saveEdit}
                      isLoading={saving}
                      className="flex items-center gap-2"
                    >
                      {saveOk ? (
                        <>
                          <Check className="w-4 h-4" /> Sauvegardé !
                        </>
                      ) : (
                        "Sauvegarder"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Statistiques ── */}
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

        {/* ── Badges ── */}
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
                {ALL_BADGES.map((badge, idx) => (
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

        {/* ── Historique récent ── */}
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
                  {
                    title: "Coût de la vie au Gabon",
                    date: "Il y a 2 jours",
                  },
                  { title: "État de l'emploi 2026", date: "Il y a 5 jours" },
                  { title: "Accès à l'internet", date: "Il y a 1 semaine" },
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
