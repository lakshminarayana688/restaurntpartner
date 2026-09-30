import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { RestaurantDetails, VerificationDocument, RestaurantRegStatus } from '../types/restaurant';
import { Order, OrderStatus, DeliveryPartner, PaymentStatus } from '../types/order';
import { MenuItem } from '../types/menu';
import { ReviewItem, OfferItem, SettlementRecord } from '../types/extras';
import { initialDocuments, initialRestaurantDetails } from '../data/sampleData';
import { initialMenuItems } from '../data/initialMenu';
import { initialOrders } from '../data/initialOrders';
import { initialReviews, initialOffers, initialSettlements } from '../data/initialExtras';
import { soundEffects } from '../utils/audio';

import {
  AppMode,
  getAppMode,
  setAppMode as persistAppMode,
  isDemoMode as checkIsDemoMode,
  authService,
  restaurantService,
  menuService,
  orderService,
  deliveryService,
  paymentService,
  settlementService,
  notificationService,
  analyticsService,
  healthService,
} from '../services';
import { isSupabaseConfigured } from '../utils/supabase';

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'register'
  | 'documents'
  | 'verification_status'
  | 'approval'
  | 'setup'
  | 'dashboard'
  | 'orders'
  | 'menu'
  | 'earnings'
  | 'analytics'
  | 'reviews'
  | 'offers'
  | 'profile'
  | 'documents_compliance'
  | 'staff'
  | 'notifications_center'
  | 'inventory'
  | 'support'
  | 'settings';

