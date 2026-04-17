import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const JsonViewer = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightJSON = (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    
    return json.split('\n').map((line, i) => {
      // Very basic syntax highlighting logic
      const highlightedLine = line
        .replace(/"([^"]+)":/g, '<span class="text-cyan-400">"$1"</span>:') // Keys
        .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>') // Strings
        .replace(/: (\d+)/g, ': <span class="text-orange-400">$1</span>') // Numbers
        .replace(/: (true|false)/g, ': <span class="text-purple-400">$1</span>'); // Booleans

      return (
        <div key={i} className="flex">
          <span className="w-8 shrink-0 text-zinc-600 text-right pr-4 select-none">{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: highlightedLine }} />
        </div>
      );
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-zinc-950 border border-white/5 font-mono text-[11px]">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          title="Copy JSON"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-zinc-400" />}
        </button>
      </div>
      
      <div className="p-4 overflow-x-auto custom-scrollbar leading-relaxed text-zinc-300">
        {highlightJSON(data)}
      </div>
    </div>
  );
};

export default JsonViewer;
