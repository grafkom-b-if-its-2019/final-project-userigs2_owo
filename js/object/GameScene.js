var playerBody, playerMesh;
var mass = 5, radius = 1.3;
var building;
var cityBlocks = [  [50, 10, -20, 50, 10, 5],
                    [-18, 10, 50, 15, 10, 50],
                    [30, 5, 20, 30, 5, 20],
                    [-25, 5, -15, 20, 5, 10],
                    [-43, 15, -5, 10, 5, 30]];

var sec = 0;
var frame = 0;
var spawnInterval = Math.floor(Math.random() * 3) + 1;
var lastSpawned = 0;
                    
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

    world.gravity.set(0,-20,0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, 
        physicsMaterial, 0.0, 0.3);
    
    // Add material to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create Plane
    groundShape = new CANNON.Plane();
    groundBody = new CANNON.Body({mass: 0});
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.addBody(groundBody);
}

function InitScene(){
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scene = new THREE.Scene();

    ambient = new THREE.AmbientLight( 0x111111);
    scene.add(ambient);

    light = new THREE.SpotLight( 0xffffff );
    light.position.set(100,100,0);
    light.target.position.set(0,0,0);

    if(true) {
        light.castShadow = true;

        light.shadowCameraNear = 20;
        light.shadowCameraFar = 50;
        light.shadowCameraFov = 40;
    }
    scene.add(light);
    

    // floor
    geoPlane = new THREE.PlaneGeometry( 300, 300, 1, 1);
    geoPlane.applyMatrix(new THREE.Matrix4().makeRotationX( -Math.PI / 2));
    var grassTexture = THREE.ImageUtils.loadTexture('./assets/textures/grass01.png');
    // var planeMaterial;
    // var textureLoader = new THREE.TextureLoader()
    // textureLoader.load( './assets/textures/grass01.png', function ( grassTexture ) {
        
    //     grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    //     grassTexture.offset.set( 0, 0 );
    //     grassTexture.repeat.set( 2, 2 );

        
    // } );
    planeMaterial = new THREE.MeshPhongMaterial({map: grassTexture});
    planeMesh = new THREE.Mesh(geoPlane, planeMaterial);
    

    planeMesh.castShadow = true;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);
}

function InitGameObject(){
    InitPlayer();

    controls = new PointerLockControls(camera, playerBody);
    scene.add(controls.getObject());

    for(var i=0; i<cityBlocks.length; i++) {
        new CityBuilding(
            cityBlocks[i][0],
            cityBlocks[i][1],
            cityBlocks[i][2],
            cityBlocks[i][3],
            cityBlocks[i][4],
            cityBlocks[i][5])
    }
    console.log('addada' + cityBlocks.length);

    InitEnemy();

}

function SceneUpdate(){
    if(controls.enabled){
        world.step(dt);

        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);

        BulletMovement();

        frame += 1;

        if(frame == 60){
            frame = 0;
            sec += 1;
            
            if((sec -lastSpawned) == spawnInterval){
                lastSpawned = sec;
                spawnInterval = Math.floor(Math.random() * 3);

                console.log("spawn interval: " + spawnInterval);

                SpawnEnemyRandom();
            }
        }
    }
    
    for(var i=0; i<enemyBodies.length; i++) {
        UpdateEnemy(i);
   }
    
    controls.update( Date.now() - time );
    
    renderer.render( scene, camera );
    time = Date.now();
}
