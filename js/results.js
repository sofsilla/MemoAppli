
function saveResultJSON(){

	  var text = JSON.stringify(expData);
	  var filename = expData["user_lab_id"]
	  				+"_"+ expData["Date"]
	  				+"_"+ expData["Heure"]
	  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	  download(text, filename+".json", "json");
}

function saveResultCSV(){


	var text = getCSVResults();
	var filename = expData["user_lab_id"]
					+"_"+ expData["Date"]
					+"_"+ expData["Heure"]
	var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	download(text, filename+".csv", "csv");

}

function getCSVResults(){

	var json = expData["Essais"];

	var fields = Object.keys(json[0]);
	var replacer = function(key, value) { return value === null ? '' : value } ;
 
	var csv = json.map(function(row){
		  return fields.map(function(fieldName){
		    return JSON.stringify(row[fieldName], replacer)
		  }).join(',')
		})
	csv.unshift(fields.join(',')); // add header column
	log(csv);


	for(var i=0;i<csv.length;i++){
		if(i == 0)
	    	csv[i] = "Identifiant cobaye,Age,Sexe,Main d'écriture,Vision,Niveau d'étude,Domaine," + csv[i] ;
		else
	    	csv[i] = user_lab_id+ "," + age+ "," + sex+ "," + writing_hand+ "," + vision+ "," + level_of_study +","+ domaine +"," + csv[i] ;
	}

	return ("\uFEFF"+csv.join('\r\n'));
}


function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}


var session_total_Items_OK =  0;
var session_total_mauvaise_position = 0;
var session_total_Non_reponses_items =  0;
var session_total_Distracteurs_OK = 0;
var session_total_Non_reponses_distracteurs = 0;
var session_total_Temps_réaction_rappel =  0;
var session_total_Temps_réaction_distracteurs = 0;

