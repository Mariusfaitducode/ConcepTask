import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularDelegate } from '@ionic/angular';
// import { AngularFrameworkDelegate } from '@ionic/angular/providers/angular-delegate';
import { TranslateService } from '@ngx-translate/core';

// import { d3 } from 'src/assets/d3/d3.js';

import * as d3 from 'd3';
import { update } from 'firebase/database';
// import { last } from 'rxjs';
import { GraphConceptor } from 'src/app/models/graph-conceptor';
import { Settings } from 'src/app/models/settings';
import { Todo } from 'src/app/models/todo';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { TodoColor } from 'src/app/utils/todo-color';
import { TodoDate } from 'src/app/utils/todo-date';

// import 'font-awesome';

@Component({
  selector: 'app-conceptor',
  templateUrl: './conceptor.page.html',
  styleUrls: ['./conceptor.page.scss'],
})
export class ConceptorPage implements OnInit {

  index : string = '';

  todos : Todo[] = [];
  todo! : Todo;

  nodes : any[] = []
  links : any[] = []

  modalNode: any = {
    open: false,
    task: Todo,
    // modify: false,
    // parentTask: Todo,
  };

  subMode : string = 'graph'

  constructor(private route : ActivatedRoute, 
              private router : Router,
              private translate : TranslateService,
              private taskService : TaskService,
              private settingsService : SettingsService
            ) 
  { 
    // let settings = new Settings();
    // settings.initPage(translate);
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {

      this.subMode = 'graph';

      this.taskService.getTodos().subscribe((todos: Todo[]) => {
        
        console.log('Todos loaded in conceptor page:', todos)
        this.todos = todos;

        if (this.todos.length == 0) return;

        this.settingsService.initPage(this.translate);

        //Init data

        this.index = params['id'];

        // this.loadTodo(this.index);

        this.todo = this.todos.find(todo => todo.id == this.index)!;

        if (this.todo){
          console.log("Conceptor found todo :", this.todo)
          this.initData();
          this.initializeConceptorGraph();
        }
      });
    });
  }



  initializeConceptorGraph(){
    let graph = {nodes: this.nodes, links: this.links};

    let width = window.innerWidth
    let height = window.innerHeight - 100

    // Initialiser le graphique

    console.log('Conceptor graph :',graph)


    // Clear the graph container before initialization

    console.log('conceptor size',d3.select("#graph-container").selectAll("*").size())

    if (d3.select("#graph-container").selectAll("*").size() > 0){
      d3.select("#graph-container").selectAll("*").remove();

    }



    let svg = d3.select("#graph-container");

    console.log('Conceptor svg :',svg)


    let g = svg.append("g");

    let maxLevel = 0;
    let linkColor = "var(--ion-color-step-700)";
    let lastSelectedNode : any = null;

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
      .force("charge", d3.forceManyBody().strength(-100))
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
        .attr("stroke", linkColor)


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
        .attr("r", sizeNode)
        .attr("fill", nodeColor)
        .attr("stroke", linkColor)
        .attr("class", "node")
        .call(drag as any)
        .on("click", onClickCircle)
        // .on("click", onClickCircleModal)
        // .on("dblclick", onClickCircle)


    var nodeIcon = g.append("g")
        .attr("class", "emoji")
        .attr("width", '10px')
        .attr("height", '10px')
      .selectAll("text")
        .data(graph.nodes)
      .enter().append("text")
        .text(emojiNode) // Utilisez un emoji pour une icône
        .attr('font-size', '10px')
        .attr('letter-spacing', '-3px')

    var text = g.append("g")
        .attr("class", "labels")
      .selectAll("text")
        .data(graph.nodes)
      .enter().append("text")
        .attr("class", "node-label")
        .text(function(d) { return d.todo.title });


    console.log("Graph initialisation good", svg)



        
    // Fonction de mise à jour du graphique
    function onClickCircle(event : any, d : any){

      //Développer sous todo
      console.log('On click circle :',d)

      for (let subTodo of d.todo.list!) {


        if (graph.nodes.find(node => node.id == subTodo.subId)) {

          d.todo.developped = false;

          // Enlever tous les sous todos

          graph.nodes = graph.nodes.filter(node => node.id != subTodo.subId);
          graph.links = graph.links.filter(link => link.target.id != subTodo.subId);
          removeSubTodos(subTodo);

        }
        else{

          d.todo.developped = true;

          if (d.level + 1 > maxLevel) {
            maxLevel = d.level + 1;
          }

          graph.nodes.push({id: subTodo.subId, level : d.level + 1, todo: subTodo});

          graph.links.push({ source: d.id, target: subTodo.subId });

          if (subTodo.developped) addSubTodos(subTodo, d.level + 1);
        }
      }

      updateGraph();
    }


    function addSubTodos(todo : Todo, level : number){

      for (let subTodo of todo.list!) {
        if (level + 1 > maxLevel) {
          maxLevel = level + 1;
        }

        graph.nodes.push({id: subTodo.subId, level : level + 1, todo: subTodo});

        graph.links.push({ source: todo.subId, target: subTodo.subId });
      }
    }

    function removeSubTodos(todo : Todo){
        
      for (let subTodo of todo.list!) {

        if (graph.nodes.find(node => node.id == subTodo.subId)) {

          // Enlever tous les sous todos

          graph.nodes = graph.nodes.filter(node => node.id != subTodo.subId);
          graph.links = graph.links.filter(link => link.target.id != subTodo.subId);

          removeSubTodos(subTodo);
        }
      }
    }


    function updateLink(){
      link = link.data(graph.links);
      link.exit().remove();
      link = link.enter().append("line")
        .merge(link)
        .attr("stroke-width", function(d) {
        return 3;
        })
        .attr("stroke", linkColor)
    }
      

    function updateCircle(){
      circle = circle.data(graph.nodes, (d: any) => d.id);
      circle.exit().remove();
      circle = circle.enter().append("circle")
        .merge(circle)
        .attr("r", sizeNode)
        .attr("stroke", linkColor)
        .attr("fill", nodeColor)
        .attr("class", "node")
        .call(drag as any)
        .on("click", onClickCircle)
        // .on("click", onClickCircleModal) // TODO : fix node-modal and onClickCircleModal
        // .on("dblclick", onClickCircle)
    }

    function updateEmoji(){
      nodeIcon = nodeIcon.data(graph.nodes, (d: any) => d.id);
      nodeIcon.exit().remove();
      nodeIcon = nodeIcon.enter().append("text")
        .merge(nodeIcon)
        .text(emojiNode) // Utilisez un emoji pour une icône
        .attr('font-size', '10px')
        .attr('letter-spacing', '-3px')
    }

    function updateText(){
      text = text.data(graph.nodes, (d: any) => d.id);
      text.exit().remove();
      text = text.enter().append("text")
        .merge(text)
        .attr("class", "node-label")
        .text(function(d) { return d.todo.title });
    }
    
    function updateSimulation(){
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


    function updateGraph() {
      // Mettez à jour le graphique en fonction des données actuelles, y compris les nœuds enfants
      updateLink();
      updateCircle();
      updateEmoji();
      updateText();
      updateSimulation();
    }


    // Propriété visuelles des éléments du graphique


    function nodeColor(d : any) {
      if (d.todo.isDone) {
        return "var(--is-done-color-node)";
      }
      else if (d.todo.config.date && TodoDate.passedDate(d.todo)) {
        return "var(--ion-color-danger)";
      }
      else {

        console.log('nodeColor level :',d.level)
        // const levelShade = 300 - ((maxLevel - d.level) * 100);

        const levelShade = (d.level * 150) + 100;

        if (levelShade > 700) return 'var(--ion-color-step-700)';
        
        return 'var(--ion-color-step-' + levelShade + ')';
      }
    }

    function sizeNode(d : any){

      if (d.todo.main){
        return 12;
      }
      else{
        return 10;
      }
    }

    function emojiNode(d : any){

      let emoji = '';

      if (d.todo.isDone){
        emoji += '✅';
      }
      else {
        if (d.todo.config.date && TodoDate.passedDate(d.todo)){
          emoji+= '⏰';
        }
        if (d.todo.config.date && !TodoDate.passedDate(d.todo)){
          emoji+= '📅';
        }
        if (d.todo.config.repeat && d.todo.reminder){
          emoji += '🔁';
        }
        if (d.todo.priority == 'high'){
          emoji += '‼️';
        }
        if (d.todo.priority == 'medium'){
          emoji += '❗';
        }
        if (d.todo.priority == 'low'){
          emoji += '❕';
        }
      }

      return emoji;
    }


    // Fonction de mise à jour des positions des éléments du graphique

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


      let textOffsetX = 5;
      let textOffsetY = 8;

      text
        .attr("x", function(d) {
          return d.x + textOffsetX;
        })
        .attr("y", function(d) {
          return d.y + textOffsetY;
        });

      nodeIcon
        .attr("x", function(d) {
          return d.x + 3;
        })
        .attr("y", function(d) {
          return d.y - 2;
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
  }




  initData(){
    this.nodes = [];
    this.links = [];

    this.nodes.push({id: 0, level : 0, todo: this.todo});

    this.traverseList(this.todo.list, 0);
  }


  traverseList(list : any, level : any) {
    if (!list || list.length === 0) return;

    for (let todo of list) {
        this.nodes.push({ id: todo.subId, level: level, todo: todo });
        this.links.push({ source: todo.parentId, target: todo.subId });

        if (todo.developped && todo.list && todo.list.length > 0) {
            this.traverseList(todo.list, level + 1); // Appel récursif pour les sous-listes avec un niveau incrémenté
        }
    }
  }

  goToTree(){

    this.router.navigate(['/todo', this.index], {fragment: 'conceptor'});
  }

  goBackTodo(){
    this.router.navigate(['/home']);
  }

}
