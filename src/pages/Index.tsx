import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { FileUpload } from '@/components/upload/FileUpload';
import { Shield, Zap, Lock, Database, ChartBar, Globe, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Deep Learning Classification',
    description: 'Advanced LSTM/CNN models trained on millions of samples for accurate family detection.',
  },
  {
    icon: Zap,
    title: 'Static Analysis',
    description: 'Extract PE headers, strings, imports, opcodes, and entropy from binary files.',
  },
  {
    icon: Lock,
    title: 'Dynamic Analysis',
    description: 'Sandbox execution captures API calls, network activity, and system changes.',
  },
  {
    icon: Database,
    title: 'Detailed Reports',
    description: 'Comprehensive reports with analysis data, indicators, and recommendations.',
  },
  {
    icon: ChartBar,
    title: 'Visual Insights',
    description: 'Interactive charts for opcode distribution, entropy visualization, and more.',
  },
  {
    icon: Globe,
    title: 'REST API',
    description: 'Integrate malware analysis directly into your security workflow via API.',
  },
];

const stats = [
  { value: '50M+', label: 'Samples Analyzed' },
  { value: '99.2%', label: 'Detection Rate' },
  { value: '<3s', label: 'Avg Scan Time' },
  { value: '10+', label: 'Malware Families' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Index() {
  return (
    <>
      <Helmet>
        <title>MalScan AI - Advanced Malware Analysis Platform</title>
        <meta
          name="description"
          content="Deep learning-powered malware analysis platform. Upload binaries for static and dynamic analysis with instant classification."
        />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 gradient-cyber pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                Enterprise-Grade Malware Analysis
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-8">
                Detect Threats with{' '}
                <span className="text-gradient-cyber">AI Precision</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Upload any binary file and get instant deep learning-powered classification.
                Static analysis, dynamic behavior, and malware family detection in seconds.
              </p>
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <FileUpload />
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-20 max-w-4xl mx-auto"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="text-center p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60 transition-all duration-300"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary font-mono mb-2 text-glow-cyan">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Comprehensive Analysis
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                From static feature extraction to dynamic sandbox analysis,
                MalScan AI provides everything needed to identify malware.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/40 hover:bg-card/60 transition-all duration-300 card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Ready to Secure Your Environment?
              </h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Start analyzing suspicious files today with our free tier.
                No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/auth"
                  className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all glow-cyan btn-premium"
                >
                  Get Started Free
                </a>
                <a
                  href="/api"
                  className="px-8 py-4 rounded-xl border border-border/50 text-foreground font-semibold hover:bg-secondary hover:border-border transition-all"
                >
                  View API Docs
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
}