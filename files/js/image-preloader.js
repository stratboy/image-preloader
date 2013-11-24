//inspiration: https://github.com/FiNGAHOLiC/jquery.imgpreloader

//params:
//to_load (array of strings): images paths
//event_handlers (object): { 'load': function(image, index, perc, loaded_array, broken_array){}, [...] }

//event_handlers args:
//"first": image, perc
//"loading": index, loaded array, broken array
//"load": image, index, perc, loaded array, broken array
//"error": image, index, loaded array, broken array
//"complete": index, loaded array, broken array

var ImagePreloader = function(to_load, event_handlers) {
  if(!to_load || to_load.length === 0) return false;
  this.to_load = to_load;
  this.event_handlers = event_handlers;
  this.events = ['onfirst','onloading','onload','oncomplete','onerror'];
  $.each(this.events,function(index,event){
    this[event] = $.Callbacks();
  }.bind(this));

  this.sizes = [];
  this.accurate = false;
  this.bytes_total = 0;
  this.bytes_loaded = 0;
  this.loaded_images = [];
  this.broken_images = [];

  this.init();
};

ImagePreloader.prototype = {

  init:function(to_load,event_handlers){
    var deferreds = [];

    $.each(this.to_load,function(index,item){
      deferreds.push(
        $.ajax({
          type: "HEAD",
          url: item
        })
      );
    }.bind(this));

    $.when.apply($,deferreds).done(function(){
      $.each(arguments,function(index,item){
        var size = parseInt(item[2].getResponseHeader('Content-Length'));
        if(!size) return false;//the server doesn't return Content-Length header
        this.sizes.push(size);
        this.bytes_total += size;
      }.bind(this));

    }.bind(this)).fail(function(){
      $.each(deferreds,function(index,ajax){ ajax.abort(); });//end all running requests
    }).always(this.start.bind(this));
  },//end init


  start:function(){
    if(this.sizes.length == this.to_load.length) this.accurate = true;

    if(this.event_handlers){
      this.add_events(this.event_handlers);
      //So I've already got event handlers: I can start preloading
      this.preload(0);
    }
  },

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
      this.oncomplete.fire(index-1,this.loaded_images,this.broken_images);
    } else {
      this.load_image(index);
    }
  },

  load_image:function(index){

    this.onloading.fire(index,this.loaded_images,this.broken_images);

    $('<img>').on('load', function(e){

      var image = $(e.target);
      this.loaded_images.push(image);

      var ratio = null;
      if(this.accurate){
        this.bytes_loaded += this.sizes[index];
        ratio = Math.floor((this.bytes_loaded/this.bytes_total)*10)/10;
      } else {
        ratio = Math.floor((index+1) / this.to_load.length * 100);
      }

      this.onload.fire(image, index, ratio, this.loaded_images, this.broken_images);
      if(index === 0) this.onfirst.fire(image, ratio);

      this.preload(index+1);

    }.bind(this)).on('error', function(e){
      var image = $(e.target);
      this.broken_images.push(image);

      this.onerror.fire(image,index,this.loaded_images,this.broken_images);

      this.preload(index+1);

    }.bind(this)).attr('src', this.to_load[index]);

  }//end load_image

};//end ImagePreloader

