import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScanResult, StaticAnalysis, DynamicAnalysis } from '@/lib/types';
import { generateMockStaticAnalysis, generateMockDynamicAnalysis, generateMockClassification } from '@/lib/mockData';
import { Json } from '@/integrations/supabase/types';

interface DBScan {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_hash: string;
  threat_level: 'clean' | 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  malware_family: string | null;
  confidence: number | null;
  static_analysis: Json | null;
  dynamic_analysis: Json | null;
  classification: Json | null;
  scan_duration_ms: number | null;
  created_at: string;
  completed_at: string | null;
}

function dbScanToScanResult(scan: DBScan): ScanResult {
  return {
    id: scan.id,
    fileName: scan.file_name,
    fileSize: scan.file_size,
    fileHash: scan.file_hash,
    uploadedAt: new Date(scan.created_at),
    status: scan.status === 'analyzing' ? 'scanning' : scan.status,
    threatLevel: scan.threat_level,
    malwareFamily: scan.malware_family || undefined,
    confidence: scan.confidence ? scan.confidence / 100 : undefined,
    staticAnalysis: scan.static_analysis as unknown as StaticAnalysis | undefined,
    dynamicAnalysis: scan.dynamic_analysis as unknown as DynamicAnalysis | undefined,
  };
}

export function useScans() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as DBScan[]).map(dbScanToScanResult);
    },
    enabled: !!user,
  });
}

export function useScan(scanId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scan', scanId],
    queryFn: async () => {
      if (!user || !scanId) return null;
      
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .single();
      
      if (error) throw error;
      return dbScanToScanResult(data as DBScan);
    },
    enabled: !!user && !!scanId,
  });
}

interface CreateScanParams {
  fileName: string;
  fileSize: number;
}

export function useCreateScan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ fileName, fileSize }: CreateScanParams) => {
      if (!user) throw new Error('User not authenticated');
      
      // Generate file hash (mock)
      const fileHash = Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      // Create pending scan
      const { data: scan, error: createError } = await supabase
        .from('scans')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_size: fileSize,
          file_hash: fileHash,
          status: 'pending' as const,
          threat_level: 'clean' as const,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Simulate analysis (in production, this would be an edge function)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock analysis results
      const threatLevels = ['clean', 'low', 'medium', 'high', 'critical'] as const;
      const threatLevel = threatLevels[Math.floor(Math.random() * threatLevels.length)];
      const isMalicious = threatLevel !== 'clean';
      const families = ['Ransomware', 'Trojan', 'Worm', 'Spyware', 'Adware', 'Rootkit', 'Backdoor'];
      
      const staticAnalysis = generateMockStaticAnalysis();
      const dynamicAnalysis = generateMockDynamicAnalysis();
      const classification = generateMockClassification(threatLevel);

      const startTime = Date.now();

      // Update with results
      const { data: updatedScan, error: updateError } = await supabase
        .from('scans')
        .update({
          status: 'completed' as const,
          threat_level: threatLevel,
          malware_family: isMalicious ? families[Math.floor(Math.random() * families.length)] : null,
          confidence: isMalicious ? Math.round((0.75 + Math.random() * 0.24) * 100) : null,
          static_analysis: staticAnalysis as unknown as Json,
          dynamic_analysis: dynamicAnalysis as unknown as Json,
          classification: classification as unknown as Json,
          scan_duration_ms: Date.now() - startTime + 2000,
          completed_at: new Date().toISOString(),
        })
        .eq('id', scan.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return dbScanToScanResult(updatedScan as DBScan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
    },
  });
}

export function useDeleteScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scanId: string) => {
      const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
    },
  });
}
