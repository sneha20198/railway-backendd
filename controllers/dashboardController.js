const db = require("../db");

// ✅ Overview Stats
exports.getOverview = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*)::int AS total_feedback,
        ROUND(AVG(risk_score)::numeric, 2) AS avg_risk,
        ROUND(AVG(sentiment_score)::numeric, 2) AS avg_sentiment
      FROM feedback
    `;

    const result = await db.query(query);

    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        total_feedback: data.total_feedback || 0,
        avg_risk: data.avg_risk || 0,
        avg_sentiment: data.avg_sentiment || 0
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// ✅ Department Risk Breakdown
exports.getDepartmentRisk = async (req, res) => {
  try {
    const query = `
      SELECT 
        department,
        COUNT(*)::int AS total_feedback,
        ROUND(AVG(risk_score)::numeric, 2) AS avg_risk
      FROM feedback
      GROUP BY department
      ORDER BY avg_risk DESC
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      departments: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
