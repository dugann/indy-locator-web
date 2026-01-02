import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Search, MapPin, Info, X, Star, RotateCw, AlertTriangle, CheckCircle, User, ExternalLink, Copy, Download, 
    Map as MapIcon, CloudOff, Share2, History, Trash2, Camera, Settings, BookmarkPlus, Bookmark,
    Wifi, WifiOff, Zap, Clock, Loader2, ScanBarcode, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Html5Qrcode } from "html5-qrcode";
import { CONFIG, US_STATES, luhnValidate, vibrate, fetchWithRetry, storage } from './utils';

// --- DYNAMIC STYLES ---
const customStyles = `
    @keyframes pulse-ring { 0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); } 70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); } 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }
    @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
    .circle-transition { position: absolute; top: 50%; left: 50%; width: 128px; height: 128px; background-color: #E1E8F0; border-radius: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0; pointer-events: none; z-index: 25; }
    .circle-transition.expanding { opacity: 1; transform: translate(-50%, -50%) scale(25); transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.1s ease-in; }
    .circle-transition.closing { transform: translate(-50%, -50%) scale(0); transition: transform 0.5s cubic-bezier(0.5, 0, 0.75, 0); }
    .fade-enter { opacity: 0; transform: translateY(10px); }
    .fade-enter-active { opacity: 1; transform: translateY(0); transition: opacity 0.4s ease-out, transform 0.4s ease-out; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
    .shake-input { animation: shake 0.3s ease-in-out; border-color: #D11241 !important; }
    .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    .slide-in-up { animation: slideInUp 0.3s ease-out; }
    .slide-in-down { animation: slideInDown 0.3s ease-out; }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    .safe-top { padding-top: env(safe-area-inset-top); }
    .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
    #reader { width: 100%; border-radius: 1rem; overflow: hidden; background: black; min-height: 250px; }
    #reader video { object-fit: cover; border-radius: 1rem; }
`;

// --- CUSTOM ICONS ---
const GoogleDirectionsIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>
);
const GooglePegmanIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 8.7 9.1 10.5 11.15 10.9V22H12.85V16H14.5V22H16.2V10.9C18.25 10.5 19.85 8.7 19.85 6.5C19.85 4 17.85 2 15.35 2H12ZM12 4H15.35C16.75 4 17.85 5.1 17.85 6.5C17.85 7.9 16.75 9 15.35 9C14.85 9 14.4 8.85 14 8.6V7H12V8.6C11.6 8.85 11.15 9 10.65 9C9.25 9 8.15 7.9 8.15 6.5C8.15 5.1 9.25 4 10.65 4H12Z"/></svg>
);

// --- HOOKS ---
function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
    }, []);
    return isOnline;
}

function useFavorites() {
    const [favorites, setFavorites] = useState(() => storage.get(CONFIG.STORAGE_KEYS.FAVORITES, []));
    const addFavorite = useCallback((item) => {
        setFavorites(prev => {
            const updated = [item, ...prev.filter(f => f.id !== item.id)].slice(0, CONFIG.MAX_FAVORITES);
            storage.set(CONFIG.STORAGE_KEYS.FAVORITES, updated);
            return updated;
        });
    }, []);
    const removeFavorite = useCallback((id) => {
        setFavorites(prev => {
            const updated = prev.filter(f => f.id !== id);
            storage.set(CONFIG.STORAGE_KEYS.FAVORITES, updated);
            return updated;
        });
    }, []);
    const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites]);
    return { favorites, addFavorite, removeFavorite, isFavorite };
}

function useRecentSearches() {
    const [recent, setRecent] = useState(() => storage.get(CONFIG.STORAGE_KEYS.RECENT, []));
    const addRecent = useCallback((search) => {
        setRecent(prev => {
            const updated = [{ ...search, timestamp: Date.now() }, ...prev.filter(s => s.query !== search.query)].slice(0, CONFIG.MAX_RECENT);
            storage.set(CONFIG.STORAGE_KEYS.RECENT, updated);
            return updated;
        });
    }, []);
    const clearRecent = useCallback(() => {
        setRecent([]);
        storage.remove(CONFIG.STORAGE_KEYS.RECENT);
    }, []);
    return { recent, addRecent, clearRecent };
}

