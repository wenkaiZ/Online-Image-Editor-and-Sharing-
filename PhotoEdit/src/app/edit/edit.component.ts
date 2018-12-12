
import { Component, OnInit,ViewChild,ElementRef, Inject, Renderer2 } from '@angular/core';
import { PreviewService } from '../preview.service';
import { ImagesInfo } from "../ImagesInfo";
import * as html2canvas from "html2canvas";
import { LoadcloudimageService } from "../loadcloudimage.service";
import { Subscription, Observer } from "rxjs";
import { Router } from '@angular/router';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Subject,Observable} from 'rxjs';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  imageUrl = null;
  croppedImage = null;
  @ViewChild(AngularCropperjsComponent) angularCropper: AngularCropperjsComponent;
  config = Object.assign({
    checkCrossOrigin: false,
    zoomable: true,
    zoom: function(value) {
      this.zoomCallback(value);
    }.bind(this)
  });

  // slider values to zoom image
  sliderValue = 0;
  preValue = 0;

  @ViewChild('myCanvas') myCanvas:ElementRef;
  context:CanvasRenderingContext2D;
  ImagesInfo: ImagesInfo = new ImagesInfo();
  private paramsSubscription: Subscription;
  Img: any;

  
  grayscaleOn:boolean = false;
  contrastOn:boolean = false;
  blurOn:boolean = false;
  saturateOn:boolean = false;
  brightnessOn:boolean = false;
  hue_rotateOn:boolean = false;
  invertOn:boolean = false;
  drop_shadowOn:boolean = false;
  opacityOn:boolean = false;
  sepiaOn:boolean = false;


  grayscaleValue:number = 10;
  contrastValue:number = 0;
  blurValue:number = 0;
  saturateValue:number = 0;
  brightnessValue:number = 0;
  hue_rotateValue:number = 0;
  invertValue:number = 0;
  drop_shadowValue:number = 0;
  opacityValue:number = 0;
  sepiaValue:number = 0;

  //edit style element
  newCanvas:HTMLCanvasElement;
  newImg:HTMLImageElement;
  ctx:any;

  

