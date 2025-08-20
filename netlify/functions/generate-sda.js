// netlify/functions/generate-sda.js

// Importamos el SDK de Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Esta es la función principal que Netlify ejecutará.
exports.handler = async function(event, context) {
    // Verificamos que la petición sea de tipo POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // 1. Recogemos los datos del frontend.
        const sdaData = JSON.parse(event.body);

        // 2. Construimos el prompt detallado para la IA.
        // Este prompt combina tus instrucciones originales en una sola petición.
        const prompt = `
            Actúa como un experto diseñador de situaciones de aprendizaje LOMLOE, creativo y pedagógicamente riguroso.
            Tu tarea es generar una Situación de Aprendizaje (SDA) completa basándote ESTRICTAMENTE en los siguientes datos proporcionados por un docente:

            - Título Provisional: "${sdaData.title}"
            - Curso: "${sdaData.course}"
            - Materia: "${sdaData.subject}"
            - Competencias Específicas a trabajar: ${sdaData.competencies.join(', ')}
            - Saberes Básicos a cubrir: ${sdaData.saberes.join(', ')}
            - Metodología Principal: "${sdaData.methodology}"
            - Producto Final o Reto: "${sdaData.product}"
            - Contexto del Alumnado: "${sdaData.contextDesc}"
            - Número de Sesiones: ${sdaData.sessions}

            Genera el contenido para cada una de las siguientes secciones. Es crucial que uses los siguientes separadores EXACTOS entre cada sección, sin añadir ningún otro texto o formato:

            ###TITULO###
            (Genera aquí un título final creativo y atractivo para la SDA)

            ###JUSTIFICACION###
            (Redacta aquí una justificación que conecte los saberes con el contexto y la relevancia para el alumnado)

            ###CONEXION_CURRICULAR###
            (Presenta aquí en formato de lista las competencias, criterios de evaluación derivados y saberes básicos seleccionados. Sé explícito y completo.)

            ###PRODUCTO_FINAL###
            (Describe aquí con más detalle el producto final o reto, haciéndolo atractivo para los estudiantes.)
            
            ###SECUENCIA_ACTIVIDADES###
            (Diseña aquí una secuencia de actividades detallada, dividida por sesiones. Para cada sesión, indica el título, una descripción de las actividades y la evaluación formativa.)

            ###RUBRICA###
            (Crea aquí una rúbrica de evaluación para el producto final en formato de tabla Markdown. La tabla debe tener 4 columnas: "Criterio", "Iniciado (1-4)", "En Proceso (5-6)", "Conseguido (7-8)" y "Experto (9-10)". Basa los criterios en las competencias seleccionadas.)
        `;

        // 3. Conectamos con la IA de Google
        // La API Key se obtiene de las variables de entorno de Netlify, es más seguro.
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        // 4. Procesamos la respuesta de la IA para convertirla en un objeto JSON
        const parsedResponse = parseAIResponse(aiText);

        // 5. Devolvemos la respuesta JSON al frontend
        return {
            statusCode: 200,
            body: JSON.stringify(parsedResponse)
        };

    } catch (error) {
        console.error("Error en la función de Netlify:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Ha ocurrido un error al generar la SDA." })
        };
    }
};

// Función auxiliar para parsear el texto de la IA usando los separadores
function parseAIResponse(text) {
    const sections = {};
    const parts = text.split(/###(TITULO|JUSTIFICACION|CONEXION_CURRICULAR|PRODUCTO_FINAL|SECUENCIA_ACTIVIDADES|RUBRICA)###/);
    
    for (let i = 1; i < parts.length; i += 2) {
        const key = parts[i].toLowerCase().replace(/_(\w)/g, (match, p1) => p1.toUpperCase());
        const value = parts[i + 1].trim();
        sections[key] = value;
    }

    // Simplificamos la estructura para que coincida con lo que espera el frontend
    return {
        title: sections.titulo,
        justification: sections.justificacion,
        // El frontend espera un objeto, pero aquí lo pasamos como texto.
        // El frontend tendrá que adaptar cómo muestra esta sección.
        curricularConnection: sections.conexionCurricular, 
        finalProduct: sections.productoFinal,
        activities: sections.secuenciaActividades, // Similar al anterior
        rubric: sections.rubrica // Similar al anterior
    };
}
