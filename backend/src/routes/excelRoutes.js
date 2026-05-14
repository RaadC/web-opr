import express from "express";
import ExcelJS from "exceljs";
import Purchase from "../models/purchase.js";
import path from "path";
import { strictLimiter, getLimiter } from "../middleware/rateLimit.js";
import idempotencyMiddleware from "../middleware/idempotency.js";

const router = express.Router();

/* TEMPLATE SELECTOR */
const getTemplatePath = (count) => {
  if (count <= 25) {
    return "templates/pr-template_25.xlsx";
  } else if (count <= 45) {
    return "templates/pr-template_45.xlsx";
  } else if (count <= 65) {
    return "templates/pr-template_65.xlsx";
  } else if (count <= 85) {
    return "templates/pr-template_85.xlsx";
  } else if (count <= 105) {
    return "templates/pr-template_105.xlsx";
  } else if (count <= 125) {
    return "templates/pr-template_125.xlsx";
  } else {
    return "templates/pr-template_145.xlsx";
  }
};

/* HEADER MAP */
const getHeaderMap = (count) => {
  if (count <= 25) {
    return {
      name: "C39",
      designation: "C40",
      department: "A6",
      purpose: "C35",
      signatory: "D39",
    };
  } else if (count <= 45) {
    return {
      name: "C59",
      designation: "C60",
      department: "A6",
      purpose: "C55",
      signatory: "D59",
    };
  } else if (count <= 65) {
    return {
      name: "C79",
      designation: "C80",
      department: "A6",
      purpose: "C75",
      signatory: "D79",
    };
  } else if (count <= 85) {
    return {
      name: "C99",
      designation: "C100",
      department: "A6",
      purpose: "C95",
      signatory: "D99",
    };
  } else if (count <= 105) {
    return {
      name: "C119",
      designation: "C120",
      department: "A6",
      purpose: "C115",
      signatory: "D119",
    };
  } else if (count <= 125) {
    return {
      name: "C139",
      designation: "C140",
      department: "A6",
      purpose: "C135",
      signatory: "139",
    };
  } else {
    return {
      name: "C159",
      designation: "C160",
      department: "A6",
      purpose: "C155",
      signatory: "D159",
    };
  }
};

// COLUMN MAP
const getColumnMap = () => {
  return {
    unit: 2,
    name: 3,
    qty: 4,
    price: 5,
  };
};

// HELPER: FILL ROW
const fillRow = (row, item, col) => {
  row.getCell(col.unit).value = item.unit;
  row.getCell(col.name).value = item.name;
  row.getCell(col.qty).value = Number(item.quantity) || 0;
  row.getCell(col.price).value = Number(item.price) || 0;
};

//SINGLE EXPORT
router.get("/export/:id", getLimiter, async (req, res) => {
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

    const header = getHeaderMap(itemCount);

    worksheet.getCell(header.name).value = purchase.name;
    worksheet.getCell(header.designation).value = purchase.designation;
    worksheet.getCell(header.department).value = purchase.department;
    worksheet.getCell(header.purpose).value = purchase.purpose;
    worksheet.getCell(header.signatory).value = purchase.signatory;

    const col = getColumnMap();

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
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=purchase_${purchase._id}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating Excel" });
  }
});

//GROUP EXPORT
router.post("/group-export", strictLimiter, idempotencyMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const purchases = await Purchase.find({ _id: { $in: ids } });

    if (!purchases.length) {
      return res.status(404).json({ message: "No purchases found" });
    }

    // ITEMS
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

    //BUILD PIVOT
    const pivot = {};
    const departments = new Set();

    purchases.forEach((p) => {
      const dept = p.department || "N/A";
      departments.add(dept);

      (p.items || []).forEach((item) => {
        if (!pivot[item.name]) pivot[item.name] = {};
        if (!pivot[item.name][dept]) pivot[item.name][dept] = 0;

        pivot[item.name][dept] += Number(item.quantity) || 0;
      });
    });

    const deptList = Array.from(departments);
    const itemList = Object.keys(pivot);

    //LOAD TEMPLATE
    const itemCount = mergedItems.length;
    const templatePath = path.resolve(getTemplatePath(itemCount));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet("PR page 1");

    const col = getColumnMap();

    let startRow = 9;

    //LEFT TABLE
    mergedItems.forEach((item, index) => {
      const row = worksheet.getRow(startRow + index);
      fillRow(row, item, col);
      row.commit();
    });

    //RIGHT SIDE
    const pivotStartCol = 12;
    const pivotStartRow = 10;

    const headerRow = worksheet.getRow(pivotStartRow);

    headerRow.getCell(pivotStartCol).value = "Item";

    deptList.forEach((dept, i) => {
      headerRow.getCell(pivotStartCol + 1 + i).value = dept;
    });

    headerRow.font = { bold: true };
    headerRow.commit();

    itemList.forEach((itemName, rowIndex) => {
      const row = worksheet.getRow(pivotStartRow + 1 + rowIndex);

      row.getCell(pivotStartCol).value = itemName;

      deptList.forEach((dept, colIndex) => {
        row.getCell(pivotStartCol + 1 + colIndex).value =
          pivot[itemName][dept] || 0;
      });

      row.commit();
    });

    worksheet.getCell("E6").value =
      `Date: ${new Date().toLocaleDateString("en-US")}`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=grouped_purchase.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Grouped export error" });
  }
});

export default router;
