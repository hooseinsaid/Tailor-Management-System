const express = require('express');
var bodyParser = require('body-parser')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes")
const companyInfoRoutes = require("./routes/companyInfoRoutes");
const orderRoutes = require("./routes/orderRoutes")
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes")
const styleRoutes = require("./routes/styleRoutes");
const menuRoutes = require("./routes/menuRoutes");
const employeeTitleRoutes = require("./routes/employeeTitleRoutes");
const fileRoutes = require("./routes/fileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cors = require('cors')

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);


// 3) ROUTES
app.use(bodyParser());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/companyInfo', companyInfoRoutes)
app.use('/api/v1/employee-titles', employeeTitleRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/transactions", transactionRoutes)
app.use("/api/v1/styles", styleRoutes);
app.use("/api/v1/menus", menuRoutes)
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/dashboard", dashboardRoutes)

app.get("/api/v1/test", (req,res,next)=>{
  res.status(200).json({
    message : "success",
    data: {
      isOn: true,
      test: "scucessfully tested"
    }
  })
})
app.all('*', (req, res, next) => {
  next(new AppError(`cant't found ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
