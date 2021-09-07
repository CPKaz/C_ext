// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
LSTM Generator example with p5.js
This uses a pre-trained model on a corpus of Virginia Woolf
For more models see: https://github.com/ml5js/ml5-data-and-training/tree/master/models/charRNN
=== */
let starters = `love is;life is;hope is;freedom is;success is;when the going gets tough;
success comes;good things come;work hard and;live long and;at the worst of times;love like;
live like;the door to;the key to;tough times;fight like;true happiness;true freedom;an honest heart;
a good person;when you believe;when you believe in something;love conquers;fear;fear is;do not give up when; 
;nothing is;believe in;the future is;the past is;time is;money is;the most precious thing is;
when it feels like you have nothing;talent takes you;at the worst of times we learn;don t be afraid if;
what kills the mind more than anything;if love had wings;your true passion gives you;i ve been where no one has;
culture is;we live in a society;there is no such thing as;do whatever you feel;what is right;`.split(';');
let temps = [.25, .30, .35, .40, .45, .50, .55, .60, .65, .70, .75];
let charRNN;
let textInput;
let lengthSlider;
let tempSlider;
let button;
let runningInference = false;

function setup() {
  noCanvas();

  // Create the LSTM Generator passing it the model directory
  charRNN = charRNN = ml5.charRNN('https://raw.githubusercontent.com/CPKaz/ml_ext/master/quotes_data_2/', modelReady);

  // Grab the DOM elements
  textInput = select('#textInput');
  lengthSlider = select('#lenSlider');``
  tempSlider = select('#tempSlider');
  button = select('#generate');

  // DOM element events
  button.mousePressed(generate);
  lengthSlider.input(updateSliders);
  tempSlider.input(updateSliders);
}

// Update the slider values
function updateSliders() {
  select('#length').html(lengthSlider.value());
  select('#temperature').html(tempSlider.value());
}

function modelReady() {
  select('#status').html('Model Loaded');
}

// Generate new text
function generate() {
  // prevent starting inference if we've already started another instance
  // TODO: is there better JS way of doing this?
 if(!runningInference) {
    runningInference = true;

    // Update the status log
    select('#status').html('Generating...');

    // Grab the original text
    let original = textInput.value();
    // Make it to lower case
    let txt = original.toLowerCase();

    // Check if there's something to send
    if (txt.length > 0) {
      // This is what the LSTM generator needs
      // Seed text, temperature, length to outputs
      // TODO: What are the defaults?
      let data = {
        seed: txt,
        temperature: tempSlider.value(),
        length: lengthSlider.value()
      };

      // Generate text with the charRNN
      charRNN.generate(data, gotData);

      // When it's done
      function gotData(err, result) {
        out = result.sample
        txt = txt.charAt(0).toUpperCase() + txt.slice(1);
        out.replace(' s[ ,.]', '\'s')
        out.replace(' t[ ,.]', '\'t')
        out.replace(' re[,. ]', '\'re')
        out.replace(' ve[,. ]', '\'ve')
        // Update the status log
        select('#status').html('Ready!');
        select('#result').html(txt + out);
        runningInference = false;
      }
    }
  }
}