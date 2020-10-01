# raspberry-pi-leds

This is a little side project I have going on using some `5050 SMD` LEDs.

I want to try and do some stuff with bluetooth audio and have the incoming
audio control the rate at which colors change and what not.

Might be cool to hook it up to a webserver to allow you to change the colors
or something as well but that's not an immediate focus for the time being.

## TODO

From what I can tell the libraries out there are all over the place so for the 
bluetooth part I might take a stab at building a C/C++ library and using that 
`node-addon-api`. 

If that doesn't work and bluetooth gets thrown out the i'll
come up with something else that achieves a similar desired result.