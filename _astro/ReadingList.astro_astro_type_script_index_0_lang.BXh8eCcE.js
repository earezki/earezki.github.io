const p="readingList";function c(){try{const t=localStorage.getItem(p);return t?JSON.parse(t):[]}catch{return[]}}function g(t){try{localStorage.setItem(p,JSON.stringify(t))}catch{}}function h(t,e){const n=c();return n.some(o=>o.url===t)?!1:(n.unshift({url:t,title:e,savedAt:Date.now()}),g(n),!0)}function f(t){const e=c().filter(n=>n.url!==t);g(e)}function y(t){return c().some(e=>e.url===t)}function x(){g([])}window.toggleReadingList=function(t){const e=document.querySelector("h1")?.textContent||document.title;y(t)?(f(t),l("Removed from reading list")):(h(t,e),l("Added to reading list")),a()};function l(t){const e=document.querySelector(".reading-list-toast");e&&e.remove();const n=document.createElement("div");n.className="reading-list-toast",n.textContent=t,n.style.cssText=`
      position: fixed;
      bottom: 7rem;
      right: 1.5rem;
      padding: 0.75rem 1.25rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      font-size: 0.9rem;
      color: var(--color-text);
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
    `,document.body.appendChild(n),setTimeout(()=>{n.style.animation="slideDown 0.3s ease-out forwards",setTimeout(()=>n.remove(),300)},2e3)}function a(){const t=c(),e=document.getElementById("reading-list-count"),n=document.getElementById("reading-list-items"),o=document.getElementById("reading-list-empty"),d=document.getElementById("reading-list-footer");e&&(e.textContent=t.length.toString(),e.setAttribute("data-count",t.length.toString())),n&&(n.innerHTML=t.map(i=>`
        <li class="reading-list-item">
          <div class="reading-list-item-content">
            <a href="${i.url}">
              <h3 class="reading-list-item-title">${i.title}</h3>
            </a>
            <span class="reading-list-item-meta">
              Saved ${new Date(i.savedAt).toLocaleDateString()}
            </span>
          </div>
          <button class="reading-list-item-remove" data-url="${i.url}" aria-label="Remove from list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </li>
      `).join(""),n.querySelectorAll(".reading-list-item-remove").forEach(i=>{i.addEventListener("click",r=>{const s=r.currentTarget.getAttribute("data-url");s&&(f(s),a())})})),o&&(o.style.display=t.length===0?"flex":"none"),d&&d.classList.toggle("has-items",t.length>0),S()}function S(){const t=document.querySelector(".add-to-reading-list");if(!t)return;const e=window.location.pathname,n=y(e);t.classList.toggle("saved",n);const o=t.querySelector(".btn-text");o&&(o.textContent=n?"Saved":"Save")}document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("reading-list-toggle"),e=document.getElementById("reading-list-panel"),n=e?.querySelector(".reading-list-close"),o=e?.querySelector(".reading-list-backdrop"),d=document.getElementById("clear-reading-list");function i(){e&&(e.setAttribute("data-state","visible"),document.body.style.overflow="hidden",a())}function r(){e&&(e.setAttribute("data-state","hidden"),document.body.style.overflow="")}if(t?.addEventListener("click",i),n?.addEventListener("click",r),o?.addEventListener("click",r),d?.addEventListener("click",()=>{confirm("Remove all saved articles?")&&(x(),a())}),document.addEventListener("keydown",s=>{s.key==="Escape"&&e?.getAttribute("data-state")==="visible"&&r()}),document.querySelector(".post-body")){const s=document.querySelector(".post-header .meta");if(s){const v=document.getElementById("add-to-reading-list-template");if(v){const m=v.content.cloneNode(!0).querySelector(".add-to-reading-list");m&&(m.addEventListener("click",()=>{const u=window.location.pathname,E=document.querySelector("h1")?.textContent||document.title;y(u)?(f(u),l("Removed from reading list")):(h(u,E),l("Added to reading list")),a()}),s.appendChild(m))}}}a()});const b=document.createElement("style");b.textContent=`
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
  `;document.head.appendChild(b);
