const Category = require('../models/category');
const Transaction = require('../models/transaction');
const Course = require('../models/course');
const User = require('../models/user');
const ApiError = require('../utils/apiError');
const moment = require('moment');
const {resSuccess} = require('./resBase');


const getCategoryCourse = async (req, res) => {
  try {
    const data = await Category.find();
    data.unshift({
      name: 'All',
      imageCategory: 'https://ik.imagekit.io/ku9epk6lrv/all_category.jpg?updatedAt=1702695827000',
    });
    res.status(200)
        .send(resSuccess('Get all category course successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getCategoryProgress = (req, res) => {
  const data = [
    {
      name: 'All',
    },
    {
      name: 'Progress',
    },
    {
      name: 'Done',
    },
  ];
  res.status(200)
      .send(resSuccess('Get all category progress successfully', data));
};

const getCategoryTypeClass = (req, res) => {
  const data = [
    {
      name: 'All',
    },
    {
      name: 'Premium',
    },
    {
      name: 'Free',
    },
  ];
  res.status(200)
      .send(resSuccess('Get all category type class successfully', data));
};

const getStatistik = async (req, res, next) => {
  try {
    const classPremium = await Course
        .find({isActive: true, typeClass: 'PREMIUM'});
    const classAll = await Course.find({isActive: true});
    const usersAll = await User.find({isActive: true, role: 'user'});
    const startOfMonth = moment().startOf('month');

    // Membuat array dummy untuk Week 1 sampai Week 4
    const dummyWeeks = [];
    for (let i = 0; i < 4; i++) {
      const startOfWeek = moment(startOfMonth).add(i, 'weeks');
      const endOfWeek = moment(startOfWeek).add(6, 'days');

      dummyWeeks.push({
        week: i + 1,
        start: startOfWeek.format('YYYY-MM-DD'),
        end: endOfWeek.format('YYYY-MM-DD'),
        total: 0,
      });
    }

    const chartUser = JSON.parse(JSON.stringify(dummyWeeks));
    usersAll.forEach((user) => {
      chartUser.forEach((week, index) => {
        if (moment(user.createdAt).isBetween(week.start, week.end)) {
          chartUser[index].total++;
        }
      });
    });

    const transactionAll = await Transaction
        .find({isActive: true, status: 'Paid'});
    const chartTransaction = JSON.parse(JSON.stringify(dummyWeeks));
    transactionAll.forEach((transaction) => {
      chartTransaction.forEach((week, index) => {
        if (moment(transaction.createdAt).isBetween(week.start, week.end)) {
          chartTransaction[index].total += transaction.totalPrice;
        };
      });
    });
    const data = {
      activeUsers: usersAll.length,
      premiumClass: classPremium.length,
      activeClass: classAll.length,
      chartTransaction,
      chartUser,
    };
    res.status(200)
        .send(resSuccess('Get statistik successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  };
};

module.exports = {
  getCategoryCourse,
  getCategoryProgress,
  getCategoryTypeClass,
  getStatistik,
};
