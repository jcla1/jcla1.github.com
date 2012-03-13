---
layout: post
title: Web Audio API overview (Part 1 of 2)
---

# {{ page.title }}

{: class="meta"} 11 Mar 2012 - Krefeld, Germany

In the next 2 blog posts I'll be showing you some essential features of the Web Audio API. You can find its specification [here](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html).
The Web Audio API provides nearly all the functionality of a normal synthesizer, one of the reasons why it is so powerful.

Anyway let's get going. I'm going to talk you through the source of a little audio visualizer in this post and the next one. [Here is a demo of the final product.](/demos/web-audio-api/web-audio-overview-part2.html)
In this first post I'll concentrate on [a simplified version](/demos/web-audio-api/web-audio-overview-part1.html).

__WARNING!__ These demos will only work in up to date versions of Chrome! (currently 19+)

Now let's look at the HTML body structure. In this case it is very simple, it has a main <code>#container</code>, that (as the name says) contains a canvas and an audio element. After that there are a couple of script tags. 

<script src="https://gist.github.com/2015620.js?file=body.html">
</script>

You may already know what the contents of the first script tag are for.
It is a shim by [Paul Irish](http://paulirish.com) that makes it easier to use the <code>requestAnimationFrame()</code> (To get more info read his [blog post](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)). I'm not going to go further into how it works, but all it does *really* is make user friendlier animations.

The important parts for this blog post are the contents of the 2nd script tag:

<script src="https://gist.github.com/2015620.js?file=main.js">
</script>

The <code>webkitAudioContext()</code> created, is a context in which the audio interactions take place. Similar to the ones mentioned in my [previous post](/blog/2012/01/08/exploring-the-v8-js-engine-part-2/).

You could divide it into 2 main parts:
-	The setup
-	The animation's <code>draw</code> function

<br />

## The setup

sets up all the variables (except "freqData") and provides information on how each bar drawn should look.
The <code>init</code> function connects the source of the audio (the audio element) with the analyzer and connects the analyzer with the destination. i.e. the speakers

You can imagine connecting up <code>source</code>, <code>analyzer</code> and <code>destination</code> as taking a few plugs and plugging them in some hardware.
The only difference is that this is virtual!


## The animation's <code>draw</code> function
takes care of drawing the bars.


But what does that mean *exactly*?

1.	Call the <code>requestAnimFrame</code> function to restart the animation at just the right time.

2.	Create a typed array (called <code>freqData</code>) for holding the individual frequencies.
The parameter passed at creation is the size of the array (In this case <code>1024</code> items).

3.	Call a function on the analyzer to put the frequencies in <code>freqData</code> (it doesn't return anything). 

4.	Simply clear the canvas.

5.	Loop through all the frequency data (except that in the offset) and each time:
	
	-	Get the current frequency

	-	Draw a bar that is as high as the frequency. The magnitude has to be negative here so that the bar is drawn in the correct direction.

6. Lather. Rinse. Repeat.

-----

Nearly everything that has to do with the Web Audio API inherits from an object called <code>AudioNode</code>, which contains some basic structure for working with audio.
For example the analyzer we are using here is also inherited from <code>AudioNode</code>. Other examples of Audio Nodes are <code>BiquadFilter</code>, <code>LowPassFilter</code>, <code>AudioGainNode</code> and many more. I will be covering some of them in part 2 of this mini series.



