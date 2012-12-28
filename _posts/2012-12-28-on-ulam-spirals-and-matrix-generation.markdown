---
layout: post
title: On Ulam spirals and matrix generation
---

# {{ page.title }}

{: class="meta"} 28 Dec 2012 - Manchester, England

# Intro
One of my Christmas presents was the fabulous book: [Getting Started with D3](http://shop.oreilly.com/product/0636920025429.do)
by Mike Dewar. I recommend reading it, if you haven't already! But anyway, after I had read it, I was looking for some
data I could visualize. The book suggested the New York transit dataset, but I didn't want to have to clean it just
to play with d3.
So after a bit of thinking and doing distractive things, I remembered having read about Ulam spirals quite a while back.

# The Idea
The decision was made, what was missing was the data. I wanted to refresh my knowledge about [Ulam spirals](http://en.wikipedia.org/wiki/Ulam_spiral),
so I loaded up Wikipedia and copied the spirals onto a whiteboard. I gave myself the task of finding
an algorithm that would generate *just* number spirals, given a dimension and <code>[x, y]</code> coordinates to return a value.
I also gave this task to my father [@qmacro](http://pipetree.com/qmacro), so we would compete on finding an algorithm.

The source of both finished algorithms is here:

* Mine: [Github](https://github.com/jcla1/ulam)
* My father's: [Github](https://github.com/qmacro/ulam)

and I ran them through JSPerf [here](http://jsperf.com/ulam-spiral).

# Finding an algorithm
My approach was, I would say, a bit clumsy. It took quite a while, until I actually got anywhere, but when I finally
did something it was an analytical approach. My idea was to just stare at the spiral for a long time until something
magically flew to my mind. And, as opposed to the expectations you may have to the outcome of this, I suddenly had an idea.
During the staring time I made some interesting observations, as can be seen in the next section.

# Observations
Here is a sample 4x4 & 5x5 matrix so you can follow along:


                    ___________________   ________________________
                    |16 | 15 | 14 | 13|   |17 | 16 | 15 | 14 | 13|
                    |-----------------|   |----------------------|
                    |5  |  4 |  3 | 12|   |18 |  5 |  4 |  3 | 12|
                    |-----------------|   |----------------------|
                    |6  |  1 |  2 | 11|   |19 |  6 |  1 |  2 | 11|
                    |-----------------|   |----------------------|
                    |7  |  8 |  9 | 10|   |20 |  7 |  8 |  9 | 10|
                    -------------------   |----------------------|
                                          |21 | 22 | 23 | 24 | 25|
                                          ------------------------
<br />

* Number spirals are just some matrices that follow a certain pattern.
* The dimension squared is the highest value of the matrix.
* The location of the dimension squared is dependent on parity: If odd, in the bottom right, if even, in the top left, corner of the matrix.
* You can work out the numbers on the outer rim of the matrix with simple formulas.
* If you compare the two matrices, how are they different? The 5x5 matrix has one "frame" more than the 4x4 matrix.
  You could imagine it just being stuck on one of the sides, if you need higher dimensions.
  Again the side on which the last frame was "stuck" is determined by the parity of the dimension.
  (In this case onto the left-bottom side)

So from these observations you could draw some conclusions, which I did!

# Conclusions

Based on the previous observations I had the thought that one could just "drop a frame" if
the desired number doesn't lie within the area of that frame.
So I wrote a function that worked out if "dropping a frame" was possible.
It takes coords of the location of the number you would like to have, and the dimension of the matrix.

<script src="https://gist.github.com/4397033.js?file=check_if_drop_frame.js">
</script>

In simple terms, the function checks the parity of the dimension and then checks
if the coords <code>[x, y]</code> lie within the last frame.
The idea is just to make the matrix smaller so, the original coords lie on the outermost frames,
from which we know from the observations that they are easy values to work out.
But in order to do so, we can't simply decrement the number of dimensions and leave the coords the same,
we have to translate them.

<script src="https://gist.github.com/4397033.js?file=translate.js">
</script>

This function again checks the parity and from that is knows which coord it needs to decrement,
either <code>x</code> or <code>y</code>. So putting those two thing together we just drop frames/dimension
as long as that is possible:

<script src="https://gist.github.com/4397033.js?file=while_loop.js">
</script>

Once that loop has finished, it is guaranteed that the coords describe a number on one of the outermost frames.
From there one only needs to find formulas to work out the value. Luckily I have already done that for you,
they are a bit messy but they work. Wrapped in a function they look roughly like this:

<script src="https://gist.github.com/4397033.js?file=work_out_value.js">
</script>

Basically, the function works out which is the outermost frame and then takes the dimension squared,
whose position we can foresee, and works backward towards to desired coords.

With a bit of boundary checking you can see the complete source [here](https://github.com/jcla1/ulam/blob/master/matrix.js).

# Hooking it up with d3!

After I had figured out all of this it was night time, and I wasn't really bothered with good code style
at that time of day, but since I wasn't satisfied yet I hooked it up with d3, and made my own ulam spiral.

<iframe src="/demos/ulam-spiral/ulam_spiral.html" width="500" height="500" style="overflow:hidden;border:none;">
</iframe>

This demo generates a 2d array and then loops though each element and checks if it is a prime.
If it is it sets the fill-color to red, else just leaves it gray.
Then it just gets d3 to draw the matrix.













