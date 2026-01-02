import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { EntropyData } from '@/lib/types';

interface EntropyChartProps {
  data: EntropyData;
}

export function EntropyChart({ data }: EntropyChartProps) {
  const getEntropyColor = (entropy: number) => {
    if (entropy >= 7.5) return 'hsl(0, 85%, 55%)'; // Red - likely packed/encrypted
    if (entropy >= 6.5) return 'hsl(38, 92%, 50%)'; // Orange - suspicious
    if (entropy >= 5) return 'hsl(45, 93%, 47%)'; // Yellow - moderate
    return 'hsl(142, 76%, 45%)'; // Green - normal
  };

  const chartData = data.sections.map((section) => ({
    name: section.name,
    entropy: section.entropy,
    size: section.size,
  }));

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Section Entropy</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Overall Entropy: <span className="font-mono text-primary">{data.overall.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-accent" />
            <span className="text-muted-foreground">Normal (&lt;5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-muted-foreground">Suspicious (6-7.5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span className="text-muted-foreground">Packed (&gt;7.5)</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
            />
            <YAxis
              domain={[0, 8]}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 96%)',
              }}
              formatter={(value: number) => [value.toFixed(2), 'Entropy']}
            />
            <Bar dataKey="entropy" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getEntropyColor(entry.entropy)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Entropy Warning */}
      {data.overall >= 7 && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
          <span className="font-medium text-destructive">⚠ High Entropy Detected:</span>{' '}
          <span className="text-muted-foreground">
            This file may be packed, encrypted, or compressed to evade detection.
          </span>
        </div>
      )}
    </div>
  );
}