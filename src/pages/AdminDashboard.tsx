import { useEffect, useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  LogOut,
  Trash2,
  Plus,
  RefreshCw,
  FolderLock,
  Calendar,
  User,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Edit2,
  Search,
  Download,
  Volume2,
  Sparkles,
  Loader2,
  Smartphone
} from 'lucide-react';
import { useToast } from '../components/ui/toast';
import { Service, Inquiry } from '../types';
import { apiService } from '../lib/api';

// Native Web Audio Synthesizer to play a pleasant custom chime sound safely offline
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Low frequency tone followed by high bright peak for warning
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.6);
    
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5 note
      gain2.gain.setValueAtTime(0.2, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.8);
    }, 120);
  } catch (error) {
    console.warn("Failed to play custom synth chime:", error);
  }
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'services' | 'notifications'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [smsNotifications, setSmsNotifications] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [submittingService, setSubmittingService] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Search & Filters inputs state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');

  // Device Notifications Configuration State
  const [notificationGranted, setNotificationGranted] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission === 'granted' : false
  );
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // AI Response Strategy Playbook States
  const [selectedInquiryForAI, setSelectedInquiryForAI] = useState<Inquiry | null>(null);
  const [aiPlaybookResult, setAiPlaybookResult] = useState<string>('');
  const [playbookLoading, setPlaybookLoading] = useState<boolean>(false);

  // References to handle background real-time polling updates correctly
  const seenInquiryIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef<boolean>(true);

  // New Service inputs
  const [serviceForm, setServiceForm] = useState({
    title: '',
    icon: 'Scale',
    category: 'Legal Services',
    price: '₹999',
    isPopular: false,
    shortDesc: '',
    fullDesc: '',
    featuresInput: '',
    color: '#D4AF37'
  });

  // Edit Service modal state
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    icon: 'Scale',
    category: 'Legal Services',
    price: '₹999',
    isPopular: false,
    shortDesc: '',
    fullDesc: '',
    featuresInput: '',
    color: '#D4AF37'
  });

  // Authenticate session
  useEffect(() => {
    if (localStorage.getItem('asji_admin_token') !== 'authenticated_session') {
      toast({
        title: "Session Expired",
        description: "Please log in to continue.",
        type: "error"
      });
      navigate('/admin');
    }
  }, [navigate, toast]);

  // Fetch all inquiries and services
  const fetchInquiries = () => {
    setLoadingInquiries(true);
    apiService.getInquiries()
      .then((data) => {
        setInquiries(data);
        setLoadingInquiries(false);
        // Load initial entities to seen tracker on initial mount
        if (isFirstLoadRef.current && data.length > 0) {
          data.forEach(iq => seenInquiryIdsRef.current.add(iq.id));
          isFirstLoadRef.current = false;
        }
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Fetch Error", description: "Failed to fetch inquiries.", type: "error" });
        setLoadingInquiries(false);
      });
  };

  const fetchServices = () => {
    setLoadingServices(true);
    apiService.getServices()
      .then((data) => {
        setServices(data);
        setLoadingServices(false);
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Fetch Error", description: "Failed to fetch services.", type: "error" });
        setLoadingServices(false);
      });
  };

  const fetchSMSNotifications = () => {
    setLoadingNotifications(true);
    apiService.getSMSNotifications()
      .then((data) => {
        setSmsNotifications(data);
        setLoadingNotifications(false);
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Fetch Error", description: "Failed to fetch notification logs.", type: "error" });
        setLoadingNotifications(false);
      });
  };

  useEffect(() => {
    fetchInquiries();
    fetchServices();
    fetchSMSNotifications();
  }, []);

  const handleRequestAIPlaybook = async (inq: Inquiry) => {
    setSelectedInquiryForAI(inq);
    setAiPlaybookResult('');
    setPlaybookLoading(true);
    toast({
      title: "Consulting AI Engine Active",
      description: "Compiling strategy roadmap and client communication template...",
      type: "info"
    });
    try {
      const outcome = await apiService.generateAIActionPlan(inq);
      setAiPlaybookResult(outcome);
      playNotificationChime();
    } catch (err) {
      console.warn("AI Strategy Blueprint error:", err);
      toast({
        title: "Advocacy System Warning",
        description: "Secure gateway link timeout. Please check your system API configurations.",
        type: "error"
      });
      setSelectedInquiryForAI(null);
    } finally {
      setPlaybookLoading(false);
    }
  };

  // Background polling loop for high-frequency inquiry alerts
  useEffect(() => {
    const pollInterval = setInterval(() => {
      apiService.getInquiries()
        .then((data) => {
          let hasNew = false;
          let lastNewItem: Inquiry | null = null;
          const nextSeenSet = new Set(seenInquiryIdsRef.current);

          data.forEach((inq) => {
            if (!nextSeenSet.has(inq.id)) {
              nextSeenSet.add(inq.id);
              if (!isFirstLoadRef.current) {
                hasNew = true;
                lastNewItem = inq;
              }
            }
          });

          if (hasNew && lastNewItem) {
            seenInquiryIdsRef.current = nextSeenSet;
            setInquiries(data);

            // Play Chime audibly
            if (isSoundEnabled) {
              playNotificationChime();
            }

            // Fire standard browser/device system push-like notification
            if (notificationGranted && 'Notification' in window) {
              try {
                new Notification("🔔 New Inquiry Received!", {
                  body: `${lastNewItem.name} requested "${lastNewItem.service || 'General'}"`,
                  tag: `inq-${lastNewItem.id}`
                });
              } catch (e) {
                console.warn("Browser notification banner failed to spawn:", e);
              }
            }

            toast({
              title: `🔔 New Query: ${lastNewItem.name}`,
              description: lastNewItem.message.substring(0, 80) + (lastNewItem.message.length > 80 ? '...' : ''),
              type: "success"
            });
          } else if (data.length !== inquiries.length) {
            // Silently sync elements if items were deleted elsewhere
            setInquiries(data);
            const updatedSet = new Set<number>();
            data.forEach(iq => updatedSet.add(iq.id));
            seenInquiryIdsRef.current = updatedSet;
          }
        })
        .catch((err) => {
          console.warn("Database polling check failed temporarily:", err);
        });
    }, 4000); // 4 seconds interval for rapid update response

    return () => clearInterval(pollInterval);
  }, [isSoundEnabled, notificationGranted, toast, inquiries.length]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Unsupported Browser",
        description: "System notifications are unavailable on this device/browser.",
        type: "error"
      });
      return;
    }
    try {
      const status = await Notification.requestPermission();
      setNotificationGranted(status === 'granted');
      if (status === 'granted') {
        toast({
          title: "System Authorized",
          description: "Alerts enabled! You will receive system notifications on this device.",
          type: "success"
        });
        new Notification("ASJi Alert Stream Online", {
          body: "Push-style alerts are active. You'll hear and see inquiries instantly.",
          icon: "/favicon.ico"
        });
        playNotificationChime();
      } else {
        toast({
          title: "Permission Blocked",
          description: "Authorize notifications in your site settings to enable device alerts.",
          type: "error"
        });
      }
    } catch {
      toast({ title: "Authorization Error", description: "Could not request notifications permission.", type: "error" });
    }
  };

  const handleTestSound = () => {
    playNotificationChime();
    toast({
      title: "Audio Channel Active",
      description: "Playing synthesized inquiry tone chime. Verify your system volume.",
      type: "info"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('asji_admin_token');
    toast({
      title: "Signed Out",
      description: "You have securely signed out.",
      type: "info"
    });
    navigate('/');
  };

  // Update Inquiry Status (real database update)
  const handleUpdateInquiryStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'New' ? 'Contacted' : currentStatus === 'Contacted' ? 'Closed' : 'New';
    try {
      const updated = await apiService.updateInquiryStatus(id, nextStatus as any);
      setInquiries(updated);
      toast({
        title: "Status Updated",
        description: `Inquiry status changed to ${nextStatus}.`,
        type: "success"
      });
    } catch {
      toast({ title: "Update Failed", description: "Could not update status.", type: "error" });
    }
  };

  // Delete Inquiry (real database delete)
  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const updated = await apiService.deleteInquiry(id);
      setInquiries(updated);
      toast({
        title: "Inquiry Deleted",
        description: "Inquiry removed from system.",
        type: "warning"
      });
    } catch {
      toast({ title: "Deletion Failed", description: "Could not delete inquiry.", type: "error" });
    }
  };

  // Add Service (real database create)
  const handleAddService = async (e: FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.shortDesc || !serviceForm.fullDesc) {
      toast({
        title: "Validation Error",
        description: "Please populate title, short & full descriptions.",
        type: "error"
      });
      return;
    }

    setSubmittingService(true);
    const splitFeatures = serviceForm.featuresInput
      ? serviceForm.featuresInput.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    const newService = {
      title: serviceForm.title,
      icon: serviceForm.icon,
      category: serviceForm.category,
      price: serviceForm.price,
      isPopular: serviceForm.isPopular,
      shortDesc: serviceForm.shortDesc,
      fullDesc: serviceForm.fullDesc,
      features: splitFeatures,
      color: serviceForm.color
    };

    try {
      const updated = await apiService.addService(newService);
      setServices(updated);
      toast({
        title: "Service Added",
        description: "Successfully added and synchronized.",
        type: "success"
      });
      setServiceForm({
        title: '',
        icon: 'Scale',
        category: 'Legal Services',
        price: '₹999',
        isPopular: false,
        shortDesc: '',
        fullDesc: '',
        featuresInput: '',
        color: '#D4AF37'
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Creation Failed", description: "Could not configure new service.", type: "error" });
    } finally {
      setSubmittingService(false);
    }
  };

  // Delete Service (real database delete)
  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service? All frontend instances will shift immediately.")) return;
    try {
      const updated = await apiService.deleteService(id);
      setServices(updated);
      toast({
        title: "Service Removed",
        description: "Service has been removed.",
        type: "warning"
      });
    } catch {
      toast({ title: "Removal Failed", description: "Failed to remove the service.", type: "error" });
    }
  };

  // Open Edit Dialog Form
  const handleStartEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setEditForm({
      title: service.title,
      icon: service.icon,
      category: service.category || 'Legal Services',
      price: service.price || '₹999',
      isPopular: !!service.isPopular,
      shortDesc: service.shortDesc,
      fullDesc: service.fullDesc,
      featuresInput: service.features.join(', '),
      color: service.color || '#D4AF37'
    });
  };

  // Save Edit Service (real database update)
  const handleSaveEditService = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingServiceId) return;

    const splitFeatures = editForm.featuresInput
      ? editForm.featuresInput.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    const updatedService = {
      title: editForm.title,
      icon: editForm.icon,
      category: editForm.category,
      price: editForm.price,
      isPopular: editForm.isPopular,
      shortDesc: editForm.shortDesc,
      fullDesc: editForm.fullDesc,
      features: splitFeatures,
      color: editForm.color
    };

    try {
      const updated = await apiService.updateService(editingServiceId, updatedService);
      setServices(updated);
      toast({
        title: "Service Saved",
        description: "Updates saved successfully.",
        type: "success"
      });
      setEditingServiceId(null);
    } catch {
      toast({ title: "Save Failed", description: "Failed to update service.", type: "error" });
    }
  };

  // Counters for dashboard tiles
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;
  const totalServicesCount = services.length;

  const getServiceDistribution = () => {
    const distribution: { [key: string]: number } = {};
    inquiries.forEach((iq) => {
      const sName = iq.service || 'General Inquiry';
      distribution[sName] = (distribution[sName] || 0) + 1;
    });
    return distribution;
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      toast({ title: "No Data", description: "There are no inquiries to export.", type: "error" });
      return;
    }
    
    // Header Row
    const csvHeaders = ["ID", "Name", "Email", "Service Interested In", "Message Detail", "Status Badge", "Date Created"];
    const csvRows = inquiries.map(iq => [
      iq.id,
      `"${iq.name.replace(/"/g, '""')}"`,
      `"${iq.email.replace(/"/g, '""')}"`,
      `"${(iq.service || 'General Inquiry').replace(/"/g, '""')}"`,
      `"${iq.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      iq.status,
      iq.date
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [csvHeaders.join(","), ...csvRows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `asji_consulting_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Completed",
      description: "Inquiries table compiled and downloaded as CSV.",
      type: "success"
    });
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      inq.name.toLowerCase().includes(term) ||
      inq.email.toLowerCase().includes(term) ||
      inq.message.toLowerCase().includes(term);
      
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background flex text-foreground font-body">
      {/* Sidebar navigation panel */}
      <aside className="w-64 border-r border-gold/15 bg-secondary/15 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <img
              src="https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100077177/e96c9d96-e1de-48.png"
              alt="ASJi Logo"
              className="w-10 h-10 rounded-full object-cover border border-gold/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-display font-bold text-gold-gradient">ASJi Portal</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Admin Desk</p>
            </div>
          </div>

          {/* Navigation selectors */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-gold-gradient text-primary-foreground shadow-gold'
                  : 'text-muted-foreground hover:text-gold hover:bg-gold/5'
              }`}
            >
              <LayoutDashboard size={15} />
              Inquiries Desk
              {newInquiries > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white font-mono text-[10px] flex items-center justify-center animate-pulse">
                  {newInquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-gold-gradient text-primary-foreground shadow-gold'
                  : 'text-muted-foreground hover:text-gold hover:bg-gold/5'
              }`}
            >
              <Briefcase size={15} />
              Services Engine
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-gold-gradient text-primary-foreground shadow-gold'
                  : 'text-muted-foreground hover:text-gold hover:bg-gold/5'
              }`}
            >
              <MessageSquare size={15} />
              SMS Alerts Hub
            </button>
          </nav>
        </div>

        {/* Device Alert Center */}
        <div className="bg-secondary/20 border border-gold/15 rounded-xl p-4 space-y-3.5 my-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold font-mono">Device Alerts</span>
            <span className={`w-2.5 h-2.5 rounded-full ${notificationGranted ? 'bg-green-400 animate-pulse' : 'bg-amber-500'}`} />
          </div>
          
          <p className="text-[10px] text-muted-foreground leading-normal font-body">
            Receive real-time push alarms on your computer/mobile when a new lead lands.
          </p>
          
          <button
            onClick={requestNotificationPermission}
            className={`w-full py-2 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
              notificationGranted 
                ? 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/15'
                : 'bg-gold-gradient text-primary-foreground hover:opacity-90 shadow shadow-gold/25'
            }`}
          >
            {notificationGranted ? '🔔 Alerts Activated' : '🔔 Authorize Device Alerts'}
          </button>
          
          <div className="flex items-center justify-between pt-2 border-t border-gold/10">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="text-[10px] font-semibold text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5"
            >
              {isSoundEnabled ? '🔊 Sound: On' : '🔇 Sound: Muted'}
            </button>
            <button
              onClick={handleTestSound}
              className="text-[10px] font-semibold text-gold/70 hover:text-gold transition-colors underline decoration-gold/20"
            >
              Test Speaker
            </button>
          </div>
        </div>

        {/* Footer actions inside Sidebar */}
        <div className="space-y-4 pt-6 border-t border-gold/10">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded text-xs text-muted-foreground hover:text-gold transition-colors text-left"
          >
            <FolderLock size={14} />
            Go to Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header toolbar */}
        <header className="flex items-center justify-between mb-8 pb-5 border-b border-gold/10">
          <div>
            <h1 className="font-display text-4xl font-light text-foreground">
              {activeTab === 'inquiries' 
                ? 'Inquiries Management' 
                : activeTab === 'services' 
                ? 'Database Service Nodes' 
                : 'SMS Alerts Hub'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === 'notifications' 
                ? 'Dynamic tracking of lead notification dispatches dedicated to 9461584298.' 
                : 'Synchronized directly with production database storage.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                fetchInquiries();
                fetchServices();
                fetchSMSNotifications();
                toast({ title: "Refreshing Sync", description: "Database files reloaded.", type: "info" });
              }}
              className="p-3 bg-secondary/20 border border-gold/10 rounded text-gold hover:border-gold/40 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Metric Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-dark border border-gold/15 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Inquiries Received</p>
              <p className="text-2xl font-bold mt-1 font-display text-foreground">{totalInquiries}</p>
            </div>
          </div>

          <div className="glass-dark border border-gold/15 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <Clock size={20} className={newInquiries > 0 ? "animate-pulse" : ""} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Unassigned / New</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold font-display text-foreground">{newInquiries}</p>
                {newInquiries > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
              </div>
            </div>
          </div>

          {/* Interactive demand distribution metrics matrix */}
          <div className="glass-dark border border-gold/15 rounded-xl p-5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Service Lead Distribution</p>
              <span className="text-[9px] bg-gold/10 border border-gold/25 text-gold px-1.5 py-0.5 rounded font-mono">Live Tracker</span>
            </div>
            <div className="space-y-2 max-h-16 overflow-y-auto pr-1 text-xs">
              {totalInquiries === 0 ? (
                <p className="text-muted-foreground italic text-[11px]">No data accumulated yet.</p>
              ) : (
                Object.entries(getServiceDistribution()).map(([servName, count]) => {
                  const pct = Math.round((count / totalInquiries) * 100);
                  return (
                    <div key={servName} className="space-y-0.5">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span className="truncate max-w-[120px] font-medium">{servName}</span>
                        <span className="font-mono text-gold font-bold">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-secondary/35 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-gold-gradient h-full rounded-full transition-all duration-750" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'inquiries' ? (
          /* inquiries desk list table segment */
          <div className="space-y-4">
            {/* Control Panel: Search, Filter, Export CSV */}
            <div className="glass-dark border border-gold/15 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                {/* Text search */}
                <div className="relative w-full md:w-72">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, email, query content..."
                    className="w-full bg-secondary/25 border border-gold/15 rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap items-center gap-1">
                  {(['All', 'New', 'Contacted', 'Closed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-bold border transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-gold-gradient text-primary-foreground border-gold/30 shadow shadow-gold/25'
                          : 'bg-secondary/10 border-gold/5 text-muted-foreground hover:text-gold hover:border-gold/20'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spreadsheets Export */}
              <button
                onClick={handleExportCSV}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-secondary/30 border border-gold/15 rounded-lg px-4 py-2 text-xs font-semibold text-gold hover:bg-secondary/50 hover:border-gold/30 transition-all cursor-pointer"
                title="Download CSV spreadsheet"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>

            {/* Inquiries table card */}
            <div className="glass-dark border border-gold/15 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gold/10 bg-secondary/5 flex items-center justify-between">
                <h3 className="font-display text-lg font-light text-foreground">Inquiries Inbox</h3>
                <span className="text-xs text-muted-foreground bg-primary/40 px-3 py-1 rounded border border-gold/10">
                  Action: Click status badging to cycle progression.
                </span>
              </div>

              {loadingInquiries ? (
                <div className="py-20 text-center text-muted-foreground">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-gold" />
                  Retrieving database collections...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <AlertCircle size={30} className="mx-auto mb-2 text-gold/40" />
                  No customer inquiries have been submitted yet.
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground font-body">
                  <AlertCircle size={30} className="mx-auto mb-2 text-gold/40" />
                  No inquiries match your filter criteria. Try resetting.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-gold/10 text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="p-4">Contact</th>
                        <th className="p-4">Interested In</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Status Badge</th>
                        <th className="p-4 text-center">Row Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map((inq) => (
                        <tr key={inq.id} className="border-b border-gold/5 hover:bg-secondary/5 transition-colors text-sm">
                          <td className="p-4">
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <User size={12} className="text-gold/60" />
                              {inq.name}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Mail size={12} />
                              {inq.email}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-gold/10 border border-gold/20 text-gold text-xs rounded font-medium">
                              {inq.service || 'General Inquiry'}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs xl:max-w-md">
                            <p className="text-xs text-foreground/90 leading-relaxed font-body whitespace-pre-line bg-secondary/10 border border-gold/5 p-2 rounded">
                              {inq.message}
                            </p>
                          </td>
                          <td className="p-4 whitespace-nowrap text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              {inq.date}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleUpdateInquiryStatus(inq.id, inq.status)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer border hover:opacity-80 transition-opacity ${
                                inq.status === 'New'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                  : inq.status === 'Contacted'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-green-500/10 text-green-400 border-green-500/30'
                              }`}
                            >
                              {inq.status}
                            </button>
                          </td>
                          <td className="p-4 text-center mr-1">
                            <div className="flex items-center justify-center gap-1 w-full justify-items-center">
                              {/* AI Response Strategy Trigger */}
                              <button
                                onClick={() => handleRequestAIPlaybook(inq)}
                                className="p-1.5 text-gold hover:text-white transition-colors bg-gold/5 hover:bg-gold/25 rounded cursor-pointer border border-gold/15"
                                title="Generate secure AI response plan & strategic playbook"
                              >
                                <Sparkles size={13} className="animate-pulse" />
                              </button>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors bg-secondary/10 hover:bg-red-500/10 rounded cursor-pointer border border-gold/5"
                                title="Delete Row"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'services' ? (
          /* Services setup segment */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Service Form Column */}
            <div className="lg:col-span-1 glass-dark border border-gold/15 rounded-xl p-6 self-start">
              <h3 className="font-display text-xl font-light text-foreground mb-4">Add Custom Service</h3>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Corporate Law, Mobile App Dev"
                    className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Icon Profile</label>
                    <select
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full bg-[#141820] border border-gold/15 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                    >
                      <option value="Scale">Scale (Legal)</option>
                      <option value="Globe">Globe (Web)</option>
                      <option value="FileText">Drafting</option>
                      <option value="TrendingUp">Marketing</option>
                      <option value="Sparkles">Sparkles (AI)</option>
                      <option value="Bot">AI Bot</option>
                      <option value="Briefcase">Special Packages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Accent Color</label>
                    <input
                      type="color"
                      value={serviceForm.color}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-9 bg-secondary/30 border border-gold/15 rounded p-1 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Category</label>
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[#141820] border border-gold/15 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                    >
                      <option value="Legal Services">Legal Services</option>
                      <option value="Web & Digital Services">Web & Digital Services</option>
                      <option value="AI & Legal Tech">AI & Legal Tech</option>
                      <option value="Special Packages">Special Packages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Price Tag</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. ₹999, Free"
                      className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1 bg-secondary/15 px-3 rounded border border-gold/5">
                  <input
                    type="checkbox"
                    id="isPopularForm"
                    checked={serviceForm.isPopular}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="w-4 h-4 text-gold bg-[#141820] border-gold/15 rounded focus:ring-gold focus:ring-1 cursor-pointer"
                  />
                  <label htmlFor="isPopularForm" className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none">
                    Highlight as &quot;Popular / Best Value&quot;
                  </label>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Short Overview (Front Card)</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={serviceForm.shortDesc}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, shortDesc: e.target.value }))}
                    placeholder="Short summary displayed initially in flip-card"
                    className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Full Description (Back Card)</label>
                  <textarea
                    required
                    rows={3}
                    value={serviceForm.fullDesc}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, fullDesc: e.target.value }))}
                    placeholder="Extended detail for service details..."
                    className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Pill Bullet Features (Back Card)</label>
                  <span className="text-[10px] text-muted-foreground block mb-1.5">Separate multiple bullet points with commas</span>
                  <input
                    type="text"
                    value={serviceForm.featuresInput}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, featuresInput: e.target.value }))}
                    placeholder="Agreements, MOUs, corporate restructuring, etc..."
                    className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingService}
                  className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground font-semibold text-xs uppercase tracking-widest py-3 rounded hover:opacity-95 transition-all duration-300 shadow-gold cursor-pointer"
                >
                  <Plus size={14} />
                  {submittingService ? "Creating Node..." : "Add Database Card"}
                </button>
              </form>
            </div>

            {/* Configured Service Cards List Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 bg-secondary/10 border border-gold/10 rounded-xl flex items-center justify-between">
                <h4 className="font-display font-light text-foreground">Current Active Service Nodes</h4>
                <p className="text-xs text-muted-foreground italic">Drag or reload synchronized</p>
              </div>

              {loadingServices ? (
                <div className="py-20 text-center text-muted-foreground">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-gold" />
                  Retrieving service configuration nodes...
                </div>
              ) : services.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground glass-dark border border-gold/10 rounded-xl">
                  No services found. Add database card immediately!
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((serv) => (
                    <div key={serv.id} className="glass-dark border border-gold/15 rounded-xl p-5 flex flex-col justify-between hover:border-gold/40 transition-colors relative">
                      {/* Top Action Tags */}
                      <div className="flex items-center justify-between mb-3 border-b border-gold/5 pb-2.5">
                        <span className="bg-gold/10 border border-gold/25 px-2 py-0.5 rounded text-gold text-[10px] font-mono">
                          ID: {serv.id} (Icon: {serv.icon})
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(serv)}
                            className="p-1 text-muted-foreground hover:text-gold transition-colors bg-secondary/15 rounded cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(serv.id)}
                            className="p-1 text-muted-foreground hover:text-red-400 transition-colors bg-secondary/15 rounded cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Content details */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {serv.category && (
                            <span className="px-2 py-0.5 bg-gold/10 text-gold text-[9px] font-mono tracking-wider uppercase border border-gold/20 rounded">
                              {serv.category}
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-secondary/40 text-foreground text-[9px] font-mono border border-gold/5 rounded">
                            {serv.price || "₹499"}
                          </span>
                          {serv.isPopular && (
                            <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 text-[9px] font-mono uppercase font-bold rounded">
                              ★ BEST VALUE
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-lg text-foreground font-medium mb-1">{serv.title}</h4>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
                          {serv.shortDesc}
                        </p>
                        <div className="bg-secondary/10 border border-gold/5 p-2 rounded mb-3 text-xs leading-5">
                          <strong>Full back info:</strong> <span className="text-muted-foreground">{serv.fullDesc}</span>
                        </div>
                        {serv.features && serv.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {serv.features.map((feat, fI) => (
                              <span key={fI} className="px-2 py-0.5 bg-secondary/30 rounded text-foreground/80 text-[10px] border border-gold/5">
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Notifications Tab (activeTab === 'notifications') */
          <div className="glass-dark border border-gold/15 rounded-xl p-8">
            {/* Dynamic Instructional Banner for Twilio configuration */}
            <div className="mb-8 p-4 bg-gold/5 border border-gold/20 rounded-lg flex flex-col md:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold mt-0.5">
                <Smartphone size={20} />
              </div>
              <div className="space-y-1.5 flex-1 select-text">
                <h4 className="text-sm font-semibold text-gold font-display">How to Activate Real SMS Dispatching</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By default, lead alerts to your phone <span className="font-mono text-gold">+91 9461584298</span> are simulated safely within local ledger logs. To trigger real immediate SMS alerts to your physical device, navigate to the **Settings** menu page (top-right of your AI Studio environment workspace) and add the following secure environment variables:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 pt-1 font-mono text-[10px] text-foreground">
                  <div className="px-2 py-1 bg-secondary/30 rounded border border-gold/10">
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-widest font-sans mb-0.5">Variable 1</span>
                    TWILIO_ACCOUNT_SID
                  </div>
                  <div className="px-2 py-1 bg-secondary/30 rounded border border-gold/10">
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-widest font-sans mb-0.5">Variable 2</span>
                    TWILIO_AUTH_TOKEN
                  </div>
                  <div className="px-2 py-1 bg-secondary/30 rounded border border-gold/10">
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-widest font-sans mb-0.5">Variable 3</span>
                    TWILIO_PHONE_NUMBER
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground/85 mt-2.5 italic">
                  *Note: Make sure your TWILIO_PHONE_NUMBER starts with "+" (e.g. +18885551234) and has been approved or registered in your Twilio SMS console.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gold/10">
              <div>
                <h3 className="font-display text-xl font-light text-foreground">Dispatched SMS Lead Alerts</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time visual ledger tracking notifications delivered directly to +91 9461584298 or client storage fallback.
                </p>
              </div>
              {smsNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to clear SMS logs?")) {
                      try {
                        const cleared = await apiService.clearSMSNotifications();
                        setSmsNotifications(cleared);
                        toast({ title: "Logs Cleared", description: "SMS alerts database reset.", type: "info" });
                      } catch (err) {
                        setSmsNotifications([]);
                      }
                    }
                  }}
                  className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-colors sm:self-center"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {loadingNotifications ? (
              <div className="py-12 text-center text-muted-foreground animate-pulse font-mono text-xs">
                Analyzing active alert logs...
              </div>
            ) : smsNotifications.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-gold/5 rounded-lg bg-secondary/5">
                <MessageSquare className="mx-auto w-8 h-8 text-gold/30 mb-3" />
                <p className="text-sm text-foreground/80 font-display">No SMS logs recorded yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-body">
                  Submit a request in the contact form or create an inquiry. Alerts automatically output to destination node 9461584298.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gold/5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">Recipient</div>
                    <div className="col-span-5">Message Body</div>
                    <div className="col-span-1.5 text-center">Status</div>
                    <div className="col-span-1.5 text-right">Method/Details</div>
                  </div>

                  <div className="divide-y divide-gold/5 max-h-[500px] overflow-y-auto pr-2">
                    {smsNotifications.map((log: any) => (
                      <div key={log.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-xs hover:bg-secondary/10 transition-colors">
                        <div className="col-span-2 font-mono text-[10px] text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} &middot; {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="col-span-2 font-mono text-gold text-[11px]">
                          {log.formattedRecipient}
                        </div>
                        <div className="col-span-5 font-body text-foreground/90 line-clamp-2" title={log.body}>
                          {log.body}
                        </div>
                        <div className="col-span-1.5 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold border ${
                            log.status === "Delivered" 
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : log.status === "Sending"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : log.status === "Failed"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-secondary/40 text-muted-foreground border-gold/10"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <div className="col-span-1.5 text-right font-mono text-[9px] text-muted-foreground truncate" title={log.details}>
                          {log.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Service Modal Dialog overlay */}
      {editingServiceId !== null && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="glass-dark border border-gold/30 rounded-xl w-full max-w-lg p-6 relative shadow-gold">
            <button
              onClick={() => setEditingServiceId(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-gold cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="font-display text-2xl font-light text-foreground mb-4">Edit Service Node</h3>

            <form onSubmit={handleSaveEditService} className="space-y-4 text-sm font-body">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Icon Profile</label>
                  <select
                    value={editForm.icon}
                    onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full bg-[#11141a] border border-gold/15 rounded px-3 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                  >
                    <option value="Scale">Scale (Legal)</option>
                    <option value="Globe">Globe (Web)</option>
                    <option value="FileText">Drafting</option>
                    <option value="TrendingUp">Marketing</option>
                    <option value="Sparkles">Sparkles (AI)</option>
                    <option value="Bot">AI Bot</option>
                    <option value="Briefcase">Special Packages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={editForm.color}
                    onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-9 bg-secondary/30 border border-gold/15 rounded p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#11141a] border border-gold/15 rounded px-3 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                  >
                    <option value="Legal Services">Legal Services</option>
                    <option value="Web & Digital Services">Web & Digital Services</option>
                    <option value="AI & Legal Tech">AI & Legal Tech</option>
                    <option value="Special Packages">Special Packages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Price Tag</label>
                  <input
                    type="text"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1 bg-secondary/15 px-3 rounded border border-gold/5">
                <input
                  type="checkbox"
                  id="isPopularEditForm"
                  checked={editForm.isPopular}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="w-4 h-4 text-gold bg-[#11141a] border border-gold/15 rounded focus:ring-gold focus:ring-1 cursor-pointer"
                />
                <label htmlFor="isPopularEditForm" className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none">
                  Highlight as &quot;Popular / Best Value&quot;
                </label>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Short Overview (Front Card)</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={editForm.shortDesc}
                  onChange={(e) => setEditForm(prev => ({ ...prev, shortDesc: e.target.value }))}
                  className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Full Description (Back Card)</label>
                <textarea
                  required
                  rows={3}
                  value={editForm.fullDesc}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullDesc: e.target.value }))}
                  className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Pill Features (Comma Separated)</label>
                <input
                  type="text"
                  value={editForm.featuresInput}
                  onChange={(e) => setEditForm(prev => ({ ...prev, featuresInput: e.target.value }))}
                  className="w-full bg-secondary/30 border border-gold/15 rounded px-3 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setEditingServiceId(null)}
                  className="px-4 py-2 bg-secondary/15 rounded text-xs uppercase font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-gradient text-primary-foreground rounded text-xs uppercase font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-gold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI STRATEGIC ACTION PLAYBOOK MODAL */}
      {selectedInquiryForAI !== null && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="glass-dark border border-gold/30 rounded-2xl w-full max-w-2xl p-7 relative shadow-xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in font-sans">
            <button
              onClick={() => setSelectedInquiryForAI(null)}
              className="absolute right-5 top-5 text-muted-foreground hover:text-gold cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-2.5 mb-5 select-none">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center border border-gold/25 shadow-md shadow-gold/5">
                <Sparkles size={16} className="text-gold animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-light text-foreground">Sovereign AI Playbook</h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-1">Intelligent Response Architect & SMTP Planner</p>
              </div>
            </div>

            <div className="bg-secondary/15 border border-gold/10 p-4 rounded-xl text-xs space-y-1.5 mb-5 shrink-0">
              <div className="flex justify-between font-mono text-[10px] text-gold uppercase tracking-wide">
                <span>Client Name: {selectedInquiryForAI.name}</span>
                <span>Category: {selectedInquiryForAI.service || 'General Inquiry'}</span>
              </div>
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                <strong>Original Brief:</strong> {selectedInquiryForAI.message}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[440px] pr-2 scrollbar-thin">
              {playbookLoading ? (
                <div className="py-16 text-center text-muted-foreground animate-shimmer">
                  <Loader2 size={24} className="animate-spin text-gold mx-auto mb-3" />
                  <p className="text-xs font-mono uppercase tracking-widest">Generating internal playbook & draft email templates...</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs font-body leading-relaxed text-foreground/90 break-words">
                  {aiPlaybookResult.split('\n\n').map((paragraph, i) => {
                    // Render code blocks
                    if (paragraph.startsWith('```')) {
                      const lines = paragraph.split('\n');
                      const code = lines.slice(1, lines.length - 1).join('\n');
                      return (
                        <pre key={i} className="bg-primary/45 border border-gold/15 rounded-xl p-4 text-[10px] text-gold font-mono overflow-x-auto leading-relaxed my-3 mb-4">
                          <code>{code}</code>
                        </pre>
                      );
                    }

                    // Render list points
                    if (paragraph.startsWith('* ') || paragraph.startsWith('- ') || paragraph.includes('\n* ') || paragraph.includes('\n- ')) {
                      const bullets = paragraph.split(/\n[\*\-]\s/).map((bullet, idx) => {
                        const clean = bullet.replace(/^[\*\-]\s/, '').trim();
                        if (!clean) return null;
                        return (
                          <li key={idx} className="list-disc pl-1 ml-4 text-[11px] text-muted-foreground my-1">
                            {clean}
                          </li>
                        );
                      }).filter(Boolean);
                      return <ul key={i} className="space-y-1 my-3">{bullets}</ul>;
                    }

                    return <p key={i} className="mb-4">{paragraph}</p>;
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-5 border-t border-gold/10 mt-4 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedInquiryForAI(null)}
                className="px-4 py-2 bg-secondary/15 rounded-lg text-xs uppercase font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Close Playbook
              </button>
              {!playbookLoading && aiPlaybookResult && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiPlaybookResult);
                    toast({
                      title: "Playbook Copied!",
                      description: "Internal playbook & draft SMTP response email copied to clipboard.",
                      type: "success"
                    });
                  }}
                  className="px-5 py-2.5 bg-gold-gradient text-primary-foreground rounded-lg text-xs uppercase font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-gold"
                >
                  Copy Combined Playbook
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
