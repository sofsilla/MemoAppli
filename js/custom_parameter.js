
// Detection des changement des check box de paramétrage
//======================================================
$( "input[name^='p_checkbox']" ).change(function() {
	refresh_para();
});

$("#user_id").on("change paste keyup", function() {
   $("#user_lab_id").val(md5( $(this).val() ) ); 
});

/*=========== */
$('#items_min').bind('input', function() { 
    if( getIntVal($('#items_min')) > getIntVal($('#items_max')) )
		$('#items_max').val( getIntVal($('#items_min')));
    refresh_para();
});
$('#items_max').bind('input', function() { 
	if( getIntVal($('#items_max')) < getIntVal($('#items_min')) )
		$('#items_min').val( getIntVal($('#items_max')));
    refresh_para();
});

/*=========== */
$('#display_time_mem_sti_min').bind('input', function() { 
	if( getIntVal($('#display_time_mem_sti_min')) > getIntVal($('#display_time_mem_sti_max')) )
		$('#display_time_mem_sti_max').val( getIntVal($('#display_time_mem_sti_min')));
    refresh_para();
});

$('#display_time_mem_sti_max').bind('input', function() { 
	if( getIntVal($('#display_time_mem_sti_max')) < getIntVal($('#display_time_mem_sti_min')) )
		$('#display_time_mem_sti_min').val( getIntVal($('#display_time_mem_sti_max')));
    refresh_para();
});

$('#display_time_mem_sti_step').bind('input', function() { 
    refresh_para();
});

/*=========== */ 
$("[id^='cognitif_cost']").bind('input', function() { 
	/*if ($(this).val()==0)
		$(this).val(0.05);*/
    refresh_para();
});

/*=========== */
$('#items_pause_min').bind('input', function() { 
	if( getIntVal($('#items_pause_min')) > getIntVal($('#items_pause_max')) )
		$('#items_pause_max').val( getIntVal($('#items_pause_min')));
    refresh_para();
});

$('#items_pause_max').bind('input', function() { 
	if( getIntVal($('#items_pause_max')) < getIntVal($('#items_pause_min')) )
		$('#items_pause_min').val( getIntVal($('#items_pause_max')));
    refresh_para();
});

$('#items_pause_step').bind('input', function() { 
    refresh_para();
});

/*=========== */
$('#distracteur_min').bind('input', function() { 
	if( getIntVal($('#distracteur_min')) > getIntVal($('#distracteur_max')) )
		$('#distracteur_max').val( getIntVal($('#distracteur_min')));
    refresh_para();
});

$('#distracteur_max').bind('input', function() { 
	if( getIntVal($('#distracteur_max')) < getIntVal($('#distracteur_min')) )
		$('#distracteur_min').val( getIntVal($('#distracteur_max')));
    refresh_para();
});

$('#distracteur_step').bind('input', function() { 
    refresh_para();
});

/*=========== */
$('#distracteur_elt_min').bind('input', function() { 
	if( getIntVal($('#distracteur_elt_min')) > getIntVal($('#distracteur_elt_max')) )
		$('#distracteur_elt_max').val( getIntVal($('#distracteur_elt_min')));
    refresh_para();
});

$('#distracteur_elt_max').bind('input', function() { 
	if( getIntVal($('#distracteur_elt_max')) < getIntVal($('#distracteur_elt_min')) )
		$('#distracteur_elt_min').val( getIntVal($('#distracteur_elt_max')));
    refresh_para();
});

/*=========== */
$('#delta_proposed_answ_min').bind('input', function() { 
    if( getIntVal($('#delta_proposed_answ_min')) > getIntVal($('#delta_proposed_answ_max')) )
		$('#delta_proposed_answ_max').val( getIntVal($('#delta_proposed_answ_min')));
    refresh_para();
});
/*$('#delta_proposed_answ_max').bind('input', function() { 
	if( getIntVal($('#delta_proposed_answ_max')) < getIntVal($('#delta_proposed_answ_min')) )
		$('#delta_proposed_answ_min').val( getIntVal($('#delta_proposed_answ_max')));
    refresh_para();
});*/

/*=========== */

$('#distractor_size').bind('input', function() { 
    refresh_para();
});

$('#distractor_distance').bind('input', function() { 
    refresh_para();
});



$('#repeat').bind('input', function() { 
    refresh_para();
});


$('#delta_proposed_answ').bind('input', function() { 
    refresh_para();
});

$('#answ_display_time').bind('input', function() { 
    refresh_para();
});


