function doLoop(a,b) {
  for(i=1; i < window.Infinity; i++){
    x = (a * i -1) % b; 
    if( x === 0 ){
      console.log(i)
      break;
    }
  }
}
