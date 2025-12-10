
export enum AppStep {
  UPLOAD = 0,
  FEATURES = 1,
  GENERATION = 2,
  EDITOR = 3,
  PROJECTS = 4,
}

export interface HeadshotFeatures {
  vibe: string;      // e.g. Corporate, Startup, Creative
  attire: string;    // e.g. Navy Suit, Polo, Turtleneck
  background: string;// e.g. Blurred Office, Studio Grey, City, Custom Upload
  lighting: string;  // e.g. Softbox, Natural, Dramatic
  angle: string;     // e.g. Low Angle, High Angle, Eye Level
  customBackground?: {
    base64: string;
    mimeType: string;
  };
}

export interface GeneratedImage {
  id: string;
  base64: string;
  promptUsed: string;
  mimeType: string;
}

export interface Project {
  id: string;
  userId: string;
  createdAt: number;
  image: GeneratedImage;
  features: HeadshotFeatures;
}

export const NANO_BANANA_MODEL = 'gemini-2.5-flash-image';
