import React, { useState } from 'react';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check,
  Building2,
  ExternalLink
} from 'lucide-react';

export const B2BPortalView: React.FC = () => {
  const [b2bClientId, setB2bClientId] = useState('broker_nexus_corp');
  const [b2bApiKey, setB2bApiKey] = useState('pl_live_9f83a2e18d42c90e');
  const [b2bDocsInput, setB2bDocsInput] = useState(
    'https://storage.policylens.ai/partners/hdfc_optima_wording.pdf\nhttps://storage.policylens.ai/partners/care_supreme_2026.pdf'
  );
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchJobResult, setBatchJobResult] = useState<any>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'python' | 'node'>('curl');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleRunBatchExtraction = () => {
    setIsProcessingBatch(true);
    setBatchJobResult(null);

    const urls = b2bDocsInput.split('\n').filter(u => u.trim().length > 0);

    setTimeout(() => {
      setBatchJobResult({
        job_id: `job_${Math.random().toString(36).substring(2, 11)}`,
        client_id: b2bClientId,
        status: 'COMPLETED',
        total_documents: urls.length,
        completed_count: urls.length,
        failed_count: 0,
        processing_time_total_ms: 1420,
        created_at: new Date().toISOString(),
        results: urls.map((url, idx) => ({
          document_url: url,
          document_name: url.split('/').pop() || `policy_${idx + 1}.pdf`,
          status: 'COMPLETED',
          confidence_score: 0.98 - idx * 0.02,
          requires_human_review: false,
          processing_time_ms: 680 + idx * 120,
          extracted_plan: idx === 0 ? 'HDFC ERGO Optima Secure' : 'Care Supreme Health Shield',
          sum_insured: idx === 0 ? 1000000 : 1500000,
          room_rent_type: 'No Capping'
        }))
      });
      setIsProcessingBatch(false);
    }, 1100);
  };

  const getCodeSnippet = () => {
    if (codeLanguage === 'curl') {
      return `curl -X POST https://api.policylens.ai/v1/b2b/extract-batch \\
  -H "Authorization: Bearer ${b2bApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "${b2bClientId}",
    "document_urls": [
      "https://storage.yourdomain.com/policies/hdfc_optima.pdf",
      "https://storage.yourdomain.com/policies/care_supreme.pdf"
    ],
    "webhook_url": "https://api.yourdomain.com/webhooks/policy-ready"
  }'`;
    }
    if (codeLanguage === 'python') {
      return `import requests

url = "https://api.policylens.ai/v1/b2b/extract-batch"
headers = {
    "Authorization": "Bearer ${b2bApiKey}",
    "Content-Type": "application/json"
}
payload = {
    "client_id": "${b2bClientId}",
    "document_urls": [
        "https://storage.yourdomain.com/policies/hdfc_optima.pdf"
    ],
    "webhook_url": "https://api.yourdomain.com/webhooks/policy-ready"
}

response = requests.post(url, json=payload, headers=headers)
print("Job ID:", response.json().get("job_id"))`;
    }
    return `import axios from 'axios';

const response = await axios.post(
  'https://api.policylens.ai/v1/b2b/extract-batch',
  {
    client_id: '${b2bClientId}',
    document_urls: ['https://storage.yourdomain.com/policies/hdfc_optima.pdf'],
    webhook_url: 'https://api.yourdomain.com/webhooks/policy-ready'
  },
  {
    headers: {
      Authorization: 'Bearer ${b2bApiKey}',
      'Content-Type': 'application/json'
    }
  }
);
console.log('Batch Job Queued:', response.data);`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-1 text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>B2B Document Intelligence Gateway</span>
            </div>
            <h2 className="text-xl font-bold text-white">Enterprise Batch Policy Extraction API</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automate PDF extraction for aggregators, brokers, and underwriters with high-throughput structured JSON and webhooks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 font-mono">API Key:</span>
            <span className="text-xs text-amber-300 font-mono">{b2bApiKey}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(b2bApiKey);
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="p-1 text-slate-400 hover:text-white"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Batch Request Playground */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Interactive Batch Playground</span>
          </h3>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Partner Client ID</label>
            <input 
              type="text"
              value={b2bClientId}
              onChange={(e) => setB2bClientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Document PDF URLs (One per line)
            </label>
            <textarea 
              rows={4}
              value={b2bDocsInput}
              onChange={(e) => setB2bDocsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>

          <button
            onClick={handleRunBatchExtraction}
            disabled={isProcessingBatch || !b2bDocsInput.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {isProcessingBatch ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Ingesting & Parsing Batch via AI Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Dispatch Batch Extraction Job</span>
              </>
            )}
          </button>

          {/* Batch Job Result Viewer */}
          {batchJobResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Job {batchJobResult.job_id} Completed
                </span>
                <span className="text-slate-400 font-mono">{batchJobResult.processing_time_total_ms}ms</span>
              </div>

              <div className="space-y-2">
                {batchJobResult.results.map((res: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{res.document_name}</span>
                      <span className="text-[11px] text-slate-400">{res.extracted_plan} • ₹{(res.sum_insured/100000).toFixed(0)}L</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] block">
                        {(res.confidence_score * 100).toFixed(0)}% Conf
                      </span>
                      <span className="text-[10px] text-slate-500">{res.processing_time_ms}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Developer SDK Code Integration */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Developer Integration SDK</span>
            </h3>
            
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setCodeLanguage('curl')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                  codeLanguage === 'curl' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setCodeLanguage('python')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                  codeLanguage === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setCodeLanguage('node')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                  codeLanguage === 'node' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Node.js
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              {getCodeSnippet()}
            </pre>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-300 space-y-1">
            <strong className="text-indigo-300 block">Webhook Verification:</strong>
            <span>PolicyLens AI sends cryptographically signed HMAC SHA-256 signatures in the <code>X-PolicyLens-Signature</code> header upon job completion.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
