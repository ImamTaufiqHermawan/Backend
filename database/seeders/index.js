/* eslint-disable require-jsdoc */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const client = require('../index');
const User = require('../../app/models/user');
const Category = require('../../app/models/category');
const Chapter = require('../../app/models/chapter');
const Course = require('../../app/models/course');

// client.connect().catch(err => console.log(err));
const hashedPassword = bcrypt.hashSync('adminpass', 10);
const hashedPassworduser1 = bcrypt.hashSync('password123', 10);
const hashedPassworduser2 = bcrypt.hashSync('securepass', 10);
async function createDatabaseAndCollection() {
  try {
    await client.connect();
    const sampleUsers = [
      {
        email: 'user1@example.com',
        password: hashedPassworduser1,
        phone: '1234567890',
        name: 'John Doe',
        username: 'john_doe',
        image_profile: 'profile1.jpg',
        country: 'Tangerang',
        city: 'New York',
        role: 'user',
      },
      {
        email: 'user2@example.com',
        password: hashedPassworduser2,
        phone: '9876543210',
        name: 'Jane Smith',
        username: 'jane_smith',
        image_profile: 'profile2.jpg',
        country: 'Bekasi',
        city: 'Toronto',
        role: 'user',
      },
      {
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '1112223333',
        name: 'Admin User',
        username: 'admin_user',
        image_profile: 'admin_profile.jpg',
        country: 'Depok',
        city: 'Los Angeles',
        role: 'admin',
      },
    ];

    const sampleCategory = [
      {
        name: 'UI/UX Design',
        imageCategory: 'https://ik.imagekit.io/ku9epk6lrv/image_category_ui.png?updatedAt=1700640912911',
      },
      {
        name: 'Product Management',
        imageCategory: 'https://ik.imagekit.io/ku9epk6lrv/image_category_pm.png?updatedAt=1700641154773',
      },
      {
        name: 'Web Development',
        imageCategory: 'https://ik.imagekit.io/ku9epk6lrv/image_category_web.png?updatedAt=1700641154757',
      },
      {
        name: 'Android Development',
        imageCategory: 'https://ik.imagekit.io/ku9epk6lrv/image_category_android.png?updatedAt=1700641154777',
      },
      {
        name: 'IOS Development',
        imageCategory: 'https://ik.imagekit.io/ku9epk6lrv/image_category_ios.png?updatedAt=1700641154808',
      },
      {
        name: 'Data Science',
        imageCategory: 'https://ik.imagekit.io/ku9epk6lrv/image_category_ds.png?updatedAt=1700641181963',
      },
    ];

    const sampleChapter = [
      {
        title: 'Chapter 1 - Pendahuluan',
        totalDuration: 60,
        videos: [
          {
            index: 1,
            title: 'Tujuan Mengikuti Kelas Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/ixOd42SEUF0',
          },
          {
            index: 2,
            title: 'Pengenalan Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/DwTkyMJi890',
          },
          {
            index: 3,
            title: 'Contoh Dalam Membangun Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/rd-590n3H6w',
          },
        ],
      },
      {
        title: 'Chapter 2 - Memulai Desain',
        totalDuration: 120,
        videos: [
          {
            index: 4,
            title: 'Color Palette',
            duration: 60,
            videoUrl: 'https://youtu.be/HYfG_uCOlhc',
          },
          {
            index: 5,
            title: 'Desain Respon',
            duration: 60,
            videoUrl: 'https://youtu.be/DmxXl1k0X5g',
          },
        ],
      },
      {
        title: 'Chapter 1 - Pendahuluan',
        totalDuration: 60,
        videos: [
          {
            index: 1,
            title: 'Tujuan Mengikuti Kelas Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/ixOd42SEUF0',
          },
          {
            index: 2,
            title: 'Pengenalan Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/DwTkyMJi890',
          },
          {
            index: 3,
            title: 'Contoh Dalam Membangun Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/rd-590n3H6w',
          },
        ],
      },
      {
        title: 'Chapter 2 - Memulai Desain',
        totalDuration: 120,
        videos: [
          {
            index: 4,
            title: 'Color Palette',
            duration: 60,
            videoUrl: 'https://youtu.be/ixOd42SEUF0',
          },
          {
            index: 5,
            title: 'Desain Respon',
            duration: 60,
            videoUrl: 'https://youtu.be/DwTkyMJi890',
          },
        ],
      },
      {
        title: 'Chapter 1 - Pendahuluan',
        totalDuration: 60,
        videos: [
          {
            index: 1,
            title: 'Tujuan Mengikuti Kelas Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/ixOd42SEUF0',
          },
          {
            index: 2,
            title: 'Pengenalan Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/DwTkyMJi890',
          },
          {
            index: 3,
            title: 'Contoh Dalam Membangun Design System',
            duration: 20,
            videoUrl: 'https://youtu.be/rd-590n3H6w',
          },
        ],
      },
      {
        title: 'Chapter 2 - Memulai Desain',
        totalDuration: 120,
        videos: [
          {
            index: 4,
            title: 'Color Palette',
            duration: 60,
            videoUrl: 'https://youtu.be/ixOd42SEUF0',
          },
          {
            index: 5,
            title: 'Desain Respon',
            duration: 60,
            videoUrl: 'https://youtu.be/DwTkyMJi890',
          },
        ],
      },
    ];

    let chapter1Course1;
    let chapter2Course1;
    let chapter1Course2;
    let chapter2Course2;
    let chapter1Course3;
    let chapter2Course3;

    let categoryUiux;

    await User.insertMany(sampleUsers)
        .then((createdUsers) => {
          console.log('Berhasil membuat data pengguna:', createdUsers);
        })
        .catch((error) => {
          console.error('Gagal membuat data pengguna:', error);
        })
        .finally(() => {
          console.log('Insert user finish');
        });

    await Category.insertMany(sampleCategory)
        .then((createdCategory) => {
          console.log('Berhasil membuat data category:', createdCategory);
          categoryUiux = createdCategory[0]._id;
        })
        .catch((error) => {
          console.error('Gagal membuat data category:', error);
        })
        .finally(() => {
          console.log('Insert category finish');
        });

    await Chapter.insertMany(sampleChapter)
        .then((createdChapter) => {
          console.log('Berhasil membuat data Chapter:', createdChapter);
          chapter1Course1 = createdChapter[0]._id;
          chapter2Course1 = createdChapter[1]._id;
          chapter1Course2 = createdChapter[2]._id;
          chapter2Course2 = createdChapter[3]._id;
          chapter1Course3 = createdChapter[4]._id;
          chapter2Course3 = createdChapter[5]._id;
        })
        .catch((error) => {
          console.error('Gagal membuat data chapter:', error);
        })
        .finally(() => {
          console.log('Insert chapter finish');
        });

    const sampleCourse = [
      {
        'title': 'Belajar Web Designer dengan Figma',
        'description': `
          Design system adalah kumpulan komponen design, code, ataupun 
          dokumentasi yang dapat digunakan sebagai panduan utama yang
          memunginkan designer serta developer memiliki lebih banyak
          kontrol atas berbagai platform. Dengan hadirnya design system,
          dapat menjaga konsistensi tampilan user interface dan meningkatkan 
          user experience menjadi lebih baik. Disisi bisnis, design system 
          sangat berguna dalam menghemat waktu dan biaya ketika mengembangkan 
          suatu produk.
          `,
        'thumbnail': 'https://ik.imagekit.io/ku9epk6lrv/image_category_ui.png?updatedAt=1700640912911',
        'classCode': 'P1000',
        'category': categoryUiux,
        'typeClass': 'FREE',
        'level': 'Beginner',
        'price': 0,
        'targetAudience': [
          '1. Anda yang ingin memahami poin penting design system',
          `2. Anda yang ingin membantu perusahaan lebih optimal dalam
           membuat design produk`,
          '3. Anda yang ingin latihan membangun design system',
          '4. Anda yang ingin latihan membangun design system ',
        ],
        'totalModule': 2,
        'totalRating': 5.0,
        'totalDuration': 180,
        'chapters': [
          chapter1Course1,
          chapter2Course1,
        ],
        'sold': 0,
      },
      {
        'title': 'Menguasai Figma dengan Modern UI Dashboard Design',
        'description': `
          Bersama mentor XXX, kita akan mempelajari design system 
          dari mulai manfaat, alur kerja pembuatannya, tools yang digunakan, 
          hingga pada akhirnya, kita akan membuat MVP dari design system. 
          Selain itu, mentor juga akan menjelaskan berbagai resource yang 
          dibutuhkan untuk mencari inspirasi mengenai design system.
          `,
        'thumbnail': 'https://ik.imagekit.io/ku9epk6lrv/image_category_ui.png?updatedAt=1700640912911',
        'classCode': 'P2000',
        'category': categoryUiux,
        'typeClass': 'FREE',
        'level': 'Intermediate',
        'price': 0,
        'targetAudience': [
          '1. Anda yang ingin memahami poin penting design system',
          `2. Anda yang ingin membantu perusahaan lebih optimal 
          dalam membuat design produk`,
          '3. Anda yang ingin latihan membangun design system',
          '4. Anda yang ingin latihan membangun design system ',
        ],
        'totalModule': 2,
        'totalRating': 4.8,
        'totalDuration': 180,
        'chapters': [
          chapter1Course2,
          chapter2Course2,
        ],
        'sold': 0,
      },
      {
        'title': 'Membuat Grid System dengan Figma',
        'description': `
          Kelas ini sesuai untuk Anda yang ingin memahami apa itu 
          design system. Tidak hanya ditujukan untuk UI/UX Designer 
          ataupun Developer, kelas ini sangat sesuai untuk stakeholder 
          lain agar dapat memudahkan tim dalam bekerja sama. Yuk segera 
          daftar dan kami tunggu di kelas ya!
          `,
        'thumbnail': 'https://ik.imagekit.io/ku9epk6lrv/image_category_ui.png?updatedAt=1700640912911',
        'classCode': 'P3000',
        'category': categoryUiux,
        'typeClass': 'FREE',
        'level': 'Advanced',
        'price': 0,
        'targetAudience': [
          '1. Anda yang ingin memahami poin penting design system',
          `2. Anda yang ingin membantu perusahaan lebih optimal 
          dalam membuat design produk`,
          '3. Anda yang ingin latihan membangun design system',
          '4. Anda yang ingin latihan membangun design system ',
        ],
        'totalModule': 2,
        'totalRating': 5.0,
        'totalDuration': 180,
        'chapters': [
          chapter1Course3,
          chapter2Course3,
        ],
        'sold': 0,
      },
    ];

    await Course.insertMany(sampleCourse)
        .then((createdCourses) => {
          console.log('Berhasil membuat data course:', createdCourses);
        })
        .catch((error) => {
          console.error('Gagal membuat data course:', error);
        })
        .finally(() => {
          console.log('Insert course finish');
        });

    client.disconnect();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

createDatabaseAndCollection();