$('#distracteur_elt_display').bind('input', function() { 
    refresh_para();
});


$('#distracteur_elt_pause').bind('input', function() { 
    refresh_para();
});

function refresh_para(){

	// Checkbox
	random_factorial = $('#random_factorial').is(":checked");
	type_recall = $("#type_recall_div select").val();

	// Valeurs simple
	repeat =  getIntVal($('#repeat'));
	distractor_size = getIntVal($('#distractor_size'));
	distractor_distance = getIntVal($('#distractor_distance'));

	// Génération d'un tableau de nb d'items
	nb_mem_sti = cacl_n_array($('#items_min'), $('#items_max'));

	// Gestion du delta entre le temps max et min d'affichage des items
	$('#display_time_mem_sti_step').val( step_managing($('#display_time_mem_sti_step'), $('#display_time_mem_sti_min'), $('#display_time_mem_sti_max'), true)  );
	$('#items_pause_step').val( step_managing($('#items_pause_step'), $('#items_pause_min'), $('#items_pause_max'), true)  );
	$('#distracteur_step').val( step_managing($('#distracteur_step'), $('#distracteur_min'), $('#distracteur_max'), true)  );
	

	// Calcule de la fourchette d'affichage des items
	display_time_mem_sti = calc_time_array($('#display_time_mem_sti_min'), $('#display_time_mem_sti_max'), $('#display_time_mem_sti_step'), true);
	items_pause = calc_time_array($('#items_pause_min'), $('#items_pause_max'), $('#items_pause_step'), true);

	// Génération d'un tableau de nb de distracteur
	nb_distract_sti = cacl_n_array($('#distracteur_min'), $('#distracteur_max'));
	nb_distract_sti = calc_time_array($('#distracteur_min'), $('#distracteur_max'), $('#distracteur_step'), true);
	cognitif_cost = [];

	$("[id^='cognitif_cost']").each(function( index ) {
		var val = $(this).val();
	  if ( val != "" &&  !cognitif_cost.includes(val))
	  	cognitif_cost.push(val);
	});

	cognitif_cost.sort(function(a,b) { return a - b;});

	// Génération d'un tableau de nb de distracteur
	nb_distracteur_elt = cacl_n_array($('#distracteur_elt_min'), $('#distracteur_elt_max'));

	// Génération d'un tableau de nb d'écart
	//delta_proposed_answ = cacl_n_array($('#delta_proposed_answ_min'), $('#delta_proposed_answ_max'));
	delta_proposed_answ = getIntVal($('#delta_proposed_answ_min'));

	distracteur_elt_display = getIntVal($('#distracteur_elt_display'));
	distracteur_elt_pause = getIntVal($('#distracteur_elt_pause'));
	answ_display_time = getIntVal($('#answ_display_time'));


	// Calcul du temps total d'un distracteur (images+ réponses)
	var distr_time = calc_distr_time( nb_distracteur_elt[0], distracteur_elt_display, distracteur_elt_pause, answ_display_time );
	document.getElementById("distract_time").valueAsNumber = ( distr_time )  ;

	// Calcul du temps total de l'isi des distracteurs en fonction du coût cognitif
	var distr_pause = calc_distr_pause(distr_time, cognitif_cost[0]);

	document.getElementById("distract_pause_time").valueAsNumber = ( distr_pause )  ;


	// Calcul du nombre de série générée
	$("#nbr_exp").text(nb_mem_sti.length * items_pause.length * display_time_mem_sti.length * nb_distract_sti.length *
	 cognitif_cost.length * repeat);
	 
}


// Calcul des tableaux de n en fonction d'un min et d'un max
function cacl_n_array(min_obj, max_obj){

	var a = getIntVal(min_obj);
	var b = getIntVal(max_obj);
	return Array.from(Array(b-a+1).keys(), n => n + a);
}

// Calcul des tableaux de temps en fonction du mon, max et du pas
function calc_time_array(min_obj, max_obj, step_obj, intergers){

	array = [];

	var a = intergers ? getIntVal(min_obj) : getFloatVal(min_obj);
	var b = intergers ? getIntVal(max_obj) : getFloatVal(max_obj);
	var s = intergers ? getIntVal(step_obj) : getFloatVal(step_obj);
	var last_elt ;

	if (s == 0)
		a == b ?  array = [a] : array = [a,b];
	else{
		for (var i= a; i <= b ; i+=s){
			array.push(i);
			last_elt = i;
		}

		if (last_elt != b)
			array.push(b);
	}

	return array;
}

