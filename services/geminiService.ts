import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, NANO_BANANA_MODEL } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a professional headshot based on an uploaded image and features.
 * Supports optional custom background image.
 */
export const generateHeadshot = async (
  baseImageBase64: string, 
  baseImageMimeType: string, 
  prompt: string,
  customBackground?: { base64: string; mimeType: string }
): Promise<GeneratedImage> => {
  try {
    const parts: any[] = [
      {
        inlineData: {
          mimeType: baseImageMimeType,
          data: baseImageBase64
        }
      }
    ];

    let textPrompt = '';

    if (customBackground) {
      // If custom background is provided, add it as the second image
      parts.push({
        inlineData: {
          mimeType: customBackground.mimeType,
          data: customBackground.base64
        }
      });

      textPrompt = `Task: Composite the person from the FIRST image into the background provided in the SECOND image.
CRITICAL INSTRUCTION: You MUST strictly preserve the person's face, facial structure, identity, and expression from the FIRST image. The face in the output must be recognizable as the exact same person. 
Changes allowed: Replace the outfit to match the target description, merge naturally with the SECOND image as background, and apply the requested lighting/angle.
Target Details: ${prompt}
Quality: Photorealistic, 8k resolution, highly detailed skin texture, professional studio photography.`;
    } else {
      // Standard generation with text description for background
      textPrompt = `Task: Retouch this photo to create a professional studio photo.
CRITICAL INSTRUCTION: You MUST strictly preserve the person's face, facial structure, identity, and expression from the source image. The face in the output must be recognizable as the exact same person. Do not generate a new face.
Changes allowed: Replace the outfit, background, and improve the lighting/quality.
Target Details: ${prompt}
Quality: Photorealistic, 8k resolution, highly detailed skin texture, professional studio photography.`;
    }

    // Add the text prompt to parts
    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: NANO_BANANA_MODEL,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates returned from Gemini.");
    }

    const responseParts = response.candidates[0].content?.parts;
    if (!responseParts) throw new Error("No content parts returned.");

    const imagePart = responseParts.find(p => p.inlineData);

    if (!imagePart || !imagePart.inlineData) {
        const textPart = responseParts.find(p => p.text);
        if (textPart) throw new Error(`Model returned text: ${textPart.text}`);
        throw new Error("No image data found in response.");
    }

    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      base64: imagePart.inlineData.data,
      promptUsed: prompt,
      mimeType: imagePart.inlineData.mimeType || 'image/png'
    };

  } catch (error) {
    console.error("Gemini Headshot Generation Error:", error);
    throw error;
  }
};

/**
 * Edits an existing image based on a text instruction.
 */
export const editHeadshot = async (
  originalImage: GeneratedImage, 
  instruction: string
): Promise<GeneratedImage> => {
  try {
    const response = await ai.models.generateContent({
      model: NANO_BANANA_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: originalImage.mimeType,
              data: originalImage.base64
            }
          },
          {
            text: `Edit this image: ${instruction}. 
IMPORTANT: Keep the person's face, identity, and facial features EXACTLY the same. Do not alter the facial structure.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates returned.");
    }

    const parts = response.candidates[0].content?.parts;
    if (!parts) throw new Error("No content parts.");

    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart || !imagePart.inlineData) {
         const textPart = parts.find(p => p.text);
         if (textPart) throw new Error(`Model returned text: ${textPart.text}`);
         throw new Error("No image found in edit response.");
    }

    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      base64: imagePart.inlineData.data,
      promptUsed: instruction,
      mimeType: imagePart.inlineData.mimeType || 'image/png'
    };

  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};