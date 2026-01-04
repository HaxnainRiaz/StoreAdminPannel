"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    // --- MOCK DATA INITIALIZATION ---

    // 1. Dashboard Stats (Mock)
    const [stats, setStats] = useState({
        revenue: 45290.00,
        orders: 128,
        avgOrderValue: 353.82,
        refunds: 1250.00,
        visitors: 12540,
        reviewScore: 4.9,
    });

    // 2. Products (Expanded)
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Radiant Glow Face Oil",
            price: 85,
            salePrice: null,
            stock: 45,
            category: "Face",
            status: "Published",
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
            ingredients: ["Jojoba Oil", "Rosehip", "Vitamin E"],
            concerns: ["Dryness", "Dullness"],
            slug: "radiant-glow-face-oil",
            metaTitle: "Radiant Glow Face Oil | Luminelle",
            metaDescription: "Restore your skin's natural radiance."
        },
        {
            id: 2,
            name: "Silk Peptide Cream",
            price: 92,
            salePrice: 85,
            stock: 12,
            category: "Face",
            status: "Low Stock", // Logic will handle this view, data can be 'Published'
            image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=200",
            ingredients: ["Peptides", "Hyaluronic Acid"],
            concerns: ["Aging", "Fine Lines"],
            slug: "silk-peptide-cream",
            metaTitle: "Silk Peptide Cream | Luminelle",
            metaDescription: "Smooth and firm your skin."
        },
        {
            id: 3,
            name: "Luminous Eye Serum",
            price: 64,
            salePrice: null,
            stock: 0,
            category: "Eyes",
            status: "Out of Stock",
            image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=200",
            ingredients: ["Caffeine", "Green Tea"],
            concerns: ["Dark Circles", "Puffiness"],
            slug: "luminous-eye-serum",
            metaTitle: "Luminous Eye Serum | Luminelle",
            metaDescription: "Brighten your eyes instantly."
        },
        {
            id: 4,
            name: "Purifying Clay Mask",
            price: 55,
            salePrice: null,
            stock: 88,
            category: "Face",
            status: "Published",
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200",
            ingredients: ["Kaolin Clay", "Aloe Vera"],
            concerns: ["Acne", "Oily Skin"],
            slug: "purifying-clay-mask",
            metaTitle: "Purifying Clay Mask | Luminelle",
            metaDescription: "Deep cleanse for clear skin."
        },
    ]);

    // 3. Orders (Expanded)
    const [orders, setOrders] = useState([
        {
            id: "#ORD-7782",
            customer: "Elena Fisher",
            customerId: 101,
            email: "elena@example.com",
            date: "2024-01-03",
            total: 177.00,
            status: "Pending", // Pipeline: Pending -> Processing -> Shipped -> Delivered -> Cancelled/Refunded
            paymentStatus: "Paid",
            items: ["Radiant Glow Face Oil", "Silk Peptide Cream"],
            shippingAddress: "123 Maple Ave, NY",
            billingAddress: "123 Maple Ave, NY"
        },
        {
            id: "#ORD-7781",
            customer: "Marcus Thorne",
            customerId: 102,
            email: "marcust@example.com",
            date: "2024-01-02",
            total: 85.00,
            status: "Shipped",
            paymentStatus: "Paid",
            items: ["Silk Peptide Cream"],
            shippingAddress: "456 Oak Dr, CA",
            billingAddress: "456 Oak Dr, CA"
        },
        {
            id: "#ORD-7780",
            customer: "Sarah Jenkins",
            customerId: 103,
            email: "sarah.j@example.com",
            date: "2024-01-01",
            total: 210.50,
            status: "Delivered",
            paymentStatus: "Paid",
            items: ["Luminous Eye Serum", "Purifying Clay Mask", "Radiant Glow Face Oil"],
            shippingAddress: "789 Pine Ln, TX",
            billingAddress: "789 Pine Ln, TX"
        },
    ]);

    // 4. Customers
    const [customers, setCustomers] = useState([
        { id: 101, name: "Elena Fisher", email: "elena@example.com", totalSpent: 177.00, ordersCount: 1, notes: "VIP client potential.", status: "Active" },
        { id: 102, name: "Marcus Thorne", email: "marcust@example.com", totalSpent: 85.00, ordersCount: 1, notes: "", status: "Active" },
        { id: 103, name: "Sarah Jenkins", email: "sarah.j@example.com", totalSpent: 450.50, ordersCount: 3, notes: "Returns frequently.", status: "Flagged" },
    ]);

    // 5. Reviews
    const [reviews, setReviews] = useState([
        {
            id: 1,
            customer: "Alice M.",
            rating: 5,
            title: "Absolutely amazing!",
            content: "Changed my skin texture in just one week.",
            status: "Approved",
            product: "Radiant Glow Face Oil",
            date: "2024-01-02",
            reply: ""
        },
        {
            id: 2,
            customer: "John D.",
            rating: 4,
            title: "Good, but pricey",
            content: "Love the smell, but the bottle is small.",
            status: "Pending",
            product: "Silk Peptide Cream",
            date: "2024-01-03",
            reply: ""
        },
    ]);

    // 6. Support Tickets
    const [tickets, setTickets] = useState([
        { id: "MX-99", subject: "Shipping Delay", customer: "Elena Fisher", status: "Open", date: "2024-01-04", priority: "High" },
        { id: "MX-92", subject: "Product Question", customer: "Marcus Thorne", status: "Resolved", date: "2023-12-28", priority: "Low" },
    ]);

    // 7. Discounts/Coupons
    const [discounts, setDiscounts] = useState([
        { id: 1, code: "WELCOME10", type: "percent", value: 10, minSpend: 50, expiry: "2025-12-31", usageCount: 45 },
        { id: 2, code: "FSHO", type: "flat", value: 15, minSpend: 100, expiry: "2024-06-01", usageCount: 12 },
    ]);

    // 8. CMS / Content
    const [cms, setCms] = useState({
        announcement: "Free Shipping on Orders Over $75",
        heroHeadline: "Redefining Natural Luxury",
        heroSubheadline: "Clinically proven, organic skincare for the modern era.",
        sections: {
            featuredProducts: true,
            blog: true,
            newsletter: true
        }
    });

    // 9. Audit Logs
    const [auditLogs, setAuditLogs] = useState([
        { id: 1011, action: "Order Status Update", details: "Order #ORD-7781 Shipped", admin: "Admin", timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 1012, action: "Product Price Change", details: "Silk Peptide Cream price updated", admin: "Super Admin", timestamp: new Date(Date.now() - 172800000).toISOString() },
    ]);

    // 10. Admin User Session (Simulated)
    const [currentUser, setCurrentUser] = useState({
        name: "Hasnain",
        role: "super-admin", // super-admin, admin, editor, support
        email: "admin@luminelle.com",
        avatar: "https://ui-avatars.com/api/?name=Hasnain&background=0B2F26&color=fff"
    });

    // --- HELPER FOR AUDIT ---
    const logAction = (action, details) => {
        const newLog = {
            id: Date.now(),
            action,
            details,
            admin: currentUser.name,
            timestamp: new Date().toISOString()
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    // --- ACTIONS ---

    // Products
    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now(), stock: Number(product.stock), price: Number(product.price) };
        setProducts((prev) => [newProduct, ...prev]);
        logAction("Create Product", `Created ${product.name}`);
    };

    const updateProduct = (id, updatedData) => {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
        logAction("Update Product", `Updated product ID ${id}`);
    };

    const deleteProduct = (id) => {
        const prod = products.find(p => p.id === id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        logAction("Delete Product", `Deleted ${prod?.name || id}`);
    };

    // Orders
    const updateOrderStatus = (id, status) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        logAction("Update Order", `Order ${id} status to ${status}`);
    };

    // Reviews
    const approveReview = (id) => {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));
        logAction("Review Approved", `Review ID ${id} approved`);
    };

    const rejectReview = (id) => {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r)));
        logAction("Review Rejected", `Review ID ${id} rejected`);
    };

    const replyToReview = (id, reply) => {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply } : r)));
        logAction("Review Reply", `Replied to review ID ${id}`);
    };

    // Customers
    const updateCustomerNotes = (id, note) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, notes: note } : c));
        logAction("Customer Update", `Updated notes for Customer ID ${id}`);
    };

    // CMS
    const updateCms = (key, value) => {
        setCms(prev => ({ ...prev, [key]: value }));
        logAction("CMS Update", `Updated ${key}`);
    };

    const toggleSection = (sectionName) => {
        setCms(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionName]: !prev.sections[sectionName]
            }
        }));
        logAction("CMS Toggle", `Toggled ${sectionName}`);
    };

    // Discounts
    const addDiscount = (discount) => {
        const newDiscount = { ...discount, id: Date.now(), usageCount: 0 };
        setDiscounts(prev => [newDiscount, ...prev]);
        logAction("Create Discount", `Created code ${discount.code}`);
    };

    const deleteDiscount = (id) => {
        const disc = discounts.find(d => d.id === id);
        setDiscounts(prev => prev.filter(d => d.id !== id));
        logAction("Delete Discount", `Deleted code ${disc?.code || id}`);
    };

    // Support
    const updateTicketStatus = (id, status) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        logAction("Support Update", `Ticket ${id} marked as ${status}`);
    };

    return (
        <AdminContext.Provider
            value={{
                currentUser,
                stats,
                products,
                orders,
                reviews,
                customers,
                tickets,
                discounts,
                cms,
                auditLogs,
                addProduct,
                updateProduct,
                deleteProduct,
                updateOrderStatus,
                approveReview,
                rejectReview,
                replyToReview,
                updateCustomerNotes,
                updateCms,
                toggleSection,
                addDiscount,
                deleteDiscount,
                updateTicketStatus,
                logAction
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
