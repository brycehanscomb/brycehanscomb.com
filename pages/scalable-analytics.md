# Scalable Analytics

## An architecture for Event-Based tracking in large web applications

With the advent of the Component-Tree Model, developers have enjoyed building web
UIs from the composition of smaller, independent, functional components. 
Disadvantages to this approach include the challenges faced when implementing 
system-orthogonal functionality like authentication, logging, or analytics.

This article demonstrates an architecture that enables building analytics systems
which are compatible with the React Component philosophy.

## Key Idea 1: Analytics as an Event Stream

Many analytics providers such as Google and Adobe conform to a specification 
called [Customer Experience Digital Layer](https://www.w3.org/2013/12/ceddl-201312.pdf)
which defines how website owners should manage a global variable called 
`window.digitalData` that houses all analytics-related data. 

There are a few issues with this system:

1. Keeping all properties of one big object up to date is fragile and error-prone
2. Security / privacy implementation details are dismissed as "out-of-scope"
3. There's no way to see how the data may have changed over time
4. Relying on global variables in Javascript is unwise
5. It's impossible to determine who / why / when a property was set
6. You'll encounter friction when moving to [server-side tagging](https://developers.google.com/tag-manager/serverside)

Fortunately, all these issues can be resolved by changing how tracked data is 
surfaced by the application. Instead of user interactions adding data to a 
global object, they can be modelled as a timeline of events.

## Key Idea 2: The Two Axes of Event Data

If you consider the data along an event stream to be aligned on an "x-axis", then
the payload embedded in each event can be imagined as the "y-axis". 

Plucking data points from along the x-axis relates to data gathered "across" the
session, plucking from the y-axis relates to the data gathered from a single 
event.

### X-Axis Data Analysis

Insights gained from x-axis analysis tend to be session-based like:

[ Load reset password screen ] --> [ Input password ] --> [ password validation failed ] 
    --> [ input password ] --> [ password validation failed ] --> [ input passwor] 
    --> [ password validation failed ] --> [ input password ] --> [ password validation
    ok ] -> [ submit ]

One might gather from events like this that a user struggled to come up with a
password that met your application's validation requirements. This could lead to
an insight like "Our password rules are too tough" and implies its worth looking
into password requirements that users don't struggle with.

### Y-Axis Data Analysis

Data insights on the y-axis tend to appear more in-the-moment than the 
"across-time" nature of x-axis data. For example, a Product Selection Event 
could include the following information:

```
{
  action: "product selection",
  target: "#buy_now_button__starter",
  visible_products: [ "starter", "standard", "premium" ]
  chosen_product: "starter",
  button_text: "Buy a Starter Plan now"
}
```

Of this contrived example, a Data Analyst could infer that the user clicked the
first (or left-most) product on the screen. Given what we know about peoples'
biases to [simply pick the first option presented](https://www.dailycal.org/2012/07/11/new-study-reveals-first-is-best/)
this could lead to actionable insights about product ordering and placement.

#### Stacked-Y-Axis Data Analysis

((analysing data across sessions, eg average page load speed from various Page Load events))

## Key Idea 3: Adding Context via Event Bubbling

DOM events have a useful feature called [bubbling](https://en.wikipedia.org/wiki/Event_bubbling),
where an event fired deep in the document tree will propagate upwards through 
each of the target element's parent nodes successively until reaching the 
topmost element in the document -- the Window. 

Since a parent element is able to intercept a bubbling event and add some extra
information to it, this provides the perfect mechanism for cumulatively adding
"context" to an event's payload at any level of the DOM tree.

If a button triggers a bubbling event `onClick` that should be tracked by 
analytics vendors, some basic information can be sent by the button itself, such
as: 

* The button's text
* The target URL or `href`

Often this is not enough information to truly paint a picture of the user's 
actions. As the click event bubbles up, React Components responsible for other
parts of the application can add their own contextual data such as:

* The user's authentication state (e.g. via a `<UserManager>`)
* The current page's URL, title and other metadata (e.g. via the root `<App>`)
* The items in the user's shopping cart (e.g. via a `<CartContext>`)

Each one of these components can adhere to the [single responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)
but in aggregate perform system-orthogonal functionality.

## Benefits

* compatible with pure component model
* reduces vendor lock-in
* testability
* separation-of-concerns
* separates general-purpose from special-purpose code
* scales to as many listeners as needed
* does not block the UI thread