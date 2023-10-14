import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import { d3 } from 'src/assets/d3/d3.js';

import * as d3 from 'd3';
import { update } from 'firebase/database';
import { GraphConceptor } from 'src/app/model/graph-conceptor';
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

        //Init data

        this.index = +params['id'];

        this.loadTodo(this.index);
        this.initData();

        let graph = {nodes: this.nodes, links: this.links};

        let width = window.innerWidth
        let height = window.innerHeight - 100

        // Initialiser le graphique

        console.log(graph)

        let svg = d3.select("#graph-container");
        var g = svg.append("g");

        let zoom = d3.zoom()
          .scaleExtent([0.1, 10]) // Définissez les limites du zoom
          .on("zoom", zoomed);
        

        svg.call(zoom as any);


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
          .force("charge", d3.forceManyBody().strength(-60))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", ticked);

          
        var link = g.append("g")
        .attr("class", "links")    
          .selectAll("line")
          .data(graph.links)
          .enter()
            .append("line")
            .attr("stroke-width", function(d) {
              return 3;
            })
            .attr("stroke", function(){
              return "red"
            })


        const drag = d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);
        

        var circle = g.append("g")
            .attr("class", "nodes")
          .selectAll<SVGCircleElement, any>("circle")
          .data(graph.nodes)
          .enter()
            .append("circle")
            .attr("r", 10)
            .attr("fill", function(d) {
              return "red";
            })
            .attr("class", "node")
            .call(drag as any)
            .on("click", onClickCircle)


        var text = g.append("g")
            .attr("class", "labels")
          .selectAll("text")
            .data(graph.nodes)
          .enter().append("text")
            .attr("class", "node-label")
            .text(function(d) { return d.todo.title });


          
        
        // Fonction de mise à jour du graphique


        function onClickCircle(event : any, d : any){


          //Développer sous todo
          console.log(d)

          let newChildNodes : any[] = [];

          for (let subTodo of d.todo.list!) {
            graph.nodes.push({id: subTodo.subId, todo: subTodo});

            graph.links.push({ source: d.id, target: subTodo.subId });

          }

          // graph.nodes = graph.nodes.concat(newChildNodes);

          console.log(graph)
          // Ajoutez des liens entre le nœud parent et les nœuds enfants
          // const parentLink = { source: d.id, target: newChildNodes[0].id };
          

          console.log(graph)

          updateGraph();
        }


        function updateLink(){
          link = link.data(graph.links);
          link.exit().remove();
          link = link.enter().append("line")
            .merge(link)
            .attr("stroke-width", function(d) {
            return 3;
            })
            .attr("stroke", function(){
              return "red"
            })
        }
          

        function updateCircle(){
          circle = circle.data(graph.nodes, (d: any) => d.id);
          circle.exit().remove();
          circle = circle.enter().append("circle")
            .merge(circle)
            .attr("r", 10)
            .attr("fill", function(d) {
              return "red";
            })
            .attr("class", "node")
            .call(drag as any)
            .on("click", onClickCircle)
        }


        function updateText(){
          text = text.data(graph.nodes, (d: any) => d.id);
          text.exit().remove();
          text = text.enter().append("text")
            .merge(text)
            .attr("class", "node-label")
            .text(function(d) { return d.todo.title });
        }
        


        function updateGraph() {
          // Mettez à jour le graphique en fonction des données actuelles, y compris les nœuds enfants
      
          // Mettez à jour les liens
          updateLink();
      
          // Mettez à jour les cercles (nœuds)
          updateCircle();
      
          // Mettez à jour le texte (labels)
          updateText();
      
          // Mettez à jour la simulation

          simulation.stop();

          simulation = d3
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
          .force("charge", d3.forceManyBody().strength(-60))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", ticked);

          simulation.restart();

        }




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
      
          circle
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            });

          text
            .attr("x", function(d) {
              return d.x;
            })
            .attr("y", function(d) {
              return d.y;
            });
            
        }


        function dragStarted(event : any, d : any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        
        function dragged(event : any, d : any) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        
        function dragEnded(event : any, d : any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }


        function zoomed(event : any) {
          let transform = event.transform;
          g.attr("transform", transform);
        }

        


        
    });
  }


  initData(){
    this.nodes = [];
    
    //Main todo
    this.nodes.push({id: 0, todo: this.todo});

    let copyList =[...this.todo.list!];

    // while (copyList.length > 0) {
  
    //   let todo = copyList.shift()!;

    //   this.nodes.push({id: todo.subId, name: todo.title});

    //   this.links.push({source: todo.parentId, target: todo.subId});

    //   for (let subTodo of todo.list!) {
    //     copyList.push(subTodo);
    //   }
    // }

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
