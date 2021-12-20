const centerOfMass = (function () {
    
    function loadImage(element) {
        if (typeof window.FileReader !== 'function') {
            write("This browser doesn't support the File API");
            return;
        }

        var file = element.files[0];
        var fr = new FileReader();
        fr.onload = createImageObject;
        fr.readAsDataURL(file);
    }

    function createImageObject() {
        var image = new MarvinImage();
        image.load(this.result, createCanvas);
    }
    
    function createCanvas() {
        var canvas = document.createElement('canvas');
        canvas.height = this.height;
        canvas.width = this.width;
        this.draw(canvas);

        var dimensions = getDimensionsIgnoringBg(this);
        var coords = getAreaCenter([0, 0, dimensions.width, dimensions.height]);
        
        drawDotAtCoords(coords, canvas, this.width);

        var resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';
        resultDiv.appendChild(canvas);
    }

    function getDimensionsIgnoringBg(image) {
        var lastX, lastY = 0;

        for(var y=0; y < image.getHeight(); y++) {
            for(var x=0; x< image.getWidth(); x++) {
                var r = image.getIntComponent0(x,y);
                var g = image.getIntComponent1(x,y);
                var b = image.getIntComponent2(x,y);
                
                if(r !== 250 && g !== 250 && b !== 250){
                    lastX = x;
                    lastY = y;
                }
            }
        }

        return { width: lastX, height: lastY };
    }

    function getAreaCenter(coordsArray) {
        var center = [];
       
        var coord,
            minX = maxX = parseInt(coordsArray[0], 10),
            minY = maxY = parseInt(coordsArray[1], 10);
        for (var i = 0, l = coordsArray.length; i < l; i++) {
            coord = parseInt(coordsArray[i], 10);
            if (i%2 == 0) { 
                if (coord < minX) {
                    minX = coord;
                } else if (coord > maxX) {
                    maxX = coord;
                }
            } else { 
                if (coord < minY) {
                    minY = coord;
                } else if (coord > maxY) {
                    maxY = coord;
                }
            }
        }
        center = [parseInt((minX + maxX) / 2, 10), parseInt((minY + maxY) / 2, 10)];
    
        return(center);
    }

    function drawDotAtCoords(coords, canvas, imageWidth) {
        var dotSize = getDotSize(imageWidth);
        var redDot = drawRedDot(dotSize);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(redDot, coords[0], coords[1]);
    }

    function getDotSize(width) {
        return (width * 5) / 100;
    }

    function drawRedDot(size) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, size, size);

        return canvas;
    }
    
    return { loadImage }
})();