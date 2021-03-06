# How To Make A Testable User Interface
 
## A guide to creating web UIs that maximise testability and minimise test flakiness.
 
As the web has matured into a viable application platform, we've kept up by 
building things more complex than ever. Modern web practices like responsive 
design, touch interactivity, rich media, progressive enhancement, SEO, 
performance and accessibility are all in scope.

Quality Assurance Engineers are people who specialise in verifying that the 
digital experiences and applications we build meet the customers' expectations.

Catching issues before they reach production has shown to be [orders-of-magnitude cheaper](https://www.jrothman.com/articles/2000/10/what-does-it-cost-you-to-fix-a-defect-and-why-should-you-care/)
to fix and ensures user experiences remain smooth and delightful.

So what does this mean for UI developers? Put simply, _the easier it is for QA 
to test a UI, the better their ability to discover its problems_. If they can 
find issues before customers do, the better the software can be.

To help QA Engineers do the best job they can, here are six things web 
developers can do to increase the testability of their user interfaces and meet
the quality goals of a project:

## 1. Expose Testing Hooks

### Named Test IDs For Specific Elements

Since [code is for humans](https://frontendmasters.com/teachers/kyle-simpson/code-is-for-humans/), 
it's better to avoid tests that assert things like _"a button with this particular 
class contains this particular text"_. A more effective test would verify
that _"the submit button contains the text `Submit`"_. 

The difference is subtle but important.

Kent C Dodds [recommends adding attributes to specific DOM nodes](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change).
This enables QA to find the elements they're looking for, without having to 
care about things like:

* The node's position in the DOM
* The node's Element type
* The class name strategy ([BEM](http://getbem.com/), [OOCSS](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/), etc.)

Dan Abramov at [Facebook recommends](https://twitter.com/dan_abramov/status/935661594729746434?lang=en) 
using `data-testid`. The [Cypress team recommends](https://medium.com/agilix/angular-and-cypress-data-cy-attributes-d698c01df062)
`data-cy`. 

And if you want to run tests in production ([which you should](https://opensource.com/article/19/5/dont-test-production))
you can use them there as well. Otherwise you can use Babel to [remove these attributes](https://github.com/kutyel/babel-plugin-remove-test-ids)
from your production builds.

**Bonus Points:** Abstract away the DOM into a [Page Object](https://martinfowler.com/bliki/PageObject.html).
This helps to reduce test flakiness and increase the value-lifetime of your tests.

### Positional Test Hooks For Iterable Elements

If your UI has things that appear in groups or lists, you'll want to enable the
QAs to make _meaningful_, _semantic_ element selections.

This could mean making it easier to:

* Select the first relevant item from a list
* Finding today's date in a calendar-picker
* Navigating pagination links
* Selecting specific data without caring what the data actually is

For example, a list of user profiles could add a hook on the element that 
represents the current user's profile:

```html
<a class="profile">Aaron</a>
<a class="profile">Betty</a>
<a class="profile" data-testid="current-user">Charlie</a>
<a class="profile">Denise</a>
<a class="profile">Edward</a>
```

Implemented this way, the test script doesn't care which user is logged in 
during the test. 

De-coupling the element selection logic from the test account data reduces the 
reliance on any particular data value, and makes for easier refactoring. 

### Stateful Test Hooks For Elements That Change

Instead of making the QA team write tests that infer the UI state from the 
existence or absence of elements on the screen, try making the UI state explicit.

For example, add a `data-state` to a collapsible component so it's easy to select
the expanded ones:

```html
<div data-state="collapsed">
    Lorum ipsum dolor sit amet...
    <button>Show more</button>
</div>

<div data-state="expanded">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
    tempor incididunt ut labore et dolore magna aliqua.
    <button>Show less</button>
</div>

<div data-state="collapsed">
    Lorum ipsum dolor sit amet...
    <button>Show more</button>
</div>
```

Some other examples of stateful test hooks include:

* `data-visibility="hidden"` on things that shouldn't be visible
* `data-state="loading"` on asynchronously-loaded data 
* `data-destination="offsite"` on links that go to different domains
* `data-editable="true"` or `data-disabled="true"` on custom form elements
* `data-animation="playing"` and `data-animation="finished"` on elements that have transitions
* `data-status="paid"` or `data-status="overdue"` on invoices according to their payment status

There are probably many more great examples you can use, but don't overdo it.
Accidentally exposing too much internal state is a [recipe for disaster](https://kentcdodds.com/blog/testing-implementation-details).

## 2. Broadcast Events

A large amount of QA effort is spent making sure [elements under test are actually
ready to be tested](https://www.stickyminds.com/article/using-test-automation-timeouts-performance-alarms). 
This means facing challenges like:

* Waiting for asynchronously-loaded data to be available
* Inconsistent rendering times of UI components
* Transitional animations
* Detecting errored and invalid UI states
* Waiting on page-change navigations and reloads

Many of these issues disappear if the test runner has some way of reliably 
determining when it can actually do its assertions. An easy way to do that is by 
exposing the state of a UI's _test-readiness_ to the test runner via standard event 
broadcasting.

Using the [JS Custom Event API](https://javascript.info/dispatch-events), you 
could dispatch events in response to the things that happen in your
interface. Then, the test runner or automation agent can listen for the things
it cares about like when:

1. The data is loaded and ready
2. Animations have started or finished
3. An error has occurred (so the test should be abandoned, or the error handled)
4. A long operation has finished
5. The page has finished loading (or reloading)

All of these things save the QA Engineer from having to derive the state of the 
application by UI content or DOM state, and will make for more deliberate, 
more self-explanatory test code.

## 3. Co-Locate Code and Tests

Sharing code across projects has such great benefits that [Google stores all of
its code for all of its products](https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext)
in a single repo. Similarly, the [meteoric rise of npm](https://www.pika.dev/about/stats) 
has hastened the development pace of Node and Web applications considerably.

QA Engineers can achieve similar productivity benefits if they have access to 
key parts of the application code as needed. Since the code and the tests for 
that code naturally have high cohesion, we should store them in the same place.

This relationship-based coupling is the same idea as the [group-by-feature](https://reactjs.org/docs/faq-structure.html)
architecture we use in modern React projects, but extended to apply to all of a
feature's supporting files too.

Other benefits of keeping the tests in the same place as the code include:

* Keeping the codebase DRY by sharing of testing hooks string constants, animation timings
and event names. Test files can import and use them by reference.
* Avoiding code and tests getting out of sync: changes to tests happen in the same commit 
as changes to code.
* Developers can run more test suites locally before any changes leave their machine.

Finally, even if there is orthogonal test code that must remain far from the application
code, you can still keep them together via some [monorepo arrangement](https://danluu.com/monorepo/).
Remember that code from different technologies, projects and developers can live 
together, but it [doesn't all have to be deployed together](https://devchat.tv/adv-in-angular/aia-256-debunking-monorepo-myths-with-victor-savkin/). 

## 4. Don't Let Unrelated Errors Hinder Specific Tests

As good practice, developers should try to contain the ill-effects of an error
to within the smallest part of their applications as possible. An error thrown 
in an AJAX query shouldn't crash a whole application. Similarly, a crash in a UI 
event handler shouldn't undermine the correct functionality of other things 
elsewhere. 

Isolating failures is [a key part of building resilient 
systems](https://medium.com/@adhorn/patterns-for-resilient-architecture-part-1-d3b60cd8d2b6), 
and the same philosophy should be applied to the application's tests.

If you're writing an e-commerce app for example, there would be tests
that cover:

* Searching, filtering and ordering of products in a category
* Pagination of search results
* Price option filters
* Product Colour option filters

Suppose during the running of the test suite, an error occurs in the colour option 
filters. Should this issue be caught by the tests relating to that module? Yes. 

Should that error fail the unrelated _price option_ filter tests? No. 

A test should assert the correctness of the thing it attempts to verify. Any less 
than that and you have unreliable tests. If it does any more than that, your tests 
violate the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
and should be decomposed.

## 5. Don't Duplicate Markup

This one is simple. Since most test runners do DOM operations, the DOM is 
really the only API that they have to understand the state of the UI. That is, 
most assertions are not done via visual means, only checking the existence and 
inner content of various elements on the page.

For example, having Desktop-only menus and Mobile-only menus with only CSS to 
control their appearance and behaviour will introduce unnecessary checks 
and complexities in QA. Instead, just have one set of menu links and do
what you need to do from there.

If you have duplicated markup, it's harder for the test runners (and QA
Engineers) to properly the right elements.

**Bonus Points:** [use your application without CSS](https://css-tricks.com/that-time-i-tried-browsing-the-web-without-css/)
to experience it through the eyes of screen readers, test runners and [text-only
 browsers](https://lynx.invisible-island.net/). 
If it makes sense without CSS, it will make sense with it. As they say in the 
Music Production field: [_"If it sounds good on cheap speakers, it'll sound good
anywhere"._](https://www.recordingrevolution.com/the-cheap-speaker-test/)

## 6. Write The Tests Yourself

QA Engineers are a necessary and important part of software development, but
they should never be seen as babysitters who test your code just so you don't have to.

As John Sonmez [puts it](https://simpleprogrammer.com/software-developers-qa-testers/):

> QA is a last defense before your code goes out and wreaks havoc on your customers.
> Don’t expect testers to find your bugs, expect them to validate that your code works.
> It’s your responsibility to test your code before you hand it over to QA.

Since you're already writing unit tests for your code, so why not [write 
some integration tests and end-to-end tests as well](https://testingjavascript.com/)?
After all, _you_ know the features, _you_ know the tricky bits, and _you_ know a good 
range of input parameters that can verify your code works as expected. 

Sure, high quality QA Engineers will likely imagine more testing scenarios than 
you can -- but your value-add should not be understated.

The advantages of developers writing tests normally done by QA
include:

1. Tests delivered alongside features means a reduction or elimination of outdated
tests. As features are created, updated or removed, the tests can also follow
suit without a cross-departmental delay.
2. Having basic test scenarios written with the feature code means the catastrophic
and obvious defects should never arise -- if the feature is clearly broken, then
your own tests won't pass.
3. It's probably faster for a developer to write certain test scenarios during
the course of the feature's development than to get QA's "fresh eyes" on it for
all scenarios.
4. Many testing stacks can use similar technology to the development stack (eg: 
Cypress is all Node/JavaScript).
5. Testers can spend more time working on higher-quality tests, or do more 
[exploratory testing](https://www.testingexcellence.com/exploratory-testing-important-agile-projects/).
6. You end up building a regression suite alongside each feature. New bugs can 
have regression tests delivered with the fix.

Maybe the most important benefit is that you'll gain a greater understanding of the
role of QA in the software development process, and you'll increase your 
cross-discipline collaboration.

**Bonus Points:** Go speak with someone in your QA team if you need help getting 
started or getting some testing tips -- this stuff is what they do best!

## Conclusion

Whatever software development methodology your business is using, the need for
testing is paramount. 

If developers can build their user interfaces to enable easier testing, a 
positive feedback loop can be set in motion: higher-quality tests will lead to 
higher-quality software. 

We all want better software. See what you can do to make user interfaces easier 
to test and collaborate with your QA team to understand what would it take to 
make their job easier.