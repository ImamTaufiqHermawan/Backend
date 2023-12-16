const Jimp = require('jimp');
const path = require('path');

const fileName = path.join(__dirname, 'templateCertif.jpg');
const sendMailer = require('../helpers/nodemailer');

// imageCapptions = [
//   'Irfiyanda',
//   'Web Development'
// ]

const createCertif = (emailAddress, imageCaptions) => {
  let loadedImage;
  Jimp.read(fileName)
      .then(function(image) {
        loadedImage = image;
        return Jimp
            .loadFont(path.join(__dirname, 'ShadedLarchPERSONALUSEONLY.fnt'));
      })
      .then(async function(font) {
        const imageWidth = loadedImage.bitmap.width;
        const imageHeight = loadedImage.bitmap.height;

        const startY = (imageHeight - 320) / 2;

        let currentY = startY;
        imageCaptions.forEach(function(line) {
          const textWidth = Jimp.measureText(font, line);
          const x = (imageWidth - textWidth) / 2;

          loadedImage.print(font, x, currentY, line);

          currentY += Jimp.measureTextHeight(font, line);
        });

        const imageBuffer = await loadedImage.getBufferAsync(Jimp.MIME_JPEG);
        const imageBase64 = imageBuffer.toString('base64');

        const mailOptions = {
          from: 'productionservicesbelajar@gmail.com',
          to: emailAddress,
          subject: 'Sertifikat Kelulusan',
          // eslint-disable-next-line max-len
          text: `Selamat! Anda telah menyelesaikan kursus ${imageCaptions[1]} dan berhak menerima sertifikat kelulusan.`,
          attachments: [
            {
              filename: `${imageCaptions[0]}-${imageCaptions[1]}.jpg`,
              content: imageBase64,
              encoding: 'base64',
            },
          ],
        };
        sendMailer(mailOptions);
        return mailOptions;
      })
      .catch(function(err) {
        console.error(err.message);
      });
};

module.exports = createCertif;
