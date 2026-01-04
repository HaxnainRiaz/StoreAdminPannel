import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatsCard({ title, value, trend }) {
    const isPositive = trend && trend > 0;

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-beige shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="flex flex-col">
                <span className="text-neutral-gray text-xs uppercase tracking-wider mb-2">{title}</span>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-heading text-primary font-bold">
                        {value}
                    </h3>
                    {trend && (
                        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            <span>{Math.abs(trend)}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
