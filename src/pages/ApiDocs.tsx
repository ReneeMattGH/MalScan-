import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Code, Copy, Check, Terminal, Key, Send, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/scan',
    description: 'Submit a binary file for analysis',
    request: `curl -X POST https://api.malscan.ai/v1/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@suspicious.exe"`,
    response: `{
  "scan_id": "sc_7f8g9h0i1j2k3l4m",
  "status": "processing",
  "estimated_time": 15,
  "file_name": "suspicious.exe",
  "file_hash": "a1b2c3d4e5f6..."
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/scan/:id',
    description: 'Get analysis results for a scan',
    request: `curl https://api.malscan.ai/v1/scan/sc_7f8g9h0i1j2k3l4m \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    response: `{
  "scan_id": "sc_7f8g9h0i1j2k3l4m",
  "status": "completed",
  "threat_level": "critical",
  "malware_family": "Ransomware",
  "confidence": 0.94,
  "static_analysis": { ... },
  "dynamic_analysis": { ... },
  "classification": {
    "family": "Ransomware",
    "indicators": [
      "File encryption routines detected",
      "Shadow copy deletion commands"
    ]
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/scans',
    description: 'List all scans for your account',
    request: `curl https://api.malscan.ai/v1/scans \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G -d "limit=10" -d "offset=0"`,
    response: `{
  "scans": [
    {
      "scan_id": "sc_7f8g9h0i1j2k3l4m",
      "file_name": "suspicious.exe",
      "threat_level": "critical",
      "created_at": "2024-03-15T10:30:00Z"
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/scan/:id/report',
    description: 'Download PDF report for a scan',
    request: `curl https://api.malscan.ai/v1/scan/sc_7f8g9h0i1j2k3l4m/report \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -o report.pdf`,
    response: `Binary PDF file`,
  },
];

