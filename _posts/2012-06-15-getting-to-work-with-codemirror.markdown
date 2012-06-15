---
layout: post
title: Getting to work with CodeMirror
---

# {{ page.title }}

{: class="meta"} 15 Jun 2012 - Krefeld, Germany

Recently on [Hackernews](http://news.ycombinator.com/) I found an interesting link. It pointed to [RubyFiddle](http://rubyfiddle.com/). The site is really nice, but my favourite bit was the editor.
By then I had already guessed they hadn't done it themselves so I _investigated_ (looked in the source..) and found they're using [CodeMirror](http://codemirror.net/).
I had heared about CodeMirror before but I never really liked online IDEs. But this editor __really__ caught my eye so I decided to try the most basic setup.
Turns out, it's really simple! It's just 1, in words one, line of Javascript! (Plus basic HTML)

<script src="https://gist.github.com/2938024.js?file=oneliner.js">
</script>

That is all that is needed. Thanks to Marijn Haverbeke for such a great online editor.

Below is a screenshot of it with the HTML written in it.

<img src="/img/codem.png" width="640">