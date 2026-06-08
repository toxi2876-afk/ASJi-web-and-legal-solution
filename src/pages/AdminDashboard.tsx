import { useEffect, useState, FormEvent } from 'react';
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
  Edit2
} from 'lucide-react';
import { useToast } from '../components/ui/toast';
import { Service, Inquiry } from '../types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'services'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submittingService, setSubmittingService] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // New Service inputs
  const [serviceForm, setServiceForm] = useState({
    title: '',
    icon: 'Scale',
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
    fetch('/api/inquiries')
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data);
        setLoadingInquiries(false);
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Fetch Error", description: "Failed to fetch inquiries.", type: "error" });
        setLoadingInquiries(false);
      });
  };

  const fetchServices = () => {
    setLoadingServices(true);
    fetch('/api/services')
      .then((res) => res.json())
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

  useEffect(() => {
    fetchInquiries();
    fetchServices();
  }, []);

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
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Inquiry status changed to ${nextStatus}.`,
          type: "success"
        });
        fetchInquiries();
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Update Failed", description: "Coult not update status on server.", type: "error" });
    }
  };

  // Delete Inquiry (real database delete)
  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({
          title: "Inquiry Deleted",
          description: "Inquiry removed from database.",
          type: "warning"
        });
        fetchInquiries();
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Deletion Failed", description: "Could not delete from database.", type: "error" });
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
      shortDesc: serviceForm.shortDesc,
      fullDesc: serviceForm.fullDesc,
      features: splitFeatures,
      color: serviceForm.color
    };

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });

      if (response.ok) {
        toast({
          title: "Service Added",
          description: "Successfully added to persistent database.",
          type: "success"
        });
        setServiceForm({
          title: '',
          icon: 'Scale',
          shortDesc: '',
          fullDesc: '',
          featuresInput: '',
          color: '#D4AF37'
        });
        fetchServices();
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Creation Failed", description: "Could not configure new service on server.", type: "error" });
    } finally {
      setSubmittingService(false);
    }
  };

  // Delete Service (real database delete)
  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service? All frontend instances will shift immediately.")) return;
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({
          title: "Service Removed",
          description: "Removed from database configuration.",
          type: "warning"
        });
        fetchServices();
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Removal Failed", description: "Failed to remove the service configuration.", type: "error" });
    }
  };

  // Open Edit Dialog Form
  const handleStartEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setEditForm({
      title: service.title,
      icon: service.icon,
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
      shortDesc: editForm.shortDesc,
      fullDesc: editForm.fullDesc,
      features: splitFeatures,
      color: editForm.color
    };

    try {
      const response = await fetch(`/api/services/${editingServiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService)
      });

      if (response.ok) {
        toast({
          title: "Service Saved",
          description: "Updates synchronized on persistent database.",
          type: "success"
        });
        setEditingServiceId(null);
        fetchServices();
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Save Failed", description: "Failed to update service database node.", type: "error" });
    }
  };

  // Counters for dashboard tiles
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;
  const totalServicesCount = services.length;

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
          </nav>
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
              {activeTab === 'inquiries' ? 'Inquiries Management' : 'Database Service Nodes'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Synchronized directly with production database storage.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                fetchInquiries();
                fetchServices();
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
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Customer Inquiries</p>
              <p className="text-2xl font-bold mt-1 font-display">{totalInquiries}</p>
            </div>
          </div>

          <div className="glass-dark border border-gold/15 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Unresolved/New Requests</p>
              <p className="text-2xl font-bold mt-1 font-display">{newInquiries}</p>
            </div>
          </div>

          <div className="glass-dark border border-gold/15 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Configured Service Blocks</p>
              <p className="text-2xl font-bold mt-1 font-display">{totalServicesCount}</p>
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'inquiries' ? (
          /* inquiries desk list table segment */
          <div className="glass-dark border border-gold/15 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gold/10 bg-secondary/5 flex items-center justify-between">
              <h3 className="font-display text-lg font-light text-foreground">Inquiries Log</h3>
              <span className="text-xs text-muted-foreground bg-primary/40 px-3 py-1 rounded border border-gold/10">
                Action: Click status badge to progress inquiry.
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
                    {inquiries.map((inq) => (
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
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-2 text-muted-foreground hover:text-red-400 transition-colors bg-secondary/10 hover:bg-red-500/10 rounded cursor-pointer border border-gold/5"
                            title="Delete Row"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
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
    </div>
  );
}
