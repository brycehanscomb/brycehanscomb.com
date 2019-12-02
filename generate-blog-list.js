"use strict";

import {$} from './common.js';

const container = $("#article-teasers");

const createNode = ([url, {title, subtitle}]) => {
  const newParent = document.createElement("li");
  const newLink = document.createElement("a");

  newLink.href = `/article?which=${url}`;
  newLink.innerText = title;

  newParent.appendChild(newLink);
  container.appendChild(newParent);
};

(async () => {
    const links = await fetch('/blog-links.json').then(r => r.json());
    Object.entries(links).forEach(createNode);
})();
