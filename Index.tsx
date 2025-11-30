import React, { useState, useCallback, useEffect } from 'react';
import BulgariaMap from '@/components/BulgariaMap';
import QuizPopup from '@/components/QuizPopup';
import { regionsData } from '@/data/questions';
import { MapPin, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RegionResult {
  score: number;
  total: number;
}

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, RegionResult>>({});
  const [isClosing, setIsClosing] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const handleRegionClick = useCallback((regionId: string) => {
    if (regionsData[regionId]) {
      setSelectedRegion(regionId);
      setIsClosing(false);
    }
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedRegion(null);
      setIsClosing(false);
    }, 300);
  }, []);

  const handleComplete = useCallback((score: number, total: number) => {
    if (selectedRegion) {
      setResults((prev) => ({
        ...prev,
        [selectedRegion]: { score, total },
      }));
    }
    handleClosePopup();
  }, [selectedRegion, handleClosePopup]);

  const completedCount = Object.keys(results).length;
  const totalRegions = Object.keys(regionsData).length;
  const perfectCount = Object.values(results).filter((r) => r.score === r.total).length;
  const totalCorrect = Object.values(results).reduce((sum, r) => sum + r.score, 0);
  const totalQuestions = totalRegions * 3; // 28 regions × 3 questions

  useEffect(() => {
    if (completedCount === totalRegions && completedCount > 0) {
      setShowCompletionDialog(true);
    }
  }, [completedCount, totalRegions]);

  const handleRestart = () => {
    setResults({});
    setShowCompletionDialog(false);
  };

  return (
    <main className="relative w-full h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background via-background/80 to-transparent">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Познай България</h1>
              <p className="text-sm text-muted-foreground">Географски куиз</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="px-3 py-1.5 rounded-full bg-muted">
              <span className="text-muted-foreground">Завършени: </span>
              <span className="font-semibold text-foreground">{completedCount}/{totalRegions}</span>
            </div>
            {perfectCount > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-success/20">
                <span className="text-success font-semibold">🏆 {perfectCount}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="flex items-center justify-center w-full h-full p-8 pt-24">
        <BulgariaMap onRegionClick={handleRegionClick} results={results} />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-lg">
        <h3 className="text-sm font-semibold text-foreground mb-3">Легенда</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-map-perfect" />
            <span className="text-muted-foreground">3/3 правилни</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-map-good" />
            <span className="text-muted-foreground">2/3 правилни</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-map-poor" />
            <span className="text-muted-foreground">0-1/3 правилни</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 p-4 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-lg max-w-xs">
        <p className="text-sm text-muted-foreground">
          Кликнете върху област от картата, за да започнете куиз с въпроси за нея.
        </p>
      </div>

      {/* Quiz Popup */}
      {selectedRegion && regionsData[selectedRegion] && (
        <QuizPopup
          region={regionsData[selectedRegion]}
          onClose={handleClosePopup}
          onComplete={handleComplete}
          isClosing={isClosing}
        />
      )}

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-success/20">
                <Trophy className="w-12 h-12 text-success" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Браво! Ти завърши куиза
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">
                Отговорени правилно въпроси: <span className="font-bold text-foreground">{totalCorrect}/{totalQuestions}</span>
              </p>
              <p className="text-lg text-muted-foreground">
                Изцяло правилно отговорени въпроси за област: <span className="font-bold text-foreground">{perfectCount}/{totalRegions}</span>
              </p>
            </div>
          </div>

          <Button onClick={handleRestart} size="lg" className="w-full">
            Опитай пак
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Index;
