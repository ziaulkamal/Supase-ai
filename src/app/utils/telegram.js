// utils/telegram.js
import axios from 'axios';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const USER_ID = process.env.USER_ID;

export const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: USER_ID,
      text: message,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error;
  }
};
