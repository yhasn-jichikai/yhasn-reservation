const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Gmail API を使う場合は OAuth2 認証を推奨（今回はアプリパスワード簡易版）
const gmailUser = functions.config().gmail.user;
const gmailPass = functions.config().gmail.pass;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass, // 2段階認証＋アプリパスワード
  },
});

// 予約完了メール送信
exports.sendReservationEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, body } = data;

  const mailOptions = {
    from: `"YHASN施設予約" <${gmailUser}>`,
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("メール送信エラー:", error);
    throw new functions.https.HttpsError("internal", "メール送信失敗");
  }
});
