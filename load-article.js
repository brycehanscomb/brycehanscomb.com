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

// const loadIndex = async () => {
//     setTitle("Bryce Hanscomb");
//     createMetaDescription("Words from an Australian Web Developer");
//
//     const dataUrl = `pages/`;
//     const res = await
//         fetch(dataUrl);
//     const html = await
//         res.text();
//
//     const doc = document.createElement("div");
//     doc.innerHTML = html;
//     main.innerHTML = `<h2 class="title">Articles</h2>${
//         doc.querySelector("ul").outerHTML
//         }`;
//
//     const links = [...document.querySelectorAll("main li a")
//         ]
//     ;
//
//     const emptyLink = document.querySelector(`ul a[href*="/"]`);
//
//     if (emptyLink) {
//         const emptyParent = emptyLink.closest("li");
//         if (emptyParent) {
//             emptyParent.remove();
//         }
//     }
//
//     links.forEach(
//         /**
//          * @param {HTMLAnchorElement} pageLink
//          * @returns {Promise<void>}
//          */
//         async
//         pageLink => {
//             const url = pageLink.getAttribute("href");
//
//             if (
//                 pageLink.nextElementSibling &&
//                 pageLink.nextElementSibling.tagName.toUpperCase() === "I"
//             ) {
//                 pageLink.nextElementSibling.remove();
//             }
//
//             pageLink.setAttribute(
//                 "href",
//                 `?page=${url.replace("/pages/", "").replace(".md", "")}`
//             );
//
//             const res = await
//                 fetch("/pages/" + url.replace("/pages/", ""));
//             const text = await
//                 res.text();
//             const title = text.slice(0, text.indexOf("\n")).replace(/#/g, "");
//
//             const isComingSoon = text.length < 500;
//
//             pageLink.outerHTML = `<h3><a href="${pageLink.href}">${title}</a> ${
//                 isComingSoon ? "<br/><small>[coming soon]</small>" : ""
//                 }</h3>`;
//         }
//     )
//     ;
// };

if (url.searchParams.has("which")) {
    loadPage();
}
