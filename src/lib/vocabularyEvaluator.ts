export interface NivelEvaluacion {
  correctas: number;
  incorrectas: number;
  porcentaje: number;
}

export interface ResultadoEvaluacion {
  resultados: {
    PreA1: NivelEvaluacion;
    A1: NivelEvaluacion;
    A2: NivelEvaluacion;
  };
  nivelDetectado: string;
  porcentajeMayor: number;
  palabrasTotales: number;
  palabrasDetectadas: {
    PreA1: string[];
    A1: string[];
    A2: string[];
  };
}

interface VocabularioJSON {
  preA1: string[];
  A1: string[];
  A2: string[];
}

let vocabularioCache: VocabularioJSON | null = null;

const normalizarTexto = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, "");
};

const cargarVocabulario = async (): Promise<VocabularioJSON> => {
  if (vocabularioCache) {
    return vocabularioCache;
  }

  try {
    const response = await fetch("/data/vocabulario.json");
    if (!response.ok) {
      throw new Error("No se pudo cargar el vocabulario");
    }
    vocabularioCache = await response.json();
    return vocabularioCache!;
  } catch (error) {
    console.error("Error al cargar vocabulario:", error);
    throw error;
  }
};

export const evaluarTextoPorNiveles = async (
  texto: string
): Promise<ResultadoEvaluacion> => {
  const vocabulario = await cargarVocabulario();

  // Normalizar texto
  const textoNormalizado = normalizarTexto(texto);
  
  // Detectar palabras/frases del vocabulario que están presentes en el texto
  const detectarPalabras = (nivel: string[]): string[] => {
    const detectadas: string[] = [];
    nivel.forEach(item => {
      const itemNormalizado = normalizarTexto(item);
      if (textoNormalizado.includes(itemNormalizado)) {
        detectadas.push(item);
      }
    });
    return detectadas;
  };

  const palabrasPreA1 = detectarPalabras(vocabulario.preA1);
  const palabrasA1 = detectarPalabras(vocabulario.A1);
  const palabrasA2 = detectarPalabras(vocabulario.A2);

  const correctasPreA1 = palabrasPreA1.length;
  const correctasA1 = palabrasA1.length;
  const correctasA2 = palabrasA2.length;

  const totalPreA1 = vocabulario.preA1.length;
  const totalA1 = vocabulario.A1.length;
  const totalA2 = vocabulario.A2.length;

  const incorrectasPreA1 = totalPreA1 - correctasPreA1;
  const incorrectasA1 = totalA1 - correctasA1;
  const incorrectasA2 = totalA2 - correctasA2;

  const porcentajePreA1 = Math.round((correctasPreA1 / totalPreA1) * 100);
  const porcentajeA1 = Math.round((correctasA1 / totalA1) * 100);
  const porcentajeA2 = Math.round((correctasA2 / totalA2) * 100);

  // Determinar niveles presentes
  const nivelesPresentes = [];
  if (porcentajePreA1 > 0) nivelesPresentes.push("Pre-A1");
  if (porcentajeA1 > 0) nivelesPresentes.push("A1");
  if (porcentajeA2 > 0) nivelesPresentes.push("A2");

  // Determinar nivel predominante
  const niveles = [
    { nombre: "Pre-A1", porcentaje: porcentajePreA1 },
    { nombre: "A1", porcentaje: porcentajeA1 },
    { nombre: "A2", porcentaje: porcentajeA2 },
  ];

  const nivelPredominante = niveles.reduce((max, nivel) =>
    nivel.porcentaje > max.porcentaje ? nivel : max
  );

  const palabrasTotales = texto.trim().split(/\s+/).length;

  return {
    resultados: {
      PreA1: {
        correctas: correctasPreA1,
        incorrectas: incorrectasPreA1,
        porcentaje: porcentajePreA1,
      },
      A1: {
        correctas: correctasA1,
        incorrectas: incorrectasA1,
        porcentaje: porcentajeA1,
      },
      A2: {
        correctas: correctasA2,
        incorrectas: incorrectasA2,
        porcentaje: porcentajeA2,
      },
    },
    nivelDetectado: nivelesPresentes.length > 0 ? nivelesPresentes.join(", ") : nivelPredominante.nombre,
    porcentajeMayor: nivelPredominante.porcentaje,
    palabrasTotales,
    palabrasDetectadas: {
      PreA1: palabrasPreA1,
      A1: palabrasA1,
      A2: palabrasA2,
    },
  };
};
