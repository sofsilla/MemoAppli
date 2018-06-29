function generate_exps(){

	// Scénario à créer
	var main_timeline = [];

	// Création du factorial des différents paramètres
	var factors = {
		m_nb_mem_sti:           nb_mem_sti,
		m_items_pause:          items_pause,
		m_display_time_mem_sti: display_time_mem_sti,
		m_nb_distract_sti:      nb_distract_sti,
		m_cognitif_cost:        cognitif_cost
	}

	// En fonction du paramétrage, la suite de série peut-être ordonée ou non
	var full_design = random_factorial ? jsPsych.randomization.factorial(factors, repeat) : factorial(factors, repeat) ;
	var all_items = [];
	item_to_recal = [];

	try_number = 1;

	// Calcul du nombre total d'item
	var nb_total_items = 0;
	full_design.forEach(function(val){
		nb_total_items += val.m_nb_mem_sti;
	});

	// Génération d'une liste de n * 2 stimuli à mémoriser
	var all_session_sti = jsPsych.randomization.sampleWithoutReplacement(training_mode? IMAGES_STORE_ANIM: IMAGES_STORE, nb_total_items*2);

	// Pour combinaisons de paramètres, on génère la série correspondante 
	full_design.forEach(function(val){

		// Création d'une série "fils"
		var timeline_son = [];

		// Génération d'une liste de n * 2 stimuli à mémoriser
		var mem_sti_pkg = jsPsych.randomization.sampleWithoutReplacement(all_session_sti, val.m_nb_mem_sti*2);

		// Génération d'une liste des n stimulis qui seront affichés
		var mem_sti = jsPsych.randomization.sampleWithoutReplacement(mem_sti_pkg, val.m_nb_mem_sti);
		all_items = all_items.concat(mem_sti).unique();

		// On enregistre les items en fonction de l'essai
		item_to_recal["essai_"+try_number] = mem_sti.map(function (elt) { return elt.uri; });

		// On choisi aléatoirement une valeur dans le tableau des nb éléments par distracteur
		var nb_distr_elt = nb_distracteur_elt[Math.floor(Math.random() * nb_distracteur_elt.length)];
		
		// Calcul de l'ISI des distracteurs en fonction du temps d'un distracteur et du coût cognitif
		var distr_time = calc_distr_time( nb_distr_elt, distracteur_elt_display, distracteur_elt_pause, answ_display_time );
		var distr_pause = calc_distr_pause(distr_time, val.m_cognitif_cost);
		

		// Initialisation du numéro de stimuli
		num_seq = 1;

		// Pour chaque stimuli de mémoire
		mem_sti.forEach(function(mem_sti){

			//log("Gen s " + try_number);

			jsPsych.data.get().addToAll({subject_id: 123, condition: 'control'});

			// Affichage du stimuli
			var animation_mem = {
				type: 'html-keyboard-response',
				stimulus: '<img src="'+mem_sti.uri+'" alt="image manquante">',
				prompt: "<label class='label_item'>"+mem_sti.name.charAt(0).toUpperCase() + mem_sti.name.slice(1)+"</label>",
				choices: jsPsych.NO_KEYS,
				trial_duration: val.m_display_time_mem_sti,
				data: {
		    		keep: true,
		    		id_try: try_number,
		    		id_seq: num_seq,
					type : "item",
					label : "Stimulus à mémoriser",
					item : mem_sti.name
			    },
				on_start: function(){
					stopwatch.start();
					stopwatch.lap("mem sti");    	
			    }
			};
			
			num_seq++;
			
			// Affichage de la pause
			var animation_mem_pause = {
				type: 'html-keyboard-response',
				stimulus: ITEM_PAUSE_DISPLAY,
				choices: jsPsych.NO_KEYS,
				trial_duration: val.m_items_pause,
				data: {
		    		keep: true,
		    		id_try: try_number,
		    		id_seq: num_seq,
					type : "item_pause",
					label : "Pause Post Stimulus à mémoriser",
			    },
				on_start: function(){
					stopwatch.start();
					stopwatch.lap("mem sti ISI");
			    }
			};
			num_seq++;

			// Ajout du stimuli visuel et de son isi à la série
			timeline_son.push(animation_mem);
			timeline_son.push(animation_mem_pause);

			// On ajoute autant de distracteur que paramétré
			repeatFunction(function () { 
				timeline_son = timeline_son.concat(  generate_distractor(nb_distr_elt,distr_pause))}, val.m_nb_distract_sti);

			all_session_sti

			all_session_sti = all_session_sti.filter( function( el ) {
			  return mem_sti_pkg.indexOf( el ) < 0;
			} );
		})

		// On ajoute l'étape de rappel
		timeline_son = timeline_son.concat(generate_recall(mem_sti_pkg,mem_sti))

		// On ajoute l'étape de fin de série
		timeline_son.push( {
			type: "html-button-response",
			stimulus: "Fin de la série n° " + try_number.toString()+" / "+ full_design.length+".",
 			choices: ['Continuer'],	 			
			data: {
	    		keep: true,
	    		id_try: try_number,
	    		id_seq: num_seq,
				type : "fin_rappel",
				label : "Fin Rappel",
		    },
			on_start: function(){
				stopwatch.lap("");
				stopwatch.stop();
			},
			on_finish: function(){
				updateExpList();
				// Réinitialisation du tableau des séquences
				num_seq = 0;
				expSeq = [];
				// Incrémentation du numéro de série
				try_number++;

			}
		});

		
		// On ajoute la série fille dans la série mère
		main_timeline = main_timeline.concat(timeline_son);


		addExpData( try_number,
					val.m_nb_mem_sti,
					val.m_display_time_mem_sti,
					val.m_items_pause,
					val.m_nb_distract_sti,
					nb_distr_elt,
					val.m_cognitif_cost,
					distr_pause);

		try_number++;

	})

	// On ajoute le rappel global si au moins 2 essais
	if(full_design.length>1){
		main_timeline.push(generate_global_recall(all_items));
	}


	return main_timeline;
}


