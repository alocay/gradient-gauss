# gradient-gauss
A JavaScript library to convert a number range to a set of colors using a [Gaussian function](https://en.wikipedia.org/wiki/Gaussian_function).

[Simple demo](https://alocay.github.io/gradient-gauss/) showing the changes the gradient when certain parameters are tweaked.

[![Build Status](https://travis-ci.org/alocay/gradient-gauss.svg?branch=master)](https://travis-ci.org/alocay/gradient-gauss)
[![npm version](https://badge.fury.io/js/gradient-gauss.svg)](https://badge.fury.io/js/gradient-gauss)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/alocay/gradient-gauss)

## Getting Started
Download the package via NPM 
```
npm install gradient-gauss 
```

`import GradientGauss from 'gradient-gauss`   

or
 
`const GradientGauss = require('gradient-gauss');`

## Examples


```js
let gradient = new GradientGauss(1, 100); // Instantiate gradient gauss with a range of  1-100
let color = gradient.getColor(50); // Get the color for value 50
```           

Options can be provided to GradientGauss to modify the behavior when calculating the colors. The following are the values that can be provided via the options:

* `min`:               the minimum value of your range
* `max`:               the maximum value of your range
* `outputFormat`:      the result format of the color. Options are either `'rgba'` (for an rgba string) or `'array'` (for an array in the format [r,g,b,a])
* `redCenterFactor`:   the location of the red bell curve center within the range provided
* `blueCenterFactor`:  the location of the blue bell curve center withiin the range provided
* `greenCenterFactor`: the location of the green bell curve center withini the range provided
* `rangeDivisor`:      the number by which the number range will be divided the color bell curve widths

**Note:** The min and max options are not be used during instantiation. Check the [documentation](https://github.com/alocay/gradient-gauss-docs.md) for more information on the options and default values.

```js
options = {
    outputFormat: 'array',
    rangeDivisor: 4
};

let gradient = new GradientGauss(1, 100, options);
```
Options can also be provided to the `getColors` function as one-time overrides. For permanent changes to the values, provide those options during instantiation.
```
options = {
   max: 50,
};

new GradientGauss(1, 100).getColor(25, options);
```
Refer to the documentation for more information.

## Documentation
[Basic documentation](https://github.com/alocay/gradient-gauss-docs.md)  
More to come.

## License
Licensed under the MIT license.

