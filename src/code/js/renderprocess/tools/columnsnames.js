function columnName(name) {

    switch (name) {
        case 'nof':
            return 'Numéro O.F';
        case 'ref_produit':
            return 'Brève référence du produit';
        case 'qt':
            return 'Quantité totale';
        case 'qa':
            return 'Quantité actuelle';
        case 'post_actuel':
            return 'Poste';
        case 'poste':
            return 'Poste';
        case 'poste_machine':
            return 'Nom du poste';
        case 'ref_gamme':
            return 'Référence produit';
        case 'num_ope':
            return 'Opération';
        case 'status_ligne':
            return 'Statut ligne';
        case 'temps_debut':
            return 'Temps de début';
        case 'temps_fin':
            return 'Temps de fin';
        case 'moy_temps_passer':
            return 'Moyenne temps passé';
        case 'n_serie':
            return 'Numéro de série';
        case 'temps_prevu':
            return 'Temps prévu';
        case 'tps_oper':
            return 'Temps opération';
        case 'temps_realise':
            return 'Temps réalisé (min)';
        case 'statut':
            return 'Statut';
        case 'nom':
            return 'Nom';
        case 'matricule':
            return 'Matricule';
        case 'role':
            return 'Rôle';
        case 'qte_total':
            return 'Quantité totale dont';
        case 'date':
            return 'Date';
        case 'temps_total':
            return 'Temps (heures)';
        default:
            return name;
    }

}


module.exports = { columnName };