// Générateur de distracteurs
//============================
function generate_distractor(nbr_img,dis_pause){

	// Scénario créer
	var timeline = [];

	// On remplit la liste des 7 personnages de la distraction avec des positions aléatoires
	var distr_sti = jsPsych.randomization.sampleWithReplacement(DISTRACTORS_STORE, nbr_img);
	distr_sti = distr_sti.map(obj => { return obj.uri;});

	// On supprimer aléatoirement des personnages de la liste, ils seront remplacés par des "+"
	var number_of_people = 0;
	distr_sti.forEach(function(part, index, array) {
		if( Math.random() > 0.5 ) 
			array[index] =  jsPsych.randomization.sampleWithoutReplacement(CROSS_STORE, 1)[0].uri;		
		else
			number_of_people++;
	});

	// Création de l'animation de distraction
	var animation_distractor = {
		type: 'animation-position',
		stimuli: distr_sti,
		frame_time : distracteur_elt_display,
		frame_isi : distracteur_elt_pause,
		img_size : distractor_size,
		img_margin : distractor_distance,
		data: {
			keep: true,
			id_try: try_number,
    		id_seq: num_seq,
			type : "distracteur",
			label : "Stimulus à traiter",
	    },		
		on_start: function(){
			$("#jspsych-content").addClass( "height_width100" );
			stopwatch.lap("distract");
		},
		on_finish: function() {
			$("#jspsych-content").removeClass( "height_width100" );
		}
	};
	num_seq++;
	
	// Aléatoirement, on décalle ou non la réponse proposée selon le paramétrage
	var proposed_answer =  number_of_people;
	if( Math.random() > 0.5 && delta_proposed_answ > 0) {

		while(proposed_answer ==  number_of_people || proposed_answer > getIntVal($('#distracteur_elt_max'))  || proposed_answer < 0 ){
			proposed_answer += Math.floor(Math.random() * (delta_proposed_answ - (-delta_proposed_answ) + 1)) + (-delta_proposed_answ);
		}

  	}

  	var question_distractor = {
  		type: 'html-button-response',
  		stimulus: DISTRACT_QUESTION_DISPLAY+'<p>'+proposed_answer+'?</p>',
  		choices: ['Oui', 'Non'],
  		trial_duration : answ_display_time,
  		response_ends_trial:false,
  		data: {
			keep: true,
			id_try: try_number,
    		id_seq: num_seq,
			type : "distracteur question",
			label : "Stimulus à traiter",
			question_lab : "Il y avait "+number_of_people+" personnage(s).",
	    },		
  		on_finish: function(data){
		// Création de la donnée "correct"
		data.correct = (  (proposed_answer == number_of_people && data.button_pressed == "0")
					   || (proposed_answer != number_of_people && data.button_pressed == "1")  );
		//log("distract stop");
		//log("isi start");
		}
	};
	num_seq++;

	timeline.push(animation_distractor);
	timeline.push(question_distractor);

	// Affichage de la pause
	timeline.push( {
		type: 'html-keyboard-response',
		stimulus: DISTRACT_PAUSE_DISPLAY,
		choices: jsPsych.NO_KEYS,
		trial_duration: dis_pause,
		data: {
    		keep: true,
    		id_try: try_number,
    		id_seq: num_seq,
			type : "disrtactor_pause",
			label : "Pause Poste Distracteur",
	    },
		on_start: function(){
			stopwatch.start();
			stopwatch.lap("distract ISI");
	    }
	});
	num_seq++;

	//log("Génération d'un d_sti");
	return timeline;
}


