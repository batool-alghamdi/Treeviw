let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");

context.strokeStyle = "black";
context.font = "12px Times New Roman";

let radius = 25;
let counter = 1;
let maxChild = 0;

let collapse = [];
let nodeAttribute = [];
let root = document.getElementsByTagName("body")[0];

var button = document.getElementById("save");
button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
});

node = {
  tag: root,
  position: { x: canvas.width / 2,
  y: 30 },
  isOpen: true,
  openButtonPath: null,
  depth: 0,
  parent: null,
  children: createTree(root)
};

let path = new Path2D();
drawTree();

function drawTree() {
  context.beginPath();
  context.arc(node.position.x, node.position.y, radius, 0, Math.PI * 2);
  context.fillText(node.tag.nodeName, node.position.x - 20, node.position.y, 33);
  context.strokeStyle = "black";
  context.stroke();
  node.openButtonPath=addButton(node.position.x, node.position.y, node);
  counter = 1;
  if (node.isOpen) drawChildren(node, 2);
}

function drawChildren(tree, level) {
  let Y = tree.position.y + 100;
  let X = tree.position.x - radius * (maxChild / counter) +33;

  for (let i = 0; i < tree.children.length; i++) {
    let tag = tree.children[i].tag;
    if (tag.nodeName === "#text") continue;

    drawNode(X, Y, tag, tree, i);
    tree.children[i].valuesButtonPath = addAttribute(X, Y);

    if (tag.firstChild !== null && tag.firstChild.nodeType === Node.TEXT_NODE) {
      drawText(X, Y, tag, tree, i);
    }

    if (tag.childNodes.length>0 && tag.firstChild !== null && tag.firstChild.nodeType !== Node.TEXT_NODE) {
      tree.children[i].openButtonPath = addButton(X, Y);
      counter++;
      console.log(tree.isOpen);
    if (tree.children[i].isOpen) 
    drawChildren(tree.children[i], level + 1);
    } else {
      console.log(`No ${tag.nodeName}`);
    }
    X += 100;
  }
  console.log(level);
}

function createTree(rootNode) {
  let nodes = [];
  if (rootNode.hasChildNodes) {
    if (rootNode.childNodes.length > maxChild) {
      maxChild = rootNode.childNodes.length;
    }
    for (let i = 0; i < rootNode.childNodes.length; i++) {
      if (rootNode.childNodes.item(i).nodeName !== "#text") {
        let currentNode = {
          tag: rootNode.childNodes.item(i),
          parent: rootNode,
          position: { x: 0, y: 0 },
          isOpen: true,
          openButtonPath: null,
          valuesButtonPath: null,
          children: createTree(rootNode.childNodes.item(i)),
        };
        nodes.push(currentNode);
      } else if (rootNode.childNodes.item(i).nodeType === Node.TEXT_NODE) {
        let currentNode = {
          tag: rootNode.childNodes.item(i),
          parent: rootNode,
          position: { x: 0, y: 0 },
          isOpen: true,
          openButtonPath: null,
          valuesButtonPath: null,
          children: [],
        };
        nodes.push(currentNode);
      }
    }
  }
  return nodes;
}

function drawNode(X, Y, tag, tree, i) {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "black";
  context.arc(X, Y, radius, 0, Math.PI * 2);
  context.moveTo(X, Y - radius);
  context.lineTo(tree.position.x, tree.position.y + radius);
  context.stroke();

  tree.children[i].position = { x: X, y: Y };
  context.fillText(tag.nodeName, X - 15, Y, 54);

  context.closePath();
}

function drawText(X, Y, tag, tree, i) {
  let context = canvas.getContext("2d");
  context.fillText(tag.firstChild.textContent, X - 30, Y - 50, 33);
  context.beginPath();
  context.moveTo(X - 25, Y - 50);
  context.lineTo(
    tree.children[i].position.x,
    tree.children[i].position.y - radius
  );
  context.stroke();
  context.strokeRect(X - 30, Y - 65, 40, 20);
  context.strokeStyle = "black";
  context.closePath();
}

function addButton(X,Y) {
  let context = canvas.getContext("2d");

  path = new Path2D();
  context.strokeRect(X - 30, Y - 20, 15, 15);
  context.fillStyle = "black";
  context.fillText("+", X - 25, Y - 8, 33);
  path.rect(X - 30, Y - 23, 10, 10);
  
  collapse.push(path);
  return collapse.length - 1;
}

function addAttribute(X,Y) {
  let context = canvas.getContext("2d");
  path = new Path2D();
  
  context.strokeRect(X - 30,Y -3 , 15, 15);
  context.fillStyle = "black";
  context.fillText("...",X - 28,Y+5, 54);
  path.rect(X - 30,Y - 5, 10, 10);
  nodeAttribute.push(path);
  return nodeAttribute.length - 1;
}

function searchForCollapsePath(root, coords) {
  for (let i = 0; i < root.children.length; i++) {
    if (
      root.children[i].openButtonPath !== null &&
      context.isPointInPath(
        collapse[root.children[i].openButtonPath],
        coords.x,
        coords.y
      )
    ) {
      
      root.children[i].isOpen = !root.children[i].isOpen;
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawTree();
      return;
    } else if (root.children[i].children.length) {
      searchForCollapsePath(root.children[i], coords);
    }
  }
}

function searchForValuePath(root, coords) {
  for (let i = 0; i < root.children.length; i++) {
    if (
      root.children[i].valuesButtonPath !== null &&
      context.isPointInPath(
        nodeAttribute[root.children[i].valuesButtonPath],
        coords.x,
        coords.y
      )
    ) {
      let attributes = root.children[i].tag.attributes;
      if (attributes.length == 0) {
        alert("No attributes");
      } else {
        let strAtr = "";
        for (let i = 0; i < attributes.length; i++) {
          strAtr += ` ${attributes[i].nodeName} : `;
          strAtr += ` ${attributes[i].nodeValue} \n`;
        }
        console.log(strAtr);
        alert(strAtr);
      }
      return;
    } else if (root.children[i].children.length) {
      console.log(root.children[i]);
      searchForValuePath(root.children[i], coords);
    }
  }
}


function getCoordinates(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const x = event.clientX - rect.left;
  return { x: x, y: y };
}

document.addEventListener(
  "click",
  function (e) {
    const coords = getCoordinates(canvas, e);
    if (context.isPointInPath(collapse[node.openButtonPath], coords.x, coords.y)) {
      node.isOpen = !node.isOpen;
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawTree();
      return;
    } else {
      searchForCollapsePath(node, coords);
    }
    searchForValuePath(node, coords);
  },
  false
);