import { TodoColor } from "./todo-color";
import { TodoDate } from "./todo-date";


// TODO : clear function and fix node-modal

function onClickCircleModal(event : any, d : any, lastSelectedNode : any){

    var nodeId = d.id;

    let pathAr = window.location.pathname.split('/');

    // TODO : not securized depends on tabs in path

    if (pathAr.length > 4) {
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
      nodeCategory!.style.color = TodoColor.getCorrectTextColor(d.todo.category.color);
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
      nodeDate!.setAttribute('value', TodoDate.formatDateToCustomString(d.todo)!);

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
      nodeDate!.setAttribute('value', TodoDate.formatDateToCustomString(d.todo)!);

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
        //   onClickCircle(event, d);
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
        //   onClickCircle(event, d);
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
      // let modalHeader = document.getElementById("modal-header");
      // modalHeader!.classList.add('doneHeader');

      let nodeValidateIcon = document.getElementById("node-done-icon");
      nodeValidateIcon!.classList.remove('hide');

      let nodeValidateButton = document.getElementById("node-validate-button");
      nodeValidateButton!.classList.add('hide');

      let nodeUnvalidateButton = document.getElementById("node-unvalidate-button");
      nodeUnvalidateButton!.classList.remove('hide');

      let nodePriority = document.getElementById("node-priority");
      nodePriority!.classList.add('hide');

      let nodePassedIcon = document.getElementById("node-passed-icon");
      nodePassedIcon!.classList.add('hide');
    }
    else{
      // let modalHeader = document.getElementById("modal-header");
      // modalHeader!.classList.remove('doneHeader');

      let nodeValidateIcon = document.getElementById("node-done-icon");
      nodeValidateIcon!.classList.add('hide');


      let nodeValidateButton = document.getElementById("node-validate-button");
      nodeValidateButton!.classList.remove('hide');

      let nodeUnvalidateButton = document.getElementById("node-unvalidate-button");
      nodeUnvalidateButton!.classList.add('hide');

      if (d.todo.config.priority){
        let nodePriority = document.getElementById("node-priority");
        nodePriority!.classList.remove('hide');

        if (d.todo.priority == 'high'){
          let nodePriorityIcon = document.getElementById("node-priority-icon") as HTMLIonIconElement;
          nodePriorityIcon!.color = 'danger';
        }
        else if (d.todo.priority == 'medium'){
          let nodePriorityIcon = document.getElementById("node-priority-icon") as HTMLIonIconElement;
          nodePriorityIcon!.color = 'warning';
        }
        else if (d.todo.priority == 'low'){
          let nodePriorityIcon = document.getElementById("node-priority-icon") as HTMLIonIconElement;
          nodePriorityIcon!.color = 'medium';
        }
      }
      else{
        let nodePriority = document.getElementById("node-priority");
        nodePriority!.classList.add('hide');
      }

      if (TodoDate.passedDate(d.todo)) {
        let nodePassedIcon = document.getElementById("node-passed-icon");
        nodePassedIcon!.classList.remove('hide');
      }
      else{
        let nodePassedIcon = document.getElementById("node-passed-icon");
        nodePassedIcon!.classList.add('hide');
      }
      
    }

    modal!.classList.remove('close-modal');
  }



  