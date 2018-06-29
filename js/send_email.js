
function sendEmailResult(m_mail,json_res,csv_res){

	var data = {
		mail : m_mail,
	    json_data : json_res,
	    csv_data  : csv_res
	};

	$.ajax({
	  type: "POST",
	  url: 'script/send_result_memoapppli.php',
	  data: data,
	  success: function (data) {
                console.log("email envoyé");
            },
        error : function(resultat, statut, erreur){
        	console.log(resultat);
        	console.log(statut);
        	console.log(erreur);
       }
	});

}