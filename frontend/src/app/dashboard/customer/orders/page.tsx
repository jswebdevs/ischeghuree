"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import {
  ClipboardList,
  Loader2,
  Phone,
  MapPin,
  Truck,
  Sparkles,
  ChevronDown,
  ArrowRight,
  PackageCheck,
  ExternalLink,
} from "lucide-react";

type OrderStatus = "PENDING" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
type DeliveryStatus =
  | "PENDING"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

type OrderType = "RETAIL" | "WHOLESALE";

interface CustomOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  productDetails: string;
  quantity: number | null;
  orderType: OrderType;
  deliveryMethod: "PICKUP" | "MAILING";
  mailingAddress: string | null;
  notes: string | null;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  deliveryProvider: string | null;
  trackingUrl: string | null;
  deliveryNote: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  CONTACTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

const DELIVERY_STATUS_STYLE: Record<DeliveryStatus, string> = {
  PENDING: "bg-muted text-muted-foreground border-border",
  DISPATCHED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_TRANSIT: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  OUT_FOR_DELIVERY: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  RETURNED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

// Order of progression for the timeline. RETURNED/CANCELLED are terminal but
// not part of the happy path, so they're rendered separately when active.
const DELIVERY_TIMELINE: DeliveryStatus[] = [
  "PENDING",
  "DISPATCHED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  RETAIL: "খুচরা — Retail",
  WHOLESALE: "পাইকারী — Wholesale",
};

const DELIVERY_LABEL: Record<DeliveryStatus, string> = {
  PENDING: "Pending",
  DISPATCHED: "Dispatched",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/custom-orders/mine");
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-heading uppercase tracking-tight flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-primary" />
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Custom orders you&apos;ve submitted (matched by your email).
          </p>
        </div>
        <Link
          href="/order-now"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          New Order <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {orders.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center">
          <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-bold text-foreground mb-1">No orders yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            আপনার প্রথম কাস্টম অর্ডার দিন — submit your first custom order to see it here.
          </p>
          <Link
            href="/order-now"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:scale-105 transition-transform"
          >
            Place an order
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const expanded = expandedId === o.id;
            return (
              <div
                key={o.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : o.id)}
                  className="w-full text-left p-5 flex flex-wrap items-center gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-black text-primary">{o.orderNumber}</span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLE[o.status]}`}
                      >
                        {o.status.replace("_", " ")}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${DELIVERY_STATUS_STYLE[o.deliveryStatus]}`}
                        title="Delivery status"
                      >
                        <PackageCheck className="w-3 h-3" />
                        {DELIVERY_LABEL[o.deliveryStatus]}
                      </span>
                    </div>
                    <div className="text-sm text-foreground truncate">{o.productDetails}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1.5">
                        {o.deliveryMethod === "PICKUP" ? (
                          <>
                            <MapPin className="w-3 h-3" /> Pick up
                          </>
                        ) : (
                          <>
                            <Truck className="w-3 h-3" /> Delivery
                          </>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-primary">
                        <Sparkles className="w-3 h-3" /> {ORDER_TYPE_LABEL[o.orderType]}
                      </span>
                      {o.quantity != null && (
                        <span className="inline-flex items-center gap-1.5">Qty: {o.quantity}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-border bg-muted/10 space-y-5">
                    <DetailRow label="Phone" value={o.customerPhone} icon={<Phone className="w-3 h-3" />} />
                    {o.deliveryMethod === "MAILING" && o.mailingAddress && (
                      <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Delivery Address
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{o.mailingAddress}</p>
                      </div>
                    )}

                    <DeliveryPanel order={o} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground inline-flex items-center gap-1.5 min-w-[80px]">
        {icon} {label}:
      </span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function DeliveryPanel({ order }: { order: CustomOrder }) {
  const isHappyPath = DELIVERY_TIMELINE.includes(order.deliveryStatus);
  const currentIndex = isHappyPath ? DELIVERY_TIMELINE.indexOf(order.deliveryStatus) : -1;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">
          <PackageCheck className="w-3.5 h-3.5" /> Delivery
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${DELIVERY_STATUS_STYLE[order.deliveryStatus]}`}
        >
          {DELIVERY_LABEL[order.deliveryStatus]}
        </span>
      </div>

      {isHappyPath ? (
        <ol className="relative grid grid-cols-5 gap-1">
          {DELIVERY_TIMELINE.map((step, i) => {
            const reached = i <= currentIndex;
            return (
              <li key={step} className="flex flex-col items-center text-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${reached ? "bg-primary border-primary" : "bg-card border-border"}`}
                />
                <span
                  className={`mt-2 text-[9px] font-bold uppercase tracking-widest ${reached ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {DELIVERY_LABEL[step]}
                </span>
                {i < DELIVERY_TIMELINE.length - 1 && (
                  <span
                    className={`absolute top-[5px] h-0.5 ${reached && i < currentIndex ? "bg-primary" : "bg-border"}`}
                    style={{
                      left: `calc(${(i / (DELIVERY_TIMELINE.length - 1)) * 100}% + 6px)`,
                      width: `calc(${100 / (DELIVERY_TIMELINE.length - 1)}% - 12px)`,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">
          {order.deliveryStatus === "RETURNED"
            ? "This parcel was returned to the sender."
            : "This delivery has been cancelled."}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {order.deliveryProvider && (
          <div>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
              Carrier
            </div>
            <p className="text-foreground font-medium">{order.deliveryProvider}</p>
          </div>
        )}
        {order.trackingUrl && (
          <div>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
              Tracking
            </div>
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
            >
              Track parcel <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
        {order.deliveredAt && order.deliveryStatus === "DELIVERED" && (
          <div>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
              Delivered
            </div>
            <p className="text-foreground font-medium">{new Date(order.deliveredAt).toLocaleString()}</p>
          </div>
        )}
      </div>

      {order.deliveryNote && (
        <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-3">
          {order.deliveryNote}
        </p>
      )}
    </div>
  );
}
