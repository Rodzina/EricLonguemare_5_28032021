!function(){let e=[];class t{constructor(e,t,n,c,i,o){this._id=e,this.colors=t,this.name=n,this.description=c,this.imageUrl=i,this.price=o}}fetch("http://localhost:3000/api/teddies/").then((e=>e.json())).then((n=>(n.forEach((n=>{let c=new t(n._id,n.colors,n.name,n.description,n.imageUrl,n.price);e.push(c)})),e))).then((e=>{e.forEach((e=>{!function(e){const t=document.getElementById("content"),n=document.createElement("a");n.href="#",t.appendChild(n);const c=document.createElement("img");c.src=e.imageUrl+"?w=250&h=250",n.appendChild(c);const i=document.createElement("p");n.appendChild(i);const o=document.createTextNode(e.name);i.appendChild(o)}(e)}))}))}();