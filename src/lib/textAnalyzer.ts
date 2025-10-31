export type AnalysisMode = "basic" | "complete";
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ConfidenceLevel = "Muy Alta" | "Alta" | "Media-Alta" | "Media" | "Baja";

export interface VocabularyDistribution {
  A1: number;
  A2: number;
  B1?: number;
  B2?: number;
  C1?: number;
  C2?: number;
}

export interface GrammarMetrics {
  subjunctiveCount: number;
  passiveVoiceCount: number;
  perfectTenseCount: number;
  subordinationRate: number;
  lexicalDiversity: number;
  avgWordsPerSentence: number;
  discourseMarkers: number;
  punctuationComplexity: number;
}

export interface LevelScore {
  level: CEFRLevel;
  score: number;
  percentage: number;
}

export interface AnalysisResult {
  detectedLevel: CEFRLevel;
  confidence: ConfidenceLevel;
  levelScores: LevelScore[];
  vocabularyDistribution: VocabularyDistribution;
  grammarMetrics: GrammarMetrics;
  generalStats: {
    totalWords: number;
    totalSentences: number;
    uniqueWords: number;
    avgWordLength: number;
  };
  explanation: string;
}

// Palabras funcionales comunes en todos los niveles (no se cuentan para ningún nivel específico)
const functionalWords = [
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "de", "del", "a", "al", "en", "con", "por", "para", "sin", "sobre",
  "y", "o", "pero", "que", "si", "como", "cuando", "donde",
  "me", "te", "se", "nos", "os", "le", "lo", "les",
  "mi", "tu", "su", "nuestro", "vuestro",
  "este", "ese", "aquel", "estos", "esos", "aquellos",
  "mas", "menos", "muy", "tan", "tanto"
];

// Vocabulary sets - MÁS EXTENSOS Y PRECISOS
const vocabularyA1 = [
  // Verbos básicos
  "yo", "tu", "el", "ella", "nosotros", "vosotros", "ellos", "ellas",
  "ser", "estar", "tener", "hacer", "ir", "ver", "venir", "dar", "llevar",
  // Sustantivos cotidianos
  "casa", "dia", "agua", "mesa", "libro", "perro", "gato", "nino", "nina", "persona", "ano",
  "amigo", "amiga", "familia", "madre", "padre", "hermano", "hermana", "escuela", "tiempo",
  "calle", "ciudad", "coche", "autobus", "tienda", "mercado", "comida", "pan", "leche",
  // Verbos de acción básicos
  "comer", "beber", "dormir", "vivir", "trabajar", "estudiar", "hablar", "escribir", "leer",
  "caminar", "correr", "mirar", "escuchar", "comprar", "vender", "abrir", "cerrar",
  // Adjetivos básicos
  "grande", "pequeno", "bueno", "malo", "nuevo", "viejo", "feliz", "triste",
  "blanco", "negro", "rojo", "azul", "verde", "amarillo", "alto", "bajo", "gordo", "flaco",
  // Números
  "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  // Tiempo básico
  "si", "no", "hoy", "ayer", "manana", "ahora", "aqui", "alli", "antes", "despues"
];

const vocabularyA2 = [
  // Verbos más complejos
  "saber", "querer", "poder", "deber", "pasar", "poner", "decir", "pensar", "creer", "sentir",
  "encontrar", "buscar", "esperar", "preguntar", "contestar", "responder", "explicar",
  "llamar", "empezar", "comenzar", "terminar", "acabar", "continuar", "seguir", "cambiar", "ayudar",
  // Sustantivos más abstractos
  "momento", "lugar", "parte", "trabajo", "hora", "semana", "mes", "cara", "pais", "mundo",
  "vida", "muerte", "problema", "idea", "cosa", "manera", "vez", "rato", "ejemplo",
  // Adjetivos intermedios
  "primero", "ultimo", "mismo", "todo", "cada", "otro", "alguno", "ningun",
  "facil", "dificil", "interesante", "aburrido", "importante", "necesario", "posible", "imposible",
  // Conectores básicos
  "siempre", "nunca", "jamas", "tambien", "tampoco", "quizas", "tal vez", "casi",
  "durante", "hasta", "desde", "todavia", "ya", "aun"
];

