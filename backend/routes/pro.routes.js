const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// ===============================
// TEMP DROPDOWN
// ===============================
router.get("/dropdown/temp", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT DISTINCT Temperature
      FROM InvoiceTable
      WHERE Temperature IS NOT NULL
      ORDER BY Temperature ASC
    `);

    res.json(result.recordset.map(r => r.Temperature));
  } catch (err) {
    console.error("Temp dropdown error:", err);
    res.status(500).json({ message: "Failed to load temp options" });
  }
});


router.get("/:proNo", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("ProNo", sql.VarChar, req.params.proNo)
      .query(`
        SELECT
          ProNumber AS ProNumber,
          ReferenceNumber AS Reference,
          Ref1,
          Ref2,
          Ref3,
          Ref4,
          Ref5,
          VerbalPODUser AS PO,
          CarrierCode AS CarrierPro,
          BookingNumber AS BookingNo,
          UnitNumber AS UnitNo,
          Miles AS Miles,
          
          Commission AS PredComm,
          Temperature AS Temp,
          c.Tag AS Tariff
        FROM InvoiceTable i
LEFT JOIN Customer c
  ON i.CustomerNumber = c.CustomerNumber
WHERE i.ProNumber = @ProNo
      `);

    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error("PRO API error:", err);
    res.status(500).json({ message: "Failed to fetch PRO data" });
  }
});

module.exports = router;
