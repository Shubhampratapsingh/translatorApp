import axios from "axios";

export async function translateText(convertTo, text) {
  const options = {
    method: "POST",
    url: "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_GOOGLE_TRANSLATE_KEY,
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      from: "auto",
      to: convertTo,
      text: text,
    },
  };

  try {
    const response = await axios.request(options);
    return response?.data;
  } catch (error) {
    console.error(error);
  }
}
