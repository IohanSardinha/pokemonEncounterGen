class CanvasObject{
    constructor(x,y, width, height, context, move_function, values){
        this.position = {
            'x':x,
            'y':y
        };

        this.size = {
            'width':width,
            'height':height
        }
        this.move_function = move_function | null;
        this.context = context;
        this.values = values | null;
        this.originalPosition = [x,y];
    }

    resetPosition(){
        this.position.x = this.originalPosition[0];
        this.position.y = this.originalPosition[1];
    }


    draw(total_time, delta_time){
        if(this.move_function)
            this.move_function(total_time, delta_time);
        this.display();
    }
}

class Sprite extends CanvasObject{
    constructor(x,y, width, height ,src, context, move_function, values){
        super(x,y,width,height, context, move_function, values);
        this.image = new Image();
        this.image.src = src;
    }

    display(){
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.drawImage(this.image,0,0,this.size.width,this.size.height);
        this.context.restore();
    }

}

class Rectangle extends CanvasObject{
    constructor(x,y, width, height, color, context, move_function, values){
        super(x,y,width,height, context, move_function, values);
        this.color = color;
    }

    display(){
        this.context.beginPath();
        this.context.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.context.fill();
    }
}

class CanvasText extends CanvasObject{
    constructor(x,y, text, font, context, move_function, values){
        super(x,y, null, null, context, move_function, values);
        this.text = text;
        this.font = font;
    }

    display(){
        this.context.font = this.font;
        this.context.fillText(this.text, this.position.x, this.position.y);
    }
}