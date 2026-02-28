
const express = require("express");
const cors = require("cors");

const feedbackRoutes = require("./routes/feedbackRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Enterprise Risk Intelligence API Running 🚀");
});

app.use("/api/feedback", feedbackRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
  

  
    
     
    
