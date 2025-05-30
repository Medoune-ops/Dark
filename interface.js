const formsTemplates = {
    'liste-etudiants': `<h3>Ajouter une Liste d'Étudiants</h3><form id="form-liste-etudiants">
    <label>Nom du document:</label><input name="documentName" required>
    <label>Matricule:</label><input name="matricule" placeholder="MAT2025-001" required>
    <label>Nom:</label><input name="nom" placeholder="Nom complet de l’étudiant" required>
    <label>Filière:</label><input name="filiere" placeholder="Informatique, Génie civil, Droit..." required>
    <label>Niveau:</label><input name="niveau" placeholder="Licence 1, Master 2, etc." required>
    <label>Téléphone (facultatif):</label><input name="telephone" type="tel" placeholder="Téléphone personnel de l’étudiant">
    <label>Email (facultatif):</label><input name="email" type="email" placeholder="Adresse électronique de l’étudiant">
    <button type="submit" class="btn-submit">Enregistrer</button></form>`,
    'liste-employes': `<h3>Ajouter une Liste d'Employés</h3><form id="form-liste-employes">
    <label>Nom du document:</label><input name="documentName" required>
    <label>Matricule:</label><input name="matricule" placeholder="EMP-2025-001" required>
    <label>Nom:</label><input name="nom" placeholder="Nom complet de l’employé" required>
    <label>Date de recrutement:</label><input name="dateRecrutement" type="date" required>
    <label>Heures de travail:</label><input name="heuresTravail" placeholder="40h/semaine" required>
    <label>Numéro de téléphone:</label><input name="telephone" type="tel" required>
    <label>Email:</label><input name="email" type="email" required>
    <button type="submit" class="btn-submit">Enregistrer</button></form>`,
    // Assuming there might be other templates, so I'll keep the structure flexible.
    // Add other templates here if they exist or are needed.
};

// Export the templates to be used in other parts of the application (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = formsTemplates;
}

function creerElementDocument(doc) {
    const li = document.createElement('li');
    li.setAttribute('data-id', doc.id);

    const infosMap = {
        'attestation-scolarite': `Étudiant: ${doc.donnees.nomEtudiant}, Matricule: ${doc.donnees.matricule}`,
        'bulletin-notes': `Étudiant: ${doc.donnees.nomEtudiant}, Semestre: ${doc.donnees.semestre}`,
        'attestation-travail': `Employé: ${doc.donnees.nomEmploye}, Poste: ${doc.donnees.poste}`,
        'contrat-travail': `Employé: ${doc.donnees.nomEmploye}, Type de contrat: ${doc.donnees.typeContrat}, Date de début: ${doc.donnees.dateDebut}`,
        'fiche-paie': `Employé: ${doc.donnees.nomEmploye}, Mois: ${doc.donnees.mois}, Année: ${doc.donnees.annee}`,
        'liste-etudiants': `${doc.donnees.matricule} - ${doc.donnees.nom} (${doc.donnees.filiere} - ${doc.donnees.niveau})${doc.donnees.telephone ? ` | Tél: ${doc.donnees.telephone}` : ''}${doc.donnees.email ? ` | Email: ${doc.donnees.email}` : ''}`,
        'liste-employes': `${doc.donnees.matricule} - ${doc.donnees.nom} (Recruté le: ${doc.donnees.dateRecrutement}, ${doc.donnees.heuresTravail}) | Tél: ${doc.donnees.telephone} | Email: ${doc.donnees.email}`,
        'rapport-stage': `Étudiant: ${doc.donnees.nomEtudiant}, Sujet: ${doc.donnees.sujetRapport}, Entreprise: ${doc.donnees.entreprise}`,
        'memoire-fin-etudes': `Étudiant: ${doc.donnees.nomEtudiant}, Sujet: ${doc.donnees.sujetMemoire}, Directeur: ${doc.donnees.directeurMemoire}`,
        'default': 'Information spécifique non disponible'
    };

    const infosSpecifiques = infosMap[doc.typeDocument] || infosMap['default'];

    // Condensed HTML construction using a multi-line template literal
    li.innerHTML = `<strong>${doc.nomDocument}</strong> (Type: ${doc.typeDocument})<br>
${infosSpecifiques}<br>
<small>Créé le: ${new Date(doc.horodatage).toLocaleString()}</small> <button class="btn-modifier">Modifier</button> <button class="btn-supprimer">Supprimer</button>`;

    return li;
}

// Export the function if using modules
if (typeof module !== 'undefined' && module.exports) {
    // This correctly merges formsTemplates properties and creerElementDocument into the export
    module.exports = { ...(module.exports || {}), creerElementDocument };
}
