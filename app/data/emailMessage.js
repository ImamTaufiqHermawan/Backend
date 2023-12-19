/* eslint-disable max-len */
const verifyEmailMessage = (otp) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verifikasi Email Anda</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Verifikasi Email Anda</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Terima kasih telah mendaftar di preducation.com. Untuk menyelesaikan proses pendaftaran, silakan masukkan kode OTP berikut:</p>
                            <p style="font-size: 24px; font-weight: bold; color: #333;">#${otp}</p>
                            <p>Jika Anda tidak merasa mendaftar di situs kami, Anda bisa mengabaikan pesan ini.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2023 preducation
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

`;
};

const forgotPasswordMessage = (passwordResetToken) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lupa Kata Sandi</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Lupa Kata Sandi</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Kami menerima permintaan Anda untuk mereset kata sandi. Untuk melanjutkan proses reset kata sandi, silakan klik tombol di bawah ini:</p>
                            <p>
                                <a href="${process.env.CLIENT_URL}/reset-password/?token=${passwordResetToken}" style="background-color: #007BFF; color: #ffffff; text-align: center; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Kata Sandi</a>
                            </p>
                            <p>Jika Anda tidak meminta reset kata sandi, Anda bisa mengabaikan pesan ini. Keamanan akun Anda tetap terjaga.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2023 Preducation.com
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

const resetPasswordMsgSuccess = () => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Kata Sandi Berhasil</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Reset Kata Sandi Berhasil</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Kata sandi akun Anda telah berhasil direset. Anda sekarang dapat masuk dengan kata sandi baru.</p>
                            <p>Jika Anda merasa ini bukan tindakan Anda, segera hubungi kami.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2023 Preducation
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

    `;
};

const successVerifyMessage = () => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verifikasi Email Berhasil</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Verifikasi Email Berhasil</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Selamat! Alamat email Anda telah berhasil diverifikasi. Anda sekarang dapat menggunakan layanan kami.</p>
                            <p>Terima kasih atas kepercayaan Anda kepada kami.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2023 Preducation.com
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

    `;
};

const htmlCreateCertif = (name, course) => {
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notifikasi Pengiriman Sertifikat</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      color: #4CAF50;
    }

    p {
      color: #555;
    }

    .btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Selamat ${name}! Anda Telah Menyelesaikan Kursus!</h1>

    <p>Kami dengan bangga memberitahu Anda bahwa Anda telah berhasil menyelesaikan kursus ${course} dengan sukses. Kesungguhan dan dedikasi Anda selama kursus sangat dihargai.</p>

    <p>Sertifikat penghargaan Anda telah kami lampirkan pada email ini. Sertifikat ini mencerminkan pencapaian luar biasa Anda dan merupakan bukti resmi dari partisipasi Anda dalam kursus kami.</p>

    <p>Harap diingat untuk menyimpan sertifikat ini dengan aman, karena merupakan bukti yang berharga atas usaha dan kesuksesan Anda dalam mencapai tujuan pembelajaran.</p>

    <p>Terima kasih atas kepercayaan Anda dalam memilih kursus kami. Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi tim kami.</p>

    <p>Salam sukses,</p>
    <p>Preducation</p>
  </div>
</body>

</html>
    `;
};

module.exports = {
  verifyEmailMessage,
  forgotPasswordMessage,
  resetPasswordMsgSuccess,
  successVerifyMessage,
  htmlCreateCertif,
};
