// Navigation entre sections
const sections = document.querySelectorAll('.section');
const navButtons = document.querySelectorAll('.nav-btn');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetId = btn.id.replace('btn-', '');
        sections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
            section.classList.toggle('hidden', section.id !== targetId);
        });
    });
});

// Gestion de l'affichage des formulaires dynamiques
document.getElementById('ajouter-document').addEventListener('click', () => {
    document.getElementById('type-document-container').classList.remove('hidden');
});

document.getElementById('type-document').addEventListener('change', function() {
    const type = this.value;
    const formContainer = document.getElementById('formulaire-document');
    formContainer.innerHTML = '';

    if (type) {
        formContainer.classList.remove('hidden');
        let formHtml = '';

        // HTML des différents types de documents
        switch (type) {
            case 'cv':
                formHtml = `
                    <h3>Ajouter un CV</h3>
                    <form id="form-cv">
                        <label for="documentName">Nom du document :</label>
                        <input type="text" id="documentName" name="documentName" placeholder="Entrez un nom personnalisé" required>

                        <label>Nom :</label><input name="nom" type="text" required />
                        <label>Prénom :</label><input name="prenom" type="text" required />
                        <label>Email :</label><input name="email" type="email" required />
                        <label>Numéro de téléphone :</label><input name="telephone" type="tel" required />
                        <label>Charger le CV :</label><input name="fichier" type="file" accept=".pdf,.doc,.docx" required />
                        <button type="submit" class="btn-submit">Enregistrer</button>
                    </form>
                `;
                break;

            case 'document-administratif':
                formHtml = `
                    <h3>Ajouter un Document Administratif</h3>
                    <form id="form-document-administratif">
                        <label for="documentName">Nom du document :</label>
                        <input type="text" id="documentName" name="documentName" placeholder="Entrez un nom personnalisé" required>

                        <label>Titre du document :</label><input name="titre" type="text" required />
                        <label>Date du document :</label><input name="date" type="date" required />
                        <label>Description :</label><textarea name="description" required></textarea>
                        <label>Charger le document :</label><input name="fichier" type="file" accept=".pdf,.doc,.docx" required />
                        <button type="submit" class="btn-submit">Enregistrer</button>
                    </form>
                `;
                break;

            case 'fiche-paie':
                formHtml = `
                    <h3>Ajouter une Fiche de Salaire</h3>
                    <form id="form-fiche-paie">
                        <label for="documentName">Nom du document :</label>
                        <input type="text" id="documentName" name="documentName" placeholder="Entrez un nom personnalisé" required>

                        <label>Nom de l'employé :</label><input name="nom" type="text" required />
                        <label>Mois :</label><input name="mois" type="month" required />
                        <label>Montant net :</label><input name="montant" type="number" step="0.01" required />
                        <label>Charger la fiche :</label><input name="fichier" type="file" accept=".pdf" required />
                        <button type="submit" class="btn-submit">Enregistrer</button>
                    </form>
                `;
                break;

            case 'liste-employes':
                formHtml = `
                    <h3>Ajouter une Liste d'Employés</h3>
                    <form id="form-liste-employes">
                        <label for="documentName">Nom du document :</label>
                        <input type="text" id="documentName" name="documentName" placeholder="Entrez un nom personnalisé" required>

                        <label>Matricule :</label><input name="matricule" type="text" required />
                        <label>Nom :</label><input name="nom" type="text" required />
                        <label>Date de recrutement :</label><input name="date" type="date" required />
                        <label>Heures de travail :</label><input name="heures" type="number" required />
                        <label>Numéro de téléphone :</label><input name="telephone" type="tel" required />
                        <label>Email :</label><input name="email" type="email" required />
                        <button type="submit" class="btn-submit">Enregistrer</button>
                    </form>
                `;
                break;

            case 'liste-etudiants':
                formHtml = `
                    <h3>Ajouter une Liste d'Étudiants</h3>
                    <form id="form-liste-etudiants">
                        <label for="documentName">Nom du document :</label>
                        <input type="text" id="documentName" name="documentName" placeholder="Entrez un nom personnalisé" required>

                        <label>Numéro d'étudiant :</label><input name="numero" type="text" required />
                        <label>Nom :</label><input name="nom" type="text" required />
                        <label>Filière :</label><input name="filiere" type="text" required />
                        <label>Niveau :</label><input name="niveau" type="text" required />
                        <label>Email :</label><input name="email" type="email" required />
                        <button type="submit" class="btn-submit">Enregistrer</button>
                    </form>
                `;
                break;

            default:
                formContainer.classList.add('hidden');
                break;
        }

        formContainer.innerHTML = formHtml;
        attacherEvenementFormulaire(type); // Important !
    } else {
        formContainer.classList.add('hidden');
    }
});

