import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Ban, CheckCircle } from 'lucide-react';

export interface ToastData {
    id: number;
    message: string;
    type: 'warning' | 'error' | 'success';
}

let toastId = 0;
let addToastGlobal: ((message: string, type: ToastData['type']) => void) | null = null;

export const showToast = (message: string, type: ToastData['type'] = 'warning') => {
    addToastGlobal?.(message, type);
};

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    useEffect(() => {
        addToastGlobal = (message, type) => {
            const id = ++toastId;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 4000);
        };
        return () => { addToastGlobal = null; };
    }, []);

    const remove = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    const iconMap = {
        warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
        error: <Ban className="w-4 h-4 shrink-0" />,
        success: <CheckCircle className="w-4 h-4 shrink-0" />,
    };

    const borderMap = {
        warning: 'border-yellow-500/40',
        error: 'border-red-500/40',
        success: 'border-green-500/40',
    };

    const textMap = {
        warning: 'text-yellow-200',
        error: 'text-red-200',
        success: 'text-green-200',
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-lg border ${borderMap[t.type]} bg-[rgba(1,1,2,0.92)] backdrop-blur-xl shadow-xl animate-slide-up ${textMap[t.type]} text-sm max-w-md`}
                >
                    {iconMap[t.type]}
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => remove(t.id)} className="p-0.5 hover:opacity-70 transition-opacity shrink-0">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
};
