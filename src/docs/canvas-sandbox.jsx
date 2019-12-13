import './style.css';
import React from 'react';
import update from 'immutability-helper';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { Stage, Layer, Line } from 'react-konva';
import GradientGauss from '..';

const DEFAULT_CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 50;

export default class CanvasSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        this.container = null;
        this.layer = null;
        this.ctx = null;
        this.imgData = null;

        this.state = {
            min: 0,
            max: DEFAULT_CANVAS_WIDTH,
            containerWidth: 0,
            redCenterFactor: 1.0,
            greenCenterFactor: 0.5,
            blueCenterFactor: 0.1,
            redDivisor: 5,
            greenDivisor: 5,
            blueDivisor: 5
        };
        
        this.gradient = null; 
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');

        window.addEventListener("resize", this.resized.bind(this));

        this.gradient = new GradientGauss(0, this.getCanvasWidth(), { outputFormat: 'array' });
        this.setState({ max: this.getCanvasWidth(), containerWidth: this.container.clientWidth }, function () {
            this.imgData = this.ctx.createImageData(this.getCanvasWidth(), CANVAS_HEIGHT);
            this.paintGradient();        
        });
    }

    getCanvasWidth() {
        return this.canvas && this.canvas.width > 0 ? this.canvas.width : (this.container ? this.container.clientWidth : DEFAULT_CANVAS_WIDTH);
    }

    resized() {
        this.setState({ max: this.getCanvasWidth(), containerWidth: this.container.clientWidth }, function() {
            this.imgData = this.ctx.createImageData(this.getCanvasWidth(), CANVAS_HEIGHT);
            this.paintGradient();
        });
    }

    getIndex(x, y) {
        return (y * (this.getCanvasWidth() * 4)) + (x * 4);
    }
   
    paintColumn(color, x, imgData) {
        for (var y = 0; y < CANVAS_HEIGHT; y++) {
            let index = this.getIndex(x, y);
            imgData.data[index] = color[0];
            imgData.data[index+1] = color[1];
            imgData.data[index+2] = color[2];
            imgData.data[index+3] = color[3];
        }
    }

    paintGradient() {
        if (!this.imgData) return;

        for (var i = 0; i < this.getCanvasWidth(); i++) {
            let color = this.gradient.getColor(i, this.state);
            this.paintColumn(color, i, this.imgData);
        }
 
        this.ctx.putImageData(this.imgData, 0, 0);
    }

    onCenterFactorChanged(channel, evt, value) {
        switch (channel) {
            case 'red':
                this.setState({ redCenterFactor: value });
                break;
            case 'green':
                this.setState({ greenCenterFactor: value });
                break;
            case 'blue':
                this.setState({ blueCenterFactor: value });
                break;
        }
    }

    onDivisionsChanged(channel, evt, value) {
        switch (channel) {
            case 'red':
                this.setState({ redDivisor: value });
                break;
            case 'green':
                this.setState({ greenDivisor: value });
                break;
            case 'blue':
                this.setState({ blueDivisor: value });
                break;
            default:
                this.setState({ rangeDivisor: value });
                break;
        }
    }

    getColorFactorSlider(value, color) {
        return (
            <Slider 
                value={value} 
                valueLabelDisplay="auto" 
                min={0.1}
                max={1.0}
                step={0.05}
                onChange={this.onCenterFactorChanged.bind(this, color)} />
        );
    }

    getDivisorSlider(value, color) {
        return (
            <Slider
                value={value}
                valueLabelDisplay="auto"
                min={0.1}
                max={10}
                step={0.1}
                onChange={this.onDivisionsChanged.bind(this, color)} />
        );
    }

    getCurves() {
        if (!this.gradient) return null;

        let threshold = 15;
        let rpoints = [], gpoints = [], bpoints = [];
        for (var i = 0; i < this.getCanvasWidth(); i++) {
            let color = this.gradient.getColor(i, this.state);
           
            let revRed = this.gradient.maxColorValue - color[0];
            let revGreen = this.gradient.maxColorValue - color[1];
            let revBlue = this.gradient.maxColorValue - color[2];

            if (color[0] > threshold)
                rpoints.push(i, revRed)
            
            if (color[1] > threshold)
                gpoints.push(i, revGreen);
            
            if (color[2] > threshold)
                bpoints.push(i, revBlue);
        }

        return (
            <React.Fragment>
                <Line 
                    points={rpoints}
                    stroke='red'
                    strokeWidth={3} />

                <Line 
                    points={gpoints}
                    stroke='green'
                    strokeWidth={3} />

                <Line 
                    points={bpoints}
                    stroke='blue'
                    strokeWidth={3} />
            </React.Fragment>
        );
    }

    render() {
        this.paintGradient();

        return (
            <div id='sandbox' ref={ref => (this.container = ref)}>
                <Typography gutterBottom>
                    Red channel center factor
                </Typography>
               
                {this.getColorFactorSlider(this.state.redCenterFactor, 'red')}
                
                <Typography gutterBottom>
                    Green channel center factor
                </Typography>
                
                {this.getColorFactorSlider(this.state.greenCenterFactor, 'green')}

                <Typography gutterBottom>
                    Blue channel center factor
                </Typography>
            
                {this.getColorFactorSlider(this.state.blueCenterFactor, 'blue')}

                <Typography gutterBottom>
                    Red divisor
                </Typography>
                
                {this.getDivisorSlider(this.state.redDivisor, 'red')}

                <Typography gutterBottom>
                    Green divisor
                </Typography>
                
                {this.getDivisorSlider(this.state.greenDivisor, 'green')}

                <Typography gutterBottom>
                    Blue divisor
                </Typography>
                
                {this.getDivisorSlider(this.state.blueDivisor, 'blue')}

                <canvas id="canvas" width={this.state.containerWidth} height={CANVAS_HEIGHT} ref={ref => (this.canvas = ref)} />

                <Stage width={this.state.containerWidth} height={300} borderWidth={3}>
                     <Layer offsetY={-5}>
                        {this.getCurves()}
                    </Layer>
                </Stage>
            </div>
        );
    }
}
