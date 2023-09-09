const searchBtn = document.querySelector("#search");
const resultSection = document.querySelector("#result-section")

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const aniName = document.querySelector('input[name="ani_name"]').value;

  const epNo = document.querySelector('input[name="ep_no"]').value;

  const lang = document.getElementById("lang").value;

  let aniDetails = {
    ani_name: aniName,
    ep_no: Number(epNo),
    lang: lang,
  };
  fetch("http://127.0.0.1:3000/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aniDetails),
   })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text(); // Parse the response as plain text
  })
  .then(text => {
  resultSection.classList.remove('hidden')
  const ulElement = document.createElement('ul')
  const liElement = document.createElement('li')
  
  liElement.innerHTML= `<a  href=${text}
  target="_blank"> ${aniDetails.ani_name} episode ${aniDetails.ep_no} ${aniDetails.lang}</a>`
  ulElement.appendChild(liElement)
  resultSection.children[0].appendChild(ulElement)

  })


});
