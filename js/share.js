let config = {}
let STATE = {}
let SF = {} // shared functions

SF.BYID = function(id){ return document.getElementById(id) }
SF.cloneObj = function(obj){ return JSON.parse(JSON.stringify(obj))}
SF.generateUUIDv4 = function() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
SF.move_form_html =`
<form class="nodrag" name="move_resize_form" >
    <button type="button" name="close">Close</button><br>
    width: <input class="resize_inputs" type="number" name="width" value="">
    height: <input class="resize_inputs" type="number" name="height" value="">
    X: <input class="resize_inputs" type="number" name="x" value="">
    Y: <input class="resize_inputs" type="number" name="y" value="">
    <button type="button" name="save">Save</button>
    <button type="button" name="reset">Reset</button>
</form>
`


if (document.getElementById("top_panel")) {
    SF.top_panel = document.getElementById("top_panel")

    SF.hoverbarShowPanel = function(){
        //console.log("showpanel");
        SF.top_panel.style.top = "0px"
    }
    SF.hoverbarHidePanel = function(){
        //console.log("hidepanel");

        SF.top_panel.style.top = "-30px"
    }



}


if (document.getElementById("hoverbar")) {
    SF.hoverbar = document.getElementById("hoverbar")

    SF.hoverbar.addEventListener("mouseenter",SF.hoverbarShowPanel)
    SF.top_panel.addEventListener("mouseleave",SF.hoverbarHidePanel)
}

if (document.getElementById("resize_move_button")) {
    SF.resize_move_button = document.getElementById("resize_move_button")
    SF.move_resize_control = document.getElementById("move_resize_control")
    SF.move_resize_control.innerHTML = SF.move_form_html
    SF.handleMoveResize = function(){
        console.log("window_move_resize");
        lsh.send("hud_window",{
            type:"window_move_resize",
            hudid: hudid,
            data:{
            x:parseInt(document.move_resize_form.x.value) ,
            y:parseInt(document.move_resize_form.y.value) ,
            width:parseInt(document.move_resize_form.width.value) ,
            height:parseInt(document.move_resize_form.height.value)
            }
        })
    }

    fromMain.position_size_update = function(data){
        console.log("position_size_update",data);
        document.move_resize_form.width.value = data.bounds.width
        document.move_resize_form.height.value =  data.bounds.height
        document.move_resize_form.x.value =  data.bounds.x
        document.move_resize_form.y.value =  data.bounds.y
        // pass along the update if the huds code wants it
        if (fromMain.position_size_update_pass){ fromMain.position_size_update_pass(data)  }
    }
    SF.showResizeMoveControl = function(){
        SF.move_resize_control.style.display = " block"
    }
    SF.hideResizeMoveControl = function(){
        SF.move_resize_control.style.display = " none"
    }
    SF.saveMoveResize = function(){
        console.log("saveMoveResize");
    }
    SF.resetMoveResize = function(){
        console.log("resetMoveResize");
    }
    // menu and main button listeners
    SF.resize_inputs = SF.move_resize_control.getElementsByClassName("resize_inputs");
    for (var i = 0; i < SF.resize_inputs.length; i++) {
        SF.resize_inputs[i].addEventListener("change", SF.handleMoveResize);
    }
    document.move_resize_form.save.addEventListener("click", SF.saveMoveResize);
    document.move_resize_form.reset.addEventListener("click", SF.resetMoveResize);
    document.move_resize_form.close.addEventListener("click",SF.hideResizeMoveControl)



    SF.resize_move_button.addEventListener("click",SF.showResizeMoveControl)
    //

}
