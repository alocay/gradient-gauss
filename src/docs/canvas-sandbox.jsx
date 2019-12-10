import './style.css';
import React from 'react';
import update from 'immutability-helper';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
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
            blueCenterFactor: 0.25,
            widthDivisions: 5
        };
        
        this.gradient = null; 
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');

        window.addEventListener("resize", this.resized.bind(this));

        this.setState({ max: this.getCanvasWidth(), containerWidth: this.container.clientWidth }, function () {
            this.gradient = new GradientGauss(0, this.getCanvasWidth(), { outputFormat: 'array' });
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

    onDivisionsChanged(evt, value) {
        this.setState({ widthDivisions: value });
    }

    render() {
        this.paintGradient();

        return (
            <div id='sandbox' ref={ref => (this.container = ref)}>
                <Typography gutterBottom>
                    Red channel center factor
                </Typography>
                
                <Slider 
                    value={this.state.redCenterFactor} 
                    valueLabelDisplay="auto" 
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    onChange={this.onCenterFactorChanged.bind(this, 'red')} />
                
                <Typography gutterBottom>
                    Green channel center factor
                </Typography>
                
                <Slider 
                    value={this.state.greenCenterFactor} 
                    valueLabelDisplay="auto" 
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    onChange={this.onCenterFactorChanged.bind(this, 'green')} />

                <Typography gutterBottom>
                    Blue channel center factor
                </Typography>
                
                <Slider 
                    value={this.state.blueCenterFactor} 
                    valueLabelDisplay="auto" 
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    onChange={this.onCenterFactorChanged.bind(this, 'blue')} />


                <Typography gutterBottom>
                    Width divisions
                </Typography>
                
                <Slider 
                    value={this.state.widthDivisions} 
                    valueLabelDisplay="auto" 
                    min={1}
                    max={10}
                    step={1}
                    onChange={this.onDivisionsChanged.bind(this)} />

                <canvas id="canvas" width={this.state.containerWidth} height={CANVAS_HEIGHT} ref={ref => (this.canvas = ref)} />
            </div>
        );
    }
}
