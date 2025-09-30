// FIX: Implemented the GeminiService to resolve module errors and provide API functionality.
import { GoogleGenAI, Type } from '@google/genai';
import type { DetectedComponent } from '../types';
import { GEMINI_FLASH_MODEL } from '../constants';

// The schema for component analysis, telling the model what JSON structure to output.
const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        components: {
            type: Type.ARRAY,
            description: "An array of computer components detected in the image.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The full, specific model name of the component (e.g., 'NVIDIA GeForce RTX 4090 Founders Edition')." },
                    type: { type: Type.STRING, description: "The general type of the component from this list: 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Cooling', 'Case'." },
                    confidence: { type: Type.NUMBER, description: "A confidence score from 0.0 to 1.0 indicating how certain the model is about the identification." },
                    short_summary: { type: Type.STRING, description: "A brief, one-sentence technical summary of the component's main purpose or key feature in Arabic." },
                    specs: {
                        type: Type.ARRAY,
                        description: "An array of key technical specifications. Do not translate the spec values.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING, description: "The label for the specification in Arabic (e.g., 'الشريحة', 'المقبس')." },
                                value: { type: Type.STRING, description: "The value of the specification (e.g., 'Z490', 'LGA 1200'). Do not translate this value." }
                            }
                        }
                    },
                    source: { type: Type.STRING, description: "A URL to the official product page or a highly reputable review/database (e.g., Tom's Hardware, TechPowerUp). If unknown, return 'unknown'." },
                }
            }
        }
    }
};


/**
 * GeminiService is a wrapper around the Google GenAI SDK to provide
 * specific functionality for the component detection application.
 */
export class GeminiService {
    private ai: GoogleGenAI;

    /**
     * Initializes the Gemini AI client.
     * Throws an error if the API key is not found in environment variables.
     */
    constructor() {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            // This error is caught in App.tsx and displayed as a toast.
            throw new Error("API key not configured. Please ensure VITE_GEMINI_API_KEY is set in your environment.");
        }
        this.ai = new GoogleGenAI({ apiKey });
    }

    /**
     * Generates a photorealistic image of a given computer component.
     * @param componentName The name of the component to generate an image for.
     * @returns A base64-encoded data URL for the generated image, or null if generation fails.
     */
    async generateComponentImage(componentName: string): Promise<string | null> {
        try {
            const response = await this.ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `A professional, high-quality, photorealistic image of a single computer component: "${componentName}". The component must be perfectly centered and isolated on a solid, non-reflective, dark slate gray background (#2C3E50). No text, logos, or other objects. The lighting should be soft and from the top-front. The composition should be horizontal.`,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '4:3',
                },
            });

            const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
            if (imageBytes) {
                return `data:image/jpeg;base64,${imageBytes}`;
            }
            return null;
        } catch (error) {
            console.error("Error generating image:", error);
            throw new Error("Failed to generate component image. The service may be busy or the request was blocked.");
        }
    }

    /**
     * Analyzes an image to detect computer components.
     * @param base64Data The base64-encoded image data.
     * @param mimeType The MIME type of the image.
     * @returns A promise that resolves to an array of detected components.
     */
    async analyzeImage(base64Data: string, mimeType: string): Promise<DetectedComponent[]> {
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: `مهمتك هي تحليل الصورة وتحديد مكونات الحاسب الآلي الداخلية فقط.
**قواعد صارمة:**
1.  **التركيز:** ركز فقط على المكونات الداخلية لجهاز كمبيوتر مكتبي أو محمول (مثل المعالج، بطاقة الرسوميات، اللوحة الأم، الذاكرة، وحدات التخزين، مزود الطاقة، المبرد).
2.  **التجاهل:** تجاهل تمامًا أي ملحقات خارجية (شاشات، لوحات مفاتيح)، كابلات، براغي، أو عناصر أخرى غير مرتبطة مباشرة بالمكونات.
3.  **اللغة:** المعلومات يجب أن تكون باللغة العربية، ولكن **لا تترجم مطلقًا** أسماء الموديلات والمصطلحات التقنية الأساسية (مثل NVIDIA GeForce RTX 4090, 24GB GDDR6X, LGA 1700, M.2).
4.  **الإخراج:** قم بإرجاع مصفوفة فارغة إذا لم يتم التعرف على أي مكونات مؤكدة.`,
        };
        
        try {
            const response = await this.ai.models.generateContent({
                model: GEMINI_FLASH_MODEL,
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: analysisSchema,
                    // Disable thinking for faster, more direct responses as per guidelines.
                    thinkingConfig: { thinkingBudget: 0 },
                },
            });
            
            const jsonText = response.text.trim();
            if (!jsonText) {
                return [];
            }
            
            const result = JSON.parse(jsonText);

            if (result && result.components && Array.isArray(result.components)) {
                // Add a unique ID to each component, which is required by the UI.
                return result.components.map((c: Omit<DetectedComponent, 'id'>) => ({
                    ...c,
                    id: `comp-${c.name.replace(/\s+/g, '-')}-${Math.random().toString(16).slice(2)}`,
                }));
            }
            return [];

        } catch (error) {
            console.error("Error analyzing image:", error);
            if (error instanceof SyntaxError) {
                 throw new Error("Failed to analyze image: The model returned invalid JSON.");
            }
            throw new Error("Failed to analyze image. The service may be busy or the request was blocked.");
        }
    }
}