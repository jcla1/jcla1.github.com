---
layout: post
title: RSA public/private key encryption explained
---

# {{ page.title }}

{: class="meta"} 10 Dec 2011 - Krefeld, Germany

In this blog post I'll show you how to calculate a simple RSA private-/public-key pair.

First of all you need to know that each key (the public-key and the private-key) consists of 2 parts.
The first part is different in each key, the second is equal in both. So let's start calculating!

1. Think of 2 prime numbers.

    In real openssl, these prime numbers are very high and have a similar bit-size. So that we have no problem doing the 
    calculations I'll choose 2 numbers that are quite small:<br />
    <code>p = 3, q = 11</code>.

2. Calculate the modulus for the public/private key.

    This is the number that is the same in both keys, let's call it <code>n</code>. It is used as the modulus in en- and decryption. You calculate it by doing: <code>n = 3*11</code>

3. Calculate the totient of n.

    Calculating the totient is easy. You could use a table and look up the value, but the calculation is just as easy and faster.
    Just do: <code>totient(n) = (p - 1) * (q - 1)</code>. In our case we do: <code>totient(33) = (3 - 1) * (11 - 1)</code>. This equals <code>20</code>.

    So far we have:
    <ul>
        <li><code>p = 3</code></li>
        <li><code>q = 11</code></li>
        <li><code>n = 33</code></li>
        <li><code>totient(n) = 20</code></li>
    </ul>
    
4. Choose a number for <code>e</code>
    
    This number is is a bit harder than the others. It has to be between <code>1</code> and <code>n</code>,
    also coprime to <code>n</code>. This basically means that the greatest common divisor of both numbers is <code>1</code>.
    If you choose a prime number for <code>e</code> all you need to do now is check that <code>e</code> isn't a divisor of
    <code>n</code>. I'll choose the number: <code>e = 17</code>
    
5. Calculating the modular multiplicative inverse of e * (mod totient(n))
    
    Now at first this sounds a bit overwhelming, I struggled a bit to find out what it means. Expressed in an easy way you could say: "What is the solution to the
    equation:<br />
    <code>(e * x - 1) mod (totient(n)) = 0</code>".
    It would take quite long to work it out by hand so I wrote a small Javascript function that does the work for me:
    <script src="https://gist.github.com/1453094.js?file=gistfile1.js">
    </script>
    The function takes 2 arguments, one is <code>e</code> the other is the <code>totient(n)</code>. Depending on your processor and the size of the numbers you choose
    it can take longer or shorter to run.
    In our case the function will log the value <code>13</code>, which I'll call <code>d</code>. Now you have all the values needed for public-/private-key encryption or decryption.

6. Putting it all together

    All the values up to now:
    <ul>
        <li><code>p = 3</code></li>
        <li><code>q = 11</code></li>
        <li><code>n = 33</code></li>
        <li><code>totient(n) = 20</code></li>
        <li><code>e = 17</code></li>
        <li><code>d = 13</code></li>
    </ul>
    
    Your public-key is now: <code>e = 17, n = 33</code><br />
    Your private-key is now: <code>d = 13, n = 33</code>
    
    With this private and public-key you can now encrypt data by doing this:

    We'll encrypt the value <code>9</code><br />
    <code>m = 9</code>
            
    To encrypt with the public key, you take m to the power of e (in the public-key) mod n<br />
    <code>m ^ e mod n</code><br />
    <code>9 ^ 17 mod 33 = 15</code>
            
    Our encrypted value is 15<br />
    <code>c = 15</code>
            
    This can only be decrypted with the private-key.
    To decrypt it, you take c to the power of d (in the private-key) mod n<br />
    <code>c ^ d mod n</code><br />
    <code>15 ^ 13 mod 33 = 9</code>
            
    Now we have our original value!
    
    _**WARNING:**_ The encryption in this tutorial has a very low security level, because of the low values of <code>p</code> and <code>q</code>! To improve the security level choose higher primes.
            
            
            