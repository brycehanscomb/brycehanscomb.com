# Scalable Analytics

## An architecture for Event-Based tracking in large web applications

With the advent of the Component-Tree Model, developers have enjoyed building web
UIs from the composition of smaller, independent, pure functions. This leads to
challenges when trying to implement system-orthogonal functionality like 
authentication, logging, analytics.

This article demonstrates an architecture that enables building analytics systems
which are compatible with the React Component philosophy.

## Key Idea 1: Analytics as an Event Stream

Many analytics providers such as Google and Adobe conform to a specification 
called [Customer Experience Digital Layer](https://www.w3.org/2013/12/ceddl-201312.pdf)
which defines how web site owners should manage a global variable called 
`window.digitalData` that houses all analytics-related data. 

There are a few issues with this system:

1. Keeping all properties of one big object up to date is fragile and error-prone
2. Security / privacy implementation details are dismissed as "out-of-scope"
3. There's no way to see how the data may have changed over time
4. Relying on global variables in Javascript is unwise

## Key Idea 2: The Two Axes of Event Data

## Key Idea 3: Adding Context via Event Bubbling

## Benefits

* compatible with pure component model
* reduces vendor lock-in
* testability
* separation-of-concerns
* separates general-purpose from special-purpose code
* scales to as many listeners as needed
* does not block the UI thread