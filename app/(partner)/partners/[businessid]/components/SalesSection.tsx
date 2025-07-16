'use client';

import React, { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    YAxis,
    Tooltip,
    ReferenceLine,
} from 'recharts';


const barData = [
    { month: 'Jan', sales: 1200 },
    { month: 'Feb', sales: 2100 },
    { month: 'Mar', sales: 800 },
    { month: 'Apr', sales: 1600 },
    { month: 'May', sales: 2400 },
    { month: 'Jun', sales: 1800 },
];

const pieData = [
    { name: 'Completed', value: 40 },
    { name: 'Pending', value: 20 },
    { name: 'Returned', value: 10 },
    { name: 'Running', value: 15 },
    { name: 'Cancelled', value: 15 },
];

const pieColors = ['#22B5CE', '#004B53', '#bfbfbf', '#F4A940', '#D96348'];
const lighterPieColors = ['#B8E9F1', '#7CA5A8', '#cccccc', '#FAE1B3', '#F5B6A9'];

const lineData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 38 },
    { month: 'Mar', value: 55 },
    { month: 'Apr', value: 60 },
    { month: 'May', value: 98 },
    { month: 'Jun', value: 80 },
    { month: 'Jul', value: 50 },
    { month: 'Aug', value: 20 },
    { month: 'Sep', value: 40 },
    { month: 'Oct', value: 68 },
    { month: 'Nov', value: 55 },
    { month: 'Dec', value: 60 },
];

import { Business } from '@/types/business';

interface SalesSectionProps {
  business: Business;  // Add the prop type here
}

const SalesSection: React.FC<SalesSectionProps> = ({ business }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handlePieEnter = (_: any, index: number) => setActiveIndex(index);
    const handlePieLeave = () => setActiveIndex(null);


    const memoizedLineChart = useMemo(() => (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} style={{ paddingLeft: 0, paddingRight: 0 }}/>
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
                <Tooltip
                    formatter={(value) => `${value}%`}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{ borderRadius: 6, fontSize: 12 }}
                />
                <ReferenceLine x="May" stroke="#FFA500" strokeDasharray="3 3" label="Overall Sale" />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1890FF"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#1890FF' }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    ), []);

    return (
        <div className="flex flex-wrap gap-4">
            {/* Online Sales & Booking */}
            <div className="flex flex-col w-full gap-4 lg:flex-row">
                {/* Left Section: Sales & Service */}
                <div className="flex flex-col gap-4 w-full lg:w-[200px]">
                    {/* Online Sales */}
                    <div className="flex items-center justify-between px-4 py-6 bg-white rounded shadow">
                        <div>
                            <p className="text-sm text-gray-600">Online Sales</p>
                            <p className="text-2xl font-bold">$9,589.88</p>
                        </div>
                        <div className="flex items-end w-20 h-16">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <Bar dataKey="sales" radius={[0, 0, 0, 0]}>
                                        <Cell fill="#ff4d4f" />
                                        <Cell fill="#faad14" />
                                        <Cell fill="#52c41a" />
                                        <Cell fill="#1890ff" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Online Service Bookings */}
                    <div className="flex items-center justify-between px-4 py-6 bg-white rounded shadow">
                        <div>
                            <p className="text-sm text-gray-600">Online Service Bookings</p>
                            <p className="text-2xl font-bold">90%</p>
                        </div>
                        <div className="relative w-16 h-16">
                            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="15.9155"
                                    fill="none"
                                    stroke="#1890FF"
                                    strokeWidth="3"
                                    strokeDasharray="90 10"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-semibold text-black">90%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Order Status */}
                <div className="flex-1 lg:min-w-[280px] p-4 bg-white rounded-[6px] shadow">
                    <div className="flex items-center justify-end mb-2">
                        <button className="text-gray-400">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="5" cy="12" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="19" cy="12" r="2" />
                            </svg>
                        </button>
                    </div>

                    <div
                        className="relative flex flex-col items-center gap-4 md:flex-row md:items-start"
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {/* ✅ Custom Hover Label - centered on mobile */}
                        {activeIndex !== null && pieData[activeIndex] && (
                            <div className="absolute top-2 left-1/2 md:left-[80px] -translate-x-1/2 md:translate-x-0 z-10 text-center bg-white px-2 py-1 rounded shadow text-sm font-semibold flex gap-2 items-center pointer-events-none">
                                <div className="text-base text-black">{pieData[activeIndex].value}</div>
                                <div className="text-xs text-gray-500">{pieData[activeIndex].name}</div>
                            </div>
                        )}

                        {/* ✅ Pie Chart (centered on mobile) */}
                        <div className="flex justify-center">
                            <PieChart width={180} height={180}>
                                {/* Outer Pie */}
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={65}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                    onMouseEnter={handlePieEnter}
                                    onMouseLeave={handlePieLeave}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`outer-${index}`}
                                            fill={pieColors[index % pieColors.length]}
                                            style={{
                                                transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                transformOrigin: 'center',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        />
                                    ))}
                                </Pie>

                                {/* Inner Ring */}
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={49}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`inner-${index}`}
                                            fill={lighterPieColors[index % lighterPieColors.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>

                        {/* ✅ Legend (stacks below on mobile) */}
                        <div className="text-center md:text-left">
                            <h3 className="mb-3 text-lg font-bold text-black">Order Status</h3>
                            <ul className="grid grid-cols-1 text-sm text-gray-800 sm:grid-cols-2 gap-x-4 gap-y-2 md:gap-x-6">
                                {pieData.map((entry, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-center gap-2 md:justify-start"
                                    >
                                        <span
                                            className="inline-block w-3.5 h-3.5 rounded-sm"
                                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                        ></span>
                                        {entry.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>


            </div>


            {/* Sales Line Chart */}
            <div className="bg-white p-4 rounded shadow flex-1 lg:min-w-[300px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Sales Details</h3>
                    <select className="px-2 py-1 text-sm border rounded">
                        <option>Jan 2024 - Dec 2024</option>
                    </select>
                </div>
                {memoizedLineChart}
            </div>
        </div>
    );
};

export default SalesSection;
