export interface ScanResult {
  id: string;
  fileName: string;
  fileSize: number;
  fileHash: string;
  uploadedAt: Date;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  threatLevel: 'clean' | 'low' | 'medium' | 'high' | 'critical';
  malwareFamily?: string;
  confidence?: number;
  staticAnalysis?: StaticAnalysis;
  dynamicAnalysis?: DynamicAnalysis;
}

export interface StaticAnalysis {
  peHeader: PEHeader;
  strings: ExtractedString[];
  imports: ImportedFunction[];
  entropy: EntropyData;
  opcodes: OpcodeData;
}

export interface PEHeader {
  machine: string;
  numberOfSections: number;
  timestamp: string;
  characteristics: string[];
  subsystem: string;
  dllCharacteristics: string[];
  entryPoint: string;
  imageBase: string;
  sectionAlignment: number;
  fileAlignment: number;
}

export interface ExtractedString {
  value: string;
  type: 'url' | 'ip' | 'registry' | 'file' | 'suspicious' | 'normal';
  offset: string;
}

export interface ImportedFunction {
  dll: string;
  functions: string[];
  suspicious: boolean;
}

export interface EntropyData {
  overall: number;
  sections: {
    name: string;
    entropy: number;
    size: number;
    virtualSize: number;
  }[];
}

export interface OpcodeData {
  histogram: {
    opcode: string;
    count: number;
  }[];
  sequences: string[];
}

export interface DynamicAnalysis {
  apiCalls: APICall[];
  networkActivity: NetworkActivity[];
  fileOperations: FileOperation[];
  registryOperations: RegistryOperation[];
  processes: ProcessInfo[];
}

export interface APICall {
  timestamp: string;
  api: string;
  module: string;
  arguments: string[];
  returnValue: string;
  suspicious: boolean;
}

export interface NetworkActivity {
  timestamp: string;
  type: 'dns' | 'http' | 'tcp' | 'udp';
  destination: string;
  port: number;
  data?: string;
}

export interface FileOperation {
  timestamp: string;
  operation: 'create' | 'modify' | 'delete' | 'read';
  path: string;
  suspicious: boolean;
}

export interface RegistryOperation {
  timestamp: string;
  operation: 'create' | 'modify' | 'delete' | 'query';
  key: string;
  value?: string;
  suspicious: boolean;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  parentPid: number;
  commandLine: string;
  suspicious: boolean;
}

export interface MalwareClassification {
  family: string;
  confidence: number;
  alternativeFamilies: {
    family: string;
    confidence: number;
  }[];
  indicators: string[];
  description: string;
}

export const MALWARE_FAMILIES = [
  'Ransomware',
  'Trojan',
  'Worm',
  'Spyware',
  'Adware',
  'Rootkit',
  'Backdoor',
  'Keylogger',
  'Cryptominer',
  'Botnet',
] as const;

export type MalwareFamily = typeof MALWARE_FAMILIES[number];