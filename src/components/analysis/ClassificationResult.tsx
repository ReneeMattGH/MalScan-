import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { MalwareClassification } from '@/lib/types';

interface ClassificationResultProps {
  classification: MalwareClassification;
  threatLevel: string;
}

export function ClassificationResult({ classification, threatLevel }: ClassificationResultProps) {
  const allFamilies = [
    { family: classification.family, confidence: classification.confidence },
    ...classification.alternativeFamilies,
  ];

  const chartData = allFamilies.map((f) => ({
    name: f.family,
    confidence: Math.round(f.confidence * 100),
  }));

  const getBarColor = (confidence: number) => {
    if (confidence >= 80) return 'hsl(0, 85%, 55%)';
    if (confidence >= 60) return 'hsl(38, 92%, 50%)';
    return 'hsl(45, 93%, 47%)';
  };

  const isClean = threatLevel === 'clean';

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Main Classification */}
      <div className="flex items-start gap-6 mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className={`w-24 h-24 rounded-2xl flex items-center justify-center ${
            isClean
              ? 'bg-accent/10 glow-green'
              : 'bg-destructive/10 glow-red'
          }`}
        >
          {isClean ? (
            <CheckCircle className="w-12 h-12 text-accent" />
          ) : (
            <AlertTriangle className="w-12 h-12 text-destructive" />
          )}
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-foreground">
              {classification.family}
            </h2>
            {!isClean && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-destructive/20 text-destructive border border-destructive/30">
                {Math.round(classification.confidence * 100)}% Confidence
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {classification.description}
          </p>
        </div>
      </div>

      {/* Confidence Chart */}
      {!isClean && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Classification Probabilities</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 96%)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Confidence']}
                />
                <Bar dataKey="confidence" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.confidence)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Indicators */}
      {classification.indicators.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Behavioral Indicators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {classification.indicators.map((indicator, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30 border border-border/30"
              >
                <div className="w-2 h-2 mt-1.5 rounded-full bg-destructive flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{indicator}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}