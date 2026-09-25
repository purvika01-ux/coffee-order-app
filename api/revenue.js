import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    // Get today's date in India
    const now = new Date();

    const indiaDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);

    // Start and end of today in India
    const startOfDay = `${indiaDate}T00:00:00+05:30`;

    const tomorrow = new Date(`${indiaDate}T00:00:00+05:30`);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(tomorrow);

    const endOfDay = `${tomorrowDate}T00:00:00+05:30`;

    // Get today's orders from Supabase
    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", startOfDay)
      .lt("created_at", endOfDay);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    // Calculate today's total revenue
    const totalRevenue = data.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    // Send JSON response
    return res.status(200).json({
      date: indiaDate,
      totalRevenue,
      currency: "INR",
      orders: data.length
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}