// Fonction pour attacher l'événement de soumission
function attacherEvenementFormulaire(typeDocument) {
    const formulaire = document.querySelector(`#formulaire-document form`);
    formulaire.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(formulaire);
        const documentData = {};

        for (let [key, value] of formData.entries()) {
            if (value instanceof File && value.size > 0) {
                documentData[key] = await lireFichierBase64(value);
            } else {
                documentData[key] = value;
            }
        }

        let documents = JSON.parse(localStorage.getItem('documents')) || [];
        documents.push({
            type: typeDocument,
            donnees: documentData,
            dateAjout: new Date().toISOString()
        });

        localStorage.setItem('documents', JSON.stringify(documents));

        alert('Document enregistré avec succès !');

        formulaire.reset();
        document.getElementById('type-document-container').classList.add('hidden');
        document.getElementById('formulaire-document').classList.add('hidden');

        afficherDocuments();
    });
}

// Convertir fichier en base64
function lireFichierBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

// Fonction pour afficher tous les documents
function afficherDocuments() {
    const listeContainer = document.getElementById('liste-documents');
    let documents = JSON.parse(localStorage.getItem('documents')) || [];

    const critereTri = document.getElementById('select-tri')?.value || 'date-desc';

    if (critereTri === 'date-desc') {
        documents.sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout));
    } else if (critereTri === 'date-asc') {
        documents.sort((a, b) => new Date(a.dateAjout) - new Date(b.dateAjout));
    } else if (critereTri === 'type-asc') {
        documents.sort((a, b) => a.type.localeCompare(b.type));
    } else if (critereTri === 'type-desc') {
        documents.sort((a, b) => b.type.localeCompare(a.type));
    }

    if (documents.length === 0) {
        listeContainer.innerHTML = '<p>Aucun document ajouté.</p>';
    } else {
        listeContainer.innerHTML = '<ul>' + documents.map((doc, index) => `
            <li>
                <strong>${doc.donnees.documentName || doc.type}</strong> - Ajouté le ${new Date(doc.dateAjout).toLocaleDateString()}
                <button class="btn-supprimer" onclick="supprimerDocument(${index})">Supprimer</button>
                <button onclick="ouvrirDocument(${index})">Voir</button>
                <button class="btn-modifier" onclick="modifierDocument(${index})">Modifier</button>
            </li>
        `).join('') + '</ul>';
    }
}


// Supprimer un document
function supprimerDocument(index) {
    let documents = JSON.parse(localStorage.getItem('documents')) || [];
    if (confirm('Voulez-vous vraiment supprimer ce document ?')) {
        documents.splice(index, 1);
        localStorage.setItem('documents', JSON.stringify(documents));
        afficherDocuments();
    }
}

// Ouvrir un document
function ouvrirDocument(index) {
    const documents = JSON.parse(localStorage.getItem('documents')) || [];
    const doc = documents[index];

    if (!doc) {
        alert('Document introuvable.');
        return;
    }

    const contenuSection = document.getElementById('contenu-document');
    contenuSection.innerHTML = `
        <button onclick="fermerDetails()" style="margin-bottom:10px;">Fermer</button>
        <h2>Détail du document</h2>
        <p><strong>Type :</strong> ${doc.type}</p>
        <p><strong>Date d'ajout :</strong> ${new Date(doc.dateAjout).toLocaleDateString()}</p>
        <h3>Données :</h3>
        <ul>
            ${Object.entries(doc.donnees).map(([key, value]) => {
                if (typeof value === 'string' && value.startsWith('data:')) {
                    return `<li><button onclick="afficherFichier('${value}')">Voir Fichier</button></li>`;
                }
                return `<li><strong>${key} :</strong> ${value}</li>`;
            }).join('')}
        </ul>
    `;
    contenuSection.classList.remove('hidden');
}

function afficherFichier(base64) {
    const nouvelleFenetre = window.open();
    if (nouvelleFenetre) {
        nouvelleFenetre.document.write(`
            <html>
                <head><title>Visualisation du Fichier</title></head>
                <body style="margin:0;padding:0;">
                    <iframe src="${base64}" style="width:100%;height:100%;border:none;"></iframe>
                </body>
            </html>
        `);
    } else {
        alert("Veuillez autoriser les pop-ups.");
    }
}

function fermerDetails() {
    document.getElementById('contenu-document').classList.add('hidden');
}

// Recherche
const champRecherche = document.getElementById('champ-recherche');
champRecherche.addEventListener('input', () => {
    rechercherDocuments(champRecherche.value);
});

