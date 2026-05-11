require("dotenv").config();
const express = require("express");
const cors = require("cors");

const invoiceRoutes = require("./routes/invoice.routes");
const customerRoutes = require("./routes/customer.routes");
const proRoutes = require("./routes/pro.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/invoice", invoiceRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/pro", proRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
