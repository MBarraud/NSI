var mode = 'switch' /*'switch' ou 'copy'*/
var couleur = ["♠", "♥", "♦", "♣"];
var valeur = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R"];
function tourne( event ) {event.currentTarget.classList.toggle("tourne");}
function dragstart( event ) {dragged = event.currentTarget;}
function dragend( event ) {;}
function cacheTout() {
    var carte = document.querySelectorAll('.carte');
    carte.forEach(c=>{c.classList.add("tourne");});
}
function montreTout() {
    var carte = document.querySelectorAll('.carte');
    carte.forEach(c=>{c.classList.remove("tourne");});
}
function nouveau() {
    var slot = document.querySelector('#t0');
    while (slot.hasChildNodes()) slot.removeChild(slot.firstChild);
    for (var k = 0; k<10; k++){
        var unecarte = [couleur[Math.floor(4*Math.random())], valeur[Math.floor(13*Math.random())]];
        var c = unecarte[0];
        var v = unecarte[1];
        var coul = 'noire';
        if ((c == "♥") || (c=="♦")) coul = 'rouge';
        var carteDiv = document.createElement("div");
        carteDiv.className="carte tourne";
        var faceDiv = document.createElement("div");
        faceDiv.className="face "+coul;
        [v,c,v,c,c,v].forEach(i=>{
            sp = document.createElement("span");
            sp.innerHTML=i;
            faceDiv.appendChild(sp);}
            );
        carteDiv.appendChild(faceDiv);
        var dosDiv = document.createElement("div");
        dosDiv.className="dos";
        carteDiv.appendChild(dosDiv);
        carteDiv.addEventListener('click',tourne,false);
        carteDiv.setAttribute('draggable', 'true');
        carteDiv.addEventListener('dragstart', dragstart, false);
        carteDiv.addEventListener('dragend', dragend, false);
        var slot = document.querySelector('#s'+k);
        while (slot.hasChildNodes()) slot.removeChild(slot.firstChild);
        slot.appendChild(carteDiv);
    }
}
var dragged;
var type;
var slot = document.querySelectorAll('.slot');
for (var i=1;i<slot.length;i++) {
     slot[i].style="left:"+(5+(i-1)*9)+"vw;top:20vw;";
}
var pointe = document.querySelectorAll('.pointe');
for (var i=1;i<pointe.length;i++) {
     pointe[i].style="left:"+(5+(i-1)*9)+"vw;top:17vw;";
}
var jeton = document.querySelectorAll('.jeton');
jeton.forEach(j=>{
    j.setAttribute('draggable', 'true');
    j.addEventListener('dragstart', dragstart, false);
    j.addEventListener('dragend', dragend, false);
});
function dragover( event ) {event.preventDefault();}
function dragenter( event ) {
    if (dragged.classList.contains('carte') &&
        event.currentTarget.classList.contains('slot') ) {
        event.currentTarget.style.background = "rgb(0,100,0)";
    }
    if (dragged.classList.contains('jeton') &&
        event.currentTarget.classList.contains('pointe') ) {
        event.currentTarget.style.background = "rgb(0,100,0)";
    }
    event.preventDefault();
}
function dragleave( event ) {
    event.currentTarget.style.background = "";
    event.preventDefault();
}
function drop( event ) {
    event.preventDefault();
    if (dragged.classList.contains('carte') &&
        event.currentTarget.classList.contains('slot') ) {
        if (mode=='switch') {
            if (event.currentTarget.hasChildNodes()) {
                dragged.parentNode.appendChild(event.currentTarget.firstChild);
            }
            event.currentTarget.appendChild(dragged);
        } else {
            while (event.currentTarget.hasChildNodes()) {
                event.currentTarget.removeChild(event.currentTarget.firstChild);
            }   
            event.currentTarget.appendChild( dragged.cloneNode(true));
            event.currentTarget.firstChild.addEventListener('click',tourne,false);
            event.currentTarget.firstChild.setAttribute('draggable', 'true');
            event.currentTarget.firstChild.addEventListener('dragstart', dragstart, false);
            event.currentTarget.firstChild.addEventListener('dragend', dragend, false);
        }
    } 
    if (dragged.classList.contains('jeton') &&
        event.currentTarget.classList.contains('pointe') ) {
        event.currentTarget.appendChild(dragged);
    }
    event.currentTarget.style.background = "";
}
function dropable(s) {
     s.addEventListener("dragover", dragover, false);
     s.addEventListener("dragenter", dragenter, false);
     s.addEventListener("dragleave", dragleave, false);
     s.addEventListener("drop", drop, false);
}
var slot = document.querySelectorAll('.slot');
slot.forEach(s=>{dropable(s)});
var pointe = document.querySelectorAll('.pointe');
pointe.forEach(p=>{dropable(p)});
var formMode = document.querySelector("#mode").mode;
for (var i = 0; i < formMode.length; i++) {
    formMode[i].addEventListener('change', function(){mode=this.value;},false);
}
function positionneJeton(j,pos) {
    document.querySelector('#p'+pos).appendChild(document.querySelector('.'+j));
}
function montre(i) {
    var carte = document.querySelectorAll('.carte');
    carte.forEach(c=>{
        if (c.parentNode.id=='s'+i)
            c.classList.remove("tourne");}
    );
}
function cache(i) {
    var carte = document.querySelectorAll('.carte');
    carte.forEach(c=>{
        if (c.parentNode.id=='s'+i)
            c.classList.add("tourne");}
    );
}
function valeurde(i) {
    num = 0;
    if (i==-1) val = document.querySelector('#t0').firstChild.firstChild.firstChild;
    else val = document.querySelector('#s'+i).firstChild.firstChild.firstChild;
    if (val.innerHTML=='V') num = 11;
    else if (val.innerHTML=='D') num = 12;
    else if (val.innerHTML=='R') num = 13;
    else num = parseInt(val.innerHTML);
    val = val.nextSibling;
    if (val.innerHTML=="♥") num = num + 13;
    else if (val.innerHTML=="♦") num = num + 26;
    else if (val.innerHTML=="♣") num = num + 39;
    return num;
}
function echange(i,j) {
    if (i==-1) vali = document.querySelector('#t0');
    else vali = document.querySelector('#s'+i);
    if (j==-1) valj = document.querySelector('#t0');
    else valj = document.querySelector('#s'+j);
    if (valj.hasChildNodes()) vali.appendChild(valj.firstChild);
    if (vali.hasChildNodes())valj.appendChild(vali.firstChild);
}
function triParSelection(){
    manque = false;
    document.querySelectorAll('.slot').forEach(s=>{
        if ((s.id[0]=='s')&&(s.innerHTML=="")) manque = true;
    });
    if (manque) nouveau();
    if (visible) montreTout();
    var i = 0;
    function fori() {
        if (i<10) {
            if (!visible) cacheTout();
            positionneJeton('indicei',i);
            k = i;
            copie(k,-1);
            positionneJeton('indicek',k);
            if (!visible) montre(k);
            var j = i+1;
            function forj(){
                if (j<10) {
                    positionneJeton('indicej',j);
                    if (!visible) {
                        if (k!=j-1) cache(j-1);
                        montre(j);
                    }
                    if (valeurde(k)>valeurde(j)) {
                        setTimeout(lambda => {
                            if (!visible) cache(k);
                            k = j;
                            copie(k,-1);
                            positionneJeton('indicek',k);
                            j++;
                            setTimeout(forj, tempo);
                        },tempo);
                    }else {
                        j++;
                        setTimeout(forj, tempo);
                    }
                }
                else  {
                    if (k!=9) if (!visible) cache(9);
                    if (!visible) montre(i);                    
                    setTimeout(lambda => {
                        copie(i,k);
                        copie(-1,i);
                        /*echange(i,k);*/
                        positionneJeton('indicek',i);
                        setTimeout(lambda => {i++;fori()}, tempo);
                    },tempo);
                }
            }
            forj()
        }
        else montreTout();
    }
    fori()
}
function copie(i,j) {
    if (i!=j) {
        if (i==-1) vali = document.querySelector('#t0');
        else vali = document.querySelector('#s'+i);
        if (j==-1) valj = document.querySelector('#t0');
        else valj = document.querySelector('#s'+j);
        while (valj.hasChildNodes()) valj.removeChild(valj.firstChild);
        valj.appendChild(vali.firstChild.cloneNode(true));
        valj.firstChild.addEventListener('click',tourne,false);
        valj.firstChild.addEventListener('dragstart', dragstart, false);
        valj.firstChild.addEventListener('dragend', dragend, false);  
    }
}
function triParInsertion(){
    manque = false;
    document.querySelectorAll('.slot').forEach(s=>{
        if ((s.id[0]=='s')&&(s.innerHTML=="")) manque = true;
    });
    if (manque) nouveau();
    if (visible) montreTout();
    var i = 0;
    function fori() {
        if (i<10) {
            if (!visible) cacheTout();
            positionneJeton('indicei',i);
            if (!visible) montre(i);
            copie(i,-1);
            if (!visible) montre(-1);
            var j = i;
            positionneJeton('indicej',j);
            function tantque(){
                if (j>0) {
                    if (!visible) montre(j-1);
                    if (j<9) if (!visible) cache(j+1);
                    if (valeurde(j-1)>valeurde(-1)) {
                        setTimeout(lambda => {
                            copie(j-1,j);
                            setTimeout(lambda=>{
                                j = j-1;
                                positionneJeton('indicej',j);
                                tantque()
                            }, tempo);
                        },tempo)
                    }
                    else  {
                        setTimeout(lambda => {
                            copie(-1,j);
                            setTimeout(lambda => {i++;fori();}, tempo);
                        },tempo);
                    }
                }
                else  {
                    setTimeout(lambda => {
                        copie(-1,j);
                        setTimeout(lambda => {i++;fori();}, tempo);
                    },tempo);
                }
            }
            tantque()
        }
        else montreTout();
    }
    fori()
}
var tempo = 800;
var visible = true;
var tempoInput = document.getElementById("tempo");
tempoInput.oninput = function() {
        tempo = 1050-this.value;
}
tempoInput.value = 250;