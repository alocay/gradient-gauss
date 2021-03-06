const DEFAULT_MAX_COLOR_VALUE = 255;
const DEFAULT_OUTPUT_FORMAT = 'rgba'
const DEFAULT_RED_CENTER_FACTOR = 1.0;
const DEFAULT_GREEN_CENTER_FACTOR = 0.5;
const DEFAULT_BLUE_CENTER_FACTOR = 0.25;
const DEFAULT_WIDTH_DIVISIONS = 5;
const MINIMUM_RMS_WIDTH = 1;
const MINIMUM_DIVISOR = 0.1;

/**
 * A GradientGauss object
 * @param {number} min The minimum value of your range
 * @param {number} max The maxiumum value of your range
 * @param {Object} [options=null] Options to customize the gradient
 * @param {number} [options.colorMax=255] The maximum color value
 * @param {String} [options.outputFormat='rgba'] The output format
 * @param {number} [options.redCenterFactor=1.0] The percentage of the range where the red center should be located
 * @param {number} [options.greenCenterFactor=0.5] The percentage of the range where the green center should be located
 * @param {number} [options.blueCenterFactor=0.25] The percentage of the range where the blue center should be located
 * @param {number} [options.rangeDivisor=5] The number by which the range will be divided to determine the color curve width for all colors. 
 * @param {number} [options.redDivisor=null] The number by with the range will be divided to determine the red color curve width. Will override rangeDivisor.
 * @param {number} [options.greenDivisor=null] The number by with the range will be divided to determine the green color curve width. Will override rangeDivisor.
 * @param {number} [options.blueDivisor=null] The number by with the range will be divided to determine the blue color curve width. Will override rangeDivisor.
 */
class GradientGauss {
    constructor(min, max, options) {
        if ((min !== 0 && !min) || (max !== 0 && !max)) {
            throw new Error('Minimum and maximum value range must be provided');
        }

        this.max = max;
        this.min = min;
        this.amplitude = this.getOptionOrDefault(options, 'colorMax', DEFAULT_MAX_COLOR_VALUE);
        this.outputFormat = this.getOptionOrDefault(options, 'outputFormat', DEFAULT_OUTPUT_FORMAT);
        this.redCenterFactor = this.getOptionOrDefault(options, 'redCenterFactor', DEFAULT_RED_CENTER_FACTOR);
        this.greenCenterFactor = this.getOptionOrDefault(options, 'greenCenterFactor', DEFAULT_GREEN_CENTER_FACTOR);
        this.blueCenterFactor = this.getOptionOrDefault(options, 'blueCenterFactor', DEFAULT_BLUE_CENTER_FACTOR);
        this.widthDivisions = this.getOptionOrDefault(options, 'rangeDivisor', DEFAULT_WIDTH_DIVISIONS);
        this.redDivisor = this.getOptionOrDefault(options, 'redDivisor', null);
        this.greenDivisor = this.getOptionOrDefault(options, 'greenDivisor', null);
        this.blueDivisor = this.getOptionOrDefault(options, 'blueDivisor', null);
    }
    
    /**
     * @private
     * Gets the default max color value
     * @returns {number} the default max color value
     */
    get DefaultMaxColorValue() {
        return DEFAULT_MAX_COLOR_VALUE;
    }

    /**
     * @private
     * Gets the default output format
     * @returns {String} the default output format
     */
    get DefaultOutputFormat() {
        return DEFAULT_OUTPUT_FORMAT;
    }

    /**
     * @private
     * Gets the default red center factor
     * @returns {number} the default center factor
     */
    get DefaultRedCenterFactor() {
        return DEFAULT_RED_CENTER_FACTOR;
    }
    
    /**
     * @private
     * Gets the default green center factor
     * @returns {number} the default center factor
     */
    get DefaultGreenCenterFactor() {
        return DEFAULT_GREEN_CENTER_FACTOR;
    }
    
    /**
     * @private
     * Gets the default blue center factor
     * @returns {number} the default center factor
     */
    get DefaultBlueCenterFactor() {
        return DEFAULT_BLUE_CENTER_FACTOR;
    }
   
    /**
     * @private
     * Gets the default width divisions
     * @returns {number} the default width divisions
     */
    get DefaultWidthDivisions() {
        return DEFAULT_WIDTH_DIVISIONS;
    }

    /**
     * @private
     * Gets the max color value
     * @returns {number} the max color value
     */
    get maxColorValue() {
        return this.amplitude;
    }

    /**
     * @private
     * Gets the output format
     * @returns {String} the output format
     */
    get format() {
        return this.outputFormat;
    }

