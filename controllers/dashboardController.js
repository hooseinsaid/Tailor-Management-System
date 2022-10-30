const Customer = require("../models/customerModel");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
const Menu = require("../models/menuModel")
const catchAsync = require("../utils/catchAsync");
const Order = require("../models/orderModel");
const APIFeatures = require("../utils/apiFeatures")




exports.defaultDashboard = catchAsync(async (req, res, next) => {


  // ====== Variables ==============

  const orders = await Order.find({ status: { $ne: "cancelled" } });
  const menus = await Menu.find();
  const customers = await Customer.find();
  const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
  const firstDayOftheMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${1}`;
  const firstDayOftheLast7Days = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() - 6}`;

  // ====== Default Dashboard ==============

  const dashboard = await generateDefaultDashboard(orders, menus, customers);

  // ====== weekly Statics ==============

  const WeeklyOrdersByDays = await generateWeeklyOrders(today, firstDayOftheLast7Days);

  // ====== Today Order Updates ==============

  const ordersByStatus = await generateOrderByStatus();

  // ====== Revenu Stats ==============

  const revenueStats = await generateRevenuStats(today);

  // ====== Orders By Employee ==============

  const top5Employees = await generateTop5ServerdEmployees(today, firstDayOftheMonth);

  // ====== This Month Total Orders ==============

  const thisMonthOrders = await Order.find({ status: { $ne: "cancelled" }, date: { $gte: firstDayOftheMonth, $lte: today }, }).count();

  // ====== Top 5 Customers ==============

  const top5Customers = await generateTop5Customers();

  const top5CustomersByOrder = await generateTop5OrderedCustomers(today, firstDayOftheMonth);

  res.status(200).json({
    message: "Sucess",
    data: {
      dashboard: {
        summary: dashboard,
        weekly: {
          weeklyOrders: WeeklyOrdersByDays,
          newOrderUpdates: ordersByStatus,
          revenueStats,
        },
        monthly: {
          top5Employees,
          thisMonthOrders,
          recievable: dashboard[1].value,
          revenue: dashboard[7].value
        },
        other: {
          top5Customers,
          top5CustomersByOrder
        }
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

const generateWeeklyOrders = async (today, firstDayOftheLast7Days) => {
  const thisweekOrders = await Order.aggregate([
    // First Stage
    {
      $match: { "date": { $lte: new Date(today), $gte: new Date(firstDayOftheLast7Days) } }

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
      $sort: { _id: 1 }
    }
  ])
  // const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // for (let index = 0; index < thisweekOrders.length; index++) {
  //   const day = thisweekOrders[index];
  //   const dayIndex = day._id.getDay();
  //   thisweekOrders[index] = {
  //     day : days[dayIndex],
  //     orders : day.count,
  //     date : day._id
  //   }
  // }

  const days = [
    {
      day: "SAT",
      orders: 0
    },
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
    
  ];

  for (let index = 0; index < thisweekOrders.length; index++) {
    const day = thisweekOrders[index];
    const dayIndex = day._id.getDay() == 6 ? 0 : day._id.getDay() + 1
    days[dayIndex] = {
      ...days[dayIndex],
      orders: day.count,
      date : day._id
    }
  }
  return days;
}

const generateDefaultDashboard = async (orders, menus, customers) => {
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


  var menuProducts = 0;

  menus.forEach(menu => {
    menuProducts += menu.menuProducts.length;
  });

  const employees = await Employee.count();
  const menusLength = await Menu.count();
  const ordersLength = await Order.count();
  const users = await User.count();

  const recievable = generateTotal(customerTransactions);
  const revenue = generateTotal(orders, field = 'total');

  return [
    { label: "Customers", value: customers.length, isMoney: false },
    { label: "Recievable", value: recievable, isMoney: true },
    { label: "Products", value: menuProducts, isMoney: false },
    { label: "Employee", value: employees, isMoney: false },
    { label: "Users", value: users, isMoney: false },
    { label: "Menus", value: menusLength, isMoney: false },
    { label: "Orders", value: ordersLength, isMoney: false },
    { label: "Revenue", value: revenue, isMoney: true },
  ]
}

const generateRevenuStats = async (today) => {
  const orders = await Order.find({ date: today });
  var advancedMoney = 0;
  var ownedMoney = 0;
  var payedMoney = 0;
  var estimatedPorfit = 0;

  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];
    advancedMoney += order.advance;
    ownedMoney += order.balance;
    estimatedPorfit += order.total;
    payedMoney += order.total - order.balance - advancedMoney;
  }

  return {
    advancedMoney,
    ownedMoney,
    estimatedPorfit,
    payedMoney
  }
};

const generateOrderByStatus = async () => {
  return await Order.aggregate([
    // First Stage
    {
      // $match: { "date": new Date(today) }
      $match: { "status": { $ne: "cancelled" } }
    },
    // Second Stage
    {
      $group: {
        _id: '$status',
        // date: { $first: "$date" },
        amount: { $sum: "$total" },
        orders: { $sum: 1 },

      }
    },

    // Third Stage
    {
      $sort: { orders: -1 }
    },
    {
      $addFields: { status: "$_id" }
    },
    {
      $project: { _id: 0 }
    }
  ]);
}

const generateTop5ServerdEmployees = async (today, firstDayOftheMonth) => {
  return await Order.aggregate([
    {
      $match: {
        "date": { $lte: new Date(today), $gte: new Date(firstDayOftheMonth) },
        "status": { $ne: "cancelled" },
        "servedUser": {
          "$nin": [null, ""]
        },
      }

    },
    { $lookup: { from: 'users', localField: 'servedUser', foreignField: '_id', as: 'user' } },
    { $unwind: "$user" },

    {
      $group: {
        _id: '$servedUser',
        // _id: {servedUser:"$servedUser", status:"$status"},
        username: { $first: "$user.username" },
        name: { $first: "$user.name" },
        amount: { $sum: "$total" },
        orders: { $sum: 1 },
      }
    },

    {
      $sort: { amount: 1 }
    },

    { $limit: 5 },
  ])
}

const generateTop5OrderedCustomers = async (today, firstDayOftheMonth) => {
  return await Order.aggregate([
    {
      $match: {
        "date": { $lte: new Date(today), $gte: new Date(firstDayOftheMonth) },
        "status": { $ne: "cancelled" },
      }

    },
    { $lookup: { from: 'customers', localField: 'customer', foreignField: '_id', as: 'theCustomer' } },
    { $unwind: "$theCustomer" },

    {
      $group: {
        _id: '$customer',
        username: { $first: "$theCustomer.name" },
        orders: { $sum: 1 },
      }
    },

    {
      $sort: { orders: 1 }
    },


    { $limit: 5 },
  ])
}

const generateTop5Customers = async () => {
  return Customer.aggregate([
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
    { $sort: { balance: -1 } },
    { $limit: 5 },
  ]);
}