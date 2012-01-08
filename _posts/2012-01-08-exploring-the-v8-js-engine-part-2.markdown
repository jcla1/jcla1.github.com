---
layout: post
title: Exploring the V8 JS engine (Part 2 of 2)
---

# {{ page.title }}

{: class="meta"} 08 Jan 2012 - Krefeld, Germany

This is the second part of a 2 part series giving a simple technical overview of the V8 Javascript engine.

In the <a href="http://jcla1.com/blog/2012/01/07/exploring-the-v8-js-engine-part-1/">first part</a> of this series I showed you how simple it is to get started with the V8 Javascript engine.
In this second part we'll look into sharing objects and variables in a V8 program, as well as digging into the source of the popular (on V8 based) <a href="http://nodejs.org/">Node.js</a>, to see how variable/object sharing is implemented in a real world example.

In V8 there are 2 types shared variables:

-	Variables where you can change the value
-	Variables with an unchangeable value

**Warning**: You are able to change the value of and unchangeable variable, but it will only be reflected in the Javascript (not the C++).

For variables with an unchangeable value you only have to set the value.
This is a bit trickier with shared variables that are changeable, for those you need "Getter" & "Setter" functions, that get called when the variable is accessed.
I will cover both of those types below and then show them implemented in the Node.js source:

## Variables with an unchangeable value

Based off our previous example, sharing an unchangeable variable is pretty simple. All you have to do is use the <code>Set(...)</code> function to set the variable's value. Based off our <a href="/blog/2012/01/07/exploring-the-v8-js-engine-part-1/#gist-1574928">previous example (part 1 of this series)</a> this is quite easy to implement.

This program will create the variable <code>pid</code> in the Javascript's context:

<script src="https://gist.github.com/1578321.js?file=share_variable_unchangeable.cc">
</script>

<noscript>
<![CDATA[
	#include <v8.h>
	#include <unistd.h>
	// Include the header that contains the "getpid()" function
	
	using namespace v8;
	
	int main(int argc, char* argv[]) {
	
	// Create a stack-allocated handle scope.
	HandleScope handle_scope;
	
	Handle<ObjectTemplate> global_templ = ObjectTemplate::New();
	global_templ->Set(String::New("pid"), Integer::New(getpid()));
	
	// Create a new context.
	Persistent<Context> context = Context::New(NULL, global_templ);
	
	// Enter the created context for compiling and
	// running the hello world script. 
	context->Enter();
	
	// Create a string containing the JavaScript source code.
	Handle<String> source = String::New("pid;");
	
	// Compile the source code.
	Handle<Script> script = Script::Compile(source);
	
	// Run the script to get the result.
	Handle<Value> result = script->Run();
	
	// Dispose the persistent context.
	context.Dispose();
	
	// Convert the result to an ASCII string and print it.
	String::AsciiValue ascii(result);
	printf("%s\n", *ascii);
	return 0;
	}
]]>
</noscript>

If you save it in a file called <code>variable_share_unchangeable.cc</code> (in <code>~/dev/v8/</code>) you can compile and run it with:

	$ g++ -m32 -Iinclude libv8.a -lpthread variable_share_unchangeable.cc \
		-o variable_share_unchangeable
	
_For more information on running and compiling see <a href="http://jcla1.com/blog/2012/01/07/exploring-the-v8-js-engine-part-1/">the first post</a>_

When this program is run it will print out its own <code>pid</code>. The interesting thing about that is now though, that the <code>pid</code> is accessed by the Javascript not the C++.

## Variables with a changeable value

Defining variables that a C++ and Javascript program share, where you are able to change the value are a bit trickier.
As I said before, you need to define a "Getter" and "Setter" for each variable you want to share.
Here is a program that demonstrates the use of shared changeable variables:

<script src="https://gist.github.com/1578321.js?file=share_variable_changeable.cc">
</script>

<noscript>
<![CDATA[
	#include <v8.h>
	
	using namespace v8;
	
	// This is the variable we are going to share
	int x = 15;
	
	// Gets called when the value of x is requested
	Handle<Value> XGetter(Local<String> property, 
	                            const AccessorInfo& info) {
	    // Create a new Javascript int from the
	    // current value of "x"                                
	    return Integer::New(x);
	}
	
	// Gets called when "x" is set to a new value
	void XSetter(Local<String> property, Local<Value> value, 
	                            const AccessorInfo& info) {
	    // Change the value of the "x" in the C++
	    // to a 32-Bit representation of the value passed
	    x = value->Int32Value();
	}
	
	void CompileAndPrint(const Handle<String> source) {
	    // Compile the source code.
	    Handle<Script> script = Script::Compile(source);
	  
	    // Run the script to get the result.
	    Handle<Value> result = script->Run();
	
	    // Convert the result to an ASCII string and print it.
	    String::AsciiValue ascii(result);
	    printf("%s\n", *ascii);
	}
	
	int main(int argc, char* argv[]) {
	
	  // Create a stack-allocated handle scope.
	  HandleScope handle_scope;
	
	  // Create a new ObjectTemplate
	  Handle<ObjectTemplate> global_templ = ObjectTemplate::New();
	
	  // Set the XGetter and XSetter function
	  // to be called when the value of "x" is requested
	  // or "x" is set to a different value.
	  global_templ->SetAccessor(String::New("x"), XGetter, XSetter);
	
	  // Create a new context.
	  Persistent<Context> context = Context::New(NULL, global_templ);
	  
	  // Enter the created context for compiling and
	  // running the hello world script. 
	  context->Enter();
	
	  // x is still equal to 15 here
	  Handle<String> s1 = String::New("x;");
	  CompileAndPrint(s1);
	  
	  // Here we change x to 250
	  Handle<String> s2 = String::New("x = 250;");
	  CompileAndPrint(s2);
	
	  // We print out x in C++ to see if the value has changed
	  printf("%d\n", x);
	  
	  // Dispose the persistent context.
	  context.Dispose();
	
	  return 0;
	}
]]>
</noscript>

It seems a lot of code for just one variable, though as you will see in the Node.js source, once you use multiple variables you will hardly notice the surroundings.

## Node.js source

Here we'll dig into where and how Node.js uses these shared variables.
Specifically I will use the process object as an example.
It is not necessary that you fully understand how the internals of Node.js work, all you need to know is that there is a <code><a href="https://github.com/joyent/node/blob/master/src/node.cc#L2694-2718">Start</a></code> function right at the end of <a href="https://github.com/joyent/node/blob/master/src/node.cc">this file</a>, that calls another function, which then calls another function that sets up the process object. The name of this function is <code><a href="https://github.com/joyent/node/blob/master/src/node.cc#L2005-2140">SetupProcessObject</a></code>.
This function sets up, among others, the <code>pid</code> variable that we had as an example. In the case of Node.js, this variable is unchangeable.
An example of a changeable variable in Node.js is the <code>process.title</code>, it is the name or the title of the current program.
Try it out by doing:

	$ node
	> process.title = "this_is_a_test";
	'this_is_a_test'

You won't notice a difference in node but if you look up the process name of node in Activity Monitor or Task Manager, etc. it will be "this_is_a_test" (without quotes):

<img style="width:40em;" src="/img/exploring-v8-top.jpg" alt="img of top with node process"></img>

## End

That was a short overview of shared variables in the V8 Javascript engine.
I didn't cover shared functions, because the post was that long already, but if you would like me to write a blog post about them too, just <a href="mailto:whitegolem@gmail.com">email me at whitegolem@gmail.com</a>.





