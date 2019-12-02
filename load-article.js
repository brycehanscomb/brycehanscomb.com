"use strict";

import {$} from "./common.js";

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
  const pageDataUrl = `/pages/${url.searchParams.get("which")}.md`;

  const res = await fetch(pageDataUrl);
  const text = await res.text();

  main.innerHTML = window.marked(text);

  main.querySelector("h1").classList.add("title");
  main.querySelector("h2").classList.add("subtitle");

  createMetaDescription(main.querySelector(".subtitle").innerText);
  setTitle(main.querySelector(".title").innerText + " · Bryce Hanscomb");

  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });

  setTimeout(() => {
    if (url.hash.length) {
      const targetEl = document.getElementById(url.hash.replace('#', ''));
      if (targetEl) {
        targetEl.scrollIntoView(true);
      }
    }
  }, 1000);
};

const createIndexLink = (slug, {title, subtitle}) => {
  const container = document.createElement('a');
  container.setAttribute('href', `/article?which=${slug}`);
  container.setAttribute('class', 'article-teaser');
  container.innerHTML = `
    <h2 class="article-teaser__title">${title}</h2>
    <p class="article-teaser__subtitle">${subtitle}</p>
  `;

  main.appendChild(container);
};

const loadIndex = async () => {
  const blogLinks = await fetch('/blog-links.json').then(r => r.json());

  const title = document.createElement('h1');
  title.innerText = 'Blogs & Articles';
  main.appendChild(title);

  const intro = document.createElement('section');
  intro.innerHTML = `
    <p>I write about technology, media and design.</p>
    <p>If you would like to post a correction to any of these articles, 
    please <a href="https://github.com/brycehanscomb/brycehanscomb.com">file a pull request</a> 
    on GitHub.</p>
  `;

  main.appendChild(intro);

  Object.entries(blogLinks).forEach(([slug, title]) => createIndexLink(slug, title));
};

if (url.searchParams.has("which")) {
  loadPage();
} else {
  loadIndex();
}
