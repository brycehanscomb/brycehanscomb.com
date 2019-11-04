# ExitText

## Remove text in webpages to design without reading

When evaluating a visual design for its effectiveness, it's important to
be able to assess qualities [in the
gestalt](https://www.smashingmagazine.com/2014/03/design-principles-visual-perception-and-the-principles-of-gestalt/).
For web pages with lots of type, this means trying to switch off the
part of our brains [that "force" us to read the
words](https://www.independent.co.uk/news/science/you-cant-not-read-this-sentence-brainwashing-quora-a6882226.html)
instead of looking at how they form a part of the cohesive whole.

While [latin placeholder
text](https://en.wikipedia.org/wiki/Lorem_ipsum) can be used in some
places, it's gets harder when you want to analyse existing web pages.

I've made a tool called [ExitText](http://brycehanscomb.github.io/exittext/) that helps
designers evaluate the _gestalt_ of a type-heavy webpage, and [it's
available on GitHub now](http://brycehanscomb.github.io/exittext/).

### Remove text, uncover design

This is what [The Onion](https://theonion.com)’s homepage looks like
normally:

![Before](images/exittext-the-onion-before.png)

Here is what happens when ExitText replaces all the fonts with shapes:

![After](images/exittext-the-onion-after.png)

Notice the difference it makes: the words can’t be read, so more
attention can be paid to the layout.

The hierarchy becomes more clear and the text’s structure, placement and
size can be evaluated without being caught up in the nitty-gritty of
what the content actually says.

### How ExitText works

After learning about [embedding base64-encoded font files into CSS
stylesheets from Steven
Scaff](http://stephenscaff.com/articles/2013/09/font-face-and-base64-data-uri/),
I put together a small script that injects a stylesheet into the head of
a page that overrides all font declarations with [Redacted Script
Bold](https://github.com/christiannaths/Redacted-Font), a typeface
consisting entirely of squiggled lines.

When activated, ExitText will remove text on the current page and
replace it with scribbles. It’s open source and [available for
installation on GitHub](http://brycehanscomb.github.io/exittext).

ExitText's featureset has also been incorporated into
[Wirify](https://www.wirify.com/2017/09/redact-and-greeking-features-available-in-wirify/)
-- go check it out!
