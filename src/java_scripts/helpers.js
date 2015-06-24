function unjoin(dir) {
  console.log('to_unjoin: ' + to_unjoin);
  var edge = to_unjoin;
  var obj = null;
  if (dir == 'left') {
    obj = edge[0];
    obj.line1 = edge[3];
    obj.line2 = edge[1];
    obj.line3 = null;
    obj.selectable = true;
  } else {
    obj = edge[2];
    obj.line1 = null;
    obj.line2 = edge[1];
    obj.line3 = edge[3];
    obj.selectable = true;
  }
  obj.setCoords();
  for (var i = 0; i < joined_objects.length; i ++) {
    if ((joined_objects[i][1] === obj) || (joined_objects[i][2] === obj) ) {
      joined_objects[i] = [null, null, null, null];
    }
  }
  console.log(joined_objects);
  
}

function get_corresponding_edge(obj) {
  for (var i = 0; i < boundary_edges.length; i ++) {
    if ((obj == boundary_edges[i][0]) || (obj == boundary_edges[i][2]) || (obj == boundary_edges[i][1])) {
      return boundary_edges[i];
    }
  }
  return null;
}


function join(items) {
var join_obj1 = null;
var join_obj2 = null;
var join_obj3 = null;
var dir = null;

for (var i = 0; i < items.length; i ++) {
  if(items[i].name == "p0") { 
    dir = 'left';
    join_obj1 = items[i];
  }
  if (items[i].name == "p2") {
    dir = 'right';
    join_obj1 = items[i];
  }
  if ((items[i].name != "p0") || (items[i].name != "p2") ) {
    join_obj3 = items[i];
  }
}


var edge = get_corresponding_edge(join_obj1);
join_obj2 = edge[3];

joined_objects.push([join_obj3, join_obj1, join_obj2, dir]);
join_obj3.on('moving', function (options) {
        var x=join_obj3.getLeft();
        var y=join_obj3.getTop();
     
        for (var i = 0; i < joined_objects.length; i ++) {
          if (joined_objects[i][0] === join_obj3) {
            joined_objects[i][1].left = x;
            joined_objects[i][1].top = y;
       
            if (joined_objects[i][3] == 'left') {
              joined_objects[i][2].path[0] = ["M", x, y];
             } else {
              joined_objects[i][2].path[1] = ["Q", 100, 100, x, y];
            }
          }
        }
        canvas.renderAll();
});

  
}
