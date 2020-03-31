import { $ } from './common.js'

const skillsMarquee = $('#skills-marquee');

skillsMarquee.removeAttribute('data-hidden-until-initialized')

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
const itemsToShow = 12;

const lastMovedIndexes = [];

const randomizeNodeOrder = () => {
    const children = [...skillsMarquee.children];

    let replacementIndex = randomIntFromInterval(0, itemsToShow);

    while (lastMovedIndexes.includes(replacementIndex)) {
        replacementIndex = randomIntFromInterval(0, itemsToShow - 1);
    }

    lastMovedIndexes.push(replacementIndex);

    if (lastMovedIndexes.length > 4) {
        lastMovedIndexes.shift();
    }

    const replacementTarget = children[replacementIndex];
    const firstHiddenItem = children[itemsToShow];

    skillsMarquee.insertBefore(firstHiddenItem, replacementTarget);
    skillsMarquee.insertAdjacentElement('beforeend', replacementTarget);


    firstHiddenItem.animate([ { opacity: 0 }, { opacity: 1 }], { duration: 500 })
}

setInterval(randomizeNodeOrder, 1000);
