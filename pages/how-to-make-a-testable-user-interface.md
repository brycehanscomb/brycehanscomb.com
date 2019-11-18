# How To Make A Testable User Interface
 
## A guide to creating web UIs that maximise testability and minimise test flakiness.
 
As the web has matured into a viable application platform, the complexity of products 
we build on it has increased. Responsive design, touch screens, and rich media 
interactions have lead to an increase in the number of things that web developers need 
to get right.

And as we all know, software is really hard to get right. Luckily, QA Engineers exist to
verify that what the Developers build is what the business wants. At a basic level, this 
means verifying things like:

* Does the product do what it's meant to do?
* Does the product properly handle edge cases and failure modes?
* Does the product have adequate performance and security?

As user expectations for quality in digital experiences reaches an all time high, 
ensuring that UIs can be effectively tested by the QAs is critical. Catching issues
before they reach production has shown to be 
[orders-of-magnitude cheaper](https://www.jrothman.com/articles/2000/10/what-does-it-cost-you-to-fix-a-defect-and-why-should-you-care/)
to fix, and ensures that user experiences remain smooth and delightful.

It follows then that the easier it is for a QA to test a UI, the better their ability 
to find defects. 

But what can web developers do to assist? Here's five things web developers can 
do in the course of their duties to increase the testability of their user interfaces:

## 1. Expose Testing Hooks

### Named Test IDs For Specific Elements

No UI test actually needs to assert that "a button with this particular class
contains this particular text". A more effective test would seek to assert that "the submit 
button contains the text `Submit`". The distinction is subtle but important.

Kent C Dodds [recommends adding attributes to specific DOM nodes](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change).
This enables QA to find the elements they're looking for, without having to 
care about things like:

* The node's position in the DOM
* The node's Element type
* The class name strategy (eg: [BEM](http://getbem.com/), [OOCSS](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/))

Dan Abramov at [Facebook recommends](https://twitter.com/dan_abramov/status/935661594729746434?lang=en) 
using `data-testid`. The [Cypress team recommends](https://medium.com/agilix/angular-and-cypress-data-cy-attributes-d698c01df062)
`data-cy`. 

Whatever you decide, you can even use Babel to [remove these attributes](https://github.com/kutyel/babel-plugin-remove-test-ids)
from your production bundles. Unless you want to keep them in for [tests you should
run in production](https://opensource.com/article/19/5/dont-test-production).

For bonus points, you can then abstract away the DOM into a [Page Object](https://martinfowler.com/bliki/PageObject.html).

### Positional Test Hooks For Iterable Elements

* Don't rely on particular data (eg: select first invoice instead of hard-coding the 
first invoice we know of and then find by that one)

### Stateful Test Hooks For Elements That Change

Instead of making the QA team write tests that infer the UI state from the 
existence or absence of elements on the screen, try making the UI state explicit.

For example, add a `data-state` to a collapsible component so it's easy to select
the expanded ones:

```html
<div data-state="collapsed">
    Lorum ipsum dolor sit amet...
</div>

<div data-state="expanded">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
    tempor incididunt ut labore et dolore magna aliqua.
</div>

<div data-state="collapsed">
    Lorum ipsum dolor sit amet...
</div>
```

Some other examples of stateful test hooks include:

* `data-visibility="hidden"` on things that shouldn't be visible
* `data-state="loading"` on asynchronously-loaded data 
* `data-destination="offsite"` on links that go to different domains
* `data-editable="true"` or `data-disabled="true"` on custom form elements
* `data-animation="playing"` and `data-animation="finished"` on elements that have transitions

There are probably many more great examples you can use, but don't overdo it.
Accidentally exposing too much internal state is a [recipe for disaster](https://kentcdodds.com/blog/testing-implementation-details).

## 2. Broadcast Events

Allow the testing framework or automation agent to listen to events being sent from the
 page. They can then act/react based on them (instead of using timeouts, 
 wait-till-visible, etc.)

* When page is ready to be interacted (for automation)
* When animations are occurring (and finished)
* When an error has occurred (allow automation agent to quit early instead of trying to
 infer error states from the UI)
 
## Co-locate the code and tests

* Sharing of testids, animation timings, etc. so tests can import and use them by 
reference -- avoids duplication
* Avoid code and tests getting out of sync (changes to tests happen in the same commit 
as changes to code)
* Can run existing test suites locally before any changes leave dev's machine

## Don't let unrelated errors hinder a specific test

* Ensure small broken parts don't crash the whole app (that failing feature should 
break its own tests)

## Don't Duplicate Markup

* Don't have 2 menus, one for desktop one for mobile.  headless agents can't tell
the difference

## Get Developers to write more tests than just unit tests

* Reference to "The Testing Trophy" concept
* Integration tests can be run using the same stack as e2e tests (eg: Cypress)
* Testers can verify a test's usefulness instead of writing it from scratch, allowing 
testers to spend more time on other activities ie: exploratory testing
* Regression suite is built alongside the feature and new bugs can have regression 
tests delivered with the fix.