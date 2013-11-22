# image-preloader

## A simple jquery sequential image preloader

This was first inspirated by [imgpreloader](https://github.com/FiNGAHOLiC/jquery.imgpreloader)

The main 2 differences are sequential preloading and (when possible) more accurate progress/percentage tracking.

### Basic usage

```javascript

var files = ["files/images/img1.png","files/images/img2.png","files/images/img3.png"];

var preloader = new ImagePreloader(files,{
	'load':function(image,index,perc,loaded_array,loaded_array){
		console.log(image,index,perc);
	},
	'complete':function(index,loaded_array,loaded_array){
		console.log('complete!');
	}
});

```

And so on.. It has also events listeners for 'first' (first file has loaded), 'loading' (before a file starts loading), 'error'

Please see source. I'll write more accurate docs.


