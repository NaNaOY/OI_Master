import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Diagnosis } from '@/pages/Diagnosis';
import { DiagnosisTest } from '@/pages/Diagnosis/TestPage';
import { DiagnosisReport } from '@/pages/Diagnosis/ReportPage';
import { LearningPath } from '@/pages/LearningPath';
import { KnowledgeDetail } from '@/pages/LearningPath/KnowledgeDetail';
import { DailyPractice } from '@/pages/DailyPractice';
import { ProblemPage } from '@/pages/DailyPractice/ProblemPage';
import { Mistakes } from '@/pages/Mistakes';
import { MistakeAnalysis } from '@/pages/Mistakes/AnalysisPage';
import { ParentReport } from '@/pages/ParentReport';

export const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/diagnosis/test/:level" element={<DiagnosisTest />} />
        <Route path="/diagnosis/report/:id" element={<DiagnosisReport />} />
        <Route path="/learning-path" element={<LearningPath />} />
        <Route path="/learning-path/:nodeId" element={<KnowledgeDetail />} />
        <Route path="/daily" element={<DailyPractice />} />
        <Route path="/daily/problem/:id" element={<ProblemPage />} />
        <Route path="/mistakes" element={<Mistakes />} />
        <Route path="/mistakes/:id" element={<MistakeAnalysis />} />
        <Route path="/parent/report" element={<ParentReport />} />
      </Routes>
    </Layout>
  );
};