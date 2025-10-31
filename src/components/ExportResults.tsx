import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText } from "lucide-react";
import { AnalysisResult, AnalysisMode } from "@/lib/textAnalyzer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ExportResultsProps {
  results: AnalysisResult;
  mode: AnalysisMode;
  originalText: string;
}

const ExportResults = ({ results, mode, originalText }: ExportResultsProps) => {
  const { toast } = useToast();

  const exportAsJSON = () => {
    const data = {
      fecha: new Date().toISOString(),
      modo: mode === "basic" ? "Básico (A1-A2)" : "Completo (A1-C2)",
      textoOriginal: originalText,
      resultados: results,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analisis-mcer-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado como JSON",
      description: "Los resultados se han descargado correctamente",
    });
  };

  const exportAsText = () => {
    let content = `ANÁLISIS DE TEXTO ESPAÑOL - MCER\n`;
    content += `Fecha: ${new Date().toLocaleString("es-MX")}\n`;
    content += `Modo: ${mode === "basic" ? "Básico (A1-A2)" : "Completo (A1-C2)"}\n`;
    content += `\n${"=".repeat(60)}\n\n`;
    content += `TEXTO ORIGINAL:\n${originalText}\n\n`;
    content += `${"=".repeat(60)}\n\n`;
    content += `NIVEL DETECTADO: ${results.detectedLevel}\n`;
    content += `CONFIANZA: ${results.confidence}\n\n`;
    content += `EXPLICACIÓN:\n${results.explanation}\n\n`;
    content += `${"=".repeat(60)}\n\n`;
    content += `PUNTUACIONES POR NIVEL:\n`;
    results.levelScores.forEach(ls => {
      content += `  ${ls.level}: ${ls.score}/25 (${ls.percentage}%)\n`;
    });
    content += `\n${"=".repeat(60)}\n\n`;
    content += `DISTRIBUCIÓN DE VOCABULARIO:\n`;
    Object.entries(results.vocabularyDistribution).forEach(([level, percentage]) => {
      content += `  ${level}: ${percentage}%\n`;
    });
    content += `\n${"=".repeat(60)}\n\n`;
    
    if (mode === "complete") {
      content += `ANÁLISIS GRAMATICAL:\n`;
      content += `  Subjuntivos: ${results.grammarMetrics.subjunctiveCount}\n`;
      content += `  Voz Pasiva: ${results.grammarMetrics.passiveVoiceCount}\n`;
      content += `  Tiempos Perfectos: ${results.grammarMetrics.perfectTenseCount}\n`;
      content += `  Tasa Subordinación: ${results.grammarMetrics.subordinationRate}\n`;
      content += `  Diversidad Léxica: ${results.grammarMetrics.lexicalDiversity}%\n`;
      content += `  Palabras/Oración: ${results.grammarMetrics.avgWordsPerSentence}\n`;
      content += `  Marcadores Discursivos: ${results.grammarMetrics.discourseMarkers}\n`;
      content += `  Complejidad Puntuación: ${results.grammarMetrics.punctuationComplexity}\n\n`;
    }
    
    content += `${"=".repeat(60)}\n\n`;
    content += `ESTADÍSTICAS GENERALES:\n`;
    content += `  Oraciones: ${results.generalStats.totalSentences}\n`;
    content += `  Palabras Totales: ${results.generalStats.totalWords}\n`;
    content += `  Palabras Únicas: ${results.generalStats.uniqueWords}\n`;
    content += `  Longitud Promedio: ${results.generalStats.avgWordLength} letras\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analisis-mcer-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado como Texto",
      description: "Los resultados se han descargado correctamente",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 animate-fade-in">
          <Download className="h-4 w-4" />
          Exportar Resultados
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsJSON} className="gap-2 cursor-pointer">
          <FileJson className="h-4 w-4" />
          Exportar como JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Exportar como Texto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportResults;
