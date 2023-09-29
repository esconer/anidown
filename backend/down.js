const puppeteer = require("puppeteer");
const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
async function anidown(aniName, epNo, lang, type = "TV") {
  try {
    let downLink;

    console.log(aniName);
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

    // Launch the browser
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: false,
      ignoreDefaultArgs: ['--disable-extensions'],
      userDataDir: "./tmp",
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
    console.log(`${downLink}   from down.js`);
    // link = downLink;

    await browser.close();
    return downLink;
  } catch (e) {
    // downLink = null;
    console.log("please read the instruction and try again", e);
    
  }
}

module.exports = anidown;
// module.exports = link;
