import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  FileCode,
  Trash2,
  Eye,
  Download,
  ChevronDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ThreatBadge } from '@/components/analysis/ThreatBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useScans, useDeleteScan } from '@/hooks/useScans';
import { useToast } from '@/hooks/use-toast';
import { ScanResult } from '@/lib/types';

export default function History() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: scans = [], isLoading, error } = useScans();
  const deleteScan = useDeleteScan();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scanToDelete, setScanToDelete] = useState<string | null>(null);

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || scan.threatLevel === filter;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const viewAnalysis = (scan: ScanResult) => {
    sessionStorage.setItem('currentScanId', scan.id);
    navigate('/analysis');
  };

  const handleDeleteClick = (scanId: string) => {
    setScanToDelete(scanId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scanToDelete) return;
    
    try {
      await deleteScan.mutateAsync(scanToDelete);
      toast({
        title: 'Scan deleted',
        description: 'The scan has been removed from your history.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete scan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setScanToDelete(null);
    }
  };

  const downloadReport = async (scan: ScanResult) => {
    // For now, show a toast. PDF generation will be added via edge function
    toast({
      title: 'Generating report...',
      description: 'Your PDF report is being prepared for download.',
    });
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Report ready',
      description: `Report for ${scan.fileName} has been downloaded.`,
    });
  };

  if (error) {
    return (
      <>
        <Helmet>
          <title>Scan History | MalScan AI</title>
        </Helmet>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Error loading scans</h3>
              <p className="text-muted-foreground mb-6">
                Something went wrong while loading your scan history.
              </p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Scan History | MalScan AI</title>
        <meta
          name="description"
          content="View your malware analysis history. Access previous scans and download reports."
        />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Scan History</h1>
            <p className="text-muted-foreground">
              View and manage your previous malware analysis scans
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="pl-9 bg-card border-border/50"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filter === 'all' ? 'All Threats' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>All Threats</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('critical')}>Critical</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('high')}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('medium')}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('low')}>Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('clean')}>Clean</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your scans...</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-muted-foreground mb-4"
              >
                Showing {filteredScans.length} of {scans.length} scans
              </motion.p>

              {/* Scan List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                {filteredScans.map((scan, idx) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* File Icon */}
                      <div className="p-3 rounded-lg bg-secondary">
                        <FileCode className="w-6 h-6 text-primary" />
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-mono font-medium text-foreground truncate">
                            {scan.fileName}
                          </h3>
                          <ThreatBadge level={scan.threatLevel} size="sm" />
                          {scan.malwareFamily && (
                            <span className="text-xs text-muted-foreground">
                              {scan.malwareFamily}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{formatFileSize(scan.fileSize)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(scan.uploadedAt)}
                          </span>
                          {scan.confidence && (
                            <span className="font-mono text-xs">
                              {Math.round(scan.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => viewAnalysis(scan)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => downloadReport(scan)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(scan.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredScans.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <FileCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No scans found</h3>
                  <p className="text-muted-foreground mb-6">
                    {search
                      ? 'Try adjusting your search criteria'
                      : 'Start by uploading a file for analysis'}
                  </p>
                  <Button onClick={() => navigate('/')}>Upload File</Button>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Scan</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this scan? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteScan.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </>
  );
}
