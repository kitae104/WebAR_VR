var createScene = function () {
    // ======== 기본 씬 설정 ========
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.12, 1.0);
    const canvas = engine.getRenderingCanvas();

    // ======== 카메라 설정 ========
    const camera = new BABYLON.ArcRotateCamera("cam",
        BABYLON.Tools.ToRadians(-60),
        BABYLON.Tools.ToRadians(75),
        15,
        new BABYLON.Vector3(0, 1.2, 0),
        scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 30;
    camera.wheelPrecision = 50;

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
    
    // ======== 가구 및 오브젝트 생성 ========
    // 소파
    const sofaMat = new BABYLON.PBRMaterial("sofaMat", scene);
    sofaMat.albedoColor = new BABYLON.Color3.FromHexString("#707070");
    sofaMat.roughness = 0.7;

    const sofaBase = BABYLON.MeshBuilder.CreateBox("sofaBase", {width: 6, height: 1.2, depth: 2.5}, scene);
    sofaBase.position.y = 0.6;
    
    const sofaBack = BABYLON.MeshBuilder.CreateBox("sofaBack", {width: 6, height: 1.5, depth: 0.5}, scene);
    sofaBack.position.set(0, 1.95, -1);

    const sofaArmLeft = BABYLON.MeshBuilder.CreateBox("sofaArmLeft", {width: 0.5, height: 0.8, depth: 2.5}, scene);
    sofaArmLeft.position.set(-3.25, 1.2, 0);

    const sofaArmRight = sofaArmLeft.clone("sofaArmRight");
    sofaArmRight.position.x = 3.25;

    const sofa = BABYLON.Mesh.MergeMeshes([sofaBase, sofaBack, sofaArmLeft, sofaArmRight], true, true, undefined, false, true);
    sofa.material = sofaMat;
    sofa.position.z = -2;

    // 사이드 테이블
    const tableMat = new BABYLON.PBRMaterial("tableMat", scene);
    tableMat.albedoColor = new BABYLON.Color3.FromHexString("#5C4033"); // Dark wood
    tableMat.roughness = 0.6;

    const tableTop = BABYLON.MeshBuilder.CreateCylinder("tableTop", {diameter: 1.5, height: 0.15}, scene);
    tableTop.position.set(4.5, 1.2, -2);
    tableTop.material = tableMat;

    const tableLeg = BABYLON.MeshBuilder.CreateCylinder("tableLeg", {diameter: 0.1, height: 1.2}, scene);
    tableLeg.position.set(4.5, 0.6, -2);
    tableLeg.material = tableMat;
    
    // 테이블 램프
    const lampBase = BABYLON.MeshBuilder.CreateCylinder("lampBase", {diameter: 0.8, height: 0.1}, scene);
    lampBase.position.set(4.5, 1.25, -2);
    const lampMat = new BABYLON.PBRMaterial("lampMat", scene);
    lampMat.albedoColor = new BABYLON.Color3.FromHexString("#D4AF37"); // Gold-ish
    lampMat.metallic = 0.8;
    lampMat.roughness = 0.4;
    lampBase.material = lampMat;

    const lampShade = BABYLON.MeshBuilder.CreateCylinder("lampShade", {diameterTop: 0.7, diameterBottom: 1, height: 0.8, tessellation: 24}, scene);
    lampShade.position.set(4.5, 1.9, -2);
    const shadeMat = new BABYLON.PBRMaterial("shadeMat", scene);
    shadeMat.albedoColor = new BABYLON.Color3.FromHexString("#F5F5DC"); // Beige
    shadeMat.roughness = 0.9;
    lampShade.material = shadeMat;
    
    const lampBulb = BABYLON.MeshBuilder.CreateSphere("lampBulb", {diameter: 0.2}, scene);
    lampBulb.position.set(4.5, 1.7, -2);
    const lampBulbMat = new BABYLON.PBRMaterial("lampBulbMat", scene);
    lampBulb.material = lampBulbMat;

    // 천장 등
    const fixtureBase = BABYLON.MeshBuilder.CreateCylinder("fixtureBase", {diameter: 0.8, height: 0.1}, scene);
    fixtureBase.position.set(0, 7.95, 0);
    const fixtureMat = new BABYLON.PBRMaterial("fixtureMat", scene);
    fixtureMat.albedoColor = new BABYLON.Color3.FromHexString("#303030");
    fixtureMat.metallic = 1.0;
    fixtureMat.roughness = 0.5;
    fixtureBase.material = fixtureMat;

    const ceilingBulbs = [];
    const ceilingBulbMat = new BABYLON.PBRMaterial("ceilingBulbMat", scene);
    
    const bulbPositions = [
        new BABYLON.Vector3(0, 7, 0),
        new BABYLON.Vector3(1, 6.8, 1),
        new BABYLON.Vector3(-1, 6.7, 1.2),
        new BABYLON.Vector3(-0.8, 6.9, -1),
        new BABYLON.Vector3(0.9, 6.6, -0.8),
    ];

    bulbPositions.forEach((pos, i) => {
        const bulb = BABYLON.MeshBuilder.CreateSphere(`ceilingBulb${i}`, {diameter: 0.7}, scene);
        bulb.position = pos;
        bulb.material = ceilingBulbMat;
        ceilingBulbs.push(bulb);
    });


    // ======== 조명 설정 ========
    // 1. 기본 주변광 (Hemispheric)
    const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.1;
    hemiLight.diffuse = new BABYLON.Color3(0.8, 0.85, 1);

    // 2. 주 조명 (창문에서 들어오는 햇빛 역할)
    const dirLight = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0.5, -1, -1), scene);
    dirLight.position = new BABYLON.Vector3(-5, 10, 10);
    dirLight.intensity = 0.5;
    
    // 3. 천장 등 (Point)
    const ceilingLight = new BABYLON.PointLight("ceilingLight", new BABYLON.Vector3(0, 7, 0), scene);
    ceilingLight.intensity = 80;
    ceilingLight.range = 30;
    ceilingLight.diffuse = BABYLON.Color3.FromHexString("#FFDDC4");
    ceilingBulbMat.emissiveColor = ceilingLight.diffuse;

    // 4. 테이블 램프 (Point)
    const tableLampLight = new BABYLON.PointLight("tableLampLight", lampBulb.position, scene);
    tableLampLight.intensity = 25;
    tableLampLight.range = 10;
    tableLampLight.diffuse = BABYLON.Color3.FromHexString("#FFE5B4");
    lampBulbMat.emissiveColor = tableLampLight.diffuse;

    // ======== 그림자 설정 ========
    const shadowGen = new BABYLON.ShadowGenerator(1024, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;
    shadowGen.addShadowCaster(sofa);
    shadowGen.addShadowCaster(tableTop);
    shadowGen.addShadowCaster(tableLeg);
    shadowGen.addShadowCaster(lampBase);
    shadowGen.addShadowCaster(lampShade);


    // ======== UI 패널 생성 ========
    const oldPanel = document.getElementById("ui-panel");
    if (oldPanel) oldPanel.remove();
    
    if (!document.getElementById("ui-style")) {
        const style = document.createElement("style");
        style.id = "ui-style";
        style.textContent = `
        .panel{position:fixed;top:12px;left:12px;z-index:10;background:rgba(20,24,30,.88);color:#e9eef5;padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:12px;backdrop-filter:blur(6px);max-width:320px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto}
        .panel h2{margin:0 0 8px;font-size:16px}
        .row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin:8px 0}
        .row label{font-size:13px;}
        .row input[type="range"]{width:140px}
        .row input[type="color"]{width:40px;height:26px;padding:0;border:none;background:transparent;border-radius:4px;}
        .hr{height:1px;background:rgba(255,255,255,0.1);margin:12px 0;border:none}
        .btn{display:inline-block;padding:6px 10px;border-radius:8px;border:1px solid #2a3b52;background:#152131;color:#e9eef5;font-size:12px;cursor:pointer}
        .btn:hover{filter:brightness(1.1)}
        `;
        document.head.appendChild(style);
    }

    const panel = document.createElement("div");
    panel.id = "ui-panel";
    panel.className = "panel";
    panel.innerHTML = `
        <h2>조명 컨트롤</h2>

        <div class="row"><label>주변광 (Hemi) ON/OFF</label><input id="hemiToggle" type="checkbox" checked /></div>
        <div class="row"><label>주변광 세기</label><input id="hemiIntensity" type="range" min="0" max="1" step="0.01" value="0.1" /></div>
        
        <div class="hr"></div>
        
        <div class="row"><label>태양광 (Sun) ON/OFF</label><input id="dirToggle" type="checkbox" checked /></div>
        <div class="row"><label>태양광 세기</label><input id="dirIntensity" type="range" min="0" max="2" step="0.01" value="0.5" /></div>
        <div class="row"><label>그림자 ON/OFF</label><input id="shadowToggle" type="checkbox" checked /></div>

        <div class="hr"></div>

        <div class="row"><label>천장 등 ON/OFF</label><input id="ceilingToggle" type="checkbox" checked /></div>
        <div class="row"><label>천장 등 세기</label><input id="ceilingIntensity" type="range" min="0" max="200" step="1" value="80" /></div>
        <div class="row"><label>천장 등 색</label><input id="ceilingColor" type="color" value="#ffddc4" /></div>

        <div class="hr"></div>

        <div class="row"><label>테이블 램프 ON/OFF</label><input id="lampToggle" type="checkbox" checked /></div>
        <div class="row"><label>램프 세기</label><input id="lampIntensity" type="range" min="0" max="80" step="1" value="25" /></div>
        <div class="row"><label>램프 색</label><input id="lampColor" type="color" value="#ffe5b4" /></div>

        <div class="hr"></div>
        <a id="resetBtn" class="btn">카메라 뷰 초기화</a>
    `;
    document.body.appendChild(panel);

    // ======== UI 이벤트 연결 ========
    const $ = (id) => document.getElementById(id);

    $("hemiToggle").onchange = e => hemiLight.setEnabled(e.target.checked);
    $("hemiIntensity").oninput = e => hemiLight.intensity = parseFloat(e.target.value);
    
    $("dirToggle").onchange = e => dirLight.setEnabled(e.target.checked);
    $("dirIntensity").oninput = e => dirLight.intensity = parseFloat(e.target.value);
    $("shadowToggle").onchange = e => ground.receiveShadows = e.target.checked;
    
    $("ceilingToggle").onchange = e => ceilingLight.setEnabled(e.target.checked);
    $("ceilingIntensity").oninput = e => ceilingLight.intensity = parseFloat(e.target.value);
    $("ceilingColor").oninput = e => {
        const c = BABYLON.Color3.FromHexString(e.target.value);
        ceilingLight.diffuse = c;
        ceilingBulbMat.emissiveColor = c;
    };

    $("lampToggle").onchange = e => tableLampLight.setEnabled(e.target.checked);
    $("lampIntensity").oninput = e => tableLampLight.intensity = parseFloat(e.target.value);
    $("lampColor").oninput = e => {
        const c = BABYLON.Color3.FromHexString(e.target.value);
        tableLampLight.diffuse = c;
        lampBulbMat.emissiveColor = c;
    };
    
    $("resetBtn").onclick = () => {
        camera.alpha = BABYLON.Tools.ToRadians(-60);
        camera.beta = BABYLON.Tools.ToRadians(75);
        camera.radius = 15;
        camera.setTarget(new BABYLON.Vector3(0, 1.2, 0));
    };

    return scene;
}
