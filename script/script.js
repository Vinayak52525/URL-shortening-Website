"use strict";
// Applying mobile navigation Hamburger menu

const hamburgerIcon = document.querySelector(".hamburder");
const navbarMenu = document.querySelector(".navbar-menu");
const layover = document.querySelector(".layover");

const localStorageArray = [];

const toggleNavbar = function () {
  navbarMenu.classList.toggle("hidden");
  layover.classList.toggle("hidden");
};

hamburgerIcon.addEventListener("click", toggleNavbar);
layover.addEventListener("click", toggleNavbar);
let copyBtn;

////////////////////////////////////////////////

// Copy Shortened URL to clipboard

const copyBtnChange = function (copyBtn, color, text) {
  copyBtn.style.background = color;
  copyBtn.innerText = text;
};

const copyToClipboard = function (e) {
  copyBtn.forEach((btn) => copyBtnChange(btn, "hsl(180, 66%, 49%)", "Copy"));
  copyBtnChange(e.target, "hsl(180, 66%, 49%)", "Copy");
  const shortUrlContainer = e.target.closest(".shortened-urls");
  const shortUrl = shortUrlContainer.querySelector("p+p").innerText;
  const inputElement = document.createElement("input");

  inputElement.setAttribute("value", shortUrl);
  document.body.appendChild(inputElement);
  inputElement.select();
  document.execCommand("copy");
  inputElement.parentNode.removeChild(inputElement);

  copyBtnChange(e.target, "hsl(260, 8%, 14%)", "Copied");
};

function eventListener() {
  copyBtn = document.querySelectorAll(".copy-btn");
  copyBtn.forEach((btn) => {
    btn.addEventListener("click", copyToClipboard);
  });
}

// Using ShortCo API to short the input link

const urlInput = document.querySelector(".url-input-field");
const shortenItBtn = document.querySelector(".shorten-it-btn");
const warningMessage = document.querySelector(".warning-message");
const urlContainer = document.querySelector(".url");

const displayLinks = function (inputLink, shortLink) {
  const markup = `
  <div class="shortened-urls">
    <p class="url-before">${inputLink}</p>
    <p class="url-after">${shortLink}</p>
    <button class="copy-btn">Copy</button>
  </div>
  `;

  localStorageArray.push([inputLink, shortLink]);
  saveToLocalStorage();
  urlContainer.insertAdjacentHTML("beforeend", markup);
  eventListener();
};

const refactorInput = function (input) {
  return input.slice(-1) !== "/" ? (input += "/") : input;
};

const getUrl = async function (inputURL) {
  const input = refactorInput(inputURL);
  try {
    let fetchedData = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${input}`
    );

    const { result } = await fetchedData.json();
    if (!result) throw Error("Invalid or Blocked URL");
    const shortedURLLink = result.full_short_link;
    displayLinks(input, shortedURLLink);
  } catch (err) {
    warningMessage.innerHTML = err.message;
  }
};

function getInputURL() {
  urlInput.classList.remove("error");
  warningMessage.innerHTML = "";

  const inputURL = urlInput.value;
  if (!inputURL) {
    urlInput.classList.add("error");
    warningMessage.innerHTML = "Please add a Link..";
    return;
  }

  getUrl(inputURL);
}

shortenItBtn.addEventListener("click", getInputURL);

// Saving and retriving data from local storage

function saveToLocalStorage() {
  window.localStorage.setItem("urlArray", JSON.stringify(localStorageArray));
}

function loadLocalStorage() {
  let history = JSON.parse(localStorage.getItem("urlArray"));
  history?.forEach((item) => displayLinks(...item));
}
loadLocalStorage();

// localStorage.clear();