// Générateur de Rappel
//============================
function generate_recall(mem_sti_pkg, mem_sti){
	
	// Génération d'une liste de n * 2 stimuli à mémoriser
	var page_1_options = mem_sti_pkg.map(function (elt) { return elt.uri; });

    // On ajoute de l'aléatoire
    page_1_options = jsPsych.randomization.shuffle(page_1_options);

    var recalls = [];

 	var q_label = "Sélectionnez l'ingrédient n° ";
 	var type = "rappel";
 	var m_keyboard_voice = false;

	if (type_recall == "free"){
		q_label = "Enoncez l'ingrédient n° ";
		page_1_options = "";
		type = "rappel libre";
	}
	else if (type_recall == "keyboard_voice"){
		q_label = "Enoncez ou écrivez l'ingrédient n° ";
		page_1_options = "";
		type = "rappel clavier-voix";
		m_keyboard_voice = true;
	}

	if(training_mode) q_label = q_label.replace("ingrédient", "animal");

    mem_sti.forEach( function (val,index){

    	var nbr = index+1;

		recalls.push( 
			{
		    	type: 'survey-multi-choice-image',
		    	button_label : "Valider",
		    	questions: [{prompt: q_label +nbr, options: page_1_options, horizontal: true}],
		    	keyboard_voice: m_keyboard_voice,
		    	data: {
					keep: true,
					id_try: try_number,
		    		id_seq: num_seq,
		    		mem_sti_num: nbr,
					type : type,
					label : "Rappel_"+try_number,
					good_answer : val.name,
					good_answer_uri : val.uri,
			    },	
		    	on_start: function(){
		    		stopwatch.lap("Rappel");
					$("#exp_contener").scrollTop(0);
					//setTimeout(function() { $("#free_recall_input").focus(); }, 30);
		    	},
		    	on_finish: function(data){
		    		
		    		if (type_recall != "free"){
		    			var user_answer = JSON.parse(data.responses).Q0;

		    			if (user_answer != "")
							data.user_answer = user_answer.split("/")[3].replace(".png","");
	    				else
	    					user_answer = "néant";

			    		data.correct = user_answer.includes(data.good_answer_uri);

			    		if (!data.correct){
				    		if (item_to_recal["essai_"+data.id_try].includes(user_answer))
				    			data.note = "wrong place"; 
				    		else
				    			data.note = "wrong item"; 
			    		}
					}

		    	}
		    });
		num_seq++;
	});

    return recalls;

}


