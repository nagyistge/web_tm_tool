function on_obj_selected(e) {
  var obj = e.target;
  on_quad_selected(e);
  display_properties(obj);
}

function on_obj_moving(e) {
  on_quad_moving(e);
}

function on_obj_before_selection_cleared(e) {
  on_quad_before_selection_cleared(e);
}

function on_obj_selection_cleared(e) {
  $('#properties').empty();
}


function on_quad_selected(e) {
  var activeObject = e.target;

  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.line2.animate('opacity', '1', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.line2.selectable = true;
  } else {
    activeObject.sendToBack();
  }
  if (activeObject.name == "p1") {
    var edge = get_corresponding_edge(activeObject);
    edge[0].bringToFront();
    edge[2].bringToFront();

    to_unjoin = edge;
  }
}

function on_quad_before_selection_cleared(e) {
  var activeObject = e.target;
  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.line2.animate('opacity', '0', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.line2.selectable = false;
  }
  else if (activeObject.name == "p1") {
    activeObject.animate('opacity', '0', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.selectable = false;
  }
}

function on_quad_moving(e) {
  if (e.target.name == "p0" || e.target.name == "p2") {
    var p = e.target;

    if (p.line1) {
      p.line1.path[0][1] = p.left;
      p.line1.path[0][2] = p.top;
    }
    else if (p.line3) {
      p.line3.path[1][3] = p.left;
      p.line3.path[1][4] = p.top;
    }
    e.target.bringToFront();
  }
  else if (e.target.name == "p1") {
    var p = e.target;

    if (p.line2) {
      p.line2.path[1][1] = p.left;
      p.line2.path[1][2] = p.top;
    }
  }
  else if (e.target.name == "p0" || e.target.name == "p2") {
    var p = e.target;

    p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
    p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
    p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
    p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
  }

  if ((e.target.name != "p0") || (e.target.name != "p2")) {
    e.target.sendToBack();
  }
}

function on_mouse_up(event) {
  var items = canvas.getObjects();
  var items_on_pos = [];
  var pointer = [];
  pointer = canvas.getPointer(event.e);
  for (var i = 0; i < items.length; i ++) {
    if (items[i].containsPoint(new fabric.Point(pointer.x, pointer.y))) {
      items_on_pos.push(items[i]);
    }
  }

  if (items_on_pos.length >= 2) {
    join(items_on_pos, 'left');
  }
}
 
