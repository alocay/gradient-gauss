const DEFAULT_MAX_COLOR_VALUE = 255;
const DEFAULT_OUTPUT_FORMAT = 'rgba'
const DEFAULT_RED_CENTER_FACTOR = 1.0;
const DEFAULT_GREEN_CENTER_FACTOR = 0.5;
const DEFAULT_BLUE_CENTER_FACTOR = 0.25;
const DEFAULT_WIDTH_DIVISIONS = 5;

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
        this.widthDivisions = this.getOptionOrDefault(options, 'widthDivisions', DEFAULT_WIDTH_DIVISIONS);
    }
    
    get DefaultMaxColorValue() {
        return DEFAULT_MAX_COLOR_VALUE;
    }

    get DefaultOutputFormat() {
        return DEFAULT_OUTPUT_FORMAT;
    }

    get maxColorValue() {
        return this.amplitude;
    }

    get format() {
        return this.outputFormat;
    }

    get valueMax() {
        return this.max; 
    }

    get valueMin() {
        return this.min;
    }

    getOptionOrDefault(options, property, defaultValue) {
        return (options && options[property]) || defaultValue;
    }

    gaussFunction(value, amplitude, center, rmsWidth) {
        let numerator = Math.pow(value - center, 2);
        let denominator = Math.pow(2 * rmsWidth, 2);
        let exp = -1 * (numerator / denominator);
        let curve = Math.pow(Math.E, exp);
        return Math.round(curve * amplitude);
    }

    formatOutput(colorArray, outputFormat) {
        switch (outputFormat) {
            case 'rgba':
                return `rgba(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]}, ${colorArray[3]})`;
            case 'array':
                return colorArray;
        }
    }

    getColor(value, options) {
        let widthDivisions = this.getOptionOrDefault(options, 'widthDivisions', this.widthDivisions);
        let redFactor = this.getOptionOrDefault(options, 'redCenterFactor', this.redCenterFactor);
        let greenFactor = this.getOptionOrDefault(options, 'greenCenterFactor', this.greenCenterFactor);
        let blueFactor = this.getOptionOrDefault(options, 'blueCenterFactor', this.blueCenterFactor);
        let min = this.getOptionOrDefault(options, 'min', this.min);
        let max = this.getOptionOrDefault(options, 'max', this.max);

        let width = Math.max((max - min) / widthDivisions, 1);
        let rcenter = min + (max * redFactor);
        let gcenter = min + (max * greenFactor);
        let bcenter = min + (max * blueFactor);

        let red = this.gaussFunction(value, this.amplitude, rcenter, width);
        let green = this.gaussFunction(value, this.amplitude, gcenter, width);
        let blue = this.gaussFunction(value, this.amplitude, bcenter, width);

        return this.formatOutput([red, green, blue, 255], this.getOptionOrDefault(options, 'outputFormat', this.outputFormat));
    }
}

export default GradientGauss;
