# Scalable Analytics

## An architecture for Event-Based tracking in large web applications

With the advent of the Component-Tree Model, developers have enjoyed building web
UIs from the composition of smaller, independent, pure functions. This leads to
challenges when trying to implement system-orthogonal functionality like 
authentication, logging, analytics.

This article demonstrates an architecture that enables building analytics systems
which are compatible with the React Component philosophy.

## Key Idea 1: Analytics as an Event Stream

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