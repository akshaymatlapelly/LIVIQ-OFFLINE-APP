import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VoiceAgentProvider } from './features/voice/VoiceAgentContext';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { InsightPage } from './pages/InsightPage';
import { MedSurePage } from './pages/MedSurePage';
import { HealTracePage } from './pages/HealTracePage';
import { FoodTracePage } from './pages/FoodTracePage';
import { YogaTracePage } from './pages/YogaTracePage';
import { GymTracePage } from './pages/GymTracePage';
import { SleepTracePage } from './pages/SleepTracePage';
import { HydrateTracePage } from './pages/HydrateTracePage';
import { ActivityTracePage } from './pages/ActivityTracePage';
import { PersonalBaselinePage } from './pages/PersonalBaselinePage';
import { HealthDriftPage } from './pages/HealthDriftPage';
import { HealthReplayPage } from './pages/HealthReplayPage';
import { ScanPage } from './pages/ScanPage';
import { ModesPage } from './pages/ModesPage';
import { HardwarePage } from './pages/HardwarePage';
import { DemoPage } from './pages/DemoPage';
import { ProfilePage } from './pages/ProfilePage';
import { HowItWorksPage } from './pages/HowItWorksPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <VoiceAgentProvider>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected LIVIQ Health Intelligence Shell */}
            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/insight" element={<InsightPage />} />
              <Route path="/medsure" element={<MedSurePage />} />
              <Route path="/healtrace" element={<HealTracePage />} />
              <Route path="/healtrace/foodtrace" element={<FoodTracePage />} />
              <Route path="/foodtrace" element={<FoodTracePage />} />
              <Route path="/healtrace/yogatrace" element={<YogaTracePage />} />
              <Route path="/yogatrace" element={<YogaTracePage />} />
              <Route path="/healtrace/gymtrace" element={<GymTracePage />} />
              <Route path="/gymtrace" element={<GymTracePage />} />
              <Route path="/healtrace/sleeptrace" element={<SleepTracePage />} />
              <Route path="/sleeptrace" element={<SleepTracePage />} />
              <Route path="/healtrace/hydratetrace" element={<HydrateTracePage />} />
              <Route path="/hydratetrace" element={<HydrateTracePage />} />
              <Route path="/healtrace/activitytrace" element={<ActivityTracePage />} />
              <Route path="/activitytrace" element={<ActivityTracePage />} />
              <Route path="/healtrace/baseline" element={<PersonalBaselinePage />} />
              <Route path="/baseline" element={<PersonalBaselinePage />} />
              <Route path="/healtrace/drift" element={<HealthDriftPage />} />
              <Route path="/drift" element={<HealthDriftPage />} />
              <Route path="/healtrace/replay" element={<HealthReplayPage />} />
              <Route path="/replay" element={<HealthReplayPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/medicine" element={<MedSurePage />} />
              <Route path="/auralens" element={<HealTracePage />} />
              <Route path="/history" element={<HealthReplayPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/modes" element={<ModesPage />} />
              <Route path="/hardware" element={<HardwarePage />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </VoiceAgentProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
