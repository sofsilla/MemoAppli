
var grammar = '#JSGF V1.0; grammar colors; public <color> = fraise | banane | basilic | betterave | carotte | emmental | avocat | haricot | olive | orange | pâtes | pomme | poulet | riz | saumon | tomate | oeuf | mozzarella ;'
var recognition = new webkitSpeechRecognition();
var speechRecognitionList = new webkitSpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');


recognition.onresult = function(event) {
  var res = event.results[0][0].transcript;
  $("#free_recall_input").val(res);
  //log(res);
  $('#mic_button').removeClass('mic_button_recording');
/*  diagnostic.textContent = 'Result received: ' + color;
  bg.style.backgroundColor = color;*/
};


recognition.nomatch = function() {
log("onspeechend");
}


recognition.onspeechend = function() {
  $('#mic_button').removeClass('mic_button_recording');
log('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  $('#mic_button').removeClass('mic_button_recording');
log(event.error);
 /* if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };*/
}



function startListening(){
  console.log('Ready to receive a color command.');
  $('#mic_button').addClass('mic_button_recording');
  recognition.start();
}