// Régulation du pas en fonction des valeures min et max
function step_managing(step_obj, min_obj, max_obj, intergers){

	if (intergers){
		var delta = getIntVal(max_obj) - getIntVal(min_obj);
		if( getIntVal(step_obj) > delta )
			return delta;
	}else{
		var delta = getFloatVal(max_obj) - getFloatVal(min_obj);
		if( getFloatVal(step_obj) > delta )
			return delta;
	}

	return step_obj.val();
}

// Fonction qui empèche la valeure zéro
function validation(int_obj){

	var i = getIntVal(int_obj);

	if (i == 0 || isNaN(i))
		i = 1;

	int_obj.val(i);
		
	return i ;
}

// Calcul du temps d'un distracteur
function calc_distr_time(nb_elt_distr, elt_distr_display, elt_distr_pause, answ_d){

	return (nb_elt_distr * (elt_distr_display+elt_distr_pause) + answ_d) ;
}

// Calcul de l 'ISI d'un distracteur en fonction du coût cognitif
function calc_distr_pause(distr_t, cc){

	return (  (distr_t / cc ) - distr_t );
}


function save_user(){

	user_id = $('#user_id').val()  ;
	user_lab_id =  $('#user_lab_id').val()   ;
    age =   getIntVal($('#age'))  ;
    sex =  $('#sex').val() ;
	writing_hand = $('#writing_hand').val()  ;
	vision  =  $('#vision').val()  ;
	level_of_study = $('#level_of_study').val()  ;
	domaine = $('#domaine').val()  ;

	localStorage.setItem("user_id",user_id);
	localStorage.setItem("user_lab_id",user_lab_id);
	localStorage.setItem("age",age);
	localStorage.setItem("sex",sex);
	localStorage.setItem("writing_hand",writing_hand);
	localStorage.setItem("vision",vision);
	localStorage.setItem("level_of_study",level_of_study);
	localStorage.setItem("domaine",domaine);


	resetWelcomPan();
	refresh_para();
	$('#user_infos_modal').modal('hide');

}


function load_user(){

	user_id = localStorage.getItem("user_id");
	user_lab_id = localStorage.getItem("user_lab_id");
	age = localStorage.getItem("age");
	sex = localStorage.getItem("sex");
	writing_hand = localStorage.getItem("writing_hand");
	vision = localStorage.getItem("vision");
	level_of_study = localStorage.getItem("level_of_study");
	domaine = localStorage.getItem("domaine");

	// Sauvegarde dans les localStorage
	$("#user_id").val(user_id);
	$("#user_lab_id").val(user_lab_id);
	$("#age").val(age);
	$("#sex").val(sex);
	$("#writing_hand").val(writing_hand);
	$("#vision").val(vision);
	$("#level_of_study").val( level_of_study);
	$("#domaine").val( domaine);

}


function load_param(){

	getLocVar("items_min" );
	getLocVar("items_max");
	getLocVar("display_time_mem_sti_min");
	getLocVar("display_time_mem_sti_max");
	getLocVar("display_time_mem_sti_step");
	getLocVar("items_pause_min");
	getLocVar("items_pause_max");
	getLocVar("items_pause_step");
	getLocVar("distracteur_min");
	getLocVar("distracteur_max");
	getLocVar("distracteur_step");
	getLocVar("distracteur_elt_min");
	getLocVar("distracteur_elt_max");
	getLocVar("distracteur_elt_display");
	getLocVar("distracteur_elt_pause");
	getLocVar("answ_display_time");
	getLocVar("delta_proposed_answ_min");
	getLocVar("cognitif_cost_1");
	getLocVar("cognitif_cost_2");
	getLocVar("cognitif_cost_3");
	getLocVar("cognitif_cost_4");
	getLocVar("distract_time");
	getLocVar("distract_pause_time");
	getLocVar("repeat");
	getLocVar("distractor_size");
	getLocVar("distractor_distance");	

	var m_random_factorial = localStorage.getItem( "random_factorial" );
	if( m_random_factorial != null) $("#random_factorial").prop('checked', m_random_factorial === 'true')

	var m_type_recall = localStorage.getItem("type_recall");
	if( m_type_recall != null) $("#type_recall_div select").val(m_type_recall);
}

function getLocVar(var_name){
	var loc_var = localStorage.getItem( var_name );
	if( loc_var != null) $("#"+var_name).val(loc_var);
}


