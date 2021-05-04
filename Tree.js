let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = 40;
let lineLength = 50;
let angel = 30;
let radius = 30;
let incX = 8.5;
let incY = 7.3;
let counter = 0;
ctx.strokeStyle = "black";
ctx.font = "10px sans-serif";
let root = document.getElementsByTagName("body")[0];
node = {
  tag: root,
  position: { x: x, y: y },
  children: createTree(root),
  parent: null,
  depth: 0,
};
let NodeTree = [];
//  (root) => {
//   for (let i = 0; i < root.childNodes.length; i++) {
//     if (root.childNodes.item(i).nodeName !== "#text")
//       node.children.push(NodeTree(root.childNodes.item(i)));
//   }
// };
const addNode = (node) => {
  NodeTree.push(node);
};
// for (let i = 0; i < root.childNodes.length; i++) {
//   if (root.childNodes.item(i).nodeName !== "#text") {
//     node.children.push(root.childNodes.item(i));
//   }
// }
//console.log(NodeTree(root));
//NodeTree.push(node);
ctx.beginPath();
ctx.arc(node.position.x, node.position.y, radius, 0, Math.PI * 2);
ctx.stroke();
drawTree(node);
function drawTree(tree) {
  let axisY = tree.position.y + 100;
  let axisX = x - radius * tree.children.length;
  //x -= radius * tree.children.length;
  for (let i = 0; i < tree.children.length; i++) {
    ctx.beginPath();
    ctx.arc(axisX, axisY, radius, 0, Math.PI * 2);
    tree.children[i].position = { x: axisX, y: axisY };
    ctx.fillText(tree.children[i].tag.nodeName, axisX - 15, axisY, 54);
    ctx.moveTo(axisX, axisY);
    ctx.lineTo(tree.position.x, tree.position.y);
    ctx.stroke();
    if (tree.children[i].tag.hasChildNodes) {
      drawTree(tree.children[i]);
    } else {
      console.log(`No ${tree.children[i].tag.nodeName}`);
    }
    axisX += 70;
  }
}
console.log(createTree(root));
function createTree(rootNode) {
  let nodes = [];
  if (rootNode.hasChildNodes) {
    for (let i = 0; i < rootNode.childNodes.length; i++) {
      if (rootNode.childNodes.item(i).nodeName !== "#text") {
        let currentNode = {
          tag: rootNode.childNodes.item(i),
          parent: rootNode,
          //depth: counter,
          position: { x: 0, y: 0 },
          children: createTree(rootNode.childNodes.item(i)),
        };
        nodes.push(currentNode);
        counter++;
      }
    }
  }
  return nodes;
}