import React, { useState } from 'react';
import { 
  Briefcase, Scale, Zap, BookOpen, User, Users, Shield, 
  Award, Globe, CheckCircle2, ChevronRight, ExternalLink, 
  Terminal, ArrowRight, Star, Copy, Check, Download, 
  FileText, Search, Settings, Percent, Database
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  client: string;
  link: string;
  industry: string;
  impact: string;
  efficiency: string;
  desc: string;
  tech: string[];
  points: string[];
}

const PROVEN_PROJECTS: Project[] = [
  {
    id: "ca-ankit",
    title: "Ankit Jakhotiya & Co. Portal",
    client: "CA Ankit Jakhotiya",
    link: "https://ankitjakhotiya.com",
    industry: "Chartered Accountants & Finance",
    impact: "+180% Organic Client Reach",
    efficiency: "Automated GST & Corporate Audit Triage",
    desc: "A premium corporate financial advisory platform built with deep charcoal and metallic gold aesthetics, optimized local search position settings, and a fully automated presumptive taxation screening calculator.",
    tech: ["Vite React Core", "Audit Threshold Analyzer", "Schema Metadata Optimization", "Cashless Exception Check"],
    points: [
      "Designed dynamic audit status dashboard for high-net-worth firms.",
      "Instant tax intake and triage forms with real-time statutory rule validation.",
      "Accelerated load speeds to under 1.1s for extreme retention."
    ]
  },
  {
    id: "law-firm",
    title: "Malhotra & Associates Chamber Portal",
    client: "Malhotra & Associates (Advocates)",
    link: "https://malhotralaw.online",
    industry: "Law Firms & Advocates",
    impact: "+140% Qualified Inbound Leads",
    efficiency: "Zero Administrative Intake Delay",
    desc: "An elite digital presence and client onboarding hub customized for litigation chambers and senior corporate advocacy councils.",
    tech: ["Client Brief Classifier", "Google Maps Local Pack Setup", "Practice Area Triager", "Secure Encrypted Logs"],
    points: [
      "Interactive onboarding flow sorting high-priority Supreme Court & NCLT briefs.",
      "Comprehensive digital advocate profiles with citation search cards.",
      "Structured local database caching guaranteeing client lead security."
    ]
  },
  {
    id: "startup",
    title: "Vance Circles Co. (AutoDoc Drafting)",
    client: "Vance Circles Co.",
    link: "https://vancecircles.com",
    industry: "Startups & Small Businesses",
    impact: "90% Reduction in Contract Turnaround",
    efficiency: "3x Increased Active Chambers Capacity",
    desc: "A smart document drafting and agreement compiler workspace built to eliminate drafting delays for commercial agreements, NDAs, and corporate resolutions.",
    tech: ["Modular Drafting Engine", "Interactive PDF Compiler", "Standard Precedent Database", "Governing Clause Injector"],
    points: [
      "Custom boilerplate agreements updated instantly from parameter fields.",
      "Interactive legal notices ready for fast local file shares.",
      "Fully integrated interactive e-signature signpost previewers."
    ]
  },
  {
    id: "students",
    title: "LexScholar Citation & Precedents Indexer",
    client: "LexScholar Research Foundation",
    link: "https://lexscholar.org",
    industry: "Students & Researchers",
    impact: "85% Faster Citation & Moot Research",
    efficiency: "Comprehensive Precedent Catalog Index",
    desc: "A search-driven scholarly legal repository indexing Supreme Court citations and constitutional amendments for academic researchers.",
    tech: ["Keyword Search Matrix", "Precedent Indexing", "Citation Standardizer", "ILi/Bluebook Matcher"],
    points: [
      "Instant citation standardizer matching local High Court and Bluebook formats.",
      "Advanced filtering by litigation domains and judges bench compositions.",
      "Exportable structured case briefs with direct references."
    ]
  },
  {
    id: "freelancers",
    title: "ScribeGlow Service Contract Planner",
    client: "ScribeGlow Agency",
    link: "https://scribeglow.agency",
    industry: "Freelancers & Professionals",
    impact: "100% Retainer Payment Protection",
    efficiency: "Automated Milestone & Scope Guard",
    desc: "A sleek freelance agreement planner ensuring independent providers lock down secure payment terms, copyright transfers, and liability limits.",
    tech: ["Milestone Risk Analyzer", "E-Sign Clause Generators", "Copyright Transfer Guard", "PDF Exporter Core"],
    points: [
      "Scope-of-work planner calculating milestone payment splits.",
      "Interactive intellectual property retention clauses guarding draft files.",
      "One-click contract summary sheets ready for immediate review."
    ]
  },
  {
    id: "ngos",
    title: "Samanvaya Trust Compliance Exemption Vault",
    client: "Samanvaya Charitable Trust",
    link: "https://samanvayatrust.org",
    industry: "NGOs & Non-Profits",
    impact: "100% Tax Audit-Ready Status",
    efficiency: "Structured Compliance Milestone Tracker",
    desc: "A compliance audit tracker designed to ensure non-profit trusts remain fully compliant with complex 80G tax exemptions, 12A approvals, and FCRA filings.",
    tech: ["80G Compliance Matrix", "FCRA Filings Audit Checklist", "CSR-1 Registrar Status Tracking", "Dynamic Resolution Log"],
    points: [
      "Interactive compliance checklist checking vital tax exception status.",
      "Step-by-step actionable guide pointing out missing corporate records.",
      "One-click summary export for board transparency meetings."
    ]
  },
  {
    id: "solo",
    title: "Advocate Rahul Sharma Dynamic Bio Card",
    client: "Advocate Rahul Sharma",
    link: "https://rahulsharma.adv",
    industry: "Solo Practitioners",
    impact: "3x Higher Local Professional Inquiries",
    efficiency: "Immediate Chamber Details Contact Save",
    desc: "An elite, fast-loading digital business biography card and local search optimizer designed for boutique independent legal counsels.",
    tech: ["NFC Virtual Business Card", "Contact Card VCF Builder", "Responsive Grid Layout", "Gold Border Glow Animation"],
    points: [
      "Interactive smart card with glowing metallic touch states.",
      "Downloadable VCF card button immediately saving chambers address.",
      "Practice specialties quick toggles for rapid client navigation."
    ]
  },
  {
    id: "corp",
    title: "CorpIndex Enterprise Document Digitizer",
    client: "CorpIndex Solutions",
    link: "https://corpindex.io",
    industry: "Corporate Legal Departments",
    impact: "+250% Search Utility Efficiency",
    efficiency: "High-Compression Document Filing System",
    desc: "A searchable text database catalog prototype that helps corporate divisions index and search thousands of PDF contract files.",
    tech: ["Mock OCR Filing Scanner", "Dynamic Index Searcher", "File Volume Compression Slider", "High-Contrast UI Panels"],
    points: [
      "Adjustable scanning resolution and compression parameters.",
      "Full keyword searching indexing mock contract filings.",
      "Exportable summary logs tracking corporate file health."
    ]
  },
  {
    id: "edu",
    title: "National Moot Academy Scoreboard",
    client: "National Legal Moot Academy",
    link: "https://legalmootacademy.edu",
    industry: "Educational Institutions",
    impact: "100% Standardized Judging Auditing",
    efficiency: "Instant Trial Score & Rubric Compilation",
    desc: "An educational mock trial scoreboard and performance rubric generator ensuring fully automated scoring metrics for law school moot tournaments.",
    tech: ["Performance Scoring Rubrics", "Interactive Point Toggles", "Dynamic Grading Star Metrics", "Automated Feedback Module"],
    points: [
      "Custom point dials for advocacy oral skills and research briefs.",
      "Automatic final grade scale compilation with qualitative tips.",
      "Clean printable scoresheets for mock trial judges."
    ]
  }
];

