// const sleep = (duration = 1000) => new Promise(() => {
    
   
// });
let db = 0;
let stop = false;
let slider = document.getElementById('db').value;
const tablaRigth = []
const tablaLeft = []
const tablaRigthHL = []
const tablaLeftHL = []
let bandera = "R"
let oidoDerecho = document.getElementById('R').checked=true
let oidoIzquierdo = document.getElementById('L').checked
let posicion = 0;
let escucho = false
const notes = [
    4,3,2,5,6,7
];  

function actualizarDB(value){
     db = document.getElementById("pDB").innerHTML = value
}

const getFrequency = (note) => {
    switch (note) {
        case 2:
            return 250; 
        case 3:
            return 500;
        case 4:
            return 1000;
        case 5:
            return 2000;
        case 6:
            return 4000;
        case 7:
             return 8000;
        default:
            return 0;
    }
}



function start(){
    document.getElementById('start').style.display = "none";
    document.getElementById('instrucciones').style.display = "flex";
    document.getElementById('cardInstrucciones').classList.add('animate__animated');
    document.getElementById('cardInstrucciones').classList.add('animate__fadeInBottomRight');
}

let id

function asignarFrecuencia(){
    clearInterval(id)
    escucho = true
    if(!stop){
        if(escucho){ 
            if(bandera === "R"){

                if (tablaRigth.length === 0){
                    db = 7.5
                }else if(tablaRigth.length === 1){
                    db = 13.5
                }else if(tablaRigth.length === 2){
                    db= 27
                }else if(tablaRigth.length === 3){
                    db=9
                }else if(tablaRigth.length === 4){
                    db=12
                }else if(tablaRigth.length === 5){
                    db=15.5
                }     
            }
            
            if(bandera == "L"){
                
                if (tablaLeft.length === 0){
                    db = 7.5
                }else if(tablaLeft.length === 1){
                    db = 13.5
                }else if(tablaLeft.length === 2){
                    db= 27
                }else if(tablaLeft.length === 3){
                    db=9
                }else if(tablaLeft.length === 4){
                    db=12
                }else if(tablaLeft.length === 5){
                    db=15.5
                }
            }
            id = setInterval(playTone,10000) 
        }
    }
        
}

const amplitudRef = 1   
const pref = 0.2  //valor de sensibilidad en pascales -- 108db a 1k-0.17V A 1

function playTone(){
    
    freq = getFrequency(notes[posicion])
    duration = 1000
    // volumen = 10*Math.log10(db)
    if(oscillator !== 1){
        oscillator.disconnect()
    }
    volumen = ((10**(db/20))*0.00002);
    console.log("presion:"+volumen);
    amp = (amplitudRef*volumen)/pref // A = (amp_ref*2)/5.02 A---108db---0.17V---A=1
    console.log("amplitud: "+amp);
    // console.log(amp);

    // x = amp*Math.sin((2*Math.PI*1000))
    context = new AudioContext();
    oscillator = context.createOscillator();
    var panner = context.createStereoPanner();
    const gain = context.createGain();
    // console.log(gain.minValue);
    // console.log(gain.maxValue);
    oscillator.connect(gain);
    oscillator.frequency.value = freq;
    oscillator.type = "sine";
    gain.connect(panner); 
    panner.connect(context.destination);
    gain.gain.value = amp;//*0.01; 
    if(oidoDerecho){
        panner.pan.value = 1;
    }
    if(oidoIzquierdo){
        panner.pan.value = -1;
    }
    oscillator.start(context.currentTime);
    oscillator.stop(duration);
}

function subirDB(){
    if(db <=100){
        db = parseInt(db) + 1
        document.getElementById('pDB').innerText = db
        slider.value = db
    }
    else{
        db=0
    }
}

