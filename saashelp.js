/////////////////////////*
  
  SaaS Help System
  Author: Sabu Francis
  Date: June 28, 2025
  License: MIT 
  Version: 0.1 
////////////////////////I*/


/////////////change these as per your needs
var helpdokuwikiUrl = 'https://help.spoke.today';
let helpcontext = 'start';
let insideLocalhost= false;
let localport= 9919; //in case insdeLocalhost is true, we use this port

//Any element whose tile contain any of this will NOT be used for help system
const EXCLUDED_TITLES = ['home', 'click_here', 'click here', 'close','gmt'];

//IMPORTANT: divs with ids 'helpModal' and 'helpFrame' must exist in index.html
//See sample at the bottom of this file 
//////////////////


// == helpSystem ==

(function () {
    

    document.addEventListener('mouseover', handleHelpContext);
    document.addEventListener('focusin', handleHelpContext);


    function validTitle(titl){
        let title = (titl || '').toLowerCase();
        return !EXCLUDED_TITLES.some(ex => title.includes(ex));
    }

    function handleHelpContext(e) {
        const target = e.target;
        const helpElement = findClosestHelpElement(target);
    
        if (helpElement) {
            helpcontext = helpElement.getAttribute('data-help-id');

            //if special data-help-id attr not found, let's try id 
            if(!helpcontext || helpcontext ==''){
                 helpcontext = helpElement.getAttribute('id')
            }

            //if special data-help-id attr OR id not found, let's try title
            if(!helpcontext || helpcontext ==''){
                let title = helpElement.getAttribute('title') || '';
                helpcontext = title.trim()
                .slice(0, 15) 
                .replace(/\s+/g, '_')
                .replace(/[0-9]/g, '') // remove numbers
                .replace(/[^a-zA-Z0-9_]/g, '') // remove special characters 
              }

            
              helpcontext = helpcontext.toLowerCase();  
               
      } else {
         helpcontext = 'start';
      }
    }
    
    // Helper function to find closest ancestor with data-help-id
    function findClosestHelpElement(element) {
        while (element && element !== document.body) {
            if ( 
                element.hasAttribute('data-help-id')
                ||
                (
                element.hasAttribute('href')
                &&
                validTitle(element.getAttribute('title'))
                )
                ||
                ( element.hasAttribute('title')
                   &&
                  validTitle(element.getAttribute('title'))
                )
                )
            {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }
  


    function showHelpInModal(helpcontext) {
      const modal = document.getElementById('helpModal');
      const iframe = document.getElementById('helpFrame');
      iframe.src = helpdokuwikiUrl  +'/'+ helpcontext;
      modal.style.display = 'block';
  }
  
  // Close on X click
  document.getElementById('closeHelpModal').addEventListener('click', function () {
      document.getElementById('helpModal').style.display = 'none';
      document.getElementById('helpFrame').src = '';
  });
  
  // Optional: close on clicking outside content area
  document.getElementById('helpModal').addEventListener('click', function(e) {
      if (e.target.id === 'helpModal') {
          document.getElementById('helpModal').style.display = 'none';
          document.getElementById('helpFrame').src = '';
      }
  });

document.addEventListener('keydown', function(event) {
    // Check for F1 key (keyCode 112 or event.key 'F1')
    if (event.key === 'F1' || event.keyCode === 112) {
        event.preventDefault(); // Prevent the browser's default help action
  
        if (!insideLocalhost){
          showHelpInModal(helpcontext);
          return;
        }

        //ajax into localhost 
        try{
        fetch(`http://localhost:${localport}/setValue`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: `action=help:${helpcontext}`
        }
        )
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                console.log('Error from localhost:9919 for help');
            }
        })
        .then(data => {
          //console.log(data);
        })
        .catch((error) => 
            {
              console.log('Error:', error.message);
 
              
              //open(`${helpdokuwikiUrl}/${helpcontext}`,'kanhelp');
              
              showHelpInModal(helpcontext);
  
            });
        } catch (error) {
         console.log(error);
         
         showHelpInModal(helpcontext);
        }
  
        
    }
  });
  
})();


/*
 //Sample HTML so that help is loaded into a modal
  <!-- Help Modal -->
<div id="helpModal" style="
display: none;
position: fixed;
z-index: 9999;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,0.5);
">
<div style="
    background-color: #fff;
    margin: 5% auto;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 700px;
    height: 55vh;
    position: relative;
    overflow-y: auto;
    overflow-x: none;
">
    <span id="closeHelpModal" style="
        position: absolute;
        top: 1px;
        right: 1px;
        font-size: 1.2em;
        cursor: pointer;
        font-weight: bold;
    ">&times;</span>
    <iframe id="helpFrame" src="" style="
        width: 100%;
        height: 100%;
        border: none;
    "></iframe>
</div>
</div>


////The above is the HTML for the saas.

///Below is for the dokuwiki help. This is the file 'footer.html' which you have to write 
//in the dokuwiki/conf folder. You can use this file as a template.
//It cleans up unncessary stuff that can clutter the HTML display 

<script>
    document.addEventListener('DOMContentLoaded', function() {
      const links = document.querySelectorAll('a[href*="?do=export_xhtml"]');
      links.forEach(link => {
        const newHref = link.href.replace('?do=export_xhtml', '');
        link.setAttribute('href', newHref);
      });

      if (window.self !== window.top) {
    // We're inside an iframe!
      document.querySelector('#dokuwiki__pagetools').style.display = 'none';
      document.querySelector('.headings h1').style.display = 'none';
      document.querySelector('docInfo').style.display = 'none';

    } else {
      // Not in iframe — page was opened directly
    
      }

      
    });
    </script>

*/