const codeExamples = {
  python: `import requests

API_KEY = "your_api_key"
BASE_URL = "https://api.malscan.ai/v1"

def analyze_file(file_path):
    """Upload and analyze a binary file."""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    with open(file_path, "rb") as f:
        response = requests.post(
            f"{BASE_URL}/scan",
            headers=headers,
            files={"file": f}
        )
    
    scan = response.json()
    print(f"Scan ID: {scan['scan_id']}")
    return scan['scan_id']

def get_results(scan_id):
    """Get analysis results."""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    response = requests.get(
        f"{BASE_URL}/scan/{scan_id}",
        headers=headers
    )
    
    return response.json()

# Usage
scan_id = analyze_file("suspicious.exe")
results = get_results(scan_id)
print(f"Threat: {results['threat_level']}")`,
  javascript: `const API_KEY = 'your_api_key';
const BASE_URL = 'https://api.malscan.ai/v1';

async function analyzeFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(\`\${BASE_URL}/scan\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
    },
    body: formData,
  });

  const scan = await response.json();
  console.log(\`Scan ID: \${scan.scan_id}\`);
  return scan.scan_id;
}

async function getResults(scanId) {
  const response = await fetch(\`\${BASE_URL}/scan/\${scanId}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
    },
  });

  return response.json();
}

// Usage
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const scanId = await analyzeFile(file);
  const results = await getResults(scanId);
  console.log(\`Threat: \${results.threat_level}\`);
});`,
  go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

const (
    apiKey  = "your_api_key"
    baseURL = "https://api.malscan.ai/v1"
)

type ScanResponse struct {
    ScanID      string \`json:"scan_id"\`
    Status      string \`json:"status"\`
    ThreatLevel string \`json:"threat_level"\`
}

func analyzeFile(filePath string) (string, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return "", err
    }
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, _ := writer.CreateFormFile("file", filePath)
    io.Copy(part, file)
    writer.Close()

    req, _ := http.NewRequest("POST", baseURL+"/scan", body)
    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var scan ScanResponse
    json.NewDecoder(resp.Body).Decode(&scan)
    return scan.ScanID, nil
}

func main() {
    scanID, _ := analyzeFile("suspicious.exe")
    fmt.Println("Scan ID:", scanID)
}`,
};

export default function API() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyCode = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(lang);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <Helmet>
        <title>API Documentation | MalScan AI</title>
        <meta
          name="description"
          content="Integrate malware analysis into your workflow with the MalScan AI REST API. Full documentation and code examples."
        />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Integrate MalScan AI malware analysis directly into your security workflow.
              Our REST API provides programmatic access to all analysis capabilities.
            </p>
          </motion.div>

          {/* Authentication */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Authentication</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                All API requests require authentication using a Bearer token in the Authorization header.
              </p>
              <div className="p-4 rounded-lg bg-secondary/50 font-mono text-sm">
                <span className="text-muted-foreground">Authorization:</span>{' '}
                <span className="text-primary">Bearer YOUR_API_KEY</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Get your API key from the{' '}
                <a href="#" className="text-primary hover:underline">
                  dashboard settings
                </a>
                .
              </p>
            </div>
          </motion.section>

          {/* Endpoints */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6">Endpoints</h2>
            <div className="space-y-6">
              {endpoints.map((endpoint, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
                >
                  {/* Endpoint Header */}
                  <div className="p-4 border-b border-border/30">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          endpoint.method === 'POST'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-foreground">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{endpoint.description}</p>
                  </div>

                  {/* Request/Response */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Request</span>
                        <button
                          onClick={() => copyToClipboard(endpoint.request, idx * 2)}
                          className="p-1.5 rounded hover:bg-secondary transition-colors"
                        >
                          {copiedIdx === idx * 2 ? (
                            <Check className="w-4 h-4 text-accent" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <pre className="p-3 rounded-lg bg-background/50 overflow-x-auto">
                        <code className="font-mono text-xs text-muted-foreground whitespace-pre">
                          {endpoint.request}
                        </code>
                      </pre>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Response</span>
                        <button
                          onClick={() => copyToClipboard(endpoint.response, idx * 2 + 1)}
                          className="p-1.5 rounded hover:bg-secondary transition-colors"
                        >
                          {copiedIdx === idx * 2 + 1 ? (
                            <Check className="w-4 h-4 text-accent" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <pre className="p-3 rounded-lg bg-background/50 overflow-x-auto">
                        <code className="font-mono text-xs text-muted-foreground whitespace-pre">
                          {endpoint.response}
                        </code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Code Examples */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6">Code Examples</h2>
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <Tabs defaultValue="python">
                <div className="border-b border-border/30 p-2">
                  <TabsList className="bg-secondary/30">
                    <TabsTrigger value="python" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Python
                    </TabsTrigger>
                    <TabsTrigger value="javascript" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      JavaScript
                    </TabsTrigger>
                    <TabsTrigger value="go" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Go
                    </TabsTrigger>
                  </TabsList>
                </div>

                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang} className="m-0">
                    <div className="relative">
                      <button
                        onClick={() => copyCode(code, lang)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        {copiedCode === lang ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <pre className="p-6 overflow-x-auto">
                        <code className="font-mono text-sm text-muted-foreground">{code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </motion.section>

          {/* Rate Limits */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="p-6 rounded-xl border border-warning/30 bg-warning/5">
              <h3 className="text-lg font-semibold text-foreground mb-2">Rate Limits</h3>
              <p className="text-sm text-muted-foreground mb-4">
                API requests are rate limited based on your subscription tier:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/30">
                  <p className="font-medium text-foreground">Free</p>
                  <p className="text-sm text-muted-foreground">10 requests/hour</p>
                </div>
                <div className="p-4 rounded-lg bg-background/30">
                  <p className="font-medium text-foreground">Pro</p>
                  <p className="text-sm text-muted-foreground">100 requests/hour</p>
                </div>
                <div className="p-4 rounded-lg bg-background/30">
                  <p className="font-medium text-foreground">Enterprise</p>
                  <p className="text-sm text-muted-foreground">Unlimited</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </Layout>
    </>
  );
}