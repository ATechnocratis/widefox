// AutoHide sidebarModoki on normal mode also able to hide normal sidebar too
// To hide both sidebars uncomment the two! commented section bellow

(function() {
    var sidebarbox = document.getElementById("sidebar-box");
    var sidebar = document.getElementById("sidebar");
    var sidebarbox = document.getElementById("sidebar-box");
    var sm_toolbox = document.getElementById("SM_toolbox");
    var shortccut = 0;
    var prvState = null;

    function toggleSidebars() {
        var width = window.innerWidth;
        if (window.windowState === 1 && prvState != window.windowState) {
            SidebarModoki.toggle(true);
            prvState = window.windowState;
            console.log("screen is big now");

            //UNCOMMENT TO HIDE BOTH SIDEBARS
            // if((sidebar.src === "about:blank")||(!sidebar.hasAttribute("src")))
            // 		SidebarUI.show(sidebarbox.getAttribute("sidebarcommand"));
            // else{
            //     sidebarbox.checked = "true";
            //     sidebar.checked = "true";
            //     sidebar.setAttribute("checked", "true");
            //     sidebarbox.setAttribute("checked", "true");
            //     sidebarbox.setAttribute("hidden", false);
            //     sidebarbox.hidden = false;
            //     sidebar.hidden = false;
            // 	}
        } else if (prvState != window.windowState) {
            console.log("RESSSSSIZES");
            prvState = window.windowState;
            SidebarModoki.close();

            //UNCOMMENT TO HIDE BOTH SIDEBARS
            // if (sidebarbox.hidden != "true" && shortccut === 0) {
            //     sidebarbox.hidden = "true";
            // }
        }
    }
    window.addEventListener('resize', toggleSidebars);
    toggleSidebars();
    SidebarUI.hide();
})();