<h1 align="center">
 W i d e f o x
</h1>


With monitors getting wider and websites more compact, maximizing the browser is a waste of space.
Widefox utilizes all available vertical real estate while adding extra features to your browsing experience!

<h2 align="center">
 Preview
</h2>



https://user-images.githubusercontent.com/85787109/151295205-1759f832-d56a-4885-9616-f5846d012573.mp4



# Features 

<details>
<summary>  Second sidebar Plus</summary>
<p>

Nothing would be possible without the script [sidebarModoki from alice0775](https://github.com/alice0775/userChrome.js/) which creates the second sidebar.

Improved with an unique floating style, matching the browser theme. Giving easy access not only to your Bookmarks, Downloads and History but to your Extensions, Themes, about:performance and about:config!

There are two groups of three tabs for a total of six tabs. To switch between groups either middle click on a tab or click the area above the tabs and under the urlbar.


</p>
</details>
<details>
<summary>  Max vertical space</summary>

<p>

Navbar and sidebar width tied together leaving all the vertical space available for each webpage, urlbar will also expand on when needed.
</p>
</details>
<details>
<summary>  Tree Style Tab styling</summary>
<p>

Restyling tabs to match the floating styling of proton redesign, adds light/dark mode awarenesses, an animated border and various other tweaks.
</p>
</details>
<details>

<summary>  Smart window resize</summary>

<p>

Switching from/to normal/maximized window will hide/show the sidebar automatically.
</p>
</details>


# Extras

## Styles

<details>
<summary> Normal size window restyle </summary>
<br></br>
One-line style with no tabs since TST is used. Complete optional you can modify sidebarXautohidet.uc.js (just uncomment some lines) 
to auto-hide TST completely on normal size window.

File: `.\userChrome-files\normal_mode.css`

<br></br>

</details>
<details>
<summary> Darker about:pages for dark mode users </summary>
<br></br>

Recolours most about:pages and breaks the monochrome background.

File: `.\userContent-files\aboutpages\about_pages_Darker.css`

![image](https://user-images.githubusercontent.com/85787109/151279017-85f1a886-15b6-49f2-8be5-ab4aae328610.png)
<br></br>

</details>
<details>

<summary> About:addons restoration </summary>
<br></br>

Utilize the wasted screen space, bring back buttons and other useful additions!

Files at `.\userContent-files\aboutpages\aboutaddons` folder keep what you prefer.
![image](https://user-images.githubusercontent.com/85787109/163676402-38b77b7e-2c57-41a3-999c-9f49153b370e.png)
<br></br>

</details>



## Scripts
<details>

<summary> About:addons search-box searches your addons </summary>
<br></br>

Filter your extensions and themes instead of searching the store.

File: `addonSearchBar.uc.js`

<br></br>

</details>
<details>
<summary> Restart button on toolbar and main menu</summary>
<br></br>

One click restart.

Files : `restartButtonM.uc.js`
and `restartInMenu.uc.js`
<br></br>

</details>
<details>
<summary> Restore the restore previous season on the main menu</summary>	
<br></br>

Proton redesign took it away now you can have it back.
	
File: `restoreRestorePreviousSeason.uc.js`
<br></br>

</details>
<details>
<summary> Show only domain on urlbar</summary>
<br></br>

Hide and restore on focus. Use with caution.

File: `trimurl.uc.js`
<br></br>

</details>
<details>
<summary> Floating scrollbars</summary>
<br></br>

File: `floatingScrollbar.uc.js`
<br></br>

</details>


 # Installation

#### 1. Install [Tree Style Tab](https://addons.mozilla.org/en-US/firefox/addon/tree-style-tab/)
 
+ Select left side style from TST Options-> Appearance
+ Click the sidebar header and select `Move Sidebar to Right`

#### 2. Install [TST Colored Tabs](https://addons.mozilla.org/en-US/firefox/addon/tst-colored-tabs/) to get per domain colours
 
+ In options select `Saturation 60` and `Lightness 22` and then add your preferred colours for each domain or leave it to random if you want.
 
#### 3. Unlock custom css settings
 
+ Go to `about:config` search for `toolkit.legacyUserProfileCustomizations.stylesheets` and set it to  `true` 
+ For blur support  search for `layout.css.backdrop-filter.enabled` and set it to  `true` ! Not working in latest version of Firefox !

#### 4. Enable script support
 
+ In-order to support custom scripts an autoconfig script loader is needed.
Tested with the loader from xiaoxiaoflood. Follow the instructions to install the loader from https://github.com/xiaoxiaoflood/firefox-scripts 
 
#### 5. Install Widefox
 
+ Copy the contents of the chrome folder from this repository to the chrome folder you created inside your profile folder in step 4.
+ Restart!
+ If there is a thin line at the top of the window in maximized mode or a part of the window disapears, increase/decrease the value of the variable `--titlebar-hide` in the file `userChrome-files/vars.css`

#### 6. Customize  Toolbar
 

<p align=center> <details> <summary> Right click on any toolbar and select <b>Customize  Toolbar...</b>  or from Main menu >  More Tools > Customize toolbar...
	<br>&emsp; Click here for more details...</summary>

Make sure there is one spacer on the left side of urlbar and none on the right. Move the sidebar Modoki hide/show button to the vertical toolbar, move the reload and restart buttons where you want.
Move extensions and other buttons from  either side of urlbar to the vertical toolbar or to overflow menu. Make sure there is at least one thing inside the overflow menu. If you want the zoom control buttons you can bring them to the vertical toolbar. Compact mode is recommended, enable <b>browser.compactmode.show</b> in <b>about:config</b> and set density to compact.

 Here is a before and after from a default profile:
 
![image](https://user-images.githubusercontent.com/85787109/151107834-fdb904f9-9274-47e0-a8dd-509f6dead555.png)

</details>
</p>

#### 7. Finished!
<br></br>
***[Startpage/Newtab page in preview](https://github.com/ATechnocratis/startpage)***       
***[Color theme in preview](https://color.firefox.com/?theme=XQAAAAKrAgAAAAAAAABBqYhm849SCicxcUHkAiuG_ebZUZXOFqjoMxYxH1I399RoYhLPFxFUZ2RLx76huC8RZdnpkgq9ftnN-MxORpV41V06q3JQETrJWTgmmEysn0ompgQX-1ZNd4hcrAlg-LVmQIO2A4JBc0f8tLYj73YwPdB9hkwDe3RQhx-DhsW-_eRXXk-HtL51GRTrfpzHHqIvNAVS80C9Upp7zJPUl9MWA9SIpt494n2U9p9p7Cc3R_l1bOOoZE37Ls1N0cL5XRbdn3WdRUjjrd6kYwzrdPB970LCx_akrxV3lbd7zLd51WxRkapHcSOrSnMcnfWlra0tscr-SBNK8J7yeK0jjISduFJF6rUNixYGDbHeG_5m3boqJX7tokp23h5raQFBeQAYfGxwFjwzBlUs_N3BHZSJVa7UNGO1KcifeElIoHA_uGJuCG7TssZppQY8prg-h3U6ScxWF5KZsR4wQltETzI9mwW2OxdC0vMj9lCOb9wslQ6jScqy2LHaNC-u_I2ka03VnWRLO-EgTFiXl3sEb_jmyIw)***



 
 
