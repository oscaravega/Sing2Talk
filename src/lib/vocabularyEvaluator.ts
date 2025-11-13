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

  // Normalizar texto y dividir en palabras/frases
  const textoNormalizado = normalizarTexto(texto);
  
  // Normalizar vocabulario
  const vocabNormalizado = {
    preA1: vocabulario.preA1.map(normalizarTexto),
    A1: vocabulario.A1.map(normalizarTexto),
    A2: vocabulario.A2.map(normalizarTexto),
  };

  // Contar coincidencias por nivel
  const contarCoincidencias = (nivel: string[]): number => {
    let coincidencias = 0;
    nivel.forEach((palabra) => {
      if (textoNormalizado.includes(palabra)) {
        coincidencias++;
      }
    });
    return coincidencias;
  };

  const correctasPreA1 = contarCoincidencias(vocabNormalizado.preA1);
  const correctasA1 = contarCoincidencias(vocabNormalizado.A1);
  const correctasA2 = contarCoincidencias(vocabNormalizado.A2);

  const totalPreA1 = vocabulario.preA1.length;
  const totalA1 = vocabulario.A1.length;
  const totalA2 = vocabulario.A2.length;

  const incorrectasPreA1 = totalPreA1 - correctasPreA1;
  const incorrectasA1 = totalA1 - correctasA1;
  const incorrectasA2 = totalA2 - correctasA2;

  const porcentajePreA1 = Math.round((correctasPreA1 / totalPreA1) * 100);
  const porcentajeA1 = Math.round((correctasA1 / totalA1) * 100);
  const porcentajeA2 = Math.round((correctasA2 / totalA2) * 100);

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
    nivelDetectado: nivelPredominante.nombre,
    porcentajeMayor: nivelPredominante.porcentaje,
    palabrasTotales,
  };
};
