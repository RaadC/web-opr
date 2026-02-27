import express from "express";
import ExcelJS from "exceljs";
import Purchase from "../models/purchase.js";
import path from "path";

const router = express.Router();

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

    if (!worksheet) {
      return res.status(500).json({ message: "Worksheet not found" });
    }

    worksheet.getCell("C40").value = purchase.name;
    worksheet.getCell("C41").value = purchase.designation;
    worksheet.getCell("A6").value = purchase.department;
    worksheet.getCell("C36").value = purchase.purpose;
    worksheet.getCell("D40").value = purchase.signatory;

    // row to fill
    let startRow = 9;

    const items = purchase.items || [];

    items.forEach((item, index) => {
      const row = worksheet.getRow(startRow + index);

      row.getCell(2).value = item.unit;
      row.getCell(3).value = item.name;
      row.getCell(4).value = item.quantity;
      row.getCell(5).value = item.price;
      //row.getCell(6).value = item.quantity * item.price; //uncomment when template used is without (qty x unit cost)

      row.commit();
    });

    const date = new Date(purchase.createdAt);
    const options = { month: "short", day: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    worksheet.getCell("E6").value = `Date: ${formattedDate}`;

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

export default router;