// Générateur de Rappel
//============================
function generate_global_recall(m_all_items){
	
	// Liste des items affichés durant les essais
	var item_to_show = m_all_items.slice(0);
	var max = item_to_show.length*2;
    var other_img = jsPsych.randomization.shuffle(training_mode? IMAGES_STORE_ANIM: IMAGES_STORE);

	other_img.forEach(function(obj){

		if( item_to_show.length < max  && !item_to_show.includes(obj) ) 
			item_to_show.push(obj)

	});
    // On ajoute de l'aléatoire
	var page_1_options = item_to_show.map(function (elt) { return elt.uri; });
    page_1_options = jsPsych.randomization.shuffle(page_1_options);

 	var m_keyboard_voice = false;
		
	// Si on est en rappel libre, pas de liste des aliments
	if (type_recall == "free"){
		page_1_options = "";
	}
	else if (type_recall == "keyboard_voice"){
		page_1_options = "";
		type = "rappel clavier-voix";
		m_keyboard_voice = true;
	}

	var label_q = training_mode ? GLOBAL_RECALL_QUESTION_DISPLAY_ANIM : GLOBAL_RECALL_QUESTION_DISPLAY;

	var recall = {
    	type: 'survey-multi-select-image',
    	button_label : "Valider",
    	questions: [{prompt: label_q, options: page_1_options, horizontal: true}],
    	keyboard_voice: m_keyboard_voice,
    	data: {
			keep: true,
			id_try: try_number,
    		id_seq: num_seq,
			type : "rappel_global",
			label : "Rappel Global",
	    },	
    	on_start: function(){
    		stopwatch.lap("Rappel");
			//setTimeout(function() { $("#free_recall_input").focus(); }, 500);
    	},
    	on_finish: function(data){
    		log(data.responses)
			// Si on est pas en rappel libre, on compte les résultats
			if (type_recall != "free"){
				var arr =  calc_recall(m_all_items,data);
				data.nb_good_items = arr[0];
				data.nb_forgotten_items = arr[1];
				data.nb_items_in_excess = arr[2];
			}
    	}
    };
	num_seq++;

    return recall;

}




// Fonction de répétition
//=======================
function repeatFunction(func, times) {
	func();
	--times && repeatFunction(func, times);
}




// Fonction de factorialisation conservant l'ordre.
function factorial(factors, repeat) {

	var factorNames = Object.keys(factors);

	var factor_combinations = [];

	for (var i = 0; i < factors[factorNames[0]].length; i++) {
		factor_combinations.push({});
		factor_combinations[i][factorNames[0]] = factors[factorNames[0]][i];
	}

	for (var i = 1; i < factorNames.length; i++) {
		var toAdd = factors[factorNames[i]];
		var n = factor_combinations.length;
		for (var j = 0; j < n; j++) {
			var base = factor_combinations[j];
			for (var k = 0; k < toAdd.length; k++) {
				var newpiece = {};
				newpiece[factorNames[i]] = toAdd[k];
				factor_combinations.push(Object.assign({}, base, newpiece));
			}
		}
		factor_combinations.splice(0, n);
	}

	var factor_combinations_w_repeat = factor_combinations;
	while(repeat>1){factor_combinations_w_repeat = factor_combinations_w_repeat.concat(factor_combinations);repeat--};

	return factor_combinations_w_repeat;
}


var global_answers = [];
var global_user_answers = [];
var global_user_good_answers = [];
var global_forgotten = [];
var global_in_excess = [];

