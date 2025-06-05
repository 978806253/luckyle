class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.sunCount = 50;
        this.lifeCount = 3;
        this.selectedPlant = null;
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.suns = [];
        this.gameOver = false;
        
        this.grid = {
            rows: 5,
            cols: 9,
            cellSize: 80
        };
        
        // 加载图片
        this.images = {
            sunflower: new Image(),
            peashooter: new Image(),
            zombie: new Image(),
            sun: new Image(),
            wallnut: new Image(),
            snowpea: new Image(),
            chomper: new Image()
        };
        
        this.images.sunflower.src = 'assets/sunflower.svg';
        this.images.peashooter.src = 'assets/peashooter.svg';
        this.images.zombie.src = 'assets/zombie.svg';
        this.images.sun.src = 'assets/sun.svg';
        this.images.wallnut.src = 'assets/wallnut.svg';
        this.images.snowpea.src = 'assets/snowpea.svg';
        this.images.chomper.src = 'assets/chomper.svg';
        
        this.init();
    }
    
    init() {
        // 初始化事件监听
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        document.querySelectorAll('.plant-card').forEach(card => {
            card.addEventListener('click', () => this.selectPlant(card.dataset.plant));
        });
        
        // 开始游戏循环
        this.gameLoop();
        
        // 定期生成阳光
        setInterval(() => this.generateSun(), 10000);
        
        // 定期生成僵尸
        setInterval(() => this.generateZombie(), 15000);

        // 定期更新植物卡片状态
        setInterval(() => this.updatePlantCards(), 100);
    }
    
    selectPlant(plantType) {
        const costs = {
            sunflower: 50,
            peashooter: 100,
            wallnut: 50,
            snowpea: 175,
            chomper: 150
        };
        
        const cost = costs[plantType];
        
        // 如果点击已选中的植物，取消选择
        if (this.selectedPlant === plantType) {
            this.selectedPlant = null;
            this.canvas.classList.remove('plant-selected');
            document.querySelectorAll('.plant-card').forEach(card => {
                card.classList.remove('selected');
            });
            return;
        }

        // 如果阳光足够，选择植物
        if (this.sunCount >= cost) {
            this.selectedPlant = plantType;
            this.canvas.classList.add('plant-selected');
            
            // 更新卡片选中状态
            document.querySelectorAll('.plant-card').forEach(card => {
                if (card.dataset.plant === plantType) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
        }
    }

    updatePlantCards() {
        const costs = {
            sunflower: 50,
            peashooter: 100,
            wallnut: 50,
            snowpea: 175,
            chomper: 150
        };

        document.querySelectorAll('.plant-card').forEach(card => {
            const cost = costs[card.dataset.plant];
            if (this.sunCount < cost) {
                card.classList.add('disabled');
            } else {
                card.classList.remove('disabled');
            }
        });
    }
    
    handleCanvasClick(event) {
        if (this.gameOver) {
            this.restartGame();
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 检查是否点击了阳光
        this.suns = this.suns.filter(sun => {
            if (Math.abs(sun.x - x) < 30 && Math.abs(sun.y - y) < 30) {
                this.sunCount += 25;
                document.getElementById('sunCount').textContent = this.sunCount;
                return false;
            }
            return true;
        });
        
        // 如果选择了植物，尝试种植
        if (this.selectedPlant) {
            const col = Math.floor(x / this.grid.cellSize);
            const row = Math.floor(y / this.grid.cellSize);
            
            if (col >= 0 && col < this.grid.cols && row >= 0 && row < this.grid.rows) {
                const costs = {
                    sunflower: 50,
                    peashooter: 100,
                    wallnut: 50,
                    snowpea: 175,
                    chomper: 150
                };
                const cost = costs[this.selectedPlant];
                
                if (this.sunCount >= cost) {
                    this.plants.push({
                        type: this.selectedPlant,
                        x: col * this.grid.cellSize,
                        y: row * this.grid.cellSize,
                        health: 100,
                        lastShot: 0,
                        lastChomp: 0
                    });
                    this.sunCount -= cost;
                    document.getElementById('sunCount').textContent = this.sunCount;
                    this.selectedPlant = null;
                    this.canvas.classList.remove('plant-selected');
                    document.querySelectorAll('.plant-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                }
            }
        }
    }
    
    generateSun() {
        this.suns.push({
            x: Math.random() * (this.canvas.width - 60) + 30,
            y: 0,
            speed: 1
        });
    }
    
    generateZombie() {
        this.zombies.push({
            x: this.canvas.width,
            y: Math.floor(Math.random() * this.grid.rows) * this.grid.cellSize,
            health: 100,
            speed: 0.5,
            frozen: false,
            frozenTime: 0
        });
    }
    
    update() {
        if (this.gameOver) return;

        // 更新阳光位置
        this.suns.forEach(sun => {
            sun.y += sun.speed;
        });
        
        // 更新僵尸位置
        this.zombies.forEach(zombie => {
            if (zombie.frozen) {
                zombie.frozenTime--;
                if (zombie.frozenTime <= 0) {
                    zombie.frozen = false;
                }
            } else {
                zombie.x -= zombie.speed;
            }

            // 检查僵尸是否到达最左边
            if (zombie.x <= 0) {
                this.lifeCount--;
                document.getElementById('lifeCount').textContent = this.lifeCount;
                this.zombies = this.zombies.filter(z => z !== zombie);
                
                if (this.lifeCount <= 0) {
                    this.gameOver = true;
                }
            }
        });
        
        // 更新植物状态
        this.plants.forEach(plant => {
            if (plant.type === 'sunflower' && Math.random() < 0.01) {
                this.suns.push({
                    x: plant.x + 40,
                    y: plant.y,
                    speed: 1
                });
            }
            
            if (plant.type === 'peashooter' || plant.type === 'snowpea') {
                const now = Date.now();
                if (now - plant.lastShot > 2000) {
                    const zombieInRow = this.zombies.find(zombie => 
                        Math.abs(zombie.y - plant.y) < this.grid.cellSize &&
                        zombie.x > plant.x
                    );
                    
                    if (zombieInRow) {
                        this.projectiles.push({
                            x: plant.x + 40,
                            y: plant.y + 20,
                            speed: 5,
                            type: plant.type
                        });
                        plant.lastShot = now;
                    }
                }
            }

            if (plant.type === 'chomper') {
                const now = Date.now();
                if (now - plant.lastChomp > 5000) {
                    const zombieInRange = this.zombies.find(zombie => 
                        Math.abs(zombie.y - plant.y) < this.grid.cellSize &&
                        Math.abs(zombie.x - plant.x) < 60
                    );
                    
                    if (zombieInRange) {
                        zombieInRange.health = 0;
                        plant.lastChomp = now;
                    }
                }
            }
        });
        
        // 更新子弹位置
        this.projectiles.forEach((projectile, index) => {
            projectile.x += projectile.speed;
            
            // 检查子弹是否击中僵尸
            this.zombies.forEach((zombie, zombieIndex) => {
                if (Math.abs(projectile.x - zombie.x) < 30 &&
                    Math.abs(projectile.y - zombie.y) < 30) {
                    zombie.health -= 20;
                    if (projectile.type === 'snowpea') {
                        zombie.frozen = true;
                        zombie.frozenTime = 100;
                    }
                    this.projectiles.splice(index, 1);
                    
                    if (zombie.health <= 0) {
                        this.zombies.splice(zombieIndex, 1);
                    }
                }
            });
        });
    }
    
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#666';
        for (let i = 0; i <= this.grid.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.grid.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.grid.cellSize);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.grid.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.grid.cellSize, 0);
            this.ctx.lineTo(i * this.grid.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 绘制植物
        this.plants.forEach(plant => {
            const img = this.images[plant.type];
            this.ctx.drawImage(img, plant.x + 10, plant.y + 10, 60, 60);
        });
        
        // 绘制僵尸
        this.zombies.forEach(zombie => {
            this.ctx.drawImage(this.images.zombie, zombie.x - 30, zombie.y + 10, 60, 60);
            if (zombie.frozen) {
                this.ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
                this.ctx.fillRect(zombie.x - 30, zombie.y + 10, 60, 60);
            }
        });
        
        // 绘制子弹
        this.projectiles.forEach(projectile => {
            this.ctx.fillStyle = projectile.type === 'snowpea' ? '#87CEEB' : 'green';
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 绘制阳光
        this.suns.forEach(sun => {
            this.ctx.drawImage(this.images.sun, sun.x - 15, sun.y - 15, 30, 30);
        });

        // 如果游戏结束，显示游戏结束画面
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('点击屏幕重新开始', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }
    
    restartGame() {
        this.sunCount = 50;
        this.lifeCount = 3;
        this.selectedPlant = null;
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.suns = [];
        this.gameOver = false;
        
        document.getElementById('sunCount').textContent = this.sunCount;
        document.getElementById('lifeCount').textContent = this.lifeCount;
        
        document.querySelectorAll('.plant-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 当页面加载完成后启动游戏
window.addEventListener('load', () => {
    new Game();
}); 