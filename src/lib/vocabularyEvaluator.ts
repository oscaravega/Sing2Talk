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

  // Normalizar texto
  const textoNormalizado = normalizarTexto(texto);
  const palabrasTexto = textoNormalizado.split(/\s+/);
  
  // Crear sets de palabras por nivel (dividiendo frases en palabras)
  const crearSetPalabras = (frases: string[]): Set<string> => {
    const palabras = new Set<string>();
    frases.forEach(frase => {
      const fraseLimpia = normalizarTexto(frase);
      // Agregar la frase completa
      palabras.add(fraseLimpia);
      // Agregar palabras individuales
      fraseLimpia.split(/\s+/).forEach(palabra => {
        if (palabra.length > 0) {
          palabras.add(palabra);
        }
      });
    });
    return palabras;
  };

  const vocabPreA1 = crearSetPalabras(vocabulario.preA1);
  const vocabA1 = crearSetPalabras(vocabulario.A1);
  const vocabA2 = crearSetPalabras(vocabulario.A2);

  // Contar coincidencias
  const contarCoincidencias = (vocabSet: Set<string>): number => {
    let coincidencias = 0;
    
    // Verificar palabras individuales
    palabrasTexto.forEach(palabra => {
      if (vocabSet.has(palabra)) {
        coincidencias++;
      }
    });
    
    // Verificar frases completas en el texto
    vocabSet.forEach(item => {
      if (item.includes(' ') && textoNormalizado.includes(item)) {
        // Dar peso extra a frases completas
        coincidencias += item.split(/\s+/).length;
      }
    });
    
    return coincidencias;
  };

  const correctasPreA1 = contarCoincidencias(vocabPreA1);
  const correctasA1 = contarCoincidencias(vocabA1);
  const correctasA2 = contarCoincidencias(vocabA2);

  const totalPreA1 = vocabulario.preA1.length;
  const totalA1 = vocabulario.A1.length;
  const totalA2 = vocabulario.A2.length;

  const incorrectasPreA1 = Math.max(0, totalPreA1 - correctasPreA1);
  const incorrectasA1 = Math.max(0, totalA1 - correctasA1);
  const incorrectasA2 = Math.max(0, totalA2 - correctasA2);

  // Calcular porcentajes basados en la presencia de vocabulario
  const porcentajePreA1 = Math.min(100, Math.round((correctasPreA1 / totalPreA1) * 100));
  const porcentajeA1 = Math.min(100, Math.round((correctasA1 / totalA1) * 100));
  const porcentajeA2 = Math.min(100, Math.round((correctasA2 / totalA2) * 100));

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
  };
};
