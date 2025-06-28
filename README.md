# saashelp
A simple context sensitive help system for SaaS applications
(c) Sabu Francis, 2025 -- MIT License

In SaaS applications, I missed the old Windows based context sensitive help system which simply detected the context when one pressed the F1 and popped-up some help.

So here is this tiny little module that should do the trick.

###Assumptions

1. Help is written as separate topics using  DokuWiki  (see https://dokuwiki.org)
2. See help file I wrote for my SaaS product, We.Spoke.Today  https://help.spoke.today
3. Inside the SaaS application, just give the special data-* attribute 'data-help-id' for those elements where you want F1 key to popup help.
4. The value of the above 'data-help-id' should be that of the wiki page in your dokuwiki
5. It can also detect the page name from the title attribute and/or id attribute of elements. If it can't find a help-id it would bubble up and search in parent and ancestors. If nothing is found, it will show the default help page. Configuration of the default page is given via variables at the start of the code
6. A couple of DIVs are needed in the SaaS application, for it is in those DIVs the iframe to the appropriate wiki page would be displayed
7. Include the code in your SaaS  i.e: <script src="/js/saashelp.js"></script>
8. It should just work. Enjoy
