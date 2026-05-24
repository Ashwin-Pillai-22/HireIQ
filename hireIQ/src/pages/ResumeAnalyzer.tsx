// pages/UnderConstruction.tsx
import React from "react";
import { useNavigate } from "react-router-dom";


const UnderConstruction: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <p style={styles.tag}>AI-POWERED RESUME ANALYSIS</p>

      <h1 style={styles.heading}>
        Analyze your resume <br />
        <span style={styles.gradient}>coming soon</span>
      </h1>

      <p style={styles.subtext}>
        We’re building something powerful to help you optimize your resume
        with AI-driven insights. Stay tuned.
      </p>

      <button style={styles.button} onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    padding: "20px",
  },

  tag: {
    color: "#e76f51",
    fontSize: "12px",
    letterSpacing: "2px",
    marginBottom: "10px",
  },

  heading: {
    fontSize: "48px",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.2,
  },

  gradient: {
    background: "linear-gradient(90deg, #2563eb, #7c3aed, #ef4444)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtext: {
    marginTop: "20px",
    maxWidth: "500px",
    color: "#6b7280",
    fontSize: "16px",
  },

  button: {
    marginTop: "30px",
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#e76f51",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default UnderConstruction;

// import React from "react";

// function UnderConstruction() {
//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>Under Construction</h1>

//       <div style={styles.illustration}>
//         <div style={styles.circle}></div>

//         <div style={styles.character}>
//           <div style={styles.earLeft}></div>
//           <div style={styles.earRight}></div>

//           <div style={styles.face}>
//             <div style={styles.eye}></div>
//             <div style={styles.eye}></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     height: "100vh",
//     backgroundColor: "#f4b400",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     fontFamily: "sans-serif",
//   },
//   heading: {
//     fontSize: "64px",
//     color: "#1f2937",
//     marginBottom: "40px",
//   },
//   illustration: {
//     position: "relative",
//     width: "200px",
//     height: "200px",
//   },
//   // circle: {
//   //   position: "absolute",
//   //   top: "-20px",
//   //   right: "-30px",
//   //   width: "40px",
//   //   height: "40px",
//   //   backgroundColor: "#ff5c7a",
//   //   borderRadius: "50%",
//   // },
//   // character: {
//   //   position: "relative",
//   //   width: "120px",
//   //   height: "120px",
//   //   backgroundColor: "#2f2f46",
//   //   borderRadius: "50%",
//   //   display: "flex",
//   //   alignItems: "center",
//   //   justifyContent: "center",
//   // },
//   // face: {
//   //   display: "flex",
//   //   gap: "10px",
//   // },
//   // eye: {
//   //   width: "15px",
//   //   height: "15px",
//   //   backgroundColor: "#fff",
//   //   borderRadius: "50%",
//   // },
//   // earLeft: {
//   //   position: "absolute",
//   //   left: "-20px",
//   //   width: "30px",
//   //   height: "30px",
//   //   backgroundColor: "#000",
//   //   borderRadius: "50%",
//   // },
//   // earRight: {
//   //   position: "absolute",
//   //   right: "-20px",
//   //   width: "30px",
//   //   height: "30px",
//   //   backgroundColor: "#000",
//   //   borderRadius: "50%",
//   // },
// };

// export default UnderConstruction;




// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ArrowLeft, Upload, FileText, Sparkles, Target, BarChart3, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from "lucide-react";
// import { Link } from "react-router-dom";

// interface AnalysisResult {
//   overallScore: number;
//   atsScore: number;
//   impactScore: number;
//   clarityScore: number;
//   sections: {
//     name: string;
//     score: number;
//     status: "strong" | "needs-work" | "missing";
//     feedback: string;
//     suggestion?: string;
//   }[];
//   keywords: { word: string; found: boolean }[];
//   rewriteSuggestions: { original: string; improved: string }[];
// }

// const mockAnalysis: AnalysisResult = {
//   overallScore: 72,
//   atsScore: 68,
//   impactScore: 75,
//   clarityScore: 80,
//   sections: [
//     { name: "Contact Information", score: 90, status: "strong", feedback: "All necessary contact details are present." },
//     { name: "Professional Summary", score: 65, status: "needs-work", feedback: "Summary is too generic. Tailor it to your target role.", suggestion: "Add specific years of experience, key skills, and a measurable achievement." },
//     { name: "Work Experience", score: 70, status: "needs-work", feedback: "Bullet points lack quantifiable results.", suggestion: "Use the formula: Action verb + Task + Result with numbers." },
//     { name: "Skills", score: 80, status: "strong", feedback: "Good variety of relevant skills listed." },
//     { name: "Education", score: 85, status: "strong", feedback: "Education section is well-structured." },
//     { name: "Projects", score: 0, status: "missing", feedback: "No projects section found. Adding projects can strengthen your profile.", suggestion: "Include 2-3 relevant projects with tech stack and outcomes." },
//   ],
//   keywords: [
//     { word: "React", found: true },
//     { word: "TypeScript", found: true },
//     { word: "Leadership", found: false },
//     { word: "Agile", found: false },
//     { word: "Problem-solving", found: true },
//     { word: "Collaboration", found: true },
//     { word: "CI/CD", found: false },
//     { word: "Testing", found: true },
//   ],
//   rewriteSuggestions: [
//     {
//       original: "Worked on various frontend projects using React.",
//       improved: "Developed and shipped 5+ customer-facing React applications, reducing page load times by 40% and increasing user engagement by 25%.",
//     },
//     {
//       original: "Responsible for team communication and project updates.",
//       improved: "Led weekly cross-functional standups for a 12-person team, improving sprint velocity by 18% through streamlined communication workflows.",
//     },
//     {
//       original: "Helped improve the website performance.",
//       improved: "Optimized Core Web Vitals across 3 production apps, achieving a 35% improvement in LCP and reducing bounce rate by 12%.",
//     },
//   ],
// };

// type PageState = "upload" | "analyzing" | "results";

// const statusIcon = (status: string) => {
//   if (status === "strong") return <CheckCircle2 className="w-4 h-4 text-green-600" />;
//   if (status === "needs-work") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
//   return <XCircle className="w-4 h-4 text-destructive" />;
// };

// const scoreColor = (score: number) => {
//   if (score >= 80) return "text-green-600";
//   if (score >= 60) return "text-amber-500";
//   return "text-destructive";
// };

// const ResumeAnalyzer = () => {
//   const [state, setState] = useState<PageState>("upload");
//   const [resumeText, setResumeText] = useState("");
//   const [targetRole, setTargetRole] = useState("");
//   const [result, setResult] = useState<AnalysisResult | null>(null);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Simulate reading file
//       setResumeText(`[Uploaded: ${file.name}]\n\nResume content would be extracted here from the uploaded PDF file.`);
//     }
//   };

//   const analyze = () => {
//     if (!resumeText.trim()) return;
//     setState("analyzing");
//     setTimeout(() => {
//       setResult(mockAnalysis);
//       setState("results");
//     }, 2200);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-40">
//         <div className="container mx-auto flex items-center gap-4 h-16 px-6">
//           <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
//             <ArrowLeft className="w-5 h-5" />
//           </Link>
//           <h1 className="font-display text-xl text-foreground">Resume Analyzer</h1>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-10 max-w-4xl">
//         {/* Upload */}
//         {state === "upload" && (
//           <Card className="border-border/60 max-w-2xl mx-auto">
//             <CardHeader className="text-center pb-2">
//               <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
//                 <FileText className="w-7 h-7 text-accent" />
//               </div>
//               <CardTitle className="text-2xl">Analyze Your Resume</CardTitle>
//               <CardDescription>Upload or paste your resume to get AI-powered feedback and suggestions.</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-5 pt-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-foreground">Target Role (optional)</label>
//                 <Input placeholder="e.g. Senior Frontend Developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
//               </div>

//               <div
//                 className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent/40 transition-colors"
//                 onClick={() => fileRef.current?.click()}
//               >
//                 <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
//                 <p className="text-sm font-medium text-foreground">Click to upload your resume</p>
//                 <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT — max 5MB</p>
//                 <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileUpload} />
//               </div>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
//                 <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">or paste your resume</span></div>
//               </div>

//               <Textarea
//                 placeholder="Paste your resume text here..."
//                 className="min-h-[180px] resize-none"
//                 value={resumeText}
//                 onChange={(e) => setResumeText(e.target.value)}
//               />

//               <Button onClick={analyze} disabled={!resumeText.trim()} className="w-full" size="lg">
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 Analyze Resume
//               </Button>
//             </CardContent>
//           </Card>
//         )}

//         {/* Analyzing */}
//         {state === "analyzing" && (
//           <div className="flex flex-col items-center justify-center py-24 gap-6">
//             <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center animate-pulse">
//               <BarChart3 className="w-8 h-8 text-accent" />
//             </div>
//             <div className="text-center space-y-2">
//               <h2 className="text-xl font-display text-foreground">Analyzing your resume...</h2>
//               <p className="text-sm text-muted-foreground">Checking ATS compatibility, impact, and clarity.</p>
//             </div>
//             <Progress value={66} className="w-64 h-2" />
//           </div>
//         )}

//         {/* Results */}
//         {state === "results" && result && (
//           <div className="space-y-6">
//             {/* Score overview */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {[
//                 { label: "Overall", score: result.overallScore },
//                 { label: "ATS", score: result.atsScore },
//                 { label: "Impact", score: result.impactScore },
//                 { label: "Clarity", score: result.clarityScore },
//               ].map((s) => (
//                 <Card key={s.label} className="border-border/60 text-center">
//                   <CardContent className="pt-6 pb-4">
//                     <div className={`text-3xl font-display ${scoreColor(s.score)}`}>{s.score}</div>
//                     <p className="text-xs text-muted-foreground mt-1">{s.label} Score</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             <Tabs defaultValue="sections" className="w-full">
//               <TabsList className="w-full grid grid-cols-3">
//                 <TabsTrigger value="sections">Sections</TabsTrigger>
//                 <TabsTrigger value="keywords">Keywords</TabsTrigger>
//                 <TabsTrigger value="rewrites">AI Rewrites</TabsTrigger>
//               </TabsList>

//               <TabsContent value="sections" className="space-y-3 mt-4">
//                 {result.sections.map((sec) => (
//                   <Card key={sec.name} className="border-border/60">
//                     <CardContent className="p-4 space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           {statusIcon(sec.status)}
//                           <span className="font-medium text-foreground">{sec.name}</span>
//                         </div>
//                         {sec.score > 0 && <Badge variant="secondary">{sec.score}/100</Badge>}
//                         {sec.score === 0 && <Badge variant="destructive">Missing</Badge>}
//                       </div>
//                       <p className="text-sm text-muted-foreground">{sec.feedback}</p>
//                       {sec.suggestion && (
//                         <p className="text-sm text-accent bg-accent/5 rounded-lg p-3 border border-accent/10">
//                           💡 {sec.suggestion}
//                         </p>
//                       )}
//                     </CardContent>
//                   </Card>
//                 ))}
//               </TabsContent>

//               <TabsContent value="keywords" className="mt-4">
//                 <Card className="border-border/60">
//                   <CardHeader>
//                     <CardTitle className="text-lg flex items-center gap-2">
//                       <Target className="w-5 h-5 text-accent" />
//                       Keyword Match
//                     </CardTitle>
//                     <CardDescription>Important keywords recruiters look for in your target role.</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex flex-wrap gap-2">
//                       {result.keywords.map((kw) => (
//                         <Badge key={kw.word} variant={kw.found ? "default" : "outline"} className={!kw.found ? "border-dashed text-muted-foreground" : ""}>
//                           {kw.found ? "✓" : "✗"} {kw.word}
//                         </Badge>
//                       ))}
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-4">
//                       {result.keywords.filter((k) => k.found).length} of {result.keywords.length} keywords found.
//                       Add missing keywords naturally into your experience bullets.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="rewrites" className="space-y-4 mt-4">
//                 {result.rewriteSuggestions.map((rw, i) => (
//                   <Card key={i} className="border-border/60">
//                     <CardContent className="p-5 space-y-3">
//                       <div>
//                         <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original</span>
//                         <p className="text-sm text-muted-foreground mt-1 line-through decoration-destructive/40">{rw.original}</p>
//                       </div>
//                       <div>
//                         <span className="text-xs font-medium text-accent uppercase tracking-wide flex items-center gap-1">
//                           <Sparkles className="w-3 h-3" /> Improved
//                         </span>
//                         <p className="text-sm text-foreground mt-1 bg-accent/5 rounded-lg p-3 border border-accent/10">{rw.improved}</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </TabsContent>
//             </Tabs>

//             <Button onClick={() => { setState("upload"); setResumeText(""); setResult(null); }} variant="outline" className="w-full" size="lg">
//               <RotateCcw className="w-4 h-4 mr-2" />
//               Analyze Another Resume
//             </Button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ResumeAnalyzer;
