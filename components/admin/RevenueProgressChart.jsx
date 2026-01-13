"use client";

import { useEffect, useState, useRef } from "react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";

export default function RevenueProgressChart() {
    const { adminRequest } = useAdmin();
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("day");
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 800, height: 300 });
    const containerRef = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await adminRequest(`/stats/progress?filter=${filter}`);
            if (res && res.success) {
                setData(res.data);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    // Handle responsive sizing
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const isMobile = window.innerWidth < 768;
                setDimensions({
                    width: Math.max(containerWidth, isMobile ? 600 : 800),
                    height: isMobile ? 250 : 300
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    if (loading && data.length === 0) {
        return <div className="h-64 flex items-center justify-center">Loading Chart...</div>;
    }

    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
    const minValue = data.length > 0 ? Math.min(...data.map(d => d.value)) : 0;

    // Dynamic padding based on screen size
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const leftPadding = filter === "day" ? (isMobile ? 50 : 70) : (isMobile ? 30 : 40);
    const rightPadding = isMobile ? 15 : 20;
    const topPadding = isMobile ? 15 : 20;
    const bottomPadding = isMobile ? 30 : 40;

    const { width, height } = dimensions;

    // Calculate Y-axis ticks for price ranges (only for daily view)
    const getYAxisTicks = () => {
        if (filter !== "day" || maxValue === 0) return [];

        const numTicks = isMobile ? 4 : 5;
        const range = maxValue - minValue;
        const step = range / (numTicks - 1);

        return Array.from({ length: numTicks }, (_, i) => {
            const value = minValue + (step * i);
            return {
                value,
                y: (height - bottomPadding) - ((value - minValue) / range) * (height - topPadding - bottomPadding)
            };
        }).reverse();
    };

    const yAxisTicks = getYAxisTicks();

    const points = data.map((d, i) => {
        const x = leftPadding + (i * ((width - leftPadding - rightPadding) / (data.length > 1 ? data.length - 1 : 1)));
        const normalizedValue = maxValue > minValue ? (d.value - minValue) / (maxValue - minValue) : 0.5;
        const y = (height - bottomPadding) - (normalizedValue * (height - topPadding - bottomPadding));
        return { x, y };
    });

    const pathData = points.length > 1
        ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : "";

    const areaData = points.length > 1
        ? `${pathData} L ${points[points.length - 1].x} ${height - bottomPadding} L ${points[0].x} ${height - bottomPadding} Z`
        : "";

    return (
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold text-[#0a4019] italic">Revenue Progress</h2>
                    <p className="text-xs text-neutral-400 mt-1 font-medium">Growth trajectory since inception</p>
                </div>
                <div className="flex gap-2">
                    {["day", "month", "year"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-[#0a4019] text-[#d3d3d3]' : 'bg-[#F5F3F0]/50 text-neutral-400 hover:bg-[#F5F3F0]'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div ref={containerRef} className="relative h-[250px] md:h-[300px] w-full overflow-x-auto">
                {data.length > 0 ? (
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* Y-axis grid lines and labels (only for daily view) */}
                        {filter === "day" && yAxisTicks.map((tick, i) => (
                            <g key={i}>
                                {/* Grid line */}
                                <line
                                    x1={leftPadding}
                                    y1={tick.y}
                                    x2={width - rightPadding}
                                    y2={tick.y}
                                    stroke="#F5F3F0"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                {/* Y-axis label */}
                                <text
                                    x={leftPadding - 10}
                                    y={tick.y}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                    className="text-[8px] md:text-[10px] fill-neutral-400 font-bold"
                                >
                                    {formatPrice(tick.value)}
                                </text>
                            </g>
                        ))}

                        {/* Area Fill */}
                        <path d={areaData} fill="url(#chartGradient)" />
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#d3d3d3" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#d3d3d3" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Line */}
                        <path d={pathData} fill="none" stroke="#0a4019" strokeWidth={isMobile ? "2" : "3"} strokeLinejoin="round" strokeLinecap="round" />

                        {/* Data Points */}
                        {points.map((p, i) => (
                            <g key={i} className="group cursor-pointer">
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={isMobile ? "3" : "4"}
                                    fill="white"
                                    stroke="#0a4019"
                                    strokeWidth="2"
                                    className="transition-all group-hover:r-6"
                                />
                                {/* Tooltip simulated */}
                                <title>{data[i].label}: {formatPrice(data[i].value)}</title>
                            </g>
                        ))}

                        {/* X Axis Labels (Reduced for mobile) */}
                        {data.map((d, i) => {
                            const skipFactor = isMobile ? Math.ceil(data.length / 4) : Math.ceil(data.length / 6);
                            if (data.length > 10 && i % skipFactor !== 0) return null;
                            return (
                                <text
                                    key={i}
                                    x={points[i].x}
                                    y={height - 10}
                                    textAnchor="middle"
                                    className="text-[8px] md:text-[10px] fill-neutral-400 font-bold uppercase tracking-tighter"
                                >
                                    {d.label}
                                </text>
                            );
                        })}
                    </svg>
                ) : (
                    <div className="flex items-center justify-center h-full text-neutral-300 italic text-sm">Insufficient data for range.</div>
                )}
            </div>
        </div>
    );
}
