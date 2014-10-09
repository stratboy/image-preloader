# image-preloader

## A simple jquery sequential image preloader

This was initially inspired by [imgpreloader](https://github.com/FiNGAHOLiC/jquery.imgpreloader)

The 2 main differences are:

- sequential preloading
- (when possible) more accurate progress/percentage tracking.

"When possible" because it checks Content-Length headers, but not always servers broadcast that header.
If Content-Length is available, every progress is accurate. Every image is represented by the right fraction of the overall size.
Otherwise, for ex. if I have 3 images, every image will represented as 1/3.



### Basic usage

```javascript

var files = ["files/images/img1.png","files/images/img2.png","files/images/img3.png"];

var preloader = new ImagePreloader(files,{
	'load':function(image_tag,index,perc,loaded_array,image_path,error){
		console.log(image_tag,image_path,index,perc);
	},
	'complete':function(index,loaded_array,loaded_array){
		console.log('complete!');
	}
});

```

And so on.. It has also events listeners for 'first' (first file has loaded), 'loading' (before a file starts loading), 'error'

You don't have to necessarily pass event handlers directly to the constructor.
Passing them to the constructor makes the ImagePreloader instance immediately start preloading passed images.
Otherwise, you will have to manually start the preloader.

```javascript

var files = ["files/images/img1.png","files/images/img2.png","files/images/img3.png"];

var preloader = new ImagePreloader(files);

preloader.add_event('complete',function(index,loaded_array,loaded_array){
	console.log('complete!');
});

/* or */

preloader.add_events({
	'first':function(image, perc){
		console.log('first loaded!');
	},
	'load':function(image_tag,index,perc,loaded_array,image_path,error){
		console.log(image_tag,image_path,index,perc);
	}
});

preloader.preload();

```