export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'KITCHEN' | 'CASHIER';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ORDER' | 'RIDER' | 'PAYMENT' | 'REVIEW' | 'ALERT';
  read: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentScreen: ScreenName;
  setScreen: (screen: ScreenName) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  
  // App Mode (DEMO vs PRODUCTION)
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  isDemoMode: boolean;
  isPrototypeMode: boolean;
  
  restaurant: RestaurantDetails;
  updateRestaurant: (details: Partial<RestaurantDetails>) => void;
  documents: VerificationDocument[];
  updateDocument: (id: string, updates: Partial<VerificationDocument>) => void;
  submitDocumentsForVerification: () => void;
  simulateApproval: () => void;
  completeSetup: () => void;
  
  orders: Order[];
  incomingOrder: Order | null;
  setIncomingOrder: (order: Order | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  
  menuItems: MenuItem[];
  reviews: ReviewItem[];
  offers: OfferItem[];
  settlements: SettlementRecord[];
  
  notifications: AppNotification[];
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationsAsRead: () => void;
  
  toasts: ToastMessage[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  
  viewMode: 'responsive' | 'mobile_frame';
  setViewMode: (mode: 'responsive' | 'mobile_frame') => void;
  isRiderSimulatorOpen: boolean;
  setIsRiderSimulatorOpen: (open: boolean) => void;
  isOfflineModalOpen: boolean;
  setIsOfflineModalOpen: (open: boolean) => void;
  isDatabaseModalOpen: boolean;
  setIsDatabaseModalOpen: (open: boolean) => void;
  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  toggleOnlineStatus: () => void;
  isSupabaseLive: boolean;
  isLoading: boolean;
  
  // Order Lifecycle
  simulateNewIncomingOrder: () => void;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  startPreparingOrder: (orderId: string) => void;
  markFoodReady: (orderId: string) => void;
  assignRider: (orderId: string) => void;
  markRiderArrived: (orderId: string) => void;
  verifyPickup: (orderId: string, enteredCode?: string) => boolean;
  confirmHandover: (orderId: string) => void;
  startOutForDelivery: (orderId: string) => void;
  markDelivered: (orderId: string) => void;
  
  // Menu Actions
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'votes'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  duplicateMenuItem: (id: string) => void;
  
  // Extra Actions
  addReviewReply: (reviewId: string, replyText: string) => void;
  createOffer: (offer: Omit<OfferItem, 'id' | 'totalRedemptions'>) => void;
  toggleOfferActive: (offerId: string) => void;
  
  // Reset
  resetAllDemoData: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppModeState] = useState<AppMode>(getAppMode());
  const isDemo = appMode === 'DEMO';
  const isPrototypeMode = isDemo;
  
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('OWNER');
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  
  // Restaurant data
  const [restaurant, setRestaurant] = useState<RestaurantDetails>(initialRestaurantDetails);
  const [documents, setDocuments] = useState<VerificationDocument[]>(initialDocuments);
  
  // Orders & Menu
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [incomingOrder, setIncomingOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(initialSettlements);
  
  // UI States
  const [viewMode, setViewMode] = useState<'responsive' | 'mobile_frame'>('responsive');
  const [isRiderSimulatorOpen, setIsRiderSimulatorOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(isSupabaseConfigured());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'notif-1', title: 'New Order Received', message: 'Order #FD10245 received from Rahul Kumar', time: '11:42 AM', type: 'ORDER', read: false },
    { id: 'notif-2', title: 'Rider Assigned', message: 'Arun Kumar is on his way to your restaurant', time: '11:45 AM', type: 'RIDER', read: false },
    { id: 'notif-3', title: 'Daily Settlement Processed', message: '₹14,207 transferred to HDFC Bank ****9921', time: '10:00 AM', type: 'PAYMENT', read: true },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    persistAppMode(mode);
    showToast(`Switched to ${mode} MODE`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- DATA REFRESH FUNCTION ---
  const refreshData = useCallback(async () => {
    if (isDemo) {
      setOrders(initialOrders);
      setMenuItems(initialMenuItems);
      setSettlements(initialSettlements);
      setRestaurant(initialRestaurantDetails);
      return;
    }

    setIsLoading(true);
    try {
      const [restRes, ordersRes, menuRes, settRes] = await Promise.all([
        restaurantService.getRestaurant(restaurant.id),
        orderService.getOrders(restaurant.id),
        menuService.getMenuItems(restaurant.id),
        settlementService.getSettlements(restaurant.id),
      ]);

      if (restRes.success && restRes.data) setRestaurant(restRes.data);
      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
      if (menuRes.success && menuRes.data) setMenuItems(menuRes.data);
      if (settRes.success && settRes.data) setSettlements(settRes.data);
    } catch (err: any) {
      showToast('Could not refresh data from server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isDemo, restaurant.id]);

  // Initial load
  useEffect(() => {
    if (!isDemo && isSupabaseConfigured()) {
      refreshData();
    }
  }, [isDemo, refreshData]);

  // --- REALTIME SUBSCRIPTION VIA SERVICE LAYER ---
  useEffect(() => {
    if (isDemo || !isSupabaseConfigured()) {
      setIsSupabaseLive(false);
      return;
    }

    setIsSupabaseLive(true);

    const unsubscribe = orderService.subscribeToOrders(
      restaurant.id || '',
      (newOrderRow) => {
        const newOrder: Order = {
          id: newOrderRow.id,
          customer: {
            name: newOrderRow.customer_name_snapshot || 'Customer',
            phoneMasked: newOrderRow.customer_phone_masked || '+91 98*** **123',
            address: newOrderRow.customer_address_snapshot || 'Bengaluru',
            area: 'Nearby',
            distanceKm: 2.4,
            orderCount: 1,
          },
          items: [
            {
              id: 'supa-item-1',
              name: 'Customer Selected Dish',
              category: 'Main Course',
              price: Number(newOrderRow.subtotal) || 280,
              quantity: 1,
              isVeg: true,
            },
          ],
          subtotal: Number(newOrderRow.subtotal) || 280,
          deliveryFee: Number(newOrderRow.delivery_fee) || 40,
          platformFee: Number(newOrderRow.platform_fee) || 10,
          taxes: Number(newOrderRow.tax) || 18,
          discount: Number(newOrderRow.discount) || 0,
          total: Number(newOrderRow.total_amount) || 348,
          paymentStatus: (newOrderRow.payment_status || 'PAID') as PaymentStatus,
          paymentMethod: newOrderRow.payment_method || 'UPI',
          status: (newOrderRow.status || 'CREATED') as OrderStatus,
          specialInstructions: newOrderRow.special_instructions || '',
          pickupCode: newOrderRow.pickup_code || Math.floor(1000 + Math.random() * 9000).toString(),
          createdAt: 'Just now',
          prepMinutes: newOrderRow.prep_minutes || 18,
          prepTargetMinutes: 20,
          packagingDone: false,
          timeline: [
            { status: 'CREATED', title: 'Order Placed', description: 'Customer created order in database', time: 'Just now', completed: true },
          ],
        };

        setOrders(prev => {
          if (prev.some(o => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });

        setIncomingOrder(newOrder);
        if (restaurant.newOrderSound) {
          soundEffects.playNewOrderChime();
        }
        addNotification('New Order Received via Supabase', `Order #${newOrder.id} from ${newOrder.customer.name}`, 'ORDER');
        showToast(`⚡ Real-time Order #${newOrder.id} received from Supabase!`, 'success');
      },
      (updatedRow) => {
        setOrders(prev =>
          prev.map(o => (o.id === updatedRow.id ? { ...o, status: updatedRow.status as OrderStatus } : o))
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isDemo, restaurant.id, restaurant.newOrderSound]);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    notificationService.markAllAsRead();
  };

  const updateRestaurant = async (details: Partial<RestaurantDetails>) => {
    setRestaurant(prev => ({ ...prev, ...details }));
    if (!isDemo && restaurant.id) {
      await restaurantService.updateRestaurant(restaurant.id, details as any);
    }
  };

  const updateDocument = (id: string, updates: Partial<VerificationDocument>) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc));
  };

  const submitDocumentsForVerification = async () => {
    setDocuments(prev => prev.map(doc => ({ ...doc, status: 'UNDER_REVIEW' })));
    setRestaurant(prev => ({ ...prev, regStatus: 'UNDER_REVIEW' }));

    if (!isDemo && restaurant.id) {
      await restaurantService.submitKyc({
        restaurant_id: restaurant.id,
        pan_number: restaurant.panNumber,
        gst_number: restaurant.gstNumber,
        fssai_number: restaurant.fssaiNumber,
      });

      await restaurantService.updateBankAccount({
        restaurant_id: restaurant.id,
        account_holder_name: restaurant.ownerName,
        bank_name: restaurant.bankName,
        account_number: restaurant.bankAccount,
        ifsc_code: restaurant.ifscCode,
      });
    }

    showToast('Documents submitted for FEEDO verification', 'success');
    setCurrentScreen('verification_status');
  };

  const simulateApproval = () => {
    setDocuments(prev => prev.map(doc => ({ ...doc, status: 'VERIFIED' })));
    setRestaurant(prev => ({ ...prev, regStatus: 'APPROVED' }));
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    soundEffects.playSuccessHandoverTone();
    showToast('Congratulations! Restaurant approved by FEEDO', 'success');
    setCurrentScreen('approval');
  };

  const completeSetup = () => {
    setRestaurant(prev => ({ ...prev, regStatus: 'ACTIVE', isOnline: true }));
    showToast('Setup complete! Restaurant is now ONLINE', 'success');
    setCurrentScreen('dashboard');
  };

  const toggleOnlineStatus = async () => {
    if (!['OWNER', 'MANAGER'].includes(currentUserRole)) {
      showToast('Permission denied: Only Owner or Manager can change kitchen online status', 'error');
      return;
    }

    if (restaurant.regStatus === 'UNDER_REVIEW') {
      showToast('Cannot switch ONLINE: Restaurant KYC is under verification review by FEEDO compliance team', 'warning');
      return;
    }

    if (restaurant.isOnline) {
      setIsOfflineModalOpen(true);
    } else {
      setRestaurant(prev => ({ ...prev, isOnline: true }));
      showToast('Kitchen is now ONLINE and actively accepting orders', 'success');
      if (restaurant.newOrderSound) soundEffects.playAcceptTone();

      if (!isDemo && restaurant.id) {
        await restaurantService.updateRestaurant(restaurant.id, { is_online: true });
      }
    }
  };

  // --- ORDER LIFECYCLE MANAGEMENT ---

  const simulateNewIncomingOrder = () => {
    if (!restaurant.isOnline) {
      showToast('Restaurant is currently OFFLINE. Switch to Online to receive orders.', 'warning');
      return;
    }

    const newId = 'FD' + Math.floor(10246 + Math.random() * 800);
    const mockOrder: Order = {
      id: newId,
      customer: {
        name: 'Rahul Kumar',
        phoneMasked: '+91 98*** **234',
        address: 'Flat 402, Green Glen Layout, Bellandur',
        area: 'Bellandur (3.2 km)',
        distanceKm: 3.2,
        orderCount: 14,
      },
      items: [
        {
          id: 'item-1',
          name: 'Chicken Dum Biryani',
          category: 'Biryani',
          price: 180,
          quantity: 2,
          isVeg: false,
          notes: 'Less spicy, extra raita',
          imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
        },
        {
          id: 'item-11',
          name: 'Chilled Coke (750ml)',
          category: 'Beverages',
          price: 40,
          quantity: 1,
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80',
        },
      ],
      subtotal: 400,
      deliveryFee: 40,
      platformFee: 10,
      taxes: 20,
      discount: 0,
      total: 470,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI (Google Pay)',
      status: 'PAYMENT_CONFIRMED',
      specialInstructions: 'Less spicy, please pack extra spoons and napkins.',
      pickupCode: '7284',
      createdAt: 'Just now',
      prepMinutes: 18,
      prepTargetMinutes: 20,
      packagingDone: false,
      timeline: [
        { status: 'CREATED', title: 'Order Placed', description: 'Customer placed order with online payment', time: 'Just now', completed: true },
        { status: 'PAYMENT_CONFIRMED', title: 'Payment Confirmed', description: 'Paid ₹470 via UPI', time: 'Just now', completed: true },
      ],
    };

    setIncomingOrder(mockOrder);
    if (restaurant.newOrderSound) {
      soundEffects.playNewOrderChime();
    }
    addNotification('New Order Received', `Order #${mockOrder.id} from ${mockOrder.customer.name}`, 'ORDER');
  };

  const acceptOrder = async (orderId: string) => {
    let orderToAccept = incomingOrder && incomingOrder.id === orderId ? incomingOrder : orders.find(o => o.id === orderId);
    if (!orderToAccept) return;

    const acceptedOrder: Order = {
      ...orderToAccept,
      status: 'RESTAURANT_ACCEPTED',
      acceptedAt: 'Just now',
      timeline: [
        ...orderToAccept.timeline,
        { status: 'RESTAURANT_ACCEPTED', title: 'Order Accepted', description: 'Restaurant accepted order', time: 'Just now', completed: true }
      ]
    };

    setOrders(prev => {
      const exists = prev.some(o => o.id === orderId);
      if (exists) {
        return prev.map(o => o.id === orderId ? acceptedOrder : o);
      }
      return [acceptedOrder, ...prev];
    });

    if (incomingOrder?.id === orderId) setIncomingOrder(null);
    if (selectedOrder?.id === orderId) setSelectedOrder(acceptedOrder);

    if (restaurant.newOrderSound) soundEffects.playAcceptTone();
    showToast(`Order #${orderId} accepted. Start preparing!`, 'success');

    await orderService.updateOrderStatus(orderId, restaurant.id || '', 'ACCEPTED');
  };

  const rejectOrder = async (orderId: string, reason: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'RESTAURANT_REJECTED' as OrderStatus,
          rejectionReason: reason,
          timeline: [
            ...o.timeline,
            { status: 'RESTAURANT_REJECTED' as OrderStatus, title: 'Order Rejected', description: `Reason: ${reason}`, time: 'Just now', completed: true }
          ]
        };
      }
      return o;
    });

    setOrders(updated);
    if (incomingOrder?.id === orderId) setIncomingOrder(null);
    if (selectedOrder?.id === orderId) setSelectedOrder(null);

    soundEffects.playRejectTone();
    showToast(`Order #${orderId} rejected: ${reason}`, 'warning');
    addNotification('Order Rejected', `Order #${orderId} rejected (${reason})`, 'ALERT');

    await orderService.updateOrderStatus(orderId, restaurant.id || '', 'REJECTED', undefined, reason);
  };

  const startPreparingOrder = async (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status: 'PREPARING',
          prepStartedAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'PREPARING', title: 'Kitchen Preparing', description: 'Chefs started cooking', time: 'Just now', completed: true, current: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    if (restaurant.newOrderSound) soundEffects.playAcceptTone();
    showToast(`Order #${orderId} is now PREPARING`, 'info');

    await orderService.updateOrderStatus(orderId, restaurant.id || '', 'PREPARING');

    // Auto simulate rider assignment after 4 seconds in demo mode
    if (isDemo) {
      setTimeout(() => {
        assignRider(orderId);
      }, 4000);
    }
  };

  const assignRider = async (orderId: string) => {
    const riderRes = await deliveryService.assignRider(orderId);
    const rider = riderRes.data || {
      id: 'rider-arun',
      name: 'Arun Kumar',
      phoneMasked: '+91 91*** **890',
      vehicleNumber: 'KA 05 AB 1234',
      vehicleModel: 'Hero Splendor (Black)',
      rating: 4.8,
      distanceKm: 1.2,
      etaMinutes: 6,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    };

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          rider,
          deliveryState: 'RIDER_ASSIGNED',
          riderAssignedAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'RIDER_ASSIGNED', title: 'Delivery Partner Assigned', description: `${rider.name} assigned (1.2 km away)`, time: 'Just now', completed: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    addNotification('Delivery Partner Assigned', `${rider.name} assigned to Order #${orderId}`, 'RIDER');
    showToast(`Delivery partner ${rider.name} assigned for #${orderId}`, 'info');
  };

  const markFoodReady = async (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status: 'READY_FOR_PICKUP',
          readyAt: 'Just now',
          packagingDone: true,
          timeline: [
            ...o.timeline,
            { status: 'READY_FOR_PICKUP', title: 'Food Ready', description: 'Food packed and ready at counter', time: 'Just now', completed: true, current: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    if (restaurant.newOrderSound) soundEffects.playFoodReadyTone();
    showToast(`Order #${orderId} marked FOOD READY! Waiting for pickup.`, 'success');
    addNotification('Food Ready for Pickup', `Order #${orderId} is packed & ready`, 'ORDER');

    await orderService.updateOrderStatus(orderId, restaurant.id || '', 'READY_FOR_PICKUP');
  };

  const markRiderArrived = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          deliveryState: 'RIDER_ARRIVED',
          status: o.status === 'READY_FOR_PICKUP' ? 'RIDER_ARRIVED' : o.status,
          riderArrivedAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'RIDER_ARRIVED', title: 'Rider Arrived', description: 'Delivery partner arrived at restaurant counter', time: 'Just now', completed: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    if (restaurant.newOrderSound) soundEffects.playRiderArrivedTone();
    showToast(`Delivery partner arrived for #${orderId}!`, 'info');
    addNotification('Delivery Partner Arrived', `Delivery partner is at the counter for #${orderId}`, 'RIDER');
  };

  const verifyPickup = (orderId: string, enteredCode?: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const isValid = deliveryService.verifyPickupCode(order.pickupCode, enteredCode || order.pickupCode);
    if (!isValid) {
      showToast('Incorrect Pickup OTP. Please check rider screen.', 'error');
      return false;
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          deliveryState: 'PICKUP_VERIFIED',
          status: 'PICKUP_VERIFIED',
          timeline: [
            ...o.timeline,
            { status: 'PICKUP_VERIFIED', title: 'Pickup Verified', description: `Code ${o.pickupCode} verified successfully`, time: 'Just now', completed: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    soundEffects.playSuccessHandoverTone();
    showToast(`Pickup OTP verified for Order #${orderId}! Ready for handover.`, 'success');
    return true;
  };

  const confirmHandover = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status: 'PICKED_UP',
          deliveryState: 'HANDOVER_COMPLETED',
          pickedUpAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'PICKED_UP', title: 'Handover Completed', description: 'Order handed over to delivery partner', time: 'Just now', completed: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    soundEffects.playSuccessHandoverTone();
    showToast(`Order #${orderId} Handover Complete!`, 'success');

    await orderService.updateOrderStatus(orderId, restaurant.id || '', 'PICKED_UP', order?.pickupCode);
  };

  const startOutForDelivery = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status: 'OUT_FOR_DELIVERY',
          outForDeliveryAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'OUT_FOR_DELIVERY', title: 'Out For Delivery', description: 'Rider on the way to customer location', time: 'Just now', completed: true, current: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    showToast(`Order #${orderId} is now OUT FOR DELIVERY!`, 'info');
  };

  const markDelivered = async (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status: 'DELIVERED',
          deliveredAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'DELIVERED', title: 'Order Delivered', description: 'Delivered successfully to customer', time: 'Just now', completed: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    showToast(`Order #${orderId} delivered to customer!`, 'success');
    addNotification('Order Delivered', `Order #${orderId} successfully delivered`, 'ORDER');

    await orderService.updateOrderStatus(orderId, restaurant.id || '', 'DELIVERED');
  };

  // --- MENU ACTIONS ---

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'rating' | 'votes'>) => {
    const res = await menuService.addMenuItem(restaurant.id || '', item);
    if (res.success && res.data) {
      setMenuItems(prev => [res.data!, ...prev]);
      showToast(`"${res.data.name}" added to menu successfully`, 'success');
    } else {
      showToast(res.error?.message || 'Failed to add menu item', 'error');
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    await menuService.updateMenuItem(id, updates);
    showToast('Menu item updated successfully', 'success');
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    await menuService.deleteMenuItem(id);
    showToast('Menu item deleted', 'info');
  };

  const toggleItemAvailability = async (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    const nextState = !item.isAvailable;

    setMenuItems(prev => prev.map(it => it.id === id ? { ...it, isAvailable: nextState } : it));
    showToast(`"${item.name}" is now ${nextState ? 'IN STOCK' : 'OUT OF STOCK'}`, nextState ? 'success' : 'warning');
    await menuService.updateMenuItem(id, { isAvailable: nextState });
  };

  const duplicateMenuItem = async (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    const duplicated: MenuItem = {
      ...item,
      name: `${item.name} (Copy)`,
    };
    await addMenuItem(duplicated);
  };

  // --- REVIEWS & OFFERS ---

  const addReviewReply = (reviewId: string, replyText: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          reply: {
            text: replyText,
            repliedAt: 'Just now',
          }
        };
      }
      return r;
    }));
    showToast('Reply published to customer', 'success');
  };

  const createOffer = (offer: Omit<OfferItem, 'id' | 'totalRedemptions'>) => {
    const newOffer: OfferItem = {
      ...offer,
      id: 'off-' + Date.now(),
      totalRedemptions: 0,
    };
    setOffers(prev => [newOffer, ...prev]);
    showToast(`Offer coupon "${newOffer.code}" created!`, 'success');
  };

  const toggleOfferActive = (offerId: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        const next = !off.isActive;
        showToast(`Offer ${off.code} is now ${next ? 'ACTIVE' : 'PAUSED'}`, 'info');
        return { ...off, isActive: next };
      }
      return off;
    }));
  };

  // --- RESET ALL DATA ---

  const resetAllDemoData = () => {
    setRestaurant(initialRestaurantDetails);
    setDocuments(initialDocuments);
    setOrders(initialOrders);
    setMenuItems(initialMenuItems);
    setReviews(initialReviews);
    setOffers(initialOffers);
    setSettlements(initialSettlements);
    setIncomingOrder(null);
    setSelectedOrder(null);
    setCurrentScreen('dashboard');
    showToast('Demo data reset to default state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setScreen: setCurrentScreen,
        currentUserRole,
        setCurrentUserRole,
        appMode,
        setAppMode,
        isDemoMode: isDemo,
        isPrototypeMode,
        restaurant,
        updateRestaurant,
        documents,
        updateDocument,
        submitDocumentsForVerification,
        simulateApproval,
        completeSetup,
        orders,
        incomingOrder,
        setIncomingOrder,
        selectedOrder,
        setSelectedOrder,
        menuItems,
        reviews,
        offers,
        settlements,
        notifications,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationsAsRead,
        toasts,
        showToast,
        viewMode,
        setViewMode,
        isRiderSimulatorOpen,
        setIsRiderSimulatorOpen,
        isOfflineModalOpen,
        setIsOfflineModalOpen,
        isDatabaseModalOpen,
        setIsDatabaseModalOpen,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        toggleOnlineStatus,
        isSupabaseLive,
        isLoading,
        simulateNewIncomingOrder,
        acceptOrder,
        rejectOrder,
        startPreparingOrder,
        markFoodReady,
        assignRider,
        markRiderArrived,
        verifyPickup,
        confirmHandover,
        startOutForDelivery,
        markDelivered,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        duplicateMenuItem,
        addReviewReply,
        createOffer,
        toggleOfferActive,
        resetAllDemoData,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
