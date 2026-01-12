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
            // Parallel fetching of all required data
            const [
                prodRes, statsRes, ordersRes, custRes, ticketRes,
                settingsRes, auditRes, catRes, couponRes, bannerRes,
                reviewRes, newsRes, blogRes
            ] = await Promise.all([
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

            if (prodRes?.success) setProducts(prodRes.data);
            if (statsRes?.success) setStats(statsRes.data);
            if (ordersRes?.success) setOrders(ordersRes.data);
            if (custRes?.success) setCustomers(custRes.data);
            if (ticketRes?.success) setSupportTickets(ticketRes.data);
            if (settingsRes?.success) setSettings(settingsRes.data);
            if (auditRes?.success) setAuditLogs(auditRes.data);
            if (catRes?.success) setCategories(catRes.data);
            if (couponRes?.success) setCoupons(couponRes.data);
            if (bannerRes?.success) setBanners(bannerRes.data);
            if (reviewRes?.success) setReviews(reviewRes.data);
            if (newsRes?.success) setNewsletter(newsRes.data);
            if (blogRes?.success) setBlogs(blogRes.data);

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

    // Action wrappers that update state manually
    const addProduct = async (product) => {
        const res = await adminRequest('/products', 'POST', product);
        if (res?.success) {
            setProducts(prev => [res.data, ...prev]);
        }
        return res;
    };

    const updateProduct = async (id, updatedData) => {
        const res = await adminRequest(`/products/${id}`, 'PUT', updatedData);
        if (res?.success) {
            setProducts(prev => prev.map(p => p._id === id ? res.data : p));
        }
        return res;
    };

    const deleteProduct = async (id) => {
        const res = await adminRequest(`/products/${id}`, 'DELETE');
        if (res?.success) {
            setProducts(prev => prev.filter(p => p._id !== id));
        }
        return res;
    };

    const addBlog = async (blog) => {
        const res = await adminRequest('/blogs', 'POST', blog);
        if (res?.success) {
            setBlogs(prev => [res.data, ...prev]);
        }
        return res;
    };

    const updateBlog = async (id, updatedData) => {
        const res = await adminRequest(`/blogs/${id}`, 'PUT', updatedData);
        if (res?.success) {
            setBlogs(prev => prev.map(b => b._id === id ? res.data : b));
        }
        return res;
    };

    const deleteBlog = async (id) => {
        const res = await adminRequest(`/blogs/${id}`, 'DELETE');
        if (res?.success) {
            setBlogs(prev => prev.filter(b => b._id !== id));
        }
        return res;
    };

    const updateOrderStatus = async (id, status) => {
        const previousOrders = [...orders];

        // Optimistic Update
        setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));

        const res = await adminRequest(`/orders/${id}/status`, 'PUT', { status });

        if (res?.success) {
            // Confirm with server data
            setOrders(prev => prev.map(o => o._id === id ? res.data : o));
        } else {
            // Revert on failure
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
        const res = await adminRequest('/settings', 'PUT', body);
        if (res?.success) {
            setSettings(res.data);
        }
        return res;
    };

    const addCategory = async (cat) => {
        const res = await adminRequest('/categories', 'POST', cat);
        if (res?.success) {
            setCategories(prev => [res.data, ...prev]);
        }
        return res;
    };

    const addBanner = async (banner) => {
        const res = await adminRequest('/banners', 'POST', banner);
        if (res?.success) {
            setBanners(prev => [res.data, ...prev]);
        }
        return res;
    };

    const deleteBanner = async (id) => {
        const res = await adminRequest(`/banners/${id}`, 'DELETE');
        if (res?.success) {
            setBanners(prev => prev.filter(b => b._id !== id));
        }
        return res;
    };

    const updateTicket = async (id, body) => {
        const res = await adminRequest(`/support-tickets/${id}`, 'PUT', body);
        if (res?.success) {
            setSupportTickets(prev => prev.map(t => t._id === id ? res.data : t));
        }
        return res;
    };

    const updateTicketStatus = async (id, status) => {
        return await updateTicket(id, { status });
    };

    const updateReview = async (id, body) => {
        const res = await adminRequest(`/reviews/${id}`, 'PUT', body);
        if (res?.success) {
            setReviews(prev => prev.map(r => r._id === id ? res.data : r));
        }
        return res;
    };

    const addCoupon = async (c) => {
        const res = await adminRequest('/coupons', 'POST', c);
        if (res?.success) {
            setCoupons(prev => [res.data, ...prev]);
        }
        return res;
    };

    const deleteCoupon = async (id) => {
        const res = await adminRequest(`/coupons/${id}`, 'DELETE');
        if (res?.success) {
            setCoupons(prev => prev.filter(c => c._id !== id));
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
                updateOrderStatus, updateSettings, replyToTicket, updateTicketStatus,
                addCategory, addBanner, deleteBanner, updateTicket, updateReview,
                addCoupon, deleteCoupon, adminRequest,
                loading, error, refreshData: fetchData
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
