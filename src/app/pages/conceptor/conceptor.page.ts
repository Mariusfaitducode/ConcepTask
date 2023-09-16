import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-conceptor',
  templateUrl: './conceptor.page.html',
  styleUrls: ['./conceptor.page.scss'],
})
export class ConceptorPage implements OnInit {

  index : number = 0;

  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

    this.route.params.subscribe((params) => {

        this.index = +params['id'];
    });
  }

  goBackTodo(){
    this.router.navigate(['/todo', this.index]);
  }

}
