import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VegIndicator } from '../../components/common/VegIndicator';
import {
  Bell,
  Clock,
  MapPin,
  AlertTriangle,
  X,
  CheckCircle2,
  FileText,
  Volume2,
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export const IncomingOrderModal: React.FC = () => {
  const { incomingOrder, acceptOrder, rejectOrder } = useApp();
  const [countdown, setCountdown] = useState(29);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Restaurant Busy');

  const rejectReasons = [
    'Restaurant Busy',
    'Item Unavailable / Out of Stock',
    'Kitchen Closing Soon',
    'Technical Issue',
    'Other Operational Reason',
  ];

  useEffect(() => {
    if (!incomingOrder) {
      setCountdown(29);
      return;
    }

    // Play periodic urgent chimes every 8s while open
    const chimeTimer = setInterval(() => {
      soundEffects.playNewOrderChime();
    }, 8000);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(chimeTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(chimeTimer);
    };
  }, [incomingOrder]);

  if (!incomingOrder) return null;

  const handleAccept = () => {
    acceptOrder(incomingOrder.id);
  };

  const handleConfirmReject = () => {
    rejectOrder(incomingOrder.id, selectedReason);
    setShowRejectModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-feedo-500 overflow-hidden flex flex-col incoming-order-card">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-feedo-600 via-feedo-500 to-amber-500 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center animate-bounce">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  NEW ORDER
                </span>
                <span className="text-xs font-mono font-bold">#{incomingOrder.id}</span>
              </div>
              <h2 className="text-lg font-black mt-0.5">Incoming Customer Order</h2>
            </div>
          </div>

          {/* Countdown Ring */}
          <div className="flex flex-col items-center bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-1 text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-base font-mono font-black">{countdown}s</span>
            </div>
            <span className="text-[9px] text-white/80">Auto-reject</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Customer Info */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-800">{incomingOrder.customer.name}</h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{incomingOrder.customer.area}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {incomingOrder.paymentStatus} ({incomingOrder.paymentMethod})
              </span>
              <p className="text-[11px] font-bold text-slate-700 mt-1">₹{incomingOrder.total}</p>
            </div>
          </div>

          {/* Special Cooking Instructions Alert */}
          {incomingOrder.specialInstructions && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Special Customer Request:</p>
                <p className="text-xs italic mt-0.5">"{incomingOrder.specialInstructions}"</p>
              </div>
            </div>
          )}

          {/* Ordered Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordered Items</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white p-2">
              {incomingOrder.items.map((item) => (
                <div key={item.id} className="py-2 px-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <VegIndicator isVeg={item.isVeg} size="sm" />
                    <span className="font-bold text-slate-900">
                      {item.quantity} × {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 font-mono">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal</span>
              <span>₹{incomingOrder.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery & Platform Fee</span>
              <span>₹{incomingOrder.deliveryFee + incomingOrder.platformFee}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
              <span>Order Total (Paid)</span>
              <span className="text-feedo-600 font-black">₹{incomingOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowRejectModal(true)}
            className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            REJECT ORDER
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="flex-[2] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>ACCEPT ORDER</span>
          </button>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Select Rejection Reason</h3>
            <p className="text-xs text-slate-500 mb-4">
              This will notify the customer and cancel Order #{incomingOrder.id}.
            </p>

            <div className="space-y-2 mb-6">
              {rejectReasons.map((reason) => (
                <label
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'border-rose-500 bg-rose-50 text-rose-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
