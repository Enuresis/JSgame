export class Vector {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }
  
    add(other) {
      return new Vector(this.x + other.x, this.y + other.y);
    }
  
    subtract(other) {
      return new Vector(this.x - other.x, this.y - other.y);
    }
  
    multiply(other) {
      return new Vector(this.x * other, this.y * other);
    }
  
    divide(other) {
      return new Vector(this.x / other, this.y / other);
    }
  
    dot(other) {
      return this.x * other.x + this.y * other.y;
    }
  
    magnitude() {
      return Math.sqrt(this.dot(this));
    }
  
    normalize() {
      const mag = this.magnitude();
      return mag > 0 ? this.divide(mag) : new Vector();
    }
  
    reflect(normal) {
      return this.subtract(normal.multiply(2 * this.dot(normal)));
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    scale(other) {
      return new Vector(this.x * other,this.y * other)
    }
  }