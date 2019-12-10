import './style.css';
import React from 'react';
import update from 'immutability-helper';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import GradientGauss from '..';

export default class CanvasSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        this.ctx = null;
        this.imgData = null;

        this.state = {
            width: 600,
            height: 50,
            redCenterFactor: 1.0,
            greenCenterFactor: 0.5,
            blueCenterFactor: 0.25,
            widthDivisions: 5
        };
        
        this.gradient = new GradientGauss(0, this.state.width, { outputFormat: 'array' });
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        console.log(this.canvas.width);
        this.imgData = this.ctx.createImageData(this.state.width, this.state.height);
        this.paintGradient();
    }

    getIndex(x, y) {
        return (y * (this.state.width * 4)) + (x * 4);
    }
    
    paintColumn(color, x) {
        for (var y = 0; y < this.state.height; y++) {
            let index = this.getIndex(x, y);
            this.imgData.data[index] = color[0];
            this.imgData.data[index+1] = color[1];
            this.imgData.data[index+2] = color[2];
            this.imgData.data[index+3] = color[3];
        }
    }

    paintGradient() {
        if (!this.imgData) return;

        for (var i = 0; i < this.state.width; i++) {
            let color = this.gradient.getColor(i, this.state);
            this.paintColumn(color, i);
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
            <div id='sandbox'>
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


                <canvas width={this.state.width} height={this.state.height} ref={ref => (this.canvas = ref)} />
            </div>
        );
    }
}
