# Google search results page project for The Odin Project.

Most of the work was inspecting developer tools to find out how google aligns elements on the page with `margin` / `padding` properties. Most of the `margin` / `padding` values are taken directly from CSS. Other properties like `font-size` and `line-height` were also important to alignment. `color` and `background` values were also taken from CSS. Some items could've been aligned better by not using `margin` / `padding` and instead using parent containers to align child items.

Many of CSS lines are repeated for different selectors so that could've been also implemented better by using two classes for one element for example. But due to how I structured my HTML, with `anchor` elements wrapping different elements, when you only want to underline one elements when you hover over such link it would've been difficult.

* Buttons don't do anything and links don't go nowhere and videos are just images, that's okay for this project.
* Page navigation section was really wierd to make the way google did it with the `table` element.
* I was thinking on adding an Images section but I figured it was enough already.
* Page is completely unresponsive to width change, just like it should be.

Overall I can conclude that I should've better structured my HTML to then be able to easily align items using CSS with not too much repetition.

Also disregard all text on the page.

[GitHub Pages link](https://shadou1.github.io/the-odin-projects/web-development-101/google-search-results-page/)
