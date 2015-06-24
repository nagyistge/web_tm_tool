function add_connector(canvas) {
  draw_q_arc(canvas);
}

// ----------------------- Add boundary part ---------------------------------

function make_curve_circle(left, top, line1, line2, line3, dir) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    radius: 10,
    fill: '#d80000',
  });


  var text = new fabric.IText(dir, {
    fontFamily: 'Courier New',
    left: left,
    top: top,
    fontSize: 16,
    fill: '#ffff00'
  });

  g = new fabric.Group([c, text]);
  g.hasBorders = true;
  g.hasControls = false;

  g.line1 = line1;
  g.line2 = line2;
  g.line3 = line3;

  return g;
}


function make_curve_point(left, top, line1, line2, line3, text) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    radius: 2,
    fill: '#fff',
  });

  var text = new fabric.IText(text, {
    fontFamily: 'Courier New',
    left: left,
    top: top,
    fontSize: 16,
    fill: '#000000'
  });

  g = new fabric.Group([c, text]);
  
  g.hasBorders = g.hasControls = false;

  g.line1 = line1;
  g.line2 = line2;
  g.line3 = line3;

  return g;
}

function add_boundary(canvas) {
  draw_q_arc(canvas);
}

function draw_q_arc(canvas, bounding_obj_to_join, other_object) {

  var line = new fabric.Path('M 65 0 Q 100, 100, 300, 100', { fill: '', stroke: 'black' });

  line.path[0][1] = 100;
  line.path[0][2] = 100;

  line.path[1][1] = 200;
  line.path[1][2] = 200;

  line.path[1][3] = 300;
  line.path[1][4] = 100;

  //line.selectable = false;
  canvas.add(line);

  var p1 = make_curve_point(200, 145, null, line, null, 'Connector')
  p1.threats = [];
  p1.threats.push(['Snooping', 'Component is vulnerable to snooping', 'yes'])
  p1.name = "p1";
  canvas.add(p1);

  var p0 = make_curve_circle(100, 100, line, p1, null, 'L');
  p0.name = "p0";
  canvas.add(p0);

  var p2 = make_curve_circle(300, 100, null, p1, line, 'R');
  p2.name = "p2";
  canvas.add(p2);

  line.name = "line";

  shapes.push(p0);
  shapes.push(p1);
  shapes.push(p2);
  shapes.push(line);
  connectors.push(line);
  boundary_edges.push([p0, p1, p2, line, 0, 0]);
}


// --------------------------------------------------------------------------------

function add_file_store(canvas) {

var text = new fabric.IText("File store", {
    fontFamily: 'Courier New',
    left: 0,
    top: 0,
    fontSize: 16,
    fill: '#000000'
});

var rect = new fabric.Rect({
    width: 100,
    height: 100,
    fill: '#ffcc12',
    opacity: 1
});

var group = new fabric.Group([rect, text]);
canvas.add(group);
canvas.centerObject(group);
group.setCoords();
group.threats = [];
group.threats.push(['Snooping', 'Component is vulnerable to snooping', 'yes'])
shapes.push(group);
}

function add_process(canvas) {
var circle = new fabric.Circle({ radius: 50, fill: "#ffcc12" });

var text = new fabric.IText("Process", {
    fontFamily: 'Courier New',
    left: 0,
    top: 0,
    fontSize: 16,
    fill: '#000000'
});

circle.set('selectable', true);
circle.name = "circle";
var group = new fabric.Group([circle, text]);
group.threats = [];
group.threats.push(['Snooping', 'Component is vulnerable to snooping', 'yes'])
canvas.add(group);
canvas.centerObject(group);
group.setCoords();
shapes.push(group);
}

function init(obj) {
  if (canvas == null) {
    var iw = $('#canvas').innerWidth();
    var ih = $('#canvas').innerHeight();

    canvas = new fabric.Canvas('canvas', { width: iw, height: ih , style:'float:left' });

    canvas.perPixelTargetFind = true;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    
    canvas.on({
      'object:selected': on_obj_selected,
      'object:moving': on_obj_moving,
      'before:selection:cleared': on_obj_before_selection_cleared,
      'selection:cleared': on_obj_selection_cleared,
      'mouse:up': on_mouse_up,
    });
  }

  if (obj == "connector") {
    add_connector(canvas);
  }

  if (obj == "filestore") {
    add_file_store(canvas);
  }

  if (obj == "process") {
    add_process(canvas);
  }

  if (obj == "boundary") {
    add_boundary(canvas);
  }
  if (obj == "breakright") {
    unjoin('right');
  }
  if (obj == 'breakleft') {
    unjoin('left');
  }

}

