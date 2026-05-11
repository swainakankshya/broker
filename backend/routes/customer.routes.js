const express = require("express");
const router = express.Router();

const { poolPromise } = require("../db");

router.get("/tags", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT DISTINCT Tag
      FROM Customer
      WHERE Tag IS NOT NULL
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Tag API error:", err);
    res.status(500).json({ message: "Failed to load tags" });
  }
});
router.get("/dropdown/companyname", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT DISTINCT
          LTRIM(RTRIM(CompanyName)) AS CleanCompanyName
      FROM Customer
      WHERE CompanyName IS NOT NULL
      AND LTRIM(RTRIM(CompanyName)) <> ''
      ORDER BY CleanCompanyName ASC
    `);

    res.json(result.recordset.map(r => r.CleanCompanyName));

  } catch (err) {
    console.error("Company dropdown error:", err);
    res.status(500).json([]);
  }
});

module.exports = router;
