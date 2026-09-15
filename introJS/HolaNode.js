console.log("Hola mundo NODE");
 
let edad1=20
let edad2=7

console.log("Edad promedio: ");
console.log((edad1+edad2)/2);

console.log("Medir Procesos");
console.time("miproceso")
for(i=0;i<100000000000; i++){}
console.timeEnd("miproceso")
