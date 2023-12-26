const Category = require('../models/category');
const Course = require('../models/course');
const Progress = require('../models/progress');
const Purchase = require('../models/purchase');
const ApiError = require('../utils/apiError');
const {resSuccess} = require('./resBase');

const createCourse = async (req, res, next) => {
  const {
    title,
    category,
    classCode,
    typeClass,
    level,
    price,
    description,
  } = req.body;

  try {
    // eslint-disable-next-line max-len
    if (!title || !category || !classCode || !typeClass || !level || !price || !description) {
      return next(new ApiError('All fields are mandatory', 400));
    };
    // eslint-disable-next-line max-len
    const capitalizedLevel = level[0].toUpperCase() + level.slice(1).toLowerCase();
    const capitalizedTypeClass = typeClass.toUpperCase();
    const newCourse = {
      title,
      category,
      classCode,
      typeClass: capitalizedTypeClass,
      level: capitalizedLevel,
      price,
      description,
      createdBy: req.user._id,
    };
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return next(new ApiError('Id category not found', 404));
    };
    const response = await Course.create(newCourse);
    res.status(201).send(resSuccess('Create course successfully', response));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateCourse = async (req, res, next) => {
  const id = req.params.id;
  const {
    title,
    description,
    classCode,
    category,
    typeClass,
    level,
    price,
    totalRating,
    targetAudience,
  } = req.body;

  try {
    let thumbnail;
    if (req.uploadImage) {
      thumbnail = req.uploadImage.url;
    }

    const targetAudienceArray = targetAudience.split(',');
    const newData = {
      title,
      description,
      thumbnail,
      classCode,
      category,
      typeClass,
      level,
      price,
      totalRating,
      targetAudience: targetAudienceArray,
      updatedAt: new Date().getTime() + 7 * 60 * 60 * 1000,
      updatedBy: req.user._id,
    };
    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return next(new ApiError('Id category not found', 404));
      };
    }
    const response = await Course.findByIdAndUpdate(id, newData, {new: true});

    res.status(200).send(resSuccess('Update course successfully', response));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getAllCourses = async (req, res, next) => {
  const {category, typeClass, level, title, latest, popular} = req.query;
  try {
    const filter = {
      isActive: true,
    };
    let sort = 'title';
    let limit = 0;

    if (title) {
      filter.title = {$regex: '.*' + title + '.*', $options: 'i'};
    }
    if (typeClass) {
      filter.typeClass = {$regex: '.*' + typeClass + '.*', $options: 'i'};
    }
    if (category) {
      const categoriesArray = category.split(',');
      const categoryObjects = await Category.find({
        name: {
          $in: categoriesArray.map((cat) => new RegExp(cat.trim(), 'i')),
        },
      });
      const categoryIds = categoryObjects.map((category) => category._id);
      filter.category = {$in: categoryIds};
    }
    if (level) {
      const levelsArray = level.split(',');
      filter.level = {$regex: levelsArray.join('|'), $options: 'i'};
    }
    if (latest === 'true') {
      filter.createdAt = {$gt: Date.now() - 1 * 60 * 60 * 24 * 5 * 1000};
    }
    if (popular === 'true') {
      sort = '-sold';
      limit = 3;
    }

    const data = await Course.find(filter)
        .select('-__v -chapters -updatedBy')
        .populate('category createdBy', '_id name')
        .sort(sort)
        .limit(limit);

    res.status(200).send(resSuccess('Get all course successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};
const getCourseById = async (req, res, next) => {
  const {id} = req.params;
  const idUser = req.user;
  try {
    const purchase = await Purchase.findOne({courseId: id, userId: req.user});
    const checkCourse = await Course.findById(id);
    // eslint-disable-next-line max-len
    if (purchase || checkCourse.typeClass == 'FREE' || req.user.role == 'admin') {
      const course = await Course.findOne({_id: id, isActive: true})
          .populate({
            path: 'chapters',
            match: {isActive: true},
            select: '-__v',
          })
          .populate('category createdBy', 'name')
          .select('-__v -updatedBy');
      if (req.user.role != 'admin') {
        let findProgress = await Progress.findOne({
          userId: idUser,
          courseId: id,
        });
        if (!findProgress) {
          findProgress = await Progress.create({
            userId: idUser,
            courseId: id,
          });
        }
        const updatedChapters = course.chapters.map((chapter) => {
          const updatedVideos = chapter.videos.map((video) => ({
            title: video.title,
            duration: video.duration,
            videoUrl: video.videoUrl,
            index: video.index,
            isWatch: findProgress.indexProgress >= video.index ? true : false,
            // eslint-disable-next-line max-len
            nextVideo: findProgress.indexProgress + 1 == video.index ? true : null,
          }));
          return {...chapter._doc, videos: updatedVideos};
        });

        const cleanedCourse = {
          ...course._doc,
          chapters: updatedChapters.map((chapter) => {
            return {
              ...chapter, videos: chapter.videos.map(({_doc, ...rest}) => rest),
            };
          }),
        };
        return res.status(200).send(
            resSuccess('Get course successfully', cleanedCourse),
        );
      }
      return res.status(200)
          .send(resSuccess('Get course successfully', course));
    }
    const course = await Course.findOne({_id: id, isActive: true})
        .populate({
          path: 'chapters',
          match: {isActive: true},
          select: '-__v -videos.videoUrl',
        })
        .populate('category createdBy', 'name')
        .select('-__v');
    res.status(200).send(resSuccess('Get course successfully', course));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const {id} = req.params;
    await Course.findByIdAndUpdate(id, {isActive: false});
    res.status(200).send(resSuccess('Delete course successfully', null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};
module.exports = {
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
};
