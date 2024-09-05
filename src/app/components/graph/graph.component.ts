import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularDelegate } from '@ionic/angular';
// import { AngularFrameworkDelegate } from '@ionic/angular/providers/angular-delegate';
import { TranslateService } from '@ngx-translate/core';

// import { d3 } from 'src/assets/d3/d3.js';

import * as d3 from 'd3';
import { update } from 'firebase/database';
import { Subscription } from 'rxjs';
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
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {

  // index : string = '';

  @Input() mainTodo! : Todo;

  @Input() selectedTodo! : Todo;

  @Output() todoSelectedEmitter = new EventEmitter<Todo>();

  minHeight: number = 300; // Hauteur minimale du graphique
  // maxHeight: number = 600; // Hauteur maximale du graphique

  @Input() height : number = 300;

//   nodes : any[] = []
//   links : any[] = []

  graphData : any = {
    nodes : [],
    links : []
  };

  svg : any;

  simulation : any;
  link : any;
  circle : any;
  nodeIcon : any;
  text : any;

  constructor(private router : Router,) { }


  ngOnInit() {

    if (this.mainTodo){
      console.log("Conceptor found todo :", this.mainTodo)
      this.initData();
      this.initializeConceptorGraph();
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['selectedTodo']) {
  //     const prevValue = changes['someInput'].previousValue;
  //     const currentValue = changes['someInput'].currentValue;

  //     if (prevValue !== currentValue) {
  //       // Do something with the new value
  //       console.log("Selected Todo changed :", this.selectedTodo)
  //     }
  //   }
  // }


  // DATA INITIALIZATION

  initData(){
    this.graphData.nodes = [];
    this.graphData.links = [];

    this.graphData.nodes.push({id: 0, level : 0, todo: this.mainTodo});

    if (this.mainTodo.developped){
        this.traverseList(this.mainTodo.list, 0);
    }
  }


  traverseList(list : any, level : any) {
    if (!list || list.length === 0) return;

    for (let todo of list) {
      this.graphData.nodes.push({ id: todo.subId, level: level, todo: todo });
      this.graphData.links.push({ source: todo.parentId, target: todo.subId });

      if (todo.developped && todo.list && todo.list.length > 0) {
          this.traverseList(todo.list, level + 1); // Appel récursif pour les sous-listes avec un niveau incrémenté
      }
    }
  }

  
  // GRAPH INITIALIZATION

  initializeConceptorGraph() {
    // Initialiser la taille du graphique
    let { width, height } = this.getGraphDimensions();

    // Initialiser le conteneur SVG
    const svg = this.initializeSVGContainer(width, height);

    // Initialiser les forces de simulation
    const simulation = this.initializeSimulation(this.graphData, width, height);

    // Initialiser les éléments du graphique (liens, nœuds, icônes, labels)
    const { link, circle, nodeIcon, text } = this.initializeGraphElements(svg, this.graphData);

    // TODO : set selected node on initialization and on todo changed

    // Attacher les événements de zoom et de drag
    this.attachZoomAndDrag(svg);

    this.svg = svg;
    this.simulation = simulation;
    this.link = link;
    this.circle = circle;
    this.nodeIcon = nodeIcon;
    this.text = text;

    console.log('Graph initialization complete', svg);
  }


  // Fonction pour obtenir les dimensions du graphique
  getGraphDimensions() {
      const width = window.innerWidth - 8;
      let height = 0;
      if (this.height){
        height = Math.max(this.minHeight, this.height);
        height -= 8;
      }
      else{
        height = this.minHeight;
      }
      return { width, height };
  }


  // Fonction pour initialiser le conteneur SVG
  initializeSVGContainer(width: number, height: number) {
      const svg = d3.select("#graph-container")
          .attr("width", width)
          .attr("height", height);

      // Nettoyer le conteneur avant l'initialisation
      svg.selectAll("*").remove();

      // Ajouter un groupe pour contenir les éléments graphiques
      svg.append("g");

      return svg;
  }

  // Fonction pour initialiser la simulation de forces
  initializeSimulation(graph: any, width: number, height: number) {
      return d3.forceSimulation(graph.nodes)
          .force("link", d3.forceLink().id((d: any) => d.id).links(graph.links))
          .force("charge", d3.forceManyBody().strength(-100))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", this.ticked.bind(this));
  }

  // Fonction pour initialiser les éléments du graphique (liens, nœuds, icônes, labels)
  initializeGraphElements(svg: any, graph: any) {
      const g = svg.select("g");

      const link = g.append("g").attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", 2)
          .attr("stroke", "var(--ion-color-step-700)");

      const drag = this.initializeDrag();

      const circle = g.append("g").attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
          .attr("r", this.sizeNode)
          .attr("fill", this.nodeColor)
          .attr("stroke", "var(--ion-color-step-700)")
          .attr("class", "node")
          .call(drag)
          .on("click", this.onClickCircle.bind(this))
          .on("dblclick", this.onDoubleClickCircle.bind(this));

      // Ajouter la classe "selected" au cercle ayant l'id spécifique
      circle.filter((d: any) => d.todo.id === this.selectedTodo.id)
          .classed("selected", true); // Ajoute la classe "selected"

      const nodeIcon = g.append("g").attr("class", "emoji")
          .selectAll("text")
          .data(graph.nodes)
          .enter().append("text")
          .text(this.emojiNode)
          .attr('font-size', '10px')
          .attr('letter-spacing', '-3px');

      const text = g.append("g").attr("class", "labels")
          .selectAll("text")
          .data(graph.nodes)
          .enter().append("text")
          .attr("class", "node-label")
          .text((d: any) => d.todo.title);

      return { link, circle, nodeIcon, text };
  }

  // Fonction pour initialiser le drag des nœuds
  initializeDrag() {
      return d3.drag()
          .on('start', this.dragStarted.bind(this))
          .on('drag', this.dragged.bind(this))
          .on('end', this.dragEnded.bind(this));
  }

  // Fonction pour attacher les événements de zoom et drag
  attachZoomAndDrag(svg: any) {
      const zoom = d3.zoom()
          .scaleExtent([0.1, 10])
          .on("zoom", (event) => this.zoomed(event, svg));

      svg.call(zoom);
  }

  // Fonction pour mettre à jour les positions des éléments du graphique
  ticked() {
    this.link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

    this.circle
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

    this.text
        .attr("x", (d: any) => d.x + 5)
        .attr("y", (d: any) => d.y + 8);

    this.nodeIcon
        .attr("x", (d: any) => d.x + 3)
        .attr("y", (d: any) => d.y - 2);

    // console.log("Nœuds après tick :", this.graphElements.graph.nodes);
  }

  // Fonction pour gérer le zoom
  zoomed(event: any, svg: any) {
      svg.select("g").attr("transform", event.transform);
  }

  // Fonctions de drag
  dragStarted(event: any, d: any) {
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
  }

  dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
  }

  dragEnded(event: any, d: any) {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  }

  // Propriétés visuelles des éléments du graphique
  nodeColor(d: any) {
      if (d.todo.isDone) {
          return "var(--is-done-color-node)";
      } else if (d.todo.config.date && TodoDate.passedDate(d.todo)) {
          return "var(--ion-color-danger)";
      } else {
          const levelShade = (d.level * 150) + 100;
          if (levelShade > 700) return 'var(--ion-color-step-700)';
          return 'var(--ion-color-step-' + levelShade + ')';
      }
  }

  sizeNode(d: any) {
      return d.todo.main ? 12 : 10;
  }

  emojiNode(d: any) {
      let emoji = '';
      if (d.todo.isDone) emoji += '✅';
      if (d.todo.config.date) emoji += TodoDate.passedDate(d.todo) ? '⏰' : '📅';
      if (d.todo.config.repeat && d.todo.reminder) emoji += '🔁';
      if (d.todo.priority == 'high') emoji += '‼️';
      if (d.todo.priority == 'medium') emoji += '❗';
      if (d.todo.priority == 'low') emoji += '❕';
      return emoji;
  }


  onClickCircle(event: any, d: any) {
      console.log('On click circle:', d);

      d3.selectAll('.node').classed('selected', false); 

      if (d.todo == this.selectedTodo) {
          this.selectedTodo = this.mainTodo;

          // Put the selected class to highlight the fisrt node on the graph

          d3.select('.node').classed('selected', true);
      }
      else{
          this.selectedTodo = d.todo;

          // Ajouter la classe selected pour mettre en évidence le nœud sélectionné
          d3.select(event.target).classed('selected', true);
      }

      // TODO : Renvoyé selectedTodo à la page todo

      this.todoSelectedEmitter.emit(this.selectedTodo);
  }


  // Fonction pour gérer le clic sur les nœuds
  onDoubleClickCircle(event: any, d: any) {
      // Logique pour gérer le clic sur un nœud
      console.log('On click circle:', d);

      // Développer ou réduire les sous-tâches
      this.toggleSubTodos(d);

      this.updateGraph();
  }


  // Fonction pour ajouter ou retirer les sous-tâches
  toggleSubTodos(d: any) {
    for (let subTodo of d.todo.list!) {
        if (this.graphData.nodes.find((node: any) => node.id == subTodo.subId)) {
            d.todo.developped = false;
            this.graphData.nodes = this.graphData.nodes.filter((node: any) => node.id != subTodo.subId);
            this.graphData.links = this.graphData.links.filter((link: any) => link.target.id != subTodo.subId);
            this.removeSubTodos(subTodo);
        } else {
            d.todo.developped = true;
            this.graphData.nodes.push({ id: subTodo.subId, level: d.level + 1, todo: subTodo,});
            this.graphData.links.push({ source: d.id, target: subTodo.subId });
            if (subTodo.developped) this.addSubTodos(subTodo, d.level + 1);
        }
    }
  }

  // Fonctions pour ajouter et retirer des sous-tâches
  addSubTodos(todo: Todo, level: number) {
    for (let subTodo of todo.list!) {
        this.graphData.nodes.push({ id: subTodo.subId, level: level + 1, todo: subTodo});
        this.graphData.links.push({ source: todo.subId, target: subTodo.subId });
        if (subTodo.developped) this.addSubTodos(subTodo, level + 1);
    }
  }

  removeSubTodos(todo: Todo) {
    for (let subTodo of todo.list!) {
        this.graphData.nodes = this.graphData.nodes.filter((node: any) => node.id != subTodo.subId);
        this.graphData.links = this.graphData.links.filter((link: any) => link.target.id != subTodo.subId);
        this.removeSubTodos(subTodo);
    }
  }


  // UPDATE GRAPH
  // Mise à jour du graphique
  updateGraph() {
    this.updateLink();
    this.updateCircle();
    this.updateEmoji();
    this.updateText();
    this.updateSimulation();
  }

  updateLink() {
    this.link = this.link.data(this.graphData.links, (d: any) => d.target.id);
    this.link.exit().remove();
    this.link = this.link.enter().append("line")
        .merge(this.link)
        .attr("stroke-width", 2)
        .attr("stroke", "var(--ion-color-step-700)");

    console.log(this.link)
  }

  updateCircle() {
    this.circle = this.circle.data(this.graphData.nodes, (d: any) => d.id);
    this.circle.exit().remove();
    this.circle = this.circle.enter().append("circle")
        .merge(this.circle)
        .attr("r", this.sizeNode)
        .attr("fill", this.nodeColor)
        .attr("stroke", "var(--ion-color-step-700)")
        .attr("class", "node")
        .call(this.initializeDrag())
        .on("click", this.onClickCircle.bind(this))
        .on("dblclick", this.onDoubleClickCircle.bind(this));

    console.log(this.circle)
  }

  updateEmoji() {
    this.nodeIcon = this.nodeIcon.data(this.graphData.nodes, (d: any) => d.id);
    this.nodeIcon.exit().remove();
    this.nodeIcon = this.nodeIcon.enter().append("text")
        .merge(this.nodeIcon)
        .text(this.emojiNode)
        .attr('font-size', '10px')
        .attr('letter-spacing', '-3px');
  }

  updateText() {
    this.text = this.text.data(this.graphData.nodes, (d: any) => d.id);
    this.text.exit().remove();
    this.text = this.text.enter().append("text")
        .merge(this.text)
        .attr("class", "node-label")
        .text((d: any) => d.todo.title);
  }

  updateSimulation() {

    console.log("UPDATE SIMULATION : ")

    this.simulation.stop();

    this.simulation
        .nodes(this.graphData.nodes)
        .force("link").links(this.graphData.links)
          
    this.simulation.alpha(1).restart();
  }


  // GRAPH RESIZE ON SCROLL

  public resizeGraph(newHeight: number): void {

    const width = window.innerWidth - 8;

    this.svg.attr('height', newHeight - 8);

    // Recentrer la force de gravité au milieu du nouveau conteneur
    this.simulation
      .force('center', d3.forceCenter(width / 2, newHeight / 2))
      .alpha(0.3).restart();
  }

  
}

