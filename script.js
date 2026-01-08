const cube = document.getElementById('cube');
let moveCount = 0, timerInterval, seconds = 0;

let cubeState = {
    front: [], back: [], top: [], bottom: [], left: [], right: []
};

const faces = ['front','back','top','bottom','left','right'];
const colors = {
    front: '#4CAF50', back: '#2196F3', top: '#FFFFFF',
    bottom: '#FFEB3B', left: '#FF9800', right: '#F44336'
};

function startTimer(){
    clearInterval(timerInterval);
    seconds = 0;
    document.getElementById('timer').textContent='00:00';
    timerInterval = setInterval(()=>{
        seconds++;
        let m = String(Math.floor(seconds/60)).padStart(2,'0');
        let s = String(seconds%60).padStart(2,'0');
        document.getElementById('timer').textContent = `${m}:${s}`;
    },1000);
}


function initCubeState(){
    faces.forEach(f=>{
        cubeState[f] = Array(3).fill().map(()=>Array(3).fill(colors[f]));
    });
}


function renderCube(){
    cube.innerHTML = '';
    faces.forEach(f=>{
        const faceDiv = document.createElement('div');
        faceDiv.className = 'face ' + f;
        cubeState[f].forEach(row=>{
            row.forEach(color=>{
                const sticker = document.createElement('div');
                sticker.className = 'sticker';
                sticker.style.background = color;
                faceDiv.appendChild(sticker);
            });
        });
        cube.appendChild(faceDiv);
    });
}


function rotateMatrix(mat, cw=true){
    let newMat = Array(3).fill().map(()=>Array(3).fill(null));
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            newMat[j][2-i] = cw ? mat[i][j] : mat[2-j][i];
        }
    }
    return newMat;
}


function rotateFace(face, cw=true){
    
    cubeState[face] = rotateMatrix(cubeState[face], cw);


    let temp;
    switch(face){
        case 'front':
            if(cw){
                temp = cubeState['top'][2].slice();
                for(let i=0;i<3;i++) cubeState['top'][2][i]=cubeState['left'][2-i][2];
                for(let i=0;i<3;i++) cubeState['left'][i][2]=cubeState['bottom'][0][i];
                for(let i=0;i<3;i++) cubeState['bottom'][0][i]=cubeState['right'][2-i][0];
                for(let i=0;i<3;i++) cubeState['right'][i][0]=temp[i];
            } else {
                temp = cubeState['top'][2].slice();
                for(let i=0;i<3;i++) cubeState['top'][2][i]=cubeState['right'][i][0];
                for(let i=0;i<3;i++) cubeState['right'][i][0]=cubeState['bottom'][0][2-i];
                for(let i=0;i<3;i++) cubeState['bottom'][0][i]=cubeState['left'][i][2];
                for(let i=0;i<3;i++) cubeState['left'][i][2]=temp[2-i];
            }
            break;
        case 'back':
            if(cw){
                temp = cubeState['top'][0].slice();
                for(let i=0;i<3;i++) cubeState['top'][0][i]=cubeState['right'][i][2];
                for(let i=0;i<3;i++) cubeState['right'][i][2]=cubeState['bottom'][2][2-i];
                for(let i=0;i<3;i++) cubeState['bottom'][2][i]=cubeState['left'][i][0];
                for(let i=0;i<3;i++) cubeState['left'][i][0]=temp[2-i];
            } else {
                temp = cubeState['top'][0].slice();
                for(let i=0;i<3;i++) cubeState['top'][0][i]=cubeState['left'][2-i][0];
                for(let i=0;i<3;i++) cubeState['left'][i][0]=cubeState['bottom'][2][i];
                for(let i=0;i<3;i++) cubeState['bottom'][2][i]=cubeState['right'][2-i][2];
                for(let i=0;i<3;i++) cubeState['right'][i][2]=temp[i];
            }
            break;
        case 'top':
            if(cw){
                temp = cubeState['back'][0].slice();
                cubeState['back'][0]=cubeState['right'][0].slice();
                cubeState['right'][0]=cubeState['front'][0].slice();
                cubeState['front'][0]=cubeState['left'][0].slice();
                cubeState['left'][0]=temp;
            } else {
                temp = cubeState['back'][0].slice();
                cubeState['back'][0]=cubeState['left'][0].slice();
                cubeState['left'][0]=cubeState['front'][0].slice();
                cubeState['front'][0]=cubeState['right'][0].slice();
                cubeState['right'][0]=temp;
            }
            break;
        case 'bottom':
            if(cw){
                temp = cubeState['back'][2].slice();
                cubeState['back'][2]=cubeState['left'][2].slice();
                cubeState['left'][2]=cubeState['front'][2].slice();
                cubeState['front'][2]=cubeState['right'][2].slice();
                cubeState['right'][2]=temp;
            } else {
                temp = cubeState['back'][2].slice();
                cubeState['back'][2]=cubeState['right'][2].slice();
                cubeState['right'][2]=cubeState['front'][2].slice();
                cubeState['front'][2]=cubeState['left'][2].slice();
                cubeState['left'][2]=temp;
            }
            break;
        case 'left':
            if(cw){
                temp=[cubeState['top'][0][0],cubeState['top'][1][0],cubeState['top'][2][0]];
                for(let i=0;i<3;i++) cubeState['top'][i][0]=cubeState['back'][2-i][2];
                for(let i=0;i<3;i++) cubeState['back'][i][2]=cubeState['bottom'][i][0];
                for(let i=0;i<3;i++) cubeState['bottom'][i][0]=cubeState['front'][i][0];
                for(let i=0;i<3;i++) cubeState['front'][i][0]=temp[i];
            } else {
                temp=[cubeState['top'][0][0],cubeState['top'][1][0],cubeState['top'][2][0]];
                for(let i=0;i<3;i++) cubeState['top'][i][0]=cubeState['front'][i][0];
                for(let i=0;i<3;i++) cubeState['front'][i][0]=cubeState['bottom'][i][0];
                for(let i=0;i<3;i++) cubeState['bottom'][i][0]=cubeState['back'][2-i][2];
                for(let i=0;i<3;i++) cubeState['back'][i][2]=temp[2-i];
            }
            break;
        case 'right':
            if(cw){
                temp=[cubeState['top'][0][2],cubeState['top'][1][2],cubeState['top'][2][2]];
                for(let i=0;i<3;i++) cubeState['top'][i][2]=cubeState['front'][i][2];
                for(let i=0;i<3;i++) cubeState['front'][i][2]=cubeState['bottom'][i][2];
                for(let i=0;i<3;i++) cubeState['bottom'][i][2]=cubeState['back'][2-i][0];
                for(let i=0;i<3;i++) cubeState['back'][i][0]=temp[2-i];
            } else {
                temp=[cubeState['top'][0][2],cubeState['top'][1][2],cubeState['top'][2][2]];
                for(let i=0;i<3;i++) cubeState['top'][i][2]=cubeState['back'][2-i][0];
                for(let i=0;i<3;i++) cubeState['back'][i][0]=cubeState['bottom'][i][2];
                for(let i=0;i<3;i++) cubeState['bottom'][i][2]=cubeState['front'][i][2];
                for(let i=0;i<3;i++) cubeState['front'][i][2]=temp[i];
            }
            break;
    }

    moveCount++;
    document.getElementById('move-count').textContent = moveCount;
    renderCube();
}

