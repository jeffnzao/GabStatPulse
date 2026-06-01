"use client";

import { useEffect, useState } from "react";

const ANONYMOUS_ID_KEY = "gabstat_pulse_anonymous_id";
const SURVEY_RESPONSES_KEY = "gabstat_pulse_responses";

/**
 * Hook pour gérer l'identification anonyme
 * Crée et persiste un identifiant unique pour les utilisateurs anonymes
 */
export function useAnonymousId() {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifie si on est côté client
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      // Récupère ou crée l'ID anonyme
      let id = localStorage.getItem(ANONYMOUS_ID_KEY);
      
      if (!id) {
        // Génère un nouvel ID s'il n'existe pas
        id = crypto.randomUUID();
        localStorage.setItem(ANONYMOUS_ID_KEY, id);
      }

      setAnonymousId(id);
    } catch (error) {
      console.error("[useAnonymousId] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { anonymousId, isLoading };
}

/**
 * Vérifie si un utilisateur anonyme a déjà répondu à un sondage
 */
export function hasRespondedToSurvey(surveyId: string, anonymousId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const responses = localStorage.getItem(SURVEY_RESPONSES_KEY);
    if (!responses) return false;

    const responsesData = JSON.parse(responses);
    const key = `${surveyId}:${anonymousId}`;
    
    return !!responsesData[key];
  } catch (error) {
    console.error("[hasRespondedToSurvey] Error:", error);
    return false;
  }
}

/**
 * Marque qu'un utilisateur a répondu à un sondage
 */
export function markSurveyResponded(surveyId: string, anonymousId: string): void {
  if (typeof window === "undefined") return;

  try {
    const responses = localStorage.getItem(SURVEY_RESPONSES_KEY) || "{}";
    const responsesData = JSON.parse(responses);
    const key = `${surveyId}:${anonymousId}`;
    
    responsesData[key] = {
      surveyId,
      anonymousId,
      respondedAt: new Date().toISOString(),
    };

    localStorage.setItem(SURVEY_RESPONSES_KEY, JSON.stringify(responsesData));
  } catch (error) {
    console.error("[markSurveyResponded] Error:", error);
  }
}

/**
 * Récupère les réponses locales sauvegardées (fallback)
 */
export function getLocalResponses(surveyId: string): Record<string, any> | null {
  if (typeof window === "undefined") return null;

  try {
    const localResponses = localStorage.getItem(`gabstat_responses_${surveyId}`);
    return localResponses ? JSON.parse(localResponses) : null;
  } catch (error) {
    console.error("[getLocalResponses] Error:", error);
    return null;
  }
}

/**
 * Sauvegarde les réponses localement (fallback si DB unavailable)
 */
export function saveLocalResponses(surveyId: string, responses: Record<string, any>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(`gabstat_responses_${surveyId}`, JSON.stringify(responses));
  } catch (error) {
    console.error("[saveLocalResponses] Error:", error);
  }
}