canvasImg: any;
  constructor(private previewService: PreviewService, 
    private router:Router, 
    public dialog: MatDialog, 
    private el:ElementRef,
    private renderer2: Renderer2) {
    
  }

  ngOnInit() {
    
    console.log(this.previewService.ImagesInfo);
    this.ImagesInfo=this.previewService.ImagesInfo;
    if(this.ImagesInfo.localImg!==undefined&&this.ImagesInfo.localImg!==null)
    {
      this.imageUrl = this.ImagesInfo.localImg;
      console.log(  this.imageUrl);
    }
    if(this.ImagesInfo.cloudImg!==undefined&&this.ImagesInfo.cloudImg!==null)
    {
      var imgLink = this.ImagesInfo.cloudImg+"?timestamp="+new Date();
   this.getBase64Image(imgLink).subscribe(
      (value)=>{
        if(value!==undefined&&value!==null)
        {
          console.log(value);
          this.imageUrl= value;
         
        }
      }
    )
      }
  }
  getBase64Image(imgLink):Observable<any> {
    let subj = new Subject();
    var tempImage = new Image();
    var dataURL;
    tempImage.crossOrigin = "*";
    tempImage.onload = function(){
      var canvas = document.createElement("canvas");
      canvas.width = tempImage.width;
      canvas.height = tempImage.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(tempImage, 0, 0, tempImage.width, tempImage.height);
      var ext = tempImage.src.substring(tempImage.src.lastIndexOf(".")+1).toLowerCase();
      var dataURL = canvas.toDataURL("image/"+ext);
      var img=document.createElement("img");
      subj.next(dataURL);
    }
   
    tempImage.src = imgLink;
    return subj.asObservable();
}
  reset() {
    this.imageUrl = null;
    this.croppedImage = null;
    this.sliderValue = 0;
    this.preValue = 0;
  }
  /**
   * Zoom in action when click button "+"
   */
  zoomIn() {
    this.angularCropper.cropper.zoom(0.1);
  }

  /**
   * Zoom out action when click button "-"
   */
  zoomOut() {
    this.angularCropper.cropper.zoom(-0.1);
  }

  /**
   * On change value of slider
   */
  onChange() {
    this.angularCropper.cropper.zoom((this.sliderValue - this.preValue)/100);
  }

  /**
   * Action callback when have zoom image
   * @param value zoom value
   */
  zoomCallback(value) {
    var oldRatio = value.detail.oldRatio;
    var newRatio = value.detail.ratio;

    if (this.preValue === this.sliderValue) {
      this.sliderValue = this.preValue + Math.floor((newRatio - oldRatio) * 100);
    }
    this.preValue = this.sliderValue;
    
  }

  private draw() {
    this.context.beginPath();
    this.context.moveTo(0,0);
    this.context.lineTo(300,150);
    this.context.stroke();
  }
  
    //console.log(this.angularCropper.cropper.getCroppedCanvas().toDataURL());
  

  goToReEdit(){}

  goToConfirm(){
    this.ImagesInfo.tempImg = this.angularCropper.cropper.getCroppedCanvas().toDataURL();

    this.previewService.ImagesInfo=this.ImagesInfo;
    this.router.navigate(['/reEdit']);

  }

  // storeAsCanvas(img): any {
  //   var shareContent = document.getElementById("display"); //the object dom need save
  //   var width = shareContent.offsetWidth; //get dom width
  //   var height = shareContent.offsetHeight; //dom height
  //   var canvas = document.createElement("canvas"); //create canvas node
  //   var scale = 1; //resize the picture
  //   canvas.width = width * scale; // define canvas width * scale
  //   canvas.height = height * scale; //define canvas height *scale
  //   canvas.getContext("2d").scale(scale, scale); //get context,set scale
  //   var opts = {
  //     scale: scale, // add scale parameter
  //     canvas: canvas, // canvas define
  //     logging: true, // use log
  //     width: width, //dom  original width
  //     height: height //dom original height
  //   };
  //   html2canvas(shareContent, opts).then(canvas => {
  //     this.canvasImg = canvas.toDataURL("image/png");
  //   });
  //   console.log(this.canvasImg)
  //   // this.uploadFile(this.canvasImg);
  //   // this.downloadFile(new Date(), this.canvasImg);
  // }


  grayscale(){
    
    this.ImagesInfo.localImg = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    //this.ImagesInfo.localImg = this.imageUrl;
    this.previewService.ImagesInfo=this.ImagesInfo;
    this.grayscaleOn = !this.grayscaleOn;
    this.contrastOn = false;
    this.blurOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  grayscaleAdd(){
    // let num = parseInt(this.grayscalValue);
    
    if(this.grayscaleValue<100){
      this.grayscaleValue = this.grayscaleValue+10;
      
      console.log("addddddd"+this.grayscaleValue);
      console.log(this.imageUrl);
    }
  }
  grayscaleMinus(){
    // let num = parseInt(this.grayscalValue);
    if(this.grayscaleValue>0){
      this.grayscaleValue = this.grayscaleValue-10;
    }
  }

  saturate(){
    this.saturateOn = !this.saturateOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.blurOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  saturateAdd(){
    if(this.saturateValue<1){
      this.saturateValue = this.saturateValue+0.1;
    }
  }
  saturateMinus(){
    if(this.saturateValue>0){
      this.saturateValue = this.saturateValue-0.1;
    }
  }

  contrast(){
    this.contrastOn = !this.contrastOn;
    this.grayscaleOn= false;
    this.blurOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  contrastAdd(){
    if(this.contrastValue<1){
      this.contrastValue = this.contrastValue+0.1;
    }
  }
  contrastMinus(){
    if(this.contrastValue>0){
      this.contrastValue = this.contrastValue-0.1;
    }
  }

  blur(){
    this.blurOn = !this.blurOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  blurAdd(){
    if(this.blurValue<1){
      this.blurValue = this.blurValue+0.1;
    }
  }
  blurMinus(){
    if(this.blurValue>0){
      this.blurValue = this.blurValue-0.1;
    }
  }
  brightness(){
    this.brightnessOn = !this.brightnessOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.blurOn = false;
    this.saturateOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  brightnessAdd(){
    if(this.brightnessValue<1){
      this.brightnessValue = this.brightnessValue+0.1;
    }
  }
  brightnessMinus(){
    if(this.brightnessValue>0){
      this.brightnessValue = this.brightnessValue-0.1;
    }
  }
  hue_rotate(){
    this.hue_rotateOn = !this.hue_rotateOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.blurOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  hue_rotateAdd(){
    if(this.hue_rotateValue<1){
      this.hue_rotateValue = this.hue_rotateValue+0.1;
    }
  }
  hue_rotateMinus(){
    if(this.hue_rotateValue>0){
      this.hue_rotateValue = this.hue_rotateValue-0.1;
    }
  }
  invert(){
    this.invertOn = !this.invertOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.blurOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  invertAdd(){
    if(this.invertValue<1){
      this.invertValue = this.invertValue+0.1;
    }
  }
  invertMinus(){
    if(this.invertValue>0){
      this.invertValue = this.invertValue-0.1;
    }
  }
  drop_shadow(){
    this.drop_shadowOn = !this.drop_shadowOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.blurOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.opacityOn = false;
    this.sepiaOn = false;
  }
  drop_shadowAdd(){
    if(this.drop_shadowValue<1){
      this.drop_shadowValue = this.drop_shadowValue+0.1;
    }
  }
  drop_shadowMinus(){
    if(this.drop_shadowValue>0){
      this.drop_shadowValue = this.drop_shadowValue-0.1;
    }
  }
  opacity(){
    this.opacityOn = !this.opacityOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.blurOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.sepiaOn = false;
  }
  opacityAdd(){
    if(this.opacityValue<1){
      this.opacityValue = this.opacityValue+0.1;
    }
  }
  opacityMinus(){
    if(this.opacityValue>0){
      this.opacityValue = this.opacityValue-0.1;
    }
  }
  sepia(){
    this.sepiaOn = !this.sepiaOn;
    this.grayscaleOn= false;
    this.contrastOn = false;
    this.blurOn = false;
    this.saturateOn = false;
    this.brightnessOn = false;
    this.hue_rotateOn = false;
    this.invertOn = false;
    this.drop_shadowOn = false;
    this.opacityOn = false;
  }
  sepiaAdd(){
    if(this.sepiaValue<1){
      this.sepiaValue = this.sepiaValue+0.1;
    }
  }
  sepiaMinus(){
    if(this.sepiaValue>0){
      this.sepiaValue = this.sepiaValue-0.1;
    }
  }

  getEl(){
    this.newCanvas = this.el.nativeElement.querySelector('.newCanvas');
    this.newImg = this.el.nativeElement.querySelector('.newImg');
    this.renderer2.setStyle(this.newImg, "display", "none");
    console.log(this.newImg);
    this.newImg.src = this.ImagesInfo.localImg;
    console.log(this.newImg.src);
    this.ctx = this.newCanvas.getContext("2d");

    this.editStyle();

  }

  editStyle(){
    console.log(this.newImg);
    console.log(this.newCanvas);
    this.newImg.onload = ()=>{
    
            this.ctx.drawImage(this.newImg,0,0,100,200);
            var pixels = this.ctx.getImageData(0,0,100,200);
            var pixeldata = pixels.data;
            for(var i=0,len = pixeldata.length ;i<len;i+=4){
                var gray =parseInt(pixels.data[i])*0.9 + parseInt(pixels.data[i+1])*0.9 + parseInt(pixels.data[i+2])*0.11;
                pixels.data[i] = gray;
                pixels.data[i+1] = gray;
                pixels.data[i+2] = gray;
            }
      this.ctx.clearRect(0,0,100,200);
      
      this.ctx.putImageData(pixels,0,0);
      console.log(this.ctx);

      this.ctx.font = "20px Arial";
      this.ctx.fillText("hellow",50,100);

      console.log(this.ctx.font);
      console.log(this.ctx.getImageData);

      this.downLoad(this.saveAsPNG(this.newCanvas));
  }
  }

	saveAsPNG(canvas) {
    return canvas.toDataURL("image/png");
  }
	downLoad(url){
    var oA = document.createElement("a");
    oA.download = '';// 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除

  }


}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  croppedImage = null;

  // constructor for dialog
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  /**
   * close dialog when click outside of it
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}