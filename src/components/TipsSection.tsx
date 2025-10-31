import { Card } from "@/components/ui/card";
import { Eye, BookOpen, RefreshCw, Trophy } from "lucide-react";

const TipsSection = () => {
  const tips = [
    {
      icon: Eye,
      title: "Aprendizaje Visual",
      description: "Como persona sorda, tu fuerza está en lo visual. Usa videos con subtítulos, diagramas y material gráfico para aprender español escrito.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      icon: BookOpen,
      title: "LSM es tu lengua materna",
      description: "La Lengua de Señas Mexicana es tu primer idioma. El español escrito es tu segunda lengua. No hay problema en que sean diferentes - ¡es normal!",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: RefreshCw,
      title: "Traducción LSM-Español",
      description: "La gramática de LSM es distinta al español. Practica traduciendo entre ambas lenguas para entender las diferencias de estructura.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      icon: Trophy,
      title: "Práctica Constante",
      description: "Usa esta herramienta regularmente. Empieza con textos A1 simples y ve progresando. Cada nivel que subes es un logro importante.",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950",
    },
  ];

  return (
    <Card className="p-6 shadow-lg border-2">
      <h3 className="text-2xl font-bold mb-6 text-center">
        💡 Consejos para Personas Sordas Aprendiendo Español
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <Card 
            key={index} 
            className={`p-5 border-2 ${tip.bgColor} animate-fade-in-up hover:scale-102 transition-transform`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex gap-4">
              <tip.icon className={`h-8 w-8 ${tip.color} flex-shrink-0`} />
              <div>
                <h4 className="font-bold text-lg mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
        <p className="text-center text-sm text-muted-foreground">
          <strong>Importante:</strong> Esta herramienta te ayuda a identificar el nivel de complejidad del español escrito. 
          Úsala para encontrar textos adecuados a tu nivel actual y monitorear tu progreso. 🎯
        </p>
      </div>
    </Card>
  );
};

export default TipsSection;
