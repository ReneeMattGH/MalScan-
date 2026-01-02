import { useState } from 'react';
import { Search, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExtractedString } from '@/lib/types';
import { Input } from '@/components/ui/input';

interface StringsTableProps {
  strings: ExtractedString[];
}

const typeConfig = {
  url: { label: 'URL', color: 'text-primary' },
  ip: { label: 'IP Address', color: 'text-warning' },
  registry: { label: 'Registry', color: 'text-purple-400' },
  file: { label: 'File Path', color: 'text-blue-400' },
  suspicious: { label: 'Suspicious', color: 'text-destructive' },
  normal: { label: 'Normal', color: 'text-muted-foreground' },
};

export function StringsTable({ strings }: StringsTableProps) {
  const [search, setSearch] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filteredStrings = strings.filter(
    (s) =>
      s.value.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Extracted Strings</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {strings.length} strings found • {strings.filter((s) => s.type === 'suspicious').length} suspicious
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search strings..."
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Offset
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Value
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredStrings.map((str, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="hover:bg-secondary/30 transition-colors group"
              >
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                  {str.offset}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${typeConfig[str.type].color}`}
                  >
                    {str.type === 'suspicious' && <AlertTriangle className="w-3 h-3" />}
                    {typeConfig[str.type].label}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-sm text-foreground max-w-md truncate">
                  {str.value}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => copyToClipboard(str.value, idx)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-secondary transition-all"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-4 h-4 text-accent" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStrings.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No strings match your search criteria
        </div>
      )}
    </div>
  );
}