import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, AlertTriangle, Shield, Loader2, LogIn, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateScan } from '@/hooks/useScans';
import { useToast } from '@/hooks/use-toast';

const scanPhases = [
  { name: 'Extracting PE headers...', duration: 600 },
  { name: 'Analyzing strings & imports...', duration: 500 },
  { name: 'Disassembling opcodes...', duration: 800 },
  { name: 'Calculating entropy...', duration: 400 },
  { name: 'Running ML classifier...', duration: 1000 },
  { name: 'Generating report...', duration: 300 },
];

export function FileUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createScan = useCreateScan();
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const startScan = async () => {
    if (!file) return;

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to analyze files.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setIsScanning(true);
    let progress = 0;
    const progressPerPhase = 100 / scanPhases.length;

    // Start the actual scan mutation
    const scanPromise = createScan.mutateAsync({
      fileName: file.name,
      fileSize: file.size,
    });

    // Animate phases
    for (const phase of scanPhases) {
      setScanPhase(phase.name);
      await new Promise((resolve) => setTimeout(resolve, phase.duration));
      progress += progressPerPhase;
      setScanProgress(Math.min(progress, 100));
    }

    try {
      const result = await scanPromise;
      
      // Store result in session storage for analysis page
      sessionStorage.setItem('currentScan', JSON.stringify(result));
      sessionStorage.setItem('currentScanId', result.id);
      
      toast({
        title: 'Scan complete',
        description: `Analysis finished for ${file.name}`,
      });
      
      navigate('/analysis');
    } catch (error) {
      toast({
        title: 'Scan failed',
        description: 'An error occurred during analysis. Please try again.',
        variant: 'destructive',
      });
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isScanning ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upload Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-10 md:p-14 text-center transition-all duration-300 cursor-pointer group ${
                isDragging
                  ? 'border-primary bg-primary/5 glow-cyan scale-[1.02]'
                  : file
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border/50 hover:border-primary/50 hover:bg-card/50'
              }`}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".exe,.dll,.bin,.sys,.ocx,.scr"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center gap-5">
                {file ? (
                  <>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center"
                    >
                      <File className="w-10 h-10 text-accent" />
                    </motion.div>
                    <div>
                      <p className="font-mono text-lg font-semibold text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground mt-1.5">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Choose a different file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-300">
                      <Upload className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        Drop your binary file here
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        or click to browse (.exe, .dll, .bin, .sys)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Warning Notice */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 p-4 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-warning">Security Notice</p>
                <p className="text-muted-foreground mt-1">
                  Only upload files from trusted sources. All uploads are analyzed in an isolated sandbox.
                </p>
              </div>
            </motion.div>

            {/* Auth Notice for non-logged in users */}
            <AnimatePresence>
              {!user && file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3"
                >
                  <LogIn className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-primary">Sign in to analyze</p>
                    <p className="text-muted-foreground mt-1">
                      Create a free account to analyze files and save your scan history.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan Button */}
            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6"
                >
                  <Button
                    onClick={startScan}
                    className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan btn-premium rounded-xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {user ? 'Start Deep Analysis' : 'Sign In & Analyze'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            {/* Scanning Animation */}
            <div className="relative w-36 h-36 mx-auto mb-10">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              {/* Pulse ring */}
              <div className="absolute inset-2 rounded-full bg-primary/5 animate-pulse-ring" />
              {/* Center icon */}
              <div className="absolute inset-6 rounded-full bg-card flex items-center justify-center border border-border/50">
                <Shield className="w-14 h-14 text-primary animate-pulse" />
              </div>
            </div>

            {/* Progress */}
            <div className="max-w-md mx-auto space-y-4">
              <Progress value={scanProgress} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-primary">{scanPhase}</span>
                <span className="font-mono text-muted-foreground">{Math.round(scanProgress)}%</span>
              </div>
            </div>

            {/* File Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 p-5 rounded-xl bg-card/80 border border-border/50 inline-block"
            >
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Analyzing</p>
              <p className="font-mono font-semibold text-foreground mt-1">{file?.name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}