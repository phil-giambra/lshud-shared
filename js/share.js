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
    width: <input class="resize_inputs" type="number" name="width" value=""><br>
    height: <input class="resize_inputs" type="number" name="height" value=""><br>
    X: <input class="resize_inputs" step="1" type="number" name="x" value=""><br>
    Y: <input class="resize_inputs" step="1" type="number" name="y" value=""><br>
    <button type="button" name="save">Save</button>
    <button type="button" name="reset">Reset</button>
</form>
`
SF.switch_box_html =`
<label class="switch">
    <input id="replace_id" class="switch-input replace_class" type="checkbox" replace_checked/>
    <span class="switch-label" data-on="On" data-off="Off"></span>
    <span class="switch-handle"></span>
</label>
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
        let valid = true
        let bdata = {
            x:parseInt(document.move_resize_form.x.value) ,
            y:parseInt(document.move_resize_form.y.value) ,
            width:parseInt(document.move_resize_form.width.value) ,
            height:parseInt(document.move_resize_form.height.value)
        }
        console.log(bdata);
        for (let i in bdata) {
            if( String(bdata[i]) == 'NaN' ){ valid = false }
        }
        if (valid === false) {
            console.log("resize input error");
            bdata = null
        }
        lsh.send("hud_window",{
            type:"window_move_resize",
            hudid: hudid,
            data:bdata
        })
    }

    fromMain.position_size_update = function(data){
        //console.log("position_size_update",data);
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


// this function can be used to apply changes to your hud config
// this can be added as an event listener to input elemnets
// the id of the input should follow the form hudid_key_name
// (eg. lshud-volume_active or myhudid_is_hidden)
// read this function as well as  handleHudSettingChange in the main.js file
// of linux-system-hud to see which changes are handled and how they are applied
SF.handleHudSettingChange = function(event) {
    let input_id
    if (typeof(event) === "string") { input_id = event }
    else { input_id = event.target.id  }
    console.log("handleHudSettingChange", input_id );
    let parts = input_id.split("_")
    let hid = parts.shift()
    let value
    let itype = SF.BYID(input_id).type
    if (itype === "checkbox") {
        value = SF.BYID(input_id).checked
    }
    else if (itype === "number") {
        value = parseInt(SF.BYID(input_id).value)
        if (String(value) === "NaN") {
            console.log("handleHudSettingChange --- invalid number input" );
            return;
        }
    }
    else {
        value = SF.BYID(input_id).value
    }

    let sets = {
        hudid:hid,
        key:parts.join("_"),
        value: value
    }
    lsh.send("hud_window",{ type:"setting_change", hudid: hudid,  change:sets })
}
