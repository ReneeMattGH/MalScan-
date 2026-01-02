import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FileCode,
  Hash,
  Clock,
  HardDrive,
  Download,
  ArrowLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ThreatBadge } from '@/components/analysis/ThreatBadge';
import { StatCard } from '@/components/analysis/StatCard';
import { EntropyChart } from '@/components/analysis/EntropyChart';
import { OpcodeHistogram } from '@/components/analysis/OpcodeHistogram';
import { StringsTable } from '@/components/analysis/StringsTable';
import { ImportsList } from '@/components/analysis/ImportsList';
import { PEHeaderInfo } from '@/components/analysis/PEHeaderInfo';
import { DynamicAnalysis } from '@/components/analysis/DynamicAnalysis';
import { ClassificationResult } from '@/components/analysis/ClassificationResult';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScan } from '@/hooks/useScans';
import { ScanResult } from '@/lib/types';
import { generateMockClassification } from '@/lib/mockData';

export default function Analysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scanIdFromUrl = searchParams.get('id');
  
  // Try to get scan ID from URL params, then sessionStorage
  const scanId = scanIdFromUrl || sessionStorage.getItem('currentScanId');
  
  const { data: dbScan, isLoading, error } = useScan(scanId);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    // First check if we have a scan from the database
    if (dbScan) {
      setScanResult(dbScan);
      return;
    }
    
    // Fallback to sessionStorage for scans that were just created
    const storedResult = sessionStorage.getItem('currentScan');
    if (storedResult && !isLoading) {
      try {
        const parsed = JSON.parse(storedResult);
        // Convert date string back to Date object
        if (parsed.uploadedAt) {
          parsed.uploadedAt = new Date(parsed.uploadedAt);
        }
        setScanResult(parsed);
      } catch (e) {
        console.error('Failed to parse stored scan result:', e);
      }
    }
  }, [dbScan, isLoading]);

  // Redirect if no scan found after loading
  useEffect(() => {
    if (!isLoading && !scanResult && !sessionStorage.getItem('currentScan') && !scanId) {
      navigate('/');
    }
  }, [isLoading, scanResult, navigate, scanId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <p className="mt-6 text-lg text-muted-foreground">Loading analysis results...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || (!scanResult && !isLoading)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-destructive/10 mb-6">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              The scan you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!scanResult) {
    return null;
  }

  const classification = generateMockClassification(scanResult.threatLevel);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Helmet>
        <title>Analysis Results - {scanResult.fileName} | MalScan AI</title>
        <meta
          name="description"
          content={`Malware analysis results for ${scanResult.fileName}. View static analysis, dynamic behavior, and classification details.`}
        />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Analysis Results</span>
          </motion.nav>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10"
          >
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border/50 glow-subtle">
                <FileCode className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground font-mono tracking-tight">
                    {scanResult.fileName}
                  </h1>
                  <ThreatBadge level={scanResult.threatLevel} size="lg" />
                </div>
                <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4" />
                    {formatFileSize(scanResult.fileSize)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDate(scanResult.uploadedAt)}
                  </span>
                  {scanResult.malwareFamily && (
                    <span className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4" />
                      {scanResult.malwareFamily}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 w-fit">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <code className="font-mono text-xs text-muted-foreground break-all select-all">
                    {scanResult.fileHash}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 border-border/50 hover:border-primary/50 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </motion.header>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            <StatCard
              title="Threat Level"
              value={scanResult.threatLevel.toUpperCase()}
              variant={
                scanResult.threatLevel === 'critical' || scanResult.threatLevel === 'high'
                  ? 'danger'
                  : scanResult.threatLevel === 'medium'
                  ? 'warning'
                  : scanResult.threatLevel === 'clean'
                  ? 'success'
                  : 'default'
              }
            />
            <StatCard
              title="Classification"
              value={classification.family}
            />
            <StatCard
              title="Confidence"
              value={`${Math.round(classification.confidence * 100)}%`}
            />
            <StatCard
              title="Entropy"
              value={scanResult.staticAnalysis?.entropy.overall.toFixed(2) || 'N/A'}
            />
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="classification" className="space-y-8">
              <TabsList className="bg-card/80 border border-border/50 p-1.5 h-auto flex-wrap gap-1 backdrop-blur-sm">
                <TabsTrigger 
                  value="classification" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  Classification
                </TabsTrigger>
                <TabsTrigger 
                  value="static" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  Static Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="dynamic" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  Dynamic Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="strings" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  Strings
                </TabsTrigger>
                <TabsTrigger 
                  value="imports" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  Imports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="classification" className="animate-fade-in">
                <ClassificationResult
                  classification={classification}
                  threatLevel={scanResult.threatLevel}
                />
              </TabsContent>

              <TabsContent value="static" className="space-y-6 animate-fade-in">
                {scanResult.staticAnalysis && (
                  <>
                    <PEHeaderInfo header={scanResult.staticAnalysis.peHeader} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <EntropyChart data={scanResult.staticAnalysis.entropy} />
                      <OpcodeHistogram data={scanResult.staticAnalysis.opcodes} />
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="dynamic" className="animate-fade-in">
                {scanResult.dynamicAnalysis && (
                  <DynamicAnalysis data={scanResult.dynamicAnalysis} />
                )}
              </TabsContent>

              <TabsContent value="strings" className="animate-fade-in">
                {scanResult.staticAnalysis && (
                  <StringsTable strings={scanResult.staticAnalysis.strings} />
                )}
              </TabsContent>

              <TabsContent value="imports" className="animate-fade-in">
                {scanResult.staticAnalysis && (
                  <ImportsList imports={scanResult.staticAnalysis.imports} />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </Layout>
    </>
  );
}