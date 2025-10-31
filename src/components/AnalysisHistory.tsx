import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Trash2, Eye } from "lucide-react";
import { AnalysisResult, AnalysisMode } from "@/lib/textAnalyzer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface HistoryEntry {
  id: string;
  date: string;
  text: string;
  mode: AnalysisMode;
  results: AnalysisResult;
}

interface AnalysisHistoryProps {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const levelColors: { [key: string]: string } = {
  A1: "bg-emerald-600",
  A2: "bg-emerald-500",
  B1: "bg-blue-500",
  B2: "bg-indigo-500",
  C1: "bg-purple-500",
  C2: "bg-pink-500",
};

const AnalysisHistory = ({ history, onLoad, onDelete, onClear }: AnalysisHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-6 text-center animate-fade-in">
        <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No hay análisis guardados</p>
        <p className="text-sm text-muted-foreground mt-2">
          Los análisis que realices se guardarán aquí automáticamente
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">Historial de Análisis</h3>
          <Badge variant="secondary">{history.length}</Badge>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onClear}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Limpiar Todo
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((entry) => (
            <Card
              key={entry.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${levelColors[entry.results.detectedLevel]}`}>
                      {entry.results.detectedLevel}
                    </Badge>
                    <Badge variant="outline">
                      {entry.mode === "basic" ? "Básico" : "Completo"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleString("es-MX", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {entry.text.substring(0, 100)}...
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Texto Completo</DialogTitle>
                        <DialogDescription>
                          {new Date(entry.date).toLocaleString("es-MX")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onLoad(entry)}
                  >
                    <History className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AnalysisHistory;
