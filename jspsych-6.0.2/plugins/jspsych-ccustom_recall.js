/**
 * jspsych-survey-multi-choice-image
 * a jspsych plugin for multiple choice survey questions
 *
 * Shane Martin
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['survey-multi-choice-image'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-multi-choice-image',
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
          required: {type: jsPsych.plugins.parameterType.BOOL,
                     pretty_name: 'Required',
                     default: false,
                     description: 'Subject will be required to pick an option for each question.'},
          horizontal: {type: jsPsych.plugins.parameterType.BOOL,
                        pretty_name: 'Horizontal',
                        default: false,
                        description: 'If true, then questions are centered and options are displayed horizontally.'},
        }
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
      }
    }
  }
  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-choice-image";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

    // inject CSS for trial
    display_element.innerHTML = '<style id="jspsych-survey-multi-choice-image-css"></style>';
    var cssstr = ".jspsych-survey-multi-choice-image-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }"+
      ".jspsych-survey-multi-choice-image-text span.required {color: darkred;}"+
      ".jspsych-survey-multi-choice-image-horizontal .jspsych-survey-multi-choice-image-text {  text-align: center;}"+
      ".jspsych-survey-multi-choice-image-option { line-height: 2; }"+
      ".jspsych-survey-multi-choice-image-horizontal .jspsych-survey-multi-choice-image-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}"+
      "label.jspsych-survey-multi-choice-image-text input[type='radio'] {margin-right: 1em;}"+
      ".response_img{  height: 7em ;  border: 2px solid transparent;}"+
      ".selected_recall_item {border: 2px solid blue; border-radius: 1em;background-color: #3790ff0d;}"+
      "#mic_button {margin: 0;padding: 20px;background-color: transparent;border: 0;}"+
      "#mic_button:focus {outline:0;}"+
      ".mic_button_recording {background: url('../res/img/mic_record.gif') no-repeat;background-size: 100%;}"

    display_element.querySelector('#jspsych-survey-multi-choice-image-css').innerHTML = cssstr;

    // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.innerHTML += '<form id="'+trial_form_id+'"></form>';
    var trial_form = display_element.querySelector("#" + trial_form_id);
    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    if(trial.preamble !== null){
      trial_form.innerHTML += '<div id="'+preamble_id_name+'" class="'+preamble_id_name+'">'+trial.preamble+'</div>';
    }
    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {
        // create question container
        var question_classes = [_join(plugin_id_name, 'question')];
        if (trial.questions[i].horizontal) {
          question_classes.push(_join(plugin_id_name, 'horizontal'));
        }

        trial_form.innerHTML += '<div id="'+_join(plugin_id_name, i)+'" class="'+question_classes.join(' ')+'"></div>';

        var question_selector = _join(plugin_id_selector, i);

        // add question text
        display_element.querySelector(question_selector).innerHTML += '<p class="' + plugin_id_name + '-text survey-multi-choice-image">' + trial.questions[i].prompt + '</p>';

      // create option radio buttons
      for (var j = 0; j < trial.questions[i].options.length; j++) {
        var option_id_name = _join(plugin_id_name, "option", i, j),
        option_id_selector = '#' + option_id_name;

        // add radio button container
        display_element.querySelector(question_selector).innerHTML += '<div id="'+option_id_name+'" class="'+_join(plugin_id_name, 'option')+'"></div>';

        // add label and question text
        var form = document.getElementById(option_id_name)
        var input_name = _join(plugin_id_name, 'response', i);
        var input_id = _join(plugin_id_name, 'response', i, j);
        var label = document.createElement('label');
        label.setAttribute('class', plugin_id_name+'-text');
        //label.innerHTML = trial.questions[i].options[j];
        label.setAttribute('for', input_id)

        var img = document.createElement("IMG");
        img.setAttribute('class', plugin_id_name+'-text response_img');
        img.setAttribute("src", trial.questions[i].options[j]);
        label.appendChild(img);

        // create radio button
        var input = document.createElement('input');
        input.setAttribute('type', "radio");
        input.setAttribute('name', input_name);
        input.setAttribute('id', input_id);
        input.setAttribute('value', trial.questions[i].options[j]);
        input.style.display = 'none';
        input.setAttribute('onchange',"toggleRadioButton(this)");
        form.appendChild(label);
        form.insertBefore(input, label);
      }

      if (trial.questions[i].required) {
        // add "question required" asterisk
        display_element.querySelector(question_selector + " p").innerHTML += "<span class='required'>*</span>";

        // add required property
        display_element.querySelector(question_selector + " input[type=radio]").required = true;
      }
    }

    trial_form.innerHTML += '<input id="free_recall_input" type="text" />' + '<button id="mic_button"><img src="res/img/mic.png" width="40px"></button>';

    // add submit button
    trial_form.innerHTML += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';
    trial_form.addEventListener('submit', function(event) {
      event.preventDefault();
      var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
      for(var i=0; i<matches.length; i++){
        match = matches[i];
        var id = "Q" + i;
        if(match.querySelector("input[type=radio]:checked") !== null){
          var val = match.querySelector("input[type=radio]:checked").value;
        } else {
          var val = "";
        }
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trial_data = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };
      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trial_data);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();



function toggleRadioButton(element){

    var all_radio = document.querySelectorAll('input[name^="jspsych-survey-multi-choice-image"]');

    for (var i=0, max=all_radio.length; i < max; i++) {

      elt = all_radio[i];

      var img = elt.nextElementSibling.firstChild;
      elt.checked ? img.classList.add("selected_recall_item") : img.classList.remove("selected_recall_item");
    }

}



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

$("#mic_button").on( "click", function() {
  console.log('Ready to receive a color command.');
  $('#mic_button').addClass('mic_button_recording');
  recognition.start();
};

recognition.onresult = function(event) {
  var res = event.results[0][0].transcript;
  $("#free_recall_input").val(res);
/*  diagnostic.textContent = 'Result received: ' + color;
  bg.style.backgroundColor = color;*/
}