/**
 * lib/exportUtils.ts — Utilitaires pour exporter les réponses des sondages
 */

export interface ExportFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  region?: string;
  province?: string;
  ville?: string;
  commune?: string;
  anonymousOnly?: boolean;
  connectedOnly?: boolean;
}

/**
 * Exporte les données en format CSV
 */
export function exportToCSV(data: any[], filename: string): void {
  // Headers
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Échappe les guillemets et les virgules
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? "";
        })
        .join(",")
    ),
  ].join("\n");

  // Créer un blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadFile(blob, `${filename}.csv`);
}

/**
 * Exporte les données en format Excel (XLSX)
 * Nécessite: npm install xlsx
 */
export async function exportToExcel(data: any[], filename: string): Promise<void> {
  try {
    // @ts-ignore - xlsx peut ne pas être installé
    const XLSX: any = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Réponses");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error("[exportToExcel] XLSX library not available:", error);
    throw new Error(
      "La librarie Excel n'est pas disponible. Utilisez CSV à la place."
    );
  }
}

/**
 * Exporte les données en format PDF
 * Nécessite: npm install jspdf html2canvas
 */
export async function exportToPDF(
  htmlContent: string,
  filename: string
): Promise<void> {
  try {
    // @ts-ignore - jspdf peut ne pas être installé
    const { jsPDF } = await import("jspdf");
    // @ts-ignore - html2canvas peut ne pas être installé
    const html2canvas = (await import("html2canvas")).default;

    // Créer un element temporaire
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    element.style.position = "absolute";
    element.style.left = "-9999px";
    document.body.appendChild(element);

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
    document.body.removeChild(element);
  } catch (error) {
    console.error("[exportToPDF] PDF library not available:", error);
    throw new Error(
      "La librarie PDF n'est pas disponible. Utilisez CSV à la place."
    );
  }
}

/**
 * Télécharge un fichier
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Formate les données de réponses pour l'export
 */
export function formatResponsesForExport(
  responses: any[],
  questions: any[]
): Record<string, any>[] {
  return responses.map((response) => {
    const row: Record<string, any> = {
      id: response.id,
      date: new Date(response.createdAt).toLocaleDateString("fr-GA"),
      utilisateur: response.user?.name || "Anonyme",
      email: response.user?.email || "-",
      province: response.region || "-",
    };

    // Ajouter les réponses aux questions
    response.answers?.forEach((answer: any) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question) {
        row[`Q: ${question.text}`] = answer.text;
      }
    });

    return row;
  });
}

/**
 * Génère un rapport HTML pour les statistiques
 */
export function generateStatisticsReport(
  survey: any,
  statistics: any
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #1a1a1a; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        .stat-row { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .stat-label { font-weight: bold; color: #333; }
        .stat-value { color: #0066cc; font-size: 18px; }
      </style>
    </head>
    <body>
      <h1>${survey.title}</h1>
      <p>${survey.description || ""}</p>
      
      <h2>Statistiques</h2>
      <div class="stat-row">
        <span class="stat-label">Total de réponses:</span>
        <span class="stat-value">${statistics.totalResponses || 0}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Taux de participation:</span>
        <span class="stat-value">${statistics.participationRate || 0}%</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Date de création:</span>
        <span class="stat-value">${new Date(survey.createdAt).toLocaleDateString("fr-GA")}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Date limite:</span>
        <span class="stat-value">${new Date(survey.endDate).toLocaleDateString("fr-GA")}</span>
      </div>
    </body>
    </html>
  `;
}
