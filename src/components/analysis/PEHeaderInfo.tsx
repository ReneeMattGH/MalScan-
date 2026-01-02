import { PEHeader } from '@/lib/types';
import { FileCode, Clock, Cpu, Settings } from 'lucide-react';

interface PEHeaderInfoProps {
  header: PEHeader;
}

export function PEHeaderInfo({ header }: PEHeaderInfoProps) {
  const sections = [
    {
      title: 'Machine & Entry',
      icon: Cpu,
      items: [
        { label: 'Machine', value: header.machine },
        { label: 'Entry Point', value: header.entryPoint },
        { label: 'Image Base', value: header.imageBase },
        { label: 'Sections', value: header.numberOfSections.toString() },
      ],
    },
    {
      title: 'Alignment',
      icon: Settings,
      items: [
        { label: 'Section Alignment', value: `${header.sectionAlignment} bytes` },
        { label: 'File Alignment', value: `${header.fileAlignment} bytes` },
        { label: 'Subsystem', value: header.subsystem },
      ],
    },
    {
      title: 'Timestamp',
      icon: Clock,
      items: [
        { label: 'Compile Time', value: new Date(header.timestamp).toLocaleString() },
      ],
    },
  ];

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileCode className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">PE Header Information</h3>
          <p className="text-sm text-muted-foreground">Portable Executable metadata</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <section.icon className="w-4 h-4" />
              {section.title}
            </div>
            <div className="space-y-2">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="font-mono text-sm text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Characteristics */}
      <div className="mt-6 pt-6 border-t border-border/30">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Characteristics</h4>
        <div className="flex flex-wrap gap-2">
          {header.characteristics.map((char, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded bg-secondary/50 font-mono text-xs text-muted-foreground"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* DLL Characteristics */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">DLL Characteristics</h4>
        <div className="flex flex-wrap gap-2">
          {header.dllCharacteristics.map((char, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded bg-primary/10 font-mono text-xs text-primary"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}