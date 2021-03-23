# Human Interface Guidelines For Horizontal Scrolling

## Things to consider when building web UIs that go sideways.

The modern web allows for some truly amazing interaction design. Some of
it is so good, we honour the excellence of the best designers and
developers with [actual awards](https://www.webbyawards.com/).

However, there are websites winning awards for their [horizontal-scrolling design](https://www.awwwards.com/websites/horizontal-layout/)
that actually have poor UX. This article aims to provide a baseline reference for those web developers who
want to implement web experiences that still conform to the affordances and UX 
expectations of the web platform.

Implement these recommendations to ensure that your users find it just as easy
to use your design as any other conventional webpage.

## Navigating Via Keyboard

### Arrow Keys

Pressing the <kbd>⬆</kbd> or <kbd>⬇</kbd> arrow keys changes the document's 
position by one `Line`. 

The size of a Line differs between browsers and is usually viewport-independent:

| User Agent | Operating System | Line Size |
|------------|------------------|-----------|
| Firefox    | Mac OS           | 48px      |
| Chrome     | Mac OS           | 40px      |
| Safari     | Mac OS           | 40px      |
| MS Edge    | Mac OS           | 36px      |
| Firefox    | Windows          | 51px      |
| Chrome     | Windows          | 40px      |
| MS Edge    | Windows          | 48px      |
                            
Since users will naturally press <kbd>⬆</kbd> and <kbd>⬇</kbd> to navigate 
around a document, make sure you map <kbd>⬇</kbd> to scroll one Line towards 
the end of the document and <kbd>⬆</kbd> one Line towards the start.

A basic implementation could look like this:

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
Otherwise, it's fine to set a scroll value that fits the size and context of 
your document.

### Other Keys

Pressing <kbd>Page Up</kbd> or <kbd>Page Down</kbd> changes the document's 
position by one `Page` -- usually about `90vh` high [but it can be user-configured](https://ask.metafilter.com/315755/How-to-adjust-scroll-distance-in-browsers#4559053).

In most browsers, <kbd>Space</kbd> duplicates the <kbd>Page Down</kbd>
functionality, and <kbd>Shift + Space</kbd> is equal to <kbd>Page
Up</kbd>. Make sure you handle them in the same way.

Additionally:

* <kbd>Home</kbd> should scroll to the start of the document
* <kbd>End</kbd> should scroll to the end

The code to do that might look like this:

```javascript
window.addEventListener('keydown', (event) => {
  if (['Home', 'End'].includes(event.key)) {
    // don't let the browser actually scroll the y-axis
    event.preventDefault();
    
    const currentYPosition = document.documentElement.scrollTop;
    const pageWidth = document.documentElement.scrollWidth;

    if (event.key === 'Home') {
      // scroll to the start
      window.scrollTo(0, currentYPosition);
    } else if (event.key === 'End') {
      // scroll to the end
      window.scrollTo(pageWidth, currentYPosition);
    }
  }
});
```

<small>**Note:** using `document.documentElement.scrollTop` for the `y`
parameter will keep any intentional y-axis scrolling intact; we only
want to change the x-axis position of the document.</small>

Finally, don't forget that the user should be able to tab through the
document's focusable elements with the <kbd>Tab</kbd> key. Ensure your
UI [brings the focused element wholly into the viewport](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView).

## Fragment Links

If you use
[URL fragments](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Linking_to_an_element_on_the_same_page)
to hotlink to a specific part of a page (using the `id` or `name`
attribute, ensure the `target` will be visible on page load.

If your DOM structure is simple, the browser will likely jump to the
`target` element automatically. However if you're doing things with CSS
like arranging elements via `transform: translateX()` you may need to
manually set those positions.

Even if your content is in nested containers, you can lookup the
`target` element and call [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView).

Likely the biggest challenge here is re-implementing all the layout and
scrolling calculations you'd normally get for free: [many browsers don't
yet support the `scrollIntoViewOptions` argument](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#bcd:api.Element.scrollIntoView)
which allows you to define the page jump's horizontal alignment. You'll
need to use something like 
[`Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
to calculate the edges of the element compared to the viewport and apply
and offset in scroll-jump logic yourself.

**Bonus Points:** use the
[`:target` pseudo-selector](https://css-tricks.com/on-target/) to apply
some specific UX callout that alerts the user to which element was
hotlinked.

## Scrolling Via The Mouse Wheel

In addition to navigating via the keyboard, users may also use mice with
a scrolling wheel. When used, this fires a `wheel` event that you'll
want to intercept and redirect into scrolling sideways. A naive
implementation might look something like this:

```javascript
window.addEventListener('wheel', (event) => {
    // if this is already a horizontal scroll (like on 360-degree mousewheels)
    // then don't do anything; let the browser scroll horizontally for us.
    if (event.deltaX) {
        return;
    }
    
    // Stop the browser from moving the viewport.
    // This also prevents any subsequent `scroll` events from firing.
    event.preventDefault();
    
    const delta = event.deltaY;
    const currentXPosition = document.documentElement.scrollLeft;
    const currentYPosition = document.documentElement.scrollTop;
    
    window.scrollTo(
        currentXPosition + delta, // works for event negative values 
        currentYPosition
    );
});
```

On all good operating systems, the `deltaY` property will be normalised
so that if the user has their
[mouse scroll direction changed](https://www.wikihow.com/Change-Scroll-Direction-on-a-Mac),
it should still be a positive number when the user intends to scroll
further into the document (to the right) and a negative number to scroll
closer to the document's beginning (to the left).

## OS-Native Gestures

Some operating systems
[(like MacOS)](https://support.apple.com/en-us/HT204895) have a GUI
feature that allows the user to navigate between pages in an app using a
horizontal two-finger trackpad swipe. 

Unfortunately that's exactly the same gesture as a horizontal scroll, so
your users might accidentally go back one page in their browser history
when they try to scroll along the x-axis.

I'm not sure what to do about this.

## Scroll Anchoring

All modern browsers support an "invisible" feature of the web called
_Scroll Anchoring_. As the
[W3C Spec Proposal](https://github.com/WICG/ScrollAnchoring/blob/master/explainer.md)
explains it:

<blockquote>
Today, users of the web are often distracted by content moving around
due to changes that occur outside the viewport. Examples include script
inserting an iframe containing an ad, or non-sized images loading on a
slow network. 
</blockquote>

MDN continues:

<blockquote>
Scroll anchoring adjusts the scroll position to compensate for the
changes outside of the viewport. This means that the point in the
document the user is looking at remains in the viewport, which may mean
their scroll position actually changes in terms of how far they have
moved through the document. 
</blockquote>

You may need to manually implement this behaviour on your site for:

1. Nested horizontal elements
2. Manually `transform`-ed elements
3. Window resize events
5. Device rotations

## Sticky Elements

If you're using CSS `position: sticky` to create persistent elements on the left
and right edges of the screen, be mindful of mobile devices. 

They are usually used in portrait orientation and likely don't have much room to
spare for UI elements that obscure the content below.

Additionally, if you're using URL fragments to link to specific elements on the
page, ensure that your browser will scroll far enough the sticky element doesn't 
obscure the leading edge of the target content.

## Smooth Scrolling

Implementing interactivity like scrolling from one part of the document to 
another is common. Natively you can do it:

* with CSS, using `scroll-behaviour: smooth`
* with Javascript, using `window.scrollBy(x, y, { behavior: 'smooth' })`

Both these methods will seamlessly smooth-scroll horizontally just as well as
they do vertically. However if you're using a custom JS Smooth Scrolling script
such as a jQuery plugin, ensure that it handles x-axis smooth scrolling too.

## Footers

Footers are a common UX pattern on vertically-scrolled websites. Consider if you
need a footer at the end of your document. Will it be at the far-right of your
content, following the flow of the rest of the page? Or will it be at the bottom
of the screen like a traditional footer?

Strike the right balance between putting the footer where the user normally
expects it -- at the bottom -- versus maximising the available vertical space
for your horizontally-scrolling main content.


## Other Thoughts: 

1. Long paragraphs still overflow vertically, so watch your screen height
2. Ensure you [persist the user's scroll position](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration) when returning via back-button
3. Consider your information hierarchy: do your H1's go at the top...or the left?
4. Test how the content re-flows when ad-blockers remove content
5. Check your print stylesheets: what happens if people try to print Portrait?
6. Selecting text in a multi-column layout
7. Consider the UX of [Caret Browsing](https://www.guidingtech.com/caret-browsing-chrome-firefox-edge-how-to-use/)
8. Consider non-LTR readers (and auto-translation tools that switch between them)
9. Avoid [False Bottoms](https://www.nngroup.com/articles/illusion-of-completeness/) in both axes
10. Don't hide the scrollbars!
11. Ensure you allow users to still vertically scroll content that's too tall for their screens