import { AfterViewInit, Component, OnInit } from '@angular/core';
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

        let width = window.innerWidth
        let height = window.innerHeight - 100

        console.log(graph)


        let svg = d3.select("#graph-container");
        // let width = svg.attr("width");
        // let height = svg.attr("height");


        let container = svg.node() as HTMLElement

        console.log()
        console.log(window.innerHeight)

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


        var g = svg.append("g");
          
        var link = g    
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



        var node = g
          .selectAll<SVGCircleElement, any>("circle")
          .data(graph.nodes)
          .enter()
            .append("circle")
            .attr("r", 10)
            .attr("fill", function(d) {
              return "red";
            })
            .attr("class", "nodes")
            .call(drag as any)
            .on("click", function(d : any){
              console.log(d)
            })



        node.append("title")
            .attr("class", "node-label")
            .attr("color", "white")
            .attr("x", function(d) {
              return d.x + 10; 
            })
            .attr("y", function(d) {
              return d.y - 10;
            })
            .text(function(d) {
              return d.name;
        });  

            // .append("title")
            //   .attr("class", "node-label")
            //   .attr("cx", function(d) {
            //     return d.x + 10; // Ajustez ces valeurs pour positionner le texte à votre convenance
            //   })
            //   .attr("cy", function(d) {
            //     return d.y - 10; // Ajustez ces valeurs pour positionner le texte à votre convenance
            //   })
            //   .text(function(d) {
            //     return d.name;
            //   })
              
              


              // var nodeLabels = g
              //   .selectAll("circle")
              //   .data(graph.nodes)
              //   .enter()
              //   .append("text")
              //   .attr("class", "node-label")
              //   .attr("dx", 10) // Ajustez ces valeurs pour positionner le texte par rapport au nœud
              //   .attr("dy", -10) // Ajustez ces valeurs pour positionner le texte par rapport au nœud
              //   .text(function(d) {
              //     return d.name; // Utilisez la propriété 'title' de vos données pour le texte de l'étiquette
              //   });

        
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
          
        let zoom = d3.zoom()
          .scaleExtent([0.1, 10]) // Définissez les limites du zoom
          .on("zoom", zoomed);


        
        
        function zoomed(event : any) {
          let transform = event.transform;
          // Appliquez la transformation au groupe racine de votre graphe SVG
          // Par exemple, si vous avez un groupe g comme racine, faites quelque chose comme :
          g.attr("transform", transform);
        }

        svg.call(zoom as any);
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
