import{u as n}from"./readingListStore.Hq9aeZRy.js";import"./readArticlesStore.DXHuNWFh.js";import"./middleware.BbpNvAui.js";import"./compat.module.A6lYqC56.js";import"./preact.module.Crax5nOs.js";import"./hooks.module.Defe-Nsp.js";function r(){const t=document.getElementById("reading-list-container");if(!t)return;const i=n.getState().items;if(i.length===0){t.innerHTML=`
          <div class="text-center py-12 text-muted-foreground">
            <p>Your reading list is empty.</p>
            <p class="mt-2 text-sm">Browse articles and save them for later!</p>
          </div>
        `;return}t.innerHTML=`
        <div class="space-y-4">
          ${i.map(e=>`
            <a 
              href="${e.url}"
              class="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <h3 class="font-medium">${e.title}</h3>
              <time class="text-xs text-muted-foreground mt-1 block">
                Saved ${new Date(e.savedAt).toLocaleDateString()}
              </time>
            </a>
          `).join("")}
        </div>
        <button
          id="clear-reading-list"
          class="mt-6 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          Clear all
        </button>
      `,document.getElementById("clear-reading-list")?.addEventListener("click",()=>{n.getState().clearAll(),r()})}r();window.addEventListener("storage",r);
