import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode as QrCodeIcon, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QrCodeModal: React.FC = () => {
  const { profile, showQrModal, setShowQrModal } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const publicUrl = `${window.location.origin}/u/${profile.username || 'rajabagdi'}`;

  useEffect(() => {
    if (showQrModal && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        publicUrl,
        {
          width: 260,
          margin: 2,
          color: {
            dark: '#1e1b4b',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [showQrModal, publicUrl]);

  if (!showQrModal) return null;

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `heylink-${profile.username || 'rajabagdi'}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 text-center relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowQrModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
          <QrCodeIcon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-0.5">
          Scan & Share Bio
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Scan to open <span className="font-semibold text-purple-700">@{profile.username}</span> on any smartphone.
        </p>

        {/* QR Code Canvas Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block shadow-inner mb-5">
          <canvas ref={canvasRef} className="rounded-xl mx-auto" />
        </div>

        {/* Link Box */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 mb-5 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-600 font-mono truncate">{publicUrl}</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-white transition-colors shrink-0"
            title="Copy URL"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
