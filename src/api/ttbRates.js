import axios from "axios";
import * as cheerio from 'cheerio';
async function getTTBRate() {
  try {
    const url = "https://www.bk.mufg.jp/ippan/kinri/list_j/kinri/kawase.html";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let ttbRate = null;

    $("table tr").each((_, el) => {
      const rowText = $(el).text();
      if (rowText.includes("米ドル") || rowText.includes("USD")) {
        const tds = $(el).find("td");
        const ttb = $(tds[1]).text().trim().replace(",", "");
        ttbRate = parseFloat(ttb);
      }
    });

    console.log("USD T.T.B. Rate:", ttbRate);
    return ttbRate;
  } catch (erry) {
    console.error("Error fetching TTB rate:", err.message);
    return null;
  }
}

export default getTTBRate;
