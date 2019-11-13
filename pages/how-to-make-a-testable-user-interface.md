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
before they reach production has shown to be 10 - 100 times cheaper to fix, and 
ensures that user experiences remain smooth and delightful.

## 5 Ways To Increase Testability

### 1. Expose Testing Hooks

* Abstract away the DOM -- reference to the "Page Object" pattern
* Don't rely on particular data (eg: select first invoice instead of hard-coding the 
first invoice we know of and then find by that one)
* Expose values (eg: timestamps and currencies) un-formatted in machine-readable 
formats so the automation agent doesn't have to re-parse UI data to check calculations

### 2. Broadcast Events

Allow the testing framework or automation agent to listen to events being sent from the
 page. They can then act/react based on them (instead of using timeouts, 
 wait-till-visible, etc.)

* When page is ready to be interacted (for automation)
* When animations are occurring (and finished)
* When an error has occurred (allow automation agent to quit early instead of trying to
 infer error states from the UI)
 
### 3. Co-locate the code and tests

* Sharing of testids, animation timings, etc. so tests can import and use them by 
reference -- avoids duplication
* Avoid code and tests getting out of sync (changes to tests happen in the same commit 
as changes to code)
* Can run existing test suites locally before any changes leave dev's machine

### 4. Don't let unrelated errors hinder a specific test

* Ensure small broken parts don't crash the whole app (that failing feature should 
break its own tests)

### 5. Get Developers to write more tests than just unit tests

* Reference to "The Testing Trophy" concept
* Integration tests can be run using the same stack as e2e tests (eg: Cypress)
* Testers can verify a test's usefulness instead of writing it from scratch, allowing 
testers to spend more time on other activities ie: exploratory testing
* Regression suite is built alongside the feature and new bugs can have regression 
tests delivered with the fix.