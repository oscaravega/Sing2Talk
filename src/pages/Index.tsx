import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, BookOpen, Eye, History, GitCompare } from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import AnalysisResults from "@/components/AnalysisResults";
import TipsSection from "@/components/TipsSection";
import ExportResults from "@/components/ExportResults";
import AnalysisHistory, { HistoryEntry } from "@/components/AnalysisHistory";
import CompareTexts from "@/components/CompareTexts";
import EvaluacionPorNiveles from "@/components/EvaluacionPorNiveles";
import { analyzeText, AnalysisMode, AnalysisResult } from "@/lib/textAnalyzer";
import { evaluarTextoPorNiveles, ResultadoEvaluacion } from "@/lib/vocabularyEvaluator";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [mode, setMode] = useState<AnalysisMode>("basic");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [evaluacionResultados, setEvaluacionResultados] = useState<ResultadoEvaluacion | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Cargar historial desde localStorage al montar
  useEffect(() => {
    const savedHistory = localStorage.getItem("analysis-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("analysis-history", JSON.stringify(history));
    }
  }, [history]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Campo vacío",
        description: "Por favor escribe o pega un texto para analizar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysisResults = analyzeText(text, mode);
      setResults(analysisResults);
      
      // Realizar evaluación por niveles
      const evaluacion = await evaluarTextoPorNiveles(text);
      setEvaluacionResultados(evaluacion);
      
      // Guardar en historial
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        text: text,
        mode: mode,
        results: analysisResults,
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 20)); // Máximo 20 entradas
      
      setIsAnalyzing(false);
      
      toast({
        title: "¡Análisis completado!",
        description: `Nivel detectado: ${analysisResults.detectedLevel}`,
      });
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Error en el análisis",
        description: "Ocurrió un error al evaluar el texto. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleLoadHistory = (entry: HistoryEntry) => {
    setText(entry.text);
    setMode(entry.mode);
    setResults(entry.results);
    toast({
      title: "Análisis cargado",
      description: "Se ha cargado el análisis del historial",
    });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Eliminado",
      description: "Análisis eliminado del historial",
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("analysis-history");
    toast({
      title: "Historial limpiado",
      description: "Se ha eliminado todo el historial",
    });
  };

  const placeholderText = mode === "basic"
    ? "Ejemplo: Hoy voy a la escuela. Mi profesora es amable. Tengo muchos amigos en mi clase."
    : "Ejemplo: La implementación de estrategias pedagógicas constituye un paradigma fundamental en el desarrollo educativo contemporáneo.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-complete-tertiary bg-clip-text text-transparent mb-3">
            Clasificador de Textos de Acuerdo a los Niveles MCER
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Clasificación según MCER • Diseñado para personas sordas que usan LSM
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-6 shadow-lg border-2 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <label className="block text-lg font-semibold mb-3 text-foreground">
            Escribe o pega el texto a analizar:
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholderText}
            className={`min-h-[200px] text-base resize-none transition-all duration-300 ${
              mode === "basic" 
                ? "focus-visible:ring-secondary focus-visible:border-secondary" 
                : "focus-visible:ring-primary focus-visible:border-primary"
            }`}
          />
          
          <div className="flex gap-3 mt-4 flex-wrap">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="lg"
              className={`flex-1 min-w-[200px] transition-all duration-300 ${
                mode === "basic"
                  ? "bg-secondary hover:bg-secondary/90"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" />
                  Analizar Texto
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setShowTips(!showTips)}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              {showTips ? "Ocultar" : "Ver"} Consejos
            </Button>
          </div>
        </Card>

        {/* Tips Section */}
        {showTips && (
          <div className="mb-6 animate-fade-in-up">
            <TipsSection />
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="animate-fade-in-up space-y-4 mb-6">
            <div className="flex justify-end">
              <ExportResults results={results} mode={mode} originalText={text} />
            </div>
            <AnalysisResults results={results} mode={mode} />
          </div>
        )}

        {/* Evaluación por Niveles */}
        {evaluacionResultados && (
          <div className="animate-fade-in-up mb-6">
            <EvaluacionPorNiveles resultado={evaluacionResultados} />
          </div>
        )}

        {/* Pestañas para Historial y Comparación */}
        <div className="mt-12">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Historial
              </TabsTrigger>
              <TabsTrigger value="compare" className="gap-2">
                <GitCompare className="h-4 w-4" />
                Comparar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-6">
              <AnalysisHistory
                history={history}
                onLoad={handleLoadHistory}
                onDelete={handleDeleteHistory}
                onClear={handleClearHistory}
              />
            </TabsContent>
            <TabsContent value="compare" className="mt-6">
              <CompareTexts mode={mode} />
            </TabsContent>
          </Tabs>
        </div>

        {/* How it works section */}
        {!results && (
          <Card className="p-6 bg-muted/50 border-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  ¿Cómo funciona?
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">A1</Badge>
                    <span>Vocabulario muy básico, oraciones cortas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">A2</Badge>
                    <span>Vocabulario ampliado, oraciones 8-12 palabras</span>
                  </li>
                  {mode === "complete" && (
                    <>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">B1-C2</Badge>
                        <span>Analiza vocabulario, gramática y estructura avanzada</span>
                      </li>
                    </>
                  )}
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 mt-1 text-accent" />
                    <span>Diseñado específicamente para personas sordas que usan LSM</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
