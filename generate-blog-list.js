"use strict";

const container = document.querySelector("#article-teasers");

const createNode = ([url, title]) => {
  const newParent = document.createElement("li");
  const newLink = document.createElement("a");

  newLink.href = `/articles?which=${url}`;
  newLink.innerText = title;

  newParent.appendChild(newLink);
  container.appendChild(newParent);
};

const links = {
  "how-to-make-a-testable-user-interface":
    "How To Make A Testable User Interface",
  "exittext": "ExitText: A Tool To Uncover Design",
  "the-changing-role-of-consultants-in-an-agile-workforce":
    "The Changing Role of Consultants in an Agile Workforce",
  "use-flux-standard-actions-for-http-patch":
    "Use Flux Standard Actions for HTTP PATCH ",
  "why-sitepoint-lost-against-incremental-evil":
    "Why SitePoint Lost Against Incremental Evil"
};

Object.entries(links).forEach(createNode);
