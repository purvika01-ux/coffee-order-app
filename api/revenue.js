import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // Get today's date according to India (IST)
    const indiaDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    // Start and end of today in India
    const startOfDay = new Date(
      `${indiaDate}T00:00:00+05:30`
    );

    const endOfDay = new Date(
      new Date(`${indiaDate}T00:00:00+05:30`).getTime() +
        24 * 60 * 60 * 1000
    );

    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", startOfDay.toISOString())
      .lt("created_at", endOfDay.toISOString());

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    const totalRevenue = data.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    return res.status(200).json({
      date: indiaDate,
      totalRevenue,
      currency: "INR",
      orders: data.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}