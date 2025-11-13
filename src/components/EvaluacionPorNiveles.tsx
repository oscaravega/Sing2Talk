import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { ResultadoEvaluacion } from "@/lib/vocabularyEvaluator";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface EvaluacionPorNivelesProps {
  resultado: ResultadoEvaluacion;
}

const nivelColors: { [key: string]: string } = {
  "Pre-A1": "bg-emerald-400",
  A1: "bg-emerald-600",
  A2: "bg-yellow-500",
};

const nivelTextColors: { [key: string]: string } = {
  "Pre-A1": "text-emerald-400",
  A1: "text-emerald-600",
  A2: "text-yellow-500",
};

const nivelHexColors: { [key: string]: string } = {
  "Pre-A1": "#4ADE80",
  A1: "#22C55E",
  A2: "#EAB308",
};

const EvaluacionPorNiveles = ({ resultado }: EvaluacionPorNivelesProps) => {
  const { resultados, nivelDetectado, porcentajeMayor } = resultado;

  // Preparar datos para el gráfico de pastel
  const pieData = Object.entries(resultados).map(([nivel, datos]) => ({
    name: nivel,
    value: datos.porcentaje,
    correctas: datos.correctas,
    incorrectas: datos.incorrectas,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con nivel detectado */}
      <Card className="p-8 shadow-xl border-2 text-center relative overflow-hidden animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-emerald-500/5" />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Evaluación por Niveles
            </h2>
          </div>

          <Badge
            className={`text-4xl md:text-5xl py-4 px-8 mb-4 ${
              nivelColors[nivelDetectado]
            } hover:${nivelColors[nivelDetectado]}`}
          >
            {nivelDetectado}
          </Badge>

          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Porcentaje mayor:{" "}
              <span className="font-semibold text-foreground">
                {porcentajeMayor}%
              </span>
            </p>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            El texto coincide principalmente con el nivel {nivelDetectado} según
            el vocabulario MCER
          </p>
        </div>
      </Card>

      {/* Tabla de resultados */}
      <Card className="p-6 shadow-lg border-2 animate-fade-in hover-scale transition-all duration-300">
        <h3 className="text-2xl font-bold mb-6">Resultados por Nivel</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 font-semibold">Nivel</th>
                <th className="text-center py-3 px-4 font-semibold">
                  Correctas
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  Incorrectas
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(resultados).map(([nivel, datos], index) => (
                <tr
                  key={nivel}
                  className="border-b border-border hover:bg-muted/50 transition-colors animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="py-4 px-4">
                    <Badge className={`${nivelColors[nivel]}`}>{nivel}</Badge>
                  </td>
                  <td className="text-center py-4 px-4 font-semibold text-emerald-600">
                    {datos.correctas}
                  </td>
                  <td className="text-center py-4 px-4 font-semibold text-red-500">
                    {datos.incorrectas}
                  </td>
                  <td className="text-center py-4 px-4">
                    <span
                      className={`text-xl font-bold ${nivelTextColors[nivel]}`}
                    >
                      {datos.porcentaje}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gráfico de Pastel */}
      <Card className="p-6 shadow-lg border-2 animate-fade-in hover-scale transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Distribución por Niveles</h3>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={nivelHexColors[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border-2 border-border rounded-lg p-4 shadow-lg">
                      <p className="font-bold text-lg mb-2">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Correctas: <span className="font-semibold text-emerald-600">{data.correctas}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Incorrectas: <span className="font-semibold text-red-500">{data.incorrectas}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Porcentaje: <span className="font-bold text-foreground">{data.value}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-foreground font-semibold">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfica de barras */}
      <Card className="p-6 shadow-lg border-2 animate-fade-in hover-scale transition-all duration-300">
        <h3 className="text-2xl font-bold mb-6">Distribución Visual</h3>

        <div className="space-y-4">
          {Object.entries(resultados).map(([nivel, datos], index) => (
            <div
              key={nivel}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${nivelColors[nivel]}`}>{nivel}</Badge>
                <span className="text-muted-foreground font-semibold">
                  {datos.porcentaje}%
                </span>
              </div>
              <Progress
                value={datos.porcentaje}
                className="h-4 transition-all duration-1000 ease-out"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EvaluacionPorNiveles;
