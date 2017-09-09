let canvas = document.getElementById('mainCanvas');
let context = canvas.getContext("2d");

function fitCanvasToScreen() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener('resize', fitCanvasToScreen);
window.addEventListener('keydown', keydownHandler);
window.addEventListener('keyup', keyupHandler);

let keyboardState = [];

function keyupHandler(event) {
	keyboardState[event.keyCode] = false;
}
function keydownHandler(event) {
	keyboardState[event.keyCode] = true;
}

let player, platforms = [], earnings = [];
let worldSize;

function init() {
	player = new Entity(new Vector2d(10, 10), new Vector2d(15, 15), 100);

	const maxi = 10, maxj = 7;
	for(let i = 1;i < maxi;++ i) {
		for(let j = 0;j < maxj;++ j) {
			if(Math.random() < 0.3) continue;

			let crd = new Vector2d(j*100 + Math.random()*20, i*70 + Math.random()*20);
			let size = new Vector2d(80, 7);
			platforms.push(new Platform(crd, size, i % 3, -100, (maxj+1) * 70));

			if(Math.random() < 0.8) continue;

			let ecrd = new Vector2d(crd.x + Math.random()*50, crd.y + Math.random()*50);
			earnings.push(new Earning(ecrd, 10));
		}
	}

	worldSize = new Vector2d(maxi * 100, maxj * 70);

	fitCanvasToScreen();
	renderFrame();
	simulate();
}

function collision(a, b) {
	return (a.pos.x + a.size.x >= b.pos.x && a.pos.x <= b.pos.x + b.size.x
		&& a.pos.y + a.size.y >= b.pos.y && a.pos.y <= b.pos.y + b.size.y)
}

function movePlatforms(dist) {
	for(let pltf of platforms) {
		if(pltf.moveStatus == 2) {
			pltf.pos.x += dist;
			if(pltf.pos.x > pltf.interval.x2) {
				pltf.pos.x -= dist;
				pltf.moveStatus = 1;
			}
		} else if(pltf.moveStatus == 1) {
			pltf.pos.x -= dist;
			if(pltf.pos.x < pltf.interval.x1) {
				pltf.pos.x += dist;
				pltf.moveStatus = 2;
			}
		}
	}
}

function simulate() {
	const GRAVITY = 0.4;
	const FRICTION_AIR = 0.95;
	//const FRICTION_PLATFORM = 0.80;

	movePlatforms(1);

	let above = [];
	let onPlatform = false;
	for(let i = 0;i < platforms.length;++ i) {
		above[i] = (player.pos.y + player.size.y <= platforms[i].pos.y);
		if(!onPlatform && collision(player, platforms[i])) onPlatform = true;
	}

	if(keyboardState[68] || keyboardState[39]) player.vel.x += 0.3;
	if(keyboardState[65] || keyboardState[37]) player.vel.x -= 0.3;

	if((keyboardState[87] || keyboardState[38]) && player.vel.y == 0) {
		player.vel.y -= 10;
	}
	//player.vel.mul(FRICTION_PLATFORM);
	player.vel.y += GRAVITY;

	if(onPlatform) {
	} else {
	}

	player.vel.mul(FRICTION_AIR);
	player.pos.add(player.vel);

	for(let i = 0;i < platforms.length;++ i) {
		if(player.pos.y + player.size.y >= platforms[i].pos.y && above[i]) {
			if(player.pos.x + player.size.x >= platforms[i].pos.x
				&& player.pos.x <= platforms[i].pos.x + platforms[i].size.x) {
				// collision
				player.vel.y = 0;
				console.log(platforms[i].pos.y);
				player.pos.y = platforms[i].pos.y - player.size.y;
				break;
			}
		}
	}

	for(let i = 0;i < earnings.length;++ i) {
		if(collision(player, earnings[i])) {
			player.hp += earnings[i].reward;
			if(player.hp > player.maxhp) player.hp = player.maxhp;
			earnings.splice(i, 1);
			-- i;
		}
	}

	if(player.pos.x < 0) player.pos.x = worldSize.x;
	if(player.pos.y < 0) player.pos.y = worldSize.y;
	if(player.pos.x > worldSize.x) player.pos.x = 0;
	if(player.pos.y > worldSize.y) player.pos.y = 0;

	setTimeout(simulate, 10);
}

function renderFrame() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "blue";
	context.fillRect(player.pos.x, player.pos.y, player.size.x, player.size.y);

	context.fillStyle = "black";
	for(let pltf of platforms) {
		context.fillRect(pltf.pos.x, pltf.pos.y, pltf.size.x, pltf.size.y);
	}

	const EARN_SIZE = 10;
	context.fillStyle = "yellow";
	for(let earn of earnings) {
		context.fillRect(earn.pos.x, earn.pos.y, earn.size.x, earn.size.y);
	}

	context.fillStyle = "red";
	let ratio = player.hp / player.maxhp;
	context.globalAlpha = 0.5;
	context.fillRect(10, 10, ratio * 200, 20);
	context.globalAlpha = 1;
	context.strokeRect(10, 10, 200, 20);

	window.requestAnimationFrame(renderFrame);
}

init();
