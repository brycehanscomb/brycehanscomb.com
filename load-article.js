"use strict";

const url = new URL(window.location);
const main = document.querySelector("main");

const createMetaDescription = text => {
  const meta = document.createElement("meta");
  meta.setAttribute("name", "description");
  meta.setAttribute("content", text);

  document.head.append(meta);
};

const setTitle = title => {
  document.title = title;
};

const loadPage = async () => {
  const pageDataUrl = `pages/${url.searchParams.get("which")}.md`;

  const res = await fetch(pageDataUrl);
  const text = await res.text();

  main.innerHTML = window.marked(text);

  main.querySelector("h1").classList.add("title");
  main.querySelector("h2").classList.add("subtitle");

  createMetaDescription(main.querySelector(".subtitle").innerText);
  setTitle(main.querySelector(".title").innerText + " Â· Bryce Hanscomb");
};

if (url.searchParams.has("which")) {
  loadPage();
}
