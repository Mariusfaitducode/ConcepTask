import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularDelegate } from '@ionic/angular';
import { AngularFrameworkDelegate } from '@ionic/angular/providers/angular-delegate';

// import { d3 } from 'src/assets/d3/d3.js';

import * as d3 from 'd3';
import { update } from 'firebase/database';
import { last } from 'rxjs';
import { GraphConceptor } from 'src/app/model/graph-conceptor';
import { Todo } from 'src/app/model/todo';

// import 'font-awesome';

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

  modalNode: any = {
    open: false,
    task: Todo,
    // modify: false,
    // parentTask: Todo,
  };

  constructor(private route : ActivatedRoute, private router : Router) { 

    let settings = JSON.parse(localStorage.getItem('settings') || '{}');

    if (settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
  }

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

        console.log(svg)

        if (svg.selectChildren("g").size() > 0) window.location.reload();

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
            .on("click", onClickCircleModal)
            .on("dblclick", onClickCircle)


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

        
        // Fonction de mise à jour du graphique


        function onClickCircleModal(event : any, d : any){

          var nodeId = d.id;

          let pathAr = window.location.pathname.split('/');

        if (pathAr.length > 3) {
            pathAr.pop();
          }

          let path = pathAr.join('/');

          var newUrl = path + '/'+ nodeId;



          window.history.pushState(null, '', newUrl);

          console.log(event)

          if (lastSelectedNode) {
            lastSelectedNode.classList.remove('selected');
          }
          lastSelectedNode = event.target;
          event.target.classList.add('selected');

          var modal = document.getElementById("modal-node");

          console.log(modal)

          // Title
          var nodeTitle = document.getElementById("node-title");
          nodeTitle!.innerHTML = d.todo.title;

          var nodeCategory = document.getElementById("node-category");

          if (d.todo.category.name) {
            nodeCategory!.innerHTML = d.todo.category.name;
            nodeCategory!.style.backgroundColor = d.todo.category.color;
            nodeCategory!.style.color = Todo.getCorrectTextColor(d.todo.category.color);
          }
          else{
            nodeCategory!.classList.add('hide');
          }
          // nodeCategory!.innerHTML = d.todo.category.name;
          // nodeCategory!.style.backgroundColor = d.todo.category.color;

          if (d.todo.description) {
            let modalDescription = document.getElementById("modal-description");
            modalDescription!.classList.remove('hide');

            let nodeDescription = document.getElementById("node-description");
            nodeDescription!.setAttribute('value',d.todo.description);
          }
          else{
            let modalDescription = document.getElementById("modal-description");
            modalDescription!.classList.add('hide');
          }

          // Date
          if (d.todo.config.date && d.todo.date) {
            let modalDate = document.getElementById("modal-date");
            modalDate!.classList.remove('hide');

            let nodeDate = document.getElementById("node-date");
            nodeDate!.setAttribute('value', Todo.formatDateToCustomString(d.todo)!);

            // let nodeTime = document.getElementById("node-time");
            // nodeTime!.setAttribute('value',d.todo.time);
          }
          else{
            let modalDate = document.getElementById("modal-date");
            modalDate!.classList.add('hide');
          }

          if (d.todo.config.repeat && d.todo.repeat) {
            let modalDate = document.getElementById("modal-repeat");
            modalDate!.classList.remove('hide');

            let nodeDate = document.getElementById("node-repeat");
            nodeDate!.setAttribute('value', Todo.formatDateToCustomString(d.todo)!);

            // let nodeTime = document.getElementById("node-time");
            // nodeTime!.setAttribute('value',d.todo.time);
          }
          else{
            let modalDate = document.getElementById("modal-repeat");
            modalDate!.classList.add('hide');
          }

          // Sub tasks
          if (d.todo.list.length > 0) {

            let modalSubTask = document.getElementById("modal-subs");
            modalSubTask!.classList.remove('hide');

            let nodeSubTask = document.getElementById("node-subs");
            nodeSubTask!.classList.remove('hide');
            nodeSubTask!.innerHTML = "Sub tasks : "+ d.todo.list.length;

            if (d.todo.developped){
              let nodeClose = document.getElementById("node-close");
              nodeClose!.classList.remove('hide');

              let nodeExpand = document.getElementById("node-expand");
              nodeExpand!.classList.add('hide');

              nodeClose!.onclick = function() {
                onClickCircle(event, d);
                modal!.classList.add('close-modal');
              }
            }
            else if (d.todo.developped === false){
              let nodeClose = document.getElementById("node-close");
              nodeClose!.classList.add('hide');

              let nodeExpand = document.getElementById("node-expand");
              nodeExpand!.classList.remove('hide');

              nodeExpand!.onclick = function() {
                console.log("expand")
                onClickCircle(event, d);
                modal!.classList.add('close-modal');
              }
            }
            else{
              let nodeClose = document.getElementById("node-close");
              nodeClose!.classList.add('hide');

              let nodeExpand = document.getElementById("node-expand");
              nodeExpand!.classList.add('hide');
            }
          }
          else{
            let modalSubTask = document.getElementById("modal-subs");
            modalSubTask!.classList.add('hide');

            let nodeSubTask = document.getElementById("node-subs");
            nodeSubTask!.classList.add('hide');

            let nodeClose = document.getElementById("node-close");
            nodeClose!.classList.add('hide');

            let nodeExpand = document.getElementById("node-expand");
            nodeExpand!.classList.add('hide');
          }

          if (d.todo.isDone) {
            let modalHeader = document.getElementById("modal-header");
            modalHeader!.classList.add('doneHeader');

            let nodeValidateButton = document.getElementById("node-validate-button");
            nodeValidateButton!.classList.add('hide');

            let nodeUnvalidateButton = document.getElementById("node-unvalidate-button");
            nodeUnvalidateButton!.classList.remove('hide');
          }
          else{
            let modalHeader = document.getElementById("modal-header");
            modalHeader!.classList.remove('doneHeader');

            let nodeValidateButton = document.getElementById("node-validate-button");
            nodeValidateButton!.classList.remove('hide');

            let nodeUnvalidateButton = document.getElementById("node-unvalidate-button");
            nodeUnvalidateButton!.classList.add('hide');
          }

          modal!.classList.remove('close-modal');
        }


        function onClickCircle(event : any, d : any){

          //Développer sous todo
          console.log(d)

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
            }
          }

          updateGraph();
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
            .on("click", onClickCircleModal)
            .on("dblclick", onClickCircle)
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
          else if (new Date(d.todo.date) < new Date()) {
            return "var(--ion-color-danger)";
          }
          else {

            const levelShade = 500 - ((maxLevel - d.level) * 100);

            if (levelShade < 50) return 'var(--ion-color-step-50)';
            
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
            if (d.todo.config.date && new Date(d.todo.date) < new Date()){
              emoji+= '⏰';
            }
            if (d.todo.config.date && new Date(d.todo.date) > new Date()){
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

        


        
    });
  }


  initData(){
    this.nodes = [];
    
    //Main todo
    this.nodes.push({id: 0, level : 0, todo: this.todo});

    let copyList =[...this.todo.list!];

    while (copyList.length > 0) {
  
      let todo = copyList.shift()!;

      this.nodes.push({id: todo.subId, level : 1, todo: todo});

      this.links.push({source: todo.parentId, target: todo.subId});

      if (todo.developped){
        for (let subTodo of todo.list!) {
          copyList.push(subTodo);
        }
      }
    }

  }

  goToTree(){
    this.router.navigate(['/todo', this.index], {fragment: 'sub-task-mode'});
  }

  goBackTodo(){
    this.router.navigate(['/home']);
  }

  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.todo = this.todos.find(todo => todo.mainId == id)!;
  }

}
