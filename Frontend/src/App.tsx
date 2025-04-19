import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/UI/LoadingScreen';

// Lazy-loaded pages
const InputPage = lazy(() => import('./pages/InputPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/analysis/:owner/:repo" element={<AnalysisPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;