
import React, { useState, useEffect } from 'react';
import { ClipboardList, AlertTriangle, Wrench, CheckCircle, Search, Loader2 } from 'lucide-react';
import { LogEntry } from '../types';
import { logBookService } from '../services/supabaseService';

const LogBook: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await logBookService.getAllWithAsset();
      setLogs(data);
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };
  const getIcon = (activity: string) => {
    switch (activity) {
        case 'Incident': return <AlertTriangle size={18} className="text-rose-500" />;
        case 'Maintenance': case 'Repair': return <Wrench size={18} className="text-amber-500" />;
        default: return <ClipboardList size={18} className="text-blue-500" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
      switch(sev) {
          case 'Critical': return 'bg-rose-100 text-rose-800';
          case 'Medium': return 'bg-amber-100 text-amber-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
         <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Log Book</h2>
            <p className="text-gray-500 text-sm mt-1">Audit trail of asset activities, maintenance, and incidents.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input type="text" placeholder="Search logs..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-gray-900 outline-none" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
      <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
        {logs.map((log) => (
            <div key={log.id} className="relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-0 bg-white border-2 border-gray-300 rounded-full p-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                {getIcon(log.activity)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{log.assetName}</h4>
                                <span className="text-xs text-gray-500 font-mono">{log.date} • {log.user}</span>
                            </div>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${getSeverityBadge(log.severity)}`}>
                            {log.severity}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 pl-[52px]">
                        <span className="font-medium text-gray-800">{log.activity}:</span> {log.notes}
                    </p>
                </div>
            </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default LogBook;
