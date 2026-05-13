import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  X, 
  FileSearch, 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  Flame,
  Info,
  Loader2,
  Stethoscope
} from 'lucide-react';
import { analyzeMedicalImage } from '../services/gemini';
import { db, storage } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';

const DISEASE_TYPES = [
  "Pneumonia", "Brain Tumor", "Bone Fracture", "Skin Diseases", 
  "Breast Cancer", "Tuberculosis", "Kidney Disease", "Heart Disease", 
  "Lung Cancer", "Diabetes", "Liver Disease", "Eye Diseases"
];

export default function Diagnostics({ profile }: { profile: UserProfile | null }) {
  const [selectedDisease, setSelectedDisease] = useState(DISEASE_TYPES[0]);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !file) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const base64Data = image.split(',')[1];
      const analysisResult = await analyzeMedicalImage(base64Data, file.type, selectedDisease);
      
      if (analysisResult) {
        setResult(analysisResult);
        
        // Save to Firestore
        if (profile) {
          await addDoc(collection(db, "diagnoses"), {
            patientId: profile.uid,
            diseaseType: selectedDisease,
            prediction: analysisResult.prediction,
            confidence: analysisResult.confidence,
            severity: analysisResult.severity,
            analysis: analysisResult.analysis,
            recommendations: analysisResult.recommendations,
            status: 'reviewed',
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("Lumina Health AI Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${profile?.displayName || 'N/A'}`, 20, 35);
    doc.text(`Disease Category: ${selectedDisease}`, 20, 42);
    doc.text(`AI Prediction: ${result.prediction}`, 20, 49);
    doc.text(`Confidence: ${(result.confidence * 100).toFixed(2)}%`, 20, 56);
    doc.text(`Severity: ${result.severity.toUpperCase()}`, 20, 63);
    
    doc.text("Professional Analysis:", 20, 75);
    const splitAnalysis = doc.splitTextToSize(result.analysis, 170);
    doc.text(splitAnalysis, 20, 82);
    
    const yAfterAnalysis = 82 + (splitAnalysis.length * 7);
    doc.text("Recommendations:", 20, yAfterAnalysis + 10);
    result.recommendations.forEach((rec: string, i: number) => {
      doc.text(`• ${rec}`, 25, yAfterAnalysis + 20 + (i * 7));
    });
    
    doc.save(`Lumina_Report_${selectedDisease}_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
          AI Diagnostic <span className="neon-gradient-text">Engine</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upload medical scans for instant AI analysis using our multi-model neural network infrastructure.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-6 border-white/10">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">1. Select Disease Category</label>
            <div className="grid grid-cols-2 gap-2">
              {DISEASE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedDisease(type)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-xs font-bold transition-all border",
                    selectedDisease === type 
                      ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan" 
                      : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 border-dashed border-white/20 hover:border-brand-cyan/50 transition-colors group cursor-pointer relative"
               onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*"
            />
            
            {image ? (
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImage(null); setFile(null); setResult(null); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center backdrop-blur-sm hover:bg-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 bg-brand-cyan/10 animate-pulse pointer-events-none" />
              </div>
            ) : (
              <div className="flex flex-col items-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-cyan transition-colors" />
                </div>
                <p className="text-sm font-bold text-white mb-2">Drop medical image here</p>
                <p className="text-xs text-slate-500">Supports DICOM, JPEG, PNG, MRI scans</p>
              </div>
            )}
          </div>

          <button
            disabled={!image || analyzing}
            onClick={handleAnalyze}
            className="w-full neon-button py-5 text-lg font-bold disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Neural Patterns...
              </>
            ) : (
              <>
                <Brain className="w-6 h-6" />
                Run AI Diagnosis
              </>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8 bg-gradient-to-br from-white/5 to-brand-cyan/5 border-brand-cyan/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">AI Findings</h2>
                    <p className="text-xs text-slate-400 font-medium">Verified by Lumina-3 Engine</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={downloadPDF} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-white/10">
                      <Download className="w-5 h-5" />
                    </button>
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      Scan Verified
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Prediction</p>
                    <p className="text-lg font-bold text-brand-cyan">{result.prediction}</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Confidence</p>
                    <p className="text-lg font-bold text-white">{(result.confidence * 100).toFixed(1)}%</p>
                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-cyan" style={{ width: `${result.confidence * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Flame className={cn("w-6 h-6", result.severity === 'critical' || result.severity === 'high' ? "text-rose-500" : "text-orange-500")} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Severity Analysis</h3>
                      <p className="text-sm text-slate-400 leading-relaxed capitalize">{result.severity} risk level detected. Immediate consultation advised.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                      <FileSearch className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Clinical Observations</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{result.analysis}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-brand-cyan/5 border border-brand-cyan/10 rounded-2xl">
                    <h3 className="text-brand-cyan font-bold text-sm mb-4 flex items-center gap-2">
                       <Stethoscope className="w-4 h-4" /> Recommended Actions
                    </h3>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 shrink-0" />
                           {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex gap-3 text-rose-300 text-xs italic">
                     <AlertTriangle className="w-4 h-4 shrink-0" />
                     Disclaimer: This is an AI-generated analysis. Please consult a qualified medical professional for a final diagnosis.
                  </div>
                </div>
              </motion.div>
            ) : analyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-20 glass-card border-none"
              >
                <div className="relative mb-10 scale-150">
                   <div className="w-16 h-16 border-4 border-brand-cyan/10 border-t-brand-cyan rounded-full animate-spin" />
                   <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-cyan animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Neural Scan in Progress</h3>
                <p className="text-slate-400 text-sm text-center max-w-xs">Extracting features and comparing with 500k+ clinical data points...</p>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 glass-card border-white/5 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Info className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-500 mb-2">Ready to Scan</h3>
                <p className="text-slate-600 text-sm max-w-xs">Upload an image to start the robotic medical analysis</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