// Calcul du nombre de bonne réponses
function calc_recall(mem_s,data){

	// Liste des items qu'il fallait rappeler
	global_answers = mem_s.map(obj => { return obj.uri;});

	// Liste des items rappeler par l'e cobaye
	global_user_answers = JSON.parse(data.responses).Q0;

	// Liste des bonnes réponses de l'utilisateur
	global_user_good_answers = global_answers.filter( ( el ) => global_user_answers.indexOf(el) !== -1 );

	// Liste des items oubliés
	global_forgotten = global_answers.filter( ( el ) => !global_user_answers.includes( el ) );

	// Liste des items rappelés en trop
	global_in_excess = global_user_answers.filter( ( el ) => !global_answers.includes( el ) );

	//log("Nbr de bonnes réponses : " + global_user_good_answers.length + " / " + global_answers.length +".");

	var nb_good_answer = global_user_good_answers.length;
	var nb_forgotten = global_forgotten.length;
	var nb_in_excess = global_in_excess.length;
	return [nb_good_answer, nb_forgotten, nb_in_excess];
	
}

// Fonction de log
//================
function log(x) {
	console.log(x);
}


// Fonction de popup
//==================
function show_popup(obj){
	alert(obj);
}


// Fonction ajout de donnée de l'exp
//===================================
function createExpData(){
	expData = new Exp_session(user_id,
			    user_lab_id,
				age,
				sex,
				writing_hand,
				vision,
				level_of_study,
				domaine,
				getIntVal($("#items_max")),
				getIntVal($("#items_min")),
				getIntVal($("#display_time_mem_sti_min")),
				getIntVal($("#display_time_mem_sti_max")),
				getIntVal($("#display_time_mem_sti_step")),
				getIntVal($("#items_pause_min")),
				getIntVal($("#items_pause_max")),
				getIntVal($("#items_pause_step")),
				getIntVal($("#distracteur_min")),
				getIntVal($("#distracteur_max")),
				getIntVal($("#distracteur_elt_min")),
				getIntVal($("#distracteur_elt_max")),
				getIntVal($("#delta_proposed_answ_min")),
				/*getIntVal($("#delta_proposed_answ_max")),*/
				getFloatVal($("#cognitif_cost_1")),
				getFloatVal($("#cognitif_cost_2")),
				getFloatVal($("#cognitif_cost_3")),
				getFloatVal($("#cognitif_cost_4")),
				repeat,
				random_factorial,
				type_recall,
				distractor_size,
				distractor_distance,
				"",
				"");

	// Réinitialisation de la lise des séries
	expList = [];
}


// Fonction de donnée d'un session
//=================================
function addExpData(id,
					nb_mem_sti,
					display_time_mem_sti,
					items_pause,
					nb_distract_sti,
					nb_distracteur_elt,
					cogn_cost,
					distr_pause){

	var exp = new Essais(id,
							 nb_mem_sti,
							 display_time_mem_sti,
							 items_pause,
							 nb_distract_sti,
							 nb_distracteur_elt,
							 cogn_cost,
							 distr_pause,"");
	expList.push(exp);

	expData["Essais"] = expList;
	//log(""+JSON.stringify(expData));
}

// Fonction de donnée d'un session
//=================================
function addData(id, data){
	//expList[num_seq].
	expSeq.push(data);
}

function updateExpList(id){

}

function getIntVal(obj){
	return parseInt(obj.val());
}

function getFloatVal(obj){
	return parseFloat(obj.val());
}


function resetWelcomPan(){
	jsPsych.pluginAPI.cancelAllKeyboardResponses();
    jsPsych.pluginAPI.clearAllTimeouts();
	stopwatch.stop();
    stopwatch.reset();
	stopwatch.clear();
	$("#exp_contener").html(WELCOM_PANE);
	$("#exp_contener").show();
	$("#result_contener").html("");
	$("#result_tab").html("");

}

