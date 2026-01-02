import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Network, FolderOpen, Database, Cpu, AlertTriangle, Filter } from 'lucide-react';
import { DynamicAnalysis as DynamicAnalysisType } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface DynamicAnalysisProps {
  data: DynamicAnalysisType;
}

type TabType = 'api' | 'network' | 'files' | 'registry' | 'processes';

const tabs = [
  { id: 'api' as const, label: 'API Calls', icon: Terminal, count: 0 },
  { id: 'network' as const, label: 'Network', icon: Network, count: 0 },
  { id: 'files' as const, label: 'File Operations', icon: FolderOpen, count: 0 },
  { id: 'registry' as const, label: 'Registry', icon: Database, count: 0 },
  { id: 'processes' as const, label: 'Processes', icon: Cpu, count: 0 },
];

export function DynamicAnalysis({ data }: DynamicAnalysisProps) {
  const [activeTab, setActiveTab] = useState<TabType>('api');
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(false);

  const tabCounts = {
    api: data.apiCalls.length,
    network: data.networkActivity.length,
    files: data.fileOperations.length,
    registry: data.registryOperations.length,
    processes: data.processes.length,
  };

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Dynamic Analysis</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Runtime behavior captured in sandbox environment
          </p>
        </div>
        <Button
          variant={showSuspiciousOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Suspicious Only
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/30 rounded-lg mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-secondary'
              }`}
            >
              {tabCounts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'api' && (
          <APICallsTable
            calls={
              showSuspiciousOnly
                ? data.apiCalls.filter((c) => c.suspicious)
                : data.apiCalls
            }
          />
        )}
        {activeTab === 'network' && <NetworkActivityTable activity={data.networkActivity} />}
        {activeTab === 'files' && (
          <FileOperationsTable
            operations={
              showSuspiciousOnly
                ? data.fileOperations.filter((o) => o.suspicious)
                : data.fileOperations
            }
          />
        )}
        {activeTab === 'registry' && (
          <RegistryOperationsTable
            operations={
              showSuspiciousOnly
                ? data.registryOperations.filter((o) => o.suspicious)
                : data.registryOperations
            }
          />
        )}
        {activeTab === 'processes' && (
          <ProcessesTable
            processes={
              showSuspiciousOnly
                ? data.processes.filter((p) => p.suspicious)
                : data.processes
            }
          />
        )}
      </div>
    </div>
  );
}

function APICallsTable({ calls }: { calls: DynamicAnalysisType['apiCalls'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Time</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">API</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Module</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Arguments</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Return</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {calls.map((call, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`hover:bg-secondary/30 ${call.suspicious ? 'bg-destructive/5' : ''}`}
            >
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{call.timestamp}</td>
              <td className="py-2 px-3 font-mono text-sm">
                <span className={call.suspicious ? 'text-destructive' : 'text-foreground'}>
                  {call.api}
                </span>
                {call.suspicious && <AlertTriangle className="inline w-3 h-3 ml-1 text-destructive" />}
              </td>
              <td className="py-2 px-3 text-sm text-muted-foreground">{call.module}</td>
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground max-w-xs truncate">
                {call.arguments.join(', ')}
              </td>
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{call.returnValue}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NetworkActivityTable({ activity }: { activity: DynamicAnalysisType['networkActivity'] }) {
  const typeColors = {
    dns: 'text-purple-400',
    http: 'text-primary',
    tcp: 'text-warning',
    udp: 'text-accent',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Time</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Type</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Destination</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Port</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {activity.map((net, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-secondary/30"
            >
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{net.timestamp}</td>
              <td className="py-2 px-3">
                <span className={`font-mono text-xs uppercase ${typeColors[net.type]}`}>{net.type}</span>
              </td>
              <td className="py-2 px-3 font-mono text-sm text-foreground">{net.destination}</td>
              <td className="py-2 px-3 font-mono text-sm text-muted-foreground">{net.port}</td>
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground max-w-xs truncate">
                {net.data || '-'}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FileOperationsTable({ operations }: { operations: DynamicAnalysisType['fileOperations'] }) {
  const opColors = {
    create: 'text-accent',
    modify: 'text-warning',
    delete: 'text-destructive',
    read: 'text-primary',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Time</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Operation</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Path</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {operations.map((op, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`hover:bg-secondary/30 ${op.suspicious ? 'bg-destructive/5' : ''}`}
            >
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{op.timestamp}</td>
              <td className="py-2 px-3">
                <span className={`font-mono text-xs uppercase ${opColors[op.operation]}`}>
                  {op.operation}
                </span>
              </td>
              <td className="py-2 px-3 font-mono text-sm text-foreground">
                {op.path}
                {op.suspicious && <AlertTriangle className="inline w-3 h-3 ml-2 text-destructive" />}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegistryOperationsTable({
  operations,
}: {
  operations: DynamicAnalysisType['registryOperations'];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Time</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Operation</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Key</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {operations.map((op, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`hover:bg-secondary/30 ${op.suspicious ? 'bg-destructive/5' : ''}`}
            >
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{op.timestamp}</td>
              <td className="py-2 px-3">
                <span className="font-mono text-xs uppercase text-warning">{op.operation}</span>
              </td>
              <td className="py-2 px-3 font-mono text-xs text-foreground max-w-md truncate">
                {op.key}
                {op.suspicious && <AlertTriangle className="inline w-3 h-3 ml-2 text-destructive" />}
              </td>
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{op.value || '-'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProcessesTable({ processes }: { processes: DynamicAnalysisType['processes'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">PID</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Parent PID</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Command Line</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {processes.map((proc, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`hover:bg-secondary/30 ${proc.suspicious ? 'bg-destructive/5' : ''}`}
            >
              <td className="py-2 px-3 font-mono text-sm text-muted-foreground">{proc.pid}</td>
              <td className="py-2 px-3 font-mono text-sm">
                <span className={proc.suspicious ? 'text-destructive' : 'text-foreground'}>
                  {proc.name}
                </span>
                {proc.suspicious && <AlertTriangle className="inline w-3 h-3 ml-1 text-destructive" />}
              </td>
              <td className="py-2 px-3 font-mono text-sm text-muted-foreground">{proc.parentPid}</td>
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground max-w-md truncate">
                {proc.commandLine}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}