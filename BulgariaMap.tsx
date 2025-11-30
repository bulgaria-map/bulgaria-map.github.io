import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import bulgariaMap from '@/assets/bulgaria-map.png';

interface RegionResult {
  score: number;
  total: number;
}

interface BulgariaMapProps {
  onRegionClick: (regionId: string) => void;
  results: Record<string, RegionResult>;
}

interface ClickableRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const getResultStyle = (result?: RegionResult) => {
  if (!result) return { bg: 'bg-transparent', border: 'border-transparent' };
  const ratio = result.score / result.total;
  if (ratio === 1) return { bg: 'bg-success/30', border: 'border-success' };
  if (ratio >= 0.66) return { bg: 'bg-warning/30', border: 'border-warning' };
  return { bg: 'bg-destructive/30', border: 'border-destructive' };
};

const BulgariaMap: React.FC<BulgariaMapProps> = ({ onRegionClick, results }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Precisely aligned with map region boundaries
  const regions: ClickableRegion[] = [
    // Northwest
    { id: 'vidin', name: 'Видин', x: 4, y: 10, width: 10, height: 15 },
    { id: 'montana', name: 'Монтана', x: 12, y: 20, width: 9, height: 12 },
    { id: 'vratsa', name: 'Враца', x: 18, y: 27, width: 10, height: 12 },
    
    // North central
    { id: 'pleven', name: 'Плевен', x: 28, y: 18, width: 16, height: 15 },
    { id: 'lovech', name: 'Ловеч', x: 29, y: 34, width: 14, height: 14 },
    
    // Northeast
    { id: 'velikoTarnovo', name: 'Велико Търново', x: 44, y: 29, width: 13, height: 12 },
    { id: 'gabrovo', name: 'Габрово', x: 42, y: 40, width: 11, height: 10 },
    { id: 'ruse', name: 'Русе', x: 50, y: 16, width: 12, height: 11 },
    { id: 'razgrad', name: 'Разград', x: 61, y: 21, width: 9, height: 9 },
    { id: 'targovishte', name: 'Търговище', x: 57, y: 29, width: 10, height: 10 },
    { id: 'silistra', name: 'Силистра', x: 64, y: 9, width: 14, height: 11 },
    { id: 'dobrich', name: 'Добрич', x: 78, y: 12, width: 14, height: 13 },
    { id: 'shumen', name: 'Шумен', x: 66, y: 27, width: 11, height: 12 },
    { id: 'varna', name: 'Варна', x: 73, y: 26, width: 14, height: 15 },
    
    // West - Sofia area
    { id: 'sofiaProvince', name: 'София (област)', x: 10, y: 35, width: 14, height: 13 },
    { id: 'pernik', name: 'Перник', x: 6, y: 47, width: 10, height: 11 },
    { id: 'sofiaCity', name: 'София', x: 16, y: 47, width: 6, height: 6 },
    
    // Southwest
    { id: 'kyustendil', name: 'Кюстендил', x: 6, y: 58, width: 12, height: 12 },
    { id: 'blagoevgrad', name: 'Благоевград', x: 10, y: 68, width: 14, height: 20 },
    
    // Central
    { id: 'pazardzhik', name: 'Пазарджик', x: 24, y: 58, width: 12, height: 13 },
    { id: 'plovdiv', name: 'Пловдив', x: 33, y: 55, width: 13, height: 14 },
    { id: 'smolyan', name: 'Смолян', x: 30, y: 74, width: 14, height: 14 },
    
    // East central
    { id: 'staraZagora', name: 'Стара Загора', x: 44, y: 51, width: 14, height: 14 },
    { id: 'sliven', name: 'Сливен', x: 56, y: 42, width: 13, height: 14 },
    
    // Southeast
    { id: 'haskovo', name: 'Хасково', x: 46, y: 67, width: 15, height: 13 },
    { id: 'kardzhali', name: 'Кърджали', x: 42, y: 78, width: 13, height: 12 },
    { id: 'yambol', name: 'Ямбол', x: 60, y: 55, width: 12, height: 13 },
    { id: 'burgas', name: 'Бургас', x: 68, y: 42, width: 20, height: 24 },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <img
        src={bulgariaMap}
        alt="Карта на България"
        className="w-full h-auto"
        draggable={false}
      />
      
      {regions.map((region) => {
        const result = results[region.id];
        const style = getResultStyle(result);
        const isHovered = hoveredRegion === region.id;
        const showCheckmark = result && result.score === result.total;

        return (
          <button
            key={region.id}
            onClick={() => onRegionClick(region.id)}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            className={cn(
              'absolute rounded-sm transition-all duration-200 border-2',
              result ? style.bg : 'bg-transparent',
              result ? style.border : 'border-transparent',
              isHovered && 'bg-primary/15 border-primary/40',
              'cursor-pointer'
            )}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            }}
            title={region.name}
          >
            {result && (
              <div className="absolute inset-0 flex items-center justify-center">
                {showCheckmark ? (
                  <div className="bg-card rounded-full p-1.5 shadow-lg border-2 border-success">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                ) : (
                  <div className="bg-card rounded-full px-2 py-1 shadow-lg text-xs font-bold text-foreground border border-border">
                    {result.score}/{result.total}
                  </div>
                )}
              </div>
            )}
            
            {isHovered && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card px-3 py-1 rounded-lg shadow-lg text-sm font-medium text-foreground whitespace-nowrap border border-border z-10">
                {region.name}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BulgariaMap;
