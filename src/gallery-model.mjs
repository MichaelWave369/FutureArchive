export function searchableText(value){return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/φ/gi,'phi').toLowerCase();}
export function selectProjects(projects,{query='',category='all',volume='all'}={}){
  const tokens=searchableText(query).trim().split(/\s+/).filter(Boolean);
  return projects.filter(project=>{
    if(category!=='all'&&project.category!==category)return false;
    if(volume!=='all'&&String(project.volume)!==String(volume))return false;
    const text=searchableText([project.title,project.repo,project.category,project.description,project.detail,project.art,project.credit||''].join(' '));
    return tokens.every(token=>text.includes(token));
  });
}
export function adjacentIndex(index,direction,length){return length>0?((index+direction)%length+length)%length:0;}
