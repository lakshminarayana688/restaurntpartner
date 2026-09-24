import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RestaurantDetails, VerificationDocument, RestaurantRegStatus } from '../types/restaurant';
import { Order, OrderStatus, DeliveryPartner } from '../types/order';
import { MenuItem } from '../types/menu';
import { ReviewItem, OfferItem, SettlementRecord } from '../types/extras';
import { initialDocuments, initialRestaurantDetails } from '../data/sampleData';
import { initialMenuItems } from '../data/initialMenu';
import { initialOrders } from '../data/initialOrders';
import { initialReviews, initialOffers, initialSettlements } from '../data/initialExtras';
import { soundEffects } from '../utils/audio';

import { isSupabaseConfigured, getSupabaseClient } from '../utils/supabase';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Screen state
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

  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'notif-1', title: 'New Order Received', message: 'Order #FD10245 received from Rahul Kumar', time: '11:42 AM', type: 'ORDER', read: false },
    { id: 'notif-2', title: 'Rider Assigned', message: 'Arun Kumar is on his way to your restaurant', time: '11:45 AM', type: 'RIDER', read: false },
    { id: 'notif-3', title: 'Daily Settlement Processed', message: '₹14,207 transferred to HDFC Bank ****9921', time: '10:00 AM', type: 'PAYMENT', read: true },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sound and vibration helper
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

  // --- SUPABASE REALTIME SUBSCRIPTION ---
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setIsSupabaseLive(false);
      return;
    }

    setIsSupabaseLive(true);

    const channel = client
      .channel('public:orders-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const row = payload.new as any;
          if (!row) return;

          const newOrder: Order = {
            id: row.id,
            customer: {
              name: row.customer_name || 'Customer',
              phoneMasked: row.customer_phone_masked || '+91 98*** **123',
              address: row.customer_address || 'Bengaluru',
              area: 'Nearby',
              distanceKm: 2.4,
              orderCount: 1,
            },
            items: [
              {
                id: 'supa-item-1',
                name: 'Customer Selected Order',
                category: 'Main Course',
                price: Number(row.subtotal) || 280,
                quantity: 1,
                isVeg: true,
              },
            ],
            subtotal: Number(row.subtotal) || 280,
            deliveryFee: Number(row.delivery_fee) || 40,
            platformFee: Number(row.platform_fee) || 10,
            taxes: Number(row.taxes) || 18,
            discount: Number(row.discount) || 0,
            total: Number(row.total) || 348,
            paymentStatus: (row.payment_status || 'PAID') as any,
            paymentMethod: row.payment_method || 'UPI',
            status: (row.status || 'PAYMENT_CONFIRMED') as any,
            specialInstructions: row.special_instructions || '',
            pickupCode: row.pickup_code || Math.floor(1000 + Math.random() * 9000).toString(),
            createdAt: 'Just now',
            prepMinutes: row.prep_minutes || 18,
            prepTargetMinutes: 20,
            packagingDone: false,
            timeline: [
              { status: 'CREATED', title: 'Order Placed', description: 'Customer created order in database', time: 'Just now', completed: true },
              { status: 'PAYMENT_CONFIRMED', title: 'Payment Confirmed', description: 'Online payment captured', time: 'Just now', completed: true },
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
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const row = payload.new as any;
          if (!row) return;
          setOrders(prev =>
            prev.map(o => (o.id === row.id ? { ...o, status: row.status as any } : o))
          );
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [restaurant.newOrderSound]);

  const syncOrderToSupabase = async (orderId: string, status: OrderStatus) => {
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.from('orders').update({ status }).eq('id', orderId);
      }
    } catch (err) {
      console.warn('Supabase sync note:', err);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateRestaurant = (details: Partial<RestaurantDetails>) => {
    setRestaurant(prev => ({ ...prev, ...details }));
  };

  const updateDocument = (id: string, updates: Partial<VerificationDocument>) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc));
  };

  const submitDocumentsForVerification = () => {
    setDocuments(prev => prev.map(doc => ({ ...doc, status: 'UNDER_REVIEW' })));
    setRestaurant(prev => ({ ...prev, regStatus: 'UNDER_REVIEW' }));
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

  const toggleOnlineStatus = () => {
    if (restaurant.isOnline) {
      setIsOfflineModalOpen(true);
    } else {
      setRestaurant(prev => ({ ...prev, isOnline: true }));
      showToast('You are now ONLINE and accepting orders', 'success');
      if (restaurant.newOrderSound) soundEffects.playAcceptTone();
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
      pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
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

  const acceptOrder = (orderId: string) => {
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

    if (incomingOrder?.id === orderId) {
      setIncomingOrder(null);
    }
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(acceptedOrder);
    }

    if (restaurant.newOrderSound) soundEffects.playAcceptTone();
    showToast(`Order #${orderId} accepted. Start preparing!`, 'success');
    syncOrderToSupabase(orderId, 'RESTAURANT_ACCEPTED');
  };

  const rejectOrder = (orderId: string, reason: string) => {
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
    if (incomingOrder?.id === orderId) {
      setIncomingOrder(null);
    }
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }

    soundEffects.playRejectTone();
    showToast(`Order #${orderId} rejected: ${reason}`, 'warning');
    addNotification('Order Rejected', `Order #${orderId} rejected (${reason})`, 'ALERT');
    syncOrderToSupabase(orderId, 'RESTAURANT_REJECTED');
  };

  const startPreparingOrder = (orderId: string) => {
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
    syncOrderToSupabase(orderId, 'PREPARING');

    // Auto simulate rider assignment after 4 seconds
    setTimeout(() => {
      assignRider(orderId);
    }, 4000);
  };

  const assignRider = (orderId: string) => {
    const rider: DeliveryPartner = {
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
          riderAssignedAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'RIDER_ASSIGNED', title: 'Delivery Partner Assigned', description: 'Arun Kumar assigned (1.2 km away)', time: 'Just now', completed: true }
          ]
        };
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    addNotification('Delivery Partner Assigned', `Arun Kumar assigned to Order #${orderId}`, 'RIDER');
    showToast(`Delivery partner Arun Kumar assigned for #${orderId}`, 'info');
    syncOrderToSupabase(orderId, 'RIDER_ASSIGNED');
  };

  const markFoodReady = (orderId: string) => {
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
    syncOrderToSupabase(orderId, 'READY_FOR_PICKUP');
  };

  const markRiderArrived = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
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
    showToast(`Delivery partner Arun Kumar arrived for #${orderId}!`, 'info');
    addNotification('Delivery Partner Arrived', `Arun Kumar is at the counter for #${orderId}`, 'RIDER');
  };

  const verifyPickup = (orderId: string, enteredCode?: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    if (enteredCode && enteredCode !== order.pickupCode) {
      showToast('Incorrect Pickup OTP. Please check rider screen.', 'error');
      return false;
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
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
    syncOrderToSupabase(orderId, 'PICKUP_VERIFIED');
    return true;
  };

  const confirmHandover = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status: 'PICKED_UP',
          pickedUpAt: 'Just now',
          timeline: [
            ...o.timeline,
            { status: 'PICKED_UP', title: 'Handover Completed', description: 'Order handed over to Arun Kumar', time: 'Just now', completed: true }
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
    syncOrderToSupabase(orderId, 'PICKED_UP');
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
    syncOrderToSupabase(orderId, 'OUT_FOR_DELIVERY');
  };

  const markDelivered = (orderId: string) => {
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
    syncOrderToSupabase(orderId, 'DELIVERED');
  };

  // --- MENU ACTIONS ---

  const addMenuItem = (item: Omit<MenuItem, 'id' | 'rating' | 'votes'>) => {
    const newItem: MenuItem = {
      ...item,
      id: 'item-' + Date.now(),
      rating: 5.0,
      votes: 1,
    };
    setMenuItems(prev => [newItem, ...prev]);
    showToast(`"${newItem.name}" added to menu successfully`, 'success');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    showToast('Menu item updated successfully', 'success');
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    showToast('Menu item deleted', 'info');
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isAvailable;
        showToast(`"${item.name}" is now ${nextState ? 'IN STOCK' : 'OUT OF STOCK'}`, nextState ? 'success' : 'warning');
        return { ...item, isAvailable: nextState };
      }
      return item;
    }));
  };

  const duplicateMenuItem = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    const duplicated: MenuItem = {
      ...item,
      id: 'item-' + Date.now(),
      name: `${item.name} (Copy)`,
    };
    setMenuItems(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${item.name}"`, 'success');
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
