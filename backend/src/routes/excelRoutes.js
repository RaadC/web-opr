import express from "express";
import ExcelJS from "exceljs";
import Purchase from "../models/purchase.js";
import path from "path";

const router = express.Router();

/* =========================
   SINGLE EXPORT (EXISTING)
========================= */
router.get("/export/:id", async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const templatePath = path.resolve("templates/pr-template.xlsx");

    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet("PR page 1");

    worksheet.getCell("C40").value = purchase.name;
    worksheet.getCell("C41").value = purchase.designation;
    worksheet.getCell("A6").value = purchase.department;
    worksheet.getCell("C36").value = purchase.purpose;
    worksheet.getCell("D40").value = purchase.signatory;

    let startRow = 9;

    purchase.items.forEach((item, index) => {
      const row = worksheet.getRow(startRow + index);

      row.getCell(2).value = item.unit;
      row.getCell(3).value = item.name;
      row.getCell(4).value = item.quantity;
      row.getCell(5).value = item.price;

      row.commit();
    });

    const date = new Date(purchase.createdAt);
    worksheet.getCell("E6").value = `Date: ${date.toLocaleDateString("en-US")}`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=purchase_${purchase._id}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating Excel" });
  }
});

/* =========================
   🔥 GROUP EXPORT (NEW)
========================= */
router.post("/group-export", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const purchases = await Purchase.find({ _id: { $in: ids } });

    if (!purchases.length) {
      return res.status(404).json({ message: "No purchases found" });
    }

    // 🔥 MERGE ITEMS
    const map = {};

    purchases.forEach(purchase => {
      purchase.items.forEach(item => {
        const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, "");

        if (!map[key]) {
          map[key] = {
            name: item.name,
            unit: item.unit,
            quantity: 0,
            totalCost: 0,
          };
        }

        map[key].quantity += item.quantity;
        map[key].totalCost += item.price * item.quantity;
      });
    });

    const mergedItems = Object.values(map).map(item => ({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      price: item.totalCost / item.quantity, // avg price
    }));

    // 📄 LOAD TEMPLATE
    const workbook = new ExcelJS.Workbook();
    const templatePath = path.resolve("templates/pr-template.xlsx");

    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet("PR page 1");

    // 🔧 HEADER VALUES
    worksheet.getCell("C40").value = "Grouped Purchase";
    worksheet.getCell("C41").value = "Multiple";
    worksheet.getCell("A6").value = "Multiple Departments";
    worksheet.getCell("C36").value = "Grouped Office Needs";
    worksheet.getCell("D40").value = "N/A";

    // 📦 ITEMS
    let startRow = 9;

    mergedItems.forEach((item, index) => {
      const row = worksheet.getRow(startRow + index);

      row.getCell(2).value = item.unit;
      row.getCell(3).value = item.name;
      row.getCell(4).value = item.quantity;
      row.getCell(5).value = item.price;

      row.commit();
    });

    // 📅 DATE
    worksheet.getCell("E6").value = `Date: ${new Date().toLocaleDateString("en-US")}`;

    // 📤 RESPONSE
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=grouped_purchase.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Grouped export error" });
  }
});

export default router;