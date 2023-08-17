import puppeteer from "puppeteer";
//selecting
let animeName = "one piece";
let episodeNum = 426;
let isDub = true;
let contentType = "TV";
let downLink;

//copied from stack overflow changing to pascal Case
// let casedName = animeName;
let casedName = (aName) =>
  aName.replace(/\w+/g, function (w) {
    return w[0].toUpperCase() + w.slice(1).toLowerCase();
  });
if (contentType === "movie") {
  casedName(contentType);
} else {
  contentType.toUpperCase();
}
// casedName = casedName.replace(/\w+/g, function (w) {
//   return w[0].toUpperCase() + w.slice(1).toLowerCase();
// });

// for toggle class sidepanel--toggle

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  // Create a page
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(100000);

  // ***********************************down
  // Go to your site
  //  await page.goto("https://yugenanime.tv/");
  //   //searching
  //   const searchClick = "#center > div > form > input";
  //   await page.type(searchClick, animeName, { delay: 100 });
  //   await page.keyboard.press("Enter");

  // ***********************************up

  //alt discover precise search (mod. in url)

  let advSearch = `https://yugenanime.tv/discover/?q=${animeName.replaceAll(
    " ",
    "+"
  )}&type=${contentType}`;
  await page.goto(advSearch);
  //image selector
  await page.waitForSelector(".cards-grid");

  const searchResult = await page.$$eval(".cards-grid a", (anime) => {
    return anime.map((el) => el.href);
  });
  console.log(searchResult);

  // ***********************************down
  // for ( let anime of searchResult){

  // console.log(anime)}

  // //click first result

  // await page.goto(searchResult[0])
  // // click watch
  // const watch = await page.$$eval('.navigation a.link.p-15',(anime) =>{
  //   return anime.map( el => el.href)
  // })
  // ***********************************up

  // console.log(watch[1])

  // ***********************************down
  // await page.goto(watch[1])
  // ***********************************Up

  // document.querySelector('.cards-grid a')

  // for (const name of searchResult){
  //   const title = await page.evaluate(
  //     (el)=> el.querySelector('.img').textContent,name
  //   )
  //   console.log(title);
  // }

  //making the url

  let splited = searchResult[0].split("/");

  let playingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}/${episodeNum}/`;
  //in case of dub
  let dubPlayingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}-dub/${episodeNum}/`;
  // movie
  let moviePlayingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}/1/`;
  let movieDubPlayingLink = `https://yugenanime.tv/watch/${splited[4]}/${splited[5]}-dub/1/`;

  // //jump to episode no
  // await page.goto(dubPlayingLink);
  // //clicking the download link
  // const downLink = await page.evaluate(
  //   () => document.getElementsByName("player-download")[0].href
  // );
  // await page.goto(downLink);

  // choosing dub or sub
  if (isDub && contentType === "TV") {
    //jump to episode no
    await page.goto(dubPlayingLink);
    //clicking the download link
    downLink = await page.evaluate(
      () => document.getElementsByName("player-download")[0].href
    );
    await page.goto(downLink);
  } else if (isDub && contentType === "Movie") {
    //jump to episode no
    await page.goto(movieDubPlayingLink);
    //clicking the download link
    downLink = await page.evaluate(
      () => document.getElementsByName("player-download")[0].href
    );
    await page.goto(downLink);
  } else if (!isDub && contentType === "Movie") {
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
  console.log(downLink);
  await browser.close();
})();
