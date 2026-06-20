import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { QuizProvider } from './context/QuizContext'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import LearnPage from './pages/LearnPage'
import LevelDetailPage from './pages/LevelDetailPage'
import FlashcardPage from './pages/FlashcardPage'
import GrammarDetailPage from './pages/GrammarDetailPage'
import DialoguePlayerPage from './pages/DialoguePlayerPage'
import QuizHomePage from './pages/QuizHomePage'
import QuizSessionPage from './pages/QuizSessionPage'
import QuizResultPage from './pages/QuizResultPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ExamPage from './pages/ExamPage'
import ExamSessionPage from './pages/ExamSessionPage'
import ExamResultPage from './pages/ExamResultPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <QuizProvider>
          <Routes>
            {/* Routes with bottom nav */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/quiz" element={<QuizHomePage />} />
              <Route path="/exam" element={<ExamPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            {/* Immersive routes without bottom nav */}
            <Route element={<AppLayout showNav={false} />}>
              <Route path="/learn/:level" element={<LevelDetailPage />} />
              <Route path="/learn/:level/vocab/:lessonId" element={<FlashcardPage />} />
              <Route path="/learn/:level/grammar/:id" element={<GrammarDetailPage />} />
              <Route path="/learn/:level/dialogue/:id" element={<DialoguePlayerPage />} />
              <Route path="/quiz/:level" element={<QuizHomePage />} />
              <Route path="/quiz/:level/play" element={<QuizSessionPage />} />
              <Route path="/quiz/:level/result" element={<QuizResultPage />} />
              <Route path="/exam/:level" element={<ExamPage />} />
              <Route path="/exam/:level/play" element={<ExamSessionPage />} />
              <Route path="/exam/:level/result" element={<ExamResultPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </QuizProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
