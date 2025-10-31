import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { AnalysisMode } from "@/lib/textAnalyzer";

interface ModeToggleProps {
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <Card className="p-6 shadow-xl border-2">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          Selecciona el modo de análisis
        </h2>
        <p className="text-muted-foreground">
          Elige entre análisis básico o completo según tu nivel
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Basic Mode */}
        <button
          onClick={() => onModeChange("basic")}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
            mode === "basic"
              ? "border-secondary bg-secondary/10 shadow-lg scale-105"
              : "border-border hover:border-secondary/50 hover:scale-102"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <BookOpen className={`h-8 w-8 transition-colors ${
              mode === "basic" ? "text-secondary" : "text-muted-foreground group-hover:text-secondary"
            }`} />
            {mode === "basic" && (
              <Badge className="bg-secondary">Activo</Badge>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2">Modo Básico</h3>
          <p className="text-sm font-semibold text-secondary mb-2">A1 - A2</p>
          
          <p className="text-sm text-muted-foreground mb-3">
            Perfecto para principiantes. Analiza solo los niveles básicos del español escrito.
          </p>
          
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>✓ Vocabulario fundamental</li>
            <li>✓ Oraciones simples</li>
            <li>✓ Métricas esenciales</li>
          </ul>

          <div className={`absolute inset-0 rounded-2xl transition-opacity ${
            mode === "basic" 
              ? "bg-gradient-to-br from-secondary/5 to-secondary/10 opacity-100" 
              : "opacity-0"
          }`} />
        </button>

        {/* Complete Mode */}
        <button
          onClick={() => onModeChange("complete")}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
            mode === "complete"
              ? "border-primary bg-primary/10 shadow-lg scale-105"
              : "border-border hover:border-primary/50 hover:scale-102"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <GraduationCap className={`h-8 w-8 transition-colors ${
              mode === "complete" ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            }`} />
            {mode === "complete" && (
              <Badge className="bg-primary">Activo</Badge>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2">Modo Completo</h3>
          <p className="text-sm font-semibold text-primary mb-2">A1 - C2</p>
          
          <p className="text-sm text-muted-foreground mb-3">
            Análisis detallado de todos los niveles del Marco Común Europeo.
          </p>
          
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>✓ 6 niveles completos</li>
            <li>✓ Análisis gramatical avanzado</li>
            <li>✓ Métricas exhaustivas</li>
          </ul>

          <div className={`absolute inset-0 rounded-2xl transition-opacity ${
            mode === "complete" 
              ? "bg-gradient-to-br from-primary/5 via-accent/5 to-pink-500/5 opacity-100" 
              : "opacity-0"
          }`} />
        </button>
      </div>
    </Card>
  );
};

export default ModeToggle;
