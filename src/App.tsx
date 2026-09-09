import { useCallback, useState } from 'react';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import DecisionInputPage from '@/pages/DecisionInputPage';
import ProcessingPage from '@/pages/ProcessingPage';
import ResultsPage from '@/pages/ResultsPage';
import HistoryPage from '@/pages/HistoryPage';
import { computeFinancialResults, mockAnalysisResult } from '@/data/mockData';
import type { FinancialInputs, Page } from '@/types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [analysisResult, setAnalysisResult] = useState(mockAnalysisResult);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAnalyze = (decision: string, financials: FinancialInputs) => {
    setAnalysisResult({
      ...mockAnalysisResult,
      decisionTitle: decision,
      financialResults: computeFinancialResults(financials),
    });
    navigate('processing');
  };

  const handleViewAnalysis = () => {
    navigate('results');
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      {currentPage === 'landing' && (
        <LandingPage onNavigate={(page) => navigate(page)} />
      )}
      {currentPage === 'input' && (
        <DecisionInputPage
          onBack={() => navigate('landing')}
          onAnalyze={handleAnalyze}
        />
      )}
      {currentPage === 'processing' && (
        <ProcessingPage onComplete={() => navigate('results')} />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          result={analysisResult}
          onBack={() => navigate('history')}
        />
      )}
      {currentPage === 'history' && (
        <HistoryPage
          onViewAnalysis={handleViewAnalysis}
          onNewAnalysis={() => navigate('input')}
        />
      )}
    </div>
  );
}

export default App;
