const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'), nodes=new Map();
function el(id){if(!nodes.has(id))nodes.set(id,{value:id==='period'?'oct':id==='source'?'demo':id==='sort'?'units':'',innerHTML:'',textContent:'',addEventListener(){},querySelector(){return el(id+'child')},classList:{toggle(){}},dataset:{}});return nodes.get(id)}
const ctx={Intl,console,document:{getElementById:el,querySelector:el,querySelectorAll:()=>[],addEventListener(){}},window:{}};
vm.createContext(ctx);for(const file of ['catalog.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx);
function assert(v,msg){if(!v)throw Error(msg)}
for(const period of ['oct','sep']){el('period').value=period;vm.runInContext('render()',ctx);assert(el('productRows').innerHTML.match(/<tr>/g).length===6,'six products');assert(el('bestsellerCards').innerHTML.match(/<article/g).length===3,'top three cards');assert(!el('chart').innerHTML.includes('NaN'),'finite chart');}
vm.runInContext("Object.values(productCatalog).forEach(p=>{if(!p.imageUrl.startsWith('assets/'))throw Error('asset path')})",ctx);
const assets=vm.runInContext('Object.values(productCatalog).map(p=>p.imageUrl)',ctx);assets.forEach(p=>assert(fs.existsSync(path.join(root,'dist',p)),p));
el('search').value='not-found';vm.runInContext('renderProducts()',ctx);assert(el('productRows').innerHTML.includes('Tidak ada produk'),'empty search');
el('source').value='photo';vm.runInContext('render()',ctx);assert(!el('bestsellerCards').innerHTML.includes('<img'),'no invented source photos');assert(el('metrics').innerHTML.includes('Rp0'),'original zeros');
assert(vm.runInContext("productImage({id:'missing',name:'test'})",ctx).includes('belum tersedia'),'missing photo');
vm.runInContext("productCatalog.unsafe={imageUrl:'javascript:alert(1)'}",ctx);assert(!vm.runInContext("productImage({id:'unsafe'})",ctx).includes('<img'),'unsafe URL');
console.log('PASS: periods, product ranks, image assets, missing-image state, search, source-photo mode, URL validation.');