function rechercherDocuments(motCle) {
    const resultatsContainer = document.getElementById('resultats-recherche');
    const documents = JSON.parse(localStorage.getItem('documents')) || [];

    if (!motCle.trim()) {
        resultatsContainer.innerHTML = '<p>Veuillez entrer un mot-clé pour rechercher.</p>';
        return;
    }

    const resultats = documents.map((doc, index) => ({...doc, index})).filter(doc => {
        const type = doc.type.toLowerCase();
        const documentName = (doc.donnees.documentName || '').toLowerCase();
        const donnees = Object.values(doc.donnees).join(' ').toLowerCase();
        const mot = motCle.toLowerCase();
        return type.includes(mot) || donnees.includes(mot) || documentName.includes(mot);
    });

    if (resultats.length === 0) {
        resultatsContainer.innerHTML = '<p>Aucun document trouvé.</p>';
    } else {
        resultatsContainer.innerHTML = '<ul>' + resultats.map(doc => `
            <li onclick="ouvrirDocument(${doc.index})" style="cursor:pointer;">
                <strong>${doc.donnees.documentName || doc.type}</strong> - ${new Date(doc.dateAjout).toLocaleDateString()}
            </li>
        `).join('') + '</ul>';
    }
}

// Lancer l'affichage au démarrage
afficherDocuments();
function modifierDocument(index) {
    const documents = JSON.parse(localStorage.getItem('documents')) || [];
    const doc = documents[index];

    if (!doc) {
        alert('Document introuvable.');
        return;
    }

    const type = doc.type;
    const donnees = doc.donnees;

    document.getElementById('type-document-container').classList.remove('hidden');
    document.getElementById('formulaire-document').classList.remove('hidden');

    // Remettre le bon formulaire
    document.getElementById('type-document').value = type;
    const event = new Event('change');
    document.getElementById('type-document').dispatchEvent(event);

    // Remplir automatiquement le formulaire
    setTimeout(() => {
        const form = document.querySelector(`#formulaire-document form`);
        if (!form) return;

        for (let [key, value] of Object.entries(donnees)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'file') {
                    // On ne peut pas pré-remplir un file input pour sécurité
                } else {
                    input.value = value;
                }
            }
        }

        // Remplacer l'événement submit pour Mettre à jour
        form.onsubmit = async function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const updatedData = {};

            for (let [key, value] of formData.entries()) {
                if (value instanceof File && value.size > 0) {
                    updatedData[key] = await lireFichierBase64(value);
                } else {
                    updatedData[key] = value;
                }
            }

            // Mettre à jour dans le tableau
            documents[index].donnees = updatedData;
            documents[index].dateAjout = new Date().toISOString(); // Peut aussi garder l'ancienne date si tu préfères

            localStorage.setItem('documents', JSON.stringify(documents));

            alert('✅ Document modifié avec succès !');
            afficherDocuments();

            form.reset();
            document.getElementById('type-document-container').classList.add('hidden');
            document.getElementById('formulaire-document').classList.add('hidden');
        };
    }, 100); // Petit délai pour laisser le temps au formulaire de se générer
}
function filtrerParDates() {
    const dateDebut = document.getElementById('date-debut').value;
    const dateFin = document.getElementById('date-fin').value;
    let documents = JSON.parse(localStorage.getItem('documents')) || [];

    if (!dateDebut || !dateFin) {
        alert("Veuillez sélectionner une date de début et une date de fin.");
        return;
    }

    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);

    if (dateDebutObj > dateFinObj) {
        alert("La date de début doit être avant la date de fin.");
        return;
    }

    const documentsFiltres = documents.filter(doc => {
        const dateDoc = new Date(doc.dateAjout);
        return dateDoc >= dateDebutObj && dateDoc <= dateFinObj;
    });

    afficherListeDocuments(documentsFiltres);
}

function resetFiltreDates() {
    document.getElementById('date-debut').value = '';
    document.getElementById('date-fin').value = '';
    afficherDocuments(); // Recharge toute la liste sans filtre
}

// Nouvelle fonction pour afficher une liste donnée
function afficherListeDocuments(documents) {
    const listeContainer = document.getElementById('liste-documents');

    if (documents.length === 0) {
        listeContainer.innerHTML = '<p>Aucun document trouvé pour cette période.</p>';
    } else {
        listeContainer.innerHTML = '<ul>' + documents.map((doc, index) => `
            <li>
                <strong>${doc.donnees.documentName || doc.type}</strong> - Ajouté le ${new Date(doc.dateAjout).toLocaleDateString()}
                <button class="btn-supprimer" onclick="supprimerDocument(${index})">Supprimer</button>
                <button onclick="ouvrirDocument(${index})">Voir</button>
                <button class="btn-modifier" onclick="modifierDocument(${index})">Modifier</button>
            </li>
        `).join('') + '</ul>';
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-commencer").addEventListener("click", function () {
      // Masquer toutes les sections
      document.querySelectorAll(".section").forEach(section => section.classList.remove("active"));
      
      // Afficher la section des documents
      document.getElementById("documents").classList.add("active");
    });
  });