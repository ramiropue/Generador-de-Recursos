// netlify/functions/generate-sda.js

// Esta es la función principal que Netlify ejecutará.
exports.handler = async function(event, context) {
  // 1. Recoger los datos que nos envía el frontend.
  const {
    title,
    course,
    subject,
    competencies,
    saberes,
    methodology,
    product,
    contextDesc,
    sessions
  } = JSON.parse(event.body);

  // 2. Aquí es donde construiríamos el prompt detallado para la IA.
  // Por ahora, para esta prueba, vamos a devolver una respuesta simulada
  // pero estructurada como si viniera de la IA.
  // En el siguiente paso, reemplazaremos esto con la llamada real al API de Gemini.

  const simulatedAIResponse = {
    title: `Ciudad de Titanes: Descifrando las estructuras que nos sostienen`,
    justification: `Vivimos rodeados de estructuras: puentes, pabellones, edificios... Esta SDA conecta los saberes abstractos de la tecnología con el entorno tangible del alumnado, fomentando la autonomía y el pensamiento crítico.`,
    curricularConnection: {
      competencies: [
        "CE3. Aplicar de forma apropiada y segura distintas técnicas...",
        "CE5. Hacer un uso responsable y ético de la tecnología..."
      ],
      criteria: [
        "3.1. Construir o fabricar prototipos...",
        "5.1. Argumentar la elección de soluciones tecnológicas..."
      ],
      saberes: [
        "Estructuras: Elementos resistentes, tipos, esfuerzos...",
        "Materiales de uso técnico: Propiedades y clasificación...",
        "Fases de un proyecto de diseño..."
      ]
    },
    finalProduct: `El reto será crear una "Guía Interactiva de las Estructuras Notables de nuestra Ciudad", incluyendo análisis de 3 estructuras reales, una maqueta a escala y una presentación final.`,
    activities: [{
      title: "Sesión 1: El Desafío de los Titanes",
      description: "Presentación del proyecto, debate inicial y formación de grupos."
    }, {
      title: "Sesiones 2-4: Safari de Estructuras y Análisis",
      description: "Trabajo de campo, toma de fotografías y análisis de las estructuras elegidas."
    }, {
      title: "Sesiones 5-6: Operación Maqueta",
      description: "Taller de diseño y construcción de la maqueta en grupo."
    }, {
      title: "Sesiones 7-8: Expo-Estructuras",
      description: "Finalización de la guía interactiva y presentación final de los proyectos."
    }],
    rubric: [{
      criteria: "Análisis de Estructuras",
      levels: ["Identifica estructuras de forma superficial.", "El análisis es genérico o poco preciso.", "Analiza correctamente 3 estructuras.", "El análisis es detallado y usa vocabulario técnico."]
    }, {
      criteria: "Construcción de Maqueta",
      levels: ["La maqueta es inestable o inacabada.", "La maqueta es estable pero poco precisa.", "La maqueta es estable, funcional y precisa.", "La maqueta demuestra un alto nivel de detalle."]
    }]
  };


  // 3. Devolver la respuesta al frontend.
  return {
    statusCode: 200,
    body: JSON.stringify(simulatedAIResponse)
  };
};