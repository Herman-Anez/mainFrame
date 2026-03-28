# id Attribute

The id attribute specifies a unique id for an HTML element. The value of the id attribute must be unique within the HTML document.

The id attribute is used to point to a specific style declaration in a style sheet. It is also used by JavaScript to access and manipulate the element with the specific id.

The syntax for id is: write a hash character (#), followed by an id name. Then, define the CSS properties within curly braces {}.

In the following example we have an `<h1>`element that points to the id name "myHeader". This `<h1>` element will be styled according to the #myHeader style definition in the head section:

```html
<style>
    #myHeader {
     color: black;
    }
</style>
<h1 id="myHeader">My Header</h1>

```
Difference Between Class and ID
A class name can be used by multiple HTML elements, while an id name must only be used by one HTML element within the page: