var playerMesh;
var playerBody;
var score=0;

function InitPlayer(){
    // Player Body
    playerShape = new CANNON.Sphere(radius);
    playerBody = new CANNON.Body({mass:mass,collisionFilterGroup:g[0],collisionFilterMask:g[1]});
    playerBody.addShape(playerShape);
    playerBody.position.set(Math.random()*100-50,50,Math.random()*100-50);
    playerBody.linearDamping = 0.9;
    // Player Mesh
    var sphereGeometry = new THREE.SphereGeometry(radius);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
    playerMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    playerMesh.position.copy(playerBody.position);
    playerMesh.castShadow = true;
    playerMesh.receiveShadow = true;
    
    scene.add(playerMesh);
    world.addBody(playerBody);
    PlayerShoot();
}

function PlayerShoot(){
    var ballShape = new CANNON.Sphere(0.2);
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
    var shootDirection = new THREE.Vector3();
    var shootVelo = 90;
    var projector = new THREE.Projector();
    function getShootDir(targetVec){
        var vector = targetVec;
        targetVec.set(0,0,1);
        vector.unproject(camera)
        var ray = new THREE.Ray(playerBody.position, vector.sub(playerBody.position).normalize() );
        targetVec.copy(ray.direction);
    }

    window.addEventListener("click",function(e){
        if(controls.enabled==true){
            var x = playerBody.position.x;
            var y = playerBody.position.y;
            var z = playerBody.position.z;
            var ballBody = new CANNON.Body({ mass: 1,collisionFilterGroup:g[0],collisionFilterMask:g[1]|g[2]});
            ballBody.addShape(ballShape);
            var bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
            var ballMesh = new THREE.Mesh( ballGeometry, bulletMaterial );
            world.addBody(ballBody);
            scene.add(ballMesh);
            // ballBody.addEventListener('collide',function(){
            //     world.removeBody(ballBody);
            //     scene.remove(ballMesh);
            // });
            ballMesh.castShadow = true;
            ballMesh.receiveShadow = true;
            balls.push(ballBody);
            ballMeshes.push(ballMesh);
            getShootDir(shootDirection);
            ballBody.velocity.set(  shootDirection.x * shootVelo,
                                    shootDirection.y * shootVelo,
                                    shootDirection.z * shootVelo);

            // Move the ball outside the player sphere
            x += shootDirection.x * (playerShape.radius*1.02 + ballShape.radius);
            y += shootDirection.y * (playerShape.radius*1.02 + ballShape.radius);
            z += shootDirection.z * (playerShape.radius*1.02 + ballShape.radius);
            ballBody.position.set(x,y,z);
            ballMesh.position.set(x,y,z);
            score--;
            document.getElementById("score").innerHTML="Score :<br>" + score +"<br>Time :<br>"+ sec;
        }
    });
}

function BulletMovement(){
    for(var i=0; i<balls.length; i++){
        ballMeshes[i].position.copy(balls[i].position);
        ballMeshes[i].quaternion.copy(balls[i].quaternion);
        // for(j = 0;j<cityBlocks.length;j++){
        //     if(ballMeshes[i].position.x+0.2>=cityBlocks[j][0]-cityBlocks[j][3] && ballMeshes[i].position.x-0.2<=cityBlocks[j][0]+cityBlocks[j][3]){
        //         if(ballMeshes[i].position.y+0.2>=cityBlocks[j][1]-cityBlocks[j][4] && ballMeshes[i].position.y-0.2<=cityBlocks[j][1]+cityBlocks[j][4]){
        //             if(ballMeshes[i].position.z+0.2>=cityBlocks[j][2]-cityBlocks[j][5] && ballMeshes[i].position.z-0.2<=cityBlocks[j][2]+cityBlocks[j][5]){
        //                 scene.remove(ballMeshes[i]);
        //                 world.removeBody(balls[i]);
        //             }
        //         }
        //     }
        // }
        if(ballMeshes[i].position.x>=-300 && ballMeshes[i].position.x<=300){
            if(ballMeshes[i].position.z>=-300 && ballMeshes[i].position.z<=300){
                if(ballMeshes[i].position.y>=-1 && ballMeshes[i].position.y<=1){
                    scene.remove(ballMeshes[i]);
                    world.remove(balls[i]);
                    ballMeshes.splice(i,1);
                    balls.splice(i,1);
                    i--;
                }
            }
        }
        for(j=0;j<enemyMeshes.length;j++){
            if(ballMeshes[i].position.x + 1.4 >= enemyMeshes[j].position.x && ballMeshes[i].position.x - 1.4 <= enemyMeshes[j].position.x){
                if(ballMeshes[i].position.y + 1.4 >= enemyMeshes[j].position.y && ballMeshes[i].position.y - 1.4 <= enemyMeshes[j].position.y){
                    if(ballMeshes[i].position.z + 1.4 >= enemyMeshes[j].position.z && ballMeshes[i].position.z - 1.4 <= enemyMeshes[j].position.z){
                        scene.remove(ballMeshes[i]);
                        world.removeBody(balls[i]);
                        scene.remove(enemyMeshes[j]);
                        world.remove(enemyBodies[j]);
                        score++;
                        if(score>=0){
                            score=0;
                        }
                        document.getElementById("score").innerHTML="Score :<br>" + score +"<br>Time :<br>"+ sec;
                        ballMeshes.splice(i,1);
                        balls.splice(i,1);
                        enemyBodies.splice(j,1);
                        enemyMeshes.splice(j,1);
                        i--;
                        j--;
                    }
                }
            }
        }
    }
}