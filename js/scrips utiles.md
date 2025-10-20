```js
// ==UserScript==
// @name         Freeship
// @namespace    lemons
// @version      1.8
// @description  Unlock all Fireship PRO courses/lessons.
// @author       lemons, nirmal0001
// @match        https://fireship.io/*
// @icon         https://em-content.zobj.net/source/apple/391/fire_1f525.png
// @grant        none
// ==/UserScript==
 
function decodeAndProcess(encodedString) {
    try {
        let decoded = atob(encodedString);
      let ID = null
        if (decoded.includes('=')) {
          // debugger
          const parts = decoded.split('=').map(part => part.trim());
           for (let part of parts) {
              let decodedPart = atob(part);
              if (ID == null) {
                const clean = decodedPart.replace(/[^\x20-\x7E]/g, "");
                  ID = clean.match(/\d{4,}/);
 
              }
          }}
      if (ID == null){
        try {
          decoded = atob(decoded);
        }
        catch{}
        ID = decoded.match(/\d{4,}/);
      }
        return {
            Decoded: Number(ID)
        };
    } catch (error) {
        return {
            error: "Invalid encoded input",
            details: error.message
        };
    }
}
 
async function unlock() {
    document.querySelectorAll("[free=\"\"]").forEach(el => el.setAttribute("free", true)) // set all elements with the attribute free set to "" to true
 
    if (document.querySelector("if-access [slot=\"granted\"]")) { // replace HOW TO ENROLL to YOU HAVE ACCESS
        document.querySelector("if-access [slot=\"denied\"]").remove()
        document.querySelector("if-access [slot=\"granted\"]").setAttribute("slot", "denied")
    }
 
    if (document.querySelector("video-player")?.shadowRoot?.querySelector(".vid")?.innerHTML) return; // return if no video player
    // const vimeoId = Number(atob(document.querySelector("global-data").vimeo)); // get id for vimeo video
    const vimeoId = decodeAndProcess(document.querySelector("global-data").vimeo);
    const youtubeId = atob(document.querySelector("global-data").youtube); // get id for vimeo video
 
    if (youtubeId) { // if there is an id,
        document.querySelector("video-player").setAttribute("free", true) // set free to true
        document.querySelector("video-player").shadowRoot.querySelector(".vid").innerHTML = `<iframe src="https://youtube.com/embed/${youtubeId}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="" title="${location.pathname.split("/")[3]}" width="426" height="240" frameborder="0"></iframe>` // set video
        return;
    }
    if (vimeoId) { // if there is an id,
        document.querySelector("video-player").setAttribute("free", true) // set free to true
        const html = (await fetch(`https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F${vimeoId.Decoded}&id=${vimeoId.Decoded}`).then(r=>r.json())).html
        document.querySelector("video-player").shadowRoot.querySelector(".vid").innerHTML = html // set video
        return;
    }
}
 
window.onload = unlock();
window.addEventListener("flamethrower:router:end", unlock)
```

```js
//https://www.youtube.com/watch?v=GcjdHWVo3gA&list=PLqxkQiSkdZPtqSySIPErPZQusJp4t74FF

//https://softexpert.pk/how-to-copy-all-the-titles-and-urls-from-youtube-channel/

// First code:
var scroll = setInterval(function(){ window.scrollBy(0, 1000)}, 1000);

// Second code (Updated):
let count=0;
window.clearInterval(scroll); console.clear(); urls = $$('a'); urls.forEach(function(v,i,a){if (v.id=="video-title-link"){console.log('\t'+ count++ +'\t'+v.title+'\t'+v.href+'\t')}});
```