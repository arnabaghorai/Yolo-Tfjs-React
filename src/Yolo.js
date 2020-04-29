import React, { Component } from 'react'
import yolo from 'tfjs-yolo'
import Loader from './components/Loader'
import {Button,Tabs,Tab,Dropdown,DropdownButton} from 'react-bootstrap'
import './styles/style.css';

 



export default class Yolo extends Component {

    
        videoRef = React.createRef();
        canvasRef = React.createRef();
        mystream = null
        state={
            loading:true,
            model_loaded:true,
        }


    styles = {
      position: 'fixed',
      borderRadius: "5px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",

    };
  
  
    detectFromVideoFrame = (model, video) => {
      model.predict(video,{ scoreThreshold:0.2 }).then(predictions => {
        this.showDetections(predictions);
  
        requestAnimationFrame(() => {
          this.detectFromVideoFrame(model, video);
        });
      }, (error) => {
        console.log("Couldn't start the webcam")
        console.error(error)
      });
    };
  
    showDetections = predictions => {
      const ctx = this.canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const font = "24px helvetica";
      ctx.font = font;
      ctx.textBaseline = "top";
  
      predictions.forEach(prediction => {
          console.log(prediction);

          


        const x = prediction.left;
        const y = prediction.top;
        const width = prediction.right - prediction.left ;
        const height = prediction.bottom - prediction.top;
        // Draw the bounding box.
        ctx.strokeStyle = "#b86b77";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = "#b86b77";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 5);
        // draw top left rectangle
        ctx.fillRect(x, y, textWidth + 5, textHeight + 5);
        // draw bottom left rectangle
        ctx.fillRect(x, y + height - textHeight, textWidth + 5, textHeight + 5);
  
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(prediction.class, x, y);
        ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
      });
    };
  
    componentDidMount() {
      if (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia) {
        // define a Promise that'll be used to load the webcam and read its frames
        const webcamPromise = navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: false,
          })
          .then(stream => {
            // pass the current frame to the window.stream
            window.stream = stream;
            // pass the stream to the videoRef
            this.videoRef.current.srcObject = stream;

            this.mystream = stream;
  
            return new Promise(resolve => {
              this.videoRef.current.onloadedmetadata = () => {
                resolve();
              };
            });
          }, (error) => {
            console.log("Couldn't start the webcam")
            console.error(error)
          });
  
        // define a Promise that'll be used to load the model
        // const loadlModelPromise = cocoSsd.load();


        const loadlModelPromise =yolo.v3tiny()

        
        
        // resolve all the Promises
        Promise.all([loadlModelPromise, webcamPromise])
          .then(values => {
            this.setState({

                model_loaded: true,
                loading:false
              });
              this.model = values[0];
            this.detectFromVideoFrame(values[0], this.videoRef.current);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }

    componentWillUnmount() {
      this.mystream.getTracks().forEach(track => track.stop());
      window.stream.getTracks().forEach(track => track.stop());

    }

    async load(mode){
        if(this.model){
            this.model.dispose()
        }
        this.setState({
          loading: true
        });
          if(mode === "v3"){
            console.log("Tiny Yolo-v3 ")
            this.model = await yolo.v3tiny();
            this.setState({
              loading: true
            });

          }
          if(mode === "v2"){
            console.log("Tiny Yolo-v2 ")
            this.model = await yolo.v2tiny();
            this.setState({
              loading: true
            });

          }
          if(mode === "v1"){
            console.log("Tiny Yolo-v1 ")
            this.model = await yolo.v1tiny();
            this.setState({
              loading: true
            });

          }

          if(mode === "yolo"){
            console.log("Yolo-v3 ")
            this.model = await yolo.v3();
            this.setState({
              loading: true
            });

          }

            
        console.log('Model loaded')
        this.setState({

                  model_loaded: true,
                  loading:false
                });
        this.detectFromVideoFrame(this.model, this.videoRef.current);
       

      }

  
    // here we are returning the video frame and canvas to draw,
    // so we are in someway drawing our video "on the go"
    render() {
      return (
          <>
          {/* <div className={vidStyles.container}>


                <div style={{backgroundColor:"#EAE6ED"}}>
                <Tabs defaultActiveKey="home" transition={false} id="noanim-tab-example">
                    <Tab eventKey="home" title="Home">
                        <p>myyy</p>
                        <div>
                        <Button variant="dark"  onClick={()=>{this.load('yolo')}} >YOLOv3 (236MB)</Button>{' '}
                        <Button variant="dark"  onClick={()=>{this.load('v1')}} >Tiny YOLOv1 (60MB)</Button>{' '}
                        <Button variant="dark"onClick={()=>{this.load('v2')}} >Tiny YOLOv2 (43MB)</Button>{' '}
                        <Button variant="dark"onClick={()=>{this.load('v3')}} >Tiny YOLOv3 (34MB)</Button>{' '}
                    </div>
                                        <div className={vidStyles.vid}>
                        <video
                                style={this.styles}
                                autoPlay
                                muted
                                ref={this.videoRef}
                                // width="720"
                                // height="500"
                            />
                            <canvas style={this.styles} ref={this.canvasRef} 
                            //   width="720" height="500" 
                />
                </div>
                </Tab>
                <Tab eventKey="profile" title="Profile">
                    <p>yooo</p>
                </Tab>

                </Tabs>

             </div>


          </div>

           */}


{/* <div className={vidStyles.container}>
    <div className={vidStyles.content}>
    <div>
        <Button variant="dark"  onClick={()=>{this.load('yolo')}} >YOLOv3 (236MB)</Button>{' '}
        <Button variant="dark"  onClick={()=>{this.load('v1')}} >Tiny YOLOv1 (60MB)</Button>{' '}
        <Button variant="dark"onClick={()=>{this.load('v2')}} >Tiny YOLOv2 (43MB)</Button>{' '}
        <Button variant="dark"onClick={()=>{this.load('v3')}} >Tiny YOLOv3 (34MB)</Button>{' '}
    </div>
    <br/>

    <div className={vidStyles.vid}>
    <video
            style={this.styles}
            autoPlay
            muted
            ref={this.videoRef}
            // width="720"
            // height="500"
          />
          <canvas style={this.styles} ref={this.canvasRef} 
        //   width="720" height="500" 
          />
    </div>
  


    </div>
    <br/>
</div> */}
          


<br/>
<div>
    <DropdownButton variant="dark" id="dropdown-basic-button" title="Model Type">
    <Dropdown.Item onClick={()=>{this.load('yolo')}}>YOLOv3 (236MB)</Dropdown.Item>
    <Dropdown.Item onClick={()=>{this.load('v1')}}>Tiny YOLOv1 (60MB)</Dropdown.Item>
    <Dropdown.Item onClick={()=>{this.load('v2')}}>Tiny YOLOv2 (43MB)</Dropdown.Item>
    <Dropdown.Item onClick={()=>{this.load('v3')}}>Tiny YOLOv3 (34MB)</Dropdown.Item>
    </DropdownButton>

    
    </div>

    
    <br/>
<div className={"container"} >
    
    
          <video
            style={this.styles}
            autoPlay
            muted
            ref={this.videoRef}
            width="720"
            height="500"
          />
          <canvas style={this.styles} ref={this.canvasRef} 
          width="720" height="500" 
          />
          
          {this.state.loading ? <Loader/>:null}
            
          

</div>
        

          </>
        
      );
    }
  }
  