const vocabularyB1 = [
  // Verbos de nivel intermedio
  "entender", "comprender", "desarrollar", "alcanzar", "conseguir", "lograr", "obtener",
  "realizar", "crear", "producir", "ofrecer", "recibir", "permitir", "impedir",
  "recordar", "olvidar", "reconocer", "suponer", "imaginar", "demostrar",
  // Sustantivos conceptuales
  "forma", "manera", "modo", "razon", "causa", "efecto", "resultado", "consecuencia",
  "problema", "solucion", "situacion", "condicion", "estado", "proceso", "desarrollo",
  "sistema", "estructura", "organizacion", "funcion", "relacion", "comunicacion",
  "sociedad", "cultura", "educacion", "informacion", "conocimiento", "experiencia",
  // Adjetivos de comparación
  "mayor", "menor", "mejor", "peor", "superior", "inferior", "anterior", "posterior",
  "social", "economico", "politico", "cultural", "natural", "personal", "general", "particular",
  "diferente", "similar", "igual", "distinto", "comun", "raro", "normal", "especial",
  // Conectores avanzados
  "sin embargo", "por lo tanto", "ademas", "es decir", "por ejemplo", "en cambio"
];

const vocabularyB2 = [
  // Verbos académicos
  "establecer", "determinar", "definir", "demostrar", "confirmar", "verificar", "comprobar",
  "investigar", "analizar", "evaluar", "considerar", "examinar", "estudiar", "observar",
  "identificar", "clasificar", "comparar", "contrastar", "distinguir", "diferenciar",
  "interpretar", "valorar", "juzgar", "criticar", "argumentar", "debatir",
  // Sustantivos abstractos
  "concepto", "principio", "teoria", "metodo", "tecnica", "estrategia", "procedimiento",
  "analisis", "sintesis", "contexto", "perspectiva", "enfoque", "aspecto", "dimension",
  "fenomeno", "elemento", "factor", "criterio", "parametro", "variable", "indice",
  "tendencia", "patron", "modelo", "esquema", "marco", "ambito", "esfera",
  // Adjetivos técnicos
  "complejo", "simple", "especifico", "general", "abstracto", "concreto", "detallado",
  "fundamental", "esencial", "basico", "relevante", "significativo", "considerable", "notable",
  "implicito", "explicito", "evidente", "obvio", "claro", "preciso", "exacto", "riguroso",
  // Conectores discursivos
  "consecuentemente", "simultaneamente", "previamente", "posteriormente", "finalmente"
];

const vocabularyC1 = [
  // Verbos sofisticados
  "implementar", "optimizar", "consolidar", "materializar", "sintetizar", "articular",
  "discernir", "dilucidar", "esclarecer", "elucidar", "concebir", "postular", "formular",
  "configurar", "estructurar", "sistematizar", "fundamentar", "sustentar", "respaldar",
  "constatar", "corroborar", "ratificar", "refrendar", "sancionar", "avalar",
  "contemplar", "vislumbrar", "entrever", "percibir", "captar", "aprehender",
  // Sustantivos académicos avanzados
  "paradigma", "dicotomia", "ambivalencia", "dualidad", "prerrogativa", "idoneidad",
  "pertinencia", "convergencia", "divergencia", "congruencia", "coherencia", "cohesion",
  "parametrizacion", "conceptualizacion", "operacionalizacion", "categorizacion",
  "sistematizacion", "jerarquizacion", "priorizacion", "contextualizacion",
  // Adjetivos cultos
  "heterogeneo", "homogeneo", "intrinseco", "extrinseco", "inherente", "subyacente",
  "inequivoco", "ambiguo", "exhaustivo", "pormenorizado", "meticuloso", "escrupuloso",
  "plausible", "factible", "viable", "inviable", "perentorio", "impostergable",
  // Locuciones formales
  "no obstante", "en virtud de", "a fin de", "en aras de", "dado que", "en tanto que"
];