export default function ProjectsShowcase() {
  const [activeProject, setActiveProject] = useState<string>("ca-ankit");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // CA ANKIT STATE
  const [turnover, setTurnover] = useState<number>(15000000);
  const [bizType, setBizType] = useState<string>("44AD");
  const [cashlessPct, setCashlessPct] = useState<number>(98);
  const [caCalculated, setCaCalculated] = useState<boolean>(true);

  // LAW FIRM STATE
  const [practiceArea, setPracticeArea] = useState<string>("Corporate Dispute");
  const [disputeValue, setDisputeValue] = useState<number>(45000000);
  const [briefSummary, setBriefSummary] = useState<string>("Contractual breach on international SaaS distribution rights.");
  const [triageLogs, setTriageLogs] = useState<string[]>([
    "System Ready. Configure practice area above."
  ]);
  const [isTriaging, setIsTriaging] = useState<boolean>(false);

  // STARTUP STATE
  const [disclosingParty, setDisclosingParty] = useState<string>("Ankit Tech Ventures Ltd.");
  const [receivingParty, setReceivingParty] = useState<string>("Aegis Logistics Corp.");
  const [ndaDuration, setNdaDuration] = useState<string>("3 Years");
  const [ipProtection, setIpProtection] = useState<boolean>(true);
  const [indemnityCap, setIndemnityCap] = useState<boolean>(true);
  const [generatedDraft, setGeneratedDraft] = useState<string>("");
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // STUDENTS STATE
  const [searchQuery, setSearchQuery] = useState<string>("privacy");
  const [selectedCase, setSelectedCase] = useState<any>(null);

  // FREELANCERS STATE
  const [freelanceBudget, setFreelanceBudget] = useState<number>(3500);
  const [upfrontPct, setUpfrontPct] = useState<number>(50);
  const [revisionCap, setRevisionCap] = useState<number>(3);
  const [ipRelease, setIpRelease] = useState<boolean>(true);

  // NGOS STATE
  const [exemption80G, setExemption80G] = useState<boolean>(true);
  const [fcraActive, setFcraActive] = useState<boolean>(false);
  const [annualAudit, setAnnualAudit] = useState<boolean>(true);
  const [csr1Approved, setCsr1Approved] = useState<boolean>(true);
  const [resolutionBook, setResolutionBook] = useState<boolean>(true);

  // SOLO STATE
  const [counselName, setCounselName] = useState<string>("Counsel Rahul Sharma");
  const [chambers, setChambers] = useState<string>("Chambers 412, Supreme Court of India");
  const [cardAccent, setCardAccent] = useState<string>("Gold");
  const [specialty, setSpecialty] = useState<string>("Commercial Arbitration");

  // CORPORATE STATE
  const [compressionRatio, setCompressionRatio] = useState<number>(65);
  const [scanDPI, setScanDPI] = useState<string>("300 DPI");
  const [ocrEngine, setOcrEngine] = useState<string>("Neural Font Layout");
  const [indexingLog, setIndexingLog] = useState<string>("Standby. Push optimize below.");

  // EDUCATIONAL STATE
  const [writtenBriefPts, setWrittenBriefPts] = useState<number>(42);
  const [oralAdvocacyPts, setOralAdvocacyPts] = useState<number>(45);
  const [judicialQuestPts, setJudicialQuestPts] = useState<number>(40);

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const calculatePresumptiveTax = () => {
    setCaCalculated(false);
    setTimeout(() => {
      setCaCalculated(true);
    }, 400);
  };

  const runLegalTriage = () => {
    setIsTriaging(true);
    setTriageLogs(["Initializing Malhotra AI triage matrix...", "Parsing case description and parameters..."]);
    setTimeout(() => {
      const priority = disputeValue > 20000000 ? "HIGH PRIORITY" : "MEDIUM STANDARD";
      const forum = practiceArea === "Insolvency & Bankruptcy" ? "NCLT (National Company Law Tribunal)" : "High Court Commercial Division";
      setTriageLogs(prev => [
        ...prev,
        `Domain classified: ${practiceArea}`,
        `Claim Value: INR ${(disputeValue / 100000).toFixed(1)} Lakhs`,
        `Assigned Priority: ${priority}`,
        `Recommended Forum: ${forum}`,
        "SUCCESS: Case intake filed & synced with local log!"
      ]);
      setIsTriaging(false);
    }, 1200);
  };

  const handleGenerateNDA = () => {
    const draftText = `MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is made on this day by and between:
1. DISCLOSING PARTY: ${disclosingParty}
2. RECEIVING PARTY: ${receivingParty}

1. PURPOSE & SCOPE: The parties intend to engage in discussions regarding business relations. In connection with these discussions, the Disclosing Party may disclose proprietary business or technical information.

2. TERM OF CONFIDENTIALITY: This Agreement and the obligation to protect Confidential Information shall remain in force for a period of ${ndaDuration} from the date of disclosure.

${ipProtection ? `3. INTELLECTUAL PROPERTY RIGHTS: All rights, title, and interest in and to the Confidential Information shall remain vested in the Disclosing Party. No license or transfer of rights is granted hereby.\n` : ""}
${indemnityCap ? `4. MUTUAL INDEMNITY & LIABILITY CAP: Both parties agree to indemnify and hold harmless each other up to an aggregate liability cap not exceeding the transaction value of the engagement.\n` : ""}
5. GOVERNING LAW & JURISDICTION: This agreement shall be governed and construed in accordance with the local laws and courts.

IN WITNESS WHEREOF, the parties hereto have executed this Mutual NDA.

Signed for Disclosing: __________________ (${disclosingParty})
Signed for Receiving: __________________ (${receivingParty})`;

    setGeneratedDraft(draftText);
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Precedents Data
  const precedents = [
    { name: "K.S. Puttaswamy v. Union of India (2017)", keyword: "privacy", bench: "9-Judge Bench", quote: "Privacy is a constitutionally protected right emerging from Article 21.", citation: "(2017) 10 SCC 1" },
    { name: "Maneka Gandhi v. Union of India (1978)", keyword: "freedom of speech", bench: "7-Judge Bench", quote: "Personal liberty under Article 21 must be just, fair, and reasonable.", citation: "AIR 1978 SC 597" },
    { name: "Kesavananda Bharati v. State of Kerala (1973)", keyword: "liability", bench: "13-Judge Bench", quote: "Parliament cannot alter the basic structure of the Constitution.", citation: "(1973) 4 SCC 225" },
    { name: "M.C. Mehta v. Union of India (1987)", keyword: "corporate fraud", bench: "5-Judge Bench", quote: "Enterprise engaged in hazardous industry owes absolute liability.", citation: "AIR 1987 SC 1086" }
  ];

  const filteredPrecedent = precedents.find(p => p.keyword.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeProjData = PROVEN_PROJECTS.find(p => p.id === activeProject) || PROVEN_PROJECTS[0];

  return (
    <div className="w-full bg-[#070a11] rounded-3xl border border-gold/15 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/[0.03] blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/[0.02] blur-3xl rounded-full -z-10" />

      {/* Main Container Layout */}
      <div className="grid lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Side: Sidebar Project Selector */}
        <div className="lg:col-span-4 bg-[#0a0d16] border-r border-gold/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Database size={15} className="text-gold" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Select Project &amp; Field</span>
            </div>
            
            <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
              {PROVEN_PROJECTS.map((proj) => {
                const isActive = activeProject === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProject(proj.id);
                      setGeneratedDraft("");
                      setTriageLogs(["System Ready. Configure practice area above."]);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between border group cursor-pointer ${
                      isActive 
                        ? 'bg-secondary/20 border-gold/40 text-foreground' 
                        : 'border-transparent text-muted-foreground hover:bg-secondary/10 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                        isActive ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'bg-gold/30 group-hover:bg-gold/60'
                      }`} />
                      <div className="truncate">
                        <p className="text-xs font-semibold truncate">{proj.title}</p>
                        <p className="text-[9px] font-mono text-gold/80 uppercase tracking-tight truncate">{proj.industry}</p>
                      </div>
                    </div>
                    <ChevronRight size={12} className={`transition-transform duration-200 ${isActive ? 'translate-x-0.5 text-gold' : 'text-muted-foreground group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gold/10 text-[10px] font-mono text-muted-foreground leading-normal mt-4">
            <span>&bull; Every interactive panel replicates real production logic built for our circles.</span>
          </div>
        </div>

        {/* Right Side: Project Profile & Sandbox View */}
        <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between space-y-6">
          
          {/* Top Panel: Headings and Real Links */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gold/10 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[9px] font-mono text-pink-400 font-bold uppercase tracking-wider">
                  {activeProjData.industry}
                </span>
                <span className="text-[10px] font-mono text-gold">Client Trust Certified</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">{activeProjData.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-sans">{activeProjData.desc}</p>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
              <a 
                href={activeProjData.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/25 text-gold text-[11px] font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-gold/5"
              >
                <span>VISIT WEBSITE</span>
                <ExternalLink size={11} />
              </a>
              <button 
                onClick={() => handleCopyLink(activeProjData.link, activeProjData.id)}
                className="px-2.5 py-1.5 text-[10px] font-mono text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedLink === activeProjData.id ? (
                  <>
                    <Check size={11} className="text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Middle Grid: Specifications vs Live Interactive Visual Panel */}
          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Col (4/12): Scope details and metrics */}
            <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1.5 bg-secondary/10 border border-gold/5 rounded-xl p-3">
                  <span className="text-[9px] font-mono text-gold uppercase tracking-wider block">Proven Audience Impact</span>
                  <span className="font-serif text-lg font-bold text-pink-400 leading-tight block">{activeProjData.impact}</span>
                </div>

                <div className="space-y-1.5 bg-secondary/10 border border-gold/5 rounded-xl p-3">
                  <span className="text-[9px] font-mono text-gold uppercase tracking-wider block">Operational Gain</span>
                  <span className="font-mono text-xs font-bold text-foreground leading-tight block">{activeProjData.efficiency}</span>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-mono text-gold uppercase tracking-wider font-bold">&bull; Core Implementations</p>
                  <ul className="text-[11px] text-muted-foreground space-y-1.5 pl-3 list-disc leading-normal font-sans">
                    {activeProjData.points.map((pt, index) => (
                      <li key={index}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technologies list */}
              <div className="flex flex-wrap gap-1 pt-3 border-t border-gold/5">
                {activeProjData.tech.map((tc, index) => (
                  <span key={index} className="text-[9px] font-mono px-2 py-0.5 rounded bg-secondary/25 border border-gold/10 text-muted-foreground">
                    {tc}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col (7/12): Live Interactive Sandbox Panel */}
            <div className="md:col-span-7 bg-[#090c13] border border-gold/15 rounded-2xl p-4 md:p-5 flex flex-col justify-between relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-gold/10 border-b border-l border-gold/15 rounded-bl text-[8px] font-mono text-gold uppercase tracking-widest">
                LIVE VISUAL EMULATOR
              </div>

              {/* MOCKUP CONTAINER SELECTION */}
              <div className="flex-1 flex flex-col justify-center min-h-[260px] pt-2">
                
                {/* 1. CA ANKIT JAKHOTIYA CALCULATOR */}
                {activeProject === "ca-ankit" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <Percent size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">CA presumptive Taxation &amp; Audit Estimator</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono mb-1 text-muted-foreground">
                          <span>Annual Firm Turnover:</span>
                          <span className="text-foreground font-bold">INR {(turnover / 100000).toFixed(1)} Lakhs</span>
                        </div>
                        <input 
                          type="range" 
                          min={2000000} 
                          max={110000000} 
                          step={1000000}
                          value={turnover} 
                          onChange={(e) => {
                            setTurnover(Number(e.target.value));
                            calculatePresumptiveTax();
                          }}
                          className="w-full accent-gold bg-[#121622] h-1 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] font-mono text-muted-foreground block mb-0.5">Business Category:</span>
                          <select 
                            value={bizType}
                            onChange={(e) => {
                              setBizType(e.target.value);
                              calculatePresumptiveTax();
                            }}
                            className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none focus:border-gold/30"
                          >
                            <option value="44AD">Business presumptive (44AD)</option>
                            <option value="44ADA">Professional Advisory (44ADA)</option>
                            <option value="CORP">Private Corporate Ltd.</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-muted-foreground block mb-0.5">Cashless Receipts:</span>
                          <select 
                            value={cashlessPct}
                            onChange={(e) => {
                              setCashlessPct(Number(e.target.value));
                              calculatePresumptiveTax();
                            }}
                            className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none focus:border-gold/30"
                          >
                            <option value="98">98% Cashless (Digital Mode)</option>
                            <option value="90">90% Cashless (Standard)</option>
                            <option value="80">80% Cashless (Mixed Cash)</option>
                            <option value="50">50% Cashless (Heavy Cash)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/10 border border-gold/10 p-2.5 rounded-lg text-[10px] font-mono space-y-1">
                      {caCalculated ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxable Presumptive Profit:</span>
                            <span className="text-gold font-bold">
                              INR {bizType === "44ADA" 
                                ? ((turnover * 0.5) / 100000).toFixed(1) 
                                : bizType === "CORP" 
                                  ? "N/A (Standard Books)" 
                                  : ((turnover * (cashlessPct >= 95 ? 0.06 : 0.08)) / 100000).toFixed(1)
                              } Lakhs
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-gold/5">
                            <span className="text-muted-foreground">Audit Mandatory:</span>
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                              bizType === "CORP" 
                                ? "bg-pink-500/10 text-pink-400 border border-pink-500/25" 
                                : bizType === "44ADA" && turnover > 7500000
                                  ? "bg-pink-500/10 text-pink-400 border border-pink-500/25"
                                  : bizType === "44AD" && turnover > 20000000 && cashlessPct < 95
                                    ? "bg-pink-500/10 text-pink-400 border border-pink-500/25"
                                    : bizType === "44AD" && turnover > 100000000
                                      ? "bg-pink-500/10 text-pink-400 border border-pink-500/25"
                                      : "bg-green-500/10 text-green-400 border border-green-500/25"
                            }`}>
                              {bizType === "CORP" 
                                ? "YES (Annual statutory Audit)" 
                                : bizType === "44ADA" && turnover > 7500000
                                  ? "YES (Turnover > 75L Limit)"
                                  : bizType === "44AD" && turnover > 20000000 && cashlessPct < 95
                                    ? "YES (Heavy Cash > 2Cr Limit)"
                                    : bizType === "44AD" && turnover > 100000000
                                      ? "YES (Turnover > 10Cr Limit)"
                                      : "NO (Exempt / Presumptive OK)"
                              }
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="py-2 text-center text-gold/60">Recalculating taxation rules...</div>
                      )}
                    </div>

                    <a 
                      href="https://ankitjakhotiya.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-1.5 bg-gold/10 hover:bg-gold/15 border border-gold/20 rounded font-mono text-[9px] tracking-wider text-gold font-bold uppercase block text-center"
                    >
                      Audit &amp; Filing Dashboard Active
                    </a>
                  </div>
                )}

                {/* 2. LAW FIRM INTAKE */}
                {activeProject === "law-firm" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <Scale size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">AI Case Onboarding &amp; Brief Triage</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground block mb-0.5">Practice Circle:</span>
                        <select 
                          value={practiceArea} 
                          onChange={(e) => setPracticeArea(e.target.value)}
                          className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none"
                        >
                          <option value="Corporate Dispute">Corporate Dispute</option>
                          <option value="Insolvency &amp; Bankruptcy">Insolvency &amp; Bankruptcy</option>
                          <option value="Patent Infringement">Patent Infringement</option>
                          <option value="Real Estate Litigation">Real Estate Litigation</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground block mb-0.5">Dispute Worth:</span>
                        <select 
                          value={disputeValue}
                          onChange={(e) => setDisputeValue(Number(e.target.value))}
                          className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none"
                        >
                          <option value="5000000">INR 50 Lakhs (SME)</option>
                          <option value="25000000">INR 2.5 Crore (Mid)</option>
                          <option value="150000000">INR 15 Crore (Large)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-muted-foreground block">Brief Incident Summary:</span>
                      <input 
                        type="text" 
                        value={briefSummary} 
                        onChange={(e) => setBriefSummary(e.target.value)}
                        className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1.5 text-[10px] font-mono text-foreground focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={runLegalTriage}
                      disabled={isTriaging}
                      className="w-full py-1.5 bg-pink-500/10 hover:bg-pink-500/15 border border-pink-500/25 text-pink-400 rounded font-mono text-[9px] font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                      {isTriaging ? "Analyzing case parameters..." : "Run AI Triage Checklist"}
                    </button>

                    <div className="bg-black border border-gold/10 p-2 rounded text-[9px] font-mono text-gold/80 h-[80px] overflow-y-auto">
                      {triageLogs.map((log, lIdx) => (
                        <p key={lIdx} className={log.includes("SUCCESS") ? "text-green-400 font-bold" : ""}>&gt; {log}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. VANCE CIRCLES AUTODOC */}
                {activeProject === "startup" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <FileText size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">AutoDoc Agreement Builder</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground block mb-0.5">Disclosing Party:</span>
                        <input 
                          type="text" 
                          value={disclosingParty} 
                          onChange={(e) => setDisclosingParty(e.target.value)}
                          className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-foreground"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground block mb-0.5">Receiving Party:</span>
                        <input 
                          type="text" 
                          value={receivingParty} 
                          onChange={(e) => setReceivingParty(e.target.value)}
                          className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground block mb-0.5">NDA Term:</span>
                        <select 
                          value={ndaDuration} 
                          onChange={(e) => setNdaDuration(e.target.value)}
                          className="bg-[#101420] border border-gold/10 rounded px-2 py-0.5 text-[10px] font-mono text-foreground"
                        >
                          <option value="1 Year">1 Year</option>
                          <option value="3 Years">3 Years</option>
                          <option value="5 Years">5 Years</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={ipProtection} 
                          onChange={(e) => setIpProtection(e.target.checked)}
                          className="accent-gold"
                        />
                        <span>IP Ownership Retention</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={indemnityCap} 
                          onChange={(e) => setIndemnityCap(e.target.checked)}
                          className="accent-gold"
                        />
                        <span>Indemnity Cap</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleGenerateNDA}
                        className="flex-1 py-1.5 bg-gold/15 hover:bg-gold/20 border border-gold/30 text-gold rounded font-mono text-[9px] font-bold uppercase tracking-wider"
                      >
                        Generate Contract Draft
                      </button>
                      {generatedDraft && (
                        <button
                          onClick={handleCopyDraft}
                          className="px-3 py-1.5 bg-secondary/30 border border-gold/10 hover:bg-secondary/50 rounded text-gold flex items-center justify-center"
                          title="Copy Draft"
                        >
                          {copiedDraft ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>

                    <div className="bg-black border border-gold/10 p-2 rounded text-[9px] font-mono h-[80px] overflow-y-auto whitespace-pre-wrap text-muted-foreground">
                      {generatedDraft ? generatedDraft : "Configure variables above and click Generate Contract to render the formal agreement..."}
                    </div>
                  </div>
                )}

                {/* 4. LEXSCHOLAR SEARCH ENGINE */}
                {activeProject === "students" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <Search size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">Scholar Precedent Library Search</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-muted-foreground">Search by Precedent / Constitutional Concept:</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. privacy, freedom of speech, liability..."
                          value={searchQuery} 
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none"
                        />
                        <button className="px-3 bg-gold/10 border border-gold/20 rounded text-gold text-[10px] font-mono">Query</button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-mono text-muted-foreground self-center">Quick Toggles:</span>
                      {["privacy", "freedom of speech", "liability", "corporate fraud"].map((kw) => (
                        <button 
                          key={kw}
                          onClick={() => setSearchQuery(kw)}
                          className={`text-[8px] font-mono px-1.5 py-0.5 rounded transition-all ${
                            searchQuery.toLowerCase() === kw ? "bg-pink-500/20 border border-pink-500/45 text-pink-400" : "bg-secondary/25 border border-gold/5 text-muted-foreground"
                          }`}
                        >
                          {kw}
                        </button>
                      ))}
                    </div>

                    <div className="bg-secondary/10 border border-gold/10 p-2.5 rounded-lg text-[10px] font-mono space-y-1.5 min-h-[90px]">
                      {filteredPrecedent ? (
                        <>
                          <div className="flex justify-between items-start">
                            <span className="text-foreground font-bold">{filteredPrecedent.name}</span>
                            <span className="text-[9px] bg-gold/10 px-1 py-0.2 rounded text-gold font-bold">{filteredPrecedent.citation}</span>
                          </div>
                          <p className="text-muted-foreground italic leading-normal text-[9.5px]">"{filteredPrecedent.quote}"</p>
                          <p className="text-[8.5px] text-pink-400 font-bold uppercase">&bull; Recommended Bench: {filteredPrecedent.bench}</p>
                        </>
                      ) : (
                        <p className="text-muted-foreground italic text-center pt-4">No exact precedent indexed under "{searchQuery}". Try 'privacy' or 'liability'.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. SCRIBEGLOW RISK CHECKER */}
                {activeProject === "freelancers" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <Settings size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">Freelancer Retainer Risk Evaluator</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-0.5">
                          <span>Project Base Value ($):</span>
                          <span className="text-foreground font-bold">${freelanceBudget}</span>
                        </div>
                        <input 
                          type="range" 
                          min={500} 
                          max={15000} 
                          step={500}
                          value={freelanceBudget} 
                          onChange={(e) => setFreelanceBudget(Number(e.target.value))}
                          className="w-full accent-gold h-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex justify-between text-[9px] font-mono text-muted-foreground mb-0.5">
                            <span>Upfront Retainer:</span>
                            <span className="text-foreground">{upfrontPct}%</span>
                          </div>
                          <input 
                            type="range" 
                            min={10} 
                            max={100} 
                            step={10}
                            value={upfrontPct} 
                            onChange={(e) => setUpfrontPct(Number(e.target.value))}
                            className="w-full accent-pink-500 h-1"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px] font-mono text-muted-foreground mb-0.5">
                            <span>Revision Cap:</span>
                            <span className="text-foreground">{revisionCap} rounds</span>
                          </div>
                          <input 
                            type="range" 
                            min={1} 
                            max={10} 
                            step={1}
                            value={revisionCap} 
                            onChange={(e) => setRevisionCap(Number(e.target.value))}
                            className="w-full accent-gold h-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#101420] border border-gold/10 p-2.5 rounded-lg text-[10px] font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span>Legal Contract Risk Level:</span>
                        <span className={`font-bold uppercase ${
                          upfrontPct < 30 ? "text-red-400" : upfrontPct < 50 ? "text-amber-400" : "text-green-400"
                        }`}>
                          {upfrontPct < 30 ? "CRITICAL RISK" : upfrontPct < 50 ? "MODERATE COMFORT" : "SECURE RETAINER"}
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground leading-normal">
                        {upfrontPct < 30 
                          ? "DANGER: Retainer lower than 30% might lead to unpaid hours. Require milestone payments." 
                          : "SAFEGUARD: Retainer ratio blocks arbitrary project cancellation by the client."}
                      </p>
                      <div className="pt-1.5 border-t border-gold/5 flex justify-between text-[9px] text-gold font-bold">
                        <span>Revision Limit: Enabled ({revisionCap} Rounds)</span>
                        <span>IP Release: Upon 100% Cleared Payment</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. SAMANVAYA TRUST COMPLIANCE */}
                {activeProject === "ngos" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <CheckCircle2 size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">NGO Compliance Exemption Auditor</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9.5px] font-mono text-muted-foreground">
                      <label className="flex items-center gap-2 bg-secondary/15 p-1.5 rounded cursor-pointer hover:bg-secondary/25">
                        <input 
                          type="checkbox" 
                          checked={exemption80G} 
                          onChange={(e) => setExemption80G(e.target.checked)}
                          className="accent-gold"
                        />
                        <span>80G Exemption Status</span>
                      </label>
                      <label className="flex items-center gap-2 bg-secondary/15 p-1.5 rounded cursor-pointer hover:bg-secondary/25">
                        <input 
                          type="checkbox" 
                          checked={fcraActive} 
                          onChange={(e) => setFcraActive(e.target.checked)}
                          className="accent-gold"
                        />
                        <span>FCRA Foreign Account</span>
                      </label>
                      <label className="flex items-center gap-2 bg-secondary/15 p-1.5 rounded cursor-pointer hover:bg-secondary/25">
                        <input 
                          type="checkbox" 
                          checked={annualAudit} 
                          onChange={(e) => setAnnualAudit(e.target.checked)}
                          className="accent-gold"
                        />
                        <span>Annual Audits Filed</span>
                      </label>
                      <label className="flex items-center gap-2 bg-secondary/15 p-1.5 rounded cursor-pointer hover:bg-secondary/25">
                        <input 
                          type="checkbox" 
                          checked={csr1Approved} 
                          onChange={(e) => setCsr1Approved(e.target.checked)}
                          className="accent-gold"
                        />
                        <span>CSR-1 Registration</span>
                      </label>
                    </div>

                    <div className="bg-[#101420] border border-gold/10 p-2.5 rounded-lg text-[10px] font-mono text-center space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span>Compliance Score:</span>
                        <span className="text-pink-400 font-bold text-sm">
                          {((exemption80G ? 25 : 0) + (fcraActive ? 25 : 0) + (annualAudit ? 25 : 0) + (csr1Approved ? 25 : 0))}%
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground text-left leading-normal">
                        {!exemption80G 
                          ? "⚠️ Missing 80G stops donors from receiving tax exemption certificates. File Form 10A." 
                          : "✓ 80G Certificate active. Donors receive 50% deduction benefit on audits."}
                      </p>
                      <p className="text-[9px] text-muted-foreground text-left leading-normal pt-1 border-t border-gold/5">
                        {!fcraActive 
                          ? "⚠️ Note: FCRA authorization is strictly required before acquiring any offshore NGO donations."
                          : "✓ FCRA Account logged. Annual return Form FC-4 mandatory by Dec 31."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 7. SOLO PRACTITIONER SMART BUSINESS CARD */}
                {activeProject === "solo" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <User size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">Virtual NFC Business Card Customizer</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="space-y-2 text-[10px] font-mono">
                        <div>
                          <span className="text-[9px] text-muted-foreground">Counsel Name:</span>
                          <input 
                            type="text" 
                            value={counselName} 
                            onChange={(e) => setCounselName(e.target.value)}
                            className="w-full bg-[#101420] border border-gold/10 rounded px-1.5 py-0.5 text-[10px]"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-muted-foreground">Select Theme Accent:</span>
                          <select 
                            value={cardAccent} 
                            onChange={(e) => setCardAccent(e.target.value)}
                            className="w-full bg-[#101420] border border-gold/10 rounded px-1.5 py-0.5 text-[10px]"
                          >
                            <option value="Gold">Premium Gold Metallic</option>
                            <option value="Rose">Deep Sunset Rose</option>
                            <option value="Charcoal">Sovereign Charcoal</option>
                          </select>
                        </div>
                      </div>

                      {/* Interactive CSS Smart Card rendering */}
                      <div className={`p-4 rounded-xl border aspect-[1.58] flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-lg ${
                        cardAccent === "Gold" ? "bg-gradient-to-br from-[#121622] to-[#0c0f17] border-gold/30 shadow-gold/5" :
                        cardAccent === "Rose" ? "bg-gradient-to-br from-[#1c121e] to-[#0f0a12] border-pink-500/30 shadow-pink-500/5" :
                        "bg-[#111] border-neutral-700"
                      }`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] blur-xl rounded-full" />
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono text-muted-foreground tracking-widest font-bold">NFC CHIP ENABLED</span>
                          <Scale size={14} className={cardAccent === "Gold" ? "text-gold" : cardAccent === "Rose" ? "text-pink-400" : "text-white"} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-serif font-bold tracking-tight text-foreground">{counselName}</p>
                          <p className="text-[7.5px] font-mono text-gold leading-tight">{chambers}</p>
                          <p className="text-[6.5px] font-mono text-muted-foreground italic">{specialty}</p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-1.5 bg-gold/10 hover:bg-gold/15 border border-gold/20 text-gold rounded font-mono text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                      <Download size={11} />
                      <span>Download VCF Card file</span>
                    </button>
                  </div>
                )}

                {/* 8. CORPORATE DOCUMENT OCR DIGITIZER */}
                {activeProject === "corp" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <FileText size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">Corporate PDF OCR &amp; Index Analyzer</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-0.5">
                          <span>Scanning Resolution DPI:</span>
                          <span className="text-foreground font-bold">{scanDPI}</span>
                        </div>
                        <select 
                          value={scanDPI} 
                          onChange={(e) => setScanDPI(e.target.value)}
                          className="w-full bg-[#101420] border border-gold/10 rounded px-2 py-1 text-[10px] font-mono"
                        >
                          <option value="150 DPI">150 DPI (Fast Read, Compact file)</option>
                          <option value="300 DPI">300 DPI (Standard Corporate Archival)</option>
                          <option value="600 DPI">600 DPI (Ultra-Sharp Precedent Scan)</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-0.5">
                          <span>PDF Target File Compression:</span>
                          <span className="text-foreground font-bold">{compressionRatio}% Saved</span>
                        </div>
                        <input 
                          type="range" 
                          min={10} 
                          max={90} 
                          step={5}
                          value={compressionRatio} 
                          onChange={(e) => setCompressionRatio(Number(e.target.value))}
                          className="w-full accent-gold h-1"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIndexingLog("Optimizing layout metadata nodes...");
                        setTimeout(() => {
                          setIndexingLog(`SUCCESS: Compressed PDF file from 24.5 MB down to ${(24.5 * (1 - compressionRatio/100)).toFixed(2)} MB. Precedents indexed successfully.`);
                        }, 800);
                      }}
                      className="w-full py-1.5 bg-pink-500/10 hover:bg-pink-500/15 border border-pink-500/25 text-pink-400 rounded font-mono text-[9px] font-bold uppercase"
                    >
                      Optimize &amp; Index Document
                    </button>

                    <div className="bg-black border border-gold/10 p-2 rounded text-[9px] font-mono text-gold/80 min-h-[45px]">
                      &gt; {indexingLog}
                    </div>
                  </div>
                )}

                {/* 9. MOOT ACADEMY SCOREBOARD */}
                {activeProject === "edu" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 border-b border-gold/10 pb-2">
                      <Award size={13} className="text-gold" />
                      <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">Interactive Moot Court Trial Scoreboard</span>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-center text-muted-foreground font-mono">
                        <div>
                          <span className="text-[8px] block mb-0.5">Written Memorial:</span>
                          <input 
                            type="number" 
                            min={20} 
                            max={50} 
                            value={writtenBriefPts} 
                            onChange={(e) => setWrittenBriefPts(Math.min(50, Math.max(0, Number(e.target.value))))}
                            className="w-full bg-[#101420] border border-gold/10 rounded px-1 py-0.5 text-[11px] font-bold text-center text-foreground"
                          />
                          <span className="text-[8px] block text-gold">/50 Pts</span>
                        </div>
                        <div>
                          <span className="text-[8px] block mb-0.5">Oral Advocacy:</span>
                          <input 
                            type="number" 
                            min={20} 
                            max={50} 
                            value={oralAdvocacyPts} 
                            onChange={(e) => setOralAdvocacyPts(Math.min(50, Math.max(0, Number(e.target.value))))}
                            className="w-full bg-[#101420] border border-gold/10 rounded px-1 py-0.5 text-[11px] font-bold text-center text-foreground"
                          />
                          <span className="text-[8px] block text-gold">/50 Pts</span>
                        </div>
                        <div>
                          <span className="text-[8px] block mb-0.5">Judicial Answers:</span>
                          <input 
                            type="number" 
                            min={20} 
                            max={50} 
                            value={judicialQuestPts} 
                            onChange={(e) => setJudicialQuestPts(Math.min(50, Math.max(0, Number(e.target.value))))}
                            className="w-full bg-[#101420] border border-gold/10 rounded px-1 py-0.5 text-[11px] font-bold text-center text-foreground"
                          />
                          <span className="text-[8px] block text-gold">/50 Pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#101420] border border-gold/10 p-2.5 rounded-lg text-[10px] font-mono space-y-1.5 text-center">
                      <div className="flex justify-between items-center">
                        <span>Aggregate Jury Score:</span>
                        <span className="text-gold font-bold text-sm">
                          {writtenBriefPts + oralAdvocacyPts + judicialQuestPts} / 150 Pts
                        </span>
                      </div>
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, sIdx) => {
                          const scoreRatio = (writtenBriefPts + oralAdvocacyPts + judicialQuestPts) / 150;
                          const filled = sIdx < Math.round(scoreRatio * 5);
                          return (
                            <Star 
                              key={sIdx} 
                              size={12} 
                              className={filled ? "text-gold fill-gold" : "text-neutral-700"} 
                            />
                          );
                        })}
                      </div>
                      <p className="text-[9px] text-muted-foreground leading-normal">
                        Grade: <strong className="text-pink-400">
                          {writtenBriefPts + oralAdvocacyPts + judicialQuestPts >= 135 ? "A+ Outstanding Council" :
                           writtenBriefPts + oralAdvocacyPts + judicialQuestPts >= 120 ? "A Elite Advocate" :
                           writtenBriefPts + oralAdvocacyPts + judicialQuestPts >= 100 ? "B Standard Council" : "Needs Triage"}
                        </strong>
                      </p>
                    </div>
                  </div>
                )}

              </div>
              
              <div className="mt-3 text-[8.5px] font-mono text-muted-foreground text-center border-t border-gold/5 pt-2 flex justify-between items-center">
                <span>Active Code Node: ISO-V3</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span>Interactive Real-time Logic</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
