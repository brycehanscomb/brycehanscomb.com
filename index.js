'use strict';

/**
 * Only animate if:
 *
 * 0. Javascript is enabled
 * 1. Animations API is supported
 * 2. Page currently has focus
 * 3. Viewport is Desktop-size (mobile needs different animations <-- TODO)
 */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const body = $('body');
const header = $('header');
const main = $('main');
const title = $('.title');

const leftMainSection = $('#articles');
const rightMainSection = $('#about');

const fadeEntry = [
    {opacity: 0 },
    {opacity: 1 },
];

const upEntry = [
    { opacity: 0, transform: 'translateY(50px)' },
    { opacity: 1, transform: 'translateY(0px)' },
];

const downEntry = [
    { opacity: 0, transform: 'translateY(-50px)' },
    { opacity: 1, transform: 'translateY(0px)' },
];

const leftEntry = [
    { opacity: 0, transform: 'translateX(50px)'},
    { opacity: 1, transform: 'translateX(0px)'},
];

const rightEntry = [
    { opacity: 0, transform: 'translateX(-50px)'},
    { opacity: 1, transform: 'translateX(0px)'},
];

const expandEntry = [
    {width: '0%'},
    {width: '100%'}
];

const entryAnimationTimings = {
    duration: 1000,
    easing: 'ease'
};

const createTitleunderline = () => {
    const underline = document.createElement('span');
    underline.classList.add('underline');
    underline.setAttribute('role', 'presentation');

    title.after(underline);
};

const createAnimation = (element, animationKeyframes) => {
    const animation = element.animate(animationKeyframes, entryAnimationTimings);
    animation.pause();
    animation.currentTime = 0;

    return animation;
};

createTitleunderline();


const begin = () => {
    // step 3: check if viewport is Desktop sized
    if (window.innerWidth < 1000) {
        body.dataset.introState = 'aborted';
        return;
    } else {
        body.dataset.introState = 'playing';

    }

    const underlineEntry = createAnimation($('.underline'), expandEntry);
    const titleEntry = createAnimation(title, upEntry);
    const taglineEntry = createAnimation($('#tagline'), downEntry);

    const leftSectionEntry = createAnimation(leftMainSection, leftEntry);
    const rightSectionEntry = createAnimation(rightMainSection, rightEntry);


    setTimeout(() => underlineEntry.play(), 1000);

    setTimeout(() => {
        titleEntry.play();
        taglineEntry.play();
    }, 1500);

    setTimeout(() => {
        leftSectionEntry.play();
        rightSectionEntry.play();
    }, 2300);
};

// Step 0: Javascript is enabled because this script is running
// Step 1. check if animations API is supported
if ('animate' in body) {
    // step 2: check if the page is visible. If not, wait till it is.
    if ('visibilityState' in document) {
        if (document.visibilityState === 'visible') {
            begin();
        } else {
            document.addEventListener('visibilitychange', begin);
        }
    }
} else {
    body.dataset.introState = 'unsupported';
}
