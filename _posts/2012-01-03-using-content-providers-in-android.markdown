---
layout: post
title: Using content providers in Android
published: false
---

# {{ page.title }}

{: class="meta"} 03 Jan 2012 - Krefeld, Germany

In this blog post I'll show you how to get data stored on an Android phone using content providers.
We'll write an app that fetches all the bookmarks and history from the phones browser.

In Android all the content providers are stored in the package: <code>android.provider.*;</code>
They are queried using their URIs and Cursors.
Specifically the Browser's Bookmark and History content provider URI is in: <code>android.provider.Browser.BOOKMARKS_URI;</code>
(The name is a bit misleading, since it is the URI for <i>BOTH</i> Bookmarks and History.)
To retrieve data you need to find the names of the columns you want to retrieve and put them in an Array.
You can find the package that contains the column definition for the bookmarks and history <a href="http://developer.android.com/reference/android/provider/Browser.BookmarkColumns.html">here</a>.
<p>So let's get started!</p>
Let's first set up all the variables:

<script src="https://gist.github.com/1554163.js?file=variables.java">
</script>

Now that we have the basic variable we can write the cursor. The function that creates it takes a lot of
variables. As you can see not many of these are important for us:

<script src="https://gist.github.com/1554163.js?file=cursor.java">
</script>

Next we can make a new onClick listener for the button. This listener basically loops
through all the data rows and does something with them:

<script src="https://gist.github.com/1554163.js?file=onclicklistener.java">
</script>

Now you have a list containing the bookmarks and history of a phones browser and you could for example send the urls to a server.

<p>You can download the whole Activity <a href="https://raw.github.com/gist/1554163/7a0b4101462d4e0685289e6c0920b7e5c8d490a7/activity.java">here</a></p>