const Customer = require("../models/customerModel");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
const Menu = require("../models/menuModel")
const catchAsync = require("../utils/catchAsync");
const Order = require("../models/orderModel");
const getFisrtDayOfTheWeek = require("../utils/getFirstDayOfTheWeek")




exports.defaultDashboard = catchAsync(async (req, res, next) => {

  // ====== Default Dashboard ==============
  const dashboard = await generateDefaultDashboard();

  // ====== weekly Statics ==============

  const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
  const firstDay = getFisrtDayOfTheWeek(today);


  const days = await generateWeeklyOrders(today, firstDay);

  // ====== Today Order Updates ==============

  const ordersByStatus = await Order.aggregate([
    // First Stage
    {
      $match: { "date": new Date(today) }

    },
    // Second Stage
    {
      $group: {
        _id: '$status',
        date: { $first: "$date" },
        amount: { $sum: "$total" },
        orders: { $sum: 1 },

      }
    },

    // Third Stage
    {
      $sort: { orders: -1 }
    }
  ])

  res.status(200).json({
    message: "Sucess",
    data: {
      dashboard: dashboard,
      'Weekly Statics': {
        "weekly Orders": days,
        "New Order Updates": ordersByStatus
      }
    },
  });
});



const generateTotal = (list, field = "balance") => {
  let total = 0;

  for (let index = 0; index < list.length; index++) {
    const element = list[index];

    if (element[field]) {
      total += element[field];
    }
  }

  return total;
};

const generateWeeklyOrders = async (today, firstDayOftheWeek) => {
  const thisweekOrders = await Order.aggregate([
    // First Stage
    {
      $match: { "date": { $lte: new Date(today), $gte: new Date(firstDayOftheWeek) } }

    },
    // Second Stage
    {
      $group: {
        _id: '$date',

        amount: { $sum: "$total" },
        count: { $sum: 1 },
      }
    },

    // Third Stage
    {
      $sort: { count: -1 }
    }
  ])

  const days = [
    {
      day: "SUN",
      orders: 0
    },
    {
      day: "MON",
      orders: 0
    },
    {
      day: "TUE",
      orders: 0
    },
    {
      day: "WED",
      orders: 0
    },
    {
      day: "THU",
      orders: 0
    },
    {
      day: "Friday",
      orders: 0
    },
    {
      day: "SAT",
      orders: 0
    },
  ];

  for (let index = 0; index < thisweekOrders.length; index++) {
    const day = thisweekOrders[index];
    days[day._id.getDay()] = {
      ...days[day._id.getDay()],
      orders: day.count
    }
  }

  return days;
}

const generateDefaultDashboard = async () => {
  const customerTransactions = await Customer.aggregate([
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "customer",
        as: "transactions"
      }
    },
    {
      $addFields: {
        debit: { $sum: "$transactions.debit" },
        credit: { $sum: "$transactions.credit" },
        balance: {
          $subtract: [{ $sum: "$transactions.debit" }, { $sum: "$transactions.credit" }]
        }
      }
    },
  ]);

  const orders = await Order.find();
  const menus = await Menu.find();

  var menuProducts = 0;

  menus.forEach(menu => {
    menuProducts += menu.menuProducts.length;
  });

  const customers = await Customer.find();
  const employees = await Employee.count();
  const menusLength = await Menu.count();
  const ordersLength = await Order.count();
  const users = await User.count();

  const recievable = generateTotal(customerTransactions);
  const revenue = generateTotal(orders, field = 'total');

  return [
    { label: "Customers", value: customers.length, isMoney: false },
    { label: "Recievable", value: recievable, isMoney: true },
    { label: "Products", value: menuProducts, isMoney: true },
    { label: "Employee", value: employees, isMoney: false },
    { label: "Users", value: users, isMoney: false },
    { label: "Menus", value: menusLength, isMoney: false },
    { label: "Orders", value: ordersLength, isMoney: false },
    { label: "Revenue", value: revenue, isMoney: true },
  ]
}