// --- COMPONENTS ---
const LoadingSkeleton = () => (
    <div className="space-y-4 p-4">
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300 slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="skeleton h-6 w-3/4 rounded"></div>
                        <div className="skeleton h-4 w-1/2 rounded"></div>
                        <div className="skeleton h-16 w-full rounded-xl"></div>
                    </div>
                    <div className="skeleton w-36 h-36 rounded-2xl"></div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyState = ({ message, icon: Icon, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center fade-in">
        <div className="bg-white/5 rounded-full p-6 mb-4"><Icon size={48} className="text-white/40" /></div>
        <p className="text-white/60 text-sm mb-4">{message}</p>
        {action && action}
    </div>
);

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
    const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    return (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg z-50 slide-in-down flex items-center gap-2`}>
            {type === 'success' && <CheckCircle size={18} />}
            {type === 'error' && <AlertTriangle size={18} />}
            {type === 'info' && <Info size={18} />}
            <span className="font-medium">{message}</span>
        </div>
    );
};

const ResultItem = ({ item, onFavorite, isFavorite }) => {
    const [copied, setCopied] = useState(false);
    let centroid = null, mainActionUrl = '#', navigateUrl = '#', streetViewUrl = '#';

    if (item.geoms && item.geoms.length > 0) {
        const total = item.geoms.length;
        const avgX = item.geoms.reduce((sum, g) => sum + g.x, 0) / total;
        const avgY = item.geoms.reduce((sum, g) => sum + g.y, 0) / total;
        centroid = { x: avgX, y: avgY };
        const sortedGeoms = [...item.geoms].sort((a, b) => parseInt(a.id) - parseInt(b.id));
        if (sortedGeoms.length > 1) {
            const first = sortedGeoms[0];
            const last = sortedGeoms[sortedGeoms.length - 1];
            const waypoints = sortedGeoms.slice(1, -1).slice(0, 20).map(g => `${g.y},${g.x}`).join('|');
            mainActionUrl = `https://www.google.com/maps/dir/?api=1&origin=${first.y},${first.x}&destination=${last.y},${last.x}&waypoints=${waypoints}&travelmode=walking`;
        } else {
            mainActionUrl = `https://www.google.com/maps/search/?api=1&query=${centroid.y},${centroid.x}`;
        }
        navigateUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.address + ', Indianapolis, IN')}`;
        streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${centroid.y},${centroid.x}`;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(item.ids.join(', '));
        setCopied(true); vibrate([10, 50, 10]); setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (!navigator.share) return;
        try { await navigator.share({ title: `Parking at ${item.address}`, text: `Check out parking meters ${item.ids.join(', ')}`, url: window.location.href }); } catch {}
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300 mb-4 hover:shadow-lg transition-all slide-in-up">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h3 className="font-bold text-[#003B71] text-lg leading-tight text-black truncate pr-2">{item.address}</h3>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">Indianapolis, IN</p>
                            </div>
                            <button onClick={() => { vibrate(10); onFavorite(item); }} className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                {isFavorite ? <Bookmark size={20} className="text-yellow-500 fill-yellow-500" /> : <BookmarkPlus size={20} className="text-gray-400" />}
                            </button>
                        </div>
                        <div className="bg-[#003B71]/5 rounded-xl p-2 mb-3 border border-[#003B71]/10 relative group w-fit max-w-full">
                            <div className="flex items-center justify-between mb-1 px-1 gap-4">
                                <span className="text-[10px] uppercase font-bold text-[#003B71]/70">Meter IDs</span>
                                <div className="flex gap-2">
                                    {navigator.share && <button onClick={handleShare} className="text-[#003B71]"><Share2 size={12} /></button>}
                                    <button onClick={handleCopy} className="text-[#003B71]">{copied ? <CheckCircle size={12} className="text-green-600"/> : <Copy size={12} />}</button>
                                </div>
                            </div>
                            <div className="flex overflow-x-auto gap-2 pb-1 hide-scroll">
                                {item.ids.map(id => <span key={id} className="bg-white border border-[#003B71]/20 rounded-md px-2 py-1 text-sm font-mono font-bold text-[#003B71]">{id}</span>)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-auto">
                        <a href={navigateUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-white text-[#003B71] border border-[#003B71]/30 py-1.5 px-3 rounded-lg text-xs font-bold hover:bg-[#003B71] hover:text-white"><GoogleDirectionsIcon size={16} /> Navigate</a>
                        <a href={streetViewUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 bg-white text-[#003B71] border border-[#003B71]/30 py-1.5 px-3 rounded-lg text-xs font-bold hover:bg-[#003B71] hover:text-white ${!centroid && 'opacity-50 pointer-events-none'}`}><GooglePegmanIcon size={16} /> Street View</a>
                    </div>
                </div>
                <div className="w-full sm:w-36 flex-shrink-0 flex flex-col gap-2">
                     <a href={mainActionUrl} target="_blank" rel="noreferrer" className="w-full h-24 sm:h-36 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-md relative group block">
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#003B71]/30"><MapIcon size={36} /></div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><MapPin className="text-[#D11241] fill-[#D11241] drop-shadow-lg -translate-y-1" size={32} /></div>
                    </a>
                    <div className="bg-[#003B71] text-white text-[10px] font-bold py-1.5 rounded-lg text-center uppercase shadow-sm">{item.ids.length} Units</div>
                </div>
            </div>
        </div>
    );
};

const RecentSearchItem = ({ search, onSelect, onRemove }) => (
    <button onClick={() => onSelect(search)} className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
        <div className="flex items-center gap-3 flex-1 min-w-0">
            <Clock size={16} className="text-white/40 flex-shrink-0" />
            <div className="text-left flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{search.query}</p>
                <p className="text-white/40 text-xs">{search.mode === 'id' ? 'Meter ID' : 'Street Name'}</p>
            </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(search); }} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded"><X size={16} className="text-white/60" /></button>
    </button>
);

const FavoriteItem = ({ favorite, onSelect, onRemove }) => (
    <button onClick={() => onSelect(favorite)} className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
        <div className="flex items-center gap-3 flex-1 min-w-0">
            <Star size={16} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <div className="text-left flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{favorite.address}</p>
                <p className="text-white/40 text-xs">{favorite.ids.length} meters</p>
            </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(favorite.id); }} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded"><X size={16} className="text-white/60" /></button>
    </button>
);

