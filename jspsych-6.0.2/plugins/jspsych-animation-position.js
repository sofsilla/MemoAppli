/**
 * jsPsych plugin for showing animation-positions and recording keyboard responses
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 */

jsPsych.plugins["animation-position"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('animation-position', 'stimuli', 'image');

  plugin.info = {
    name: 'animation-position',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'The images to be displayed.'
      },
      frame_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Frame time',
        default: 250,
        description: 'Duration to display each image.'
      },
      frame_isi: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Frame gap',
        default: 0,
        description: 'Length of gap to be shown between each image.'
      },
      sequence_reps: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sequence repetitions',
        default: 1,
        description: 'Number of times to show entire sequence.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        array: true,
        description: 'Keys subject uses to respond to stimuli.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below stimulus.'
      },
      img_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Img_Size',
        default: 7,
        description: 'Size of the images.'
      },
      img_margin: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Img_Margin',
        default: null,
        description: 'Margin of the images.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var interval_time = trial.frame_time + trial.frame_isi;
    var animate_frame = -1;
    var reps = 0;
    var startTime = (new Date()).getTime();
    var animation_sequence = [];
    var responses = [];
    var current_stim = "";


    anime_function();

    var animate_interval = setInterval(anime_function, interval_time);

    function anime_function(){
      var showImage = true;
      display_element.innerHTML = ''; // clear everything
      animate_frame++;
      if (animate_frame == trial.stimuli.length) {
        animate_frame = 0;
        reps++;
        if (reps >= trial.sequence_reps) {
          endTrial();
          clearInterval(animate_interval);
          showImage = false;
        }
      }
      if (showImage) {
        show_next_frame();
      }
    
    }

    function show_next_frame() {
      // show image
      var cssstr = "position: absolute;"
                   + "margin: auto;"
                   + "height: "+trial.img_size*10/2+"%;"
                   /*+ "height: "+trial.img_size+"em;"*/;

      var distance_h = 40 - Math.floor(Math.random() * (trial.img_margin - 1 + 1) + 1);

      var h_class = "";
      switch(getRandomInt(3)) {
        case 0 :
          cssstr += "left: "+ distance_h +"%;";
          break;
        case 1 :
          cssstr += "right: "+ distance_h +"%;";
          break;
        case 2 : 
          cssstr += "left: 0 ;";
          cssstr += "right: 0 ;";
          break;
      }

      var distance_v = 40 - Math.floor(Math.random() * (trial.img_margin - 1 + 1) + 1);

      switch(getRandomInt(3)) {
        case 0 :
          cssstr += "top: "+ distance_v +"%;";
          //cssstr += "bottom: "+ trial.img_margin +"%;";
          break;
        case 1 :
          cssstr += "bottom: "+ distance_v +"%;";
          //cssstr += "top: "+ trial.img_margin +"%;";
          break;
        case 2 :
          cssstr += "top: 0  ;";
          cssstr += "bottom: 0  ;";
          break;
      }

      display_element.innerHTML = "<div style = 'height: 100%;  width: 100%;  position: relative;'>"
      + '<img src="'+trial.stimuli[animate_frame]+'" style="'+cssstr+'" id="jspsych-animation-position-image"></img>'
      + '</div>'

      current_stim = trial.stimuli[animate_frame];

      // record when image was shown
      animation_sequence.push({
        "stimulus": trial.stimuli[animate_frame],
        "time": (new Date()).getTime() - startTime
      });

      if (trial.prompt !== null) {
        display_element.innerHTML += trial.prompt;
      }

      if (trial.frame_isi > 0) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-animation-position-image').style.visibility = 'hidden';
          current_stim = 'blank';
          // record when blank image was shown
          animation_sequence.push({
            "stimulus": 'blank',
            "time": (new Date()).getTime() - startTime
          });
        }, trial.frame_time);
      }
    }

    var after_response = function(info) {

      responses.push({
        key_press: info.key,
        rt: info.rt,
        stimulus: current_stim
      });

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-animation-position-image').className += ' responded';
    }

    // hold the jspsych response listener object in memory
    // so that we can turn off the response collection when
    // the trial ends
    var response_listener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'date',
      persist: true,
      allow_held_key: false
    });

    function endTrial() {

      jsPsych.pluginAPI.cancelKeyboardResponse(response_listener);

      var trial_data = {
        "animation_sequence": JSON.stringify(animation_sequence),
        "responses": JSON.stringify(responses)
      };

      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