function siEscuche(){
    if(bandera === "R"){
        if(posicion < 6){
            posicion++
        }

        if (tablaRigth.length === 0){
            tablaRigthHL.push(db-7.5)
        }else if(tablaRigth.length === 1){
            tablaRigthHL.push(db-13.5)
        }else if(tablaRigth.length === 2){
            tablaRigthHL.push(db-27)
        }else if(tablaRigth.length === 3){
            tablaRigthHL.push(db-9)
        }else if(tablaRigth.length === 4){
            tablaRigthHL.push(db-12)
        }else if(tablaRigth.length === 5){
            tablaRigthHL.push(db-15.5)
        }  

        tablaRigth.push(db)
        escucho=true
        if(tablaRigth.length == 6){
            clearInterval(id)
            clearInterval(idd)
            posicion = 0
            bandera = "L"
            document.getElementById("R").checked = false
            oidoDerecho = false
            oidoIzquierdo=true
            document.getElementById("L").checked = true
        }    
        asignarFrecuencia();
       
    }
    else{
        if(posicion < 6){
            posicion++
        }

        if (tablaLeft.length === 0){
            tablaLeftHL.push(db-7.5)
        }else if(tablaLeft.length === 1){
            tablaLeftHL.push(db-13.5)
        }else if(tablaLeft.length === 2){
            tablaLeftHL.push(db-27)
        }else if(tablaLeft.length === 3){
            tablaLeftHL.push(db-9)
        }else if(tablaLeft.length === 4){
            tablaLeftHL.push(db-12)
        }else if(tablaLeft.length === 5){
            tablaLeftHL.push(db-15.5)
        }  

        tablaLeft.push(db)
        escucho=true
        if(tablaLeft.length == 6){
            posicion = 20
            document.getElementById('cover').style.display = 'none'
            document.getElementById('pDB').style.display = 'none'
            document.getElementById('siEscuche').disabled = true
            // tipoDB = document.getElementById('switch-label').checked = true    
            Graficar(tablaRigth,tablaLeft,tablaRigthHL,tablaLeftHL);
            clearInterval(id)
            clearInterval(idd)
            stop = true 
        }    
            asignarFrecuencia();
    }
}

// function noEscuche(){
//     escucho=false
//     asignarFrecuencia()
// }
let SPLmyChart;
let HLmyChart

function Graficar(data_rigth,data_left,data_rigthHl,data_leftHL){
    let SPLChart = document.getElementById('myChartSPL').getContext("2d")
    let HLChart = document.getElementById('myChartHL').getContext("2d")
    document.getElementById('graph').style.display = "flex"
    
    const labels = [
        '250 Hz',
        '500 Hz',
        '1 KHz',
        '2 KHz',
        '4 KHz',
        '8 KHz',
      ];

    
      const data = {
          labels: labels,
          datasets: [{
          label: 'Oido Derecho',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [data_rigth[2],data_rigth[1],data_rigth[0],data_rigth[3],data_rigth[4],data_rigth[5]]
       
        },{
          label: 'Oido Izquierdo',
          backgroundColor: 'rgb(36, 214, 242)',
          borderColor: 'rgb(36, 214, 242)',
          data: [data_left[2],data_left[1],data_left[0],data_left[3],data_left[4],data_left[5]]
        }],
      };

      const data2 = {
        labels: labels,
        datasets: [{
        label: 'Oido Derecho',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [data_rigthHl[2],data_rigthHl[1],data_rigthHl[0],data_rigthHl[3],data_rigthHl[4],data_rigthHl[5]]
     
      },{
        label: 'Oido Izquierdo',
        backgroundColor: 'rgb(36, 214, 242)',
        borderColor: 'rgb(36, 214, 242)',
        data: [data_leftHL[2],data_leftHL[1],data_leftHL[0],data_leftHL[3],data_leftHL[4],data_leftHL[5]]
      }],
    };
    
      const config = {
          type: 'line',
          data: data,
          options: {
              scales: {
                  yAxis: {
                    reverse: true,
                    beginAtZero: true,
                    suggestedMin: -10,
                    suggestedMax: 120,
                    ticks: {                                    
                        stepSize: 10
                    }
                }},
            responsive: false,

          }
      };

      const config2 = {
        type: 'line',
        data: data2,
        options: {
            scales: {
                yAxis: {
                  reverse: true,
                  beginAtZero: true,
                  suggestedMin: -10,
                  suggestedMax: 120,
                  ticks: {                                    
                      stepSize: 10
                  }
              }},
          responsive: false,

        }
    };
     
      SPLmyChart = new Chart(
      SPLChart,
      config
      );
      HLmyChart = new Chart(
        HLChart,
        config2
        );
}

let oscillator
let idd
function preparacion(){
    oscillator = 1
    document.getElementById('instrucciones').style.display ='none'
    document.getElementById('controles').style.display ='flex'
    document.getElementById('header').style.display ='none'
    document.getElementById('hiro').style.height ='100vh'
    asignarFrecuencia()
    setInterval(subirDB,10000)
}

function changeGraphic(){
    tipoDB = document.getElementById('switch-label').checked
    if(tipoDB){
        document.getElementById('myChartSPL').style.display='none'
        document.getElementById('myChartHL').style.display='block'

    }else{
        document.getElementById('myChartSPL').style.display='block'
        document.getElementById('myChartHL').style.display='none'
    }

}

// function generarPDF(){
//     var pdf  = new jsPDF();
//     var pdf = new jsPDF('l', 'pt', [500, 600]);
//     // pdf.addImage(SPLmyChart, 'PNG', 0, 0);
//     // pdf.save('grafica.pdf');
// }




