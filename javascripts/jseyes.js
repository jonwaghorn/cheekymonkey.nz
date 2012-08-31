/* jseyes.js

The classic Xeyes in JavaScript
(c) PROPIX Ltd,  Written by Pintér Gábor
Székesfehérvár, Kriványi u. 15.
H-8000, HUNGARY
Tel: +36 30 3489752
Fax: +36 22 304326
Email: propix@freemail.hu
Web: http://www.propix.hu

Revisions:
V1.0  10/14/2001  Original release
V1.1  12/08/2001  NS6.1
V1.2  12/17/2001  More parameters
V1.3  08/14/2002  Adjustable speed
V1.31 08/26/2002  Improved adjustable speed

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

http://www.gnu.org/copyleft/gpl.html
http://www.propix.hu/share/GPL.html

For commercial license, and for other professional
JavaScript and Java components please contact the author.

*/

// Defaults
//var jseyes= { img:"images/cheeky.gif", w:233, h:268, link: "http://tracks.org.nz" };
var jseyes= { img:"images/cheeky.gif", w:233, h:268 };
var jseye1= { img:"images/eye.gif", w:16, h:16, x:88,  y:92, xr:20, yr:20 };
var jseye2= { img:"images/eye.gif", w:16, h:16, x:148, y:92, xr:20, yr:20 };
var jseyesdeltat= 40; // ms
var jseyesfollow= 100; // %

// Browser detection

// Private global variables
var browserversion= 0.0;
var browsertype= 0; // 0: unknown; 1:MSIE; 2:NN
var mousex= 0, mousey= 0;
var followx= 0, followy= 0;

// Return true if MSIE or NN detected
function browserdetect() {
  var agt= navigator.userAgent.toLowerCase();
  var appVer= navigator.appVersion.toLowerCase();
  browserversion= parseFloat(appVer);
  var iePos= appVer.indexOf('msie');
  if (iePos!=-1) browserversion= parseFloat(appVer.substring(iePos+5, appVer.indexOf(';',iePos)));
  var nav6Pos = agt.indexOf('netscape6');
  if (nav6Pos!=-1) browserversion= parseFloat(agt.substring(nav6Pos+10))
  browsertype= (iePos!=-1) ? 1 : (agt.indexOf('mozilla')!=-1) ? 2 : 0;
  return(browsertype>0);
}

browserdetect();

// General utils

// Find object by name or id
function jseyesobj(id) {
  var i, x;
  x= document[id];
  if (!x && document.all) x= document.all[id];
  for (i=0; !x && i<document.forms.length; i++) x= document.forms[i][id];
  if (!x && document.getElementById) x= document.getElementById(id);
  return(x);
}

// Move eyes
function jseyesmove() {
  var ex, ey, dx, dy, r;
  dx= mousex-followx;
  dy= mousey-followy;
  followx+= dx*jseyesfollow/100;
  followy+= dy*jseyesfollow/100;
  if (jseyes.o && jseye1.o && jseye2.o && jseyes.o.style) {
    dx= followx-jseyes.o.offsetLeft-jseye1.x;
    dy= followy-jseyes.o.offsetTop- jseye1.y;
    r= Math.sqrt(dx*dx/(jseye1.xr*jseye1.xr)+dy*dy/(jseye1.yr*jseye1.yr));
    if (r<1) r=1;
    jseye1.o.style.left= (dx/r+jseye1.x-jseye1.w/2)+"px";
    jseye1.o.style.top=  (dy/r+jseye1.y-jseye1.h/2)+"px";
    dx= followx-jseyes.o.offsetLeft-jseye2.x;
    dy= followy-jseyes.o.offsetTop- jseye2.y;
    r= Math.sqrt(dx*dx/(jseye2.xr*jseye2.xr)+dy*dy/(jseye2.yr*jseye2.yr));
    if (r<1) r=1;
    jseye2.o.style.left= (dx/r+jseye2.x-jseye2.w/2)+"px";
    jseye2.o.style.top=  (dy/r+jseye2.y-jseye2.h/2)+"px";
  }
}

// Main
function jseyeswr() {
  var img;
  var x, y, a=false;

  // Relative or abslute position
  if (arguments.length==2) {
    x= arguments[0];
    y= arguments[1];
    a= true;
  }

  // Create image
  if (browsertype>0 && browserversion>=5) {
    img=
    "<div id='jseyeso' style='position:"+
    (a ? "absolute; left:"+x+"px; top:"+y+"px" : "relative")+
    "; z-index:5; overflow:hidden; "+
    "width:"+jseyes.w+"px; height:"+jseyes.h+"px'>\n"+

    "<div id='jseye1o' style='position:absolute; z-index:6; "+
    "left:"+(jseye1.x-jseye1.w/2)+"px; top:"+(jseye1.y-jseye1.h/2)+"px; "+
    "width:"+jseye1.w+"px; height:"+jseye1.h+"px'>\n"+
    "<img src='"+jseye1.img+"' "+
    "width='"+jseye1.w+"px' height='"+jseye1.h+"px' >\n"+
    "</div>\n"+

    "<div id='jseye2o' style='position:absolute; z-index:6; "+
    "left:"+(jseye2.x-jseye2.w/2)+"px; top:"+(jseye2.y-jseye2.h/2)+"px; "+
    "width:"+jseye2.w+"px; height:"+jseye2.h+"px'>\n"+
    "<img src='"+jseye2.img+"' "+
    "width='"+jseye2.w+"px' height='"+jseye2.h+"px' >\n"+
    "</div>\n"+

    "<img src='"+jseyes.img+"' "+
    "width='"+jseyes.w+"px' height='"+jseyes.h+"px' >\n"+

    "</div>\n";
    document.write(img);
    jseyes.o= jseyesobj('jseyeso');
    jseye1.o= jseyesobj('jseye1o');
    jseye2.o= jseyesobj('jseye2o');

    // Install capture mouse position handler
    switch (browsertype) {
      case 1:
      document.onmousemove= mousemoveIE;
      break;
      case 2:
      document.captureEvents(Event.MOUSEMOVE);
      document.onmousemove= mousemoveNS;
      break;
    }

    // Animate
    setInterval("jseyesmove()", jseyesdeltat);
  }
}

// Capture mouse position
function mousemoveNS(e) {
  mousex= e.pageX;
  mousey= e.pageY;
  return(true);
}

function mousemoveIE() {
  mousex= window.event.clientX + document.body.scrollLeft;
  mousey= window.event.clientY + document.body.scrollTop;
}
