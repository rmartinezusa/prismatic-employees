const express = require("express");
const app = express();
const PORT = 3000;
const { Prisma } = require("@prisma/client");

app.use(express.json());

// Logger 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the Prismatic Employees API.");
});

app.use("/employees", require("./api/employees"));

// 404 Error handling
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

app.use((err, req, res, next) => {

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      err.status = 404;
    } else if (err.code === "P2009") {
      err.status = 400;
    } else if (err.code === "P2014") {
      err.status = 403;
    } else if (err.code === "P2002") {
      err.status = 409;
    } else if (err.code === "P2003") {
      err.status = 422;
    } else if (err.code === "P2011") {
      err.status = 500;
    }
    next(err);
  } else {
    next(err);
  }

});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong!");
});

app.listen(PORT, () => {
  `Listening on port ${PORT}...`;
});