// Cube rotation (visual)
let rotateX=-20, rotateY=-30, rotateZ=0;
function updateCubeRotation(){ cube.style.transform=`translateZ(-100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`; }

['rotate-x-up','rotate-x-down','rotate-y-left','rotate-y-right','rotate-z-clock','rotate-z-counter'].forEach(id=>{
    document.getElementById(id).onclick = ()=>{
        switch(id){
            case 'rotate-x-up': rotateX-=15; break;
            case 'rotate-x-down': rotateX+=15; break;
            case 'rotate-y-left': rotateY-=15; break;
            case 'rotate-y-right': rotateY+=15; break;
            case 'rotate-z-clock': rotateZ+=15; break;
            case 'rotate-z-counter': rotateZ-=15; break;
        }
        updateCubeRotation();
    }
});

// Face buttons
[['front-cw','front-ccw','front'],['back-cw','back-ccw','back'],['top-cw','top-ccw','top'],['bottom-cw','bottom-ccw','bottom'],['left-cw','left-ccw','left'],['right-cw','right-ccw','right']]
.forEach(([cw,ccw,face])=>{
    document.getElementById(cw).onclick=()=>rotateFace(face,true);
    document.getElementById(ccw).onclick=()=>rotateFace(face,false);
});

// Game controls
document.getElementById('scramble').onclick=()=>{
    for(let i=0;i<20;i++){
        let f = faces[Math.floor(Math.random()*faces.length)];
        rotateFace(f,Math.random()>0.5);
    }
    document.getElementById('status').textContent='Scrambled!';
}
document.getElementById('reset').onclick=()=>{
    moveCount=0;
    document.getElementById('move-count').textContent=moveCount;
    rotateX=-20; rotateY=-30; rotateZ=0; updateCubeRotation();
    initCubeState();
    renderCube();
    document.getElementById('status').textContent='Ready';
    startTimer();
}
document.getElementById('solve').onclick=()=>{
    initCubeState();
    renderCube();
    document.getElementById('status').textContent='Solved!';
}
document.getElementById('hint').onclick=()=>{ alert('Hint: Rotate faces to match colors'); }

// Initialize everything
initCubeState();
renderCube();
startTimer();
updateCubeRotation();

