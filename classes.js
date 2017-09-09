class Vector2d
{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

Vector2d.prototype.add = function(otherVector)
{
	this.x += otherVector.x;
	this.y += otherVector.y;
}
Vector2d.prototype.sub = function(otherVector)
{
	this.x -= otherVector.x;
	this.y -= otherVector.y;
}
Vector2d.prototype.mul = function(number)
{
	this.x *= number;
	this.y *= number;
}

class Platform {
	constructor(p, s, m, ix1, ix2) {
		this.pos = p;//new Vector2d(px, py);
		this.size = s;//new Vector2d(sx, sy);
		this.moveStatus = m; // 0-static, 1-left, 2-right
		this.interval = {x1: ix1, x2: ix2};
	}
}

class Earning {
	constructor(p, r) {
		this.pos = p;
		this.size = new Vector2d(10, 10);
		this.reward = r;
	}
}

class Entity {
	constructor(p, s, hp) {
		this.pos = p;
		this.size = s;
		this.vel = new Vector2d(0, 0);
		this.hp = hp;
		this.maxhp = hp;
	}
}