function save_param(){

	saveLocVar("items_min", true );
	//localStorage.setItem("items_min", getIntVal($('#items_min')) );
	saveLocVar("items_max", true );
	saveLocVar("display_time_mem_sti_min", true );
	saveLocVar("display_time_mem_sti_max", true );
	saveLocVar("display_time_mem_sti_step", true );
	saveLocVar("items_pause_min", true );
	saveLocVar("items_pause_max", true );
	saveLocVar("items_pause_step", true );
	saveLocVar("distracteur_min", true );
	saveLocVar("distracteur_max", true );
	saveLocVar("distracteur_step", true );
	saveLocVar("distracteur_elt_min", true );
	saveLocVar("distracteur_elt_max", true );
	saveLocVar("distracteur_elt_display", true );
	saveLocVar("distracteur_elt_pause", true );
	saveLocVar("answ_display_time", true );
	saveLocVar("delta_proposed_answ_min", true );
	saveLocVar("cognitif_cost_1", false );
	saveLocVar("cognitif_cost_2", false );
	saveLocVar("cognitif_cost_3", false );
	saveLocVar("cognitif_cost_4", false );
	saveLocVar("distract_time", true );
	saveLocVar("distract_pause_time", true );
	saveLocVar("repeat", true );
	saveLocVar("distractor_size", true );	
	saveLocVar("distractor_distance", true );
	localStorage.setItem("random_factorial", $('#random_factorial').is(':checked'));

	localStorage.setItem("type_recall", $("#type_recall_div select").val());
	

	resetWelcomPan();
	refresh_para();
	$('#param_modal').modal('hide');
}

function saveLocVar(var_name, int){
	localStorage.setItem(var_name, int? getIntVal($('#'+var_name)) : getFloatVal($('#'+var_name))    );

}


function default_param(){

	$("#items_min").val(DEF_items_min);
	$("#items_max").val(DEF_items_max);
	$("#display_time_mem_sti_min").val(DEF_display_time_mem_sti_min);
	$("#display_time_mem_sti_max").val(DEF_display_time_mem_sti_max);
	$("#display_time_mem_sti_step").val(DEF_display_time_mem_sti_step);
	$("#items_pause_min").val(DEF_items_pause_min);
	$("#items_pause_max").val(DEF_items_pause_max);
	$("#items_pause_step").val(DEF_items_pause_step);
	$("#distracteur_min").val(DEF_distracteur_min);
	$("#distracteur_max").val(DEF_distracteur_max);
	$("#distracteur_step").val(DEF_distracteur_step);
	$("#distracteur_elt_min").val(DEF_distracteur_elt_min);
	$("#distracteur_elt_max").val(DEF_distracteur_elt_max);
	$("#distracteur_elt_display").val(DEF_distracteur_elt_display);
	$("#distracteur_elt_pause").val(DEF_distracteur_elt_pause);
	$("#answ_display_time").val(DEF_answ_display_time);
	$("#delta_proposed_answ_min").val(DEF_delta_proposed_answ_min);
	$("#cognitif_cost_1").val(DEF_cognitif_cost_1);
	$("#cognitif_cost_2").val(DEF_cognitif_cost_2);
	$("#cognitif_cost_3").val(DEF_cognitif_cost_3);
	$("#cognitif_cost_4").val(DEF_cognitif_cost_4);
	$("#repeat").val(DEF_repeat);
	$("#distractor_size").val(DEF_distractor_size);
	$("#distractor_distance").val(DEF_distractor_distance);	
	$("#random_factorial").prop('checked', DEF_random_factorial);

	$("#type_recall_div select").val(DEF_type_recall);

	resetWelcomPan();
	//save_param();
	refresh_para();
}



function erase_user(){

	localStorage.removeItem("user_id");
	localStorage.removeItem("user_lab_id");
	localStorage.removeItem("age");
	localStorage.removeItem("sex");
	localStorage.removeItem("writing_hand");
	localStorage.removeItem("vision");
	localStorage.removeItem("level_of_study");
	localStorage.removeItem("domaine");

	user_id = "";
	user_lab_id = "";
	age = "";
	sex = "";
	writing_hand = "";
	vision = "";
	level_of_study = "";

	// Sauvegarde dans les localStorage
	$("#user_id").val(user_id);
	$("#user_lab_id").val(user_lab_id);
	$("#age").val(age);
	$("#sex").val(sex);
	$("#writing_hand").val(writing_hand);
	$("#vision").val(vision);
	$("#level_of_study").val( level_of_study);
	$("#domaine").val( domaine);
}