import supabase from '../supabase-client';
import { useEffect, useState } from 'react';
import { Chart } from 'react-charts';
import Form from './Form';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);

  async function fetchMetrics() {
    try {
      const { data, error } = await supabase
        .from('Sales_deals')
        .select('name, value');

      if (error) throw error;

      const grouped = {};
      data.forEach((row) => {
        if (grouped[row.name]) {
          grouped[row.name] += row.value;
        } else {
          grouped[row.name] = row.value;
        }
      });

      const result = Object.entries(grouped).map(([name, sum]) => ({
        name,
        sum,
      }));

      setMetrics(result);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }

  // ✅ Optimistic update — updates chart instantly, then syncs with Supabase
  function handleAdd(newDeal) {
    setMetrics((prev) => {
      const existing = prev.find((m) => m.name === newDeal.name);
      if (existing) {
        // ✅ Add to existing person's total
        return prev.map((m) =>
          m.name === newDeal.name
            ? { ...m, sum: m.sum + newDeal.value }
            : m
        );
      } else {
        // ✅ New person — add new bar
        return [...prev, { name: newDeal.name, sum: newDeal.value }];
      }
    });

    // ✅ Then re-fetch from Supabase to stay in sync
    fetchMetrics();
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  const chartData = [
    {
      label: 'Sales',
      data: metrics.map((m) => ({
        primary: m.name,
        secondary: m.sum,
      })),
    },
  ];

  const primaryAxis = {
    getValue: (d) => d.primary,
    scaleType: 'band',
    padding: 0.2,
    position: 'bottom',
  };

  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: 'linear',
      min: 0,
      max: yMax(),
      padding: {
        top: 20,
        bottom: 40,
      },
    },
  ];

  function yMax() {
    if (metrics.length > 0) {
      const maxSum = Math.max(...metrics.map((m) => m.sum));
      return maxSum + 2000;
    }
    return 5000;
  }

  return (
    <div className='dashboard-wrapper'>
      <div className='chart-container'>
        <h2>Total Sales This Quarter ($)</h2>

        <div style={{ flex: 1, height: '400px' }}>
          {metrics.length > 0 ? (
            <Chart
              options={{
                data: chartData,
                primaryAxis,
                secondaryAxes,
                defaultColors: ['#58d675'],
                tooltip: { show: false },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        {/* ✅ Pass handleAdd so chart updates instantly on submit */}
        <Form metrics={metrics} onAdd={handleAdd} />
      </div>
    </div>
  );
}

export default Dashboard;