import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  wptLinkForm = new FormGroup({
    wptLink : new FormControl('')
  })
  constructor() { }

  ngOnInit() {
  }

  onSubmit(){
    console.log('entered link', this.wptLinkForm.value.wptLink);
    this.fetchJSON(this.wptLinkForm.value.wptLink)
  }

  async  fetchJSON(url) {
    fetch(url)
    .then(response => response.json())
    .then(commits => this.startAnalysis(commits));
  }

  startAnalysis(jsonResult){

  }
}
