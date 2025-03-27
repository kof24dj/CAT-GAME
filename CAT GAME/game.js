let plane, enemies = [], bullets = [], explosions = [];
let score = 0;
const PLANE_SPEED = 5;
const BULLET_SPEED = 8;
const ENEMY_SPEED = 2;

// 圖片變數
let planeImg, enemyBlackLuImg, enemyRedDragonImg, enemyMoneyGhostImg;

function preload() {
    planeImg = loadImage('plane.png');
    enemyBlackLuImg = loadImage('enemy_blacklu.png');
    enemyRedDragonImg = loadImage('enemy_reddragon.png');
    enemyMoneyGhostImg = loadImage('enemy_moneyghost.png');
}

function setup() {
    createCanvas(600, 400);
    plane = new Plane();
}

function draw() {
    background(135, 206, 235); // Sky blue
    
    spawnEnemies();
    
    plane.update();
    plane.show();
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].show();
        if (bullets[i].offscreen()) {
            bullets.splice(i, 1);
            continue;
        }
    }
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].show();
        
        if (random() < 0.01) {
            enemies[i].shoot();
        }
        
        if (enemies[i].hits(plane)) {
            createExplosion(plane.x, plane.y);
            plane.health -= 10;
        }
        
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (enemies[i].hits(bullets[j])) {
                createExplosion(enemies[i].x, enemies[i].y);
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                break;
            }
        }
    }
    
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].update();
        explosions[i].show();
        if (explosions[i].finished()) {
            explosions.splice(i, 1);
        }
    }
    
    fill(0);
    textSize(16);
    text(`Score: ${score}`, 10, 20);
    text(`Health: ${plane.health}`, 10, 40);
    
    if (plane.health <= 0) {
        textSize(32);
        text("Game Over", width/2 - 80, height/2);
        noLoop();
    }
}

function spawnEnemies() {
    if (frameCount % 30 === 0) {
        let rand = random();
        let type;
        if (rand < 0.33) type = "blackLu";
        else if (rand < 0.66) type = "redDragon";
        else type = "moneyGhost";
        enemies.push(new Enemy(random(width), -20, type));
    }
}

function keyPressed() {
    if (key === ' ') {
        bullets.push(new Bullet(plane.x + 25, plane.y));
    }
}

class Plane {
    constructor() {
        this.x = width/2;
        this.y = height - 50;
        this.w = 50;
        this.h = 30;
        this.health = 100;
    }
    
    update() {
        if (keyIsDown(LEFT_ARROW)) this.x -= PLANE_SPEED;
        if (keyIsDown(RIGHT_ARROW)) this.x += PLANE_SPEED;
        if (keyIsDown(UP_ARROW)) this.y -= PLANE_SPEED;
        if (keyIsDown(DOWN_ARROW)) this.y += PLANE_SPEED;
        
        this.x = constrain(this.x, 0, width - this.w);
        this.y = constrain(this.y, 0, height - this.h);
    }
    
    show() {
        image(planeImg, this.x, this.y, this.w, this.h); // 只顯示圖片，不顯示文字
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 10;
    }
    
    update() {
        this.y -= BULLET_SPEED;
    }
    
    show() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.r);
        fill(255);
        textSize(8);
        text("AI", this.x - 4, this.y + 2);
    }
    
    offscreen() {
        return this.y < -this.r;
    }
}

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 30;
        this.type = type;
    }
    
    update() {
        this.y += ENEMY_SPEED;
    }
    
    show() {
        if (this.type === "blackLu") {
            image(enemyBlackLuImg, this.x, this.y, this.w, this.h); // 只顯示圖片
        } else if (this.type === "redDragon") {
            image(enemyRedDragonImg, this.x, this.y, this.w, this.h); // 只顯示圖片
        } else if (this.type === "moneyGhost") {
            image(enemyMoneyGhostImg, this.x, this.y, this.w, this.h); // 只顯示圖片
        }
    }
    
    shoot() {
        bullets.push(new EnemyBullet(this.x + this.w/2, this.y + this.h));
    }
    
    hits(obj) {
        let d = dist(this.x + this.w/2, this.y + this.h/2, obj.x + obj.w/2, obj.y + obj.h/2);
        return d < (this.w + obj.w)/2;
    }
}

class EnemyBullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 8;
    }
    
    update() {
        this.y += 3;
    }
    
    show() {
        fill(255, 165, 0);
        ellipse(this.x, this.y, this.r);
    }
    
    offscreen() {
        return this.y > height + this.r;
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 10;
        this.life = 20;
    }
    
    update() {
        this.size += 2;
        this.life--;
    }
    
    show() {
        noStroke();
        fill(255, 69, 0, this.life * 10);
        ellipse(this.x, this.y, this.size);
    }
    
    finished() {
        return this.life <= 0;
    }
}

function createExplosion(x, y) {
    explosions.push(new Explosion(x, y));
}