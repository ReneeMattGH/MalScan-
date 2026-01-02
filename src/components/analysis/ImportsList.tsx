import { AlertTriangle, Box, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImportedFunction } from '@/lib/types';

interface ImportsListProps {
  imports: ImportedFunction[];
}

export function ImportsList({ imports }: ImportsListProps) {
  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Imported Functions</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {imports.length} DLLs • {imports.reduce((acc, i) => acc + i.functions.length, 0)} functions
        </p>
      </div>

      <div className="space-y-4">
        {imports.map((imp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-lg border ${
              imp.suspicious
                ? 'border-destructive/30 bg-destructive/5'
                : 'border-border/30 bg-secondary/20'
            }`}
          >
            {/* DLL Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    imp.suspicious ? 'bg-destructive/20' : 'bg-primary/10'
                  }`}
                >
                  <Box
                    className={`w-4 h-4 ${
                      imp.suspicious ? 'text-destructive' : 'text-primary'
                    }`}
                  />
                </div>
                <div>
                  <p className="font-mono font-medium text-foreground">{imp.dll}</p>
                  <p className="text-xs text-muted-foreground">
                    {imp.functions.length} functions imported
                  </p>
                </div>
              </div>
              {imp.suspicious && (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30">
                  <AlertTriangle className="w-3 h-3" />
                  Suspicious
                </span>
              )}
            </div>

            {/* Functions */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {imp.functions.map((func, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary/50 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FileCode className="w-3 h-3" />
                    {func}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}