var Enemies = []
var posa=0,posb=0;
var enemyBodies = []
var enemyMeshes = []

function InitEnemy() {
    // placeholder
    SpawnEnemyRandom();
}

function SpawnEnemyRandom(){     
    var x=0,y=0,z=0;
    do{
        x = Math.round(Math.random())*75 - Math.round(Math.random())*75 + playerBody.position.x;     
        y = Math.random() * 25 + playerBody.position.y;     
        z = Math.round(Math.random())*75 - Math.round(Math.random())*75 + playerBody.position.z;     
    }while(x==playerBody.position.x&&z==playerBody.position.z)
    // x=75;y=50;z=0; 
    if(x>playerBody.position.x){
        posa=1;
    }else if(x<playerBody.position.x){
        posa=0;
    }else {
        posa=2;
    }
    if(z>playerBody.position.z){
        pob=1;
    }else if(z<playerBody.position.z){
        posb=0;
    }else {
        posb=2;
    }
    Enemies.push(new enemy(x,y,z)) 
}

// Area 1: 30 (min 0), 0, 69 (min 40)
// Area 2:

var enemy = function(x,y,z) {
    var a=0,b=0,vel=50;
    if(posa==0){
        a=vel;
    }
    if(posb==0){
        b=vel;
    }
    if(posa==1){
        a=-vel;
    }
    if(posb==1){
        b=-vel;
    }
    if(posa==2){
        a=0;
    }
    if(posb==2){
        b=0;
    }
    //placeholder model
    var EnemyShape = new CANNON.Sphere(1.3);
    var EnemyBody = new CANNON.Body({mass:5,collisionFilterGroup:g[2],collisionFilterMask:g[0]|g[1]});
    EnemyBody.addShape(EnemyShape);

    var EnemyGeometry = new THREE.SphereGeometry(EnemyShape.radius, 32, 32);
    var EnemyMaterial = new THREE.MeshPhongMaterial({color: '#ff0000'});    
    var EnemyMesh = new THREE.Mesh( EnemyGeometry, EnemyMaterial );

    EnemyMesh.castShadow = true;
    EnemyMesh.receiveShadow = true;
    
    EnemyBody.position.set(x,y,z);
    EnemyMesh.position.copy(EnemyBody.position);
    EnemyBody.velocity.set(a,0,b);
    
    // EnemyBody.linearDamping = 0.2;
    
    scene.add(EnemyMesh);
    world.addBody(EnemyBody);

    enemyBodies.push(EnemyBody);
    enemyMeshes.push(EnemyMesh);
}

function UpdateEnemy(i){
    enemyMeshes[i].position.copy(enemyBodies[i].position);
    enemyMeshes[i].quaternion.copy(enemyBodies[i].quaternion);
    if(enemyMeshes[i].position.x + 1.4 >= playerMesh.position.x && 
        enemyMeshes[i].position.x - 1.4 <= playerMesh.position.x){
        if(enemyMeshes[i].position.y + 1.4 >= playerMesh.position.y && 
            enemyMeshes[i].position.y - 1.4 <= playerMesh.position.y){
            if(enemyMeshes[i].position.z + 1.4 >= playerMesh.position.z && 
                enemyMeshes[i].position.z - 1.4 <= playerMesh.position.z){
                for(j=0;j<enemyMeshes.length;j++){
                    scene.remove(enemyMeshes[j]);
                    world.removeBody(enemyBodies[j]);
                }
                for(j=0;j<ballMeshes.length;j++){
                    scene.remove(ballMeshes[j]);
                    world.removeBody(balls[j]);
                }
                ballMeshes=[];
                balls=[];
                enemyMeshes=[];
                enemyBodies=[];
                scene.remove(playerMesh);
                world.removeBody(playerBody);
                controls.enabled = false;
                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';
                instructions.style.display = '';
                Restart();
                score=0;
                sec=0;
            }
        }
    }
}
