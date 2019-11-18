export const $ = s => document.querySelector(s);
export const $$ = s => Array.from(document.querySelectorAll(s));

export const body = $("body");
export const title = $(".title");

const url = new URL(window.location.href);

if (url.hash.length) {
    const targetEl = $('#' + url.hash.replace('#', ''));

    window.scrollTo(x, targetEl.getBoundingClientRect().y);
}