require("dotenv").config();
const client = require("../index");
const User = require("../../app/models/User");
const mongoose = require("mongoose");
const Category = require("../../app/models/Category");

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// client.connect().catch(err => console.log(err));
async function createDatabaseAndCollection() {
  try {
    await client.connect();
    const sampleUsers = [
      {
        email: "user1@example.com",
        password: "password123",
        phone: "123-456-7890",
        name: "John Doe",
        username: "john_doe",
        image_profile: "profile1.jpg",
        country: "USA",
        city: "New York",
        passwordResetExp: new Date(),
        otp: 123456,
        role: "user",
      },
      {
        email: "user2@example.com",
        password: "securepass",
        phone: "987-654-3210",
        name: "Jane Smith",
        username: "jane_smith",
        image_profile: "profile2.jpg",
        country: "Canada",
        city: "Toronto",
        passwordResetExp: new Date(),
        otp: 654321,
        role: "user",
      },
      {
        email: "admin@example.com",
        password: "adminpass",
        phone: "111-222-3333",
        name: "Admin User",
        username: "admin_user",
        image_profile: "admin_profile.jpg",
        country: "USA",
        city: "Los Angeles",
        passwordResetExp: new Date(),
        otp: 789012,
        role: "admin",
      },
    ];

    const sampleCategory = [
      {
        name: "UI/UX Design",
        imageCategory:
          "https://ik.imagekit.io/ku9epk6lrv/image_category_ui.png?updatedAt=1700640912911",
      },
      {
        name: "Product Management",
        imageCategory:
          "https://ik.imagekit.io/ku9epk6lrv/image_category_pm.png?updatedAt=1700641154773",
      },
      {
        name: "Web Development",
        imageCategory:
          "https://ik.imagekit.io/ku9epk6lrv/image_category_web.png?updatedAt=1700641154757",
      },
      {
        name: "Android Development",
        imageCategory:
          "https://ik.imagekit.io/ku9epk6lrv/image_category_android.png?updatedAt=1700641154777",
      },
      {
        name: "IOS Development",
        imageCategory:
          "https://ik.imagekit.io/ku9epk6lrv/image_category_ios.png?updatedAt=1700641154808",
      },
      {
        name: "Data Science",
        imageCategory:
          "https://ik.imagekit.io/ku9epk6lrv/image_category_ds.png?updatedAt=1700641181963",
      },
    ];

    await User.insertMany(sampleUsers)
      .then((createdUsers) => {
        console.log("Berhasil membuat data pengguna:", createdUsers);
      })
      .catch((error) => {
        console.error("Gagal membuat data pengguna:", error);
      })
      .finally(() => {
        console.log("Insert user finish");
      });

    await Category.insertMany(sampleCategory)
      .then((createdCategory) => {
        console.log("Berhasil membuat data category:", createdCategory);
      })
      .catch((error) => {
        console.error("Gagal membuat data category:", error);
      })
      .finally(() => {
        console.log("Insert category finish");
      });

      client.disconnect();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

createDatabaseAndCollection();
