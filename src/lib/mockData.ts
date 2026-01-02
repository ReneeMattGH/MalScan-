import { ScanResult, StaticAnalysis, DynamicAnalysis, MalwareClassification } from './types';

export const generateMockScanResult = (fileName: string, fileSize: number): ScanResult => {
  const threatLevels = ['clean', 'low', 'medium', 'high', 'critical'] as const;
  const families = ['Ransomware', 'Trojan', 'Worm', 'Spyware', 'Adware', 'Rootkit', 'Backdoor'];
  
  const threatLevel = threatLevels[Math.floor(Math.random() * threatLevels.length)];
  const isMalicious = threatLevel !== 'clean';

  return {
    id: crypto.randomUUID(),
    fileName,
    fileSize,
    fileHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    uploadedAt: new Date(),
    status: 'completed',
    threatLevel,
    malwareFamily: isMalicious ? families[Math.floor(Math.random() * families.length)] : undefined,
    confidence: isMalicious ? 0.75 + Math.random() * 0.24 : undefined,
    staticAnalysis: generateMockStaticAnalysis(),
    dynamicAnalysis: generateMockDynamicAnalysis(),
  };
};

export const generateMockStaticAnalysis = (): StaticAnalysis => ({
  peHeader: {
    machine: 'AMD64',
    numberOfSections: 5,
    timestamp: '2024-03-15T10:30:00Z',
    characteristics: ['EXECUTABLE_IMAGE', 'LARGE_ADDRESS_AWARE'],
    subsystem: 'WINDOWS_GUI',
    dllCharacteristics: ['DYNAMIC_BASE', 'NX_COMPAT', 'TERMINAL_SERVER_AWARE'],
    entryPoint: '0x00001000',
    imageBase: '0x0000000140000000',
    sectionAlignment: 4096,
    fileAlignment: 512,
  },
  strings: [
    { value: 'https://malicious-domain.com/payload', type: 'url', offset: '0x00004520' },
    { value: '192.168.1.100', type: 'ip', offset: '0x00004580' },
    { value: 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', type: 'registry', offset: '0x00004600' },
    { value: 'C:\\Windows\\System32\\cmd.exe', type: 'file', offset: '0x00004700' },
    { value: 'VirtualAllocEx', type: 'suspicious', offset: '0x00004800' },
    { value: 'CreateRemoteThread', type: 'suspicious', offset: '0x00004850' },
    { value: 'kernel32.dll', type: 'normal', offset: '0x00004900' },
    { value: 'ntdll.dll', type: 'normal', offset: '0x00004950' },
    { value: 'powershell -enc', type: 'suspicious', offset: '0x00005000' },
    { value: 'Encrypt', type: 'suspicious', offset: '0x00005100' },
  ],
  imports: [
    { dll: 'KERNEL32.dll', functions: ['VirtualAlloc', 'VirtualProtect', 'CreateThread', 'WriteProcessMemory', 'ReadProcessMemory'], suspicious: true },
    { dll: 'ADVAPI32.dll', functions: ['RegOpenKeyExW', 'RegSetValueExW', 'CryptAcquireContextW', 'CryptEncrypt'], suspicious: true },
    { dll: 'WS2_32.dll', functions: ['socket', 'connect', 'send', 'recv', 'WSAStartup'], suspicious: true },
    { dll: 'USER32.dll', functions: ['GetAsyncKeyState', 'GetForegroundWindow', 'SetWindowsHookExW'], suspicious: true },
    { dll: 'NTDLL.dll', functions: ['NtQuerySystemInformation', 'NtUnmapViewOfSection'], suspicious: true },
  ],
  entropy: {
    overall: 7.2,
    sections: [
      { name: '.text', entropy: 6.1, size: 45056, virtualSize: 45000 },
      { name: '.rdata', entropy: 5.8, size: 20480, virtualSize: 20400 },
      { name: '.data', entropy: 4.2, size: 8192, virtualSize: 8100 },
      { name: '.rsrc', entropy: 7.9, size: 102400, virtualSize: 102000 },
      { name: '.reloc', entropy: 5.5, size: 4096, virtualSize: 4000 },
    ],
  },
  opcodes: {
    histogram: [
      { opcode: 'MOV', count: 2450 },
      { opcode: 'PUSH', count: 1820 },
      { opcode: 'CALL', count: 1540 },
      { opcode: 'JMP', count: 980 },
      { opcode: 'CMP', count: 870 },
      { opcode: 'JE', count: 650 },
      { opcode: 'LEA', count: 580 },
      { opcode: 'XOR', count: 520 },
      { opcode: 'SUB', count: 450 },
      { opcode: 'ADD', count: 420 },
      { opcode: 'RET', count: 380 },
      { opcode: 'TEST', count: 340 },
    ],
    sequences: [
      'PUSH EBP; MOV EBP, ESP; SUB ESP, 0x20',
      'XOR EAX, EAX; RET',
      'CALL GetProcAddress; TEST EAX, EAX; JE error',
      'MOV ECX, [EBP+8]; PUSH ECX; CALL VirtualAlloc',
    ],
  },
});

export const generateMockDynamicAnalysis = (): DynamicAnalysis => ({
  apiCalls: [
    { timestamp: '00:00:01.234', api: 'CreateFileW', module: 'kernel32.dll', arguments: ['C:\\temp\\payload.dat', 'GENERIC_WRITE'], returnValue: '0x00000004', suspicious: true },
    { timestamp: '00:00:01.456', api: 'VirtualAllocEx', module: 'kernel32.dll', arguments: ['0xFFFFFFFF', '0x00000000', '0x1000', 'PAGE_EXECUTE_READWRITE'], returnValue: '0x00010000', suspicious: true },
    { timestamp: '00:00:01.789', api: 'WriteProcessMemory', module: 'kernel32.dll', arguments: ['0x00000004', '0x00010000', 'buffer', '256'], returnValue: 'TRUE', suspicious: true },
    { timestamp: '00:00:02.012', api: 'CreateRemoteThread', module: 'kernel32.dll', arguments: ['0x00000004', 'NULL', '0', '0x00010000'], returnValue: '0x00000008', suspicious: true },
    { timestamp: '00:00:02.345', api: 'RegSetValueExW', module: 'advapi32.dll', arguments: ['HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'Malware', 'REG_SZ'], returnValue: '0', suspicious: true },
    { timestamp: '00:00:02.567', api: 'CryptAcquireContextW', module: 'advapi32.dll', arguments: ['provider', 'MS_ENH_RSA_AES_PROV', 'PROV_RSA_AES'], returnValue: 'TRUE', suspicious: true },
    { timestamp: '00:00:02.789', api: 'socket', module: 'ws2_32.dll', arguments: ['AF_INET', 'SOCK_STREAM', 'IPPROTO_TCP'], returnValue: '0x00000010', suspicious: false },
    { timestamp: '00:00:03.012', api: 'connect', module: 'ws2_32.dll', arguments: ['0x00000010', '192.168.1.100:443'], returnValue: '0', suspicious: true },
  ],
  networkActivity: [
    { timestamp: '00:00:02.500', type: 'dns', destination: 'malicious-domain.com', port: 53 },
    { timestamp: '00:00:03.000', type: 'http', destination: '192.168.1.100', port: 443, data: 'POST /beacon HTTP/1.1' },
    { timestamp: '00:00:03.500', type: 'tcp', destination: '10.0.0.50', port: 4444 },
  ],
  fileOperations: [
    { timestamp: '00:00:01.000', operation: 'create', path: 'C:\\temp\\payload.dat', suspicious: true },
    { timestamp: '00:00:01.500', operation: 'modify', path: 'C:\\Windows\\System32\\drivers\\etc\\hosts', suspicious: true },
    { timestamp: '00:00:02.000', operation: 'create', path: 'C:\\Users\\victim\\Desktop\\README.txt', suspicious: true },
  ],
  registryOperations: [
    { timestamp: '00:00:02.300', operation: 'create', key: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Malware', value: 'C:\\temp\\malware.exe', suspicious: true },
    { timestamp: '00:00:02.400', operation: 'modify', key: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\Hidden', value: '2', suspicious: true },
  ],
  processes: [
    { pid: 1234, name: 'malware.exe', parentPid: 4, commandLine: 'C:\\temp\\malware.exe', suspicious: true },
    { pid: 5678, name: 'cmd.exe', parentPid: 1234, commandLine: 'cmd.exe /c whoami', suspicious: true },
    { pid: 9012, name: 'powershell.exe', parentPid: 1234, commandLine: 'powershell -enc SGVsbG8gV29ybGQ=', suspicious: true },
  ],
});

export const generateMockClassification = (threatLevel: string): MalwareClassification => {
  const classifications: Record<string, MalwareClassification> = {
    critical: {
      family: 'Ransomware',
      confidence: 0.94,
      alternativeFamilies: [
        { family: 'Trojan', confidence: 0.72 },
        { family: 'Backdoor', confidence: 0.45 },
      ],
      indicators: [
        'File encryption routines detected',
        'Ransom note creation behavior',
        'Shadow copy deletion commands',
        'Mass file enumeration',
        'Cryptocurrency wallet addresses found',
      ],
      description: 'This sample exhibits characteristics of ransomware, including file encryption capabilities, ransom note generation, and attempts to delete system restore points.',
    },
    high: {
      family: 'Trojan',
      confidence: 0.89,
      alternativeFamilies: [
        { family: 'Backdoor', confidence: 0.65 },
        { family: 'Spyware', confidence: 0.52 },
      ],
      indicators: [
        'Process injection techniques',
        'Persistence mechanisms',
        'C2 communication patterns',
        'Credential harvesting routines',
      ],
      description: 'This sample shows trojan-like behavior with process injection, persistence establishment, and command-and-control communication capabilities.',
    },
    medium: {
      family: 'Adware',
      confidence: 0.78,
      alternativeFamilies: [
        { family: 'PUP', confidence: 0.68 },
        { family: 'Spyware', confidence: 0.35 },
      ],
      indicators: [
        'Browser modification routines',
        'Advertisement injection',
        'User tracking capabilities',
      ],
      description: 'This sample exhibits adware characteristics with browser modification and advertisement injection capabilities.',
    },
    low: {
      family: 'PUP',
      confidence: 0.65,
      alternativeFamilies: [
        { family: 'Adware', confidence: 0.45 },
      ],
      indicators: [
        'Bundled software installation',
        'Browser toolbar installation',
      ],
      description: 'This sample appears to be a potentially unwanted program (PUP) with bundled software installation behavior.',
    },
    clean: {
      family: 'Benign',
      confidence: 0.98,
      alternativeFamilies: [],
      indicators: [],
      description: 'No malicious indicators detected. The file appears to be clean.',
    },
  };

  return classifications[threatLevel] || classifications.clean;
};

export const mockScanHistory: ScanResult[] = [
  {
    id: '1',
    fileName: 'suspicious_update.exe',
    fileSize: 2456789,
    fileHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    uploadedAt: new Date(Date.now() - 3600000),
    status: 'completed',
    threatLevel: 'critical',
    malwareFamily: 'Ransomware',
    confidence: 0.94,
  },
  {
    id: '2',
    fileName: 'chrome_installer.exe',
    fileSize: 89456123,
    fileHash: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a',
    uploadedAt: new Date(Date.now() - 7200000),
    status: 'completed',
    threatLevel: 'clean',
  },
  {
    id: '3',
    fileName: 'game_crack.dll',
    fileSize: 1234567,
    fileHash: 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2',
    uploadedAt: new Date(Date.now() - 86400000),
    status: 'completed',
    threatLevel: 'high',
    malwareFamily: 'Trojan',
    confidence: 0.89,
  },
  {
    id: '4',
    fileName: 'free_antivirus.exe',
    fileSize: 5678901,
    fileHash: 'd4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3',
    uploadedAt: new Date(Date.now() - 172800000),
    status: 'completed',
    threatLevel: 'medium',
    malwareFamily: 'Adware',
    confidence: 0.78,
  },
  {
    id: '5',
    fileName: 'system_tool.bin',
    fileSize: 345678,
    fileHash: 'e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3d4',
    uploadedAt: new Date(Date.now() - 259200000),
    status: 'completed',
    threatLevel: 'low',
    malwareFamily: 'PUP',
    confidence: 0.65,
  },
];