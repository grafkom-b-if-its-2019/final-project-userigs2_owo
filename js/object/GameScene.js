var playerBody, playerMesh;
var mass = 5, radius = 1.3;
var building;
var topCamera;

var cityBlocks = [  [110, 100, 0, 10, 100, 100],  // I s e l
                    [-110, 100, 0, 10, 100, 100], // n i   l
                    [0, 100, -110, 100, 100, 10], // v b w
                    [0, 100, 110, 100, 100, 10],  // i l a
                    [-100, 5, 0, 10, 5, 100],     // Wall West
                    [100, 5, 0, 10, 5, 100],      // Wall East
                    [0, 5, 100, 100, 5, 10],      // Wall South
                    [0, 5, -100, 100, 5, 10],     // Wall North
                    [50, 10, -20, 50, 10, 5],
                    [-90, 10, 0, 35, 10, 5],  
                    [85, 4, 0, 5, 4, 5],            // L
                    [80, 3, 0, 5, 3, 5],            // A 
                    [80, 2, 5, 5, 2, 5],            // D
                    [80, 1, 10, 5, 1, 5],           // D  E   R
                    [-18, 10, 50, 15, 10, 50],
                    [30, 5, 20, 30, 5, 20],
                    [0, 25, -48, 18, 25, 18],       // Skyscrapper
                    [-25, 5, -15, 20, 5, 10],
                    [-45, 10, -25, 5, 5, 50],
                    [-60, 20, -25, 5, 10, 15],
                    [-53, 5, -25, 5, 5, 15],
                    [60, 20, 20, 5, 10, 35]];

var sec = 0,sekon=0;
var frame = 0;
var spawnInterval = Math.round(Math.random()) + 1;
var lastSpawned = 0;
// var rS = new rStats();
                    
function InitWorld(){
    //Setup World
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;

    solver = new CANNON.GSSolver();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    
    solver.iterations = 7;
    solver.tolerance = 0.1;
    split = true;
    if(split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0,-25,0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, 
        physicsMaterial, 0.0, 0.0);
    
    // Add material to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create Plane
    groundShape = new CANNON.Plane();
    groundBody = new CANNON.Body({mass: 0, collisionFilterGroup:g[1],collisionFilterMask:g[0]|g[2]});
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.addBody(groundBody);
}

