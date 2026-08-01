const viewer=document.querySelector('#viewer'),vimg=document.querySelector('#viewer-image');
document.querySelectorAll('.art-button').forEach(button=>button.addEventListener('click',()=>{const image=button.querySelector('img');vimg.src=image.src;vimg.alt=image.alt;viewer.showModal()}));
document.querySelector('#close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&viewer.open)viewer.close()});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
  button.classList.add('active');
  const filter=button.dataset.filter;
  document.querySelectorAll('.piece').forEach(piece=>{
    const kinds=piece.dataset.kind.split(/\s+/);
    piece.classList.toggle('is-hidden',filter!=='all'&&!kinds.includes(filter));
  });
}));
