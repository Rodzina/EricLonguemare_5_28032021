!function(){let e=[];class t{constructor(e,t,n,c,o,i){this._id=e,this.colors=t,this.name=n,this.description=c,this.imageUrl=o,this.price=i}}fetch("https://polar-retreat-13131.herokuapp.com/api/teddies/").then((e=>e.json())).then((n=>(n.forEach((n=>{let c=new t(n._id,n.colors,n.name,n.description,n.imageUrl,n.price);e.push(c)})),e))).then((e=>{e.forEach((e=>{!function(e){const t=document.getElementById("content"),n=document.createElement("a");n.href="#",t.appendChild(n);const c=document.createElement("img");c.src=e.imageUrl+"?w=380&h=380",n.appendChild(c);const o=document.createElement("p");n.appendChild(o);const i=document.createTextNode(e.name);o.appendChild(i)}(e)}))}))}();