const express = require("express");
const router = express.Router();
module.exports = router;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany(); 
    res.json(employees);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next({ status: 400, message: "Employee name must be provided..." });
  }

  try {
    const employee = await prisma.employee.create({ 
      data: { name } 
    });
    res.status(201).json(employee);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const randomEmployee = await prisma.employee.findFirst({
     skip: +id,
    });

    if(randomEmployee) {
      res.json(randomEmployee);
    } else {
      next({ status: 404, message: `There is no employee with id ${id}.`});
    }
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  console.log(id);
  console.log(name);
  
  if (!name) {
    return next({ status: 400, message: "A new name must be provided." });
  }
  
  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });

    if (!employee) {
      return next({
        status: 404,
        message: `Employee with id ${id} does not exist.`,
      });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: +id },
      data: { name },
    });
    res.json(updatedEmployee);  
  } catch (e) {
    console.error("Error updating employee by ID:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      return next({
        status: 404,
        message: `Employee with id ${id} does not exist.`,
      });
    }

    await prisma.employee.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    console.error("Error deleting employee by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
