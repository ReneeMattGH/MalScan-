import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OpcodeData } from '@/lib/types';

interface OpcodeHistogramProps {
  data: OpcodeData;
}

export function OpcodeHistogram({ data }: OpcodeHistogramProps) {
  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Opcode Distribution</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Most frequent assembly instructions detected in the binary
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.histogram}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
            />
            <YAxis
              type="category"
              dataKey="opcode"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 96%)',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Count']}
            />
            <Bar
              dataKey="count"
              fill="hsl(185, 100%, 50%)"
              radius={[0, 4, 4, 0]}
              background={{ fill: 'hsl(222, 30%, 12%)' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Opcode Sequences */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Notable Instruction Sequences</h4>
        <div className="space-y-2">
          {data.sequences.map((seq, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-secondary/50 font-mono text-xs text-muted-foreground overflow-x-auto"
            >
              {seq}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}