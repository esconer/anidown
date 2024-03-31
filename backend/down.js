const puppeteer = require("puppeteer");

require("dotenv").config();
const path = require("path");

async function anidown(aniName, epNo, lang, type = "TV") {
  try {
    let downLink;

    console.log(aniName, epNo, lang, type);
    //copied from stack overflow changing to pascal Case
    // let casedName = animeName;
    let casedName = (aName) =>
      aName.replace(/\w+/g, function (w) {
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
      });
    if (type === "movie") {
      casedName(type);
    } else {
      type.toUpperCase();
    }

    //extension load ublock origin
    const extensionPath = path.join(
      __dirname,
      "extension/uBlock0_1.57.0.chromium/uBlock0.chromium"
    );

    // Launch the browser
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    // Create a page
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(100000);

    let advSearch = `https://yugenanime.tv/discover/?q=${aniName.replaceAll(
      " ",
      "+"
    )}&type=${type}`;

    // await page.goto(basicSearch);
    await page.goto(advSearch);
    //image selector
    await page.waitForSelector(".cards-grid");

    const searchResult = await page.$$eval(".cards-grid a", (anime) => {
      return anime.map((el) => el.href);
    });
    // console.log(searchResult);

    //making the url

    let splited = searchResult[0].split("/");
    //in case of sub
    let playingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}/${epNo}/`;
    //in case of dub
    let dubPlayingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}-dub/${epNo}/`;
    // movie
    let moviePlayingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}/1/`;
    let movieDubPlayingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}-dub/1/`;

    // choosing dub or sub
    if (lang === "Dub" && type === "TV") {
      //jump to episode no
      await page.goto(dubPlayingLink);
      //clicking the download link
      downLink = await page.evaluate(
        () => document.getElementsByName("player-download")[0].href
      );
      await page.goto(downLink);
    } else if (lang === "Sub" && type === "TV") {
      //jump to episode no
      await page.goto(playingLink);
      //clicking the download link
      downLink = await page.evaluate(
        () => document.getElementsByName("player-download")[0].href
      );
      await page.goto(downLink);
    } else if (lang === "Dub" && type === "Movie") {
      //jump to episode no
      await page.goto(movieDubPlayingLink);
      //clicking the download link
      downLink = await page.evaluate(
        () => document.getElementsByName("player-download")[0].href
      );
      await page.goto(downLink);
    } else if (lang === "Sub" && type === "Movie") {
      //jump to episode no
      await page.goto(moviePlayingLink);
      //clicking the download link
      downLink = await page.evaluate(
        () => document.getElementsByName("player-download")[0].href
      );
      await page.goto(downLink);
    } else {
      //jump to episode no
      await page.goto(playingLink);
      //clicking the download link
      downLink = await page.evaluate(
        () => document.getElementsByName("player-download")[0].href
      );
      await page.goto(downLink);
    }
    // #content-download > div:nth-child(1) > div:nth-child(5) > a
    // extracting download links of different quality
    let downQualityLinks = {
      "360p": "",
      "480p": "",
      "720p": "",
      "1080p": "",
    };

    // await page.waitForSelector("#content-download > .download > a");
    let qualityLinks = await page.evaluate(
      () => document.querySelectorAll("#content-download > .download > a").href
    );
    console.log(qualityLinks);

    console.log(`${downLink}   from down.js`);
    // link = downLink;

    // await browser.close();
    return downLink;
  } catch (e) {
    // downLink = null;
    console.log("please read the instruction and try again", e);
  }
}

module.exports = anidown;
