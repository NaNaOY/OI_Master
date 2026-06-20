import { Layout } from '@/components/layout/Layout';
import { DailyPractice } from '@/pages/DailyPractice';
import { ProblemPage } from '@/pages/DailyPractice/ProblemPage';
import { Diagnosis } from '@/pages/Diagnosis';
import { DiagnosisReport } from '@/pages/Diagnosis/ReportPage';
import { DiagnosisTest } from '@/pages/Diagnosis/TestPage';
import { Home } from '@/pages/Home';
import { LearningPath } from '@/pages/LearningPath';
import { KnowledgeDetail } from '@/pages/LearningPath/KnowledgeDetail';
import { Mistakes } from '@/pages/Mistakes';
import { MistakeAnalysis } from '@/pages/Mistakes/AnalysisPage';
import { ParentReport } from '@/pages/ParentReport';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/diagnosis" element={<AnimatedPage><Diagnosis /></AnimatedPage>} />
          <Route path="/diagnosis/test/:level" element={<AnimatedPage><DiagnosisTest /></AnimatedPage>} />
          <Route path="/diagnosis/report/:id" element={<AnimatedPage><DiagnosisReport /></AnimatedPage>} />
          <Route path="/learning-path" element={<AnimatedPage><LearningPath /></AnimatedPage>} />
          <Route path="/learning-path/level/:level" element={<AnimatedPage><LearningPath /></AnimatedPage>} />
          <Route path="/learning-path/kp/:nodeId" element={<AnimatedPage><KnowledgeDetail /></AnimatedPage>} />
          <Route path="/daily" element={<AnimatedPage><DailyPractice /></AnimatedPage>} />
          <Route path="/daily/problem/:id" element={<AnimatedPage><ProblemPage /></AnimatedPage>} />
          <Route path="/mistakes" element={<AnimatedPage><Mistakes /></AnimatedPage>} />
          <Route path="/mistakes/:id" element={<AnimatedPage><MistakeAnalysis /></AnimatedPage>} />
          <Route path="/parent/report" element={<AnimatedPage><ParentReport /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};