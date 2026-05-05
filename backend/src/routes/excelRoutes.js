import express from "express";
import ExcelJS from "exceljs";
import Purchase from "../models/purchase.js";
import path from "path";

const router = express.Router();

/* TEMPLATE SELECTOR */
const getTemplatePath = (count) => {
  if (count <= 26) {
    return "templates/pr-template.xlsx";
  } else if (count <= 60) {
    return "templates/pr-template 2p.xlsx";
  } else if (count <= 97) {
    return "templates/pr-template 3p.xlsx";
  } else {
    return "templates/pr-template 4p.xlsx";
  }
};

/* HEADER MAP */
const getHeaderMap = (count) => {
  if (count <= 26) {
    return {
      name: "C40",
      designation: "C41",
      department: "A6",
      purpose: "C36",
      signatory: "D40",
    };
  } else if (count <= 60) {
    return {
      name: "C74",
      designation: "C75",
      department: "A6",
      purpose: "C70",
      signatory: "D74",
    };
  } else if (count <= 97) {
    return {
      name: "C111",
      designation: "C112",
      department: "A6",
      purpose: "C107",
      signatory: "D111",
    };
  } else {
    return {
      name: "C149",
      designation: "C150",
      department: "A6",
      purpose: "C145",
      signatory: "D149",
    };
  }
};

/* COLUMN MAP (SAFE FOR FUTURE CHANGES) */
const getColumnMap = (count) => {
  return {
    unit: 2,
    name: 3,
    qty: 4,
    price: 5,
  };
};

/* HELPER: FILL ROW */
const fillRow = (row, item, col) => {
  row.getCell(col.unit).value = item.unit;
  row.getCell(col.name).value = item.name;
  row.getCell(col.qty).value = Number(item.quantity) || 0;
  row.getCell(col.price).value = Number(item.price) || 0;
};

/* SINGLE EXPORT */
router.get("/export/:id", async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const itemCount = purchase.items.length;
    const templatePath = path.resolve(getTemplatePath(itemCount));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet("PR page 1");

    /* APPLY HEADER MAP */
    const header = getHeaderMap(itemCount);

    worksheet.getCell(header.name).value = purchase.name;
    worksheet.getCell(header.designation).value = purchase.designation;
    worksheet.getCell(header.department).value = purchase.department;
    worksheet.getCell(header.purpose).value = purchase.purpose;
    worksheet.getCell(header.signatory).value = purchase.signatory;

    /* APPLY COLUMN MAP */
    const col = getColumnMap(itemCount);

    let startRow = 9;

    purchase.items.forEach((item, index) => {
      const row = worksheet.getRow(startRow + index);
      fillRow(row, item, col);
      row.commit();
    });

    worksheet.getCell("E6").value =
      `Date: ${new Date(purchase.createdAt).toLocaleDateString("en-US")}`;

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

/* GROUP EXPORT */
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

    /* MERGE ITEMS */
    const map = {};

    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        const key =
          item.name.toLowerCase().replace(/[^a-z0-9]/g, "") +
          "_" +
          (item.unit || "").toLowerCase();

        if (!map[key]) {
          map[key] = {
            name: item.name,
            unit: item.unit,
            quantity: 0,
            totalCost: 0,
          };
        }

        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;

        map[key].quantity += qty;
        map[key].totalCost += price * qty;
      });
    });

    const mergedItems = Object.values(map).map((item) => ({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      price: item.quantity ? item.totalCost / item.quantity : 0,
    }));

    /* TEMPLATE SELECTION */
    const itemCount = mergedItems.length;
    const templatePath = path.resolve(getTemplatePath(itemCount));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet("PR page 1");

    const col = getColumnMap(itemCount);

    let startRow = 9;

    mergedItems.forEach((item, index) => {
      const row = worksheet.getRow(startRow + index);
      fillRow(row, item, col);
      row.commit();
    });

    worksheet.getCell("E6").value =
      `Date: ${new Date().toLocaleDateString("en-US")}`;

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