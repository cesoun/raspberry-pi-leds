/*
 * I have my LEDs setup on pins:
 *
 * Ground 	-  9
 * Red 		- 11 (GPIO 17)
 * Green 	- 13 (GPIO 27)
 * Blue		- 15 (GPIO 22)
 */

const Gpio = require('pigpio').Gpio;

const PIN_RED = new Gpio(17, { mode: Gpio.OUTPUT });
const PIN_GREEN = new Gpio(27, { mode: Gpio.OUTPUT });
const PIN_BLUE = new Gpio(22, { mode: Gpio.OUTPUT });

// variables for storing the r, g, b values
let r, g, b;
r = g = b = 0;

// async main.
(async () => {
	await smoothColorShift();
	console.log('Shutting down...');
})();

/**
 * Smooth shift through colors with set values.
 * @returns {Promise<void>}
 */
async function smoothColorShift() {
	await smoothSetColor(255, 0, 0, 0);    	// red
	await smoothSetColor(0, 255, 0, 1);    	// green
	await smoothSetColor(0, 0, 255, 2);    	// blue
	await smoothSetColor(255, 255, 0, 3);  	// yellow
	await smoothSetColor(80, 0, 80, 4);    	// purple
	await smoothSetColor(0, 255, 255, 5);  	// aqua
	await smoothSetColor(0, 0, 0, 6); 		// off
}

/**
 * Adjust the colors of the leds based on values and a given ms time.
 * @param red Red value 0 - 255
 * @param green Green value 0 - 255
 * @param blue Blue value 0 - 255
 * @param ms Milliseconds between loop intervals
 * @returns {Promise<void>}
 */
async function smoothSetColor(red, green, blue, ms) {
	if (red < 0) red = 0;
	else if (red > 255) red = 255;

	if (green < 0) green = 0;
	else if (green > 255) green = 255;

	if (blue < 0) blue = 0;
	else if (blue > 255) blue = 255;

	if (ms < 0) ms = 0;

	while (r != red || g != green || b != blue) {
		if (r < red) r += 1;
		else if (r > red) r -= 1;

		if (g < green) g += 1;
		else if (g > green) g -= 1;

		if (b < blue) b += 1;
		else if (b > blue) b -= 1;

		_setColor();

		if (ms === 0) continue;
		await sleep(ms);
	}
}

/**
 * Pause application runtime for a given ms duration.
 * @param ms Milliseconds to wait
 * @returns {Promise<unknown>}
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper function to write the color to the pins.
 * @private
 */
function _setColor() {
	PIN_RED.pwmWrite(r);
	PIN_GREEN.pwmWrite(g);
	PIN_BLUE.pwmWrite(b);
}

/**
 * Cleanup function for turning off the leds when shutting down.
 * If this doesn't run they just stay on and you are blinded.
 * @param opts
 * @param code
 */
function cleanup(opts, code) {
	PIN_RED.pwmWrite(0);
	PIN_GREEN.pwmWrite(0);
	PIN_BLUE.pwmWrite(0);

	if (code) console.log(code);
	if (!opts) return;
	if (opts.exit) process.exit(code);
}

// Register the cleanup function for shutdown events.
process.on('exit', cleanup.bind(null, null));
process.on('SIGINT', cleanup.bind(null, {exit:true}));
process.on('SIGUSR1', cleanup.bind(null, {exit:true}));
process.on('SIGUSR2', cleanup.bind(null, {exit:true}));
process.on('uncaughtException', cleanup.bind(null, {exit:true}));