const BarcodeScannerModal = ({ onClose, onDetected }) => {
    const scannerRef = useRef(null);
    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 280, height: 150 } }, 
            (decodedText) => { vibrate([50]); onDetected(decodedText); html5QrCode.stop().then(onClose).catch(console.error); },
            () => {}
        ).catch(console.error);
        return () => { if (scannerRef.current?.isScanning) scannerRef.current.stop().catch(console.error); };
    }, []);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><X size={24}/></button>
                <div id="reader" className="w-full h-64 bg-black"></div>
                <div className="p-4 text-center"><p className="text-[#003B71] font-bold">Scan Ticket Barcode</p></div>
            </div>
        </div>
    );
};

export default function App() {
    const [isCitationMode, setIsCitationMode] = useState(false);
    const [mode, setMode] = useState('id'); 
    const [view, setView] = useState('search');
    const [loading, setLoading] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    const [isScanning, setIsScanning] = useState(false); 
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
    
    const [streets, setStreets] = useState([]);
    const [dataDate, setDataDate] = useState(null);
    const [startId, setStartId] = useState('');
    const [endId, setEndId] = useState('');
    const [streetQuery, setStreetQuery] = useState('');
    const [ticketNum, setTicketNum] = useState('');
    const [plateState, setPlateState] = useState('IN');
    const [plateNum, setPlateNum] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [shakeField, setShakeField] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(null);
    
    const isOnline = useOnlineStatus();
    const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { recent, addRecent, clearRecent } = useRecentSearches();
    const formRef = useRef(null);
    const fileInputRef = useRef(null);

    const showToast = useCallback((message, type = 'info') => { setToast({ message, type }); }, []);

    const executeSearch = async (searchMode, sId, eId, sQuery) => {
        if (!isOnline) { setError("No internet connection"); vibrate([10, 100, 10]); return; }
        setLoading(true); setError(null);
        try {
            const params = new URLSearchParams({ mode: searchMode });
            if (searchMode === 'id') { params.append('start', sId); if (eId) params.append('end', eId); } else { params.append('street', sQuery); }
            const res = await fetchWithRetry(`${CONFIG.BACKEND_URL}/api/search?${params}`);
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            if (!data.features || data.features.length === 0) {
                setResults([]); setLoading(false); setError("No parking assets found."); vibrate([10, 100, 10]);
            } else {
                const groups = {};
                data.features.forEach(f => {
                    const addr = f.attributes.FULL_ADDRESS ? f.attributes.FULL_ADDRESS.trim() : "Unknown Location";
                    if (!groups[addr]) groups[addr] = { ids: [], geoms: [] };
                    groups[addr].ids.push(f.attributes.SPACE_NUMBER);
                    if (f.geometry?.x && f.geometry?.y) groups[addr].geoms.push({ id: f.attributes.SPACE_NUMBER, x: f.geometry.x, y: f.geometry.y });
                });
                const resultList = Object.keys(groups).sort().map(addr => ({ address: addr, ids: groups[addr].ids.sort((a,b) => a-b), geoms: groups[addr].geoms }));
                setResults(resultList); setIsExpanding(true);
                addRecent({ query: searchMode === 'id' ? `${sId}${eId ? `-${eId}` : ''}` : sQuery, mode: searchMode });
                vibrate(10); setTimeout(() => { setView('results'); setLoading(false); }, 400); 
            }
        } catch (e) { setError("Connection failed."); setLoading(false); vibrate([10, 100, 10]); }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]; if (!file) return;
        setIsScanning(true); setError(null); vibrate(10);
        const formData = new FormData(); formData.append('upload', file); formData.append('regions', 'us');
        try {
            const response = await fetch(CONFIG.SNAPSHOT_PROXY_URL, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const best = data.results[0];
                setPlateNum(best.plate.toUpperCase());
                if (best.region?.code && US_STATES.includes(best.region.code.split('-').pop().toUpperCase())) setPlateState(best.region.code.split('-').pop().toUpperCase());
                showToast(`Plate detected: ${best.plate.toUpperCase()}`, 'success'); vibrate([10, 50, 10]);
            } else { setError("No plate detected."); vibrate([10, 100, 10]); }
        } catch { setError("Failed to scan plate."); vibrate([10, 100, 10]); } 
        finally { setIsScanning(false); event.target.value = null; }
    };

    const handleBarcodeDetected = (code) => {
        setTicketNum(code);
        showToast(`Ticket scanned: ${code}`, 'success');
    };

    const getCitationShareData = () => {
        let shareUrl = window.location.origin + window.location.pathname;
        let text = "";
        if (mode === 'ticket' && ticketNum) {
            shareUrl += `?ticket=${ticketNum}`;
            text = `Pay citation #${ticketNum}: ${shareUrl}`;
        } else if (mode === 'plate' && plateNum) {
            shareUrl += `?plate=${plateNum}&state=${plateState}`;
            text = `Pay citations for ${plateState} plate ${plateNum}: ${shareUrl}`;
        }
        return { shareUrl, text };
    };

    const handleCitationShare = async () => {
        const { shareUrl, text } = getCitationShareData();
        if (!text) return;
        if (navigator.share) {
            try { await navigator.share({ title: "Open Curb Citation", text: text, url: shareUrl }); vibrate(10); } catch (err) { console.log('Share dismissed'); }
        } else {
            handleCitationCopy();
        }
    };

    const handleCitationCopy = async () => {
        const { text } = getCitationShareData();
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopyFeedback("Copied!"); vibrate([10, 50, 10]);
            setTimeout(() => setCopyFeedback(null), 2000);
        } catch (err) { console.error("Copy failed"); }
    };

    const handleSearchClick = () => {
        setError(null); setShakeField(null);
        if (isCitationMode) {
             if (mode === 'ticket') { 
                 if(!luhnValidate(ticketNum) || ticketNum.length !== 9) { setError("Invalid Ticket"); setShakeField('ticket'); vibrate(100); return; } 
             } else { 
                 if(!plateNum) { setError("Enter Plate"); setShakeField('plate'); vibrate(100); return; } 
             }
             vibrate(10); formRef.current.submit(); return;
        }
        if (mode === 'id' && startId.length < 3) { setError("ID too short"); setShakeField('start'); vibrate(100); return; }
        if (mode === 'street' && streetQuery.length < 2) { setError("Select street"); setShakeField('street'); vibrate(100); return; }
        executeSearch(mode, startId, endId, streetQuery);
    };

    const handleNewSearch = () => {
        setIsExpanding(false); vibrate(10);
        setTimeout(() => { 
            setView('search'); setStartId(''); setEndId(''); setStreetQuery(''); setResults([]); setError(null); 
        }, 300);
    };

    useEffect(() => {
        fetchWithRetry(`${CONFIG.BACKEND_URL}/api/meta`).then(r => r.json()).then(d => {
            if(d.data?.[0]?.attributes?.modified) {
                setDataDate(new Date(d.data[0].attributes.modified).toLocaleDateString());
                const cached = storage.get(CONFIG.STORAGE_KEYS.META);
                if (cached?.timestamp < d.data[0].attributes.modified) storage.remove(CONFIG.STORAGE_KEYS.STREETS);
                storage.set(CONFIG.STORAGE_KEYS.META, { timestamp: d.data[0].attributes.modified });
            }
        }).catch(console.error);
        if (!isCitationMode && mode === 'street' && !streets.length) {
            const c = storage.get(CONFIG.STORAGE_KEYS.STREETS);
            if(c) setStreets(c);
            else fetchWithRetry(`${CONFIG.BACKEND_URL}/api/streets`).then(r=>r.json()).then(s => { setStreets(s); storage.set(CONFIG.STORAGE_KEYS.STREETS, s); });
        }
    }, [mode, isCitationMode]);

    const toggleCitationMode = () => {
        setIsCitationMode(!isCitationMode);
        setMode(isCitationMode ? 'id' : 'ticket');
        setError(null); 
        setResults([]); 
        setView('search');
        vibrate(10);
    };

    return (
        <div className="h-screen w-screen relative flex flex-col font-sans text-white">
            <style>{customStyles}</style>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            {showBarcodeScanner && <BarcodeScannerModal onClose={() => setShowBarcodeScanner(false)} onDetected={handleBarcodeDetected} />}
            <form ref={formRef} action={CONFIG.ETIMS_ENDPOINT} method="POST" target="_blank" className="hidden">
                 <input type="hidden" name="clientcode" value="5I" /><input type="hidden" name="requestType" value="submit" /><input type="hidden" name="clientAccount" value="6" />
                 <input type="hidden" name="paymentType" value={mode === 'ticket' ? 'T' : 'P'} /><input type="hidden" name="documentNum" value={mode === 'ticket' ? ticketNum : `${plateState}${plateNum}`} />
            </form>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#003B71_0%,#001f3f_100%)] z-0" />
            
            {/* HEADER */}
            <header className={`relative z-10 safe-top px-6 py-6 grid grid-cols-[1fr_auto_1fr] sm:flex sm:justify-between items-center transition-opacity duration-300 ${view !== 'search' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="col-start-2"><button onClick={toggleCitationMode}><span className="text-2xl font-black italic tracking-tighter">OPEN CURB</span></button></div>
                <div className="flex gap-2 col-start-3 justify-self-end">
                    {!isOnline && <WifiOff size={24} className="text-red-300" />}
                    <button onClick={() => setShowSettingsModal(true)} className="p-3 bg-white/10 rounded-full"><Settings size={24} className="text-white/80" /></button>
                </div>
            </header>

            {/* MAIN INPUT AREA */}
            <main className={`flex-1 relative z-10 flex flex-col transition-all duration-300 ${view !== 'search' ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
                <div className="mt-4 sm:mt-16 px-6 flex flex-col gap-8">
                    <div className="w-full max-w-md mx-auto space-y-4 relative z-10">
                        <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/20">
                            <button onClick={() => { setMode(isCitationMode ? 'ticket' : 'id'); setError(null); vibrate(10); }} className={`flex-1 py-4 rounded-xl font-semibold transition-all ${mode === 'id' || mode === 'ticket' ? 'bg-white/20 text-white shadow-inner' : 'text-white/60'}`}>{isCitationMode ? 'Ticket #' : 'Meter ID'}</button>
                            <button onClick={() => { setMode(isCitationMode ? 'plate' : 'street'); setError(null); vibrate(10); }} className={`flex-1 py-4 rounded-xl font-semibold transition-all ${mode === 'street' || mode === 'plate' ? 'bg-white/20 text-white shadow-inner' : 'text-white/60'}`}>{isCitationMode ? 'License Plate' : 'Street Name'}</button>
                        </div>
                        
                        <div className="min-h-[80px] flex flex-col justify-center">
                            {!isCitationMode && mode === 'id' && (
                                <div className="flex w-full items-center gap-2">
                                    <input type="tel" placeholder="Start" className={`flex-1 bg-white/20 border-2 text-white rounded-3xl py-3 h-14 px-4 text-center text-xl font-mono outline-none ${shakeField === 'start' ? 'border-red-500' : 'border-white/10'}`} value={startId} onChange={(e) => setStartId(e.target.value)} />
                                    <span className="text-2xl">-</span>
                                    <input type="tel" placeholder="End" className="flex-1 bg-white/20 border-2 border-white/10 text-white rounded-3xl py-3 h-14 px-4 text-center text-xl font-mono outline-none" value={endId} onChange={(e) => setEndId(e.target.value)} />
                                </div>
                            )}
                            {!isCitationMode && mode === 'street' && (
                                <div className="relative w-full">
                                    <input list="streets" placeholder="Search Street Name..." className={`w-full bg-white/20 border-2 text-white rounded-3xl py-3 h-14 px-4 text-lg outline-none ${shakeField === 'street' ? 'border-red-500' : 'border-white/10'}`} value={streetQuery} onChange={(e) => setStreetQuery(e.target.value)} />
                                    <datalist id="streets">{streets.map(s => <option key={s} value={s} />)}</datalist>
                                </div>
                            )}
                            {isCitationMode && mode === 'ticket' && (
                                <div className="flex gap-2">
                                    <input type="tel" placeholder="Ticket Number" className={`flex-1 bg-white/20 border-2 text-white rounded-3xl py-3 h-14 px-4 text-center text-xl font-mono outline-none ${shakeField === 'ticket' ? 'border-red-500' : 'border-white/10'}`} value={ticketNum} onChange={(e) => setTicketNum(e.target.value)} />
                                    <button onClick={() => setShowBarcodeScanner(true)} className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center"><ScanBarcode size={24}/></button>
                                </div>
                            )}
                            {isCitationMode && mode === 'plate' && (
                                <div className="flex gap-2">
                                    <select value={plateState} onChange={(e) => setPlateState(e.target.value)} className="bg-white/20 border-2 border-white/10 text-white rounded-3xl h-14 px-2 text-lg font-bold outline-none">{US_STATES.map(s => <option key={s} value={s} className="text-black">{s}</option>)}</select>
                                    <input type="text" placeholder="PLATE" className={`flex-1 bg-white/20 border-2 text-white rounded-3xl h-14 px-4 text-center text-xl font-mono uppercase outline-none ${shakeField === 'plate' ? 'border-red-500' : 'border-white/10'}`} value={plateNum} onChange={(e) => setPlateNum(e.target.value.toUpperCase())} />
                                    <button onClick={() => fileInputRef.current.click()} className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center">{isScanning ? <Loader2 className="animate-spin"/> : <Camera size={24}/>}</button>
                                </div>
                            )}
                        </div>
                        {error && <div className="bg-red-500/20 border border-red-500 rounded-2xl p-3 text-center"><p className="text-white text-sm font-semibold flex items-center justify-center gap-2"><AlertTriangle size={16}/> {error}</p></div>}
                        {!isCitationMode && recent.length > 0 && <div className="space-y-2"><div className="flex justify-between px-2"><h3 className="text-white/60 text-sm font-bold flex gap-2"><History size={16}/> Recent</h3><button onClick={clearRecent}><Trash2 size={14}/></button></div>{recent.slice(0,3).map((s,i) => <RecentSearchItem key={i} search={s} onSelect={(x) => { if(x.mode==='id'){setStartId(x.query.split('-')[0]); setMode('id');} else {setStreetQuery(x.query); setMode('street');} }} onRemove={addRecent} />)}</div>}
                        {!isCitationMode && favorites.length > 0 && <div className="space-y-2"><h3 className="text-white/60 text-sm font-bold flex gap-2 px-2"><Star size={16} className="text-yellow-500"/> Favorites</h3>{favorites.slice(0,3).map(f => <FavoriteItem key={f.id} favorite={f} onSelect={(fav) => { setResults([fav]); setView('results'); }} onRemove={(id) => removeFavorite(id)} />)}</div>}
                    </div>
                </div>

                {/* --- NAVIGATION TOGGLES (SIDE SWITCHING) --- */}
                <div className="absolute inset-x-0 top-1/2 -mt-16 pointer-events-none">
                    <div className={`absolute left-0 transition-transform duration-500 ${isCitationMode ? 'translate-x-0' : '-translate-x-full'}`}>
                        <button onClick={toggleCitationMode} className="pointer-events-auto bg-white/10 backdrop-blur-md hover:bg-white/20 border-r border-y border-white/20 text-white py-4 pl-4 pr-6 rounded-r-2xl shadow-lg flex items-center gap-2 group transition-all active:scale-95">
                            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            <div className="text-left">
                                <span className="block text-[10px] uppercase font-bold opacity-60">Go To</span>
                                <span className="block font-bold text-sm">Space Locator</span>
                            </div>
                        </button>
                    </div>

                    <div className={`absolute right-0 transition-transform duration-500 ${!isCitationMode ? 'translate-x-0' : 'translate-x-full'}`}>
                        <button onClick={toggleCitationMode} className="pointer-events-auto bg-white/10 backdrop-blur-md hover:bg-white/20 border-l border-y border-white/20 text-white py-4 pl-6 pr-4 rounded-l-2xl shadow-lg flex items-center gap-2 group transition-all active:scale-95">
                            <div className="text-right">
                                <span className="block text-[10px] uppercase font-bold opacity-60">Go To</span>
                                <span className="block font-bold text-sm">Citation Portal</span>
                            </div>
                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
                
                <div className="flex-grow flex flex-col items-center pt-8 relative pb-32">
                    <div className="relative flex justify-center items-center">
                        <div className={`circle-transition ${isExpanding ? 'expanding' : ''} ${!isExpanding && view !== 'search' ? 'closing' : ''}`} />
                        <button onClick={handleSearchClick} disabled={loading} className="group relative w-32 h-32 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center z-30">
                            <div className="flex flex-col items-center text-[#003B71]">{loading ? <RotateCw className="animate-spin" size={32} /> : <Search size={32} strokeWidth={2.5} />}<span className="text-xs font-black uppercase mt-1">{isCitationMode ? 'Lookup' : 'Find'}</span></div>
                        </button>
                    </div>
                </div>
            </main>

            {/* RESULTS PANEL */}
            <div className={`fixed inset-x-0 bottom-0 z-30 bg-slate-200 text-[#003B71] rounded-t-[2.5rem] shadow-2xl transition-transform duration-500 flex flex-col safe-bottom ${view === 'results' ? 'translate-y-0 h-[85vh]' : 'translate-y-full h-[85vh]'}`}>
                <div className="px-6 py-4 flex items-center justify-between bg-[#003B71] rounded-t-[2.5rem] sticky top-0 z-40 shadow-md">
                    <button onClick={handleNewSearch} className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold"><RotateCw size={18} /> New Search</button>
                    <div className="text-right"><span className="block font-bold text-white text-xl leading-none">{results.length}</span><span className="text-[10px] text-white/60 font-bold uppercase">Results</span></div>
                </div>
                <div className="flex-1 overflow-y-auto hide-scroll bg-slate-200 p-4">
                    {loading ? <LoadingSkeleton /> : results.length === 0 ? <EmptyState message="No results found." icon={Search} action={<button onClick={handleNewSearch} className="px-6 py-2.5 bg-[#003B71] text-white rounded-xl font-bold">New Search</button>} /> : (
                        <div>
                            {dataDate && <div className="mb-4 p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3"><Info className="text-blue-600 shrink-0" size={18} /><p className="text-xs text-blue-800">Updated: <b>{dataDate}</b></p></div>}
                            {results.map((item, idx) => <ResultItem key={idx} item={item} onFavorite={(fav) => isFavorite(fav.id) ? removeFavorite(fav.id) : addFavorite(fav)} isFavorite={isFavorite(item.ids.join('-'))} />)}
                        </div>
                    )}
                </div>
            </div>

            {/* MODALS */}
            {showSettingsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-black" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-[#003B71]">Settings</h2><button onClick={() => setShowSettingsModal(false)}><X size={20}/></button></div>
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4"><p className="text-xs text-gray-600">{recent.length} recent • {favorites.length} favorites</p></div>
                        <button onClick={() => setShowInfoModal(true)} className="w-full py-3 bg-[#003B71] text-white font-bold rounded-xl flex items-center justify-center gap-2"><Info size={18} /> About</button>
                    </div>
                </div>
            )}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowInfoModal(false)}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-black" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-[#003B71] mb-4">System Intel</h2>
                        <p className="text-gray-600 text-sm mb-6">Designed by William Dugann. Connects to IndyGIS Layer 14.</p>
                        <button onClick={() => setShowInfoModal(false)} className="w-full py-3 bg-[#003B71] text-white font-bold rounded-xl">Dismiss</button>
                    </div>
                </div>
            )}
        </div>
    );
}