function InitScene(){
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    topCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 1000);
    topCamera.up.set(0,0,-1);

    scene = new THREE.Scene();

    ///////////////////////////////////////////////////////////////////////////////// Skybox /////////////////////////////////////////////////////////////////////////////////////////////
    var sky = new THREE.BoxGeometry(1024, 1024, 1024, 1,1,1);
    var skyMaterials = [
        // back side
        new THREE.MeshBasicMaterial({
          map: new THREE.ImageUtils.loadTexture('assets/textures/skybox/back.png'),
          side: THREE.DoubleSide
        }),
        // front side
        new THREE.MeshBasicMaterial({
          map: new THREE.ImageUtils.loadTexture('assets/textures/skybox/front.png'),
          side: THREE.DoubleSide
        }), 
        // Top side
        new THREE.MeshBasicMaterial({
          map: new THREE.ImageUtils.loadTexture('assets/textures/skybox/top.png'),
          side: THREE.DoubleSide
        }), 
        // Bottom side
        new THREE.MeshBasicMaterial({
          map: new THREE.ImageUtils.loadTexture('assets/textures/skybox/bot.png'),
          side: THREE.DoubleSide
        }), 
        // right side
        new THREE.MeshBasicMaterial({
          map: new THREE.ImageUtils.loadTexture('assets/textures/skybox/right.png'),
          side: THREE.DoubleSide
        }), 
        // left side
        new THREE.MeshBasicMaterial({
          map: new THREE.ImageUtils.loadTexture('assets/textures/skybox/left.png'),
          side: THREE.DoubleSide
        }) 
      ];
  
    var skyMaterial = new THREE.MeshFaceMaterial(skyMaterials);
    var skyMesh = new THREE.Mesh(sky, skyMaterial);
    scene.add(skyMesh);

    ///////////////////////////////////////////////////////////////////////////////// Light //////////////////////////////////////////////////////////////////////////////////////////////

    ambient = new THREE.AmbientLight( 0x111111);
    scene.add(ambient);

    var light = new THREE.SpotLight( 0xffffff );
    light.castShadow = true;
    light.position.set(90,200,0);
    light.target.position.set(0,0,0);
    light.intensity = 1;
    
    scene.add(light);
    light.shadowMapWidth = 512;
    light.shadowMapHeight = 512;  

    ///////////////////////////////////////////////////////////////////////////////// Ground /////////////////////////////////////////////////////////////////////////////////////////////

    var geoPlane = new THREE.PlaneGeometry( 200, 200, 1, 1);
    geoPlane.applyMatrix(new THREE.Matrix4().makeRotationX( -Math.PI / 2));
    var grassTexture = THREE.ImageUtils.loadTexture('./assets/textures/grass01.jpg');

    var planeMaterial = new THREE.MeshPhongMaterial({map: grassTexture});
    planeMaterial.map.wrapS = planeMaterial.map.wrapT = THREE.RepeatWrapping;
    planeMaterial.map.repeat.set(300,300);
    planeMesh = new THREE.Mesh(geoPlane, planeMaterial);

    planeMesh.castShadow = true;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);
  
    ///////////////////////////////////////////////////////////////////////////////// Building /////////////////////////////////////////////////////////////////////////////////////////////
    for(var i=0; i<cityBlocks.length; i++) {
        new CityBuilding(
            cityBlocks[i][0],
            cityBlocks[i][1],
            cityBlocks[i][2],
            cityBlocks[i][3],
            cityBlocks[i][4],
            cityBlocks[i][5],
            i)
    }
    // /////////////////////////////////////////////////////////////////////////////////////Audio//////////////////////////////////////////////////////////////////////////////////////////////
    // var listener=new THREE.AudioListener();
    // scene.add(listener);
    // var sound = new THREE.Audio( listener );
    // sound.load('sound/Bug Maze.mp3');
    // sound.autoplay=true;
    // sound.setLoop(true);
    // scene.add(sound);
}

function InitGameObject(){
    InitPlayer();

    controls = new PointerLockControls(camera, playerBody);
    scene.add(controls.getObject());

    InitEnemy();
    InitSpider();

}

function SceneUpdate(){
    if(controls.enabled){
        world.step(dt);

        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);

        BulletMovement();

        frame += 1;

        if(frame == 15){
            frame = 0;
            sec = sec + 1/4;
            sekon+=1;
            
            if((sekon -lastSpawned) == spawnInterval){
                lastSpawned = sekon;
                spawnInterval = Math.round(Math.random())+1;

                // console.log("spawn interval: " + spawnInterval);

                SpawnEnemyRandom();
            }
        }
    }
    
    for(var i=0; i<enemyBodies.length; i++) {
        UpdateEnemy(i);
    }
    // console.log("spider: " + SpiderBody.position.x);
    // for(var i=0; i<SpiderBodies.length; i++) {
    //     UpdateSpider(i);
    // }
    document.getElementById("score").innerHTML="Score<br>" + score +"<br>Time<br>" + Math.floor(sec);
    
    controls.update( Date.now() - time );
    topCamera.lookAt(new THREE.Vector3(playerMesh.position.x, 0, playerMesh.position.z));
    topCamera.position.set(playerMesh.position.x, playerMesh.position.y+50, playerMesh.position.z)
    topCamera.updateProjectionMatrix();
    
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render( scene, camera );
    renderer.setViewport(window.innerWidth*4/5, 0, window.innerWidth/5, window.innerWidth/5);
    renderer.render( scene, topCamera);
    time = Date.now();
}