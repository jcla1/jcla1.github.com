---
layout: post
title: Web Audio API overview (Part 2 of 2)
---

# {{ page.title }}

{: class="meta"} 06 Apr 2012 - Manchester, England


In the [first part](/blog/2012/03/11/web-audio-api-overview-part1/), we looked at the basics of the Web Audio API and using it to visualize music.
In this second part I'll be showing you how to implement a LowPass Filter and gain control in our example from the first part.
We'll add some colour to it too.

Let's start with the easiest bit, the color.
To change the color of the bars, all you need to do is change <code>ctx.fillStyle = "white";</code> to whatever color.
If you're like me, you won't like single color bars. I think those bars deserve a nice rainbow gradient. This is done very easily:

<script src="https://gist.github.com/2015620.js?file=gradient.js">
</script>

And that's it now we've a nice gradient.

Next up, gain. You can create one just like an analyser:

<script src="https://gist.github.com/2015620.js?file=gain_create.js">
</script>

Now we have a <code>GainNode</code>, but no way for the user to interact with it.

To give the user some control over the gain, we'll have a well-known input.
<script src="https://gist.github.com/2015620.js?file=gain.html">
</script>

The reason it has a max value of 1 is that the <code>GainNode</code> by default sets this value (It is possible to change this).
Of course an input alone doesn't do anything. We'll add an event listener to it:

<script src="https://gist.github.com/2015620.js?file=gain_listener.js">
</script>

This snippet sets <code>gain.gain.value</code> to the value on the input.
And that is all there is to it.


Adding a LowPass filter is the same procedure.

1.  Add an input box.
2.  Create the LowPass filter in Javascript.
3.  Add a binding between input and LowPass filter

Here is the source code:

<script src="https://gist.github.com/2015620.js?file=filter.html">
</script>

In this short series I have demonstrated how easy it is to work with the Web Audio API. You now know how to create Audio nodes and change their affect on audio.
