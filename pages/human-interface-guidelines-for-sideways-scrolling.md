# Human Interface Guidelines For Horizontal Scrolling

## Things to consider when building web UIs that go sideways.

The modern web allows for some truly amazing interaction design. Some of it is
so good, we honour the excellence of the best designers and developers with 
[actual awards](https://www.webbyawards.com/). 

However, there are websites winning awards for their [horizontal-scrolling design](https://www.awwwards.com/websites/horizontal-layout/)
that actually have poor UX. This article aims to provide a baseline reference for those web developers who
want to implement web experiences that still conform to the affordances and UX 
expectations of the web platform.

Implement these recommendations to ensure that your users find it just as easy
to use your design as any other conventional webpage.

## Navigating Via Keyboard

When you press the <kbd>⬆</kbd> or <kbd>⬇</kbd> arrow keys, the browser changes 
the document's position in the viewport by one _Line_. When you press 
<kbd>Page Up</kbd> or <kbd>Page Down</kbd>, the document's position changes by 
one _Page_.

The sizes of Lines and Pages differ between browsers. Pages are usually about
`90vh` high [but can be user-configured](https://ask.metafilter.com/315755/How-to-adjust-scroll-distance-in-browsers#4559053),
 and Lines are usually viewport-independent:

| User Agent | Operating System | Line Size |
|------------|------------------|-----------|
| Firefox    | Mac OS           | 48px      |
| Chrome     | Mac OS           | 40px      |
| Safari     | Mac OS           | 40px      |
| MS Edge    | Mac OS           | 36px      |
| Firefox    | Windows          | 51px      |
| Chrome     | Windows          | 40px      |
| MS Edge    | Windows          | __px      |
                            
Since users will naturally press <kbd>⬆</kbd> and <kbd>⬇</kbd> to navigate 
around a document, make sure you map <kbd>⬇</kbd> to scroll one Line towards 
the end of the document and <kbd>⬆</kbd> one Line towards the start.

A naive implementation could look like this:

```javascript
window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    // don't let the browser actually scroll up or down
    event.preventDefault();

    if (event.key === 'ArrowDown') {
      scrollRight();
    } else if (event.key === 'ArrowUp') {
      scrollLeft();
    }
  }
});
```

If you want scroll-distance-parity across the _x-_ and _y-axes_, should try to 
match the Line/Page size when you implement `scrollLeft()` and `scrollRight()`. 
Otherwise, it's probably perfectly fine to set a scroll value that fits the 
size and context of your document.

In most browsers, <kbd>Space</kbd> duplicates the <kbd>Page Down</kbd> 
functionality, and <kbd>Shift + Space</kbd> is equal to <kbd>Page Up</kbd>

The <kbd>Home</kbd> and <kbd>End</kbd> should scroll the document to the start
and end respectively. The code to do that might look like this:

```javascript
window.addEventListener('keydown', (event) => {
  if (['Home', 'End'].includes(event.key)) {
    // don't let the browser actually scroll the y-axis
    event.preventDefault();

    if (event.key === 'Home') {
      // scroll to the start
      window.scrollTo(0, document.documentElement.scrollTop);
    } else if (event.key === 'End') {
      // scroll to the end
      window.scrollTo(document.documentElement.scrollWidth, document.documentElement.scrollTop);
    }
  }
});
```

Note that using `document.documentElement.scrollTop` will keep any intentional
y-axis scrolling intact, we only want to change the x-axis position of the 
document.

-----

* Keyboard shortcuts
    - tab
    - fn+arrow keys
* URL hash skip
* Smooth scrolling
* Mouse wheel
* Zoomin / zoomout
* css position sticky implications
* long paragraphs still overflow vertically (watch your screen height)
* careful of chrome's back-and-forward navigation gestures
* persist scroll position when returning via back-button
* maintain scroll position on window resize
* information hierarchy (H1's at the top...or the left?)
* what about the footer?
* how does the content re-flow when AdBlockers remove content?
* Printing
* selecting text in a multi-column layout
* Firefox Caret Browsing
* non left-to-right text layouts
* more-content hints (to avoid False Bottoms)