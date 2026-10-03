const paths={"↗": "M5 19 19 5M5 5h14v14", "→": "M4 12h16M13 5l7 7-7 7", "↓": "M12 4v16M5 13l7 7 7-7", "↑": "M12 20V4M5 11l7-7 7 7", "✳": "M12 2v20M2 12h20M5 5l14 14M5 19 19 5", "⤢": "M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5", "⌂": "M4 11l8-7 8 7v9H4zM9 20v-7h6v7", "✓": "m4 12 5 5L20 6", "×": "m6 6 12 12M6 18 18 6", "−": "M5 12h14"};
export function watchIcons(root){
 const pattern=/[↗→↓↑✳⤢⌂✓×−]/;
 function convert(node){
  if(node.nodeType===3){if(!pattern.test(node.data)||node.parentElement?.closest('svg,script,style,textarea,input'))return;const fragment=document.createDocumentFragment();for(const char of node.data){if(paths[char]){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),path=document.createElementNS(svg.namespaceURI,'path');for(const[k,v]of Object.entries({class:'ui-icon',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'}))svg.setAttribute(k,v);path.setAttribute('d',paths[char]);svg.append(path);fragment.append(svg)}else fragment.append(document.createTextNode(char))}node.replaceWith(fragment);return}
  if(node.nodeType===1&&!node.matches('svg,script,style,textarea,input'))[...node.childNodes].forEach(convert);
 }
 convert(root);new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')convert(r.target);else r.addedNodes.forEach(convert)}}).observe(root,{childList:true,subtree:true,characterData:true});
}
