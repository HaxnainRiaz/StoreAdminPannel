"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AdminContext = createContext();

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const AdminProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for all data
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [supportTickets, setSupportTickets] = useState([]);
    const [settings, setSettings] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [banners, setBanners] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newsletter, setNewsletter] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setToken(storedToken);
    }, []);

    const adminRequest = useCallback(async (url, method = 'GET', body = null) => {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) return null;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentToken}`
            }
        };
        if (body) options.body = JSON.stringify(body);

        try {
            const res = await fetch(`${API_URL}${url}`, options);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error(`Request failed: ${url}`, err);
            return { success: false, message: 'Server connection failed' };
        }
    }, []);

    const fetchData = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Parallel fetching using allSettled to prevent one failure from blocking all data
            const results = await Promise.allSettled([
                adminRequest('/products'),
                adminRequest('/stats/dashboard'),
                adminRequest('/orders'),
                adminRequest('/users'),
                adminRequest('/support-tickets'),
                adminRequest('/settings'),
                adminRequest('/audit'),
                adminRequest('/categories'),
                adminRequest('/coupons'),
                adminRequest('/banners'),
                adminRequest('/reviews'),
                adminRequest('/newsletter'),
                adminRequest('/blogs')
            ]);

            const [
                prodRes, statsRes, ordersRes, custRes, ticketRes,
                settingsRes, auditRes, catRes, couponRes, bannerRes,
                reviewRes, newsRes, blogRes
            ] = results;

            if (prodRes.status === 'fulfilled' && prodRes.value?.success) setProducts(prodRes.value.data);
            if (statsRes.status === 'fulfilled' && statsRes.value?.success) setStats(statsRes.value.data);
            if (ordersRes.status === 'fulfilled' && ordersRes.value?.success) setOrders(ordersRes.value.data);
            if (custRes.status === 'fulfilled' && custRes.value?.success) setCustomers(custRes.value.data);
            if (ticketRes.status === 'fulfilled' && ticketRes.value?.success) setSupportTickets(ticketRes.value.data);
            if (settingsRes.status === 'fulfilled' && settingsRes.value?.success) setSettings(settingsRes.value.data);
            if (auditRes.status === 'fulfilled' && auditRes.value?.success) setAuditLogs(auditRes.value.data);
            if (catRes.status === 'fulfilled' && catRes.value?.success) setCategories(catRes.value.data);
            if (couponRes.status === 'fulfilled' && couponRes.value?.success) setCoupons(couponRes.value.data);
            if (bannerRes.status === 'fulfilled' && bannerRes.value?.success) setBanners(bannerRes.value.data);
            if (reviewRes.status === 'fulfilled' && reviewRes.value?.success) setReviews(reviewRes.value.data);
            if (newsRes.status === 'fulfilled' && newsRes.value?.success) setNewsletter(newsRes.value.data);
            if (blogRes.status === 'fulfilled' && blogRes.value?.success) setBlogs(blogRes.value.data);

        } catch (err) {
            console.error("Error fetching admin data:", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [token, adminRequest]);

    useEffect(() => {
        if (token) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [token, fetchData]);

    // --- Action Wrappers with Optimistic Updates ---

    const addProduct = async (product) => {
        const res = await adminRequest('/products', 'POST', product);
        if (res?.success) {
            setProducts(prev => [res.data, ...prev]);
        }
        return res;
    };

    const updateProduct = async (id, updatedData) => {
        // Optimistic Update
        const prevProducts = [...products];
        setProducts(prev => prev.map(p => p._id === id ? { ...p, ...updatedData } : p));

        const res = await adminRequest(`/products/${id}`, 'PUT', updatedData);
        if (res?.success) {
            setProducts(prev => prev.map(p => p._id === id ? res.data : p));
        } else {
            setProducts(prevProducts); // Revert
        }
        return res;
    };

    const deleteProduct = async (id) => {
        const prevProducts = [...products];
        // Optimistic Delete
        setProducts(prev => prev.filter(p => p._id !== id));

        const res = await adminRequest(`/products/${id}`, 'DELETE');
        if (!res?.success) {
            setProducts(prevProducts); // Revert
        }
        return res;
    };

    const updateCustomer = async (id, updatedData) => {
        const prevCustomers = [...customers];
        setCustomers(prev => prev.map(c => c._id === id ? { ...c, ...updatedData } : c));

        const res = await adminRequest(`/users/${id}`, 'PUT', updatedData);
        if (res?.success) {
            setCustomers(prev => prev.map(c => c._id === id ? res.data : c));
        } else {
            setCustomers(prevCustomers);
        }
        return res;
    };

    const addBlog = async (blog) => {
        const res = await adminRequest('/blogs', 'POST', blog);
        if (res?.success) setBlogs(prev => [res.data, ...prev]);
        return res;
    };

    const updateBlog = async (id, updatedData) => {
        const prevBlogs = [...blogs];
        setBlogs(prev => prev.map(b => b._id === id ? { ...b, ...updatedData } : b));

        const res = await adminRequest(`/blogs/${id}`, 'PUT', updatedData);
        if (res?.success) {
            setBlogs(prev => prev.map(b => b._id === id ? res.data : b));
        } else {
            setBlogs(prevBlogs);
        }
        return res;
    };

    const deleteBlog = async (id) => {
        const prevBlogs = [...blogs];
        setBlogs(prev => prev.filter(b => b._id !== id));

        const res = await adminRequest(`/blogs/${id}`, 'DELETE');
        if (!res?.success) {
            setBlogs(prevBlogs);
        }
        return res;
    };

    const updateOrderStatus = async (id, status) => {
        const previousOrders = [...orders];
        setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));

        const res = await adminRequest(`/orders/${id}/status`, 'PUT', { status });
        if (res?.success) {
            setOrders(prev => prev.map(o => o._id === id ? res.data : o));
        } else {
            setOrders(previousOrders);
        }
        return res;
    };

    const replyToTicket = async (id, message) => {
        const res = await adminRequest(`/support-tickets/${id}/reply`, 'POST', { message });
        if (res?.success) {
            setSupportTickets(prev => prev.map(t => t._id === id ? res.data : t));
        }
        return res;
    };

    const updateSettings = async (body) => {
        const prevSettings = settings;
        setSettings(prev => ({ ...prev, ...body }));

        const res = await adminRequest('/settings', 'PUT', body);
        if (res?.success) {
            setSettings(res.data);
        } else {
            setSettings(prevSettings);
        }
        return res;
    };

    const addCategory = async (cat) => {
        const res = await adminRequest('/categories', 'POST', cat);
        if (res?.success) setCategories(prev => [res.data, ...prev]);
        return res;
    };

    const updateCategory = async (id, updatedData) => {
        const prevCategories = [...categories];
        setCategories(prev => prev.map(c => c._id === id ? { ...c, ...updatedData } : c));

        const res = await adminRequest(`/categories/${id}`, 'PUT', updatedData);
        if (res?.success) {
            setCategories(prev => prev.map(c => c._id === id ? res.data : c));
        } else {
            setCategories(prevCategories);
        }
        return res;
    };

    const deleteCategory = async (id) => {
        const prevCategories = [...categories];
        setCategories(prev => prev.filter(c => c._id !== id));

        const res = await adminRequest(`/categories/${id}`, 'DELETE');
        if (!res?.success) {
            setCategories(prevCategories);
        }
        return res;
    };

    const addBanner = async (banner) => {
        const res = await adminRequest('/banners', 'POST', banner);
        if (res?.success) setBanners(prev => [res.data, ...prev]);
        return res;
    };

    const deleteBanner = async (id) => {
        const prevBanners = [...banners];
        setBanners(prev => prev.filter(b => b._id !== id));

        const res = await adminRequest(`/banners/${id}`, 'DELETE');
        if (!res?.success) {
            setBanners(prevBanners);
        }
        return res;
    };

    const updateTicket = async (id, body) => {
        const prevTickets = [...supportTickets];
        setSupportTickets(prev => prev.map(t => t._id === id ? { ...t, ...body } : t));

        const res = await adminRequest(`/support-tickets/${id}`, 'PUT', body);
        if (res?.success) {
            setSupportTickets(prev => prev.map(t => t._id === id ? res.data : t));
        } else {
            setSupportTickets(prevTickets);
        }
        return res;
    };

    const updateTicketStatus = async (id, status) => {
        return await updateTicket(id, { status });
    };

    const updateReview = async (id, body) => {
        const prevReviews = [...reviews];
        setReviews(prev => prev.map(r => r._id === id ? { ...r, ...body } : r));

        const res = await adminRequest(`/reviews/${id}`, 'PUT', body);
        if (res?.success) {
            setReviews(prev => prev.map(r => r._id === id ? res.data : r));
        } else {
            setReviews(prevReviews);
        }
        return res;
    };

    const addCoupon = async (c) => {
        const res = await adminRequest('/coupons', 'POST', c);
        if (res?.success) setCoupons(prev => [res.data, ...prev]);
        return res;
    };

    const deleteCoupon = async (id) => {
        const prevCoupons = [...coupons];
        setCoupons(prev => prev.filter(c => c._id !== id));

        const res = await adminRequest(`/coupons/${id}`, 'DELETE');
        if (!res?.success) {
            setCoupons(prevCoupons);
        }
        return res;
    };


    return (
        <AdminContext.Provider
            value={{
                stats, products, categories, orders, reviews, customers, coupons,
                banners, settings, auditLogs, supportTickets, newsletter, blogs,
                addProduct, updateProduct, deleteProduct,
                addBlog, updateBlog, deleteBlog,
                updateCustomer,
                updateOrderStatus, updateSettings, replyToTicket, updateTicketStatus,
                addCategory, updateCategory, deleteCategory, addBanner, deleteBanner, updateTicket, updateReview,
                addCoupon, deleteCoupon, adminRequest,
                loading, error, refreshData: fetchData
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