function organize_data(){

	m_session_total_Items_OK =  0;
	m_session_total_mauvaise_position =  0;
	m_session_total_Non_reponses_items =  0;
	m_session_total_Distracteurs_OK = 0;
	m_session_total_Non_reponses_distracteurs = 0;
	m_session_total_Temps_réaction_rappel =  0;
	m_session_total_Temps_réaction_distracteurs = 0;

	session_total_Items_OK =  0;
	session_total_mauvaise_position = 0;
	session_total_Non_reponses_items =  0;
	session_total_Distracteurs_OK = 0;
	session_total_Non_reponses_distracteurs = 0;
	session_total_Temps_réaction_rappel =  0;
	session_total_Temps_réaction_distracteurs = 0;

	var m_items = "";
	var m_items_wrong_place = 0;
	var m_nb_items = 0;
	var m_answers = "";
	var m_results = "";
	var m_results_bin = "";
	var m_nb_ok = 0;
	var m_nb_neant = 0;
	var m_rt_moy = 0;
	var m_rt_distr_moy = 0;
	var m_nb_distr = 0;
	var m_nb_distr_ok = 0;
	var m_nb_neant_distr = 0;
	var m_try = 0;

	expData["Essais"].forEach( function(elt){

		m_items = "";
		m_items_wrong_place = 0;
		m_nb_items = 0;
		m_answers = "";
		m_results = "";
		m_results_bin = "";
		m_nb_ok = 0;
		m_nb_neant = 0;
		m_rt_moy = 0;
		m_rt_distr_moy = 0;
		m_nb_distr = 0;
		m_nb_distr_ok = 0;
		m_nb_neant_distr = 0;

		elt["Séquence"].forEach(  function(seq){
			if( seq["type"] == "rappel" || seq["type"] == "rappel libre" || seq["type"] == "rappel clavier-voix" ){

				m_nb_items++;
				var s = "";

				// Items présentés
				s = seq.good_answer === undefined ? "néant" : seq.good_answer;
				m_items +=  s +',' ;

				// Réponses de l'utilisateur
				s = seq.user_answer === undefined ? "néant" : seq.user_answer;
				m_answers +=  s +',' ;

				if(seq.user_answer === undefined)
					m_nb_neant++;

				// Résultats de l'utilisateur
				if(seq.correct){
					m_results +=  'ok,' ;
					m_results_bin += '1';
					m_nb_ok++;
				}else{
	    			m_results += seq.note+','; 
					m_results_bin += '0';
					if(seq.note == "wrong place") m_items_wrong_place++; 
				}

				// Temps de réponse moyen rappels
				m_rt_moy += seq.rt;


			}

			if( seq["type"] == "distracteur question"){
				m_nb_distr++;

				// Nbr bonne réponses
				if(seq.correct)
					m_nb_distr_ok++;

				// Temps de réponse moyen distracteurs
				if (seq.rt != null)
					m_rt_distr_moy += seq.rt;
				else{
					m_rt_distr_moy += answ_display_time;
					m_nb_neant_distr++;
				}
			}


		});

		elt.items = m_items.substring(0, m_items.length - 1);
		elt["Réponses données"] = m_answers.substring(0, m_answers.length - 1);
		elt["Résultats"] = m_results.substring(0, m_results.length - 1);
		elt["Résultats binaires"] = m_results_bin;

		m_session_total_Items_OK = (m_nb_ok*100/  m_nb_items);
		elt["Items OK (%)"] =  m_session_total_Items_OK.toFixed(2);

		m_session_total_mauvaise_position = (m_items_wrong_place*100/  m_nb_items);
		elt["Items mauvaise position (%)"] =  m_session_total_mauvaise_position.toFixed(2);

		m_session_total_Non_reponses_items = (m_nb_neant*100/  m_nb_items );
		elt["Non-réponses items (%)"] =  m_session_total_Non_reponses_items.toFixed(2);

		m_session_total_Distracteurs_OK = (m_nb_distr_ok*100/ m_nb_distr);
		elt["Distracteurs OK (%)"] =  m_session_total_Distracteurs_OK.toFixed(2);
		m_session_total_Non_reponses_distracteurs =  (m_nb_neant_distr*100/ m_nb_distr);
		elt["Non-réponses distracteurs (%)"] = m_session_total_Non_reponses_distracteurs.toFixed(2);
		 
		m_session_total_Temps_réaction_rappel = (m_rt_moy/  m_nb_items);
		elt["Temps de réaction moyen phase rappel (ms)"] =  m_session_total_Temps_réaction_rappel.toFixed(2);

		m_session_total_Temps_réaction_distracteurs = (m_rt_distr_moy/  m_nb_distr  );
		elt["Temps de réaction moyen phase distracteurs (ms)"] =  m_session_total_Temps_réaction_distracteurs.toFixed(2);

        session_total_Items_OK += m_session_total_Items_OK ;
        session_total_mauvaise_position += m_session_total_mauvaise_position ;
        session_total_Non_reponses_items += m_session_total_Non_reponses_items ;
        session_total_Distracteurs_OK += m_session_total_Distracteurs_OK ;
        session_total_Non_reponses_distracteurs += m_session_total_Non_reponses_distracteurs ;
        session_total_Temps_réaction_rappel += m_session_total_Temps_réaction_rappel ;
        session_total_Temps_réaction_distracteurs += m_session_total_Temps_réaction_distracteurs ;

        m_try++;

	});

	session_total_Items_OK = session_total_Items_OK / m_try ;
	session_total_mauvaise_position = session_total_mauvaise_position / m_try ;
    session_total_Non_reponses_items = session_total_Non_reponses_items /   m_try ;
    session_total_Distracteurs_OK = session_total_Distracteurs_OK /  m_try ;
    session_total_Non_reponses_distracteurs = session_total_Non_reponses_distracteurs /  m_try ;
    session_total_Temps_réaction_rappel = session_total_Temps_réaction_rappel /   m_try ;
    session_total_Temps_réaction_distracteurs = session_total_Temps_réaction_distracteurs /  m_try ;

    var taux_reussite = (session_total_Items_OK + session_total_Distracteurs_OK) / 2 ;
    if( training_score < taux_reussite)
    	training_score = taux_reussite;

}


