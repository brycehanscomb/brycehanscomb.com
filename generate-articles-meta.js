const fs = require('fs-extra');
const path = require('path');

const orderedArticleSlugs = require('./articles-order.json');

const getTitle = async (slug) => {
    const articleText = await fs.readFileSync(path.join('./pages', slug + '.md'), 'utf-8');
    const [title, _, subtitle] = articleText.trim().split('\n');
    const articleTitle = title.replace(/#/g, '').trim();
    const articleSubtitle = subtitle.replace(/#/g, '').trim();
    return {slug, title: articleTitle, subtitle: articleSubtitle};
};

(async () => {
    /**
     * @type {{ slug: string, title: string, subtitle: string}[]}
     */
    const articleMetas = await Promise.all(orderedArticleSlugs.map(getTitle));

    const blogLinks = articleMetas.reduce((acc, data) => {
        acc[data.slug] = data;
        return acc;
    }, {});

    fs.writeJsonSync('blog-links.json', blogLinks);
})();