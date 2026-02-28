const db = require("../db");

exports.getOverview = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total_feedback,
      ROUND(AVG(risk_score), 2) AS avg_risk,
      ROUND(AVG(sentiment_score), 2) AS avg_sentiment
    FROM feedback
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: results[0]
    });
  });
};

exports.getDepartmentRisk = (req, res) => {
  const sql = `
    SELECT 
      department,
      COUNT(*) AS total_feedback,
      ROUND(AVG(risk_score), 2) AS avg_risk
    FROM feedback
    GROUP BY department
    ORDER BY avg_risk DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      departments: results
    });
  });
};