function readResult(){

	// On efface le pan principal
	$("#exp_contener").html("");
	$("#exp_contener").hide();

	// Bouton voir mes résultats
	jQuery('<button/>', {
	    class: 'btn btn-success',
	    text: "Voir mes résultats",
	    style:"margin:1em;",
	    click: function () { showHideResults()},
	}).appendTo('#result_contener');

	// Bouton de éléchargement
	jQuery('<button/>', {
	    class: 'btn btn-primary',
	    text: "Télécharger les résultats en JSON",
	    style:"margin:1em;",
	    click: function () { saveResultJSON()},
	}).appendTo('#result_contener');

	jQuery('<button/>', {
	    class: 'btn btn-primary',
	    text: "Télécharger les résultats en CSV",
	    style:"margin:1em;",
	    click: function () { saveResultCSV()},
	}).appendTo('#result_contener');

	// Totaux
	jQuery('<ul/>', {
	    id:  "average",
	    class: 'list-group',
		}).appendTo('#result_tab');

	jQuery('<li/>', {
	    class: 'list-group-item active',
	    text: "Moyenne des essais",
	    style: 'font-weight: bold;',
		}).appendTo('#average');

	var t_r = (session_total_Items_OK + session_total_Distracteurs_OK) / 2 ;

	var buffer = 
	"Items corrects : <strong>" + session_total_Items_OK + " % </strong><br/>" +
	"Items en mauvaise position : <strong>" + session_total_mauvaise_position + " % </strong><br/>" +	
	"Items non répondus : <strong>" + session_total_Non_reponses_items + " % </strong><br/>" +
	"Distracteurs corrects : <strong>" + session_total_Distracteurs_OK + " % </strong><br/>" +
	"Distracteurs non répondus : <strong>" + session_total_Non_reponses_distracteurs + " % </strong><br/>" +
	"Temps de réaction moyen phase rappel : <strong>" + session_total_Temps_réaction_rappel + " ms </strong><br/>" +
	"Temps de réaction moyen phase distracteurs : <strong>" + session_total_Temps_réaction_distracteurs + " ms </strong><br/>" +
	" <strong> TAUX DE REUSSITE : "+ t_r + " %</strong>";

	jQuery('<li/>', {
	    class: 'list-group-item',
	    html: buffer,
	    style: "font-size: 1.2em",
		}).appendTo('#average');

	var ingr_lst = [];

	expData["Essais"].forEach(function(essai) {

		var essai_id = 'essai_'+essai["Numéro"];


		jQuery('<ul/>', {
		    id:  essai_id,
		    class: 'list-group',
			}).appendTo('#result_tab');

		jQuery('<li/>', {
		    class: 'list-group-item active',
		    text: "Essai n°"+essai["Numéro"],
		    style: 'font-weight: bold;',
			}).appendTo('#'+essai_id);

		myarr = ["item_pause", "disrtactor_pause", "fin_rappel", "distracteur"];

		essai["Séquence"].
		filter(seq => !(myarr.indexOf(seq.type) > -1) ).
		forEach(function(seq_elt) {

			var cl = 'list-group-item ';
			var span = "";

			if (seq_elt.correct === true){
				cl += "list-group-item-success";
				span = "glyphicon-ok";
			}
			else if (seq_elt.correct === false){
				cl += "list-group-item-danger";
				span = "glyphicon-remove";
			}

			if (seq_elt.note == "wrong place"){
				cl = "list-group-item  list-group-item-warning";
				span = "glyphicon-warning-sign";
			}

			

			var cl1 = "";
			var txt = "";
			var sti = "";
			var img = "";

			switch(seq_elt.type) {
			    case "item":
			        cl1 = "lab_M"; txt = "M";
			        sti = seq_elt.stimulus;
			        break;
			    case "distracteur question":
			        cl1 = "lab_T"; txt = "T";
			        sti = seq_elt.question_lab;
			        break;
			    case "rappel":
			    case "rappel clavier-voix":
			        cl1 = "lab_R"; txt = "R";
			        sti = "Vous avez vu en n°"+seq_elt.mem_sti_num+ " : ";
			        seq_elt.correct === true ? ingr_lst.push(seq_elt.responses):"";
			        if (JSON.parse(seq_elt.responses).Q0 != "")
			        	sti += "<img src='"+JSON.parse(seq_elt.responses).Q0+"' alt='"+JSON.parse(seq_elt.responses).Q0+" (image manquante)'>";
		        	else	
		        		sti += "Néant.";
			        break;
				case "rappel libre":
			        cl1 = "lab_R"; txt = "R";
	        			//cl = 'list-group-item ';
						span = "";
						sti = "Rappel libre.";
			        break;
			    default:
			        ;
			}

			var lab ="<label class='"+cl1+"'>"+txt+"</label>" +seq_elt.label +" : " ;
				lab += "<span class='glyphicon "+span+" pull-right' aria-hidden='true'></span>";
				lab += sti;
			
			jQuery('<li/>', {
		    id:  essai_id,
		    class: cl,
		    html : lab,
			}).appendTo('#'+essai_id);

		});
 
	});

	// S'il y a un Rappel Global
	if(expData["Rappel Global"] != "" && type_recall != "free"){

		jQuery('<ul/>', {
		    id:  "global_recall_ul",
		    class: 'list-group',
			}).appendTo('#result_tab');

		jQuery('<li/>', {
		    class: 'list-group-item active',
		    text: "Rappel Global",
		    style: 'font-weight: bold;',
			}).appendTo('#global_recall_ul');

		gen_global_item("Bon rappels",global_user_good_answers,"success", "ok");
		gen_global_item("Rappels oubliés",global_forgotten,"warning", "warning-sign");
		gen_global_item("Rappels en trop",global_in_excess,"danger", "remove");

	
		if( !training_mode){
			// Bouton de téléchargement
			feed_marmiton_modal();
	
			jQuery('<a/>', {
			    class: 'btn btn-warning',
			    html: "Marmiton",
			    'data-target':"#marmiton_infos_modal",
			    'data-toggle': "modal",
			    href: "#"
			}).appendTo('#result_contener');
		}

	}


	jQuery('<button/>', {
	    class: 'btn btn-default',
	    text: "Retour",
	    style:"margin:1em;",
	    click: function () { resetWelcomPan()},
	}).appendTo('#result_contener');

	// On montre automatiquement les résultats
	$("#result_tab").hide();

	// On enregistre le resultats dans le local storage
	localStorage.setItem("exp_"+Date.now(),JSON.stringify(expData));
	
	// 
	if (SEND_MAIL && !training_mode){
		log('sendEmailResult');
		sendEmailResult(MAIL_ADRESS, JSON.stringify(expData), getCSVResults());
	}

}

