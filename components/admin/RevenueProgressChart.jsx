"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";

export default function RevenueProgressChart() {
    const { adminRequest } = useAdmin();
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("month");
    const [loading, setLoading] = useState(true);

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

    if (loading && data.length === 0) {
        return <div className="h-64 flex items-center justify-center">Loading Chart...</div>;
    }

    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
    const padding = 40;
    const width = 800;
    const height = 300;

    const points = data.map((d, i) => {
        const x = padding + (i * ((width - padding * 2) / (data.length > 1 ? data.length - 1 : 1)));
        const y = (height - padding) - (maxValue > 0 ? (d.value / maxValue) * (height - padding * 2) : 0);
        return { x, y };
    });

    const pathData = points.length > 1
        ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : "";

    const areaData = points.length > 1
        ? `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
        : "";

    return (
        <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-[#0a4019] italic">Revenue Progress</h2>
                    <p className="text-xs text-neutral-400 mt-1 font-medium">Growth trajectory since inception</p>
                </div>
                <div className="flex gap-2">
                    {["day", "month", "year"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-[#0a4019] text-[#d3d3d3]' : 'bg-[#F5F3F0]/50 text-neutral-400 hover:bg-[#F5F3F0]'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative h-[300px] w-full">
                {data.length > 0 ? (
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        {/* Area Fill */}
                        <path d={areaData} fill="url(#chartGradient)" />
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#d3d3d3" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#d3d3d3" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Line */}
                        <path d={pathData} fill="none" stroke="#0a4019" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

                        {/* Data Points */}
                        {points.map((p, i) => (
                            <g key={i} className="group cursor-pointer">
                                <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#0a4019" strokeWidth="2" className="transition-all group-hover:r-6" />
                                {/* Tooltip simulated */}
                                <title>{data[i].label}: {formatPrice(data[i].value)}</title>
                            </g>
                        ))}

                        {/* X Axis Labels (Reduced) */}
                        {data.map((d, i) => {
                            if (data.length > 10 && i % Math.ceil(data.length / 6) !== 0) return null;
                            return (
                                <text key={i} x={points[i].x} y={height - 10} textAnchor="middle" className="text-[10px] fill-neutral-400 font-bold uppercase tracking-tighter">
                                    {d.label}
                                </text>
                            );
                        })}
                    </svg>
                ) : (
                    <div className="flex items-center justify-center h-full text-neutral-300 italic">Insufficient data for range.</div>
                )}
            </div>
        </div>
    );
}
