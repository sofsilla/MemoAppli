// Un session est une série d'expérience réalisé par un sujet
function Exp_session(user_id,
			    user_lab_id,
				age,
				sex,
				writing_hand,
				vision,
				level_of_study,
				domaine,
				items_max,
				items_min,
				display_time_mem_sti_min,
				display_time_mem_sti_max,
				display_time_mem_sti_step,
				items_pause_min,
				items_pause_max,
				items_pause_step,
				distracteur_min,
				distracteur_max,
				distracteur_elt_min,
				distracteur_elt_max,
				delta_proposed_answ_min,
				cogn_cost_1,
				cogn_cost_2,
				cogn_cost_3,
				cogn_cost_4,
				repeat,
				random_factorial,
				free_recall,
				distractor_size,
				distractor_distance,
				essais,
				global_recall) {

	// Donnée de l'utilisateur
	//this["Identifiant Utilisateur"] = user_id;
	this["user_lab_id"]    = user_lab_id;
    this["Age"]            = age;
    this["Sexe"]           = sex;
	this["Main d'écriture"]   = writing_hand;
	this["Vision"]         = vision ; // Normal ou corrigée à la normal
	this["Niveau d'étude"] = level_of_study;
	this["Domaine"] = domaine;


    // Paramétrage de la session

    var date = new Date();
	this["Date"] = date.toLocaleDateString("fr-FR"); //2016/11/16
	this["Heure"] = date.toLocaleTimeString("fr-FR"); //2016/11/16

	this["Nbr items min"] = items_min; 
	this["Nbr items max"] = items_max; 
	this["Temps affichage items min"]  = display_time_mem_sti_min; 
	this["Temps affichage items max"]  = display_time_mem_sti_max; 
	this["Temps affichage items pas"] = display_time_mem_sti_step; 
	this["Item Pause min"]   = items_pause_min; 
	this["Item Pause max"]   = items_pause_max; 
	this["Item Pause pas"]  = items_pause_step; 
	this["Nbr distracteurs min"] = distracteur_min; 
	this["Nbr distracteurs max"] = distracteur_max; 
	this["Nbr elt par distracteurs min"] = distracteur_elt_min; 
	this["Nbr elt par distracteurs max"] = distracteur_elt_max; 
	this["Décallage proposition question distracteur"] = delta_proposed_answ_min; 
	this["Taille distracteurs"] = distractor_size; 
	this["Eloignement distracteurs"] = distractor_distance; 
	//this["delta_proposed_answ_max"] = delta_proposed_answ_max; 
	this["Temps de réponse distracteur"] = answ_display_time; 
	this["Coût cognitif 1"]    = cogn_cost_1;
	this["Coût cognitif 2"]    = cogn_cost_2;
	this["Coût cognitif 3"]    = cogn_cost_3;
	this["Coût cognitif 4"]    = cogn_cost_4;
	this["Itération"] = repeat; 
	this["Factorielle aléatoire"] = random_factorial; 
	this["Rappel libre"] = free_recall; 

	//  Expériences réalisées
    this["Essais"]    = essais;
	//  Expériences réalisées
    this["Rappel Global"]    = global_recall;
}


// Un expérience est le scénario allant du premier stmuli à mémoriser à son rappel 
function Essais(id,
					nb_mem_sti,
					display_time_mem_sti,
					items_pause,
					nb_distract_sti,
					nb_distract_elt,
					cogn_cost,
					distr_pause,
					seq) {

	this["Numéro"]                   = id ;
	this["Nbr items"]                = nb_mem_sti ;
	this["Temps affichage item"] 	 = display_time_mem_sti;
	this["Item Pause"]             	 = items_pause;
	this["Nbr distracteurs"]     	 = nb_distract_sti ;
	this["Nbr elt par distracteurs"] = nb_distract_elt ;
	this["Coût cognitif"]       	 = cogn_cost;
	this["Distracteurs Pause"]    	 = distr_pause;
	this["items"]    	             = "";
	this["Réponses données"]         = "";
	this["Résultats"]    	         = "";
	this["Résultats binaires"]       = "";
	this["Items OK (%)"]             = 0;
	this["Non-réponses items (%)"] = 0;
	this["Distracteurs OK (%)"]      = 0;
	this["Items mauvaise position (%)"] = 0;
	this["Non-réponses distracteurs (%)"] = 0;
	this["Temps de réaction moyen phase rappel (ms)"] = 0;
	this["Temps de réaction moyen phase distracteurs (ms)"] = 0;
	this["Séquence"]             	                        = seq;


}