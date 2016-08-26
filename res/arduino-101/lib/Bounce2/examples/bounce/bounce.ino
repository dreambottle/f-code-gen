
/* 
 DESCRIPTION
 ====================
 Simple example of the Bounce library that switches the debug LED when a button is pressed.
 */
// Include the Bounce2 library found here :
// https://github.com/thomasfredericks/Bounce-Arduino-Wiring
#include "Bounce2.h"

#define BUTTON_PIN 2
#define LED_PIN 9

// Instantiate a Bounce object
Bounce debouncer = Bounce();
int state; 

void setup() {

  // Setup the button with an internal pull-up :
  pinMode(BUTTON_PIN,INPUT_PULLUP);

  // After setting up the button, setup the Bounce instance :
  debouncer.attach(BUTTON_PIN);
  debouncer.interval(5); // interval in ms
  debouncer.update();

  //Setup the LED :
  pinMode(LED_PIN,OUTPUT);
  state = debouncer.read();

}

void loop() {
  // Update the Bounce instance :
  debouncer.update();

  // Get the updated value :
  int value = debouncer.read();
  if (value != state) {
    state = value;
    digitalWrite(LED_PIN, state);
  }
  // Turn on or off the LED as determined by the state :
//  if ( value == LOW ) {
//    digitalWrite(LED_PIN, HIGH );
//  } 
//  else {
//    digitalWrite(LED_PIN, LOW );
//  }

}


