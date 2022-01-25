/* Original author jotted , updated to implement live search*/

UC.searchInstalledAddons = {
  init(){
    Services.obs.addObserver(UC.searchInstalledAddons.observer, "EM-loaded");
  },
  observer(window){
    const sa = window.document.querySelector('search-addons');
    if (!sa) throw new Error(`[searchInstalledAddons] addon search field not found!`);
    sa.searchAddons = function(query = ""){
      query = query.trim();
      const needle = new RegExp(query,"i");
      for (const card of window.document.querySelectorAll('addon-card')){
        const haystack = Array.from(card.querySelectorAll('.addon-name,.addon-description')).
          map(el=>el.textContent.trim()).
          join();
        card.hidden = query && !needle.test(haystack);
      }
    }
    sa.input.placeholder = "Search add-ons";
    sa.previousElementSibling.textContent = "Find your add-ons";

/*My addition for live search*/
    sa.addEventListener('input', (event) => {
    	sa.searchAddons(query = sa.input.value);    
    });
  },
  destroy(){
    Services.obs.removeObserver(UC.searchInstalledAddons.observer, "EM-loaded");
  },
}
UC.searchInstalledAddons.init();