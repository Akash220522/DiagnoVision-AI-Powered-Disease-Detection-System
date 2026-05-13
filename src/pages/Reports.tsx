import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Filter,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { DiagnosisReport, UserProfile } from '../types';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';

export default function Reports({ profile }: { profile: UserProfile | null }) {
  const [reports, setReports] = useState<DiagnosisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (!profile) return;
      try {
        const q = query(
          collection(db, "diagnoses"), 
          where("patientId", "==", profile.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DiagnosisReport[];
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [profile]);

  const downloadReport = (report: DiagnosisReport) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Lumina Health AI Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Report ID: ${report.id}`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Patient: ${profile?.displayName || 'N/A'}`, 20, 45);
    doc.text(`Disease: ${report.diseaseType}`, 20, 52);
    doc.text(`Prediction: ${report.prediction}`, 20, 59);
    doc.text(`Confidence: ${(report.confidence * 100).toFixed(2)}%`, 20, 66);
    doc.text(`Severity: ${report.severity?.toUpperCase() || 'N/A'}`, 20, 73);
    doc.text(`Date: ${format(new Date(report.createdAt.toString()), 'PPP')}`, 20, 80);
    
    doc.text("Detailed Analysis:", 20, 95);
    const splitAnalysis = doc.splitTextToSize(report.analysis, 170);
    doc.text(splitAnalysis, 20, 102);
    
    doc.save(`Report_${report.diseaseType}_${report.id.substring(0,6)}.pdf`);
  };

  const filteredReports = reports.filter(r => 
    r.diseaseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.prediction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Medical <span className="neon-gradient-text">Reports</span></h1>
          <p className="text-slate-400 text-sm">Access and download your AI-generated diagnostic history.</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full max-w-sm focus-within:border-brand-cyan/50 transition-all">
          <Search className="w-5 h-5 text-slate-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search by disease or result..."
            className="bg-transparent border-none outline-none text-sm text-white w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Loading historical data...</p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-cyan/30 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8 text-brand-cyan" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">{report.diseaseType}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    report.severity === 'critical' || report.severity === 'high' ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {report.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-medium">{report.prediction}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {report.createdAt ? format(new Date(report.createdAt.toString()), 'MMM d, yyyy • h:mm a') : 'Recent'}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {(report.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => downloadReport(report)}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all" title="View Details">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-rose-400 transition-all" title="Archive">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center opacity-60">
          <FileText className="w-16 h-16 text-slate-500 mb-6" />
          <h3 className="text-xl font-bold text-slate-300 mb-2">No Reports Found</h3>
          <p className="text-slate-500 max-w-xs">You haven't generated any AI diagnostic reports yet. Start by uploading a medical scan in the Diagnostics section.</p>
        </div>
      )}
    </div>
  );
}