const vocabularyC2 = [
  // Verbos muy cultos
  "colegir", "inferir", "dimanar", "emanar", "menoscabar", "mermar", "subsanar", "paliar",
  "soslayar", "eludir", "refutar", "rebatir", "controvertir", "impugnar", "redargüir",
  "aquilatar", "ponderar", "sopesar", "calibrar", "aquilatar", "dirimir", "zanjar",
  // Sustantivos especializados
  "hermeneutica", "exegesis", "epistemologia", "ontologia", "fenomenologia", "axiologia",
  "idiosincrasia", "casuistica", "heuristica", "dialectica", "axiomatica", "teleologia",
  "prosapia", "hipostasis", "diatriba", "dicterio", "oprobio", "escarnio",
  // Adjetivos literarios/cultos
  "perenne", "sempiterno", "perpetuo", "pristino", "impoluto", "efimero", "fugaz",
  "inmutable", "inalterable", "verosimil", "factible", "mendaz", "falaz", "engañoso",
  "perspicaz", "sagaz", "agudo", "incisivo", "penetrante", "sutil", "refinado",
  "recalcitrante", "pertinaz", "contumaz", "discolo", "protervo", "avieso", "malevolo",
  // Locuciones muy formales
  "en tanto que", "habida cuenta", "a tenor de", "merced a", "so pena de", "a expensas de"
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function getWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function calculateVocabularyDistribution(
  words: string[],
  mode: AnalysisMode
): VocabularyDistribution {
  const normalized = words.map(normalizeText);
  const normalizedFunctional = functionalWords.map(normalizeText);
  
  // Filtrar palabras funcionales que no aportan nivel
  const contentWords = normalized.filter(w => !normalizedFunctional.includes(w) && w.length > 2);
  const total = contentWords.length || 1; // Evitar división por cero

  // Función mejorada: contar solo en el nivel más alto donde aparece la palabra
  const countedWords = new Set<string>();
  
  const countLevelExclusive = (vocab: string[], lowerLevels: string[][] = []) => {
    const normalizedVocab = vocab.map(normalizeText);
    const normalizedLower = lowerLevels.flat().map(normalizeText);
    
    return contentWords.filter(w => {
      if (countedWords.has(w)) return false; // Ya contada en nivel superior
      if (normalizedLower.includes(w)) return false; // Pertenece a nivel inferior
      if (normalizedVocab.includes(w)) {
        countedWords.add(w);
        return true;
      }
      return false;
    }).length;
  };

  let distribution: VocabularyDistribution;

  if (mode === "complete") {
    // Contar desde el nivel más alto hacia abajo
    const c2Count = countLevelExclusive(vocabularyC2);
    const c1Count = countLevelExclusive(vocabularyC1, [vocabularyC2]);
    const b2Count = countLevelExclusive(vocabularyB2, [vocabularyC2, vocabularyC1]);
    const b1Count = countLevelExclusive(vocabularyB1, [vocabularyC2, vocabularyC1, vocabularyB2]);
    const a2Count = countLevelExclusive(vocabularyA2, [vocabularyC2, vocabularyC1, vocabularyB2, vocabularyB1]);
    const a1Count = countLevelExclusive(vocabularyA1, [vocabularyC2, vocabularyC1, vocabularyB2, vocabularyB1, vocabularyA2]);

    distribution = {
      A1: Math.round((a1Count / total) * 100),
      A2: Math.round((a2Count / total) * 100),
      B1: Math.round((b1Count / total) * 100),
      B2: Math.round((b2Count / total) * 100),
      C1: Math.round((c1Count / total) * 100),
      C2: Math.round((c2Count / total) * 100),
    };
  } else {
    // Modo básico: solo A1 y A2
    const a2Count = countLevelExclusive(vocabularyA2);
    const a1Count = countLevelExclusive(vocabularyA1, [vocabularyA2]);

    distribution = {
      A1: Math.round((a1Count / total) * 100),
      A2: Math.round((a2Count / total) * 100),
    };
  }

  return distribution;
}

function detectGrammarFeatures(text: string): Partial<GrammarMetrics> {
  const normalized = normalizeText(text);

  // Subjunctive detection (simplified)
  const subjunctivePatterns = /\b(sea|seas|seamos|sean|haya|hayas|hayamos|hayan|fuera|fueras|fueramos|fueran)\b/g;
  const subjunctiveCount = (normalized.match(subjunctivePatterns) || []).length;

  // Passive voice detection
  const passivePatterns = /\b(ser|fue|sido|son|fueron|sera|seran)\s+\w+(ado|ido|to|so|cho)\b/g;
  const passiveVoiceCount = (normalized.match(passivePatterns) || []).length;

  // Perfect tense
  const perfectPatterns = /\b(he|has|ha|hemos|han|habia|habias|habiamos|habian)\s+\w+(ado|ido)\b/g;
  const perfectTenseCount = (normalized.match(perfectPatterns) || []).length;

  // Discourse markers
  const discoursePatterns = /\b(sin embargo|por lo tanto|ademas|es decir|no obstante|por consiguiente|en consecuencia)\b/g;
  const discourseMarkers = (normalized.match(discoursePatterns) || []).length;

  return {
    subjunctiveCount,
    passiveVoiceCount,
    perfectTenseCount,
    discourseMarkers,
  };
}

function calculateLexicalDiversity(words: string[]): number {
  const uniqueWords = new Set(words.map(normalizeText));
  return Math.round((uniqueWords.size / words.length) * 100);
}

function calculateSubordinationRate(sentences: string[]): number {
  const subordinators = ["que", "porque", "aunque", "cuando", "si", "donde", "como", "mientras"];
  let totalSubordinates = 0;

  sentences.forEach(sentence => {
    const normalized = normalizeText(sentence);
    subordinators.forEach(sub => {
      const regex = new RegExp(`\\b${sub}\\b`, "g");
      const matches = normalized.match(regex);
      if (matches) totalSubordinates += matches.length;
    });
  });

  return totalSubordinates / sentences.length;
}

function calculateLevelScores(
  sentences: string[],
  words: string[],
  vocabDist: VocabularyDistribution,
  grammar: GrammarMetrics,
  mode: AnalysisMode
): LevelScore[] {
  const avgWordsPerSentence = grammar.avgWordsPerSentence;
  const scores: { [key in CEFRLevel]?: number } = {};

  // A1 scoring - MEJORADO
  let a1Score = 0;
  if (avgWordsPerSentence <= 8) a1Score += 7;
  else if (avgWordsPerSentence <= 10) a1Score += 4;
  else if (avgWordsPerSentence > 15) a1Score -= 3; // Penalización por oraciones largas
  
  if (vocabDist.A1 >= 60) a1Score += 7;
  else if (vocabDist.A1 >= 40) a1Score += 4;
  else if (vocabDist.A1 >= 20) a1Score += 2;
  
  if (grammar.subordinationRate < 0.15) a1Score += 5;
  else if (grammar.subordinationRate > 0.5) a1Score -= 2;
  
  if (grammar.lexicalDiversity < 45) a1Score += 4;
  if (grammar.subjunctiveCount === 0 && grammar.passiveVoiceCount === 0) a1Score += 2;
  scores.A1 = Math.max(0, Math.min(a1Score, 25));

  // A2 scoring - MEJORADO
  let a2Score = 0;
  if (avgWordsPerSentence > 8 && avgWordsPerSentence <= 13) a2Score += 7;
  else if (avgWordsPerSentence <= 8) a2Score += 3;
  else if (avgWordsPerSentence > 18) a2Score -= 2;
  
  if (vocabDist.A2 >= 30) a2Score += 7;
  else if (vocabDist.A2 >= 15) a2Score += 4;
  
  const basicVocab = vocabDist.A1 + vocabDist.A2;
  if (basicVocab >= 70 && basicVocab < 95) a2Score += 5;
  else if (basicVocab >= 95) a2Score += 3; // Muy básico = más A1
  
  if (grammar.subordinationRate >= 0.2 && grammar.subordinationRate < 0.7) a2Score += 4;
  if (grammar.lexicalDiversity >= 45 && grammar.lexicalDiversity < 60) a2Score += 2;
  scores.A2 = Math.max(0, Math.min(a2Score, 25));

  if (mode === "complete") {
    // B1 scoring - MEJORADO
    let b1Score = 0;
    if (avgWordsPerSentence > 12 && avgWordsPerSentence <= 17) b1Score += 7;
    else if (avgWordsPerSentence > 10 && avgWordsPerSentence <= 20) b1Score += 4;
    
    if (vocabDist.B1! >= 25) b1Score += 7;
    else if (vocabDist.B1! >= 15) b1Score += 5;
    else if (vocabDist.B1! >= 8) b1Score += 3;
    
    if (grammar.subordinationRate >= 0.6 && grammar.subordinationRate < 1.3) b1Score += 5;
    if (grammar.lexicalDiversity >= 55 && grammar.lexicalDiversity < 70) b1Score += 3;
    if (grammar.subjunctiveCount > 0) b1Score += 2;
    if (grammar.discourseMarkers > 0) b1Score += 1;
    scores.B1 = Math.max(0, Math.min(b1Score, 25));

    // B2 scoring - MEJORADO
    let b2Score = 0;
    if (avgWordsPerSentence > 16 && avgWordsPerSentence <= 24) b2Score += 7;
    else if (avgWordsPerSentence > 14 && avgWordsPerSentence <= 28) b2Score += 4;
    
    if (vocabDist.B2! >= 25) b2Score += 8;
    else if (vocabDist.B2! >= 15) b2Score += 6;
    else if (vocabDist.B2! >= 8) b2Score += 3;
    
    if (grammar.subordinationRate >= 1.0 && grammar.subordinationRate < 2.0) b2Score += 5;
    if (grammar.lexicalDiversity >= 65 && grammar.lexicalDiversity < 80) b2Score += 3;
    if (grammar.subjunctiveCount >= 2) b2Score += 1;
    if (grammar.passiveVoiceCount >= 1) b2Score += 1;
    scores.B2 = Math.max(0, Math.min(b2Score, 25));

    // C1 scoring - MEJORADO
    let c1Score = 0;
    if (avgWordsPerSentence > 22 && avgWordsPerSentence <= 30) c1Score += 7;
    else if (avgWordsPerSentence > 20 && avgWordsPerSentence <= 35) c1Score += 4;
    
    if (vocabDist.C1! >= 20) c1Score += 8;
    else if (vocabDist.C1! >= 10) c1Score += 6;
    else if (vocabDist.C1! >= 5) c1Score += 3;
    
    if (grammar.subordinationRate >= 1.5) c1Score += 5;
    if (grammar.lexicalDiversity >= 75) c1Score += 3;
    if (grammar.subjunctiveCount >= 3) c1Score += 1;
    if (grammar.passiveVoiceCount >= 2) c1Score += 1;
    scores.C1 = Math.max(0, Math.min(c1Score, 25));

    // C2 scoring - MEJORADO
    let c2Score = 0;
    if (avgWordsPerSentence > 26) c2Score += 7;
    else if (avgWordsPerSentence > 24) c2Score += 4;
    
    if (vocabDist.C2! >= 15) c2Score += 9;
    else if (vocabDist.C2! >= 8) c2Score += 7;
    else if (vocabDist.C2! >= 4) c2Score += 4;
    
    if (grammar.subordinationRate >= 2.0) c2Score += 5;
    if (grammar.lexicalDiversity >= 82) c2Score += 2;
    if (grammar.subjunctiveCount >= 4) c2Score += 1;
    if (grammar.discourseMarkers >= 3) c2Score += 1;
    scores.C2 = Math.max(0, Math.min(c2Score, 25));
  }

  const levels: CEFRLevel[] = mode === "basic" 
    ? ["A1", "A2"] 
    : ["A1", "A2", "B1", "B2", "C1", "C2"];

  const levelScores: LevelScore[] = levels.map(level => ({
    level,
    score: scores[level] || 0,
    percentage: Math.round(((scores[level] || 0) / 25) * 100),
  }));

  return levelScores.sort((a, b) => b.score - a.score);
}

function determineConfidence(topScore: number, secondScore: number): ConfidenceLevel {
  const diff = topScore - secondScore;
  if (diff >= 12) return "Muy Alta";
  if (diff >= 8) return "Alta";
  if (diff >= 5) return "Media-Alta";
  if (diff >= 3) return "Media";
  return "Baja";
}

function getExplanation(level: CEFRLevel, mode: AnalysisMode): string {
  const explanations = {
    A1: "Este texto usa vocabulario muy básico y oraciones simples. Es perfecto para comenzar a aprender español escrito. Las oraciones son cortas y directas, con palabras de uso cotidiano.",
    A2: "El texto muestra un vocabulario más amplio que A1, con oraciones un poco más largas. Incluye algunas estructuras básicas pero ya empieza a combinar ideas. Adecuado para estudiantes que están progresando en español.",
    B1: "El texto demuestra control de estructuras comunes, con vocabulario más variado. Las oraciones están mejor conectadas y se usan algunos tiempos verbales complejos. Nivel intermedio.",
    B2: "Este texto muestra fluidez y naturalidad. Usa vocabulario específico, estructuras complejas, y conecta ideas de manera efectiva. El autor puede expresar ideas abstractas con claridad.",
    C1: "Texto avanzado con vocabulario sofisticado y estructuras gramaticales complejas. Muestra dominio de recursos lingüísticos variados y precisión en la expresión de ideas elaboradas.",
    C2: "Nivel de maestría. El texto demuestra control completo del idioma, con vocabulario muy avanzado, estructuras complejas perfectamente integradas, y expresión matizada de ideas abstractas.",
  };

  return explanations[level];
}

export function analyzeText(text: string, mode: AnalysisMode): AnalysisResult {
  const sentences = getSentences(text);
  const words = getWords(text);
  const uniqueWords = new Set(words.map(normalizeText)).size;
  
  const avgWordsPerSentence = sentences.length > 0 
    ? Math.round((words.length / sentences.length) * 10) / 10 
    : 0;
  
  const avgWordLength = words.length > 0
    ? Math.round((words.join("").length / words.length) * 10) / 10
    : 0;

  const lexicalDiversity = calculateLexicalDiversity(words);
  const subordinationRate = Math.round(calculateSubordinationRate(sentences) * 100) / 100;
  const grammarFeatures = detectGrammarFeatures(text);

  const grammarMetrics: GrammarMetrics = {
    subjunctiveCount: grammarFeatures.subjunctiveCount || 0,
    passiveVoiceCount: grammarFeatures.passiveVoiceCount || 0,
    perfectTenseCount: grammarFeatures.perfectTenseCount || 0,
    subordinationRate,
    lexicalDiversity,
    avgWordsPerSentence,
    discourseMarkers: grammarFeatures.discourseMarkers || 0,
    punctuationComplexity: Math.round((text.match(/[,:;]/g) || []).length / sentences.length * 10) / 10,
  };

  const vocabularyDistribution = calculateVocabularyDistribution(words, mode);
  const levelScores = calculateLevelScores(sentences, words, vocabularyDistribution, grammarMetrics, mode);
  
  const detectedLevel = levelScores[0].level;
  const confidence = determineConfidence(levelScores[0].score, levelScores[1].score);
  const explanation = getExplanation(detectedLevel, mode);

  return {
    detectedLevel,
    confidence,
    levelScores,
    vocabularyDistribution,
    grammarMetrics,
    generalStats: {
      totalWords: words.length,
      totalSentences: sentences.length,
      uniqueWords,
      avgWordLength,
    },
    explanation,
  };
}
