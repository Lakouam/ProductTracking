function columnName(name) {

    switch (name) {
        case 'nof':
            return 'Numero of';
        case 'ref_produit':
            return 'Reference produit';
        case 'qt':
            return 'Quantité totale';
        case 'qa':
            return 'Quantité actuelle';
        case 'post_actuel':
            return 'Poste actuel';
        case 'post_machine':
            return 'Nom du poste';
        case 'ref_gamme':
            return 'Reference gamme';
        case 'num_ope':
            return 'Numero d\'opération';
        case 'status_ligne':
            return 'Statut';
        case 'temps_debut':
            return 'Temps de début';
        case 'temps_fin':
            return 'Temps de fin';
        case 'moy_temps_passer':
            return 'Moyenne temps passé';
        default:
            return name;
    }

}


module.exports = { columnName };