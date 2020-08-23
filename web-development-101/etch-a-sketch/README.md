# Etch A Sketch project for The Odin Project

Pretty happy with how this turned out. It was fun figuring out how to make everything work.

### I decided to implement this project with these three main ideas in mind:
1. Sketchpad cells will be square
1. Sketchpad will automatically resize depending on browser's window size
1. Entire sketchpad will always be visible without needing to scroll the page

In the process though I found out that if we always keep sketchpad's cells square, then if number of collumns and rows is too uneven, the sketchpad will appear pretty small if we want to display all of it on the screen withount needing to scroll. So I just made sketchpad itself square and left the cells' sizes to be inferred. The functionality for making cells appear square is there I just commented it out.

The other peculiar thing was figuring out how am I going to keep the same aspect ratio for sketchpad when it resizes. I found no straightforward way of setting element's `height` equal to element's `width` or to its fraction in css. But I didn't want to set it in JavaScript too, so I had to do something unconventional using `::before` pseudo element. I don't completely get how it works, but when using `padding-top: 100%` on `::before` pseudo element this `100%` refers to `100%` of element's `width` and so this `padding-top: 100%` will sort of act like `height = width * 1` (1 = 100%). I got this solution from [CodePen](https://codepen.io/ItScofield/pen/PNVZoQ).

Shading pen uses `data-brightness` custom attribute and I wonder if this is the optimal way of attaching custom properties to an element.
Also the `onWindowResize()` callback function could be improved cause we don't always need to update sketchpad's width when window resizes.

Check it out live on my [GitHub Pages](https://shadou1.github.io/the-odin-projects/web-development-101/etch-a-sketch/). Hold down left mouse button to draw. Shading pen will only shade already painted cells.
