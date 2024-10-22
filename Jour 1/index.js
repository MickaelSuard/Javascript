// Sélection des éléments HTML
let conteneur = document.querySelector(".container");
let boutonGrille = document.getElementById("submit-grid");
let boutonEffacerGrille = document.getElementById("clear-grid");
let largeurGrille = document.getElementById("width-bar");
let hauteurGrille = document.getElementById("height-bar");
let boutonCouleur = document.getElementById("color-input");
let boutonEffacer = document.getElementById("erase-button");
let boutonPeindre = document.getElementById("paint-button");
let valeurLargeur = document.getElementById("width-value");
let valeurHauteur = document.getElementById("height-value");

// Définition des événements pour la souris et les écrans tactiles
let evenements = {
    souris: {
        bas : "mousedown",  // clic enfoncé
        bouger : "mousemove", // mouvement de la souris
        haut : "mouseup" // relâchement du clic
    },
    tactile : {
        bas: "touchstart",  // début du toucher
        bouger : "touchmove",  // mouvement tactile
        haut : "touchend"  // fin du toucher
    },
};

let typeAppareil = ""; // Type d'appareil (souris ou tactile)
let dessiner = false;  // Indique si l'utilisateur dessine
let effacer = false;   // Indique si le mode effacement est activé

// Fonction pour détecter si l'appareil est tactile
const appareilTactile = () => {
    try {
        document.createEvent("TouchEvent");
        typeAppareil = "tactile";
        return true;
    } catch (e) {
        typeAppareil = "souris";
        return false;
    }
};

// Détecte le type d'appareil dès le chargement
appareilTactile();

// Ajoute un écouteur d'événement pour créer la grille lorsque le bouton est cliqué
boutonGrille.addEventListener("click", () => {
    conteneur.innerHTML = "";  // Vide le conteneur avant de créer une nouvelle grille
    let compteur = 0;
    
    // Boucle pour créer chaque ligne de la grille
    for (let i = 0; i < hauteurGrille.value; i++) {
        compteur++;
        let ligne = document.createElement("div");
        ligne.classList.add("gridRow");

        // Boucle pour créer chaque colonne de la grille
        for (let j = 0; j < largeurGrille.value; j++) {
            compteur++;
            let colonne = document.createElement("div");
            colonne.classList.add("gridCol");
            colonne.setAttribute("id", `gridCol${compteur}`);

            // Événement pour colorer ou effacer une cellule au clic ou au toucher
            colonne.addEventListener(evenements[typeAppareil].bas, () => {
                dessiner = true;
                if (effacer) {
                    colonne.style.backgroundColor = "transparent"; // Efface la cellule
                } else {
                    colonne.style.backgroundColor = boutonCouleur.value; // Colore la cellule
                }
            });

            // Événement pour colorer ou effacer pendant le mouvement (si le bouton est enfoncé)
            colonne.addEventListener(evenements[typeAppareil].bouger, (e) => {
                let idElement = document.elementFromPoint(
                    !appareilTactile() ? e.clientX : e.touches[0].clientX,
                    !appareilTactile() ? e.clientY : e.touches[0].clientY,
                ).id;
                verifier(idElement);
            });

            // Arrête de dessiner quand le bouton est relâché
            colonne.addEventListener(evenements[typeAppareil].haut, () => {
                dessiner = false;
            });

            // Ajoute la colonne à la ligne
            ligne.appendChild(colonne);
        }

        // Ajoute la ligne au conteneur
        conteneur.appendChild(ligne);
    }
});

// Fonction pour vérifier et appliquer la couleur ou effacer une cellule
function verifier(idElement) {
    let colonnesGrille = document.querySelectorAll(".gridCol");
    colonnesGrille.forEach((element) => {
        if (idElement == element.id) {
            if (dessiner && !effacer) {
                element.style.backgroundColor = boutonCouleur.value; // Applique la couleur sélectionnée
            } else if (dessiner && effacer) {
                element.style.backgroundColor = "transparent"; // Efface la cellule
            }
        }
    });
}

// Efface toute la grille lorsqu'on clique sur le bouton d'effacement
boutonEffacerGrille.addEventListener("click", () => {
    conteneur.innerHTML = "";  // Vide tout le conteneur
});

// Active le mode "effacer" lorsqu'on clique sur le bouton d'effacement
boutonEffacer.addEventListener("click", () => {
    effacer = true;
    boutonPeindre.classList.remove("active"); // Retire la classe active du bouton Peindre
    boutonEffacer.classList.add("active");  // Ajoute la classe active au bouton Effacer
});

// Active le mode "peindre" lorsqu'on clique sur le bouton de peinture
boutonPeindre.addEventListener("click", () => {
    effacer = false;
    boutonPeindre.classList.add("active");
    boutonEffacer.classList.remove("active"); // Retire la classe active du bouton Peindre
});

// Met à jour l'affichage de la largeur de la grille
largeurGrille.addEventListener("input", () => {
    valeurLargeur.innerHTML = largeurGrille.value < 9 ? `0${largeurGrille.value}` : largeurGrille.value;
});

// Met à jour l'affichage de la hauteur de la grille
hauteurGrille.addEventListener("input", () => {
    valeurHauteur.innerHTML = hauteurGrille.value < 9 ? `0${hauteurGrille.value}` : hauteurGrille.value;
});

// Réinitialise les valeurs de hauteur et de largeur à 0 au chargement de la page
window.onload = () => {
    hauteurGrille.value = 0;
    largeurGrille.value = 0;
};