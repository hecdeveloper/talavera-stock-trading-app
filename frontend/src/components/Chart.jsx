import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chart.js/auto';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const StockChart = ({ data, latestPrice }) => {
  const chartRef = useRef(null);

  // Format historical data for chart
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.timestamp);
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }),
    datasets: [
      {
        label: 'Stock Price',
        data: data.map(item => item.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        pointRadius: 1,
        pointHoverRadius: 5,
      },
    ],
  };

  // Determine color trend based on price movement
  useEffect(() => {
    if (!chartRef.current || data.length < 2) return;
    
    const chart = chartRef.current;
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    
    // Update line color based on trend
    if (lastPrice > firstPrice) {
      chart.data.datasets[0].borderColor = 'rgb(75, 192, 100)';
      chart.data.datasets[0].backgroundColor = 'rgba(75, 192, 100, 0.5)';
    } else if (lastPrice < firstPrice) {
      chart.data.datasets[0].borderColor = 'rgb(255, 99, 132)';
      chart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.5)';
    }
    
    chart.update();
  }, [data]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Current Price: $${latestPrice ? latestPrice.toFixed(2) : '0.00'}`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 500
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line 
        ref={chartRef}
        data={chartData} 
        options={options} 
      />
    </div>
  );
};

export default StockChart; 