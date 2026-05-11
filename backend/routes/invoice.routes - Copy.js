const express = require("express");
const router = express.Router();

const { poolPromise, sql } = require("../db");


router.get("/dropdown/shipper", async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 Shipper
FROM InvoiceTable
WHERE Shipper IS NOT NULL
ORDER BY Shipper ASC
  `);
  res.json(result.recordset.map(r => r.Shipper));
});
router.get("/dropdown/consignee", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT DISTINCT
          LTRIM(RTRIM(Consignee)) AS CleanConsignee
      FROM InvoiceTable
      WHERE Consignee IS NOT NULL
      AND LTRIM(RTRIM(Consignee)) <> '' 
      ORDER BY CleanConsignee ASC
    `);

    res.json(result.recordset.map(r => r.CleanConsignee));

  } catch (err) {
    console.error("Consignee dropdown error:", err);
    res.status(500).json([]);
  }
});      

/* ===============================
   ZIP — CustomerTable
================================ */
router.get("/dropdown/zip", async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 Zip
    FROM Customer
    WHERE Zip IS NOT NULL
    ORDER BY Zip ASC
  `);
  res.json(result.recordset.map(r => r.Zip));
});

/* ===============================
   STATE — CustomerTable
================================ */
router.get("/dropdown/state", async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 State
    FROM Customer
    WHERE State IS NOT NULL
    ORDER BY State ASC
  `);
  res.json(result.recordset.map(r => r.State));
});

router.get("/dropdown/szip", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT DISTINCT TOP 100 SZip
      FROM InvoiceTable
      WHERE SZip IS NOT NULL
      ORDER BY SZip ASC
    `);

    res.json(result.recordset.map(r => r.SZip));

  } catch (err) {
    console.error("SZip dropdown error:", err);
    res.status(500).json([]);
  }
});


/* ===============================
   COUNTRY + TAG — CountryTable
================================ */
router.get("/dropdown/country", async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT CountryID, Country, Tag
    FROM CountryTable
    ORDER BY Country ASC
  `);
  res.json(result.recordset);
});

// ===============================
// SPECIAL INSTRUCTION DROPDOWN
// ===============================
router.get("/dropdown/specialinstructions", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
     SELECT DISTINCT TOP 100 SpecialInstructions
FROM InvoiceTable
WHERE SpecialInstructions IS NOT NULL
ORDER BY SpecialInstructions ASC
    `);

    const cleaned = result.recordset
      .map(r =>
        r.SpecialInstructions
          ?.replace(/\r?\n|\t/g, " ")
          ?.replace(/\s+/g, " ")
          ?.trim()
      )
      .filter(Boolean); // removes empty values

    res.json(cleaned);

  } catch (err) {
    console.error("Special instruction dropdown error:", err);
    res.status(500).json({ message: "Failed to load instructions" });
  }
});

// ===============================
// DEFAULT INVOICE ON PAGE LOAD
// ===============================
/* ===============================
   CONSIGNEE ZIP DROPDOWN
================================ */
router.get("/dropdown/czip", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT DISTINCT TOP 100 CZip
      FROM InvoiceTable
      WHERE CZip IS NOT NULL
      ORDER BY CZip ASC
    `);

    res.json(result.recordset.map(r => r.CZip));

  } catch (err) {
    res.status(500).json(err.message);
  }
});
// ===============================
// GET INVOICE BY PRO NUMBER
// ===============================
router.get("/byPro/:proNo", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("ProNo", sql.VarChar, req.params.proNo)
      .query(`
        SELECT TOP 1 InvoiceNumber
        FROM InvoiceTable
        WHERE ProNumber = @ProNo
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: "No invoice found for this PRO number" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error("Pro search error:", err);
    res.status(500).json({ message: "Failed to fetch by pro number" });
  }
});

router.get("/dropdown/drivercollect", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 DriverCollect
FROM InvoiceTable
WHERE DriverCollect IS NOT NULL
ORDER BY DriverCollect ASC
  `);

  res.json(result.recordset.map(r => r.DriverCollect));
});

