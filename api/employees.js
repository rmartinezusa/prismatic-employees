const express = require("express");
const router = express.Router();
module.exports = router;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany(); 
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/random", async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count();
    const randomEmployee = await prisma.employee.findFirst({
      skip: Math.floor(Math.random() * totalEmployees),
    });
    res.json(randomEmployee);
  } catch (error) {
    console.error("Error fetching random employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
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

router.post("/", (req, res, next) => {
    res.json("employees call DB by POST");
});

