import assert from 'assert';
import chai from 'chai';
import GradientGauss from '../lib/index.js'

const should = chai.should();
const expect = chai.expect;

it('should throw an error if min and max are not provided when constructed', function() {
    expect(() => new GradientGauss()).to.throw(Error, 'Minimum and maximum value range must be provided');
});

it('should have default value set when constructed', function(){
    let gradient = new GradientGauss(1, 100);
    gradient.valueMax.should.equal(100);
    gradient.valueMin.should.equal(1);
    gradient.format.should.equal(gradient.DefaultOutputFormat);
    gradient.maxColorValue.should.equal(gradient.DefaultMaxColorValue);
    gradient.redCenterPct.should.equal(gradient.DefaultRedCenterFactor);
    gradient.greenCenterPct.should.equal(gradient.DefaultGreenCenterFactor);
    gradient.blueCenterPct.should.equal(gradient.DefaultBlueCenterFactor);
    gradient.widthDiv.should.equals(gradient.DefaultWidthDivisions);
});

it('should use passed in options when provided and defaults when not', function() {
    let options = {
        colorMax: 200,
        outputFormat: 'foo'
    };

    let gradient = new GradientGauss(1, 100, options);

    gradient.valueMax.should.equal(100);
    gradient.valueMin.should.equal(1);
    gradient.maxColorValue.should.equal(options.colorMax);
    gradient.format.should.equal(options.outputFormat);
    gradient.redCenterPct.should.equal(gradient.DefaultRedCenterFactor);
    gradient.greenCenterPct.should.equal(gradient.DefaultGreenCenterFactor);
    gradient.blueCenterPct.should.equal(gradient.DefaultBlueCenterFactor);
    gradient.widthDiv.should.equals(gradient.DefaultWidthDivisions);

});

it('should use passed in options when constructed', function() {
    let options = {
        colorMax: 200,
        outputFormat: 'foo',
        redCenterFactor: 0.5,
        greenCenterFactor: 1.0,
        blueCenterFactor: 0.1,
        rangeDivisor: 2
    };

    let gradient = new GradientGauss(1, 100, options);

    gradient.valueMax.should.equal(100);
    gradient.valueMin.should.equal(1);
    gradient.maxColorValue.should.equal(options.colorMax);
    gradient.format.should.equal(options.outputFormat);
    gradient.redCenterPct.should.equal(options.redCenterFactor);
    gradient.greenCenterPct.should.equal(options.greenCenterFactor);
    gradient.blueCenterPct.should.equal(options.blueCenterFactor);
    gradient.widthDiv.should.equals(options.rangeDivisor);
});

it('should format the output to rgba if the format is set to rgba', function() {
    let colorArray = [100,50,25,255];
    let expected = 'rgba(100, 50, 25, 255)';

    let gradient = new GradientGauss(1, 100);
    gradient.formatOutput(colorArray, 'rgba').should.equal(expected);
});

it('should format the output to an array if the format is to array', function() {
    let colorArray = [50,50,40,255];
    let gradient = new GradientGauss(1, 100);
    gradient.formatOutput(colorArray, 'array').should.equal(colorArray);
});

it('should return the appropriate color for a given value', function() {
    let options = { outputFormat: 'array' };
    let expected = [9, 255, 122, 255];

    let gradient = new GradientGauss(1, 100, options);
    gradient.getColor(50).should.eql(expected);
});

it ('should allow for min and max changes when getting a color', function() {
    let options = { outputFormat: 'array' };
    let expected = [9, 255, 122, 255];
    let expectedNewMax = [254, 13, 0, 255];

    let gradient = new GradientGauss(1, 100, options);
    gradient.getColor(50).should.eql(expected);
    gradient.getColor(50, { max: 50 }).should.eql(expectedNewMax);
});
