var City = function (){
    var loader = new THREE.OBJMTLLoader();
    var load = function (object) {
        var scale = chroma.scale(['red', 'green', 'blue']);
        setRandomColors(object, scale);
        mesh = object;
        scene.add(mesh);
    };

    function setRandomColors(object, scale) {
        var children = object.children;
    
        if (children && children.length > 0) {
            children.forEach(function (e) {
                setRandomColors(e, scale)
            });
        } else {
            // no children assume contains a mesh
            if (object instanceof THREE.Mesh) {
    
                object.material.color = new THREE.Color(scale(Math.random()).hex());
                if (object.material.name.indexOf("building") == 0) {
                    object.material.emissive = new THREE.Color(0x444444);
                    object.material.transparent = false;
                    object.material.opacity = 0.8;
                }
            }
        }
    }

    var texture = THREE.ImageUtils.loadTexture('./assets/textures/metro01.JPG');
    //texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    loader.load('./assets/models/city.obj', './assets/models/city.mtl', load);
}

