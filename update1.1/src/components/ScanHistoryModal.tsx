import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaTrash, FaHistory, FaDownload, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { Scan } from '../types';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const { scanHistory } = state;
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const deleteTimeoutRef = useRef<number | null>(null);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        };
    }, []);


    if (!isOpen) {
        return null;
    }

    const handleLoadScan = (scan: Scan) => {
        dispatch({ type: 'LOAD_SCAN', payload: scan });
        toast.success(`تم تحميل الفحص "${scan.name}" بنجاح!`);
        onClose();
    };

    const handleDeleteScan = (scanId: string) => {
        if (deleteTimeoutRef.current) {
            clearTimeout(deleteTimeoutRef.current);
        }

        if (confirmDeleteId === scanId) {
            dispatch({ type: 'DELETE_SCAN', payload: scanId });
            toast.success("تم حذف الفحص.");
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(scanId);
            deleteTimeoutRef.current = window.setTimeout(() => {
                setConfirmDeleteId(null);
            }, 3000);
        }
    };
    
    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(new Date(timestamp));
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-modal-title"
        >
            <div
                className="relative bg-brand-surface rounded-2xl w-full max-w-lg mx-auto animate-slide-up flex flex-col h-[70vh] overflow-hidden border border-brand-border"
                onClick={(e) => e.stopPropagation()}
                role="document"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full text-brand-text-secondary hover:bg-brand-surface-alt transition-colors z-10"
                    aria-label="إغلاق النافذة"
                >
                    <FaTimes />
                </button>
                
                <div className="p-6 text-center border-b border-brand-border">
                    <h2 id="history-modal-title" className="text-2xl font-extrabold text-brand-text-primary">
                        سجل الفحوصات
                    </h2>
                    <p className="text-brand-text-secondary mt-1">
                        استعرض أو احذف الفحوصات التي قمت بحفظها سابقًا.
                    </p>
                </div>
                
                <div className="flex-grow p-4 bg-brand-bg overflow-y-auto">
                    {scanHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary">
                            <FaHistory className="w-16 h-16 mb-4 text-brand-text-tertiary" />
                            <p className="font-bold">لا توجد فحوصات محفوظة</p>
                            <p className="text-sm">يمكنك حفظ نتائج الفحص من لوحة النظام.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {scanHistory.map((scan) => (
                                <li key={scan.id} className="group bg-brand-surface border border-brand-border rounded-xl p-3 flex items-center justify-between gap-3 transition-shadow hover:shadow-lg animate-fade-in-up">
                                    <div className="min-w-0">
                                        <p className="font-bold text-brand-text-primary truncate" title={scan.name}>{scan.name}</p>
                                        <p className="text-xs text-brand-text-secondary">{formatDate(scan.timestamp)}</p>
                                        <p className="text-xs text-brand-text-tertiary mt-1">{scan.components.length} مكونات</p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-2">
                                        <button
                                            onClick={() => handleLoadScan(scan)}
                                            className="w-9 h-9 flex items-center justify-center bg-brand-surface-alt text-brand-text-primary rounded-lg hover:bg-brand-primary/20 hover:text-brand-primary transition-colors"
                                            title="تحميل الفحص"
                                        >
                                            <FaDownload className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteScan(scan.id)}
                                            className={`w-9 h-9 flex items-center justify-center bg-brand-surface-alt rounded-lg transition-colors ${
                                                confirmDeleteId === scan.id
                                                ? 'bg-brand-danger/20 text-brand-danger'
                                                : 'text-brand-text-secondary hover:bg-brand-danger/20 hover:text-brand-danger'
                                            }`}
                                            title={confirmDeleteId === scan.id ? "تأكيد الحذف" : "حذف الفحص"}
                                        >
                                            {confirmDeleteId === scan.id ? <FaCheck className="w-4 h-4" /> : <FaTrash className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ScanHistoryModal);