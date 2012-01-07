---
layout: post
title: Exploring the V8 JS engine (Part 1 of 2)
---

# {{ page.title }}

{: class="meta"} 07 Jan 2012 - Krefeld, Germany

This is the first part of a 2 part series giving a simple technical overview of the V8 Javascript engine.

First of all some basic facts:

-	Developed and maintained by Google
-	Javascript engine behind Google Chrome
-	Also powers Node.Javascript
-	Really Fast!

V8 is written in C++ so you should have basic understanding of OOP and some C/C++ knowledge wouldn't do bad too.
The engine (V8) executes Javascript in so called <code>contexts</code>, these are sandboxed and you can create multiple contexts in one V8 virtual machine (engine).
This has the advantage that if you run 2 (or more) Javascript programs you don't have to worry about namespacing. The creation of these contexts is not as memory hungry as you may think, so don't worry about that.
One of the great features of V8 is sharing C++ functions, objects and variables with Javascript, which we will cover in the second part of this series. To use V8 you write a C++ program that uses the V8 libs (to set up the contexts, scopes, templates) and then executes a string which is your Javascript program. You will understand how this works later in this post.

I'll take you through setting up the V8 lib and a simple <code>Hello World!</code> program.

## Downloading and Building

I'm using a Mac to build the library, but <a href="http://code.google.com/p/v8/wiki/BuildingOnWindows">Windows is supported too</a>.
To build V8 you will need:

-	Subversion 1.4 or higher
-	Python 2.4 or higher
-	SCons 1.0.0 or higher
-	GNU Compiler (GCC) 4.x.x

Downloading the source:

	$ mkdir ~/dev/
	$ cd ~/dev/
	$ svn checkout http://v8.googlecode.com/svn/trunk/ v8-read-only
	$ mv v8-read-only v8

Now you have the source you can build the V8 library and header file:

	$ scons
	scons: Reading SConscript files ...
	scons: done reading SConscript files.
	scons: Building targets ...
	...

Simple isn't it? Now once the build has finished you should be able to see the <code>libv8.a</code> file. This file is important for compiling the C++ program that uses the V8 library.

## Your first V8 program

No that you have all the parts needed for compiling a C++ program that uses the V8 classes, let's get to the interesting part.

Here is a simple C++ program that runs the Javascript: <code>"Hello World!";</code>. Obviously, this is not a very spectacular Javascript program, but it should do to our needs. The comments explain what a each part does:

<script src="https://gist.github.com/1574928.js?file=hello_world.cc">
</script>

Save that in a file called hello_world.cc in the <code>~/dev/v8/</code> directory.
Next you need to compile the <code>hello_world.cc</code> file by doing:

	$ g++ -m32 -Iinclude libv8.a -lpthread hello_world.cc -o hello_world

This compiles the hello world program to a 32-bit executable that includes the <code>libv8.a</code> library.
If the compilation was successful you should have a new file called <code>hello_world</code> in your V8
directory. Then you execute the file and it should print out "Hello World!" (without the quotes):

	$ ./hello_world
	Hello World!

Congratulations you have just run your first program that uses V8.

In the next part of this series we'll look into sharing variables and objects and dig into the source of Node.Javascript.






