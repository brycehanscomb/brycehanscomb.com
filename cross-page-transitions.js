import { $$, body } from "./common.js";

const articleLinks = $$("#article-teasers a");

/**
 * @param {MouseEvent} e
 */
const handleArticleLinkClick = e => {
  // e.preventDefault();

  Object.assign(document.body.style, {
    opacity: 0,
    transition: "opacity 0.2s linear"
  });
};

articleLinks.forEach(link => {
  link.addEventListener("click", handleArticleLinkClick);
});
