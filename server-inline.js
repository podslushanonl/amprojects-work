const fs=require('fs');
const path=require('path');
const realReadFile=fs.readFile.bind(fs);
const INLINE_CASE_SCRIPTS='<script src="/case-atlas-part0.js?v=fix489f"><\/script><script src="/case-atlas-part1.js?v=fix489f"><\/script><script src="/case-atlas-part2.js?v=fix489f"><\/script><script src="/case-atlas-part3.js?v=fix489f"><\/script><script src="/case-atlas-part4.js?v=fix489f"><\/script><script src="/case-atlas-init.js?v=fix489f"><\/script><script src="/pod-hero-init.js?v=podsharp2"><\/script><script src="/pod-case-v2.js?v=podsharp2"><\/script><script src="/pod-production-fix.js?v=podprod1"><\/script>';
fs.readFile=function(file,...args){
  const cb=args[args.length-1];
  if(typeof cb==='function'&&path.basename(String(file))==='index.html'){
    args[args.length-1]=(err,data)=>{
      if(err)return cb(err,data);
      let html=data.toString('utf8');
      if(!html.includes('/pod-production-fix.js?v=podprod1'))html=html.replace('</body>',INLINE_CASE_SCRIPTS+'</body>');
      cb(null,Buffer.from(html,'utf8'));
    };
  }
  return realReadFile(file,...args);
};
require('./server.js');
