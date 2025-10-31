import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GitCompare, ArrowRight } from "lucide-react";
import { analyzeText, AnalysisMode } from "@/lib/textAnalyzer";
import { Progress } from "@/components/ui/progress";

interface CompareTextsProps {
  mode: AnalysisMode;
}

const levelColors: { [key: string]: string } = {
  A1: "bg-emerald-600",
  A2: "bg-emerald-500",
  B1: "bg-blue-500",
  B2: "bg-indigo-500",
  C1: "bg-purple-500",
  C2: "bg-pink-500",
};

const CompareTexts = ({ mode }: CompareTextsProps) => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [comparison, setComparison] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = () => {
    if (!text1.trim() || !text2.trim()) return;

    setIsComparing(true);
    setTimeout(() => {
      const results1 = analyzeText(text1, mode);
      const results2 = analyzeText(text2, mode);

      setComparison({
        text1: { text: text1, results: results1 },
        text2: { text: text2, results: results2 },
      });
      setIsComparing(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <GitCompare className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Comparar Textos</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Texto 1</label>
            <Textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Escribe o pega el primer texto aquí..."
              className="min-h-[200px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Texto 2</label>
            <Textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Escribe o pega el segundo texto aquí..."
              className="min-h-[200px]"
            />
          </div>
        </div>

        <Button
          onClick={handleCompare}
          disabled={!text1.trim() || !text2.trim() || isComparing}
          className="w-full gap-2"
        >
          <GitCompare className="h-4 w-4" />
          {isComparing ? "Comparando..." : "Comparar Textos"}
        </Button>
      </Card>

      {comparison && (
        <Card className="p-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-6">Resultados de Comparación</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Texto 1 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Texto 1</h4>
                <Badge className={`${levelColors[comparison.text1.results.detectedLevel]}`}>
                  {comparison.text1.results.detectedLevel}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Palabras</span>
                  <span className="font-medium">{String(comparison.text1.results.generalStats.totalWords)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Oraciones</span>
                  <span className="font-medium">{comparison.text1.results.generalStats.totalSentences}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Diversidad Léxica</span>
                  <span className="font-medium">{comparison.text1.results.grammarMetrics.lexicalDiversity}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Palabras/Oración</span>
                  <span className="font-medium">{comparison.text1.results.grammarMetrics.avgWordsPerSentence}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confianza</span>
                  <span className="font-medium">{comparison.text1.results.confidence}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Distribución de Vocabulario:</p>
                {Object.entries(comparison.text1.results.vocabularyDistribution).map(([level, percentage]) => (
                  <div key={level} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{level}</span>
                      <span>{String(percentage)}%</span>
                    </div>
                    <Progress value={percentage as number} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Texto 2 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Texto 2</h4>
                <Badge className={`${levelColors[comparison.text2.results.detectedLevel]}`}>
                  {comparison.text2.results.detectedLevel}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Palabras</span>
                  <span className="font-medium">{String(comparison.text2.results.generalStats.totalWords)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Oraciones</span>
                  <span className="font-medium">{comparison.text2.results.generalStats.totalSentences}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Diversidad Léxica</span>
                  <span className="font-medium">{comparison.text2.results.grammarMetrics.lexicalDiversity}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Palabras/Oración</span>
                  <span className="font-medium">{comparison.text2.results.grammarMetrics.avgWordsPerSentence}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confianza</span>
                  <span className="font-medium">{comparison.text2.results.confidence}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Distribución de Vocabulario:</p>
                {Object.entries(comparison.text2.results.vocabularyDistribution).map(([level, percentage]) => (
                  <div key={level} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{level}</span>
                      <span>{String(percentage)}%</span>
                    </div>
                    <Progress value={percentage as number} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de diferencias */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3">Análisis Comparativo</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Diferencia de Nivel:</p>
                <p className="font-medium">
                  {comparison.text1.results.detectedLevel === comparison.text2.results.detectedLevel
                    ? "Ambos textos están en el mismo nivel"
                    : `Texto 1 (${comparison.text1.results.detectedLevel}) vs Texto 2 (${comparison.text2.results.detectedLevel})`}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Complejidad:</p>
                <p className="font-medium">
                  {comparison.text1.results.grammarMetrics.avgWordsPerSentence >
                  comparison.text2.results.grammarMetrics.avgWordsPerSentence
                    ? "Texto 1 tiene oraciones más largas"
                    : comparison.text1.results.grammarMetrics.avgWordsPerSentence <
                      comparison.text2.results.grammarMetrics.avgWordsPerSentence
                    ? "Texto 2 tiene oraciones más largas"
                    : "Ambos tienen longitud similar"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CompareTexts;
