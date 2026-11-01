import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Camera,
  Volume2,
  Mic,
  MapPin,
  Image,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

interface PermissionItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  status: PermissionState;
  isRequired: boolean;
  onEnable: () => Promise<void>;
}

export const PermissionsScreen: React.FC = () => {
  const { setScreen, unlockAudio, isAudioUnlocked, showToast } = useApp();

  const [notifStatus, setNotifStatus] = useState<PermissionState>('prompt');
  const [cameraStatus, setCameraStatus] = useState<PermissionState>('prompt');
  const [audioStatus, setAudioStatus] = useState<PermissionState>(isAudioUnlocked ? 'granted' : 'prompt');
  const [micStatus, setMicStatus] = useState<PermissionState>('prompt');
  const [locStatus, setLocStatus] = useState<PermissionState>('prompt');
  const [photosStatus, setPhotosStatus] = useState<PermissionState>('prompt');
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Probe actual browser permission states on mount
  useEffect(() => {
    const probePermissions = async () => {
      setIsChecking(true);

      // 1. Notifications
      if ('Notification' in window) {
        if (Notification.permission === 'granted') setNotifStatus('granted');
        else if (Notification.permission === 'denied') setNotifStatus('denied');
        else setNotifStatus('prompt');
      } else {
        setNotifStatus('unsupported');
      }

      // 2. Audio status
      if (isAudioUnlocked) {
        setAudioStatus('granted');
      }

      // 3. Geolocation permission query
      if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions?.query) {
        try {
          const geoPerm = await navigator.permissions.query({ name: 'geolocation' });
          if (geoPerm.state === 'granted') setLocStatus('granted');
          else if (geoPerm.state === 'denied') setLocStatus('denied');
          else setLocStatus('prompt');

          geoPerm.onchange = () => {
            if (geoPerm.state === 'granted') setLocStatus('granted');
            else if (geoPerm.state === 'denied') setLocStatus('denied');
            else setLocStatus('prompt');
          };
        } catch {
          // Some browsers throw for geolocation query
        }

        // Camera probe
        try {
          const camPerm = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (camPerm.state === 'granted') setCameraStatus('granted');
          else if (camPerm.state === 'denied') setCameraStatus('denied');
          else setCameraStatus('prompt');

          camPerm.onchange = () => {
            if (camPerm.state === 'granted') setCameraStatus('granted');
            else if (camPerm.state === 'denied') setCameraStatus('denied');
            else setCameraStatus('prompt');
          };
        } catch {
          // Camera query not universally supported, check cached
          const savedCam = localStorage.getItem('feedo_perm_camera');
          if (savedCam === 'granted') setCameraStatus('granted');
        }

        // Microphone probe
        try {
          const micPerm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (micPerm.state === 'granted') setMicStatus('granted');
          else if (micPerm.state === 'denied') setMicStatus('denied');
          else setMicStatus('prompt');

          micPerm.onchange = () => {
            if (micPerm.state === 'granted') setMicStatus('granted');
            else if (micPerm.state === 'denied') setMicStatus('denied');
            else setMicStatus('prompt');
          };
        } catch {
          const savedMic = localStorage.getItem('feedo_perm_mic');
          if (savedMic === 'granted') setMicStatus('granted');
        }
      }

      // Photos/Media check
      const savedPhotos = localStorage.getItem('feedo_perm_photos');
      if (savedPhotos === 'granted') {
        setPhotosStatus('granted');
      }

      setIsChecking(false);
    };

    probePermissions();
  }, [isAudioUnlocked]);

  // Handlers for genuine permission triggers
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setNotifStatus('unsupported');
      showToast('Notifications are not supported in this browser.', 'warning');
      return;
    }
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        setNotifStatus('granted');
        showToast('Notification permission granted for incoming orders!', 'success');
      } else if (result === 'denied') {
        setNotifStatus('denied');
        showToast('Notifications were denied in browser permissions.', 'warning');
      } else {
        setNotifStatus('prompt');
      }
    } catch (e) {
      setNotifStatus('denied');
    }
  };

  const requestCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unsupported');
      showToast('Camera is not supported on this device/browser.', 'warning');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop tracks immediately so camera hardware indicator doesn't remain lit
      stream.getTracks().forEach((track) => track.stop());
      setCameraStatus('granted');
      localStorage.setItem('feedo_perm_camera', 'granted');
      showToast('Camera enabled for document and photo uploads!', 'success');
    } catch (err: any) {
      console.warn('Camera request error:', err);
      setCameraStatus('denied');
      showToast('Camera access blocked. You can still select files from device storage.', 'warning');
    }
  };

  const requestAudioPermission = async () => {
    try {
      const ok = await unlockAudio();
      if (ok) {
        setAudioStatus('granted');
        showToast('Order sound alert unlocked successfully!', 'success');
      } else {
        setAudioStatus('denied');
        showToast('Could not enable audio playback.', 'warning');
      }
    } catch {
      setAudioStatus('denied');
    }
  };

  const requestMicPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicStatus('unsupported');
      showToast('Microphone is not supported on this device/browser.', 'info');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicStatus('granted');
      localStorage.setItem('feedo_perm_mic', 'granted');
      showToast('Microphone permission granted for voice commands!', 'success');
    } catch (err) {
      setMicStatus('denied');
      showToast('Microphone permission blocked or unavailable.', 'info');
    }
  };

  const requestLocationPermission = async () => {
    if (!('geolocation' in navigator)) {
      setLocStatus('unsupported');
      showToast('Geolocation is not supported in this browser.', 'warning');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocStatus('granted');
        localStorage.setItem('feedo_perm_location', 'granted');
        showToast('Restaurant premises location verified!', 'success');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocStatus('denied');
        showToast('Location permission denied or timed out.', 'warning');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const requestPhotosPermission = async () => {
    // Check if HTML5 File API and Blob storage are supported
    if (typeof window !== 'undefined' && 'FileReader' in window && 'Blob' in window) {
      setPhotosStatus('granted');
      localStorage.setItem('feedo_perm_photos', 'granted');
      showToast('Photo and document storage access confirmed!', 'success');
    } else {
      setPhotosStatus('unsupported');
    }
  };

  const permissionsList: PermissionItem[] = [
    {
      id: 'notif',
      name: 'Notifications',
      category: 'Crucial for Orders',
      icon: Bell,
      description: 'Instant loud alerts for new customer orders, order cancellations, rider arrivals, and daily 10:00 AM settlement transfers.',
      status: notifStatus,
      isRequired: true,
      onEnable: requestNotificationPermission,
    },
    {
      id: 'camera',
      name: 'Camera',
      category: 'Document & QR Verification',
      icon: Camera,
      description: 'Used to photograph original statutory documents (FSSAI, PAN, GST), capture kitchen/facade photos, and scan rider pickup QR codes.',
      status: cameraStatus,
      isRequired: true,
      onEnable: requestCameraPermission,
    },
    {
      id: 'audio',
      name: 'Sound / Audio Alerts',
      category: 'Kitchen Alerts',
      icon: Volume2,
      description: 'Plays loud, continuous kitchen ringtones when new orders arrive so kitchen staff never miss high-priority food preparations.',
      status: audioStatus,
      isRequired: true,
      onEnable: requestAudioPermission,
    },
    {
      id: 'location',
      name: 'Location',
      category: 'Premises Verification',
      icon: MapPin,
      description: 'Verifies the physical restaurant address, optimizes customer delivery radius, and calculates live delivery partner travel times.',
      status: locStatus,
      isRequired: false,
      onEnable: requestLocationPermission,
    },
    {
      id: 'photos',
      name: 'Photos & Media Storage',
      category: 'Menu & Cheque Uploads',
      icon: Image,
      description: 'Enables selecting high-resolution dish photographs, digital menu files, and bank passbook documents from device storage.',
      status: photosStatus,
      isRequired: true,
      onEnable: requestPhotosPermission,
    },
    {
      id: 'mic',
      name: 'Microphone (Voice Support)',
      category: 'Optional Voice Features',
      icon: Mic,
      description: 'Supports hands-free kitchen voice commands and voice communication with the FEEDO AI Dispatch Support Agent.',
      status: micStatus,
      isRequired: false,
      onEnable: requestMicPermission,
    },
  ];

  const handleContinueToLogin = () => {
    // Record that permission screen was completed
    localStorage.setItem('feedo_permissions_setup_done', 'true');
    setScreen('login');
  };

  const renderStatusBadge = (status: PermissionState) => {
    switch (status) {
      case 'granted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Granted</span>
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Blocked / Denied</span>
          </span>
        );
      case 'unsupported':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Not Supported</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span>Not Enabled</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10 mb-6">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shadow-xs shrink-0">
              <img
                src="/feedo-logo.png"
                alt="FEEDO"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                  FEEDO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md">
                  Partner Setup
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                App &amp; Device Permissions
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>Zero-Trust Privacy</span>
            </span>
          </div>
        </div>

        {/* Informative Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-feedo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-bold block mb-0.5">Configure Essential Kitchen Operations</strong>
            FEEDO requires device capabilities to ensure incoming order rings are never missed, original verification documents can be verified, and settlements arrive promptly. You can enable them below or configure them later in browser settings.
          </div>
        </div>

        {/* Permissions Cards List */}
        <div className="space-y-3.5 mb-8">
          {permissionsList.map((perm) => {
            const Icon = perm.icon;
            const isGranted = perm.status === 'granted';

            return (
              <div
                key={perm.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isGranted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isGranted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-sm font-bold text-slate-900">
                          {perm.name}
                        </h2>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {perm.category}
                        </span>
                        {renderStatusBadge(perm.status)}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                        {perm.description}
                      </p>
                    </div>
                  </div>

                  {/* Enable Button */}
                  <div className="sm:self-center shrink-0">
                    {isGranted ? (
                      <button
                        type="button"
                        disabled
                        className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100/60 border border-emerald-200 flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Enabled</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={perm.onEnable}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Enable</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Optional permissions can be enabled anytime from your profile or device settings.
          </p>

          <button
            type="button"
            id="continue-to-login-btn"
            onClick={handleContinueToLogin}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white font-bold rounded-2xl shadow-lg shadow-feedo-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            <span>Continue to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-3xl mx-auto w-full text-center text-xs text-slate-400 py-2">
        FEEDO Restaurant Partner Portal &bull; Encrypted Session Security &bull; Zero-Trust Architecture
      </div>
    </div>
  );
};

export default PermissionsScreen;
