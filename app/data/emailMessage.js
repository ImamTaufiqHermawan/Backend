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
                                <a href="${process.env.CLIENT_URL}/reset-password/${passwordResetToken}" style="background-color: #007BFF; color: #ffffff; text-align: center; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Kata Sandi</a>
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

module.exports = {
  verifyEmailMessage,
  forgotPasswordMessage,
};
