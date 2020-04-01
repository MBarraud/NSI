/* 
M. BARRAUD pour 1NSI 2019-2020
Lycée Jean de Lattre De Tassigny
La Roche-sur-Yon
*/

// Liste des points connus
// Un point est de la forme [ abscisse, ordonnée, couleur ]
let point = [];
// Point à dessinner sous la souris
let souris = [];
// Liste des derniers points voisins calculés
let voisin = [];

function distance(pointA, pointB) {
    // Renvoie le carré de la distance entre deux points
    return (pointB[0]-pointA[0])*(pointB[0]-pointA[0]) 
         + (pointB[1]-pointA[1])*(pointB[1]-pointA[1]);
}

function kPlusProches(nouveauPoint,k) {
    // Préparation du tableau pour les k plus proches voisins
    voisin = [];
    for ( let j = 0 ; j < k ; j = j+1) {
        // (la distance maximale est 200² + 200² = 80000 < 100000
        voisin.push({'indice' : -1, 'distance' : 100000});
    }
    // Remplissage de ce tableau
    for ( let i = 0 ; i < point.length ; i = i+1) {
        let dst = distance(point[i],nouveauPoint)
        // On ne touche pas aux points, dans voisin, plus près de nouveauPoint que point[i]
        let j = 0
        while ((j < k) && (dst > voisin[j]['distance'])){
            j = j+1;
        }
        // Si on a trouvé des points de voisin plus loin de nouveauPoint que point[i]
        if (j < k) {
            // On décale ces points pour faire une place à point[i]
            for (let m = k-1 ; m > j ; m = m - 1) {
                voisin[m] = voisin[m-1];
            }
            // On met point[i] à sa place dans voisin
            voisin[j] = {'indice' : i, 'distance' : dst};
        }
    }
    // On en déduit les couleurs des k plus proches voisins de nouveauPoint
    classe = [];
    for ( let j = 0 ; j <k ; j = j+1) {
        classe.push(point[voisin[j]['indice']][2]);
    }
    // Il ne reste plus qu'à faire voter ces points 
    return vote(classe)
}

function vote(liste){
    // Dépouillement de la liste
    let depouille = {'#FFFF00' : 0, '#0000FF' : 0};
    for (let i = 0 ; i < liste.length; i = i+1) {
        depouille[liste[i]] = depouille[liste[i]] +1;
    }
    // Recherche de la classe modale
    let max = 0;
    let resultat = '#000000';
    for (let classe in depouille) {
        effectif = depouille[classe]
        if (effectif > max) {
            max = effectif;
            resultat = classe;
        }
    }
    return resultat
}

///////////////////////////////////////////////////////
// Dessin des points (celui sous la souris compris)
const valeurk = document.getElementById("valeurk");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let zone = false;

function dessinePoint(pt, rayon = 5) {
  // Dessinne un disque plein 
  context.beginPath();
  context.fillStyle = pt[2];
  context.arc(pt[0], pt[1], rayon, 0, 2 * Math.PI);
  context.fill();
}

function majCanvas() {
    // Efface et redessine le canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let k = 0 ; k < point.length ; k = k +1) 
        dessinePoint(point[k]); 
    if (zone) {
        // Dessine la couleur de chaque point du carré
        for (let x = 0 ; x < 200 ; x = x + 1) 
            for (let y = 0 ; y < 200 ; y = y + 1) 
                dessinePoint([x,y,kPlusProches([x,y],parseInt(valeurk.value))],1);
    } else {
        if (souris.length>0) {
            // Dessinne un trait rouge entre le nouveau point et ses k voisins
            for (let v = 0; v < voisin.length ; v = v+1) {
                context.beginPath();
                context.strokeStyle = '#FF0000';
                context.moveTo(souris[0],souris[1]);
                context.lineTo(point[voisin[v]['indice']][0], point[voisin[v]['indice']][1]);
                context.stroke();
                context.closePath();
            }
            dessinePoint(souris);
        }
    }
}

valeurk.addEventListener('change', e => {
    // Affiche la valeur de k sélectionnée
    document.getElementById("out").innerHTML = 'Algorithme des k = ' + valeurk.value + ' plus proches voisins';
    if (point.length>0) requestAnimationFrame(majCanvas);
});

canvas.addEventListener('click', e => {
    // Passage en mode "zone" et retour au mode souris
    zone = !(zone);
    if (point.length>0) requestAnimationFrame(majCanvas);
}, false);

canvas.addEventListener('mousemove', e => {
    // Gestionnaire pour l'événement de déplacement de la souris
    e.preventDefault();
    e.stopPropagation();
    const canvasPosition = canvas.getBoundingClientRect();
    const inputX = e.pageX - canvasPosition.left;
    const inputY = e.pageY - canvasPosition.top;
    // inputX et inputY sont les coordonnées de la souris
    if (point.length>0) 
        souris = [inputX,inputY,kPlusProches([inputX,inputY],parseInt(valeurk.value))]
        requestAnimationFrame(majCanvas);
}, false);

///////////////////////////////////////////////////////
// Chargement du CSV à la sélection du fichier
const fileInput = document.getElementById("csv");

fileInput.addEventListener('change',function() {
    const reader = new FileReader();
    
    reader.onload = function () {
        point = reader.result.split('\r\n');
        for (let k = 0 ; k < point.length ; k = k +1) {
            point[k]=point[k].split(';');
            point[k][0] = (parseFloat(point[k][0])+5)*20;
            point[k][1] = (-parseFloat(point[k][1])+5)*20;
        } 
        requestAnimationFrame(majCanvas);
    };
    
    reader.readAsText(fileInput.files[0]);
});