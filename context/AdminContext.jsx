"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AdminContext = createContext();

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const AdminProvider = ({ children }) => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        monthlyStats: []
    });

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [banners, setBanners] = useState([]);
    const [settings, setSettings] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [supportTickets, setSupportTickets] = useState([]);
    const [newsletter, setNewsletter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const publicFetch = [
                fetch(`${API_URL}/products`, { cache: 'no-store' }),
                fetch(`${API_URL}/categories`, { cache: 'no-store' }),
                fetch(`${API_URL}/banners`, { cache: 'no-store' }),
                fetch(`${API_URL}/settings`, { cache: 'no-store' })
            ];

            const [resProd, resCat, resBan, resSet] = await Promise.all(publicFetch);

            const dataProd = await resProd.json();
            if (dataProd.success) setProducts(dataProd.data);

            const dataCat = await resCat.json();
            if (dataCat.success) setCategories(dataCat.data);

            const dataBan = await resBan.json();
            if (dataBan.success) setBanners(dataBan.data);

            const dataSet = await resSet.json();
            if (dataSet.success) setSettings(dataSet.data);

            if (token) {
                const fetchAdminData = [
                    fetch(`${API_URL}/orders`, { ...config, cache: 'no-store' }),
                    fetch(`${API_URL}/users`, { ...config, cache: 'no-store' }),
                    fetch(`${API_URL}/reviews`, { ...config, cache: 'no-store' }),
                    fetch(`${API_URL}/coupons`, { ...config, cache: 'no-store' }),
                    fetch(`${API_URL}/stats/dashboard`, { ...config, cache: 'no-store' }),
                    fetch(`${API_URL}/audit`, { ...config, cache: 'no-store' }),
                    fetch(`${API_URL}/support-tickets`, { ...config, cache: 'no-store' }),
                    fetch(`${API_URL}/newsletter`, { ...config, cache: 'no-store' })
                ];

                const [resOrders, resUsers, resReviews, resCoupons, resStats, resAudit, resSup, resNews] = await Promise.all(fetchAdminData);

                const dOrders = await resOrders.json();
                if (dOrders.success) setOrders(dOrders.data);

                const dUsers = await resUsers.json();
                if (dUsers.success) setCustomers(dUsers.data);

                const dReviews = await resReviews.json();
                if (dReviews.success) setReviews(dReviews.data);

                const dCoupons = await resCoupons.json();
                if (dCoupons.success) setCoupons(dCoupons.data);

                const dStats = await resStats.json();
                if (dStats.success) setStats(dStats.data);

                const dAudit = await resAudit.json();
                if (dAudit.success) setAuditLogs(dAudit.data);

                const dSup = await resSup.json();
                if (dSup.success) setSupportTickets(dSup.data);

                const dNews = await resNews.json();
                if (dNews.success) setNewsletter(dNews.data);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setError(error.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const adminRequest = async (url, method = 'GET', body = null) => {
        const token = localStorage.getItem('token');
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(`${API_URL}${url}`, options);
        return await res.json();
    };

    // Actions
    const addProduct = async (product) => {
        const data = await adminRequest('/products', 'POST', product);
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const updateProduct = async (id, updatedData) => {
        const data = await adminRequest(`/products/${id}`, 'PUT', updatedData);
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const deleteProduct = async (id) => {
        const data = await adminRequest(`/products/${id}`, 'DELETE');
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const addCategory = async (cat) => {
        const data = await adminRequest('/categories', 'POST', cat);
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const updateOrderStatus = async (id, status) => {
        const data = await adminRequest(`/orders/${id}/status`, 'PUT', { status });
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const updateReview = async (id, adminReply) => {
        const data = await adminRequest(`/reviews/${id}`, 'PUT', { adminReply });
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const updateSettings = async (body) => {
        const data = await adminRequest('/settings', 'PUT', body);
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const addBanner = async (banner) => {
        const data = await adminRequest('/banners', 'POST', banner);
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const deleteBanner = async (id) => {
        const data = await adminRequest(`/banners/${id}`, 'DELETE');
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const updateTicket = async (id, body) => {
        const data = await adminRequest(`/support-tickets/${id}`, 'PUT', body);
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const addCoupon = async (coupon) => {
        const data = await adminRequest('/coupons', 'POST', coupon);
        if (data.success) { fetchData(); return true; }
        return false;
    };

    const deleteCoupon = async (id) => {
        const data = await adminRequest(`/coupons/${id}`, 'DELETE');
        if (data.success) { fetchData(); return true; }
        return false;
    };

    return (
        <AdminContext.Provider
            value={{
                stats, products, categories, orders, reviews, customers, coupons,
                banners, settings, auditLogs, supportTickets, newsletter,
                addProduct, updateProduct, deleteProduct, addCategory,
                updateOrderStatus, updateReview, updateSettings, addBanner,
                deleteBanner, updateTicket, addCoupon, deleteCoupon,
                loading, error, refreshData: fetchData
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