function get_obj_with_name(group, name) {
  var objs = group.getObjects();
  for(var i = 0; i < objs.length; i ++) {
    if (objs[i].name == name) {
      return objs[i];
    }
  }
}

function get_obj_with_type(group, t) {
  var objs = group.getObjects();
  for(var i = 0; i < objs.length; i ++) {
    console.log(objs[i].type);
    if (objs[i].get('type') == t) {
      return objs[i];
    }
  }
}

function clear_input(e) {
  console.log(e.val);
  e.value = '';
}
function remove_threat(obj, threat) {
  for (var i = 0; i < obj.threats.length; i++) {
    if (obj.threats[i][1] == threat) {
      obj.threats.pop(i);
    }
  }
}
function delete_row(e) {
  var obj = canvas.getActiveObject();
  console.log(obj);
  var threat_desc = $(e).text();
  remove_threat(obj, threat_desc);
  display_properties(obj);
}
function wrap_input_box(name, data) {

  var input_box = "<input class='input_box' onClick='clear_input(this);' id='" + name + "' value='" + data + "'></input>";
  return input_box;
}

function add_threat() {
  var threat_type = $('#threat_type').val();
  var threat_desc = $('#threat_desc').val();
  var mitigated = document.getElementById("mit_input").checked;
  var obj = canvas.getActiveObject();
  obj.threats.push([threat_type, threat_desc, mitigated]);
  display_properties(obj);
}

function save_obj() {
  var grp = canvas.getActiveObject();
  var t_obj = get_obj_with_type(grp, 'i-text');
  var obj_name = $('#comp_name').val();
  t_obj.text = obj_name;
}

function display_properties(obj) {
  $('#properties').empty();
  var t_obj = get_obj_with_type(obj, 'i-text');
  var nont_obj = get_obj_with_type
  

  var td_begin = "<td class='td' onClick='delete_row(this);'>";
  var tr_begin = "<tr class='tr'>";
  var td_end = "</td>";
  var tr_end = "</tr>";
  var table_begin = "<table style='width:100%'>";
  var table_end = "</table>";
  var tb = td_end + td_begin;
  var mit_input_checked = '<input id="mit_result" class="mit" type="checkbox" checked></input>';
  var mit_input_unchecked = '<input id="mit_result" class="mit" type="checkbox"></input>';
  var mit_query = '<input id="mit_input" class="mit" type="checkbox">Mitigated?</input>';
  var submit = '<button type="button" onclick="add_threat();">Submit</button>';
  var save = '<button type="button" onclick="save_obj();">Save</button>';

  var combo_box = table_begin + tr_begin + td_begin + 'Number' + tb + 'Type' + tb + 'Description' + tb + 'Mitigated?' + td_end + tr_end;
  var save_para = '<p>Save</p>';
  var add_new_threat_para = '<p>Add new threat:</p>';
  var cname_para = '<p>Component name:</p>';
  var threats_para = '<p>Threats:</p>';

  $('#properties').append(cname_para);
  $('#properties').append(wrap_input_box('comp_name', t_obj.text));
  $('#properties').append(threats_para);

  var num = 1;
  for (var i = 0; i < obj.threats.length; i ++) {
    var threat = obj.threats[i]
    var mitigated = threat[2];
    var mit_result;
    if(mitigated == true) {
      mit_result = mit_input_checked;
    } else {
      mit_result = mit_input_unchecked;
    }
    var table_row = tr_begin + td_begin + num + tb + threat[0] + tb + threat[1] + tb + mit_result + td_end + tr_end;
    combo_box = combo_box + table_row;
    num ++;
  }
  combo_box = combo_box + table_end;
  $('#properties').append(combo_box);
  
  $('#properties').append(add_new_threat_para);
  $('#properties').append(wrap_input_box('threat_type', 'Threat type'));
  $('#properties').append(wrap_input_box('threat_desc', 'Threat description'));
  $('#properties').append(mit_query);
  $('#properties').append(submit);

  $('#properties').append(save_para);
  $('#properties').append(save);
  
}
