//inspiration: https://github.com/FiNGAHOLiC/jquery.imgpreloader

//params:
//to_load (array of strings): images paths
//event_handlers (object): { 'load': function(image, index, perc, loaded_array, broken_array){}, [...] }

//event_handlers args:
//"first": image, perc
//"loading": index, loaded array, broken array
//"load": image, index, perc, loaded array, broken array
//"error": image, index, loaded array, broken array
//"complete": indexx, loaded array, broken array

var ImagePreloader = function(to_load, event_handlers) {
  if(!to_load || to_load.length === 0) return false;
  this.init(to_load, event_handlers);
};

ImagePreloader.prototype = {

  init:function(to_load,event_handlers){

    this.to_load = to_load;
    this.events = ['onfirst','onloading','onload','oncomplete','onerror'];

    $.each(this.events,function(index,event){
      this[event] = $.Callbacks();
    }.bind(this));

    this.loaded = [];
    this.broken = [];

    if(event_handlers){
      this.add_events(event_handlers);
      //So I've already got event handlers: I can start preloading
      this.preload(0);
    }

  },//end init


  add_events:function(event_handlers){
    $.each(event_handlers,function(event,handler){
      this.add_event(event,handler);
    }.bind(this));
  },

  add_event:function(event,handler){
      if(!this['on'+event]) return false;
      this['on'+event].add(handler);
  },

  preload:function(index){
    var i = index || 0;

    if(index > this.to_load.length-1){
      this.oncomplete.fire(index-1,this.loaded,this.broken);
    } else {
      this.load_image(index);
    }
  },

  load_image:function(index){

    this.onloading.fire(index,this.loaded,this.broken);

    $('<img>').on('load', function(e){

      var image = $(e.target);
      this.loaded.push(image);

      this.onload.fire(image, index, Math.floor((index+1) / this.to_load.length * 100), this.loaded, this.broken);
      if(index === 0) this.onfirst.fire(image, Math.floor((index+1) / this.to_load.length * 100));

      this.preload(index+1);

    }.bind(this)).on('error', function(e){
      var image = $(e.target);
      this.broken.push(image);

      this.onerror.fire(image,index,this.loaded,this.broken);

      this.preload(index+1);

    }.bind(this)).attr('src', this.to_load[index]);

  }//end load_image

};//end ImagePreloader