    /**
     * @private
     * Gets the maximum value stored during construction
     * @returns {number} the maximum value
     */
    get valueMax() {
        return this.max; 
    }

    /**
     * @private
     * Gets the minimum value stored during construction
     * @returns {number} the minimum value
     */
    get valueMin() {
        return this.min;
    }

    /**
     * @private
     * Gets the red center factor
     * @returns {number} the red center factor
     */
    get redCenterPct() {
        return this.redCenterFactor;
    }

    /**
     * @private
     * Gets the green center factor
     * @returns {number} the green center factor
     */
    get greenCenterPct() {
        return this.greenCenterFactor;
    }

    /**
     * @private
     * Gets the blue center factor
     * @returns {number} the blue center factor
     */
    get blueCenterPct() {
        return this.blueCenterFactor;
    }

    /**
     * @private
     * Gets the width divisions
     * @returns {number} the width divisions
     */
    get widthDiv() {
        return this.widthDivisions;
    }

    /**
     * @private
     * Gets and returns the value from the options object (with the given property) or the default value
     * @param {Object} options the options object
     * @param {String} property the property name
     * @param {any} defaultValue a default value to return if one isn't found
     * @returns either the value from the options object or the default value
     */
    getOptionOrDefault(options, property, defaultValue) {
        return (options && options[property]) || defaultValue;
    }

    /**
     * @private
     * The gaussian function to calculate the color value
     * @param {number} value the value (the x-value)
     * @param {number} amplitude the curve peak
     * @param {number} center the curve center
     * @param {number} rmsWidth the curve width
     * @returns {number} the color value (the y-value)
     */
    gaussFunction(value, amplitude, center, rmsWidth) {
        let numerator = Math.pow(value - center, 2);
        let denominator = 2 * Math.pow(rmsWidth, 2);
        let exp = -1 * (numerator / denominator);
        let curve = Math.pow(Math.E, exp);
        return Math.round(curve * amplitude);
    }

    /**
     * @private
     * Formats the result color to either an array or rgba string
     */
    formatOutput(colorArray, outputFormat) {
        switch (outputFormat) {
            case 'rgba':
                return `rgba(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]}, ${colorArray[3]})`;
            case 'array':
                return colorArray;
        }
    }

    /**
     * Gets the color associated with th given value
     * @name getColor
     * @param {number} value The number to get the associated color value
     * @param {Object} [options=null] One time option overrides to customize the gradient. Permanent options values should be set during construction. See {@link GradientGauss} options documentation for other options available besides the ones listed below. 
     * @param {number} [options.max=null] The max range value
     * @param {number} [options.min=null] The min range value
     * @returns The color in either rgba string format or array format
     */
    getColor(value, options) {
        let widthDivisions = this.getOptionOrDefault(options, 'rangeDivisor', this.widthDivisions);
        let redFactor = this.getOptionOrDefault(options, 'redCenterFactor', this.redCenterFactor);
        let greenFactor = this.getOptionOrDefault(options, 'greenCenterFactor', this.greenCenterFactor);
        let blueFactor = this.getOptionOrDefault(options, 'blueCenterFactor', this.blueCenterFactor);
        let min = this.getOptionOrDefault(options, 'min', this.min);
        let max = this.getOptionOrDefault(options, 'max', this.max);
        let amplitude = this.getOptionOrDefault(options, 'colorMax', this.amplitude);
        let outputFormat = this.getOptionOrDefault(options, 'outputFormat', this.outputFormat);

        let redDivisor = Math.max(this.getOptionOrDefault(options, 'redDivisor', widthDivisions), MINIMUM_DIVISOR);
        let greenDivisor = Math.max(this.getOptionOrDefault(options, 'greenDivisor', widthDivisions), MINIMUM_DIVISOR);
        let blueDivisor = Math.max(this.getOptionOrDefault(options, 'blueDivisor', widthDivisions), MINIMUM_DIVISOR);

        let rwidth = Math.max((max - min) / redDivisor, MINIMUM_RMS_WIDTH);
        let gwidth = Math.max((max - min) / greenDivisor, MINIMUM_RMS_WIDTH);
        let bwidth = Math.max((max - min) / blueDivisor, MINIMUM_RMS_WIDTH);
        let rcenter = min + (max * redFactor);
        let gcenter = min + (max * greenFactor);
        let bcenter = min + (max * blueFactor);

        let red = this.gaussFunction(value, amplitude, rcenter, rwidth);
        let green = this.gaussFunction(value, amplitude, gcenter, gwidth);
        let blue = this.gaussFunction(value, amplitude, bcenter, bwidth);

        return this.formatOutput([red, green, blue, 255], outputFormat);
    }
}

export default GradientGauss;
