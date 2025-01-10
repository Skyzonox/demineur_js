document.addEventListener('DOMContentLoaded', () => {
    
    let grille = document.getElementById('tableau');
    let Start = document.getElementById('start');
    let choixduniveau = document.getElementById('difficulté');

    let niveaux = {
        'Débutant': { 
            lignes: 9,  
            colonnes: 9,
            mines: 10   
        },
        'Intermédiaire': { 
            lignes: 16, 
            colonnes: 16,
            mines: 40   
        },
        'Expert': { 
            lignes: 22, 
            colonnes: 22,
            mines: 100  
        },
        'Maître': {     
            lignes: 30, 
            colonnes: 30,
            mines: 250  
        }
    };

    let Cases = [];
    let grilleJeu = [];

    function initialiserCase(l, c) {
        const maCase = document.createElement('div');
        maCase.className = 'cell';
        
        maCase.dataset.ligne = l;
        maCase.dataset.colonne = c;

        let imageCase = document.createElement('img');
        imageCase.src = 'images/normal.png';
        imageCase.alt = 'Case non révélée';
        imageCase.className = 'cell-image';

        maCase.appendChild(imageCase);
        return maCase;
    }

    function initialiserGrille(nbLignes, nbColonnes) {
        
        grille.innerHTML = '';
        grille.style.gridTemplateRows = `repeat(${nbLignes}, 1fr)`;
        grille.style.gridTemplateColumns = `repeat(${nbColonnes}, 1fr)`;
        
        Cases = [];
        grilleJeu = [];

        for (let l = 0; l < nbLignes; l++) {
            grilleJeu[l] = [];
            for (let c = 0; c < nbColonnes; c++) {
                const nouvelleCase = initialiserCase(l, c);
                grille.appendChild(nouvelleCase);
                Cases.push(nouvelleCase);
                grilleJeu[l][c] = nouvelleCase;
            }
        }
    }

    function distribuerMines(nbLignes, nbColonnes, nbMines) {
        let minesPlacees = 0;
        
        while (minesPlacees < nbMines) {
            let posL = Math.floor(Math.random() * nbLignes);
            let posC = Math.floor(Math.random() * nbColonnes);
            let caseActuelle = grilleJeu[posL][posC];
            
            if (!caseActuelle.classList.contains('mine')) {
                caseActuelle.classList.add('mine');
                minesPlacees++;
            }
        }
    }

    function positionValide(l, c) {
        return l >= 0 && 
               l < grilleJeu.length && 
               c >= 0 && 
               c < grilleJeu[0].length;
    }

    function analyseVoisinage(Case) {
        let ligneActuelle = parseInt(Case.dataset.ligne);
        let colonneActuelle = parseInt(Case.dataset.colonne);
        let dangerLevel = 0;

        for (let ligneVoisine = -1; ligneVoisine <= 1; ligneVoisine++) {
            for (let colonneVoisine = -1; colonneVoisine <= 1; colonneVoisine++) {
                let l = ligneActuelle + ligneVoisine;
                let c = colonneActuelle + colonneVoisine;
                if (positionValide(l, c) && (ligneVoisine !== 0 || colonneVoisine !== 0)) {
                    if (grilleJeu[l][c].classList.contains('mine')) {
                        dangerLevel++;
                    }
                }
            }
        }
        return dangerLevel;
    }

    function decouvrirCase(Case) {
        if (Case.classList.contains('revealed')) {
            return;
        }

        Case.classList.add('revealed');
        let imgCase = Case.querySelector('img');

        if (Case.classList.contains('mine')) {
            imgCase.src = 'images/bomb.png';
            alert('Perdu');
            return;
        }

        let case_number = analyseVoisinage(Case);

        if (case_number === 0) {
            imgCase.src = 'images/black_square.png';

            let ligneActuelle = parseInt(Case.dataset.ligne);
            let colonneActuelle = parseInt(Case.dataset.colonne);

            for (let ligneVoisine = -1; ligneVoisine <= 1; ligneVoisine++) {
                for (let colonneVoisine = -1; colonneVoisine <= 1; colonneVoisine++) {
                    if (positionValide(ligneActuelle + ligneVoisine, colonneActuelle + colonneVoisine)) {
                        decouvrirCase(grilleJeu[ligneActuelle + ligneVoisine][colonneActuelle + colonneVoisine]);
                    }
                }
            }
        } 
        else {
            imgCase.src = `images/${case_number}.png`;
        }
    }

    function Clics() {
        Cases.forEach(uneCase => {
            uneCase.onclick = () => decouvrirCase(uneCase);
        });
    }

    Start.onclick = () => {
        let niveau = choixduniveau.value;
        let config = niveaux[niveau];
        initialiserGrille(config.lignes, config.colonnes);
        distribuerMines(config.lignes, config.colonnes, config.mines);
        Clics();
    };
});
