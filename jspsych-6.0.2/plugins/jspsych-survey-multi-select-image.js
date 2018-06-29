/**
 * jspsych-survey-multi-select
 * a jspsych plugin for multiple choice survey questions
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['survey-multi-select-image'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-multi-select-image',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {type: jsPsych.plugins.parameterType.STRING,
                    pretty_name: 'Prompt',
                    default: undefined,
                    description: 'The strings that will be associated with a group of options.'},
          options: {type: jsPsych.plugins.parameterType.STRING,
                    pretty_name: 'Options',
                    array: true,
                    default: undefined,
                    description: 'Displays options for an individual question.'},
          horizontal: {type: jsPsych.plugins.parameterType.BOOL,
                        pretty_name: 'Horizontal',
                        default: false,
                        description: 'If true, then questions are centered and options are displayed horizontally.'},
        }
      },
      required: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Required',
        default: false,
        description: 'Subject will be required to pick an option for each question.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button.'
      },
      keyboard_voice: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Input voice',
        default:  false,
        description: 'Display an input and a voice recognation.'
      }
    }
  }
  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-select-image";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }


    // inject CSS for trial
    display_element.innerHTML = '<style id="jspsych-survey-multi-select-image-css"></style>';
    var cssstr = ".jspsych-survey-multi-select-image-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }"+
      ".jspsych-survey-multi-select-image-text span.required {color: darkred;}"+
      ".jspsych-survey-multi-select-image-horizontal .jspsych-survey-multi-select-image-text {  text-align: center;}"+
      ".jspsych-survey-multi-select-image-option { line-height: 2; }"+
      ".jspsych-survey-multi-select-image-horizontal .jspsych-survey-multi-select-image-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}"+
      "label.jspsych-survey-multi-select-image-text input[type='checkbox'] {margin-right: 1em;}"+
      ".response_img{  height: 7em ;  border: 2px solid transparent;}"+
      ".selected_recall_item {border: 2px solid blue; border-radius: 1em;background-color: #3790ff0d;}"+
      "#mic_button {margin: 0;width: 4em;padding: 20px;;background-color: transparent;border: 0;}"+
      "#mic_button:focus {outline:0;}"+
      ".mic_button_recording {background: url('res/img/mic_record.gif') no-repeat;background-size: 100%;}"

    display_element.querySelector('#jspsych-survey-multi-select-image-css').innerHTML = cssstr;

    // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.innerHTML += '<form id="'+trial_form_id+'"></form>';
    var trial_form = display_element.querySelector("#" + trial_form_id);
    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    if(trial.preamble !== null){
      trial_form.innerHTML += '<div id="'+preamble_id_name+'" class="'+preamble_id_name+'">'+trial.preamble+'</div>';
    }
    // add multiple-select questions
    for (var i = 0; i < trial.questions.length; i++) {
      // create question container
      var question_classes = [_join(plugin_id_name, 'question')];
      if (trial.questions[i].horizontal) {
        question_classes.push(_join(plugin_id_name, 'horizontal'));
      }

      trial_form.innerHTML += '<div id="'+_join(plugin_id_name, i)+'" class="'+question_classes.join(' ')+'"></div>';

      var question_selector = _join(plugin_id_selector, i);

      // add question text
      display_element.querySelector(question_selector).innerHTML += '<p id="survey-question" class="' + plugin_id_name + '-text survey-multi-select-image">' + trial.questions[i].prompt + '</p>';

      // create option check boxes
      for (var j = 0; j < trial.questions[i].options.length; j++) {
        var option_id_name = _join(plugin_id_name, "option", i, j),
          option_id_selector = '#' + option_id_name;

        // add check box container
        display_element.querySelector(question_selector).innerHTML += '<div id="'+option_id_name+'" class="'+_join(plugin_id_name, 'option')+'"></div>';

        // add label and question text
        var form = document.getElementById(option_id_name)
        var input_name = _join(plugin_id_name, 'response', i);
        var input_id = _join(plugin_id_name, 'response', i, j);
        var label = document.createElement('label');
        label.setAttribute('class', plugin_id_name+'-text');
        label.setAttribute('for', input_id)

        var img = document.createElement("IMG");
        img.setAttribute('class', plugin_id_name+'-text response_img');
        img.setAttribute("src", trial.questions[i].options[j]);
        label.appendChild(img);

        // create  checkboxes
        var input = document.createElement('input');
        input.setAttribute('type', "checkbox");
        input.setAttribute('name', input_name);
        input.setAttribute('id', input_id);
        input.setAttribute('value', trial.questions[i].options[j])
        input.style.display = 'none';
        input.setAttribute('onchange',"toggleCheckbox(this)");
        form.appendChild(label)
        form.insertBefore(input, label)
      }
    }

    if(trial.keyboard_voice){
      var div_speech = document.createElement("DIV");
      div_speech.setAttribute('style', "text-align: center;");

      var input_speech = document.createElement("textarea");
      input_speech.setAttribute('id', 'free_recall_input');
      input_speech.setAttribute("type", "text");
      input_speech.setAttribute("rows", "2");
      input_speech.setAttribute("class", "form-control");

      var img_speech = document.createElement("IMG");
      img_speech.setAttribute('id', 'mic_button');
      img_speech.setAttribute('src', isChrome ? "res/img/mic.png" : "res/img/no_mic.png");
      if (isChrome)
        img_speech.setAttribute("onclick", "startListeningContinuous()") ;

      var p_speech = document.createElement("p");
      p_speech.setAttribute('style', 'font-size: 0.6em;');
      var node = document.createTextNode("This is new.");
      p_speech.appendChild( document.createTextNode("séparez les éléments par une virgule"));

      div_speech.appendChild(input_speech);
      div_speech.appendChild(p_speech);
      div_speech.appendChild(img_speech);

      display_element.querySelector(question_selector).appendChild(div_speech);
      display_element.querySelector(question_selector).innerHTML += '<br/>';
    }

    // add submit button
    trial_form.innerHTML +='<div class="fail-message"></div>'
    trial_form.innerHTML += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label +'"': '') + '></input>';

    trial_form.addEventListener('submit', function(event) {
      event.preventDefault();
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      var fold = training_mode? "animaux/" : "ingredient/";

      // create object to hold responses
      var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
      var question_data = {};
      var has_response = [];
      for(var index=0; index<matches.length; index++){
        match = matches[index];
        var val = [];
        var inputboxes = match.querySelectorAll("input[type=checkbox]:checked")

        if(trial.keyboard_voice) {
          var res = $("#free_recall_input").val();
          log(res);

          if (res != ""){
            res.split(",").forEach( function(v) {
              if ( v != null && v != "" && v != " " ){
                v = v.replace(/\s+$/, '');
                val.push("res/img/"+fold+ v + ".png")
              }
            });
          }
        }
        else{
          for(var j=0; j<inputboxes.length; j++){
            currentChecked = inputboxes[j];
            val.push(currentChecked.value)
          }
        }
        var id = 'Q' + index
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
        if(val.length == 0){ has_response.push(false); } else { has_response.push(true); }
      }
      // adds validation to check if at least one option is selected
      if(trial.required && has_response.includes(false)) {
        var inputboxes = display_element.querySelectorAll("input[type=checkbox]")
        display_element.querySelector(".fail-message").innerHTML = '<span style="color: red;" class="required">'+trial.required_msg+'</span>';
      } else {
        // save data
        var trial_data = {
          "rt": response_time,
          "responses": JSON.stringify(question_data)
        };
        display_element.innerHTML = '';

        // next trial
        jsPsych.finishTrial(trial_data);
      }
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();


function toggleCheckbox(element){
  var img = element.nextElementSibling.firstChild;
   element.checked ? img.classList.add("selected_recall_item") : img.classList.remove("selected_recall_item");
}


var recognition_2 = new webkitSpeechRecognition();
var speechRecognitionList = new webkitSpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition_2.grammars = speechRecognitionList;
//recognition_2.continuous = true;
recognition_2.lang = 'fr-FR';
recognition_2.interimResults = false;
recognition_2.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');


recognition_2.onresult = function(event) {
  var res = event.results[0][0].transcript;
  $("#free_recall_input").append(res + ',');
  //log(res);
  $('#mic_button').removeClass('mic_button_recording');
/*  diagnostic.textContent = 'Result received: ' + color;
  bg.style.backgroundColor = color;*/
};


recognition_2.nomatch = function() {
  log("onspeechend");
}


recognition_2.onspeechend = function() {
  $('#mic_button').removeClass('mic_button_recording');
log('You were quiet for a while so voice recognition turned itself off.');
}

recognition_2.onerror = function(event) {
  $('#mic_button').removeClass('mic_button_recording');
log(event.error);
 /* if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };*/
}



function startListeningContinuous(){
  console.log('Ready to receive a color command.');
  $('#mic_button').addClass('mic_button_recording');
  recognition_2.start();
}
