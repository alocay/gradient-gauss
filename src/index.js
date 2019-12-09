const DEFAULT_MAX_COLOR_VALUE = 255;
const DEFAULT_OUTPUT_FORMAT = 'rgba'

class GradientGauss {
    constructor(min, max, options) {
        if (!min || !max) {
            throw new Error('Minimum and maximum value range must be provided');
        }

        this.max = max;
        this.min = min;
        this.amplitude = (options && options.colorMax) || DEFAULT_MAX_COLOR_VALUE;
        this.outputFormat = (options && options.outputFormat) || DEFAULT_OUTPUT_FORMAT;
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
        let width = (this.max - this.min) / 2;

        let rcenter = this.min + this.max;
        let gcenter = this.min + (this.max * 0.25);
        let bcenter = this.min + (this.max * 0.5);

        let red = this.gaussFunction(value, this.amplitude, rcenter, width);
        let green = this.gaussFunction(value, this.amplitude, gcenter, width);
        let blue = this.gaussFunction(value, this.amplitude, bcenter, width);

        return this.formatOutput([red, green, blue, 255], ((options && options.outputFormat) || this.outputFormat));
    }
}

export default GradientGauss;