function gen_global_item(title,arr,class_item, span){

	if(arr.length>0){

		var display_item = title+" : <br/>";
		arr.map(item => (display_item += "<img src='"+item+"' alt='"+item+" (image manquante)'>"));

		display_item += "<span class='glyphicon glyphicon-"+span+" pull-right' aria-hidden='true'></span>";

		jQuery('<li/>', {
	    class: 'list-group-item list-group-item-'+class_item,
	    html : display_item
		}).appendTo('#global_recall_ul');

	}
}


function showHideResults(){
	$('#result_tab').toggle();
}


function feed_marmiton_modal(){

	global_user_good_answers.forEach( function(v){

		var val = v.split("/")[3].replace(".png","");
		var lab = val.charAt(0).toUpperCase() + val.slice(1);

		var inner = '<div class="form-check">' + 
		    '<input type="checkbox" name="marm_ingr" class="form-check-input" id="marm_'+val+'"  value="'+val+'">'+
		    '<label class="form-check-label" for="marm_'+val+'"> '+lab+'</label>';
	
		jQuery('<div/>', {
		    class: 'form-check',
		    html: inner,
	    	click: function () { refresh_marm_ingr()},
		}).appendTo('#body_modal_marmiton');


	});

} 

function refresh_marm_ingr(){

	var search = "";

	$( "input[name^='marm_ingr']:checked" ).each(function( index ) {
	  search += $( this ).attr('value') + '-';
	});


	$("#marmiton_link").attr("href", "http://www.marmiton.org/recettes/recherche.aspx?type=all&aqt="+search );

}



Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};


function randomize_img_position(){
	var cl_H = ""; 
	var horizontal = getRandomInt(3);
	switch(horizontal) {
		case 0 :
			$("#jspsych-animation-image").css("left","");
			break;
		case 1 :
			$("#jspsych-animation-image").css("right","");
			break;
	}
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}