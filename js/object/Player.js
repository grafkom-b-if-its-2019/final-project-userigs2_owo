function InitPlayer(){
    // Create Sphere
    playerShape = new CANNON.Sphere(radius);
    playerBody = new CANNON.Body({mass:mass});
    playerBody.addShape(playerShape);
    playerBody.position.set(0,100,0);
    playerBody.linearDamping = 0.9;
    //Sphere
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
            var ballBody = new CANNON.Body({ mass: 1 });
            ballBody.addShape(ballShape);
            var ballMesh = new THREE.Mesh( ballGeometry, material );
            world.addBody(ballBody);
            scene.add(ballMesh);
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
        }
    });
}

function BulletMovement(){
    for(var i=0; i<balls.length; i++){
        ballMeshes[i].position.copy(balls[i].position);
        ballMeshes[i].quaternion.copy(balls[i].quaternion);
        for(j = 0;j<cityBlocks.length;j++){
            if(ballMeshes[i].position.x+0.2>=cityBlocks[j][0]-cityBlocks[j][3] && ballMeshes[i].position.x-0.2<=cityBlocks[j][0]+cityBlocks[j][3]){
                if(ballMeshes[i].position.y+0.2>=cityBlocks[j][1]-cityBlocks[j][4] && ballMeshes[i].position.y-0.2<=cityBlocks[j][1]+cityBlocks[j][4]){
                    if(ballMeshes[i].position.z+0.2>=cityBlocks[j][2]-cityBlocks[j][5] && ballMeshes[i].position.z-0.2<=cityBlocks[j][2]+cityBlocks[j][5]){
                        scene.remove(ballMeshes[i]);
                        world.removeBody(balls[i]);
                    }
                }
            }
        }
        console.log(ballMeshes[i].position.x);
        if(ballMeshes[i].position.x>=-300 && ballMeshes[i].position.x<=300){
            if(ballMeshes[i].position.z>=-300 && ballMeshes[i].position.z<=300){
                if(ballMeshes[i].position.y>=-1 && ballMeshes[i].position.y<=1){
                    scene.remove(ballMeshes[i]);
                    world.remove(balls[i]);
                }
            }
        }
    }
}