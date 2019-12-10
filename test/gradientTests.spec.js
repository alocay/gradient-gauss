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
});

it('should use passed in options when constructed', function() {
    let options = {
        colorMax: 200,
        outputFormat: 'foo'
    };

    let gradient = new GradientGauss(1, 100, options);

    gradient.valueMax.should.equal(100);
    gradient.valueMin.should.equal(1);
    gradient.maxColorValue.should.equal(options.colorMax);
    gradient.format.should.equal(options.outputFormat);
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
