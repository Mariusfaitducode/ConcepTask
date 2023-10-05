import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import { d3 } from 'src/assets/d3/d3.js';

import * as d3 from 'd3';
import { Todo } from 'src/app/model/todo';


@Component({
  selector: 'app-conceptor',
  templateUrl: './conceptor.page.html',
  styleUrls: ['./conceptor.page.scss'],
})
export class ConceptorPage implements OnInit {

  index : number = 0;

  todos : any[] = [];
  todo! : Todo;

  nodes : any[] = []
  links : any[] = []

  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

    this.route.params.subscribe((params) => {

        this.index = +params['id'];


        this.loadTodo(this.index);

        // var d3 = require("d3");


        this.initData();

        let graph = {nodes: this.nodes, links: this.links};


        let svg = d3.select("#graph-container");
        let width = +svg.attr("width");
        let height = +svg.attr("height");

        var simulation = d3
          .forceSimulation(graph.nodes)
          .force(
            "link",
            d3
              .forceLink()
              .id(function(d: any) {
                return d.id;
              })
              .links(graph.links)
          )

          .force("charge", d3.forceManyBody().strength(-30))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", ticked);

        //  let link = svg
        //   .append("g")
        //   .attr("class", "links")
        //   .selectAll("line")
        //   .data(graph.links)
        //   .enter()
        //   .append("line");
        //   // .attr("stroke-width", 3);
        //   // .style("stroke", "pink");
          
          var link = svg
          .append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter()
          .append("line")
          .attr("stroke-width", function(d) {
            return 3;
          });
          
          
        // let node = svg
        //   .append("g")
        //   .attr("class", "nodes")
        //   .selectAll("g")
        //   .data(graph.nodes)
        //   .enter()
        //   .append("circle");
        //   // .attr("r", "5")
        //   // .attr("fill", "red");

          var node = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", function(d) {
              return "red";
            })
            // .call(
            //   d3.drag()
                
            //     .on("start", dragstarted)
            //     .on("drag", dragged)
            //     .on("end", dragended)
                
            // );

            // const drag = d3.drag();

            // d3.selectAll(".node").call(d3.drag().on("start", started));


            // function started(event : any) {
            //   const circle = d3.select(this).classed("dragging", true);
            //   const dragged = (event, d) => circle.raise().attr("cx", d.x = event.x).attr("cy", d.y = event.y);
            //   const ended = () => circle.classed("dragging", false);
            //   event.on("drag", dragged).on("end", ended);
            // }
        
            function ticked() {
              link
                .attr("x1", function(d) {
                  return d.source.x;
                })
                .attr("y1", function(d) {
                  return d.source.y;
                })
                .attr("x2", function(d) {
                  return d.target.x;
                })
                .attr("y2", function(d) {
                  return d.target.y;
                });
          
              node
                .attr("cx", function(d) {
                  return d.x;
                })
                .attr("cy", function(d) {
                  return d.y;
                });
            }

            function dragstarted(event : any, d : any) {

              if (!event.active) simulation.alphaTarget(0.3).restart();
          
              d.fx = d.x;
          
              d.fy = d.y;
          
          }
          
          
          
          function dragged(event : any, d : any) {
          
              d.fx = event.x;
          
              d.fy = event.y;
          
          }
          
          
          
          function dragended(event : any, d : any) {
          
              if (!event.active) simulation.alphaTarget(0);
          
              d.fx = null;
          
              d.fy = null;
          
          }
          
        
        
      
    });
  }


  initData(){
    this.nodes = [];
    
    //Main todo
    this.nodes.push({id: 0, name: this.todo.title});

    let copyList =[...this.todo.list!];

    while (copyList.length > 0) {
  
      let todo = copyList.shift()!;

      this.nodes.push({id: todo.subId, name: todo.title});

      this.links.push({source: todo.parentId, target: todo.subId});

      for (let subTodo of todo.list!) {
        copyList.push(subTodo);
      }
    }

  }


  goBackTodo(){
    this.router.navigate(['/todo', this.index]);
  }

  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.todo = this.todos.find(todo => todo.mainId == id)!;
  }

}
