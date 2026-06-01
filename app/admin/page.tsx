"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Download } from "lucide-react";

export default function AdminPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [newSurvey, setNewSurvey] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleAddSurvey = () => {
    if (newSurvey.title && newSurvey.category) {
      setSurveys([...surveys, { ...newSurvey, id: Date.now() }]);
      setNewSurvey({ title: "", description: "", category: "" });
    }
  };

  const handleDeleteSurvey = (id: number) => {
    setSurveys(surveys.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Gérez les sondages et les utilisateurs</p>
          </div>
          <Link href="/admin/exports">
            <Button variant="primary" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exports
            </Button>
          </Link>
        </motion.div>

        {/* Create Survey Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Créer un nouveau sondage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    placeholder="Titre du sondage"
                    value={newSurvey.title}
                    onChange={(e) =>
                      setNewSurvey({ ...newSurvey, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    value={newSurvey.category}
                    onChange={(e) =>
                      setNewSurvey({ ...newSurvey, category: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-dark-700 bg-dark-800 px-3 py-2 text-base text-gray-100"
                  >
                    <option value="">Sélectionner</option>
                    <option>Coût de la vie</option>
                    <option>Emploi</option>
                    <option>Transport</option>
                    <option>Santé</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Description"
                    value={newSurvey.description}
                    onChange={(e) =>
                      setNewSurvey({ ...newSurvey, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleAddSurvey}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Surveys List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Sondages gérés</CardTitle>
              <CardDescription>{surveys.length} sondage(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {surveys.length === 0 ? (
                <p className="text-gray-400 py-8 text-center">
                  Aucun sondage créé
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-700">
                        <th className="px-4 py-2 text-left">Titre</th>
                        <th className="px-4 py-2 text-left">Catégorie</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {surveys.map((survey) => (
                        <tr key={survey.id} className="border-b border-dark-700">
                          <td className="px-4 py-2">{survey.title}</td>
                          <td className="px-4 py-2">{survey.category}</td>
                          <td className="px-4 py-2 text-gray-400">
                            {survey.description}
                          </td>
                          <td className="px-4 py-2 text-right flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {}}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteSurvey(survey.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
