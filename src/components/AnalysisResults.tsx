import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, TrendingUp, BookOpen, BarChart3 } from "lucide-react";
import { AnalysisResult, AnalysisMode } from "@/lib/textAnalyzer";

interface AnalysisResultsProps {
  results: AnalysisResult;
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

const levelTextColors: { [key: string]: string } = {
  A1: "text-emerald-600",
  A2: "text-emerald-500",
  B1: "text-blue-500",
  B2: "text-indigo-500",
  C1: "text-purple-500",
  C2: "text-pink-500",
};

const AnalysisResults = ({ results, mode }: AnalysisResultsProps) => {
  const { detectedLevel, confidence, levelScores, vocabularyDistribution, grammarMetrics, generalStats, explanation } = results;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with detected level */}
      <Card className="p-8 shadow-xl border-2 text-center relative overflow-hidden animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-pink-500/5" />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Nivel Detectado</h2>
          </div>
          
          <Badge 
            className={`text-4xl md:text-5xl py-4 px-8 mb-4 ${levelColors[detectedLevel]} hover:${levelColors[detectedLevel]}`}
          >
            {detectedLevel}
          </Badge>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Confianza: <span className="font-semibold text-foreground">{confidence}</span>
            </p>
          </div>

          <Badge variant="outline" className="mb-4">
            {mode === "basic" ? "Análisis Básico (A1-A2)" : "Análisis Completo (A1-C2)"}
          </Badge>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {explanation}
          </p>
        </div>
      </Card>

      {/* Level Scores Distribution */}
      <Card className="p-6 shadow-lg border-2 animate-fade-in hover-scale transition-all duration-300" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Distribución de Puntuación por Nivel</h3>
        </div>
        
        <div className="space-y-4">
          {levelScores.map((levelScore, index) => (
            <div 
              key={levelScore.level} 
              className="animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold text-lg ${levelTextColors[levelScore.level]}`}>
                  {levelScore.level}
                </span>
                <span className="text-muted-foreground">
                  {levelScore.score}/25 ({levelScore.percentage}%)
                </span>
              </div>
              <Progress 
                value={levelScore.percentage} 
                className="h-3"
                style={{
                  // @ts-ignore
                  "--progress-background": `hsl(var(--level-${levelScore.level.toLowerCase()}))`,
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Vocabulary Distribution */}
      <Card className="p-6 shadow-lg border-2 animate-fade-in hover-scale transition-all duration-300" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Distribución de Vocabulario</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(vocabularyDistribution).map(([level, percentage]) => (
            <Card 
              key={level}
              className={`p-4 text-center border-2 transition-transform hover:scale-105 ${
                level === detectedLevel ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className={`text-3xl font-bold mb-2 ${levelTextColors[level]}`}>
                {percentage}%
              </div>
              <Badge className={`${levelColors[level]}`}>
                {level}
              </Badge>
            </Card>
          ))}
        </div>
      </Card>

      {/* Grammar Metrics (Complete Mode) */}
      {mode === "complete" && (
        <Card className="p-6 shadow-lg border-2 animate-fade-in hover-scale transition-all duration-300" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-2xl font-bold mb-6">Análisis Gramatical Completo</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              label="Subjuntivos" 
              value={grammarMetrics.subjunctiveCount} 
              suffix=""
            />
            <MetricCard 
              label="Voz Pasiva" 
              value={grammarMetrics.passiveVoiceCount} 
              suffix=""
            />
            <MetricCard 
              label="Tiempos Perfectos" 
              value={grammarMetrics.perfectTenseCount} 
              suffix=""
            />
            <MetricCard 
              label="Tasa Subordinación" 
              value={grammarMetrics.subordinationRate} 
              suffix=""
            />
            <MetricCard 
              label="Diversidad Léxica" 
              value={grammarMetrics.lexicalDiversity} 
              suffix="%"
            />
            <MetricCard 
              label="Palabras/Oración" 
              value={grammarMetrics.avgWordsPerSentence} 
              suffix=""
            />
            <MetricCard 
              label="Marcadores Discursivos" 
              value={grammarMetrics.discourseMarkers} 
              suffix=""
            />
            <MetricCard 
              label="Complejidad Puntuación" 
              value={grammarMetrics.punctuationComplexity} 
              suffix=""
            />
          </div>
        </Card>
      )}

      {/* General Statistics */}
      <Card className="p-6 shadow-lg border-2 animate-fade-in hover-scale transition-all duration-300" style={{ animationDelay: "0.4s" }}>
        <h3 className="text-2xl font-bold mb-6">Estadísticas Generales</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            label="Oraciones" 
            value={generalStats.totalSentences} 
            suffix=""
          />
          <MetricCard 
            label="Palabras Totales" 
            value={generalStats.totalWords} 
            suffix=""
          />
          <MetricCard 
            label="Palabras Únicas" 
            value={generalStats.uniqueWords} 
            suffix=""
          />
          <MetricCard 
            label="Longitud Promedio" 
            value={generalStats.avgWordLength} 
            suffix=" letras"
          />
        </div>
      </Card>
    </div>
  );
};

const MetricCard = ({ label, value, suffix }: { label: string; value: number; suffix: string }) => (
  <Card className="p-4 text-center border-2 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
    <div className="text-3xl font-bold text-primary mb-1">
      {value}{suffix}
    </div>
    <div className="text-sm text-muted-foreground">
      {label}
    </div>
  </Card>
);

export default AnalysisResults;
