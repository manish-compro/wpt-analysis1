import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { ResultData } from '../resultdata.interface'
import { AppHelperService } from '../app-helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  resultData : ResultData  = {run : '', step: '', label: '', loadtime: '', thumbnailUrl: '', miss : false};
  arrayResult = new Array();
  requestData = {
    data : [],
    sheetName : ''
  };
  testId = '';
  tempSheetName = '';

  wptLinkForm = new FormGroup({
    wptTestid : new FormControl('', Validators.required),
    sheetName : new FormControl('', Validators.required)
  })
  constructor(private apphelper : AppHelperService) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log('entered link', this.wptLinkForm.value.wptTestid);
    console.log('sheetName', this.wptLinkForm.value.sheetName );
    
    let testUrl = `https://www.webpagetest.org/jsonResult.php?test=${this.wptLinkForm.value.wptTestid}`;  
    this.fetchJSON(testUrl)
  }

  async  fetchJSON(url) {
    fetch(url)
    .then(response => response.json())
    .then(commits => this.startAnalysis(commits));
  }

  startAnalysis(jsonResult){
   this.testId = jsonResult.data.id;
   this.tempSheetName = jsonResult.data.location
    Object.keys(jsonResult.data.runs).forEach(key =>{
      
      
      const fvStepsArray =  jsonResult.data.runs[key].firstView.steps;
      const rvStepsArray =  jsonResult.data.runs[key].repeatView.steps

      const StepsArray = fvStepsArray.concat(rvStepsArray);
      StepsArray.forEach((array)=>{
        this.resultData = {run : '', step: '', label: '', loadtime: '', thumbnailUrl: '', miss : false};
        this.resultData.run = array.run
        this.resultData.step =array.step
        this.resultData.label = array.eventName;
        let foundMiss;
        let allHit = false;

        let temp1 = array.videoFrames[array.videoFrames.length -1].time/1000;
        this.resultData.loadtime = temp1.toString();

        this.resultData.thumbnailUrl = this.createThumbnailUrl(array.run, array.step)

        for (let index =0 ; index < array.requests.length; index ++){
          
         let responseArray = array.requests[index].headers.response 
         let responseObject = {};
        for (let i = 0; i < responseArray.length; i++) {
          if (responseArray[i] != ":status: 200"){
           let split = responseArray[i].split(':');
           if(split[1])
             responseObject[split[0].trim()] = split[1].trim();
           }
          } 
        
          for(let key in responseObject) {
           if(key == 'x-cache')
               { console.log(`x-cache status in ${index}th request: ${responseObject[key]}`); 
                 if(responseObject[key] == 'Miss from cloudfront')
                 { foundMiss = true;
                  break; }
                 else{
                   allHit = true;
                 }
               }
          }
     
     
          if(foundMiss == true){
            this.resultData.miss = true;
            break;}
     
            
       }
       let temp = this.resultData
       this.arrayResult.push(temp);
      
       
      });
    
    })
    console.log(this.arrayResult);
    this.requestData.data = this.arrayResult;
    this.requestData.sheetName = `${this.wptLinkForm.value.sheetName}`
    console.log(this.requestData);
    console.log(JSON.stringify(this.requestData));
    this.apphelper.postResultData(this.requestData).subscribe();
   this.arrayResult = [];
    this.requestData = {
      data : [],
      sheetName : ''
    };
  }

  createThumbnailUrl(run: any, step: any) {
    return `https://www.webpagetest.org/video/compare.php?tests=${this.testId}-r%3A${run}-c%3A0-s%3A${step}&thumbSize=200&ival=100&end=visual` 
  }
  
 
}
