const Category = require('../models/category');
const Transaction = require('../models/transaction');
const Course = require('../models/course');
const User = require('../models/user');
const ApiError = require('../utils/apiError');
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
    const usersAll = await User.find({isActive: true, role: 'user'});
    const classPremium = await Course
        .find({isActive: true, typeClass: 'PREMIUM'});
    const classAll = await Course.find({isActive: true});
    const dateNow = new Date();
    const oneMonthAgo = new Date().setMonth(dateNow.getMonth() - 1);
    const chartUser = [];
    usersAll.map((user) => {
      if (user.createdAt >= oneMonthAgo) {
        chartUser.push(user);
      };
    });
    const transactionAll = await Transaction
        .find({isActive: true, status: 'Paid'});
    const chartTransaction = [];
    transactionAll.map((transaction) => {
      if (transaction.createdAt >= oneMonthAgo) {
        chartTransaction.push(transaction);
      };
    });
    const data = {
      activeUsers: usersAll.length,
      premiumClass: classPremium.length,
      activeClass: classAll.length,
      chartUser,
      chartTransaction,
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
