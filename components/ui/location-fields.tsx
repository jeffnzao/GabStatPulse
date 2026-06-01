"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  GABON_PROVINCES,
  getVillesByProvince,
  getCommunesByVille,
} from "@/lib/gabonLocations";
import { motion, AnimatePresence } from "framer-motion";

// ─── Style select aligné sur le composant Input existant ─────────────────────
const selectCls =
  "flex h-10 w-full rounded-md border border-dark-700 bg-dark-800 px-3 py-2 " +
  "text-base text-gray-100 placeholder:text-gray-500 " +
  "focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

// ─── Pays (Gabon en tête, puis Afrique + reste du monde) ─────────────────────
const COUNTRIES = [
  "Gabon",
  "---Afrique---",
  "Afrique du Sud",
  "Algérie",
  "Angola",
  "Bénin",
  "Burkina Faso",
  "Burundi",
  "Cameroun",
  "Cap-Vert",
  "Centrafrique",
  "Comores",
  "Congo",
  "Côte d'Ivoire",
  "Djibouti",
  "Égypte",
  "Éthiopie",
  "Ghana",
  "Guinée",
  "Guinée-Bissau",
  "Guinée équatoriale",
  "Kenya",
  "Madagascar",
  "Mali",
  "Maroc",
  "Maurice",
  "Mauritanie",
  "Mozambique",
  "Niger",
  "Nigeria",
  "Ouganda",
  "RD Congo",
  "Rwanda",
  "Sénégal",
  "Seychelles",
  "Tchad",
  "Togo",
  "Tunisie",
  "---Europe---",
  "Allemagne",
  "Belgique",
  "Espagne",
  "France",
  "Italie",
  "Luxembourg",
  "Monaco",
  "Portugal",
  "Suisse",
  "---Autres---",
  "Canada",
  "États-Unis",
  "Haïti",
  "Autre",
];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LocationData {
  country: string;
  residesInGabon: boolean;
  province: string;
  ville: string;
  commune: string;
}

export const defaultLocationData: LocationData = {
  country: "",
  residesInGabon: false,
  province: "",
  ville: "",
  commune: "",
};

interface LocationFieldsProps {
  value: LocationData;
  onChange: (data: LocationData) => void;
  disabled?: boolean;
}

// ─── Composant ────────────────────────────────────────────────────────────────
export function LocationFields({ value, onChange, disabled }: LocationFieldsProps) {
  const [villes, setVilles] = useState<string[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);

  // Afficher les champs Gabon si pays = Gabon OU résideInGabon = true
  const showGabonFields = value.country === "Gabon" || value.residesInGabon;

  // Recalcule les villes quand la province change
  useEffect(() => {
    if (value.province) {
      const newVilles = getVillesByProvince(value.province).map((v) => v.name);
      setVilles(newVilles);
      // Reset ville + commune si la province a changé et ancienne ville invalide
      if (value.ville && !newVilles.includes(value.ville)) {
        onChange({ ...value, ville: "", commune: "" });
      }
    } else {
      setVilles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.province]);

  // Recalcule les communes quand la ville change
  useEffect(() => {
    if (value.province && value.ville) {
      const newCommunes = getCommunesByVille(value.province, value.ville).map(
        (c) => c.name
      );
      setCommunes(newCommunes);
      if (value.commune && !newCommunes.includes(value.commune)) {
        onChange({ ...value, commune: "" });
      }
    } else {
      setCommunes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.ville]);

  const handleCountryChange = (country: string) => {
    if (country.startsWith("---")) return; // séparateurs
    const isGabon = country === "Gabon";
    onChange({
      ...value,
      country,
      residesInGabon: isGabon ? true : value.residesInGabon,
      // reset les champs Gabon seulement si on passe à un pays non-Gabon ET residesInGabon = false
      province: isGabon || value.residesInGabon ? value.province : "",
      ville: isGabon || value.residesInGabon ? value.ville : "",
      commune: isGabon || value.residesInGabon ? value.commune : "",
    });
  };

  const handleResidesToggle = (resides: boolean) => {
    onChange({
      ...value,
      residesInGabon: resides,
      province: resides ? value.province : "",
      ville: resides ? value.ville : "",
      commune: resides ? value.commune : "",
    });
  };

  const set = (key: keyof LocationData, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      {/* ── Pays ── */}
      <div className="space-y-2">
        <Label htmlFor="loc-country">Pays de résidence</Label>
        <select
          id="loc-country"
          value={value.country}
          onChange={(e) => handleCountryChange(e.target.value)}
          disabled={disabled}
          className={selectCls}
        >
          <option value="">Sélectionner un pays</option>
          {COUNTRIES.map((c) =>
            c.startsWith("---") ? (
              <option key={c} value={c} disabled className="text-gray-500">
                {c.replace(/---/g, "")}
              </option>
            ) : (
              <option key={c} value={c}>
                {c}
              </option>
            )
          )}
        </select>
      </div>

      {/* ── Toggle "Réside au Gabon ?" — visible seulement si pays ≠ Gabon ── */}
      <AnimatePresence>
        {value.country && value.country !== "Gabon" && (
          <motion.div
            key="resides-toggle"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 rounded-lg bg-dark-700/60 border border-dark-600">
              <span className="text-sm text-gray-300">
                Résidez-vous actuellement au Gabon ?
              </span>
              <div className="flex gap-2">
                {(["Oui", "Non"] as const).map((opt) => {
                  const isOui = opt === "Oui";
                  const active = value.residesInGabon === isOui;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleResidesToggle(isOui)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        active
                          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                          : "bg-dark-800 text-gray-400 hover:bg-dark-700 border border-dark-600"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Champs Gabon : Province → Ville → Commune ── */}
      <AnimatePresence>
        {showGabonFields && (
          <motion.div
            key="gabon-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-l-2 border-primary-600/40 pl-4">
              <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span>📍</span> Localisation au Gabon
              </p>

              {/* Province */}
              <div className="space-y-2">
                <Label htmlFor="loc-province">Province</Label>
                <select
                  id="loc-province"
                  value={value.province}
                  onChange={(e) => set("province", e.target.value)}
                  disabled={disabled}
                  className={selectCls}
                >
                  <option value="">Sélectionner une province</option>
                  {GABON_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ville — apparaît après choix province */}
              <AnimatePresence>
                {value.province && (
                  <motion.div
                    key="ville-field"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="loc-ville">Ville</Label>
                    <select
                      id="loc-ville"
                      value={value.ville}
                      onChange={(e) => set("ville", e.target.value)}
                      disabled={disabled || !value.province}
                      className={selectCls}
                    >
                      <option value="">Sélectionner une ville</option>
                      {villes.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Commune — apparaît après choix ville */}
              <AnimatePresence>
                {value.ville && communes.length > 0 && (
                  <motion.div
                    key="commune-field"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="loc-commune">
                      Commune / Arrondissement
                    </Label>
                    <select
                      id="loc-commune"
                      value={value.commune}
                      onChange={(e) => set("commune", e.target.value)}
                      disabled={disabled || !value.ville}
                      className={selectCls}
                    >
                      <option value="">Sélectionner une commune</option>
                      {communes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
