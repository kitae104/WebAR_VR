var createScene = function () {
    // ======== 기본 씬 설정 ========
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.12, 1.0);
    const canvas = engine.getRenderingCanvas();

    // ======== 카메라 설정 ========
    const camera = new BABYLON.ArcRotateCamera("cam",
        0, // 정면을 보도록 alpha 값을 0으로 수정
        BABYLON.Tools.ToRadians(80), // 약간 낮은 각도로 조정
        18, // 조금 더 가깝게 조정
        new BABYLON.Vector3(0, 1.2, 0),
        scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 40;
    camera.wheelPrecision = 50;

    // ======== 조명 추가 ========
    // 장면 전체를 밝혀줄 기본 조명을 추가합니다.
    const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.7; // 조명 강도 설정

    // ======== 바닥 및 벽 생성 ========
    // 바닥 재질
    const groundMat = new BABYLON.PBRMaterial("groundMat", scene);
    groundMat.albedoColor = new BABYLON.Color3.FromHexString("#C8B8A8");
    groundMat.roughness = 0.5;
    
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 16 }, scene);
    ground.material = groundMat;
    ground.receiveShadows = true;

    // 벽 재질
    const wallMat = new BABYLON.PBRMaterial("wallMat", scene);
    wallMat.albedoColor = new BABYLON.Color3.FromHexString("#F0F0F0");
    wallMat.roughness = 0.8;

    const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: 20, height: 8, depth: 0.2 }, scene);
    backWall.position.set(0, 4, -8);
    backWall.material = wallMat;
    backWall.receiveShadows = true;

    const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: 16, height: 8, depth: 0.2 }, scene);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 4, 0);
    leftWall.material = wallMat;
    leftWall.receiveShadows = true;
    
    return scene;
}