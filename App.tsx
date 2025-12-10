import React, { useState, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Layout } from './components/Layout';
import { UploadStep } from './components/UploadStep';
import { StepWizard } from './components/StepWizard';
import { Gallery } from './components/Gallery';
import { Editor } from './components/Editor';
import { ProjectList } from './components/ProjectList';
import { AppStep, HeadshotFeatures, GeneratedImage, Project } from './types';
import { generateHeadshot } from './services/geminiService';
import { saveProject, getProjects } from './services/projectService';

const INITIAL_FEATURES: HeadshotFeatures = {
  vibe: '',
  attire: '',
  background: '',
  lighting: '',
  angle: 'Eye Level', // Default
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<{ base64: string, mimeType: string } | null>(null);
  const [features, setFeatures] = useState<HeadshotFeatures>(INITIAL_FEATURES);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null); // Track logged in user

  const resetToHome = () => {
    setStep(AppStep.UPLOAD);
    setShowLandingPage(true);
    setUploadedImage(null);
    setFeatures(INITIAL_FEATURES);
    setGeneratedImages([]);
    setSelectedImage(null);
  };

  const refreshProjects = useCallback((userId: string) => {
    const userProjects = getProjects(userId);
    setProjects(userProjects);
  }, []);

  const handleImageUpload = (base64: string, mimeType: string) => {
    setUploadedImage({ base64, mimeType });
    setShowLandingPage(false); // Ensure we are out of landing page
    setStep(AppStep.FEATURES);
  };

  const updateFeatures = (key: keyof HeadshotFeatures, value: any) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  const constructPrompt = useCallback(() => {
    const { vibe, attire, background, lighting, angle } = features;

    // The features here are the labels selected in StepWizard (e.g., "Classic Suit & Tie")
    // We compose them into a descriptive prompt for Gemini.
    return `
      Professional Vibe: ${vibe}
      Attire: ${attire}
      Background: ${background === 'Custom Upload' ? 'Use provided background image' : background}
      Lighting: ${lighting}
      Camera Angle: ${angle}
    `.trim();
  }, [features]);



  const performGeneration = async (explicitUser?: any) => {
    const currentUser = explicitUser || user;
    if (!uploadedImage) return;

    setStep(AppStep.GENERATION);
    setIsGenerating(true);
    setGeneratedImages([]);

    const prompt = constructPrompt();
    const numberOfVariations = 3;

    try {
      // Parallel requests for variations
      // If Custom Upload is selected, pass the custom background image
      const useCustomBackground = features.background === 'Custom Upload' && features.customBackground;

      const promises = Array(numberOfVariations).fill(null).map(() =>
        generateHeadshot(
          uploadedImage.base64,
          uploadedImage.mimeType,
          prompt,
          useCustomBackground ? features.customBackground : undefined
        )
      );

      const results = await Promise.allSettled(promises);

      const successImages: GeneratedImage[] = [];
      results.forEach(res => {
        if (res.status === 'fulfilled') {
          successImages.push(res.value);
        }
      });

      if (successImages.length === 0) {
        console.error("All generations failed");
        // Could handle error state here
      }

      setGeneratedImages(successImages);

      // Auto-save successful generations as projects if user is logged in
      if (currentUser && currentUser.id) {
        successImages.forEach(img => {
          saveProject(currentUser.id, img, features);
        });
        refreshProjects(currentUser.id);
      }

    } catch (error) {
      console.error("Fatal generation error", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch User Info to get the ID
        const userInfoMsg = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoMsg.json();

        setUser({ ...tokenResponse, ...userInfo, id: userInfo.sub }); // 'sub' is the unique Google ID

        // Load their projects
        refreshProjects(userInfo.sub);

        // If we are pending generation, do it
        if (uploadedImage) {
          performGeneration({ ...tokenResponse, ...userInfo, id: userInfo.sub });
        }
      } catch (e) {
        console.error("Failed to fetch user info", e);
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const handleShowProjects = () => {
    if (user && user.id) {
      refreshProjects(user.id);
      setStep(AppStep.PROJECTS);
      setShowLandingPage(false);
    } else {
      login();
    }
  };

  const handleGeneration = () => {
    if (user) {
      performGeneration();
    } else {
      login();
    }
  };

  // Update user ID reference in performGeneration if needed, but 'user' state is accessible in closure scope
  // Actually, performGeneration references 'user' which might be stale if called immediately after setting user in promise?
  // We should pass userId or rely on state update. State updates are async.
  // Ideally, performGeneration logic should be able to get userId passed to it.

  // NOTE: In the onSuccess above, we call performGeneration(). At that exact moment, 'user' state might not be updated yet in this closure. 
  // However, saving to project happens at the end of generation. By then, it might be updated? 
  // Dangerous. Let's pass user object to performGeneration or update logic to use a ref.
  // For simplicity, let's just make sure we check 'user' state carefully or pass it.

  // Refactor performGeneration to accept user object optionally



  const handleSelectImage = (img: GeneratedImage) => {
    setSelectedImage(img);
    setStep(AppStep.EDITOR);
  };

  const handleBackToGallery = () => {
    setSelectedImage(null);
    setStep(AppStep.GENERATION);
  };

  return (
    <Layout
      step={step}
      onLogoClick={resetToHome}
      onProjectsClick={handleShowProjects}
      showProjectsButton={true}
    >
      {step === AppStep.UPLOAD && (
        <UploadStep
          onImageUpload={handleImageUpload}
          showLandingPage={showLandingPage}
          onStart={() => setShowLandingPage(false)}
          onBackToLanding={() => setShowLandingPage(true)}
        />
      )}

      {step === AppStep.FEATURES && (
        <StepWizard
          features={features}
          updateFeatures={updateFeatures}
          onNext={handleGeneration}
          uploadedImagePreview={uploadedImage}
        />
      )}

      {step === AppStep.GENERATION && (
        <Gallery
          images={generatedImages}
          isGenerating={isGenerating}
          onSelect={handleSelectImage}
          onRegenerate={handleGeneration}
        />
      )}


      {step === AppStep.EDITOR && selectedImage && (
        <Editor
          initialImage={selectedImage}
          uploadedImage={uploadedImage}
          onBack={handleBackToGallery}
        />
      )}

      {step === AppStep.PROJECTS && user && (
        <ProjectList
          projects={projects}
          userId={user.id}
          onRefresh={() => refreshProjects(user.id)}
          onBack={() => {
            setStep(AppStep.UPLOAD);
            setShowLandingPage(true);
          }}
        />
      )}
    </Layout>
  );
};

export default App;