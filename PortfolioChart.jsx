import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function PortfolioChart({ labels = [], dataPoints = [] }) {
    const data = {
    labels,
    datasets: [{ label: 'Portfolio Value', data: dataPoints, tension: 0.3 }]
    };
    return <div className="bg-white/5 p-4 rounded-lg"><Line data={data} /></div>;
}