router.get("/dropdown/ophold", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 OperationsHold
FROM InvoiceTable
WHERE OperationsHold IS NOT NULL
ORDER BY OperationsHold ASC
  `);

  res.json(result.recordset.map(r => r.OperationsHold));
});

router.get("/dropdown/terms", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 Terms
    FROM InvoiceTable
    WHERE Terms IS NOT NULL
    ORDER BY Terms ASC
  `);

  res.json(result.recordset.map(r => r.Terms));
});

router.get("/dropdown/caller", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 Caller
FROM InvoiceTable
WHERE Caller IS NOT NULL
ORDER BY Caller ASC
  `);

  res.json(result.recordset.map(r => r.Caller));
});

router.get("/dropdown/driverkey", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT TOP 100 DriverKey
FROM InvoiceTable
WHERE DriverKey IS NOT NULL
ORDER BY DriverKey ASC
  `);

  res.json(result.recordset.map(r => r.DriverKey));
});

// ===============================
// GET CALL LOG BY INVOICE
// ===============================
// ===============================
// GET CALL LOG BY INVOICE NUMBER
// ===============================
router.get("/calllog/:orderNo", async (req, res) => {
  try {
    const pool = await poolPromise;

    const filters = req.query.filters
      ? JSON.parse(req.query.filters)
      : {};

    let whereClause = "WHERE s.InvoiceKey = @OrderNo";

    const request = pool
      .request()
      .input("OrderNo", sql.Int, req.params.orderNo);

    if (filters.notes?.value) {

      if (filters.notes.action === "filterText") {
        whereClause += " AND s.Notes LIKE @Notes";
        request.input("Notes", sql.VarChar, `%${filters.notes.value}%`);
      }

      if (filters.notes.action === "filterBy") {
        whereClause += " AND s.Notes = @Notes";
        request.input("Notes", sql.VarChar, filters.notes.value);
      }

      if (filters.notes.action === "exclude") {
        whereClause += " AND s.Notes <> @Notes";
        request.input("Notes", sql.VarChar, filters.notes.value);
      }
    }

    const result = await request.query(`
      SELECT 
        s.DateTime AS Date,
        s.Agent AS cont,
        s.Notes AS notes
      FROM ShipmentCallLogTable s
      ${whereClause}
      ORDER BY s.DateTime DESC
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("CallLog API error:", err);
    res.status(500).json([]);
  }
});

router.get("/search/invoice/:orderNo", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("OrderNo", sql.Int, req.params.orderNo)
      .query(`
        SELECT
          i.InvoiceNumber AS OrderNo,
          i.ProNumber,
          i.BatchNumber AS Batch,
          i.Shipper,
          i.Ref1,
          c.CompanyName
        FROM InvoiceTable i
        LEFT JOIN Customer c
          ON i.CustomerNumber = c.CustomerNumber
        WHERE i.InvoiceNumber = @OrderNo
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error("Invoice search error:", err);
    res.status(500).json({});
  }
});

router.get("/list/paged", async (req, res) => {
  try {
    const pool = await poolPromise;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    const sortField = req.query.sortField || "InvoiceNumber";
    const sortOrder = req.query.sortOrder === "DESC" ? "DESC" : "ASC";

    console.log("===== BACKEND REQUEST =====");


console.log("SortField:", sortField);
console.log("SortOrder:", sortOrder);
console.log("===========================");

    const offset = (page - 1) * limit;

    // Allowed sort fields (prevent SQL injection)
    const allowedSortFields = [
      "InvoiceNumber",
      "ProNumber",
      "BatchNumber",
      "Shipper",
      "EnteredDate",
      "Total"
    ];

    const safeSortField = allowedSortFields.includes(sortField)
      ? sortField
      : "InvoiceNumber";

    const fieldMap = {

  InvoiceNumber: "i.InvoiceNumber",
  BatchNumber: "i.BatchNumber",
  ProNumber: "i.ProNumber",

  EnteredBy: "i.EnteredBy",
  EnteredDate: "i.EnteredDate",
  BilledBy: "i.BilledBy",
  ChangedBy: "i.ChangedBy",
  ChangedDate: "i.lastchangedDate",

  Shipper: "i.Shipper",
  SAdd: "i.SAddress",
  CAdd: "i.CAddress",

  SState: "i.SState",
  CState: "i.CState",
  SCity: "i.SCity",
  CCity: "i.CCity",

  SZip: "i.SZip",
  CZip: "i.CZip",

  PuDate: "i.PickupDate",
  SelectDate: "i.[Date]",
  ConfirmedDate: "i.ConfirmedDate",
  VerbalPODTime: "i.VerbalPODTime",

  Caller: "i.Caller",
  CallerPhone: "i.CallerPhone",

  Special: "i.SpecialInstructions",
  Consignee: "i.Consignee",

  PO: "i.PurchaseOrderNumber",

  Ref: "i.ReferenceNumber",
  Ref1: "i.Ref1",
  Ref2: "i.Ref2",
  Ref3: "i.Ref3",
  Ref4: "i.Ref4",
  Ref5: "i.Ref5",

  CarrierPro: "i.CarrierCode",
  Booking: "i.BookingNumber",
  Unit: "i.UnitNumber",
  Country: "c.Country",
  Terms: "i.Terms",

  // =========================
  // Customer Table (c)
  // =========================
  CompanyName: "c.CompanyName",
  Phone: "c.Phone",
  Phone2: "c.Phone2",
  Fax: "c.Fax",
  Tag: "c.Tag"
};

const specialFieldMap = {

  notes: {
    table: "ShipmentCallLogTable",
    column: "Notes",
    joinColumn: "InvoiceKey"
  },

  Description: {
    table: "InvoiceDetails",
    column: "Description",
    joinColumn: "InvoiceNumber"
  }

};

    const filters = req.query.filters
  ? JSON.parse(req.query.filters)
  : {};

  let whereClause = `WHERE 1=1`;

  console.log("===== FILTERS RECEIVED FROM FRONTEND =====");
console.log(filters);
console.log("===========================================");

  console.log("===== ACTIVE FILTERS RECEIVED =====");
console.log(JSON.stringify(filters, null, 2));
console.log("====================================");

   // =============================
// BUILD FILTER CONDITIONS
// =============================

const request = pool.request();
let whereConditions = [];

for (const field in filters) {

  const { value, action } = filters[field];
  const columnName = fieldMap[field]; 

  // =============================
// NOTES + DESCRIPTION FILTER
// =============================
if (specialFieldMap[field]) {

  const { table, column, joinColumn } = specialFieldMap[field];
  const cleanValue = value.trim();

  if (action === "filterText") {

    whereConditions.push(`
      EXISTS (
        SELECT 1
        FROM ${table} s
        WHERE s.${joinColumn} = i.InvoiceNumber
        AND LOWER(s.${column}) LIKE LOWER(@${field})
      )
    `);

    request.input(
      field,
      sql.VarChar,
      `%${cleanValue.replace(/\*/g,"%")}%`
    );
  }

  if (action === "filterBy") {

    whereConditions.push(`
      EXISTS (
        SELECT 1
        FROM ${table} s
        WHERE s.${joinColumn} = i.InvoiceNumber
        AND s.${column} = @${field}
      )
    `);

    request.input(field, sql.VarChar, cleanValue);
  }

  if (action === "exclude") {

    whereConditions.push(`
      NOT EXISTS (
        SELECT 1
        FROM ${table} s
        WHERE s.${joinColumn} = i.InvoiceNumber
        AND s.${column} = @${field}
      )
    `);

    request.input(field, sql.VarChar, cleanValue);
  }

  continue;
}

  if (!columnName) continue;
  if (value === null || value === undefined || value === "") continue;

  // =============================
  // NUMERIC FIELDS
  // =============================
  if (field === "InvoiceNumber" || field === "BatchNumber") {

    if (action === "filterBy" || action === "find") {
      whereConditions.push(`${columnName} = @${field}`);
    }

    if (action === "exclude") {
      whereConditions.push(`${columnName} <> @${field}`);
    }

    request.input(field, sql.Int, value);
  }

  // =============================
  // TEXT FIELDS
  // =============================
  else {

     if (action === "filterText") {
  const searchValue = value.replace(/\*/g, "%");
  whereConditions.push(`${columnName} LIKE @${field}`);
  request.input(field, sql.VarChar, `%${searchValue}%`);
}

    else if (action === "filterBy") {
      whereConditions.push(`${columnName} LIKE @${field}`);
      request.input(field, sql.VarChar, `%${value}%`);
    }

    else if (action === "find") {
      whereConditions.push(`${columnName} = @${field}`);
      request.input(field, sql.VarChar, value);
    }

    else if (action === "exclude") {
      whereConditions.push(`${columnName} <> @${field}`);
      request.input(field, sql.VarChar, value);
    }
  }
}

  // =============================
  // BASE WHERE
  // =============================

 if (whereConditions.length > 0) {
  whereClause += " AND " + whereConditions.join(" AND ");
}

console.log("Final WHERE Clause:");
console.log(whereClause);
    // =============================
    const dataResult = await request.query(`
      
      SELECT
        i.InvoiceNumber AS OrderNo,
        i.ProNumber,
        i.BatchNumber AS Batch,
        i.EnteredBy,
        i.EnteredDate,
        i.BilledBy,
        i.ChangedBy,
        i.lastchangedDate AS ChangedDate,

        i.Shipper,
        i.SAddress AS SAdd,
        i.CAddress AS CAdd,
        i.SState,
        i.CState,
        i.SCity,
        i.CCity,
        i.SZip,
        i.CZip,

        i.PickupDate AS PuDate,
        i.[Date] AS SelectDate,
        i.ConfirmedDate,
        i.VerbalPODTime,
        i.Caller,
        i.CallerPhone,
        i.SpecialInstructions AS Special,
        i.DispatchNotes AS DispatchNotes,
        i.Consignee,
        i.miles AS Miles,
        i.PurchaseOrderNumber AS PO,

        i.ReferenceNumber AS Ref,
        i.Ref1,
        i.Ref2,
        i.Ref3,
        i.Ref4,
        i.Ref5,

        i.CarrierCode AS CarrierPro,
        i.BookingNumber AS Booking,
        i.UnitNumber AS Unit,
        i.Temperature AS Temp,
        i.CODAmount AS CODPayTo,
        i.InsuredValue,
        i.Insurance,
        i.DeclaredValue,
        i.CODFee,
        i.FreightTerms AS Freight,
        i.FuelSurchargeKey,
        i.FuelSurchargeAmount,
        i.GTotal,
        i.Total,
        i.DriverCollect,
        i.DriverKey,
        i.CustomerDiscount AS Discount,
        i.Balance,
        i.Terms,
        i.StatementKey AS Statement,
        i.OperationsHold AS OpHold,
        i.CODCollect AS COD,

        c.CompanyName,
        c.Country ,
        c.Address,
        c.Zip,
        c.State,
        c.Phone,
        c.Phone2,
        c.Fax,
        c.Tag,

        v.VendorName AS Vendor,
        v.Phone AS VendorPhone,
        v.Note,
        v.VendorRating AS Rating

      FROM InvoiceTable i
      LEFT JOIN Customer c
        ON i.CustomerNumber = c.CustomerNumber
      LEFT JOIN VendorTable v
        ON i.CarrierKey = v.VendorID

      ${whereClause}

      ORDER BY i.${safeSortField} ${sortOrder}

      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `);
console.log("Returned Records:", dataResult.recordset.length);
    // =============================
    // TOTAL COUNT
    // =============================
    const countResult = await request.query(`
  SELECT COUNT(*) AS total
  FROM InvoiceTable i
  LEFT JOIN Customer c
    ON i.CustomerNumber = c.CustomerNumber
  LEFT JOIN VendorTable v
    ON i.CarrierKey = v.VendorID
  ${whereClause}
`);

    res.json({
      records: dataResult.recordset,
      totalRecords: countResult.recordset[0].total,
      currentPage: page
    });

  } catch (err) {
    console.error("Pagination API error:", err);
    res.status(500).json({ message: "Failed to load invoices" });
  }
});


// ===============================
// GET WEIGHT DETAILS BY INVOICE
// ===============================
router.get("/lineitem/:orderNo", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("OrderNo", sql.Int, req.params.orderNo)
      .query(`
        SELECT 
          d.PKG AS PKG,
          d.Accessorial AS Accessorial,
          d.Insurance AS Insurance,
          d.Description AS Description,
          d.ClassKey AS ClassKey,
          d.InventoryKey AS InventoryItem,
          d.StatedWeight,
          d.ActualWeight,
          d.Weight AS DIMWeight,
          d.Weight AS WeightCode,
          d.Pieces AS Units,
          d.Rate,
          d.Charges
        FROM InvoiceDetails d
        WHERE d.InvoiceNumber = @OrderNo
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Weight API error:", err);
    res.status(500).json([]);
  }
});


// ===============================
// GET COMPLETE INVOICE BY ORDER NUMBER
// ===============================
router.get("/full/:orderNo", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("OrderNo", sql.Int, req.params.orderNo)
      .query(`
        SELECT 
          i.InvoiceNumber AS OrderNo,
          i.ProNumber,
          i.BatchNumber AS Batch,
          i.EnteredBy,
          i.EnteredDate,
          i.BilledBy,
          i.ChangedBy,
          i.lastchangedDate AS ChangedDate,
          i.Shipper,
          i.SAddress AS SAdd,
          i.CAddress AS CAdd,
          i.SState,
          i.CState,
          i.SCity,
          i.CCity,
          i.SZip,
          i.CZip,
          i.PickupDate AS PuDate,
          i.[Date] AS SelectDate,
          i.ConfirmedDate,
          i.VerbalPODTime,
          i.Caller,
          i.CallerPhone,
          i.SpecialInstructions AS Special,
          i.DispatchNotes AS DispatchNotes,
          i.Consignee,
          i.PurchaseOrderNumber AS PO,
          i.ReferenceNumber AS Ref,
          i.Ref1,
          i.Ref2,
          i.Ref3,
          i.Ref4,
          i.Ref5,
          i.CarrierCode AS CarrierPro,
          i.BookingNumber AS Booking,
          i.UnitNumber AS Unit,
          i.Temperature AS Temp,
          i.CODAmount AS CODPayTo,
          i.InsuredValue,
          i.Insurance,
          i.DeclaredValue,
          i.CODFee,
          i.FreightTerms AS Freight,
          i.FuelSurchargeKey,
          i.FuelSurchargeAmount,
          i.GTotal,
          i.Total,
          i.DriverCollect,
          i.DriverKey,
          i.CustomerDiscount AS Discount,
          i.Balance,
          i.Terms,
          i.StatementKey AS Statement,
          i.OperationsHold AS OpHold,
          i.CODCollect AS COD,
          i.InvoiceeKey,

          c.CompanyName,
          c.Country,
          c.Address,
          c.Zip,
          c.State,
          c.Phone,
          c.Phone2,
          c.Fax,
          c.Tag,

          v.VendorName AS Vendor,
          v.Phone AS VendorPhone,
          v.Note,
          v.VendorRating AS Rating

        FROM InvoiceTable i
        LEFT JOIN Customer c
          ON i.CustomerNumber = c.CustomerNumber
        LEFT JOIN VendorTable v
          ON i.CarrierKey = v.VendorID
        WHERE i.InvoiceNumber = @OrderNo
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error("Full invoice fetch error:", err);
    res.status(500).json({});
  }
});

module.exports = router;
