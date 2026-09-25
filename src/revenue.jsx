import { useEffect, useState } from "react";
import "./revenue.css";

function Revenue() {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch("/api/revenue");

        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }

        const data = await response.json();
        setRevenueData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="revenue-page">
        <div className="revenue-card loading-card">
          <div className="spinner"></div>
          <p>Loading today's revenue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="revenue-page">
        <div className="revenue-card error-card">
          <h2>Unable to load revenue</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="revenue-page">
      <div className="revenue-container">

        <div className="revenue-header">
          <div className="coffee-icon">☕</div>

          <div>
            <h1>Revenue Dashboard</h1>
            <p>Today's coffee shop performance</p>
          </div>
        </div>

        <div className="revenue-main-card">
          <p className="card-label">TODAY'S REVENUE</p>

          <h2>
            ₹{Number(revenueData.totalRevenue).toLocaleString("en-IN")}
          </h2>

          <div className="date-badge">
            {new Date(revenueData.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">🧾</div>

            <div>
              <p>Total Orders</p>
              <h3>{revenueData.orders}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>

            <div>
              <p>Currency</p>
              <h3>{revenueData.currency}</h3>
            </div>
          </div>

        </div>

        <div className="data-source">
          <span className="status-dot"></span>
          <span>Live data from Supabase</span>
        </div>

      </div>
    </div>
  );
}

export default Revenue;