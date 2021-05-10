// Native Javascript for Bootstrap 3 v2.0.24 for dropdowns from the navbar
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD support:
      define([], factory);
    } else if (typeof module === 'object' && module.exports) {
      // CommonJS-like:
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      var bsn = factory();
      root.Dropdown = bsn.Dropdown;
    }
  }(this, function () {
    
    /* Native Javascript for Bootstrap 3 | Internal Utility Functions */
    "use strict";
    // globals
    var globalObject = typeof global !== 'undefined' ? global : this||window,
      DOC = document, HTML = DOC.documentElement, body = 'body', // allow the library to be used in <head>
    
      // Native Javascript for Bootstrap Global Object
      BSN = globalObject.BSN = {},
      supports = BSN.supports = [],
    
      // function toggle attributes
      dataToggle    = 'data-toggle',
    
      // components
      stringDropdown  = 'Dropdown',
    
      // options DATA API
      dataDismissible   = 'data-dismissible',
    
      // option keys
      target = 'target', 
    
      // aria
      ariaExpanded = 'aria-expanded',
    
      // event names
      clickEvent    = 'click',
      keydownEvent  = 'keydown',
      keyupEvent    = 'keyup', 
      showEvent     = 'show',
      shownEvent    = 'shown',
      hideEvent     = 'hide',
      hiddenEvent   = 'hidden',
     
      // other
      getAttribute           = 'getAttribute',
      setAttribute           = 'setAttribute',
      getElementsByTagName   = 'getElementsByTagName',
      preventDefault         = 'preventDefault',
      querySelectorAll       = 'querySelectorAll',
    
      indexOf      = 'indexOf',
      parentNode   = 'parentNode',
      length       = 'length',
      push         = 'push',
      tabindex     = 'tabindex',
      contains     = 'contains',  
  
      // set new focus element since 2.0.3
      setFocus = function(element){
        element.focus ? element.focus() : element.setActive();
      },
    
      // class manipulation, since 2.0.0 requires polyfill.js
      addClass = function(element,classNAME) {
        element.classList.add(classNAME);
      },
      removeClass = function(element,classNAME) {
        element.classList.remove(classNAME);
      },
      hasClass = function(element,classNAME){ // since 2.0.0
        return element.classList[contains](classNAME);
      },
    
      // selection methods
      queryElement = function (selector, parent) {
        var lookUp = parent ? parent : DOC;
        return typeof selector === 'object' ? selector : lookUp.querySelector(selector);
      },
    
      // event attach jQuery style / trigger  since 1.2.0
      on = function (element, event, handler) {
        element.addEventListener(event, handler, false);
      },
      off = function(element, event, handler) {
        element.removeEventListener(event, handler, false);
      },
      one = function (element, event, handler) { // one since 2.0.4
        on(element, event, function handlerWrapper(e){
          handler(e);
          off(element, event, handlerWrapper);
        });
      },
      bootstrapCustomEvent = function (eventName, componentName, related) {
        var OriginalCustomEvent = new CustomEvent( eventName + '.bs.' + componentName);
        OriginalCustomEvent.relatedTarget = related;
        this.dispatchEvent(OriginalCustomEvent);
      }
    
  
    /* Native Javascript for Bootstrap 3 for Dropdowns */
    // DROPDOWN DEFINITION
    var Dropdown = function( element, option ) {
        
      // initialization element
      element = queryElement(element);
    
      // set option
      this.persist = option === true || element[getAttribute]('data-persist') === 'true' || false;
    
      // constants, event targets, strings
      var self = this, children = 'children',
        parent = element[parentNode],
        component = 'dropdown', open = 'open',
        relatedTarget = null,
        menu = queryElement('.dropdown-menu', parent),
        menuItems = (function(){
          var set = menu[children], newSet = [];
          for ( var i=0; i<set[length]; i++ ){
            set[i][children][length] && (set[i][children][0].tagName === 'A' && newSet[push](set[i]));          
          }
          return newSet;
        })(),
    
        // preventDefault on empty anchor links
        preventEmptyAnchor = function(anchor){
          (anchor.href && anchor.href.slice(-1) === '#' || anchor[parentNode] && anchor[parentNode].href 
            && anchor[parentNode].href.slice(-1) === '#') && this[preventDefault]();      
        },
    
        // toggle dismissible events
        toggleDismiss = function(){
          var type = element[open] ? on : off;
          type(DOC, clickEvent, dismissHandler); 
          type(DOC, keydownEvent, preventScroll);
          type(DOC, keyupEvent, keyHandler);
        },
    
        // handlers
        dismissHandler = function(e) {
          var eventTarget = e[target], hasData = eventTarget && (stringDropdown in eventTarget || stringDropdown in eventTarget[parentNode]);
          if ( (eventTarget === menu || menu[contains](eventTarget)) && (self.persist || hasData) ) { return; }
          else {
            relatedTarget = eventTarget === element || element[contains](eventTarget) ? element : null;
            hide();
          }
          preventEmptyAnchor.call(e,eventTarget);
        },
        clickHandler = function(e) {
          relatedTarget = element;
          show();
          preventEmptyAnchor.call(e,e[target]);
        },
        preventScroll = function(e){
          var key = e.which || e.keyCode;
          if( key === 38 || key === 40 ) { e[preventDefault](); }
        },
        keyHandler = function(e){
          var key = e.which || e.keyCode, 
              activeItem = DOC.activeElement,
              idx = menuItems[indexOf](activeItem[parentNode]),
              isSameElement = activeItem === element,
              isInsideMenu = menu[contains](activeItem),
              isMenuItem = activeItem[parentNode][parentNode] === menu;
          
          if ( isMenuItem || isSameElement ) { // navigate up | down
            idx = isSameElement ? 0 
                                : key === 38 ? (idx>1?idx-1:0) 
                                : key === 40 ? (idx<menuItems[length]-1?idx+1:idx) : idx;
            menuItems[idx] && setFocus(menuItems[idx][children][0]);
          }
          if ( (menuItems[length] && isMenuItem // menu has items
            || !menuItems[length] && (isInsideMenu || isSameElement)  // menu might be a form
            || !isInsideMenu ) // or the focused element is not in the menu at all
            && element[open] && key === 27 // menu must be open
          ) {
            self.toggle();
            relatedTarget = null;
          }
        },  
    
        // private methods
        show = function() {
          bootstrapCustomEvent.call(parent, showEvent, component, relatedTarget);
          addClass(parent,open);
          element[setAttribute](ariaExpanded,true);
          bootstrapCustomEvent.call(parent, shownEvent, component, relatedTarget);
          element[open] = true;
          off(element, clickEvent, clickHandler);
          setTimeout(function(){ 
            setFocus( menu[getElementsByTagName]('INPUT')[0] || element ); // focus the first input item | element
            toggleDismiss(); 
          },1);
        },
        hide = function() {
          bootstrapCustomEvent.call(parent, hideEvent, component, relatedTarget);
          removeClass(parent,open);
          element[setAttribute](ariaExpanded,false);
          bootstrapCustomEvent.call(parent, hiddenEvent, component, relatedTarget);
          element[open] = false;
          toggleDismiss();
          setFocus(element);
          setTimeout(function(){ on(element, clickEvent, clickHandler); },1);
        };
    
      // set initial state to closed
      element[open] = false;
    
      // public methods
      this.toggle = function() {
        if (hasClass(parent,open) && element[open]) { hide(); } 
        else { show(); }
      };
    
      // init
      if (!(stringDropdown in element)) { // prevent adding event handlers twice
        !tabindex in menu && menu[setAttribute](tabindex, '0'); // Fix onblur on Chrome | Safari
        on(element, clickEvent, clickHandler);
      }
    
      element[stringDropdown] = self;
    };
    
    // DROPDOWN DATA API
    supports[push]( [stringDropdown, Dropdown, '['+dataToggle+'="dropdown"]'] );
    
    
    /* Native Javascript for Bootstrap 3 | Initialize Data API */
    var initializeDataAPI = function( constructor, collection ){
        for (var i=0, l=collection[length]; i<l; i++) {
          new constructor(collection[i]);
        }
      },
      initCallback = BSN.initCallback = function(lookUp){
        lookUp = lookUp || DOC;
        for (var i=0, l=supports[length]; i<l; i++) {
          initializeDataAPI( supports[i][1], lookUp[querySelectorAll] (supports[i][2]) );
        }
      };
    
    // bulk initialize all components
    DOC[body] ? initCallback() : on( DOC, 'DOMContentLoaded', function(){ initCallback(); } );
    return {
      Dropdown: Dropdown
    };
  }));
  


/* ============================================================ */
/*===  NC4 navigation 
Author: Laurentiu Ciucur - laurentiu.dorin.ciucur@visma.com  ===*/

(function (factory) {
if (typeof define === 'function' && define.amd) {
// AMD. Register as an anonymous module.
define('nc4navigation', [], factory);
} else if (typeof module === 'object' && module.exports) {
// CommonJS-like:
module.exports = factory();
} else {
window.nc4navigation = factory();
}
}(function () {
'use strict';

var defaultOptions = {
    language: 'en',
    fallbackLanguage: 'en',
    translations: null,
    baseUrl: '',
    xsrfToken: null,
    withCredentials: false,
    selectedAppPrefix: 'Visma.net',
    pathFieldName: 'path',
    restFulPath: {
        menuItems: 'menuItems',
        lastLoginTime: 'lastLoginTime',
        itemsSearch: 'itemsSearch',
        itemsByType: 'itemsByType',
    },
    usesItemsByType: true,
    usesQueryParams: true,
    encodesPathParams: false,
    hasNotifications: false,
    hasFeedback: false,
    hasHelp: true,
    limitToDisplayTypeahead: 50,
    limitForTypeaheadResults: 30,
    navigateOnClickApp: true,
    allowedContextTypes: null,
    callback: {
        onComponentReady: function (response) { },
        onClickMenuItem: function (event, item) { },
        onChangeContextSelector: function (event, item) { },
        onClickApp: function (event, item) { },
        onClickLogout: function (event) { },
        onClickNotifications: function (event) { },
        onClickFeedback: function (event) { },
        onClickHelp: function (event) { },
        onError: function (error) { },
        onTypeaheadSearch: function (type, str, limit, success) { },
        onTypeaheadItemsByType: function (type, limit, success) { },
        onDisplayLastLoginTime: function (success) { }
    },
    firstLevelMenu: [],
    secondLevelMenu: [],
    thirdLevelMenu: [],
    icons: []
};
var constants = {
    id: {
        component: 'nc4navigation',
        topMain: 'nc4navTopMain',
        collapseMain: 'nc4navCollapseMain',
        apps: 'nc4navApps',
        flmenu: 'nc4navFlMenu',
        helpIcon: 'nc4navVismaiconHelp',
        notify: 'nc4notifyInApp',
        notifyIcon: 'nc4navVismaiconAlert',
        feedbackIcon: 'nc4navVismaiconFeedback',
        contextTrigger: 'nc4navContextTrigger',
        contextFilter: 'nc4navContextFilter',
        contextSelector: 'nc4navContextSelector',
        logoutButton: 'nc4navLogoutButton',
        lastLoginTimeParagraph: 'nc4navLastLoginTimeParagraph',
        lastLoginTime: 'nc4navLastLoginTime',
        contextSelectorForm: 'nc4navContextSelectorForm',
        selectedContext: 'nc4navSelectedContext',
        contextsSearch: 'nc4navContextsSearch',
        contextsSearchButton: 'nc4navContextsSearchButton',
        contextsDropdown: 'nc4navContextsDropdown',
        menuDropTrigger: 'nc4navMenuDropTrigger',
        menuDropContent: 'nc4navMenuDropContent',
        droppedAppsToggle: 'nc4navDroppedAppsToggle',
        droppedActiveApp: 'nc4navDroppedActiveApp',
        navbarBrand: 'nc4navBrand',
        noMatchingResult: 'nc4navNoMatchingResult',
        contextSelectorAriaLive: 'nc4navContextSelectorAriaLive' ,
        vismaiconAlert: 'nc4navVismaiconAlert'
    },
    class: {
        active: 'active',
        dropdownToggle: 'dropdown-toggle',
        dropdownMenu: 'dropdown-menu',
        dropdown: 'dropdown',
        companyDropdown: 'company-dropdown',
        noChildren: 'no-children',
        hasChildren: 'has-children',
        secondLevelChildren: 'second-level-children',
        navItem: 'nav-item',
        caret: 'caret',
        open: 'open',
        isOpen: 'is-open',
        isMobile: 'is-mobile',
        externalLink: 'external-link',
        noRights: 'no-rights',
        focus: 'focus',
        hidden: 'hidden',
        noResults: 'no-results',
        isEmbedded: 'is-embedded',
        onlyOneItem: 'only-one-item',
        noContext: 'no-context',
        selectGroup: 'select-group',
        appItem: 'app-item',
        flMenuItem: 'fl-menu-item',
        slMenuItem: 'sl-menu-item',
        tlMenuItem: 'tl-menu-item',
        contextFilterItem: 'context-filter-item',
        contextItem: 'context-item',
        contextGroup: 'context-group',
        droppedAppsToggle:'dropped-apps-toggle',
        pristine: 'pristine',
        vismaiconHelp: 'vismaicon-help',
        vismaiconAlert: 'vismaicon-alert',
        contextSelectorAriaLive: 'context-selector-aria-live',
        badge: 'badge',
        newWindow: 'new-window',
        notifyDropdown: 'notify-dropdown',
        customDropdown: 'custom-dropdown'
    },
    attr: {
        dataGroup: 'data-group',
        dataType: 'data-type',
        dataPath: 'data-path',
        dataActiveWhen: 'data-active-when',
        name: 'name'        
    },
    selector: {
        activeItem: 'li.active',
        activeItemLink: 'li.active:not(.hidden) > a',
        activeApp: 'li > a.active',
        focusItem: 'li.focus',
        focusItemLink: 'li.focus > a',
        secondLevelMenuDropdownToogle: 'a.sl-menu-item.dropdown-toggle',
        focusedContextItem: 'li:not(.hidden) > a.context-item',
        focusedActiveContextItem: 'li.focus:not(.hidden) > a.context-item',
        contextItems: 'a.context-item',
        activeContextItems: 'li.focus a.context-item',
        firstLevelMenuItem: 'a.fl-menu-item',
        secondLevelMenuItem: 'a.sl-menu-item',
        thirdLevelMenuItem: 'a.tl-menu-item',
        navbarBrand: '.navbar-brand',
        appItem: '.app-item',
        navItem: '.nav-item',
        navItemAndDroppedAppsToggle: 'a#nc4navDroppedAppsToggle, a.nav-item',
        dropdownMenu: '.dropdown-menu',
        activeItemList: 'li.active > ul.second-level',
        menuDropContent: '#nc4navMenuDropContent',
        menuDrop: '.menudrop',
        contextFilterItem: '.context-filter-item',
        activeContextFilterItem: '.context-filter-item.active'
    },
    contextType: {
        Visma: 'Visma',
        All: 'All'
    },
    hashBang: '#!',
    embedded: 'embedded',
    prefix :{
        slm: 'slm-',
        tlm: 'tlm-',
        context: 'context-',
        nc4nav: 'nc4nav-'
    },
    keyCode :{
        RETURN: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        ESCAPE: 27,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        F1: 112,
        K: 75,
        P: 80,
        N: 78,
        U: 85
    }
};
var translations = {
	"da": {
		"ERROR_STATUS": "Fejlstatus",
		"BAD_REQUEST": "Ugyldig anmodning",
		"FORBIDDEN": "Forbudt",
		"UNAUTHORIZED": "Ingen adgang",
		"FILE_NOT_FOUND": "Filen blev ikke fundet",
		"INTERNAL_SERVER_ERROR": "Intern serverfejl",
		"REQUEST_ABORTED": "Anmodningen blev afbrudt",
		"UNKNOWN_ERROR": "Ukendt fejl",
		"CONNECTION_REFUSED": "Forbindelsen på URL-adressen {0} blev nægtet. Kontroller, at URL-adressen er korrekt, og at serveren kører.",
		"FILTER_OPTION_ALL": "Alle",
		"NOTIFICATIONS": "Meddelelser",
		"HELP": "Hjälp",
		"LAST_LOGIN_TIME": "Sidste login",
		"LOGOUT": "Log ud",
		"SELECT_CONTEXT": "Vælg kontekst",
		"SHOW_CONTEXTS": "Vis kontekster",
		"SEARCH_CONTEXT": "Søg kontekst",
		"MY_DETAILS": "Mine detaljer",
		"NO_MATCHING_RESULTS": " Ingen matchende resultater",
		"MENU": "Menu",
		"OPEN_IN_NEW_BROWSER_TAB": "vil åbne i en ny browserfane.",
		"PROVIDE_YOUR_FEEDBACK": "Giv din feedback",
		"SERVICE_SELECTOR": "Service vælger",
		"CONTEXT_SELECTOR": "Kontekstvælger",
		"CONTEXT_TYPE_SELECTOR": "Konteksttype vælger",
		"INFORMATION_AREA": "Information område",
		"CONTEXTS_FOUND": "Kontekster fundet",
		"CONTEXT_FOUND": "Kontekst fundet",
		"SHORTCUT": "genvej",
		"BADGE_VALUE": "mærke værdi"
	},
	"en": {
		"ERROR_STATUS": "Error status",
		"BAD_REQUEST": "Bad request",
		"FORBIDDEN": "Forbidden",
		"UNAUTHORIZED": "Unauthorized",
		"FILE_NOT_FOUND": "File not found",
		"INTERNAL_SERVER_ERROR": "Internal server error",
		"REQUEST_ABORTED": "Request aborted",
		"UNKNOWN_ERROR": "Unknown error",
		"CONNECTION_REFUSED": "Connection on url: {0} is refused. Please check if url is correct or that server is running.",
		"FILTER_OPTION_ALL": "All",
		"NOTIFICATIONS": "Notifications",
		"HELP": "Help",
		"LAST_LOGIN_TIME": "Last sign in",
		"LOGOUT": "Sign out",
		"SELECT_CONTEXT": "Select context",
		"SHOW_CONTEXTS": "Show contexts",
		"SEARCH_CONTEXT": "Search context",
		"MY_DETAILS": "My details",
		"NO_MATCHING_RESULTS": "No matching results",
		"MENU": "Menu",
		"OPEN_IN_NEW_BROWSER_TAB": "will open in a new browser tab.",
		"PROVIDE_YOUR_FEEDBACK": "Provide your feedback",
		"SERVICE_SELECTOR": "Service selector",
		"CONTEXT_SELECTOR": "Context selector",
		"CONTEXT_TYPE_SELECTOR": "Context type selector",
		"INFORMATION_AREA": "Information area",
		"CONTEXTS_FOUND": "Contexts found",
		"CONTEXT_FOUND": "Context found",
		"SHORTCUT": "shortcut",
		"BADGE_VALUE": "badge value"
	},
	"fi": {
		"ERROR_STATUS": "Virhetila",
		"BAD_REQUEST": "Virheellinen pyyntö",
		"FORBIDDEN": "Kielletty",
		"UNAUTHORIZED": "Ei käyttöoikeutta",
		"FILE_NOT_FOUND": "Tiedostoa ei löydy",
		"INTERNAL_SERVER_ERROR": "Sisäinen palvelinvirhe",
		"REQUEST_ABORTED": "Pyyntö keskeytettiin",
		"UNKNOWN_ERROR": "Tuntematon virhe",
		"CONNECTION_REFUSED": "Yhteys url: llä {0} on hylätty. Tarkista että url on oikea ja palvelin on käynnissä.",
		"FILTER_OPTION_ALL": "Kaikki",
		"NOTIFICATIONS": "Ilmoitukset",
		"HELP": "Ohjeet",
		"LAST_LOGIN_TIME": "Viimeisin kirjautuminen",
		"LOGOUT": "Kirjaudu ulos",
		"SELECT_CONTEXT": "Valitse konteksti",
		"SHOW_CONTEXTS": "Näyttää kontekstit",
		"SEARCH_CONTEXT": "Etsi konteksti",
		"MY_DETAILS": "Omat tiedot",
		"NO_MATCHING_RESULTS": "Ei tuloksia",
		"MENU": "Valikko",
		"OPEN_IN_NEW_BROWSER_TAB": "aukeaa uuteen selainvälilehteen.",
		"PROVIDE_YOUR_FEEDBACK": "Anna palautteesi",
		"SERVICE_SELECTOR": "Palvelunvalitsin",
		"CONTEXT_SELECTOR": "Kontekstivalitsin",
		"CONTEXT_TYPE_SELECTOR": "Kontekstityyppinen valitsin",
		"INFORMATION_AREA": "Tiedotusalue",
		"CONTEXTS_FOUND": "Kontekstit löytyvät",
		"CONTEXT_FOUND": "Konteksti löytyi",
		"SHORTCUT": "pikakuvake",
		"BADGE_VALUE": "rintanappiarvo"
	},
	"nb": {
		"ERROR_STATUS": "Feilstatus",
		"BAD_REQUEST": "Ugyldig forespørsel",
		"FORBIDDEN": "Forbudt",
		"UNAUTHORIZED": "Ingen adgang",
		"FILE_NOT_FOUND": "Finner ikke filen",
		"INTERNAL_SERVER_ERROR": "Intern serverfeil",
		"REQUEST_ABORTED": "Forespørsel ble avbrutt",
		"UNKNOWN_ERROR": "Ukjent feil",
		"CONNECTION_REFUSED": "Forbindelsen mot URL-adressen {0} ble nektet. Kontroller at URL-adressen er korrekt, og at serveren er i gang.",
		"FILTER_OPTION_ALL": "Alle",
		"NOTIFICATIONS": "Varsler",
		"HELP": "Hjelp",
		"LAST_LOGIN_TIME": "Sist innlogget",
		"LOGOUT": "Logg ut",
		"SELECT_CONTEXT": "Endre kontekst",
		"SHOW_CONTEXTS": "Vis kontekster",
		"SEARCH_CONTEXT": "Søk kontekst",
		"MY_DETAILS": "Mine opplysninger",
		"NO_MATCHING_RESULTS": "Fant ingen resultater som passer",
		"MENU": "Meny",
		"OPEN_IN_NEW_BROWSER_TAB": "åpner i en ny nettleserfane.",
		"PROVIDE_YOUR_FEEDBACK": "Gi din tilbakemelding",
		"SERVICE_SELECTOR": "Servicevelger",
		"CONTEXT_SELECTOR": "Kontekstvelger",
		"CONTEXT_TYPE_SELECTOR": "Konteksttypevelger",
		"INFORMATION_AREA": "Informasjonsområde",
		"CONTEXTS_FOUND": "Kontekster funnet",
		"CONTEXT_FOUND": "Kontekst funnet",
		"SHORTCUT": "snarvei",
		"BADGE_VALUE": "merket verdi"
	},
	"nl": {
		"ERROR_STATUS": "Foutstatus",
		"BAD_REQUEST": "Ongeldig verzoek",
		"FORBIDDEN": "Verboden",
		"UNAUTHORIZED": "Geen toegang",
		"FILE_NOT_FOUND": "Bestand niet gevonden",
		"INTERNAL_SERVER_ERROR": "Interne serverfout",
		"REQUEST_ABORTED": "Het verzoek is afgebroken",
		"UNKNOWN_ERROR": "Onbekende fout",
		"CONNECTION_REFUSED": "De verbinding op URL: {0} is geweigerd. Controleer de URL en zorg ervoor dat de server wordt uitgevoerd.",
		"FILTER_OPTION_ALL": "Alle",
		"NOTIFICATIONS": "Meldingen",
		"HELP": "Helper",
		"LAST_LOGIN_TIME": "Laatste toegang",
		"LOGOUT": "Afmelden",
		"SELECT_CONTEXT": "Context selecteren",
		"SHOW_CONTEXTS": "Contexten toon",
		"SEARCH_CONTEXT": "Context zoeken",
		"MY_DETAILS": "Mijn gegevens",
		"NO_MATCHING_RESULTS": "Geen resultaten",
		"MENU": "Menu",
		"OPEN_IN_NEW_BROWSER_TAB": "wordt geopend in een nieuw browsertabblad.",
		"PROVIDE_YOUR_FEEDBACK": "Geef je feedback",
		"SERVICE_SELECTOR": "Service selector",
		"CONTEXT_SELECTOR": "Contextselector",
		"CONTEXT_TYPE_SELECTOR": "Selectieteken voor contexttype",
		"INFORMATION_AREA": "Informatiezone",
		"CONTEXTS_FOUND": "Contexten gevonden",
		"CONTEXT_FOUND": "Context gevonden",
		"SHORTCUT": "snelkoppeling",
		"BADGE_VALUE": "badge-waarde"
	},
	"no": {
		"ERROR_STATUS": "Feilstatus",
		"BAD_REQUEST": "Ugyldig forespørsel",
		"FORBIDDEN": "Forbudt",
		"UNAUTHORIZED": "Ingen adgang",
		"FILE_NOT_FOUND": "Finner ikke filen",
		"INTERNAL_SERVER_ERROR": "Intern serverfeil",
		"REQUEST_ABORTED": "Forespørsel ble avbrutt",
		"UNKNOWN_ERROR": "Ukjent feil",
		"CONNECTION_REFUSED": "Forbindelsen mot URL-adressen {0} ble nektet. Kontroller at URL-adressen er korrekt, og at serveren er i gang.",
		"FILTER_OPTION_ALL": "Alle",
		"NOTIFICATIONS": "Varsler",
		"HELP": "Hjelp",
		"LAST_LOGIN_TIME": "Sist innlogget",
		"LOGOUT": "Logg ut",
		"SELECT_CONTEXT": "Endre kontekst",
		"SHOW_CONTEXTS": "Vis kontekster",
		"SEARCH_CONTEXT": "Søk kontekst",
		"MY_DETAILS": "Mine opplysninger",
		"NO_MATCHING_RESULTS": "Fant ingen resultater som passer",
		"MENU": "Meny",
		"OPEN_IN_NEW_BROWSER_TAB": "åpner i en ny nettleserfane.",
		"PROVIDE_YOUR_FEEDBACK": "Gi din tilbakemelding",
		"SERVICE_SELECTOR": "Servicevelger",
		"CONTEXT_SELECTOR": "Kontekstvelger",
		"CONTEXT_TYPE_SELECTOR": "Konteksttypevelger",
		"INFORMATION_AREA": "Informasjonsområde",
		"CONTEXTS_FOUND": "Kontekster funnet",
		"CONTEXT_FOUND": "Kontekst funnet",
		"SHORTCUT": "snarvei",
		"BADGE_VALUE": "merket verdi"
	},
	"sv": {
		"ERROR_STATUS": "Felstatus",
		"BAD_REQUEST": "Felaktig begäran",
		"FORBIDDEN": "Förbjuden",
		"UNAUTHORIZED": "Behörighet saknas",
		"FILE_NOT_FOUND": "Det gick inte att hitta filen",
		"INTERNAL_SERVER_ERROR": "Internt serverfel",
		"REQUEST_ABORTED": "Begäran avbröts",
		"UNKNOWN_ERROR": "Okänt fel",
		"CONNECTION_REFUSED": "Nekad anslutning mot URL: {0}. Kontrollera att URL: en är korrekt och att servern är igång.",
		"FILTER_OPTION_ALL": "Alla",
		"NOTIFICATIONS": "Meddelanden",
		"HELP": "Hjälp",
		"LAST_LOGIN_TIME": "Senaste inloggning",
		"LOGOUT": "Logga ut",
		"SELECT_CONTEXT": "Välj kontext",
		"SHOW_CONTEXTS": "Visa kontexter",
		"SEARCH_CONTEXT": "Sök kontext",
		"MY_DETAILS": "Mina uppgifter",
		"NO_MATCHING_RESULTS": "Inga matchande resultat",
		"MENU": "Meny",
		"OPEN_IN_NEW_BROWSER_TAB": "kommer att öppnas i en ny flik i din webbläsare.",
		"PROVIDE_YOUR_FEEDBACK": "Ge din feedback",
		"SERVICE_SELECTOR": "Serviceväljare",
		"CONTEXT_SELECTOR": "Kontextväljare",
		"CONTEXT_TYPE_SELECTOR": "Kontext typväljare",
		"INFORMATION_AREA": "Informationsområde",
		"CONTEXTS_FOUND": "Context found",
		"CONTEXT_FOUND": "Kontext hittades",
		"SHORTCUT": "genväg",
		"BADGE_VALUE": "märkevärde"
	}
};
var Translated = function Translated(t, language, fallbackLanguage) {
    this.messages = {
        errorStatus: t.get('ERROR_STATUS', language, fallbackLanguage),
        badRequest: t.get('BAD_REQUEST', language, fallbackLanguage),
        forbidden: t.get('FORBIDDEN', language, fallbackLanguage),
        unauthorized: t.get('UNAUTHORIZED', language, fallbackLanguage),
        fileNotFound: t.get('FILE_NOT_FOUND', language, fallbackLanguage),
        internalServerError: t.get('INTERNAL_SERVER_ERROR', language, fallbackLanguage),
        requestAborted: t.get('REQUEST_ABORTED', language, fallbackLanguage),
        unknownError: t.get('UNKNOWN_ERROR', language, fallbackLanguage),
        filterOptionsAll: t.get('FILTER_OPTION_ALL', language, fallbackLanguage),
        notifications: t.get('NOTIFICATIONS', language, fallbackLanguage),
        help: t.get('HELP', language, fallbackLanguage),
        lastLoginTime: t.get('LAST_LOGIN_TIME', language, fallbackLanguage),
        logout: t.get('LOGOUT', language, fallbackLanguage),
        selectContext: t.get('SELECT_CONTEXT', language, fallbackLanguage),
        showContexts: t.get('SHOW_CONTEXTS', language, fallbackLanguage),
        searchContext: t.get('SEARCH_CONTEXT', language, fallbackLanguage),
        myDetails: t.get('MY_DETAILS', language, fallbackLanguage),
        noMatchingResult: t.get('NO_MATCHING_RESULTS', language, fallbackLanguage),
        menu: t.get('MENU', language, fallbackLanguage),
        ariaLabelServicesMenu: t.get('ARIA_LABEL_SERVICES_MENU', language, fallbackLanguage),
        openInNewBrowserTab: t.get('OPEN_IN_NEW_BROWSER_TAB', language, fallbackLanguage),
        provideYourFeedback: t.get('PROVIDE_YOUR_FEEDBACK', language, fallbackLanguage),
        serviceSelector: t.get('SERVICE_SELECTOR', language, fallbackLanguage),
        contextSelector: t.get('CONTEXT_SELECTOR', language, fallbackLanguage),
        contextTypeSelector: t.get('CONTEXT_TYPE_SELECTOR', language, fallbackLanguage),
        informationArea: t.get('INFORMATION_AREA', language, fallbackLanguage),
        contextsFound: t.get('CONTEXTS_FOUND', language, fallbackLanguage),
        contextFound: t.get('CONTEXT_FOUND', language, fallbackLanguage),
        shortcut: t.get('SHORTCUT', language, fallbackLanguage),
        badgeValue: t.get('BADGE_VALUE', language, fallbackLanguage)
    };
};


/* jshint -W117 */

var StringUtil = function () {
    var self = this;

    self.camelize = function (str) {
        return str.replace('data-', '')
            .replace(/\-[a-z]/g, function ($1) { return $1.toUpperCase(); })
            .replace(/\-/g, '')
            .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
    };

    self.isNumber = function (str) {
        return !isNaN(parseFloat(str)) && isFinite(str);
    };

    self.isBoolean = function (str) {
        return str === 'true' || str === 'false';
    };

    self.parseBoolean = function (str) {
        if (str === 'true') {
            return true;
        }
        return false;
    };
};

/* jshint -W117 */

var DOMUtil = function () {
    var self = this,
        strg = new StringUtil();

    function getDataItem(items, field, value) {
        var item = null;
        if (items && items.length) {
            for (var i = 0, len = items.length; i < len; i++) {
                if (items[i][field].toString() === value) {
                    item = items[i];
                    break;
                }
            }
        }
        return item;
    }

    function createElement(tagName, classNames, attributes, text) {
        var element = document.createElement(tagName),
            i, len;
        if (classNames && classNames.length) {
            for (i = 0, len = classNames.length; i < len; i++) {
                element.classList.add(classNames[i]);
            }
        }
        if (attributes && attributes.length > 0) {
            for (i = 0, len = attributes.length; i < len; i++) {
                for (var key in attributes[i]) {
                    if (key) {
                        element.setAttribute(key, attributes[i][key]);
                    }
                }
            }
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    function isScrolledIntoView(el, wrapper) {
        var rect = el.getBoundingClientRect(),
            wrect = wrapper.getBoundingClientRect();
        var isVisible = (rect.top >= wrect.top) && (rect.bottom <= wrect.bottom);
        return isVisible;
    }

    function matchSelector(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length,
            has = false;
        while (--i >= 0 && matches.item(i) !== this) {
            if (i > -1) {
                has = true;
                break;
            }
        }
        return has;
    }

    function isElementMatch(element, selector) {
        var is = false;
        for (; element && element !== document; element = element.parentNode) {
            if (element.matches(selector)) {
                is = true;
                break;
            }
        }
        return is;
    }

    function getClosest(element, selector) {
        //https://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                matchSelector(s);
        }
        // Get closest match
        return isElementMatch(element, selector);
    }

    function setAsDropdownToggle(el, parent) {
        var p;
        if (parent) {
            p = parent;
        } else {
            p = el.parentElement;
        }
        if (p) {
            p.classList.add(constants.class.dropdown);
        }
        el.classList.add(constants.class.dropdownToggle);
        el.setAttribute('data-toggle', 'dropdown');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-expanded', false);
        var span = createElement('span', [constants.class.caret]);
        el.appendChild(span);
    }

    function createStrongElement(text, index, lastIndex) {
        var el = createElement('strong');
        el.textContent = text.slice(index, lastIndex);
        return el;
    }

    function escapeSearchString(str) {
        str = str.replace(/\$/gi, '\\$').replace(/\\/gi, '\\\\')
            .replace(/\^/gi, '\\^').replace(/\?/gi, '\\?').replace(/\*/gi, '\\*')
            .replace(/\+/gi, '\\+').replace(/\./gi, '\\.');
        return str;
    }

    function highlightText(parent, str, text) {
        if (str && str.length) {
            str = escapeSearchString(str);
            var regex = new RegExp(str, 'gi'),
                match = regex.exec(text);
            if (match) {
                var index = match.index;

                parent.textContent = '';
                if (index === 0) {
                    parent.appendChild(createStrongElement(text, index, regex.lastIndex));
                } else {
                    parent.appendChild(document.createTextNode(text.slice(0, index)));
                    parent.appendChild(createStrongElement(text, index, regex.lastIndex));
                }

                index = regex.lastIndex;
                while ((match = regex.exec(text))) {
                    parent.appendChild(document.createTextNode(text.slice(index, match.index)));
                    parent.appendChild(createStrongElement(text, match.index, regex.lastIndex));
                    index = regex.lastIndex;
                }
                parent.appendChild(document.createTextNode(text.slice(index, text.length)));
            }
        } else {
            parent.textContent = text;
        }
    }

    function getPropertiesExcept(obj, except) {
        if (obj) {
            var props = Object.getOwnPropertyNames(obj);
            for (var len = except.length, i = len - 1; i >= 0; i--) {
                for (var jlen = props.length, j = jlen; j >= 0; j--) {
                    if (except[i] === props[j]) {
                        props.splice(j, 1);
                    }
                }
            }
            return props;
        }
        return [];
    }

    function addDataAttributes(el, obj, arr) {
        if (arr && arr.length) {
            var attr;
            for (var i = 0, len = arr.length; i < len; i++) {
                attr = 'data-' + arr[i].replace(/([A-Z])/g, '-$1');
                el.setAttribute(attr, obj[arr[i]]);
            }
        }
    }

    function getSelectedContext(el) {
        var obj = null;
        if (el) {
            var id = el.id;
            if (strg.isNumber(id)) {
                id = parseFloat(id);
            }
            obj = {
                id: id,
                name: el.textContent
            };
            var attrs = el.attributes, name, value;
            for (var i = 0, len = attrs.length; i < len; i++) {
                name = attrs[i].nodeName;
                if (name.indexOf('data-') > -1) {
                    name = strg.camelize(name);
                    value = attrs[i].nodeValue;
                    if (strg.isNumber(value)) {
                        obj[name] = parseFloat(value);
                    } else if (strg.isBoolean(value)) {
                        obj[name] = strg.parseBoolean(value);
                    } else {
                        obj[name] = value;
                    }
                }
            }
        }
        return obj;
    }

    function getFirstElement(arr, isNull) {
        var result = null;
        if (arr && arr.length) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (isNull) {
                    if (!arr[i].id || arr[i].id === null) {
                        result = arr[i];
                        break;
                    }
                } else {
                    if (arr[i].id) {
                        result = arr[i];
                        break;
                    }
                }
            }
            return result;
        }
    }

    function getDataProperties(data, isNull) {
        var res = getFirstElement(data, isNull), arr = [];
        if (res) {
            arr = getPropertiesExcept(res, ['id', 'name']);
        }
        return arr;
    }

    self.createElement = function (tagName, classNames, attributes, text) {
        return createElement(tagName, classNames, attributes, text);
    };

    self.getDataItem = function (items, field, value) {
        return getDataItem(items, field, value);
    };

    self.isScrolledIntoView = function (el, wrapper) {
        return isScrolledIntoView(el, wrapper);
    };

    self.getClosest = function (element, selector) {
        return getClosest(element, selector);
    };

    self.setAsDropdownToggle = function (el, parent) {
        setAsDropdownToggle(el, parent);
    };

    self.highlightText = function (parent, str, text) {
        return highlightText(parent, str, text);
    };

    self.addDataAttributes = function (el, obj, arr) {
        addDataAttributes(el, obj, arr);
    };

    self.getPropertiesExcept = function (obj, except) {
        return getPropertiesExcept(obj, except);
    };

    self.getSelectedContext = function (el) {
        return getSelectedContext(el);
    };

    self.getDataProperties = function (data, isNull) {
        return getDataProperties(data, isNull);
    };

    self.hasClass = function (el, clazz) {
        if (el) {
            return el.classList.contains(clazz);
        }
    };

    self.addClass = function (el, clazz) {
        if (el) {
            return el.classList.add(clazz);
        }
    };

    self.removeClass = function (el, clazz) {
        if (el) {
            return el.classList.remove(clazz);
        }
    };

};
var XHRService = (function () {
    var instance;

    function init() {
        function call(url, httpMethod, xsrfToken, json, callback, withCredentials) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var response;
                        if (xhr.responseText) {
                            try {
                                response = JSON.parse(xhr.responseText);
                            } catch (e) {
                                response = xhr.responseText;
                            }
                        }
                        callback(response);
                    } else {
                        callback({ errorStatus: xhr.status, message: xhr.responseText });
                    }
                }
            };

            xhr.open(httpMethod, url, true);
            if (json) {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            }
            if (xsrfToken && xsrfToken.header && xsrfToken.value) {
                xhr.setRequestHeader(xsrfToken.header, xsrfToken.value);
            }
            
            xhr.setRequestHeader('Cache-control', 'no-cache');
            xhr.setRequestHeader('Pragma', 'no-cache');
            xhr.setRequestHeader('Expires', 0);
            
            xhr.withCredentials = !!withCredentials;
            xhr.send(json);
        }

        function getAsQueryParams(params) {
            var result = '';
            if (params && params.length) {
                result = '?';
                for (var i = 0, len = params.length; i < len; i++) {
                    result += params[i].name + '=' + encodeURIComponent(params[i].value);
                    if (i < len - 1) {
                        result += '&';
                    }
                }
            }
            return result;
        }

        function getAsNotEncodedPathParams(params) {
            var result = '';
            if (params && params.length) {
                result = '/' + params.join('/');
            }
            return result;
        }

        function getAsEncodedPathParams(params) {
            var result = '';
            if (params && params.length) {
                result = '/';
                for (var i = 0, len = params.length; i < len; i++) {
                    result += encodeURIComponent(params[i]);
                    if (i < len - 1) {
                        result += '/';
                    }
                }
            }
            return result;
        }

        function getAsPathParams(params, encodesPathParams) {
            if (encodesPathParams) {
                return getAsEncodedPathParams(params);
            } else {
                return getAsNotEncodedPathParams(params);
            }
        }

        function isError(response) {
            if (response === undefined || response === null ||
                response && response.errorStatus === undefined) {
                return false;
            }
            return true;
        }

        function getI18NErrorMessage(status, msg) {
            var message = msg.errorStatus + ': ' + status + ' :: ';
            switch (status) {
                case 400:
                    message += msg.badRequest;
                    break;
                case 401:
                    message += msg.unauthorized;
                    break;
                case 403:
                    message += msg.forbidden;
                    break;
                case 404:
                    message += msg.fileNotFound;
                    break;
                case 500:
                    message += msg.internalServerError;
                    break;
                case 0:
                    message += msg.requestAborted;
                    break;
                default:
                    message += msg.unknownError;
            }
            return message;
        }

        function getErrorMessage(status, responseText, msg) {
            var message;
            if (msg) {
                message = getI18NErrorMessage(status, msg);
            } else {
                if (status === 0) {
                    responseText = 'Request aborted';
                }
                message = 'Error status: ' + status + ' :: ' + responseText;
            }
            return message;
        }

        return {
            isError: function (response) {
                return isError(response);
            },
            getErrorMessage: function (status, responseText, msg) {
                return getErrorMessage(status, responseText, msg);
            },
            getAsQueryParams: function (params) {
                return getAsQueryParams(params);
            },
            getAsPathParams: function (params, encodesPathParams) {
                return getAsPathParams(params, encodesPathParams);
            },
            get: function (url, xsrfToken, callback, withCredentials) {
                call(url, 'GET', xsrfToken, null, callback, withCredentials);
            },
            post: function (url, xsrfToken, json, callback, withCredentials) {
                call(url, 'POST', xsrfToken, json, callback, withCredentials);
            },
            put: function (url, xsrfToken, json, callback, withCredentials) {
                call(url, 'PUT', xsrfToken, json, callback, withCredentials);
            },
            delete: function (url, xsrfToken, callback, withCredentials) {
                call(url, 'DELETE', xsrfToken, null, callback, withCredentials);
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
/* jshint -W117 */

var Translation = (function () {
    var instance;

    function init() {

        function hasLanguage(language) {
            var has = false;
            for (var key in translations) {
                if (translations.hasOwnProperty(key)) {
                    if (key === language) {
                        has = true;
                        break;
                    }
                }
            }
            return has;
        }

        function replaceParams(value, params) {
            if (params && params.length > 0) {
                for (var i = 0, len = params.length; i < len; i++) {
                    value = value.replace('{' + i + '}', params[i]);
                }
            }
            return value;
        }

        function get(key, language, fallbackLanguage, params) {

            if (!key || !language && !fallbackLanguage) {
                return null;
            }

            var value;
            if (language && hasLanguage(language)) {
                value = translations[language][key];
                if (value) {
                    return replaceParams(value, params);
                }
            }

            if (fallbackLanguage) {
                value = translations[fallbackLanguage][key];
                if (value) {
                    return replaceParams(value, params);
                }
            }

            return key;
        }

        return {
            get: function (key, language, fallbackLanguage, params) {
                return get(key, language, fallbackLanguage, params);
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
var DateFormat = (function () {
    var instance;

    function init() {

        function format(locale, time, options) {
            if (locale === 'no') { locale = 'nb'; }
            var date = new Date(time);
            return date.toLocaleDateString(locale, options);
        }

        return {
            getLastLoginTime: function (locale, time) {
                if (time) {
                    var options = {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: 'numeric', minute: 'numeric', hour12: false
                    };
                    return format(locale, time, options);
                }
                return time;
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
/* jshint -W117 */
var DOMTypeahead = (function () {
    var instance;

    function init() {

        var dom = new DOMUtil();

        function createInput(msg, selected) {
            var input = dom.createElement('input', ['form-control', 'nc4typeahead'], [
                { id: constants.id.contextsSearch }, { type: 'text' },
                { title: 'Search input' }, { placeholder: msg.searchContext },
                { 'aria-autocomplete': 'list' }, { 'aria-controls': constants.id.contextsDropdown },
                { 'aria-labelledby': 'contexts-label' }, { 'aria-activedescendant': false }
            ]);
            if (selected) {
                input.value = selected.name;
            } else {
                input.value = null;
            }
            return input;
        }

        function createDropdownMenu() {
            var ul = dom.createElement('ul', [constants.class.dropdownMenu, constants.class.companyDropdown], [
                { id: constants.id.contextsDropdown }, { role: 'listbox' }, { 'data-group': constants.contextType.All },
                { 'aria-labelledby': 'contexts-label' }
            ]);
            return ul;
        }

        function createNoMatchingDiv(msg) {
            var div = dom.createElement('div', [constants.class.noResults], [{
                id: constants.id.noMatchingResult
            }], msg.noMatchingResult);
            dom.addClass(div, constants.class.hidden);
            return div;
        }

        function previous(ul, input) {
            var active = ul.querySelector(constants.selector.focusItem);
            if (active && active.previousSibling) {
                dom.removeClass(active, constants.class.focus);
                dom.addClass(active.previousSibling, constants.class.focus);
                active.setAttribute('aria-selected', false);
                active.previousSibling.setAttribute('aria-selected', true);
                input.setAttribute('aria-activedescendant', active.previousSibling.id);
                if (!dom.isScrolledIntoView(active.previousSibling, ul)) {
                    active.previousSibling.scrollIntoView(true);
                }
            }
        }

        function next(ul, input) {
            var active = ul.querySelector(constants.selector.focusItem);
            if (active && active.nextSibling) {
                dom.removeClass(active, constants.class.focus);
                dom.addClass(active.nextSibling, constants.class.focus);
                active.setAttribute('aria-selected', false);
                active.nextSibling.setAttribute('aria-selected', true);
                input.setAttribute('aria-activedescendant', active.nextSibling.id);
                if (!dom.isScrolledIntoView(active.nextSibling, ul)) {
                    active.nextSibling.scrollIntoView(true);
                }
            } else {
                active = ul.children[0];
                dom.addClass(active, constants.class.focus);
                active.setAttribute('aria-selected', true);
                input.setAttribute('aria-activedescendant', active.id);
            }
        }

        function scrollToFirst(ul) {
            var active = ul.querySelector(constants.selector.focusItem);
            if (active && !dom.isScrolledIntoView(active, ul)) {
                active.scrollIntoView(true);
            }
        }

        function closeContextTriggerDropdown() {
            var el = document.getElementById(constants.id.contextTrigger);
            if (el && el.Dropdown) {
                el.Dropdown.toggle();
            }
        }

        function select(event, active, ul, input, div, callbacks) {
            close(ul, div);
            input.value = active.textContent;
            callbacks.setSelectedContext(event, active.textContent);
            closeContextTriggerDropdown();
            callbacks.onChangeContextSelector(event, dom.getSelectedContext(active));
        }

        function close(ul, div) {
            if (ul.parentElement) {
                dom.removeClass(ul.parentElement, constants.class.open);
            }
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
            dom.addClass(ul, constants.class.hidden);
            ul.parentElement.setAttribute('aria-expanded', false);
            dom.addClass(div, constants.class.hidden);
        }

        function setSearchInputValue() {
            var el = document.getElementById(constants.id.selectedContext),
                input = document.getElementById(constants.id.contextsSearch);
            if (el && input) {
                input.value = el.textContent;
            }
        }

        function handleKeyUp(event, c, ul, input, div, callbacks) {
            if (c === constants.keyCode.ALT) {
                return;
            } else if (c === constants.keyCode.ESCAPE) {
                close(ul, div);
            } else if (c === constants.keyCode.UP_ARROW) {
                previous(ul, input);
            } else if (c === constants.keyCode.DOWN_ARROW) {
                next(ul, input);
            } else if (c === constants.keyCode.RETURN) {
                var active = ul.querySelector(constants.selector.focusItemLink);
                if (active) {
                    select(event, active, ul, input, div, callbacks);
                }
            } else {
                var dataGroup = ul.getAttribute(constants.attr.dataGroup);
                callbacks.search(dataGroup, input.value);
            }
        }

        function initDropdown(element, callbacks) {
            var ul = document.getElementById(constants.id.contextsDropdown),
                input = document.getElementById(constants.id.contextsSearch),
                div = document.getElementById(constants.id.noMatchingResult);

            dom.addClass(ul, constants.class.hidden);

            input.addEventListener('focus', function (event) {
                var el = event.target;
                el.value = el.value.trim();
                el.setSelectionRange(0, el.value.length);
            });

            input.addEventListener('keyup', function (event) {
                var c = event.which || event.keyCode;
                event.preventDefault();
                if (!event.altKey && c !== 18) {
                    handleKeyUp(event, c, ul, input, div, callbacks);
                }
            }, false);

            document.addEventListener('click', function (event) {
                if (dom.getClosest(event.target, '#' + element.id)) {
                    input.focus();
                } else {
                    close(ul, div);
                    setSearchInputValue();
                    if (document.activeElement && document.activeElement.id === input.id) {
                        event.stopImmediatePropagation();
                    }
                }
            }, false);
        }

        function createComponent(element, msg, options, selected, callbacks) {
            dom.addClass(element, constants.class.dropdown);
            var live = dom.createElement('div', [constants.class.contextSelectorAriaLive],
                [{ id: constants.id.contextSelectorAriaLive }, { 'aria-live': true }, { 'aria-atomic': true }, { role: 'status' }]);
            element.appendChild(createInput(msg, selected));
            element.appendChild(live);
            element.appendChild(createDropdownMenu());
            element.appendChild(createNoMatchingDiv(msg));
            initDropdown(element, callbacks);
        }


        function onClickItemHandler(ul, div, callbacks) {
            var items = document.getElementsByClassName(constants.class.contextItem);
            if (items && items.length) {
                var input = document.getElementById(constants.id.contextsSearch);
                for (var i = 0, len = items.length; i < len; i++) {
                    items[i].addEventListener('click', function (event) {
                        var active = event.target;
                        if (active.tagName === 'STRONG') {
                            active = active.parentElement;
                        }
                        select(event, active, ul, input, div, callbacks);
                    }, false);
                }
            }
        }

        function removeChildren(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }

        function search(str, results, msg, callbacks) {
            var ul = document.getElementById(constants.id.contextsDropdown),
                input = document.getElementById(constants.id.contextsSearch),
                ariaLive = document.getElementById(constants.id.contextSelectorAriaLive),
                div = document.getElementById(constants.id.noMatchingResult);
            ariaLive.textContent = '';
            if (results && results.length > 0) {
                var frgm = document.createDocumentFragment(),
                    li, a, item, dataItem = dom.getDataProperties(results);
                removeChildren(ul);
                for (var i = 0, len = results.length; i < len; i++) {
                    item = results[i];
                    li = dom.createElement('li', null, [{ id: constants.prefix.context + item.id }, { 'aria-selected': false }]);
                    a = dom.createElement('a', [constants.class.contextItem], [{
                        'id': item.id
                    }]);
                    dom.addDataAttributes(a, item, dataItem);
                    dom.highlightText(a, str, item.name);
                    li.appendChild(a);
                    frgm.appendChild(li);
                }
                ul.appendChild(frgm);
                dom.removeClass(ul, constants.class.hidden);
                ul.parentElement.setAttribute('aria-expanded', true);
                dom.addClass(ul.parentElement, constants.class.open);
                dom.addClass(div, constants.class.hidden);
                onClickItemHandler(ul, div, callbacks);
                scrollToFirst(ul);
                if (results.length === 1) {
                    ariaLive.textContent = 1 + ' ' + msg.contextFound;
                } else {
                    ariaLive.textContent = results.length + ' ' + msg.contextFound;
                }
            } else {
                dom.addClass(ul, constants.class.hidden);
                input.setAttribute('aria-activedescendant', false);
                if (str && str.length) {
                    dom.removeClass(div, constants.class.hidden);
                    dom.addClass(ul.parentElement, constants.class.open);
                    ariaLive.textContent = msg.noMatchingResult;
                } else {
                    dom.addClass(div, constants.class.hidden);
                    dom.removeClass(ul.parentElement, constants.class.open);
                    ul.parentElement.setAttribute('aria-expanded', false);
                }
                removeChildren(ul);
            }
        }

        function itemsByType(results, callbacks) {
            var ul = document.getElementById(constants.id.contextsDropdown),
                div = document.getElementById(constants.id.noMatchingResult),
                frgm = document.createDocumentFragment(),
                li, a, item, dataItem = dom.getDataProperties(results);
            removeChildren(ul);
            for (var i = 0, len = results.length; i < len; i++) {
                item = results[i];
                li = dom.createElement('li', null, [{ id: constants.prefix.context + item.id }]);
                a = dom.createElement('a', [constants.class.contextItem], [{
                    'id': item.id
                }], item.name);
                if (i === 0) {
                    dom.addClass(li, constants.class.focus);
                    li.setAttribute('aria-selected', true);
                }
                dom.addDataAttributes(a, item, dataItem);
                li.appendChild(a);
                frgm.appendChild(li);
            }
            ul.appendChild(frgm);
            onClickItemHandler(ul, div, callbacks);
            ul.children[0].children[0].click();
        }

        function filterByType(type) {
            var ul = document.getElementById(constants.id.contextsDropdown);
            if (type) {
                ul.setAttribute(constants.attr.dataGroup, type);
            } else {
                ul.setAttribute(constants.attr.dataGroup, '');
            }
        }

        return {
            createComponent: function (element, msg, options, selected, callbacks) {
                createComponent(element, msg, options, selected, callbacks);
            },
            search: function (str, results, msg, callbacks) {
                search(str, results, msg, callbacks);
            },
            itemsByType: function (results, callbacks) {
                itemsByType(results, callbacks);
            },
            filterByType: function (type) {
                filterByType(type);
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
/* jshint -W117 */
var Typeahead = function (element, msg, options, selected, callbacks) {
    var self = this,
        dom = DOMTypeahead.getInstance(),
        xhrs = XHRService.getInstance(),
        delay;

    function getSearchParams(type, search) {
        var params;
        if (options.usesQueryParams) {
            if (options.allowedContextTypes) {
                params = xhrs.getAsQueryParams([{
                    name: 'contextType',
                    value: type
                },
                {
                    name: 'searchString',
                    value: search
                },
                {
                    name: 'limit',
                    value: options.limitForTypeaheadResults
                },
                {
                    name: 'allowedContextTypes', value: options.allowedContextTypes
                }
                ]);
            } else {
                params = xhrs.getAsQueryParams([{
                    name: 'contextType',
                    value: type
                },
                {
                    name: 'searchString',
                    value: search
                },
                {
                    name: 'limit',
                    value: options.limitForTypeaheadResults
                }
                ]);
            }
        } else {
            if (options.allowedContextTypes) {
                params = xhrs.getAsPathParams([type, search, options.limitForTypeaheadResults, options.allowedContextTypes],
                    options.encodesPathParams);
            } else {
                params = xhrs.getAsPathParams([type, search, options.limitForTypeaheadResults],
                    options.encodesPathParams);
            }
        }
        return params;
    }

    function getItemsByTypeParams(type) {
        var params;
        if (options.usesQueryParams) {
            params = xhrs.getAsQueryParams([{
                name: 'contextType',
                value: type
            }]);
        } else {
            params = xhrs.getAsPathParams([type], options.encodesPathParams);
        }
        return params;
    }

    function getDataAsArray(data) {
        if (!data) {
            return data;
        }

        if (Array.isArray(data)) {
            return data;
        }

        var arr = [];
        arr.push(data);
        return arr;
    }

    callbacks.search = function (type, search) {
        if (callbacks.onTypeaheadSearch) {
            callbacks.onTypeaheadSearch(type, search, options.limitForTypeaheadResults, function (data) {
                dom.search(search, data, msg, callbacks);
            });
        } else {
            clearTimeout(delay);
            delay = setTimeout(function () {
                if (search && search.length > 0) {
                    var url = options.baseUrl + options.restFulPath.itemsSearch;
                    url += getSearchParams(type, search);
                    xhrs.get(url, options.xsrfToken,
                        function (data) {
                            if (xhrs.isError(data)) {
                                if (options.callback.onError) {
                                    options.callback.onError({ status: data.errorStatus, message: data.message });
                                }
                                return;
                            }
                            dom.search(search, data, msg, callbacks);
                        }, options.withCredentials);

                } else {
                    dom.search(search, [], msg, callbacks);
                }
            }, 500);
        }
    };

    dom.createComponent(element, msg, options, selected, callbacks);

    self.api = {
        filterByType: function (type) {
            if (type) {
                dom.filterByType(type);
                if (options.usesItemsByType && type !== constants.contextType.All) {
                    if (callbacks.onTypeaheadItemsByType) {
                        callbacks.onTypeaheadItemsByType(type, options.limitForTypeaheadResults, function (data) {
                            data = getDataAsArray(data);
                            if (data && data.length === 1) {
                                dom.itemsByType(data, callbacks);
                            }
                        });
                    } else {
                        var url = options.baseUrl + options.restFulPath.itemsByType;
                        url += getItemsByTypeParams(type);
                        xhrs.get(url, options.xsrfToken,
                            function (data) {
                                if (xhrs.isError(data)) {
                                    if (options.callback.onError) {
                                        options.callback.onError({ status: data.errorStatus, message: data.message });
                                    }
                                    return;
                                }
                                data = getDataAsArray(data);
                                if (data && data.length === 1) {
                                    dom.itemsByType(data, callbacks);
                                }
                            }, options.withCredentials);
                    }
                }
            }
        }
    };

};
/* jshint -W117 */

var FilterUtil = function () {
    var self = this;

    function shouldFilterBy(type) {
        if (!type) {
            return false;
        }
        if (type.toLowerCase() === 'all') {
            return false;
        }
        return true;
    }

    self.shouldFilterBy = function (type) {
        return shouldFilterBy(type);
    };

};
/* jshint -W117 */
var DOMSelect = (function () {
    var instance;


    function init() {

        var dom = new DOMUtil(),
            filter = new FilterUtil();

        function createDropdownToggle(element, msg, selected) {
            var input = dom.createElement('input', null, [{ id: constants.id.contextsSearch }, { type: 'text' },
            { placeholder: msg.selectContext }, { autocomplete: 'off' }, { 'aria-autocomplete': 'both' },
            { 'aria-controls': constants.id.contextsDropdown }, { 'aria-activedescendant': false }]),
                span = dom.createElement('span', ['btn', 'form-control', 'select-toggle'],
                    [{ id: constants.id.contextsSearchButton }, { tabindex: 0 }, { title: msg.showContexts },
                    { role: 'button' }]),
                i = dom.createElement('span', ['vismaicon', 'vismaicon-autocomplete', 'pull-right'],
                    [{ 'aria-hidden': true }]);
            if (selected && selected.name) {
                span.textContent = selected.name;
            }
            dom.addClass(input, constants.class.hidden);
            span.appendChild(i);
            element.appendChild(span);
            element.appendChild(input);
        }

        function createDropdownMenu(data, selected) {
            var ul = dom.createElement('ul', [constants.class.dropdownMenu, constants.class.companyDropdown],
                [{ id: constants.id.contextsDropdown }, { role: 'listbox' }]),
                frgm = document.createDocumentFragment(),
                li, a, item,
                dataGroup = dom.getDataProperties(data, true),
                dataItem = dom.getDataProperties(data);
            for (var i = 0, len = data.length; i < len; i++) {
                item = data[i];
                li = dom.createElement('li');
                if (selected) {
                    if (item.id === selected.id) {
                        dom.addClass(li, constants.class.active);
                        dom.addClass(li, constants.class.focus);
                    }
                }
                if (item.id) {
                    a = dom.createElement('a', [constants.class.contextItem], [{
                        'id': item.id
                    }], item.name);
                    dom.addDataAttributes(a, item, dataItem);
                    li.setAttribute('id', constants.prefix.context + item.id);
                    li.setAttribute('role', 'option');
                    if (item.selected) {
                        dom.addClass(li, constants.class.active);
                        dom.addClass(li, constants.class.focus);
                    }
                    li.appendChild(a);
                } else {
                    li.setAttribute('role', 'group');
                    dom.addClass(li, constants.class.selectGroup);
                    dom.addClass(li, constants.class.contextGroup);
                    dom.addDataAttributes(li, item, dataGroup);
                    li.textContent = item.name;
                }
                frgm.appendChild(li);
            }
            ul.appendChild(frgm);
            return ul;
        }

        function createNoMatchingDiv(msg) {
            var div = dom.createElement('div', [constants.class.noResults], [{
                id: constants.id.noMatchingResult
            }], msg.noMatchingResult);
            dom.addClass(div, constants.class.hidden);
            return div;
        }

        function resetActive(items, dataGroup, isBlurEvent) {
            for (var i = 0, len = items.length; i < len; i++) {
                dom.highlightText(items[i], null, items[i].textContent);
                if (!isBlurEvent) {
                    dom.removeClass(items[i].parentElement, constants.class.active);
                    dom.removeClass(items[i].parentElement, constants.class.focus);
                }
                if (filter.shouldFilterBy(dataGroup)) {
                    if (items[i].getAttribute(constants.attr.dataType) === dataGroup) {
                        dom.removeClass(items[i].parentElement, constants.class.hidden);
                        dom.removeClass(items[i].parentElement, constants.class.focus);
                    } else {
                        dom.addClass(items[i].parentElement, constants.class.hidden);
                    }
                } else {
                    dom.removeClass(items[i].parentElement, constants.class.hidden);
                    dom.removeClass(items[i].parentElement, constants.class.focus);
                }
            }
        }

        function resetGroups(dataGroup, groups) {
            if (!dataGroup) {
                for (var j = 0, jlen = groups.length; j < jlen; j++) {
                    dom.removeClass(groups[j], constants.class.hidden);
                }
            }
        }

        function hasVisibleChildren(type, items) {
            var has = false;
            for (var i = 0, len = items.length; i < len; i++) {
                if (items[i].id && type === items[i].getAttribute(constants.attr.dataType) &&
                    !dom.hasClass(items[i].parentElement, constants.class.hidden)) {
                    has = true;
                    break;
                }
            }
            return has;
        }

        function getFocusedItem(ul) {
            var a = ul.querySelector(constants.selector.focusedActiveContextItem);
            if (!a) {
                a = ul.querySelector(constants.selector.focusedContextItem);
            }
            return a.parentElement;
        }

        function removeFocus(ul) {
            var li = getFocusedItem(ul);
            dom.removeClass(li, constants.class.focus);
        }

        function getPreviousSibling(el) {
            if (!dom.hasClass(el, constants.class.focus)) {
                return el;
            }
            var s = el, found = false;
            while (s && !found) {
                s = s.previousSibling;
                if (s && !dom.hasClass(s, constants.class.selectGroup) &&
                    !dom.hasClass(s, constants.class.hidden)) {
                    found = true;
                }
            }
            if (!found) {
                s = null;
            }
            return s;
        }

        function getNextSibling(el) {
            if (!dom.hasClass(el, constants.class.focus)) {
                return el;
            }
            var s = el, found = false;
            while (s && !found) {
                s = s.nextSibling;
                if (s && !dom.hasClass(s, constants.class.selectGroup) &&
                    !dom.hasClass(s, constants.class.hidden)) {
                    found = true;
                }
            }
            if (!found) {
                s = null;
            }
            return s;
        }

        function previous(ul, input) {
            var active = getFocusedItem(ul),
                s = getPreviousSibling(active);
            if (active && s) {
                dom.removeClass(active, constants.class.focus);
                dom.addClass(s, constants.class.focus);
                active.setAttribute('aria-selected', false);
                s.setAttribute('aria-selected', true);
                input.setAttribute('aria-activedescendant', s.id);
                if (!dom.isScrolledIntoView(s, ul)) {
                    s.scrollIntoView(true);
                }
            }
        }

        function next(ul, input) {
            var active = getFocusedItem(ul),
                s = getNextSibling(active);
            if (active && s) {
                dom.removeClass(active, constants.class.focus);
                dom.addClass(s, constants.class.focus);
                active.setAttribute('aria-selected', false);
                s.setAttribute('aria-selected', true);
                input.setAttribute('aria-activedescendant', s.id);
                if (!dom.isScrolledIntoView(s, ul)) {
                    s.scrollIntoView(true);
                }
            }
        }

        function closeContextTriggerDropdown() {
            var el = document.getElementById(constants.id.contextTrigger);
            if (el && el.Dropdown) {
                el.Dropdown.toggle();
            }
        }

        function hideDropdown(btn, ul, input) {
            var dropdown = document.getElementById(constants.id.contextSelector);
            if (dropdown) {
                dropdown.setAttribute('aria-expanded', false);
                dom.removeClass(dropdown, constants.class.open);
            }
            dom.removeClass(btn, constants.class.hidden);
            dom.addClass(ul, constants.class.hidden);
            dom.addClass(input, constants.class.hidden);
            input.value = null;
        }

        function select(event, active, btn, ul, input, groups, items, div, callbacks) {
            hideDropdown(btn, ul, input);
            dom.addClass(div, constants.class.hidden);
            if (btn.childNodes.length === 1) {
                var text = document.createTextNode(active.textContent);
                btn.prepend(text);
            } else {
                btn.childNodes[0].textContent = active.textContent;
            }
            var dataGroup = ul.getAttribute(constants.attr.dataGroup);
            resetActive(items, dataGroup);
            resetGroups(dataGroup, groups);
            removeFocus(ul);
            dom.addClass(active.parentElement, constants.class.active);
            dom.addClass(active.parentElement, constants.class.focus);
            callbacks.setSelectedContext(event, active.textContent);
            closeContextTriggerDropdown();
            callbacks.onChangeContextSelector(event, dom.getSelectedContext(active));
        }

        function close(btn, ul, input, groups, items, div) {
            hideDropdown(btn, ul, input);
            dom.addClass(div, constants.class.hidden);
            var dataGroup = ul.getAttribute(constants.attr.dataGroup);
            resetActive(items, dataGroup, true);
            resetGroups(dataGroup, groups);
        }

        function showDropdown(btn, ul, input) {
            dom.removeClass(ul, constants.class.hidden);
            dom.removeClass(input, constants.class.hidden);
            dom.addClass(btn, constants.class.hidden);
        }

        function handleButtonEvents(btn, ul, input) {
            var dropdown = document.getElementById(constants.id.contextFilter);
            if (dropdown && dropdown.Dropdown && dropdown.parentElement) {
                if (dom.hasClass(dropdown.parentElement, constants.class.open)) {
                    dropdown.setAttribute('aria-expanded', false);
                    dropdown.Dropdown.toggle();
                }
            }
            dropdown = document.getElementById(constants.id.contextSelector);
            if (dropdown) {
                dom.addClass(dropdown, constants.class.open);
                dropdown.setAttribute('aria-expanded', true);
                showDropdown(btn, ul, input);
                var selected = dropdown.querySelector(constants.selector.activeItem);
                if (selected) {
                    dom.addClass(selected, constants.class.focus);
                    selected.setAttribute('aria-selected', true);
                    input.setAttribute('aria-activedescendant', selected.id);
                    selected.scrollIntoView(true);
                }
            }
            input.focus();
        }

        function initDropdown(element, callbacks) {
            var btn = document.getElementById(constants.id.contextsSearchButton),
                ul = document.getElementById(constants.id.contextsDropdown),
                input = document.getElementById(constants.id.contextsSearch),
                groups = document.getElementsByClassName(constants.class.contextGroup),
                items = document.getElementsByClassName(constants.class.contextItem),
                div = document.getElementById(constants.id.noMatchingResult);

            dom.addClass(ul, constants.class.hidden);

            btn.addEventListener('click', function (event) {
                handleButtonEvents(btn, ul, input);
            }, false);

            btn.addEventListener('keyup', function (event) {
                var c = event.which || event.keyCode;
                if (c === constants.keyCode.RETURN) {
                    handleButtonEvents(btn, ul, input);
                }
            }, false);

            if (items && items.length) {
                for (var i = 0, len = items.length; i < len; i++) {
                    items[i].addEventListener('click', function (event) {
                        var active = event.target;
                        if(active.tagName === 'STRONG'){
                            active = active.parentElement;
                        }
                        select(event, active, btn, ul, input, groups, items, div, callbacks);
                    }, false);
                }
            }

            input.addEventListener('keyup', function (event) {
                var c = event.which || event.keyCode,
                    active;
                event.preventDefault();
                if (c === constants.keyCode.ESCAPE) {
                    close(btn, ul, input, groups, items, div);
                } else if (c === constants.keyCode.UP_ARROW) {
                    previous(ul, input);
                } else if (c === constants.keyCode.DOWN_ARROW) {
                    next(ul, input);
                } else if (c === constants.keyCode.RETURN) {
                    active = ul.querySelector(constants.selector.focusItemLink);
                    select(event, active, btn, ul, input, groups, items, div, callbacks);
                } else {
                    callbacks.search(input.value);
                }
            }, false);

            document.addEventListener('click', function (event) {
                if (!dom.getClosest(event.target, '#' + element.id)) {
                    close(btn, ul, input, groups, items, div);
                }
            }, false);
        }

        function createComponent(element, msg, options, data, selected, callbacks) {
            dom.addClass(element, constants.class.dropdown);
            createDropdownToggle(element, msg, selected);
            var live = dom.createElement('div', [constants.class.contextSelectorAriaLive],
                [{ id: constants.id.contextSelectorAriaLive }, { 'aria-live': true }, { 'aria-atomic': true }, { role: 'status' }]);
            element.appendChild(live);
            element.appendChild(createDropdownMenu(data, selected));
            element.appendChild(createNoMatchingDiv(msg));
            initDropdown(element, callbacks);

        }

        function hideItems(items) {
            for (var i = 0, len = items.length; i < len; i++) {
                dom.addClass(items[i].parentElement, constants.class.hidden);
                dom.removeClass(items[i].parentElement, constants.class.focus);
            }
        }

        function hideGroups(groups) {
            for (var i = 0, len = groups.length; i < len; i++) {
                dom.addClass(groups[i], constants.class.hidden);
            }
        }

        function showItems(items, str, results, dataGroup) {
            for (var i = 0, len = results.length; i < len; i++) {
                for (var j = 0, jlen = items.length; j < jlen; j++) {
                    if (filter.shouldFilterBy(dataGroup)) {
                        if (results[i].id && items[j].id === results[i].id.toString() &&
                            dataGroup === results[i].type) {
                            dom.removeClass(items[j].parentElement, constants.class.hidden);
                            dom.highlightText(items[j], str, items[j].textContent);
                            break;
                        }
                    } else {
                        if (results[i].id && items[j].id === results[i].id.toString()) {
                            dom.removeClass(items[j].parentElement, constants.class.hidden);
                            dom.highlightText(items[j], str, items[j].textContent);
                            break;
                        }
                    }
                }
            }
        }

        function showGroups(groups, items) {
            var type;
            for (var i = 0, len = groups.length; i < len; i++) {
                type = groups[i].getAttribute(constants.attr.dataType);
                if (items) {
                    if (hasVisibleChildren(type, items)) {
                        dom.removeClass(groups[i], constants.class.hidden);
                    }
                } else {
                    dom.removeClass(groups[i], constants.class.hidden);
                }
            }
        }

        function search(str, results, msg) {
            var items = document.getElementsByClassName(constants.class.contextItem),
                groups = document.getElementsByClassName(constants.class.contextGroup),
                ul = document.getElementById(constants.id.contextsDropdown),
                input = document.getElementById(constants.id.contextsSearch),
                dataGroup = ul.getAttribute(constants.attr.dataGroup),
                div = document.getElementById(constants.id.noMatchingResult),
                ariaLive = document.getElementById(constants.id.contextSelectorAriaLive);

            ariaLive.textContent = '';
            hideItems(items);
            hideGroups(groups);
            showItems(items, str, results, dataGroup);

            if (results && results.length > 0) {
                dom.removeClass(ul, constants.class.hidden);
                dom.addClass(div, constants.class.hidden);
                if (results.length === 1) {
                    ariaLive.textContent = 1 + ' ' + msg.contextFound;
                } else {
                    ariaLive.textContent = results.length + ' ' + msg.contextFound;
                }
            } else {
                dom.addClass(ul, constants.class.hidden);
                input.setAttribute('aria-activedescendant', false);
                if (str && str.length) {
                    dom.removeClass(div, constants.class.hidden);
                    ariaLive.textContent = msg.noMatchingResult;
                } else {
                    dom.addClass(div, constants.class.hidden);
                }
            }
        }

        function filterByType(type) {
            var items = document.getElementsByClassName(constants.class.contextItem),
                groups = document.getElementsByClassName(constants.class.contextGroup),
                ul = document.getElementById(constants.id.contextsDropdown), i, len, results = [];
            ul.setAttribute(constants.attr.dataGroup, type);
            if (filter.shouldFilterBy(type)) {
                hideGroups(groups);
                for (i = 0, len = items.length; i < len; i++) {
                    if (items[i].getAttribute(constants.attr.dataType) === type) {
                        dom.removeClass(items[i].parentElement, constants.class.hidden);
                        results.push(items[i]);
                    } else {
                        dom.addClass(items[i].parentElement, constants.class.hidden);
                    }
                }
            } else {
                showGroups(groups);
                for (i = 0, len = items.length; i < len; i++) {
                    dom.removeClass(items[i].parentElement, constants.class.hidden);
                    results.push(items[i]);
                }
            }
            return results;
        }

        return {
            createComponent: function (element, msg, options, data, selected, callbacks) {
                createComponent(element, msg, options, data, selected, callbacks);
            },
            search: function (str, results, msg) {
                search(str, results, msg);
            },
            filterByType: function (type) {
                return filterByType(type);
            },
            getDataGroup: function () {
                var ul = document.getElementById(constants.id.contextsDropdown);
                return ul.getAttribute(constants.attr.dataGroup);
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
var SelectService = (function () {
    var instance;

    function init() {

        function getNumberOfGroups(arr) {
            var no = 0;
            if (arr && arr.length) {
                var results = arr.filter(function (item) {
                    return !item.id;
                });
                if (results) {
                    no = results.length;
                }
            }
            return no;
        }

        function handleGroups(arr) {
            var no = getNumberOfGroups(arr);
            if (no === 1) {
                var results = arr.filter(function (item) {
                    return item.id;
                });
                return results;
            }
            return arr;
        }

        return {
            handleGroups: function (arr) {
                return handleGroups(arr);
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();    
/* jshint -W117 */
var Select = function (element, msg, options, data, selected, callbacks) {
    var self = this,
        dom = DOMSelect.getInstance(),
        service = SelectService.getInstance(),
        filter = new FilterUtil();

    data = service.handleGroups(data);

    callbacks.search = function (search) {
        search = search.replace(/[-\\^$*+?.()|[\]{}]/g, '\\{file}');
        var regex = new RegExp(search, 'i'), results,
            dataGroup = dom.getDataGroup();
        if (filter.shouldFilterBy(dataGroup)) {
            results = data.filter(function (item) {
                return regex.test(item.name) && item.type === dataGroup;
            });
        } else {
            results = data.filter(function (item) {
                return regex.test(item.name);
            });
        }
        dom.search(search, results, msg);
    };

    dom.createComponent(element, msg, options, data, selected, callbacks);

    self.api = {
        filterByType: function (type) {
            var results = dom.filterByType(type);
            if(results && results.length === 1){
                results[0].click();
            }
        }
    };
};
/* jshint -W117 */
/* jshint -W071 */
/* jshint -W031 */

var NavItemUtil = function () {
    var self = this;

    function getPathArray(path) {
        if (path.indexOf(constants.hashBang) > -1) {
            path = path.replace(constants.hashBang, '');
        }
        if (path.indexOf('?') > -1) {
            path = path.split('?')[0];
        }

        var p = path.split(/\/|\./);
        return p.filter(function (val) {
            return val !== '';
        });
    }

    function getSeparator(path) {
        if (path.indexOf('.') > -1 && path.indexOf('/') === -1) {
            return '.';
        }
        return '/';
    }

    function isActive(activeWhen, pathname) {
        var is = true;
        if (!activeWhen || activeWhen === '/' || !pathname) {
            return false;
        }

        var results = getPathArray(activeWhen),
            arr = getPathArray(pathname);

        for (var i = 0, len = results.length; i < len; i++) {
            if (!arr[i] || results[i] !== arr[i]) {
                is = false;
                break;
            }
        }
        return is;
    }

    function getIndexesOfHiddenItems(items) {
        var array = [],
            index = 0;
        for (var i = 0, len = items.length; i < len; i++) {
            if (!items[i].shown) {
                array[index] = i;
                index++;
            }
        }
        return array;
    }

    function insertWidthsForHiddenItems(flitems, hidden) {
        for (var i = 0, len = hidden.length; i < len; i++) {
            flitems.splice(hidden[i], 0, 0);
        }
    }

    function getItemIndex(items, value, prop) {
        var index = -1;
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i][prop] === value) {
                index = i;
                break;
            }
        }
        return index;
    }

    function getMatchProperty(prop) {
        var p = 'id';
        if (prop) {
            p = prop;
        }
        return p;
    }

    function getNextItem(items, active, prop) {
        var p = getMatchProperty(prop);
        var index = getItemIndex(items, active[p], p), item = null;
        if (index > -1) {
            index += 1;
            var len = items.length;
            if (index === len) {
                index = 0;
            }
            item = items[index];
        }
        return item;

    }

    function getPreviousItem(items, active, prop) {
        var p = getMatchProperty(prop);
        var index = getItemIndex(items, active[p], p), item = null;
        if (index > -1) {
            var len = items.length;
            if (index === 0) {
                index = len - 1;
            } else {
                index -= 1;
            }
            item = items[index];
        }
        return item;
    }

    function getNextItemStartsWith(items, active, key, prop) {
        var p = getMatchProperty(prop);
        var index = getItemIndex(items, active[p], p), item = null;
        if (index > -1) {
            var len = items.length, i;
            key = key.toUpperCase();

            for (i = index + 1; i < len; i++) {
                if (items[i].textContent.startsWith(key)) {
                    item = items[i];
                    break;
                }
            }
            if (!item) {
                for (i = 0; i < len; i++) {
                    if (active[p] !== items[i][p] && items[i].textContent.startsWith(key)) {
                        item = items[i];
                        break;
                    }
                }
            }

        }
        return item;
    }

    function getPreviousRelatedItem(items, el, class1, class2, prop) {
        var prev = null;
        var p = getMatchProperty(prop);
        if (el.classList.contains(class1)) {
            var index = getItemIndex(items, el[p], p);
            for (var i = index - 1; i >= 0; i--) {
                if (items[i].classList.contains(class2)) {
                    prev = items[i];
                    break;
                }
            }
        }
        return prev;
    }

    function hasClass(el, clazz) {
        return el.classList.contains(clazz);
    }

    function isPrintableCharacter(str) {
        return str.length === 1;
    }

    function setFocusOnItem(event, c, siblings, active) {
        if (c === constants.keyCode.HOME) {
            if (siblings && siblings.length) {
                siblings[0].focus();
            }
        }
        if (c === constants.keyCode.END) {
            if (siblings && siblings.length) {
                siblings[siblings.length - 1].focus();
            }
        }
        if (isPrintableCharacter(event.key)) {
            if (siblings) {
                var el = getNextItemStartsWith(siblings, active, event.key, 'textContent');
                if (el) {
                    el.focus();
                }
            }
        }
    }

    function setFocusOnItemWhenUseArrows(c, siblings, active) {
        var el;
        if (c === constants.keyCode.RIGHT_ARROW || c === constants.keyCode.DOWN_ARROW) {
            //active.setAttribute('aria-selected', false);
            el = getNextItem(siblings, active, 'textContent');
            setTimeout(function () {
                //el.setAttribute('aria-selected', true);
                el.focus();
            }, 0);
        }
        if (c === constants.keyCode.LEFT_ARROW || c === constants.keyCode.UP_ARROW) {
            //active.setAttribute('aria-selected', false);
            el = getPreviousItem(siblings, active, 'textContent');
            setTimeout(function () {
                //el.setAttribute('aria-selected', true);
                el.focus();
            }, 0);
        }
    }

    self.getActiveWhen = function (path, activeWhen, level) {
        var root;
        if (activeWhen) {
            return activeWhen;
        }
        if (path) {
            var results = getPathArray(path),
                sep = getSeparator(path);
            if (results) {
                root = '';
                if (sep === '/') {
                    root = '/';
                }
                for (var i = 0; i < level; i++) {
                    root += results[i];
                    if (i < level - 1) {
                        root += sep;
                    }
                }
            }
        }
        return root;
    };

    self.isActive = function (activeWhen, pathname) {
        return isActive(activeWhen, pathname);
    };

    self.getIndexesOfHiddenItems = function (items) {
        return getIndexesOfHiddenItems(items);
    };

    self.insertWidthsForHiddenItems = function (flitems, hidden) {
        insertWidthsForHiddenItems(flitems, hidden);
    };

    self.getItemIndex = function (items, id) {
        return getItemIndex(items, id, 'id');
    };

    self.getNextItemStartsWith = function (items, active, key, prop) {
        return getNextItemStartsWith(items, active, key, prop);
    };

    self.getNextItem = function (items, active, prop) {
        return getNextItem(items, active, prop);
    };

    self.getPreviousItem = function (items, active, prop) {
        return getPreviousItem(items, active, prop);
    };

    self.getPreviousRelatedItem = function (items, el, class1, class2, prop) {
        return getPreviousRelatedItem(items, el, class1, class2, prop);
    };

    self.isFirstLevelMenuItem = function (el) {
        return hasClass(el, constants.class.flMenuItem);
    };

    self.isSecondLevelMenuItem = function (el) {
        return hasClass(el, constants.class.slMenuItem);
    };

    self.isThirdLevelMenuItem = function (el) {
        return hasClass(el, constants.class.tlMenuItem);
    };

    self.hasChildren = function (el) {
        return hasClass(el, constants.class.hasChildren);
    };

    self.isFirstLevelOpen = function (el) {
        return hasClass(el.parentElement, constants.class.isOpen);
    };

    self.isSecondLevelOpen = function (el) {
        return hasClass(el.parentElement, constants.class.open);
    };

    self.isDropdownOpen = function (el) {
        return hasClass(el.parentElement, constants.class.open);
    };

    self.hasParentActive = function (el) {
        return hasClass(el.parentElement, constants.class.active);
    };

    self.hasParentFocus = function (el) {
        return hasClass(el.parentElement, constants.class.focus);
    };

    self.addClassOnParent = function (el, clazz) {
        el.parentElement.classList.add(clazz);
    };

    self.removeClassFromParent = function (el, clazz) {
        el.parentElement.classList.remove(clazz);
    };

    self.hideSecondLevelMenu = function (active) {
        var ul = active.parentElement.children[1];
        ul.classList.add(constants.class.hidden);
    };

    self.showSecondLevelMenu = function (active) {
        var ul = active.parentElement.children[1];
        ul.classList.remove(constants.class.hidden);
    };

    self.isMobile = function () {
        var el = document.getElementById(constants.id.topMain);
        return hasClass(el, constants.class.isMobile);
    };

    self.getActiveNavItem = function () {
        var el = document.getElementById(constants.id.flmenu),
            arr = el.querySelectorAll(constants.selector.activeItemLink);
        return arr[arr.length - 1];
    };

    self.isPrintableCharacter = function (str) {
        return isPrintableCharacter(str);
    };

    self.setFocusOnItem = function (event, c, siblings, active) {
        setFocusOnItem(event, c, siblings, active);
    };

    self.setFocusOnItemWhenUseArrows = function (c, siblings, active) {
        setFocusOnItemWhenUseArrows(c, siblings, active);
    };

    self.onKeyUpDropdownHandler = function (rootId, selector) {
        var root = document.getElementById(rootId), siblings, c, active;
        if (root) {
            root = root.parentElement;
            root.addEventListener('keyup', function (event) {
                event.preventDefault();
                c = event.which || event.keyCode;
                active = document.activeElement;
                siblings = root.querySelectorAll(selector);

                setFocusOnItem(event, c, siblings, active);
                setFocusOnItemWhenUseArrows(c, siblings, active);
            }, false);
        }
    };

    self.initDropdownWithFocusOnActiveItem = function (id, selector) {
        var dropdown = document.getElementById(id);
        if (dropdown && dropdown.children.length > 0) {
            new Dropdown(dropdown, true);
            dropdown.addEventListener('click', function (event) {
                event.preventDefault();
            }, false);
            dropdown.parentElement.addEventListener('shown.bs.dropdown', function (event) {
                event.stopPropagation();
                var ul = dropdown.nextElementSibling,
                    el = ul.querySelector(selector);
                if (el) {
                    setTimeout(function () {
                        el.focus();
                    }, 10);
                }
            });
        }
    };

};
/* jshint -W117 */

var NavKeyUp = function (dom) {
    var self = this,
        navu = new NavItemUtil();

    function handleDroppedContent(el) {
        var content = document.getElementById(constants.id.menuDropContent),
            dropped = dom.getClosest(el, constants.selector.menuDropContent);

        if (dropped) {
            if (!navu.isDropdownOpen(content, constants.class.open)) {
                navu.addClassOnParent(content, constants.class.open);
            }
        } else {
            navu.removeClassFromParent(content, constants.class.open);
        }
    }

    function showSecondLevelMenu(el, isDropped) {
        if (navu.hasChildren(el)) {
            if (navu.hasParentActive(el)) {
                navu.showSecondLevelMenu(el);
            }
            if (isDropped) {
                navu.addClassOnParent(el, constants.class.isOpen);
            } else {
                navu.addClassOnParent(el, constants.class.focus);
            }
            el.setAttribute('aria-expanded', true);
        }
    }

    function hideSecondLevelMenu(el, isDropped) {
        if (navu.hasChildren(el)) {
            if (navu.hasParentActive(el)) {
                navu.hideSecondLevelMenu(el);
            }
            if (isDropped) {
                navu.removeClassFromParent(el, constants.class.isOpen);
            } else {
                navu.removeClassFromParent(el, constants.class.focus);
            }
            el.setAttribute('aria-expanded', false);
        }
    }

    function handleActiveItem(elements, active, isDropped) {
        var prev;
        if (navu.isFirstLevelMenuItem(active)) {
            hideSecondLevelMenu(active, isDropped);
        } else if (navu.isSecondLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.slMenuItem, constants.class.flMenuItem);
            hideSecondLevelMenu(prev, isDropped);
        } else if (navu.isThirdLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.tlMenuItem, constants.class.slMenuItem);
            if (prev && prev.Dropdown) {
                prev.Dropdown.toggle();
                prev = navu.getPreviousRelatedItem(elements, prev, constants.class.slMenuItem, constants.class.flMenuItem);
                hideSecondLevelMenu(prev, isDropped);
            }
        }
    }

    function handleFirstLevelMenu(elements, el, isDropped) {
        var prev = navu.getPreviousRelatedItem(elements, el, constants.class.slMenuItem, constants.class.flMenuItem);
        showSecondLevelMenu(prev, isDropped);
    }

    function setFocusToNextFirstLevelMenu(elements, el, active, isDropped) {
        var prev;
        if (navu.isFirstLevelMenuItem(active)) {
            hideSecondLevelMenu(active, isDropped);
        } else if (navu.isSecondLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.slMenuItem, constants.class.flMenuItem);
            hideSecondLevelMenu(prev, isDropped);
        } else if (navu.isThirdLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.tlMenuItem, constants.class.slMenuItem);
            if (prev && prev.Dropdown) {
                prev.Dropdown.toggle();
            }
            prev = navu.getPreviousRelatedItem(elements, prev, constants.class.slMenuItem, constants.class.flMenuItem);
            hideSecondLevelMenu(prev, isDropped);
        }
        showSecondLevelMenu(el, isDropped);
        setTimeout(function () {
            el.focus();
        }, 0);
    }

    function setFocusToNextSecondLevelMenu(elements, el, active, isDropped) {
        var prev;
        if (navu.isFirstLevelMenuItem(active)) {
            hideSecondLevelMenu(active, isDropped);
            prev = navu.getPreviousRelatedItem(elements, el, constants.class.slMenuItem, constants.class.flMenuItem);
            showSecondLevelMenu(prev, isDropped);
        } else if (navu.isThirdLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.tlMenuItem, constants.class.slMenuItem);
            if (prev && prev.Dropdown) {
                prev.Dropdown.toggle();
            }
        }
        setTimeout(function () {
            el.focus();
        }, 0);
    }

    function setFocusToNextThirdLevelMenu(elements, el, active, isDropped) {
        var prev;
        if (navu.isFirstLevelMenuItem(active)) {
            hideSecondLevelMenu(active, isDropped);
            prev = navu.getPreviousRelatedItem(elements, el, constants.class.tlMenuItem, constants.class.slMenuItem);
            if (prev && prev.Dropdown) {
                prev.Dropdown.toggle();
            }
            prev = navu.getPreviousRelatedItem(elements, prev, constants.class.slMenuItem, constants.class.flMenuItem);
            showSecondLevelMenu(prev, isDropped);

            setTimeout(function () {
                el.focus();
            }, 0);
        } else if (navu.isSecondLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, el, constants.class.tlMenuItem, constants.class.slMenuItem);
            if (prev && prev.Dropdown) {
                prev.Dropdown.toggle();
            }
            setTimeout(function () {
                el.focus();
            }, 0);
        } else if (navu.isThirdLevelMenuItem(active)) {
            el.focus();
        }
    }

    function setFocusToNextItem(elements, active, isDropped) {
        if (elements && elements.length) {
            var el = navu.getNextItem(elements, active);
            handleDroppedContent(el);

            if (navu.isFirstLevelMenuItem(el) || dom.hasClass(el, constants.class.droppedAppsToggle)) {
                setFocusToNextFirstLevelMenu(elements, el, active, isDropped);
            } else if (navu.isSecondLevelMenuItem(el)) {
                setFocusToNextSecondLevelMenu(elements, el, active, isDropped);
            } else if (navu.isThirdLevelMenuItem(el)) {
                setFocusToNextThirdLevelMenu(elements, el, active);
            }
        }
    }

    function setFocusToPreviousFirstLevelMenu(elements, el, active, isDropped) {
        var prev;
        if (navu.isFirstLevelMenuItem(active)) {
            hideSecondLevelMenu(active, isDropped);
        } else if (navu.isSecondLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.slMenuItem, constants.class.flMenuItem);
            if (isDropped) {
                navu.removeClassFromParent(prev, constants.class.isOpen);
            } else {
                navu.removeClassFromParent(prev, constants.class.focus);
            }
        } else if (navu.isThirdLevelMenuItem(active)) {
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.tlMenuItem, constants.class.slMenuItem);
            prev.Dropdown.toggle();
            prev = navu.getPreviousRelatedItem(elements, active, constants.class.slMenuItem, constants.class.flMenuItem);
            if (isDropped) {
                navu.removeClassFromParent(prev, constants.class.isOpen);
            } else {
                navu.removeClassFromParent(prev, constants.class.focus);
            }
        }
        el.focus();
    }

    function setFocusToPreviousSecondLevelMenu(elements, el, active, isDropped) {
        if (navu.isFirstLevelMenuItem(active)) {
            hideSecondLevelMenu(active, isDropped);
            var prev = navu.getPreviousRelatedItem(elements, el, constants.class.slMenuItem, constants.class.flMenuItem);
            var isCrtDropped = dom.getClosest(el, constants.selector.menuDropContent);

            if (isCrtDropped && !navu.isFirstLevelOpen(prev)) {
                prev.click();
            } else {
                if (!navu.hasParentFocus(prev)) {
                    showSecondLevelMenu(prev, isDropped);
                }
            }
            el.focus();
        } else if (navu.isSecondLevelMenuItem(active)) {
            if (el.Dropdown) {
                el.Dropdown.toggle();
                setTimeout(function () {
                    el.focus();
                }, 0);
            } else {
                el.focus();
            }
        } else if (navu.isThirdLevelMenuItem(active)) {
            el.Dropdown.toggle();
            el.focus();
        }
    }

    function setFocusToPreviousThirdLevelMenu(elements, el, active, isDropped) {
        if (navu.isThirdLevelMenuItem(active)) {
            el.focus();
        } else {
            var prev = navu.getPreviousRelatedItem(elements, el, constants.class.tlMenuItem, constants.class.slMenuItem);
            if (prev && prev.Dropdown) {
                prev.Dropdown.toggle();
                prev = navu.getPreviousRelatedItem(elements, prev, constants.class.slMenuItem, constants.class.flMenuItem);
                var isCrtDropped = dom.getClosest(el, constants.selector.menuDropContent);
                if (isCrtDropped && !navu.isFirstLevelOpen(prev)) {
                    prev.click();
                } else {
                    if (!navu.hasParentFocus(prev)) {
                        showSecondLevelMenu(prev, isDropped);
                    }
                }
                setTimeout(function () {
                    el.focus();
                }, 0);
            }
        }
    }

    function setFocusToPreviousItem(elements, active, isDropped) {
        if (elements && elements.length) {
            var el = navu.getPreviousItem(elements, active);
            handleDroppedContent(el);

            if (navu.isFirstLevelMenuItem(el) || dom.hasClass(el, constants.class.droppedAppsToggle)) {
                setFocusToPreviousFirstLevelMenu(elements, el, active, isDropped);
            } else if (navu.isSecondLevelMenuItem(el)) {
                setFocusToPreviousSecondLevelMenu(elements, el, active, isDropped);
            } else if (navu.isThirdLevelMenuItem(el)) {
                setFocusToPreviousThirdLevelMenu(elements, el, active, isDropped);
            }
        }
    }

    function setFocusToFirstItem(elements, active, isDropped) {
        if (elements && elements.length) {
            var el = elements[0];
            handleActiveItem(elements, active, isDropped);
            handleDroppedContent(el);
            el.focus();
        }
    }

    function setFocusToLastItem(elements, active, isDropped) {
        if (elements && elements.length) {
            var el = elements[elements.length - 1];
            handleActiveItem(elements, active, isDropped);
            handleDroppedContent(el);
            var isCrtDropped = dom.getClosest(el, constants.selector.menuDropContent);
            if (navu.isFirstLevelMenuItem(el) || dom.hasClass(el, constants.class.droppedAppsToggle)) {
                el.focus();
            } else if (navu.isSecondLevelMenuItem(el)) {
                handleFirstLevelMenu(elements, el, isCrtDropped);
                el.focus();
            } else if (navu.isThirdLevelMenuItem(el)) {
                var prev = navu.getPreviousRelatedItem(elements, el, constants.class.tlMenuItem, constants.class.slMenuItem);
                if (prev && prev.Dropdown) {
                    prev.Dropdown.toggle();
                }
                handleFirstLevelMenu(elements, prev, isCrtDropped);
                setTimeout(function () {
                    el.focus();
                }, 0);
            }
        }
    }

    function setFocusToNextItemStartsWith(elements, active, key) {
        if (elements) {
            var el = navu.getNextItemStartsWith(elements, active, key);
            if (el) {
                var isDropped = dom.getClosest(active, constants.selector.menuDropContent), prev;
                handleActiveItem(elements, active, isDropped);
                handleDroppedContent(el);

                isDropped = dom.getClosest(el, constants.selector.menuDropContent);
                if (navu.isFirstLevelMenuItem(el) || dom.hasClass(el, constants.class.droppedAppsToggle)) {
                    el.focus();
                } else if (navu.isSecondLevelMenuItem(el)) {
                    handleFirstLevelMenu(elements, el, isDropped);
                    el.focus();
                } else if (navu.isThirdLevelMenuItem(el)) {
                    prev = navu.getPreviousRelatedItem(elements, el, constants.class.tlMenuItem, constants.class.slMenuItem);
                    if (prev && prev.Dropdown) {
                        prev.Dropdown.toggle();
                    }
                    handleFirstLevelMenu(elements, prev, isDropped);
                    setTimeout(function () {
                        el.focus();
                    }, 0);
                }
            }
        }
    }

    function setFocus(c, key, siblings, active, isDropped) {
        if (c === constants.keyCode.HOME) {
            setFocusToFirstItem(siblings, active, isDropped);
        }
        if (c === constants.keyCode.END) {
            setFocusToLastItem(siblings, active, isDropped);
        }
        if (navu.isPrintableCharacter(event.key)) {
            setFocusToNextItemStartsWith(siblings, active, key);
        }
    }

    function setFocusWhenUseArrows(c, siblings, active, isDropped) {
        if (c === constants.keyCode.RIGHT_ARROW || c === constants.keyCode.DOWN_ARROW) {
            setFocusToNextItem(siblings, active, isDropped);
        }
        if (c === constants.keyCode.LEFT_ARROW || c === constants.keyCode.UP_ARROW) {
            setFocusToPreviousItem(siblings, active, isDropped);
        }
    }

    function onReturnDroppedAppsHandler(c) {
        if (c === constants.keyCode.RETURN) {
            var brand = document.getElementById(constants.id.navbarBrand),
                items = document.getElementsByClassName(constants.class.flMenuItem),
                i, len;
            if (!dom.hasClass(brand, constants.class.isOpen)) {
                dom.addClass(brand, constants.class.isOpen);
                if (items && items.length) {
                    for (i = 0, len = items.length; i < len; i++) {
                        dom.addClass(items[i].parentElement, constants.class.hidden);
                    }
                    var activeApp = document.getElementById(constants.id.droppedActiveApp);
                    setTimeout(function () {
                        activeApp.focus();
                    }, 0);
                }
            }
        }
    }

    function onKeyUpHandler() {
        var root = document.getElementById(constants.id.flmenu), siblings, c, active;
        if (root) {
            root.addEventListener('keyup', function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                c = event.which || event.keyCode;
                active = document.activeElement;
                var isDropped = dom.getClosest(active, constants.selector.menuDropContent);
                if (dom.hasClass(active, constants.class.droppedAppsToggle)) {
                    onReturnDroppedAppsHandler(c);
                }
                if (dom.hasClass(active, constants.class.navItem) || dom.hasClass(active, constants.class.droppedAppsToggle)) {
                    if (navu.isMobile()) {
                        siblings = root.querySelectorAll(constants.selector.navItemAndDroppedAppsToggle);
                    } else {
                        siblings = root.querySelectorAll(constants.selector.navItem);
                    }
                    setFocus(c, event.key, siblings, active, isDropped);
                    setFocusWhenUseArrows(c, siblings, active, isDropped);
                } else {
                    siblings = root.querySelectorAll(constants.selector.appItem);
                    navu.setFocusOnItem(event, c, siblings, active);
                    navu.setFocusOnItemWhenUseArrows(c, siblings, active);
                }
            }, false);
        }
    }

    function hasKey(array, keyCode) {
        var has = false;
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === keyCode) {
                has = true;
                break;
            }
        }
        return has;
    }

    function shouldRunOnClickCallback(event, array, c) {
        if (!hasKey(array, c)) {
            return false;
        }
        if (event.shiftKey && !hasKey(array, constants.keyCode.SHIFT)) {
            return false;
        }
        if (!event.shiftKey && hasKey(array, constants.keyCode.SHIFT)) {
            return false;
        }
        if (event.ctrlKey && !hasKey(array, constants.keyCode.CTRL)) {
            return false;
        }
        if (!event.ctrlKey && hasKey(array, constants.keyCode.CTRL)) {
            return false;
        }
        if (event.altKey && !hasKey(array, constants.keyCode.ALT)) {
            return false;
        }
        if (!event.altKey && hasKey(array, constants.keyCode.ALT)) {
            return false;
        }
        return true;
    }

    self.onIconShortcutKeyUpHandler = function (icon) {
        var el = document.getElementById(icon.id);
        if (el && icon.shortcutKeys && icon.shortcutKeys.length) {
            document.addEventListener('keyup', function (event) {
                var c = event.which || event.keyCode;
                var should = shouldRunOnClickCallback(event, icon.shortcutKeys, c);
                if (should) {
                    el.focus();
                    icon.onClickCallback(event);
                    if (el.Dropdown) {
                        el.Dropdown.toggle();
                    }
                    event.stopPropagation();
                }
            });
        }
    };

    self.onKeyUpHandler = function () {
        onKeyUpHandler();
        navu.onKeyUpDropdownHandler(constants.id.apps, constants.selector.appItem);
    };

    self.onShortcutKeyUpHandler = function (key, el) {
        document.addEventListener('keyup', function (event) {
            var c = event.which || event.keyCode;
            if (event.altKey && (c === key)) {
                if (el && el.Dropdown) {
                    el.Dropdown.toggle();
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });
    };
};

/* jshint -W117 */

var DOMApps = function (dom, options, msg) {
    var self = this, navu = new NavItemUtil(), nkeyup = new NavKeyUp();

    function createDropdownToggle(data) {
        var a, span;
        if (data.selected) {
            a = dom.createElement('a', [constants.class.dropdownToggle], [
                { id: constants.id.apps }, { href: '#' }, { title: '(Alt+P)' }, { 'data-toggle': 'dropdown' },
                { role: 'button' }, { 'aria-expanded': false },
                { 'aria-label': msg.serviceSelector + ', ' + msg.shortcut + ': (Alt+P), ' + options.selectedAppPrefix + ' ' + data.selected.name }],
                options.selectedAppPrefix + ' ' + data.selected.name);

            span = dom.createElement('span', [constants.class.caret]);
            a.appendChild(span);
        }
        return a;
    }

    function getTarget(item) {
        var target = '_self';
        if (item.target) {
            target = item.target;
        }
        return target;
    }

    function createOpenNewTabTooltip(a, item) {
        var target = getTarget(item);
        if (target === '_self') {
            a.textContent = item.name;
            a.setAttribute('aria-label', item.name);
        } else {
            var span = dom.createElement('span', ['vismaicon', 'vismaicon-sm', 'vismaicon-export', 'pull-right']),
                tn = document.createTextNode(item.name);
            a.appendChild(tn);
            a.appendChild(span);
            a.setAttribute('title', item.name + ' ' + msg.openInNewBrowserTab);
            a.setAttribute('aria-label', item.name + ': ' + item.name + ' ' + msg.openInNewBrowserTab);
            a.setAttribute('rel', 'noopener');
        }
    }

    function createDropdownMenu(data) {
        var ul = dom.createElement('ul', [constants.class.dropdownMenu], [{
            role: 'listbox'
        }]);
        var frgm = document.createDocumentFragment(),
            li, span, a, img, item;

        for (var i = 0, len = data.apps.length; i < len; i++) {
            item = data.apps[i];
            li = dom.createElement('li');
            span = dom.createElement('span');
            a = dom.createElement('a', [constants.class.appItem], [{ role: 'option' }, { tabindex: -1 },
            { href: item.href }, { target: getTarget(item) }]);
            if (item.logoUrl){
                img = dom.createElement('img',['img-inline'], [{alt: item.name}, {src: item.logoUrl}]);
            } else{
                img = dom.createElement('img',['img-inline'], [{alt: item.name}, {src: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/inSchool-48.png'}]);
            }
            if (item.selected) {
                dom.addClass(a, constants.class.active);
                a.setAttribute('aria-selected', true);
            }
            // createOpenNewTabTooltip(a, item);
            span.prepend(item.name);
            a.prepend(img);
            a.append(span);
            li.appendChild(a);
            frgm.appendChild(li);
        }
        ul.appendChild(frgm);
        return ul;
    }

    function createElement(data) {
        var root = dom.createElement('div', ['navbar-brand']);
        if (data.apps) {
            if (data.apps.length > 1) {
                dom.addClass(root, constants.class.dropdown);
                root.appendChild(createDropdownToggle(data));
                root.appendChild(createDropdownMenu(data));
            } else if (data.apps.length === 1) {
                var span = dom.createElement('span', ['one-app'], null, options.selectedAppPrefix + ' ' + data.selected.name);
                root.appendChild(span);
            }
        }
        return root;
    }

    function onChangeAppHandler(data, event, el, callbacks) {
        event.preventDefault();
        var t = event.target;
        if (t.tagName === 'SPAN') {
            t = t.parentElement;
        }
        var text = t.innerText,
            selected = dom.getDataItem(data.apps, 'name', text),
            crtText = el.textContent.replace(options.selectedAppPrefix, '').trim(),
            target = selected.target;

        if (crtText !== text) {
            if (callbacks.onClickApp) {
                callbacks.onClickApp(event, selected);
            }
            if (options.navigateOnClickApp) {
                if (!target) {
                    target = '_self';
                }
                window.open(selected.href, target);
            }
        }
    }

    function showElement() {
        var root = document.getElementById(constants.id.topMain),
            el = root.querySelector(constants.selector.navbarBrand);
        if (dom.hasClass(el, constants.class.hidden)) {
            dom.removeClass(el, constants.class.hidden);
        }
    }

    self.createElement = function (data) {
        return createElement(data);
    };

    self.initDropdown = function () {
        navu.initDropdownWithFocusOnActiveItem(constants.id.apps, constants.selector.activeApp);
    };

    self.onClickAppHandler = function (data, callbacks) {
        var root = document.getElementById(constants.id.topMain),
            items = root.querySelectorAll(constants.selector.appItem),
            el = document.getElementById(constants.id.apps);
        if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
                items[i].addEventListener('click', function (event) {
                    onChangeAppHandler(data, event, el, callbacks);
                    if (el && el.Dropdown) {
                        el.Dropdown.toggle();
                    }
                }, false);
            }
        }
    };

    self.showElement = function () {
        showElement();
    };

    self.onShortcutKeyUpHandler = function () {
        var el = document.getElementById(constants.id.apps);
        nkeyup.onShortcutKeyUpHandler(constants.keyCode.P, el);
    };
};
/* jshint -W117 */
/* jshint -W071 */
/* jshint -W031 */

var DOMMenu = function (dom, options, msg) {
    var self = this,
        navu = new NavItemUtil(),
        nkeyup = new NavKeyUp(dom);

    function setPaths(el, item) {
        if (el) {
            if (item[options.pathFieldName]) {
                el.setAttribute(constants.attr.dataPath, item[options.pathFieldName]);
                el.setAttribute(constants.attr.dataActiveWhen, item.activeWhen);
            } else if (item.href) {
                el.setAttribute('href', item.href);
                el.setAttribute('target', '_blank');
                el.setAttribute('title', item.text + ' ' + msg.openInNewBrowserTab);
                el.setAttribute('aria-label', item.text + ': ' + item.text + ' ' + msg.openInNewBrowserTab);
                el.setAttribute('rel', 'noopener');
                dom.addClass(el, constants.class.externalLink);
            }
        }
    }

    function addNewWindowClass(el, item) {
        if (item.href) {
            dom.addClass(el, constants.class.newWindow);
        }
    }

    function isExternalLink(el) {
        return dom.hasClass(el, constants.class.externalLink);
    }

    function createThirdLevelMenu(parent, thirdLevelMenu) {
        var ul = dom.createElement('ul', ['third-level', constants.class.dropdownMenu], [{
            id: constants.prefix.tlm + parent.id
        }, {
            role: 'menu'
        }, { 'aria-label': parent.text }]),
            frgm = document.createDocumentFragment(),
            li, a, item;
        for (var i = 0, len = thirdLevelMenu.length; i < len; i++) {
            item = thirdLevelMenu[i];
            if (parent.id === item.parentId && item.shown) {
                li = dom.createElement('li', null, [{ role: 'none' }]);
                a = dom.createElement('a', [constants.class.navItem, constants.class.tlMenuItem], [{
                    id: item.id
                },
                {
                    role: 'menuitem'
                },
                { tabindex: -1 },
                {
                    href: '#'
                }], item.text);
                setPaths(a, item);
                addNewWindowClass(li, item);
                li.appendChild(a);
                frgm.appendChild(li);
            }
        }
        ul.appendChild(frgm);
        return ul;
    }

    function createSecondLevelMenu(parent, data) {
        var ul = dom.createElement('ul', ['second-level'], [{
            id: constants.prefix.slm + parent.id
        }, { 'aria-label': parent.text }, {
            role: 'menu'
        }]),
            frgm = document.createDocumentFragment(),
            li, a, item;
        for (var i = 0, len = data.secondLevelMenu.length; i < len; i++) {
            item = data.secondLevelMenu[i];
            if (parent.id === item.parentId && item.shown) {
                li = dom.createElement('li', null, [{ role: 'none' }]);
                a = dom.createElement('a', [constants.class.navItem, constants.class.slMenuItem], [{
                    id: item.id
                }, { tabindex: -1 },
                { role: 'menuitem' }, { href: '#' }], item.text);

                setPaths(a, item);
                addNewWindowClass(li, item);

                if (item.hasChildren) {
                    dom.setAsDropdownToggle(a, li);
                    a.setAttribute('aria-haspopup', true);
                    a.setAttribute('aria-expanded', false);
                } else {
                    dom.addClass(a, constants.class.noChildren);
                }
                li.appendChild(a);
                if (item.hasChildren) {
                    li.appendChild(createThirdLevelMenu(item, data.thirdLevelMenu));
                }
                frgm.appendChild(li);
            }
        }
        ul.appendChild(frgm);
        return ul;
    }

    function createFirstLevelMenu(root, data) {
        var li, a, item, frgm = document.createDocumentFragment();
        for (var i = 0, len = data.firstLevelMenu.length; i < len; i++) {
            item = data.firstLevelMenu[i];
            if (item.shown) {
                li = dom.createElement('li');
                a = dom.createElement('a', [constants.class.navItem, constants.class.flMenuItem], [{
                    id: item.id
                },
                { role: 'menuitem' }, { href: '#' }], item.text);
                if (i === 0) {
                    a.setAttribute('tabindex', 0);
                } else {
                    a.setAttribute('tabindex', -1);
                }

                setPaths(a, item);
                addNewWindowClass(li, item);

                if (item.hasChildren) {
                    dom.addClass(a, constants.class.hasChildren);
                    a.setAttribute('aria-label', item.text);
                    a.setAttribute('aria-haspopup', true);
                    a.setAttribute('aria-expanded', false);
                } else {
                    dom.addClass(a, constants.class.noChildren);
                }
                li.appendChild(a);
                if (item.hasChildren) {
                    dom.addClass(li, constants.class.secondLevelChildren);
                    li.appendChild(createSecondLevelMenu(item, data));
                    dom.addClass(li, constants.class.secondLevelChildren);
                }
                frgm.appendChild(li);
            }
        }
        root.appendChild(frgm);
    }

    function createAppsDropodownToggle(data) {
        var a = null;
        if (data.apps.length > 1) {
            a = dom.createElement('a', [constants.class.dropdownToggle, constants.class.droppedAppsToggle], [{
                id: constants.id.droppedAppsToggle
            }, {
                'data-toggle': 'dropdown'
            },
            { tabindex: -1 },
            {
                role: 'button'
            }, {
                'aria-expanded': 'false'
            }], data.selected.name);
            var span = dom.createElement('span', [constants.class.caret]);
            a.appendChild(span);
        } else {
            a = dom.createElement('a', [constants.class.dropdownToggle, 'single-app'], null, data.selected.name);
        }
        return a;
    }

    function createAppsFragment(data, hasCaret) {
        var frgm = document.createDocumentFragment(),
            li, a, item;
        for (var i = 0, len = data.apps.length; i < len; i++) {
            item = data.apps[i];
            li = dom.createElement('li');
            a = dom.createElement('a', [constants.class.appItem], [{ role: 'option' }, { tabindex: -1 }, { href: '#' }], item.name);
            if (item.selected) {
                dom.addClass(li, constants.class.active);
                a.setAttribute('id', constants.id.droppedActiveApp);
                if (hasCaret) {
                    a.setAttribute('aria-selected', true);
                    a.setAttribute('role', 'button');
                    a.setAttribute('aria-expanded', false);
                    var span = dom.createElement('span', [constants.class.caret]);
                    a.appendChild(span);
                }
            }
            li.appendChild(a);
            frgm.appendChild(li);
        }
        return frgm;
    }

    function createAppsDropdownMenu(data) {
        var ul = dom.createElement('ul', [constants.class.dropdownMenu], [{
            role: 'listbox'
        }]);
        var hasCaret = true;
        var frgm = createAppsFragment(data, hasCaret);
        ul.appendChild(frgm);
        return ul;
    }


    function createNavbarBrandDropdown(data) {
        var li = dom.createElement('li', ['dropdown', 'navbar-brand'], [{
            id: constants.id.navbarBrand
        }]);
        if (data.apps && data.apps.length) {
            li.appendChild(createAppsDropodownToggle(data));
            li.appendChild(createAppsDropdownMenu(data));
        }
        return li;
    }

    function createDroppedItemsToggle() {
        var a = dom.createElement('a', [constants.class.dropdownToggle],
            [{ id: constants.id.menuDropTrigger }, { 'data-toggle': 'dropdown' }, { 'aria-expanded': false },
            { href: '#' }, { tabindex: -1 }]),
            span = dom.createElement('span', null, null, msg.menu),
            i = dom.createElement('i', ['icon-align-justify']);
        a.appendChild(span);
        a.appendChild(i);
        return a;
    }

    function createDroppedItemsMenu(data) {
        var ul = dom.createElement('ul', ['dropdown-menu', 'dropdown-menu-right'], [{
            id: constants.id.menuDropContent
        }]);
        if (!data.isEmbedded) {
            if (data.firstLevelMenu.length > 0) {
                ul.appendChild(createNavbarBrandDropdown(data));
            } else {
                if (data.apps && data.apps.length) {
                    ul.setAttribute('role', 'listbox');
                    ul.appendChild(createAppsFragment(data));
                }
            }
        }
        return ul;
    }

    function createDroppedItemsArea(root, data) {
        var li = dom.createElement('li', ['menudrop', 'dropdown']);
        li.appendChild(createDroppedItemsToggle());
        li.appendChild(createDroppedItemsMenu(data));
        dom.addClass(li, constants.class.hidden);
        root.appendChild(li);
    }

    function createElement(data) {
        var root = dom.createElement('ul', ['nav', 'navbar-nav', 'nav-tabs', 'first-level'],
            [{ id: constants.id.flmenu }, { role: 'menubar' }, { 'aria-label': msg.menu }]);
        createFirstLevelMenu(root, data);
        createDroppedItemsArea(root, data);
        return root;
    }

    function closeDroppedItemsDropdown() {
        var item = document.getElementById(constants.id.menuDropTrigger);
        if (navu.isDropdownOpen(item)) {
            item.Dropdown.toggle();
        }
    }

    function initDroppedItemsDropdown() {
        var trigger = document.getElementById(constants.id.menuDropTrigger);
        new Dropdown(trigger, false);
        trigger.parentElement.addEventListener('shown.bs.dropdown', function (event) {
            var dropped = document.getElementById(constants.id.menuDropContent),
                items = dropped.querySelectorAll(constants.selector.firstLevelMenuItem), active;
            if (navu.isMobile()) {
                active = navu.getActiveNavItem();
                if (dom.hasClass(active, constants.class.navItem)) {
                    resetDropdowns(items, constants.class.isOpen);
                    items = dropped.querySelectorAll(constants.selector.secondLevelMenuItem);
                    resetDropdowns(items, constants.class.open);
                }
            } else {
                active = items[0];
            }
            setTimeout(function () {
                if (active) {
                    active.focus();
                }
            }, 10);
        });
    }

    function resetActiveItems(items) {
        for (var i = 0, len = items.length; i < len; i++) {
            dom.removeClass(items[i].parentElement, constants.class.active);
            dom.removeClass(items[i].parentElement, constants.class.focus);
            items[i].removeAttribute('aria-selected');
        }
    }

    function resetHiddenItems() {
        var header = document.getElementById(constants.id.topMain),
            items = header.querySelectorAll(constants.selector.secondLevelMenuItem);
        for (var i = 0, len = items.length; i < len; i++) {
            dom.removeClass(items[i].parentElement.parentElement, constants.class.hidden);
        }
    }

    function resetDropdowns(items, clazz) {
        if (items && items.length > 0) {
            for (var i = 0, len = items.length; i < len; i++) {
                if (dom.hasClass(items[i].parentElement, constants.class.active)) {
                    dom.addClass(items[i].parentElement, clazz);
                } else {
                    dom.removeClass(items[i].parentElement, clazz);
                }
            }
        }
    }

    function closeActiveItems(items, id) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].id !== id) {
                dom.removeClass(items[i].parentElement, constants.class.isOpen);
            }
        }
    }

    function showActiveUl() {
        var header = document.getElementById(constants.id.topMain),
            ul = header.querySelector(constants.selector.activeItemList);
        if (ul) {
            dom.removeClass(ul, constants.class.hidden);
        }
    }

    function getMenuItems(level) {
        var items;
        if (level === 1) {
            items = document.getElementsByClassName(constants.class.flMenuItem);
        } else if (level === 2) {
            items = document.getElementsByClassName(constants.class.slMenuItem);
        } else if (level === 3) {
            items = document.getElementsByClassName(constants.class.tlMenuItem);
        }
        return items;
    }

    function getActiveMenuItems(pathname, level) {
        var activeWhen, item,
            items = getMenuItems(level);
        var index = -1;
        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            activeWhen = item.getAttribute(constants.attr.dataActiveWhen);
            if (navu.isActive(activeWhen, pathname)) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            return items[index];
        }
        return null;
    }

    function setActiveItemAttributes(item) {
        if (item) {
            item.setAttribute('aria-selected', true);
            dom.addClass(item.parentElement, constants.class.active);
        }
    }

    function setActiveItems(pathname) {
        var item1, item2, item3;
        showActiveUl();
        item1 = getActiveMenuItems(pathname, 1);
        setActiveItemAttributes(item1);
        if (item1 && navu.hasChildren(item1)) {
            item1.setAttribute('aria-expanded', true);
            item2 = getActiveMenuItems(pathname, 2);
            setActiveItemAttributes(item2);
            if (item2 && item2.classList.contains(constants.class.dropdownToggle)) {
                item3 = getActiveMenuItems(pathname, 3);
                setActiveItemAttributes(item3);
            }
        }
    }

    function getMenu(el, data) {
        if (dom.hasClass(el, constants.class.flMenuItem)) {
            return data.firstLevelMenu;
        } else if (dom.hasClass(el, constants.class.slMenuItem)) {
            return data.secondLevelMenu;
        } else if (dom.hasClass(el, constants.class.tlMenuItem)) {
            return data.thirdLevelMenu;
        }
    }

    function getTarget(event) {
        var target = event.target;
        if (event.target.className === constants.class.caret) {
            return target.parentElement;
        }
        return target;
    }

    function setAriaExpandedAsTrue(target, items) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (dom.hasClass(items[i], constants.class.flMenuItem) &&
                items[i].getAttribute('aria-expanded')) {
                items[i].setAttribute('aria-expanded', false);
            }
        }
        if (dom.hasClass(target, constants.class.flMenuItem) && navu.hasChildren(target)) {
            target.setAttribute('aria-expanded', true);
        }
    }

    function onClickMenuItemHandler(items, data, callbacks) {
        if (items && items.length) {
            var item;
            for (var i = 0, len = items.length; i < len; i++) {
                item = items[i];
                if (item && !isExternalLink(item)) {
                    item.addEventListener('click', function (event) {
                        event.preventDefault();
                        var target = getTarget(event),
                            menu = getMenu(target, data),
                            selected = dom.getDataItem(menu, 'id', target.id);

                        if (navu.isFirstLevelMenuItem(target)) {
                            var isDropped = dom.getClosest(target, constants.selector.menuDrop);
                            if (isDropped) {
                                if (navu.hasChildren(target)) {
                                    event.stopPropagation();
                                    if (navu.isFirstLevelOpen(target)) {
                                        navu.removeClassFromParent(target, constants.class.isOpen);
                                        target.setAttribute('aria-expanded', false);
                                    } else {
                                        navu.addClassOnParent(target, constants.class.isOpen);
                                        target.setAttribute('aria-expanded', true);
                                    }
                                    closeActiveItems(items, target.id);
                                } else {
                                    callbacks.onClickMenuItem(event, selected);
                                    closeDroppedItemsDropdown();
                                }
                            } else {
                                setAriaExpandedAsTrue(target, items);
                                callbacks.onClickMenuItem(event, selected);
                            }
                        } else if (!dom.hasClass(target, constants.class.dropdownToggle)) {
                            callbacks.onClickMenuItem(event, selected);
                        }
                    }, false);
                }
            }
        }
    }


    function removeClickMenuItemEventListeners(items) {
        if (items && items.length) {
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].removeEventListener('click', function (event) { }, false);
            }
        }
    }

    function removeElement(parent) {
        var el = document.getElementById(constants.id.flmenu);
        if (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            parent.removeChild(el);
        }
    }

    function initDropdowns() {
        var root = document.getElementById(constants.id.flmenu),
            items = root.querySelectorAll(constants.selector.secondLevelMenuDropdownToogle);
        for (var i = 0, len = items.length; i < len; i++) {
            new Dropdown(items[i], false);
            items[i].addEventListener('click', function (event) {
                event.preventDefault();
            }, false);
        }
    }

    function setActiveItemsById(itemflId, itemslId, itemtlId) {
        var id, items = document.getElementsByClassName(constants.class.navItem);
        if (items && items.length) {
            resetActiveItems(items);
            resetHiddenItems();
            for (var i = 0, len = items.length; i < len; i++) {
                id = items[i].id;
                if (id === itemflId || itemslId && id === itemslId || itemtlId && id === itemtlId) {
                    dom.addClass(items[i].parentElement, constants.class.active);
                    items[i].setAttribute('aria-selected', true);
                }
            }
        }
    }

    function onClickDroppedAppsHandler(el) {
        if (el) {
            el.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                var brand = document.getElementById(constants.id.navbarBrand),
                    items = document.getElementsByClassName(constants.class.flMenuItem),
                    i, len;
                if (dom.hasClass(brand, constants.class.isOpen)) {
                    dom.removeClass(brand, constants.class.isOpen);
                    if (items && items.length) {
                        for (i = 0, len = items.length; i < len; i++) {
                            dom.removeClass(items[i].parentElement, constants.class.hidden);
                        }
                        var active = navu.getActiveNavItem();
                        setTimeout(function () {
                            active.focus();
                        });
                    }
                } else {
                    dom.addClass(brand, constants.class.isOpen);
                    if (items && items.length) {
                        for (i = 0, len = items.length; i < len; i++) {
                            dom.addClass(items[i].parentElement, constants.class.hidden);
                        }
                        var activeApp = document.getElementById(constants.id.droppedActiveApp);
                        setTimeout(function () {
                            activeApp.focus();
                        });
                    }
                }
            });
        }
    }

    self.createElement = function (data) {
        return createElement(data);
    };

    self.removeElement = function (parent) {
        var items = document.getElementsByClassName(constants.class.navItem);
        removeClickMenuItemEventListeners(items);
        removeElement(parent);
    };

    self.setActiveItems = function (pathname, reset) {
        var items = document.getElementsByClassName(constants.class.navItem);
        if (reset) {
            resetActiveItems(items);
            resetHiddenItems();
        }
        setActiveItems(pathname);
    };

    self.onClickMenuItemHandler = function (data, callbacks) {
        var items = document.getElementsByClassName(constants.class.navItem);
        onClickMenuItemHandler(items, data, callbacks);
    };

    self.onClickdroppedAppsToggleHandler = function () {
        var el = document.getElementById(constants.id.droppedAppsToggle);
        onClickDroppedAppsHandler(el);
    };

    self.onClickActiveDroppedAppHandler = function () {
        var el = document.getElementById(constants.id.droppedActiveApp);
        onClickDroppedAppsHandler(el);
    };

    self.initDropdowns = function () {
        initDropdowns();
    };

    self.initDroppedItemsDropdown = function () {
        initDroppedItemsDropdown();
    };

    self.setActiveItemsById = function (itemflId, itemslId, itemtlId) {
        setActiveItemsById(itemflId, itemslId, itemtlId);
    };

    self.onKeyUpHandler = function () {
        nkeyup.onKeyUpHandler();
    };

};
/* jshint -W117 */
/* jshint -W031 */

var DOMIcon = function (dom, msg) {
    var self = this,
        nkeyup = new NavKeyUp(dom);

    function getBadgeValue(badgeValue) {
        if (badgeValue <= 99) {
            return badgeValue;
        } else {
            return '+99';
        }
    }

    function getAriaLabel(title, badgeValue) {
        var label = null;
        if (title.indexOf('(') > -1) {
            var arr = title.split('(');
            label = arr[0].trim() + ', ' + msg.shortcut + ': (' + arr[1];
        }
        if (badgeValue && badgeValue > 0) {
            label += ', ' + msg.badgeValue + ': ' + getBadgeValue(badgeValue);
        }
        return label;
    }

    function setAriaLabelAttribute(el, badgeValue) {
        var label = getAriaLabel(el.getAttribute('title'), badgeValue);
        if (label) {
            el.setAttribute('aria-label', label);
        }
    }

    function createBadgeElement(badgeValue) {
        return dom.createElement('span', ['badge'], null, getBadgeValue(badgeValue));
    }

    function createNotifyDropdownMenu() {
        var div = dom.createElement('div', [constants.class.dropdownMenu], [{ id: constants.id.notify }, { role: 'menu' }]);
        return div;
    }

    function createIconDropdownMenu(items) {
        var ul = dom.createElement('ul', [constants.class.dropdownMenu], [{ role: 'menu' }]), li, a, item;
        if (items && items.length) {
            for (var i = 0, len = items.length; i < len; i++) {
                item = items[i];
                li = dom.createElement('li');
                a = dom.createElement('a', ['dropdown-item'], [{ id: item.id }, { role: 'option' }, { href: '#' }, { tabindex: -1 }], item.text);
                li.appendChild(a);
                ul.appendChild(li);
            }
        }
        return ul;
    }

    function createElement(icon) {
        var li = dom.createElement('li', ['icon']),
            a = dom.createElement('a', ['button-icon'], [{ href: '#' }, { id: icon.id },
            { title: icon.title },
            { role: 'button' }
            ]),
            span = dom.createElement('span', ['vismaicon', 'vismaicon-menu', icon.css], [{ 'aria-hidden': true }]),
            label = getAriaLabel(icon.title, icon.badgeValue);
        if (label) {
            a.setAttribute('aria-label', label);
        }
        if (icon.badgeValue && icon.badgeValue > 0) {
            a.appendChild(createBadgeElement(icon.badgeValue));
        }
        a.appendChild(span);
        li.appendChild(a);
        if (icon.isDropdown) {
            li.classList.add(constants.class.dropdown);
            a.classList.add(constants.class.dropdownToggle);
            a.setAttribute('data-toggle', 'dropdown');
            a.setAttribute('aria-expanded', false);
            if (icon.id === constants.id.notifyIcon) {
                li.classList.add(constants.class.notifyDropdown);
                li.appendChild(createNotifyDropdownMenu());
            } else {
                li.classList.add(constants.class.customDropdown);
                li.appendChild(createIconDropdownMenu(icon.dropdownItems));
            }
        }
        return li;
    }

    function setIconBadgeValue(el, badgeValue) {
        if (el) {
            badgeValue = getBadgeValue(badgeValue);
            var arr = el.getElementsByClassName(constants.class.badge), badge;
            if (arr && arr.length) {
                badge = arr[0];
                badge.textContent = badgeValue;
                if (badgeValue === 0) {
                    dom.addClass(arr[0], constants.class.hidden);
                } else {
                    dom.removeClass(arr[0], constants.class.hidden);
                }
                setAriaLabelAttribute(el, badgeValue);
            } else {
                if (badgeValue && badgeValue > 0) {
                    var span = createBadgeElement(badgeValue);
                    el.children[0].appendChild(span);
                    setAriaLabelAttribute(el, badgeValue);
                }
            }
        }
    }

    self.createElement = function (icon) {
        return createElement(icon);
    };

    self.initDropdown = function (icon) {
        var dropdown = document.getElementById(icon.id);
        if (dropdown && dropdown.children.length > 0) {
            new Dropdown(dropdown, true);
        }
    };

    self.onClickIconHandler = function (icon) {
        var el = document.getElementById(icon.id);
        if (el) {
            el.addEventListener('click', function (event) {
                event.preventDefault();
                icon.onClickCallback(event);
            }, false);
        }
    };

    self.shownNotificationDropdownHandler = function () {
        var el = document.getElementById(constants.id.vismaiconAlert);
        el.parentNode.addEventListener('shown.bs.dropdown', function (event) {
            var ntf = document.getElementById(constants.id.notify),
                header = ntf.querySelector('h2.header');
            header.scrollIntoView();
        }, false);
    };

    self.onClickIconDropdownItemHandler = function (toggleId, item) {
        var el = document.getElementById(item.id);
        if (el) {
            el.addEventListener('click', function (event) {
                event.preventDefault();
                if (item.onClickCallback) {
                    item.onClickCallback(event);
                }
                var t = document.getElementById(toggleId);
                if (t) {
                    t.Dropdown.toggle();
                }
            }, false);
        }
    };

    self.onShortcutKeyUpHandler = function (icon) {
        nkeyup.onIconShortcutKeyUpHandler(icon);
    };

    self.setIconBadgeValue = function (el, badgeValue) {
        setIconBadgeValue(el, badgeValue);
    };

    self.setNotificationsIconBadgeValue = function (badgeValue) {
        var el = document.getElementById(constants.id.notifyIcon);
        setIconBadgeValue(el, badgeValue);
    };

};
/* jshint -W117 */

var DOMContextFilter = function (dom, options, msg) {
    var self = this, navu = new NavItemUtil();

    function createDropdownToggle(data) {
        var btn = dom.createElement('button', ['btn', 'btn-default', 'company-filter', constants.class.dropdownToggle],
            [{ id: constants.id.contextFilter }, { type: 'button' }, { 'data-toggle': 'dropdown' },
            { 'aria-expanded': false }, { 'aria-label': msg.contextTypeSelector + ' ' + data.contextFilterSelected.label }], 
            data.contextFilterSelected.label),
            span = dom.createElement('span', [constants.class.caret]);
        btn.appendChild(span);
        return btn;
    }

    function createDropdownMenu(data) {
        var ul;
        ul = dom.createElement('ul', [constants.class.dropdownMenu], [{
            role: 'listbox'
        }]);
        var frgm = document.createDocumentFragment(),
            li, a, item;
        for (var i = 0, len = data.contextFilters.length; i < len; i++) {
            item = data.contextFilters[i];
            li = dom.createElement('li');
            a = dom.createElement('a', [constants.class.contextFilterItem], [{
                id: item.value
            }, {
                role: 'option'
            }, {
                tabindex: -1
            },
            {
                href: '#'
            }
            ], item.label);
            if (item.selected) {
                dom.addClass(a, constants.class.active);
                a.setAttribute('aria-selected', true);
            }
            li.appendChild(a);
            frgm.appendChild(li);
        }
        ul.appendChild(frgm);
        return ul;
    }

    function resetActive(items) {
        if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
                dom.removeClass(items[i], constants.class.active);
            }
        }
    }

    self.createElement = function (data) {
        var div = dom.createElement('div', ['input-group-btn', 'company-filter', constants.class.dropdown]);
        div.appendChild(createDropdownToggle(data));
        div.appendChild(createDropdownMenu(data));
        return div;
    };

    self.initDropdown = function () {
        navu.initDropdownWithFocusOnActiveItem(constants.id.contextFilter, constants.selector.activeContextFilterItem);
    };

    self.onClickItemHandler = function (select) {
        var dropdown = document.getElementById(constants.id.contextFilter),
            items = document.getElementsByClassName(constants.class.contextFilterItem);
        if (dropdown && items && items.length) {
            for (var i = 0; i < items.length; i++) {
                items[i].addEventListener('click', function (event) {
                    event.preventDefault();
                    dropdown.childNodes[0].textContent = event.target.textContent;
                    //remove all active
                    resetActive(items);
                    dom.addClass(event.target, constants.class.active);
                    event.target.setAttribute('aria-selected', true);
                    select.api.filterByType(event.target.id);
                    dropdown.Dropdown.toggle();
                }, false);
            }
        }
    };

    self.onKeyUpHandler = function () {
        navu.onKeyUpDropdownHandler(constants.id.contextFilter, constants.selector.contextFilterItem);
    };

};
/* jshint -W117 */
/* jshint -W031 */

var DOMContextSelector = function (dom, options, msg) {
    var self = this,
        domctxf = new DOMContextFilter(dom, options, msg),
        nkeyup = new NavKeyUp();

    function createDropdownToggle(data) {
        var a = dom.createElement('a', [constants.class.dropdownToggle, 'button-context'],
            [{ id: constants.id.contextTrigger }, { href: '#' }, { title: '(Alt+K)' }, { 'data-toggle': 'dropdown' },
            { role: 'button' }, { 'aria-expanded': false }],
            data.user.firstName + ' ' + data.user.lastName),
            span = dom.createElement('span', ['vismaicon', 'vismaicon-menu', 'vismaicon-user'], null),
            caret,
            ariaLabel = msg.informationArea + ', ' + msg.shortcut + ': (Alt+K), ' +
                data.user.firstName + ' ' + data.user.lastName + ':',
            small = dom.createElement('small', ['selectedContext'], [{ id: constants.id.selectedContext }]);

        if (data.currentContext) {
            if (data.contextsCount === 1 && data.currentContext.type === constants.contextType.Visma) {
                small.innerHTML = '&nbsp;';
                dom.addClass(a, constants.class.noContext);
                a.setAttribute('aria-label', ariaLabel);
            } else {
                small.textContent = data.currentContext.name;
                a.setAttribute('aria-label', ariaLabel + ': ' + data.currentContext.name);
            }
        } else {
            small.innerHTML = '&nbsp;';
            dom.addClass(a, constants.class.noContext);
            a.setAttribute('aria-label', ariaLabel);
        }

        caret = dom.createElement('span', [constants.class.caret]);
        a.appendChild(span);
        a.appendChild(small);
        a.appendChild(caret);
        return a;
    }

    function createContextSelectionArea(data) {
        var li = null,
            form, div;
        if (data.contextsCount && data.contextsCount > 0) {
            li = dom.createElement('li', ['company-selection-area'], [{
                role: 'menuitem'
            }]);
            form = dom.createElement('div', ['context-selector'], [{
                id: constants.id.contextSelectorForm
            }]);
            div = dom.createElement('div', ['form-group']);

            if (data.contextsCount > 1) {
                if (data.contextsCount > options.limitToDisplayTypeahead) {
                    dom.addClass(div, 'search-group');
                }

                var group = dom.createElement('div', ['input-group']),
                    ctxsel;
                if (data.contextsCount <= options.limitToDisplayTypeahead) {
                    dom.addClass(group, 'few-contexts');
                }

                ctxsel = dom.createElement('div', ['company-input'],
                    [{ id: constants.id.contextSelector }, { 'aria-label': msg.contextSelector }]);

                ctxsel.setAttribute('role', 'combobox');
                ctxsel.setAttribute('aria-expanded', false);
                ctxsel.setAttribute('aria-haspopup', 'listbox');
                ctxsel.setAttribute('aria-owns', constants.id.contextsDropdown);

                group.appendChild(ctxsel);
                if (data.contextsCount > options.limitToDisplayTypeahead) {
                    var span = dom.createElement('span', ['search-icon']);
                    group.appendChild(span);
                }

                if (data.contextFilters && data.contextFilters.length) {
                    group.appendChild(domctxf.createElement(data));
                } else {
                    dom.addClass(group, 'one-context-type');
                }
                div.appendChild(group);

            } else if (data.contextsCount === 1 && data.currentContext && data.currentContext.type !== constants.contextType.Visma) {
                dom.addClass(li, 'one-context');
                div.textContent = data.currentContext.name;
            } else {
                dom.addClass(li, 'hidden');
            }
            form.appendChild(div);
            li.appendChild(form);
        }
        return li;
    }

    function setProfilePicture(el, url) {
        el.classList.add('user-img');
        if (url) {
            el.style.setProperty('background-image', 'url(' + url + ')');
        }
    }

    function createUserArea(data) {
        var li = dom.createElement('li', ['user-details-area', 'clear'], [{
            role: 'menuitem'
        }]),
            div = dom.createElement('div', null, [{
                title: data.user.email
            }]),
            divimg = dom.createElement('div'),
            divdata = dom.createElement('div', ['user-text']),
            span = dom.createElement('span', null, null, data.user.firstName + ' ' + data.user.lastName);
            // a = dom.createElement('a', ['btn', 'btn-default', 'pull-right'], [{ href: data.userDetailsUrl },
            // { role: 'button' }], msg.myDetails);

        setProfilePicture(divimg, data.user.profilePictureUrl);
        divdata.appendChild(span);
        span = dom.createElement('span', ['text-disabled'], null, data.user.email);
        divdata.appendChild(span);
        div.appendChild(divimg);
        div.appendChild(divdata);
        li.appendChild(div);
        // li.appendChild(a);
        return li;
    }
    function createExtraMenu(data) {
        var li = dom.createElement('li', ['clear'], [{
            role: 'menuitem'
        }]),
            a = dom.createElement('a', null, [{ href: '#' }], 'My profile'),
            a2 = dom.createElement('a', null, [{ href: '#' }], 'Language'),
            a3 = dom.createElement('a', null, [{ href: '#' }], 'My location');

        li.appendChild(a);
        li.appendChild(a2);
        li.appendChild(a3);
        return li;
    }

    function createFooter() {
        var li = dom.createElement('li', ['context-footer', 'company-selection-footer', 'clear'], [{
            role: 'menuitem'
        }]),
            
            a = dom.createElement('a', ['log-out-link', 'vismaicon', 'vismaicon-logout'], [{ id: constants.id.logoutButton }], msg.logout);
        li.appendChild(a);
        return li;
    }

    function createDivider() {
        var li = dom.createElement('li', ['divider']);
        return li;
    }

    function createDividerStrong() {
        var li = dom.createElement('li', ['divider', 'divider-strong']);
        return li;
    }

    function createDropdownMenu(data) {
        var ul = dom.createElement('ul', [constants.class.dropdownMenu, 'company-selection'], [{
            role: 'menu'
        }]),
            li = createContextSelectionArea(data);
        if (li) {
            ul.appendChild(li);
            li = createDivider();
            if (data.contextsCount && data.contextsCount === 1) {
                dom.addClass(li, 'one-context');
            }
            ul.appendChild(li);
        }
        ul.appendChild(createUserArea(data));
        ul.appendChild(createDivider());
        ul.appendChild(createExtraMenu());
        ul.appendChild(createDividerStrong());
        ul.appendChild(createFooter());
        return ul;
    }

    function setSelectedContext(el, a, context) {
        el.textContent = context.name;
        dom.removeClass(a, constants.class.noContext);
        var btn = document.getElementById(constants.id.contextsSearchButton);
        if (btn.childNodes.length === 1) {
            var text = document.createTextNode(context.name);
            btn.prepend(text);
        } else {
            btn.childNodes[0].textContent = (context.name);
        }
    }

    function setAsSelected(items, context) {
        var set = false;
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].id === context.id.toString()) {
                dom.addClass(items[i].parentElement, constants.class.active);
                dom.addClass(items[i].parentElement, constants.class.focus);
                set = true;
                break;
            }
        }
        return set;
    }

    function setAsUnselected(items, context) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].id !== context.id.toString()) {
                dom.removeClass(items[i].parentElement, constants.class.active);
                dom.removeClass(items[i].parentElement, constants.class.focus);
                break;
            }
        }
    }


    function setCurrentContext(context, limit, contextsCount) {
        var el = document.getElementById(constants.id.selectedContext),
            a = document.getElementById(constants.id.contextTrigger);
        if (contextsCount <= limit) {
            var dropdown = document.getElementById(constants.id.contextsDropdown);
            el.textContent = context.name;
            dom.removeClass(a, constants.class.noContext);
            if (dropdown && dropdown.children.length) {
                var items = dropdown.querySelectorAll(constants.selector.contextItems);
                var set = setAsSelected(items, context);
                if (set) {
                    items = dropdown.querySelectorAll(constants.selector.activeContextItems);
                    setAsUnselected(items, context);
                    setSelectedContext(el, a, context);
                } else {
                    throw new Error('Context not found in contexts list');
                }
            } else {
                throw new Error('Contexts list is empty');
            }
        } else {
            el.textContent = context.name;
            dom.removeClass(a, constants.class.noContext);
        }
    }

    self.createElement = function (data) {
        var li = dom.createElement('li', [constants.class.dropdown, 'user-dropdown', constants.class.pristine]);
        li.appendChild(createDropdownToggle(data));
        li.appendChild(createDropdownMenu(data));
        return li;
    };

    self.initDropdown = function () {
        var dropdown = document.getElementById(constants.id.contextTrigger);
        if (dropdown && dropdown.children.length > 0) {
            new Dropdown(dropdown, true);
            dropdown.addEventListener('click', function (event) {
                event.preventDefault();
            }, false);
        }
    };

    self.onClickContextFilterHandler = function () {
        domctxf.initDropdown();
        domctxf.onKeyUpHandler();
    };

    self.onClickContextTriggerHandler = function (callbacks) {
        var el = document.getElementById(constants.id.contextTrigger);
        el.addEventListener('click', callbacks.lastLoginTime, false);
    };

    self.onClickLogoutHandler = function (callbacks) {
        var el = document.getElementById(constants.id.logoutButton);
        el.addEventListener('click', function (event) {
            event.preventDefault();
            var el = document.getElementById(constants.id.contextTrigger);
            if (el && el.Dropdown) {
                el.Dropdown.toggle();
            }
            callbacks.onClickLogout(event);
        }, false);
    };

    self.preventSubmitHandler = function () {
        var el = document.getElementById(constants.id.contextSelectorForm);
        if (el) {
            el.addEventListener('submit', function (event) {
                event.preventDefault();
            }, false);
        }
    };

    self.initContextSelector = function (data, callbacks) {
        var el = document.getElementById(constants.id.contextSelector),
            ctxsel;
        if (el) {
            if (data.contextsCount > 1) {
                if (data.contextsCount <= options.limitToDisplayTypeahead) {
                    ctxsel = new Select(el, msg, {}, data.contexts, data.currentContext, callbacks);
                } else {
                    ctxsel = new Typeahead(el, msg, options, data.currentContext, callbacks);
                }
                domctxf.onClickItemHandler(ctxsel);
            }
        }
    };

    self.setCurrentContext = function (context, limit, contextsCount) {
        setCurrentContext(context, limit, contextsCount);
    };

    self.onShortcutKeyUpHandler = function () {
        var el = document.getElementById(constants.id.contextTrigger);
        nkeyup.onShortcutKeyUpHandler(constants.keyCode.K, el);
    };

};
/* jshint -W117 */

var DOMResponsiveness = function (dom) {
    var self = this,
        navu = new NavItemUtil(),
        root = document.getElementById(constants.id.component);


    function getElementWidth(el) {
        var w = 0;
        if (el) {
            var r = el.getBoundingClientRect();
            if (r.width) {
                w = r.width;
            } else {
                w = el.offsetWidth;
            }
        }
        return w;
    }

    function getWidths(flmenu) {
        var header = root.querySelector('.navbar-header'),
            ctxs = root.querySelector('.context-selector'),
            iWidths = {
                padding: 0, //active item padding is increased with 4 when this is only item left in menu
                menudrop: 90,
                navbarHeader: getElementWidth(header),
                contextSelector: getElementWidth(ctxs),
                firstLevelMenu: []
            },
            hidden = navu.getIndexesOfHiddenItems(flmenu),
            element = root.querySelector('#' + constants.id.flmenu);

        if (flmenu.length > 0) {
            if (element) {
                var items = element.children;
                if (items && items.length) {
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (!dom.hasClass(items[i], 'menudrop')) {
                            iWidths.firstLevelMenu.push(getElementWidth(items[i]));
                        }
                    }
                }
                if (hidden && hidden.length) {
                    navu.insertWidthsForHiddenItems(iWidths.firstLevelMenu, hidden);
                }
                if (iWidths.firstLevelMenu) {
                    iWidths.smallMenuItem = Math.min.apply(Math, iWidths.firstLevelMenu);
                }
            }
        }
        return iWidths;
    }

    function getAvailableWidth(iWidths) {
        var clientWidth = document.body.clientWidth;
        if (clientWidth <= 420) {
            return -1;
        }
        var ctx = root.querySelector('.context-selector');
        var contextSelectorWidth = getElementWidth(ctx),
            width = clientWidth - iWidths.navbarHeader -
                contextSelectorWidth;
        width -= iWidths.padding;
        return width;
    }

    function getUserDropdownElement() {
        var ul = root.querySelector('ul.context-selector li.user-dropdown');
        return ul;
    }

    function getDroppedIndex(flmenu, id, crti) {
        var index = -1,
            idx = -1,
            items = root.querySelectorAll('#' + constants.id.menuDropContent + '>li>a.fl-menu-item');
        if (items && items.length) {
            for (var i = 0, len = items.length; i < len; i++) {
                if (id !== items[i].id) {
                    idx = navu.getItemIndex(flmenu, items[i].id);
                    if (crti < idx) {
                        index = i;
                        break;
                    }
                }
            }
            if (idx === -1) {
                index = crti;
            }
        } else {
            index = 0;
        }
        return index;
    }

    function dropItemsFromIndex(flmenu, activeIndex, next) {
        var index;
        for (var len = flmenu.length, i = len - 1; i >= next; i--) {
            if (i !== activeIndex && flmenu[i].shown) {
                index = getDroppedIndex(flmenu, flmenu[i].id, i);
                if (index > -1) {
                    moveItemToDroppedMenu(flmenu[i].id, index);
                }
            }
        }
    }

    function setAsOpened(li, hasChildren) {
        if (hasChildren) {
            dom.addClass(li, constants.class.isOpen);
            var ul = li.querySelector('.third-level');
            if (ul && dom.hasClass(ul.parentElement, constants.class.active)) {
                dom.addClass(ul.parentElement, constants.class.open);
            }
        }
    }

    function setAsClosed(li, hasChildren) {
        if (hasChildren) {
            dom.removeClass(li, constants.class.isOpen);
            var ul = li.querySelector('.third-level');
            if (ul) {
                dom.removeClass(ul.parentElement, constants.class.open);
            }
        }
    }

    function copy(a, isAllDropped) {
        var li = dom.createElement('li'),
            oldParent = a.parentElement,
            hasChildren = dom.hasClass(a, constants.class.hasChildren);
        while (oldParent.firstChild) {
            li.appendChild(oldParent.firstChild);
        }
        if (dom.hasClass(oldParent, constants.class.active)) {
            dom.addClass(li, constants.class.active);
            if (isAllDropped) {
                setAsOpened(li, hasChildren);
            } else {
                setAsClosed(li, hasChildren);
            }
        }
        oldParent.parentElement.removeChild(oldParent);
        if (hasChildren) {
            dom.addClass(li, constants.class.secondLevelChildren);
        }
        return li;
    }

    function moveItemToDroppedMenu(id, index, isAllDropped) {
        var ul = root.querySelector('#' + constants.id.menuDropContent),
            a = root.querySelector('#' + constants.id.flmenu + '>li>a#' + id),
            li = ul.querySelector('.navbar-brand'),
            no = 0;
        if (li) {
            no = 1;
        }
        if (a) {
            if (dom.hasClass(a, constants.class.hasChildren)) {
                var span = dom.createElement('span', [constants.class.caret]);
                a.appendChild(span);
            }
            var clone = copy(a, isAllDropped);
            if (ul.children && ul.children.length) {
                ul.insertBefore(clone, ul.children[index + no]);
            } else {
                ul.appendChild(clone);
            }
        }
    }

    function moveItemToMenu(id, i, index) {
        var ul = root.querySelector('#' + constants.id.flmenu),
            menudrop = root.querySelector('.menudrop.dropdown'),
            active = ul.querySelector('li.active'),
            a = root.querySelector('#' + constants.id.menuDropContent + '>li>a#' + id);

        if (a) {
            if (dom.hasClass(a, constants.class.hasChildren)) {
                var span = a.querySelector('.caret');
                a.removeChild(span);
            }
            var clone = copy(a);
            if (i < index) {
                ul.insertBefore(clone, active);
            } else {
                ul.insertBefore(clone, menudrop);
            }
        }
    }

    function closeMenuDropped(span) {
        var isExpanded = span.parentElement.getAttribute('aria-expanded'),
            tabindex = span.parentElement.getAttribute('tabindex');
        if (!!isExpanded && tabindex === '0') {
            span.parentElement.Dropdown.toggle();
            var brand = document.getElementById(constants.id.navbarBrand);
            dom.removeClass(brand, constants.class.isOpen);
        }
    }

    function manageMenuDropContent(isMobile, hasNoMenuItems) {
        var trigger = document.getElementById(constants.id.menuDropTrigger);
        if (trigger) {
            var li = root.querySelector('li.menudrop'),
                span = trigger.children[0];
            if (hasDroppedItems()) {
                dom.removeClass(li, constants.class.hidden);
            } else {
                dom.addClass(li, constants.class.hidden);
            }
            if (isMobile) {
                document.body.classList.remove('nav-space');
                span.parentElement.setAttribute('tabindex', 0);
                dom.removeClass(span, constants.class.hidden);
                if (hasNoMenuItems) {
                    dom.removeClass(li, constants.class.hidden);
                }
            } else {
                closeMenuDropped(span);
                span.parentElement.setAttribute('tabindex', -1);
                dom.addClass(span, constants.class.hidden);
                if (hasNoMenuItems) {
                    dom.addClass(li, constants.class.hidden);
                }
                if (item1 && navu.hasChildren(item1)) {
                    document.body.classList.add('nav-space');
                }
                else {
                    document.body.classList.remove('nav-space');
                }
            }
        }
    }

    function manageActiveItem() {
        var ul = root.querySelector('#' + constants.id.flmenu);
        if (ul.children.length === 2) {
            if (dom.hasClass(ul.children[0], constants.class.active)) {
                dom.addClass(root.children[0], constants.class.onlyOneItem);
            }
        } else {
            dom.removeClass(root.children[0], constants.class.onlyOneItem);
        }
    }

    function hasDroppedItems() {
        var ul = root.querySelector('#' + constants.id.menuDropContent),
            li = ul.querySelector('.navbar-brand'),
            no = 0;
        if (li) {
            no = 1;
        }
        if (ul.children && ul.children.length > no) {
            return true;
        }
        return false;
    }

    function moveItemsToMenu(flmenu, index) {
        for (var i = 0, len = flmenu.length; i < len; i++) {
            if (flmenu[i].shown && i !== index) {
                moveItemToMenu(flmenu[i].id, i, index);
            }
        }
    }

    function manageFirstLevelMenuItems(flmenu, aWidth, iWidths, index) {
        moveItemsToMenu(flmenu, index);
        for (var i = 0, len = flmenu.length; i < len; i++) {
            if (flmenu[i].shown && i !== index) {
                aWidth -= iWidths.firstLevelMenu[i];
                if (aWidth < iWidths.smallMenuItem) {
                    dropItemsFromIndex(flmenu, index, i);
                    break;
                }
            }
        }
        return aWidth;
    }

    function expandUserDropdown(aWidth, iWidths, userDropdownEl) {
        if (!hasDroppedItems()) {
            //menudrop
            var ctx = root.querySelector('.context-selector'),
                crtContextSelectorWidth = getElementWidth(ctx);
            aWidth += iWidths.menudrop;
            aWidth += crtContextSelectorWidth;
            aWidth -= iWidths.contextSelector;
            if (aWidth > 0) {
                dom.removeClass(userDropdownEl, 'icon');
            }
        }
    }

    function resetUserDropdown(aWidth, iWidths, userDropdownEl) {
        var crtContextSelectorWidth = getElementWidth(getUserDropdownElement());
        if (aWidth > 0) {
            aWidth -= iWidths.contextSelector - crtContextSelectorWidth;
            if (aWidth > 0) {
                dom.removeClass(userDropdownEl, 'icon');
            }
        }
    }

    function getActiveFlItemId() {
        var id = null,
            item = root.querySelector('li.active a.fl-menu-item');
        if (item) {
            id = item.id;
        } else {
            item = root.querySelector('li a.fl-menu-item');
            if (item) {
                id = item.id;
            }
        }
        return id;
    }

    function manageIsMobile(isMobile) {
        var el = root.querySelector('#nc4navTopMain');
        if (isMobile) {
            dom.addClass(el, constants.class.isMobile);
        } else {
            dom.removeClass(el, constants.class.isMobile);
        }
        el = root.querySelector('div.navbar-brand');
        if (el) {
            if (isMobile) {
                dom.addClass(el, constants.class.hidden);
            } else {
                dom.removeClass(el, constants.class.hidden);
            }
        }
        if (el) {
            el = root.querySelector('li.navbar-brand');
            if (el) {
                if (isMobile) {
                    dom.removeClass(el, constants.class.hidden);
                } else {
                    dom.addClass(el, constants.class.hidden);
                }
            }
        }
    }

    function dropAllItems(flmenu) {
        for (var i = 0, len = flmenu.length; i < len; i++) {
            if (flmenu[i].shown) {
                moveItemToDroppedMenu(flmenu[i].id, i, true);
            }
        }
    }

    function handleResponsiveness(flmenu, iWidths) {
        if (iWidths) {
            var aWidth = getAvailableWidth(iWidths),
                userDropdownEl = getUserDropdownElement(),
                isMobile = false;

            if (iWidths.firstLevelMenu.length) {

                dom.addClass(userDropdownEl, 'icon');
                var id = getActiveFlItemId(),
                    index = navu.getItemIndex(flmenu, id);

                aWidth = getAvailableWidth(iWidths);

                if (aWidth > 0) {
                    aWidth -= iWidths.menudrop;
                    aWidth -= iWidths.firstLevelMenu[index];

                    if (aWidth > 0) {
                        moveItemToMenu(flmenu[index].id, index, index);
                        aWidth = manageFirstLevelMenuItems(flmenu, aWidth, iWidths, index);
                        expandUserDropdown(aWidth, iWidths, userDropdownEl);
                    } else {
                        isMobile = true;
                        dropAllItems(flmenu);
                    }
                } else {
                    isMobile = true;
                    dropAllItems(flmenu);
                }
                manageIsMobile(isMobile);
                manageMenuDropContent(isMobile);
                manageActiveItem();
            } else {
                if (aWidth <= 0) {
                    dom.addClass(userDropdownEl, 'icon');
                    aWidth = getAvailableWidth(iWidths);
                    if (aWidth <= 0) {
                        isMobile = true;
                    } else {
                        resetUserDropdown(aWidth, iWidths, userDropdownEl);
                    }

                } else {
                    resetUserDropdown(aWidth, iWidths, userDropdownEl);
                }
                manageIsMobile(isMobile);
                manageMenuDropContent(isMobile, true);
                manageActiveItem();
            }
        }
    }

    self.getWidths = function (data) {
        return getWidths(data.firstLevelMenu);
    };

    self.initResponsiveness = function (data, widths) {
        if (data.firstLevelMenu.length) {
            var id = getActiveFlItemId();
            if (id) {
                handleResponsiveness(data.firstLevelMenu, widths);
            }
        } else {
            handleResponsiveness(data.firstLevelMenu, widths);
        }
    };

    self.onResizeWindow = function (data, widths) {
        window.addEventListener('resize', function (event) {
            if (data.firstLevelMenu.length) {
                var id = getActiveFlItemId();
                if (id) {
                    handleResponsiveness(data.firstLevelMenu, widths);
                }
            } else {
                handleResponsiveness(data.firstLevelMenu, widths);
            }
        }, false);
    };

};
/* jshint -W117 */

var DOMNavigation = (function () {
    var instance;

    function init() {

        var dom = new DOMUtil(),
            widths,
            helpIcon = {
                css: 'vismaicon-help'
            },
            notifyIcon = {
                css: 'vismaicon-alert'
            },
            feedbackIcon = {
                css: 'vismaicon-feedback'
            };

        function hasRootElement() {
            var root = document.getElementById(constants.id.component), has = false;
            if (root) {
                has = true;
            }
            return has;
        }

        function createComponent(msg, options, data, comp) {
            var root = document.getElementById(constants.id.component),
                header = dom.createElement('header', ['navbar', 'navbar-default'], [{
                    id: constants.id.topMain
                }, {
                    role: 'navigation'
                }]),
                appsdiv = dom.createElement('div', ['navbar-header']),
                nav = dom.createElement('nav', ['collapse', 'navbar-collapse'], [{
                    id: constants.id.collapseMain
                }, { 'aria-label': msg.menu }]),
                ul = dom.createElement('ul', ['nav', 'navbar-nav', 'nav-tabs', 'navbar-right', 'first-level', 'context-selector']);
            if (!data.hasRights) {
                dom.addClass(ul, constants.class.noRights);
            }

            if (!data.isEmbedded) {
                appsdiv.appendChild(comp.apps.createElement(data));
                header.appendChild(appsdiv);
            } else {
                dom.addClass(header, constants.class.isEmbedded);
            }

            nav.appendChild(comp.menu.createElement(data));

            if (options.icons && options.icons.length) {
                for (var i = 0, len = options.icons.length; i < len; i++) {
                    ul.appendChild(comp.icon.createElement(options.icons[i]));
                }
            }

            if (options.hasNotifications) {
                notifyIcon.title = msg.notifications + ' (Alt+N)';
                notifyIcon.badgeValue = data.notificationsCount;
                notifyIcon.id = constants.id.notifyIcon;
                notifyIcon.isDropdown = true;
                ul.appendChild(comp.icon.createElement(notifyIcon));
            }

            if (options.hasFeedback) {
                feedbackIcon.title = msg.provideYourFeedback + ' (Alt+U)';
                feedbackIcon.id = constants.id.feedbackIcon;
                ul.appendChild(comp.icon.createElement(feedbackIcon));
            }

            if (options.hasHelp) {
                helpIcon.title = msg.help + ' (Alt+F1)';
                helpIcon.id = constants.id.helpIcon;
                ul.appendChild(comp.icon.createElement(helpIcon));
            }

            ul.appendChild(comp.ctxs.createElement(data));
            nav.appendChild(ul);
            header.appendChild(nav);
            root.appendChild(header);
        }

        function getBaseHref() {
            var el = document.querySelector('base'),
                href = '/';
            if (el) {
                href = el.getAttribute('href');
            }
            return href;
        }

        function handleIconDropdownItems(cmpicon, item) {
            if (item.isDropdown) {
                cmpicon.initDropdown(item);
                if (item.dropdownItems && item.dropdownItems.length) {
                    for (var j = 0, jlen = item.dropdownItems.length; j < jlen; j++) {
                        cmpicon.onClickIconDropdownItemHandler(item.id, item.dropdownItems[j]);
                    }
                }
            }
        }

        function handleIcons(cmpicon, options, callbacks) {
            if (options.icons && options.icons.length) {
                var item;
                for (var i = 0, len = options.icons.length; i < len; i++) {
                    item = options.icons[i];
                    cmpicon.onClickIconHandler(item);
                    cmpicon.onShortcutKeyUpHandler(item);
                    handleIconDropdownItems(cmpicon, item);
                }
            }

            if (options.hasNotifications) {
                notifyIcon.onClickCallback = callbacks.onClickNotifications;
                notifyIcon.shortcutKeys = [constants.keyCode.ALT, constants.keyCode.N];
                cmpicon.onClickIconHandler(notifyIcon);
                cmpicon.onShortcutKeyUpHandler(notifyIcon);
                cmpicon.initDropdown(notifyIcon);
                cmpicon.shownNotificationDropdownHandler();
            }

            if (options.hasFeedback) {
                feedbackIcon.onClickCallback = callbacks.onClickFeedback;
                feedbackIcon.shortcutKeys = [constants.keyCode.ALT, constants.keyCode.U];
                cmpicon.onClickIconHandler(feedbackIcon);
                cmpicon.onShortcutKeyUpHandler(feedbackIcon);
            }

            if (options.hasHelp) {
                helpIcon.onClickCallback = callbacks.onClickHelp;
                helpIcon.shortcutKeys = [constants.keyCode.ALT, constants.keyCode.F1];
                cmpicon.onClickIconHandler(helpIcon);
                cmpicon.onShortcutKeyUpHandler(helpIcon);
            }
        }


        return {
            hasRootElement: function () {
                return hasRootElement();
            },
            createComponent: function (msg, options, data, callbacks, pathname) {
                var comp = {
                    apps: new DOMApps(dom, options, msg),
                    menu: new DOMMenu(dom, options, msg),
                    icon: new DOMIcon(dom, msg),
                    ctxs: new DOMContextSelector(dom, options, msg)
                },
                    resp = new DOMResponsiveness(dom);
                createComponent(msg, options, data, comp);
                widths = resp.getWidths(data);
                comp.menu.setActiveItems(pathname);
                if (!data.isEmbedded) {
                    comp.apps.initDropdown();
                    comp.apps.onClickAppHandler(data, callbacks);
                    comp.apps.onShortcutKeyUpHandler();
                }
                comp.menu.initDropdowns();
                comp.menu.initDroppedItemsDropdown();
                comp.menu.onClickMenuItemHandler(data, callbacks);
                if (data.firstLevelMenu.length > 0) {
                    comp.menu.onClickdroppedAppsToggleHandler();
                    comp.menu.onClickActiveDroppedAppHandler();
                }
                comp.menu.onKeyUpHandler();
                handleIcons(comp.icon, options, callbacks);
                comp.ctxs.preventSubmitHandler();
                comp.ctxs.initDropdown();
                comp.ctxs.onClickContextTriggerHandler(callbacks);
                comp.ctxs.onClickContextFilterHandler();
                comp.ctxs.onClickLogoutHandler(callbacks);
                comp.ctxs.initContextSelector(data, callbacks);
                comp.ctxs.onShortcutKeyUpHandler();

                resp.initResponsiveness(data, widths);
                resp.onResizeWindow(data, widths);
            },
            isContextSelectorDropdownOpened: function (el) {
                return dom.hasClass(el.parentElement, constants.class.open) &&
                    !dom.hasClass(el.parentElement, constants.class.pristine);
            },
            removeContextSelectorDropdownPristineClass: function (el) {
                dom.removeClass(el.parentElement, constants.class.pristine);
            },
            updateLastLoginTime: function (data) {
                var p = document.getElementById(constants.id.lastLoginTimeParagraph),
                    el = document.getElementById(constants.id.lastLoginTime);
                if (el && p) {
                    if (data) {
                        el.textContent = data;
                        dom.removeClass(p, constants.class.hidden);
                    } else {
                        el.textContent = '';
                        dom.addClass(p, constants.class.hidden);
                    }
                }
            },
            updateSelectedContext: function (contextName) {
                var el = document.getElementById(constants.id.selectedContext);
                if (el) {
                    el.textContent = contextName;
                }
                el = document.getElementById(constants.id.contextTrigger);
                if (el) {
                    if (dom.hasClass(el, constants.class.noContext)) {
                        dom.removeClass(el, constants.class.noContext);
                    }
                    var text = el.getAttribute('aria-label').split(':')[0];
                    el.setAttribute('aria-label', text + ': ' + contextName);
                }
            },
            refreshMenu: function (options, data, msg, callbacks, pathname) {
                var el = document.getElementById(constants.id.collapseMain);
                if (el) {
                    var menu = new DOMMenu(dom, options, msg),
                        apps = new DOMApps(dom, options, msg),
                        resp = new DOMResponsiveness(dom);
                    apps.showElement();
                    menu.removeElement(el);
                    el.appendChild(menu.createElement(data));
                    menu.initDropdowns();
                    menu.initDroppedItemsDropdown();
                    menu.onClickMenuItemHandler(data, callbacks);
                    menu.setActiveItems(pathname);
                    var iwidths = resp.getWidths(data);
                    resp.initResponsiveness(data, iwidths);
                }
            },
            setActiveItems: function (options, data, pathname) {
                var menu = new DOMMenu(dom, options),
                    resp = new DOMResponsiveness(dom);
                menu.setActiveItems(pathname, true);
                resp.initResponsiveness(data, widths);
            },
            setActiveItemsById: function (options, data, itemflId, itemslId, itemtlId) {
                var menu = new DOMMenu(dom, options),
                    resp = new DOMResponsiveness(dom);
                menu.setActiveItemsById(itemflId, itemslId, itemtlId);
                resp.initResponsiveness(data, widths);
            },
            setCurrentContext: function (options, context, limit, contextsCount) {
                var ctxs = new DOMContextSelector(dom, options);
                ctxs.setCurrentContext(context, limit, contextsCount);
            },
            setIconBadgeValue: function (msg, id, newValue) {
                var el = document.getElementById(id);
                var cmpicon = new DOMIcon(dom, msg);
                cmpicon.setIconBadgeValue(el, newValue);
            },
            setNotificationsIconBadgeValue: function (msg, newValue) {
                var cmpicon = new DOMIcon(dom, msg);
                cmpicon.setNotificationsIconBadgeValue(newValue);
            },
            hideIcon: function (id) {
                var el = document.getElementById(id);
                if (el) {
                    el.parentElement.classList.add(constants.class.hidden);
                }
            },
            showIcon: function (id) {
                var el = document.getElementById(id);
                if (el) {
                    el.parentElement.classList.remove(constants.class.hidden);
                }
            },
            getBaseHref: function () {
                return getBaseHref();
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
/* jshint -W117 */
var NavigationService = (function () {
    var instance;

    function init() {

        function mergeObjects(to, from, key) {
            if (Array.isArray(to[key])) {
                if (from[key]) {
                    to[key] = from[key];
                }
            } else {
                if (to[key]) {
                    merge(to[key], from[key]);
                } else {
                    if (from[key]) {
                        to[key] = from[key];
                    }
                }
            }
        }

        function mergeMore(to, from, key) {
            if (typeof to[key] === 'function') {
                if (from[key]) {
                    to[key] = from[key];
                } else {
                    to[key] = undefined;
                }
            } else {
                if (from[key] !== undefined) {
                    to[key] = from[key];
                }
            }
        }

        function merge(to, from) {
            if (to === undefined) {
                if (from) {
                    return from;
                }
            }
            if (from === undefined) {
                return to;
            }
            for (var key in to) {
                if (to.hasOwnProperty(key)) {
                    if (typeof to[key] === 'object') {
                        mergeObjects(to, from, key);
                    } else {
                        mergeMore(to, from, key);
                    }
                }
            }
            return to;
        }

        function hasBaseUrl(baseUrl) {
            var has = false;
            if (baseUrl && baseUrl.length) {
                has = true;
            }
            return has;
        }

        function getBaseUrl(baseUrl) {
            var temp = null;
            if (baseUrl !== null) {
                if (baseUrl.length === 0) {
                    temp = '/';
                } else if (baseUrl.lastIndexOf('/') !== baseUrl.length - 1) {
                    temp = baseUrl + '/';
                } else {
                    temp = baseUrl;
                }
            }
            return temp;
        }

        function getSelectedApp(apps) {
            var selected = null;
            if (apps && apps.length) {
                for (var i = 0, len = apps.length; i < len; i++) {
                    if (apps[i].selected === true) {
                        selected = apps[i];
                        break;
                    }
                }
            }
            return selected;
        }

        function getContextFilters(array, all) {
            var results;
            if (array && array.length) {
                results = array.filter(function (item) {
                    return item.id === null;
                });
            }
            if (results && results.length > 1) {
                var arr = [],
                    item;
                for (var i = 0; i < results.length; i++) {
                    item = results[i];
                    arr[i] = {
                        label: item.name,
                        value: item.type
                    };
                }
                arr.unshift({
                    label: all,
                    value: constants.contextType.All,
                    selected: true
                });
                return arr;
            }
            return null;
        }

        function handleChild(nav, parent, item, field, level) {
            item.parentId = parent.id;
            item.activeWhen = nav.getActiveWhen(item[field], item.activeWhen, level);
            if (item.shown) {
                parent.hasChildren = true;
            }
        }

        function getRegExp(str) {
            if (str.indexOf('/') > -1) {
                var arr = str.split('/'), r = '';
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].length) {
                        r += '\\/';
                        r += arr[i];
                    }
                }
                r += '\\b';
                return new RegExp(r);
            }
            return new RegExp('\\b' + str + '\\b');
        }


        function setChildren(fmenu, smenu, tmenu, field) {
            var nav = new NavItemUtil(), root, regex1, regex2;
            for (var i = 0, len = fmenu.length; i < len; i++) {
                if (!fmenu[i][field]) { continue; }
                root = nav.getActiveWhen(fmenu[i][field], fmenu[i].activeWhen, 1);
                fmenu[i].activeWhen = root;
                regex1 = getRegExp(root);

                for (var j = 0, jlen = smenu.length; j < jlen; j++) {
                    if (smenu[j][field] && regex1.test(smenu[j][field])) {
                        handleChild(nav, fmenu[i], smenu[j], field, 2);
                        regex2 = getRegExp(smenu[j].activeWhen);
                        for (var k = 0, klen = tmenu.length; k < klen; k++) {
                            if (tmenu[k][field] && regex2.test(tmenu[k][field])) {
                                handleChild(nav, smenu[j], tmenu[k], field, 3);
                            }
                        }
                    }
                }
            }
        }

        function translate(items, translations, field) {
            if (translations) {
                for (var i = 0, len = items.length; i < len; i++) {
                    if (translations[items[i][field]]) {
                        items[i][field] = translations[items[i][field]];
                    }
                }
            }
        }

        function removeMenusFromOptions(options) {
            if (options.firstLevelMenu) {
                delete options['firstLevelMenu'];
            }
            if (options.secondLevelMenu) {
                delete options['secondLevelMenu'];
            }
            if (options.thirdLevelMenu) {
                delete options['thirdLevelMenu'];
            }
        }

        function getMenu(fromOptions, fromData) {
            var menu = [];
            if (fromOptions && fromOptions.length) {
                menu = fromOptions;
            } else if (fromData && fromData.length) {
                menu = fromData;
            }
            return menu;
        }

        function setMenus(options, data) {
            var firstLevelMenu = getMenu(options.firstLevelMenu, data.firstLevelMenu),
                secondLevelMenu = getMenu(options.secondLevelMenu, data.secondLevelMenu),
                thirdLevelMenu = getMenu(options.thirdLevelMenu, data.thirdLevelMenu),
                field = options.pathFieldName;
            removeMenusFromOptions(options);

            if (options.translations) {
                translate(firstLevelMenu, options.translations, 'text');
                translate(secondLevelMenu, options.translations, 'text');
                translate(thirdLevelMenu, options.translations, 'text');
            }

            setChildren(firstLevelMenu, secondLevelMenu, thirdLevelMenu, field);
            data.firstLevelMenu = firstLevelMenu;
            data.secondLevelMenu = secondLevelMenu;
            data.thirdLevelMenu = thirdLevelMenu;
        }

        function getQueryStringParamValue(href, key) {
            var val = null,
                hash;
            var hashes = href.slice(href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                if (hash[0] === key) {
                    val = hash[1];
                    break;
                }
            }
            return val;
        }

        function isEmbedded(href) {
            var val = getQueryStringParamValue(href, constants.embedded);
            if (val && val === 'true') {
                return true;
            }
            return false;
        }

        function getMenuItemIndex(id, menu, status) {
            var index = -1;
            for (var i = 0, len = menu.length; i < len; i++) {
                if (id === menu[i].id) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        function getMenuIndexes(ids, menu) {
            var res = [],
                index, j = 0;
            for (var i = ids.length - 1; i >= 0; i--) {
                index = getMenuItemIndex(ids[i], menu);
                if (index > -1) {
                    res[j] = index;
                    j += 1;
                }
            }
            return res;
        }

        function setParentStatus(parentId, menu, status, hideRoots) {
            var index = -1;
            for (var i = 0, len = menu.length; i < len; i++) {
                if (parentId === menu[i].id) {
                    menu[i].hasChildren = status;
                    if (hideRoots || status) {
                        menu[i].shown = status;
                    }
                    index = i;
                    break;
                }
            }
            return index;
        }

        function getChildren(parentId, menu) {
            var result = [];
            for (var i = 0, len = menu.length; i < len; i++) {
                if (parentId === menu[i].parentId) {
                    result.push(menu[i]);
                }
            }
            return result;
        }

        function setFirstLevelRenderStatus(arr, fmenu, smenu, tmenu, status) {
            var sc, tc;
            for (var i = 0, len = arr.length; i < len; i++) {
                fmenu[arr[i]].shown = status;
                sc = getChildren(fmenu[arr[i]].id, smenu);
                if (sc.length > 0) {
                    fmenu[arr[i]].hasChildren = status;
                }
                for (var j = 0, jlen = sc.length; j < jlen; j++) {
                    sc[j].shown = status;
                    tc = getChildren(sc[j].id, tmenu);
                    if (tc.length > 0) {
                        sc[j].hasChildren = status;
                    }
                    for (var k = 0, klen = tc.length; k < klen; k++) {
                        tc[k].shown = status;
                    }
                }
            }
        }


        function getParentStatus(id, parentId, menu, status) {
            var res = status;
            var arr = getChildren(parentId, menu);
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].id !== id && arr[i].shown === true) {
                    res = true;
                    break;
                }
            }
            return res;
        }

        function setSecondLevelRenderStatus(arr, fmenu, smenu, tmenu, status, hideRoots) {
            var tc, pstatus;
            for (var i = 0, len = arr.length; i < len; i++) {
                smenu[arr[i]].shown = status;
                pstatus = getParentStatus(smenu[arr[i]].id, smenu[arr[i]].parentId, smenu, status);
                setParentStatus(smenu[arr[i]].parentId, fmenu, pstatus, hideRoots);

                tc = getChildren(smenu[arr[i]].id, tmenu);
                if (tc.length > 0) {
                    smenu[arr[i]].hasChildren = status;
                }
                for (var j = 0, jlen = tc.length; j < jlen; j++) {
                    tc[j].shown = status;
                }
            }
        }

        function setThirdLevelRenderStatus(arr, fmenu, smenu, tmenu, status, hideRoots) {
            var pstatus, index;
            for (var i = 0, len = arr.length; i < len; i++) {
                tmenu[arr[i]].shown = status;
                pstatus = getParentStatus(tmenu[arr[i]].id, tmenu[arr[i]].parentId, tmenu, status);
                index = setParentStatus(tmenu[arr[i]].parentId, smenu, pstatus, hideRoots);
                pstatus = getParentStatus(smenu[index].id, smenu[index].parentId, smenu, status);
                setParentStatus(smenu[index].parentId, fmenu, pstatus, hideRoots);
            }
        }

        function setMenuItemsRenderStatus(ids, data, status, hideRoots) {
            if (ids && ids.length && data && data.firstLevelMenu) {
                var fli = getMenuIndexes(ids, data.firstLevelMenu),
                    sli, tli;
                setFirstLevelRenderStatus(fli, data.firstLevelMenu, data.secondLevelMenu, data.thirdLevelMenu, status);
                sli = getMenuIndexes(ids, data.secondLevelMenu);
                setSecondLevelRenderStatus(sli, data.firstLevelMenu, data.secondLevelMenu, data.thirdLevelMenu, status, hideRoots);
                tli = getMenuIndexes(ids, data.thirdLevelMenu);
                setThirdLevelRenderStatus(tli, data.firstLevelMenu, data.secondLevelMenu, data.thirdLevelMenu, status, hideRoots);
            }
        }

        function getPathname(location, baseHref) {
            var href = location.href,
                pathname;
            if (href.indexOf(constants.hashBang) > -1) {
                pathname = location.hash;
            } else {
                if (baseHref === '/') {
                    pathname = location.pathname;
                } else {
                    pathname = '/' + location.pathname.replace(baseHref, '');
                }
            }
            return pathname;
        }

        function hasRights(data) {
            var has = true;
            if (!data || data.currentContext === null &&
                data.apps === null && data.contexts.length === 0 &&
                data.contextsCount === 0) {
                has = false;
            }
            return has;
        }

        function setIconDropdownItemId(icon) {
            for (var i = 0, len = icon.dropdownItems.length; i < len; i++) {
                icon.dropdownItems[i].id = icon.id + 'Item' + i;
            }
        }

        function getIconId(css) {
            var strg = new StringUtil();
            return strg.camelize(constants.prefix.nc4nav + css);
        }

        function setIcons(options) {
            if (options.icons && options.icons.length) {
                var strg = new StringUtil(), i, len;
                translate(options.icons, options.translations, 'title');
                for (i = 0, len = options.icons.length; i < len; i++) {
                    options.icons[i].id = strg.camelize(constants.prefix.nc4nav + options.icons[i].css);
                    if (options.icons[i].dropdownItems && options.icons[i].dropdownItems.length) {
                        translate(options.icons[i].dropdownItems, options.translations, 'text');
                        setIconDropdownItemId(options.icons[i]);
                    }
                }
            }
        }

        function setIconDropdownItems(options, id, items) {
            if (items && items.length) {
                translate(items, options.translations, 'text');
                var icon = { id: id, dropdownItems: items };
                setIconDropdownItemId(icon);
            }
        }

        return {
            merge: function (to, from) {
                return merge(to, from);
            },
            hasBaseUrl: function (baseUrl) {
                return hasBaseUrl(baseUrl);
            },
            getBaseUrl: function (baseUrl) {
                return getBaseUrl(baseUrl);
            },
            getSelectedApp: function (apps) {
                return getSelectedApp(apps);
            },
            getContextFilters: function (array, all) {
                return getContextFilters(array, all);
            },
            setMenus: function (options, data) {
                setMenus(options, data);
            },
            isEmbedded: function (href) {
                return isEmbedded(href);
            },
            setMenuItemsRenderStatus: function (ids, data, status, hideRoots) {
                setMenuItemsRenderStatus(ids, data, status, hideRoots);
            },
            getPathname: function (location, baseHref) {
                return getPathname(location, baseHref);
            },
            hasRights: function (data) {
                return hasRights(data);
            },
            setIcons: function (options) {
                setIcons(options);
            },
            getIconId: function (css) {
                return getIconId(css);
            },
            setIconDropdownItems: function (options, id, items) {
                setIconDropdownItems(options, id, items);
            }
        };
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
/* jshint -W117 */

var NavigationComponent = function (options) {
    var self = this,
        service = NavigationService.getInstance(),
        t = Translation.getInstance(),
        dom = DOMNavigation.getInstance(),
        df = DateFormat.getInstance(),
        internalData;

    if (!defaultOptions.firstLevelMenu) {
        defaultOptions.firstLevelMenu = [];
        defaultOptions.secondLevelMenu = [];
        defaultOptions.thirdLevelMenu = [];
    }
    self.options = service.merge(defaultOptions, options);
    self.options.baseUrl = service.getBaseUrl(self.options.baseUrl);


    if (!dom.hasRootElement()) {
        throw new Error('Commponent root tag is not found. Please add a div tag with id="nc4navigation" in your html page.');
    }

    if (!service.hasBaseUrl(self.options.baseUrl)) {
        throw new Error('baseUrl for navigation api is not provided. Please set baseUrl option when init the component.');
    }

    var xhrs = XHRService.getInstance(),
        language = self.options.language,
        fallbackLanguage = self.options.fallbackLanguage,
        msg = new Translated(t, language, fallbackLanguage).messages;

    var createComponent = function (response) {
        service.setIcons(self.options);
        internalData = response;
        internalData.selected = service.getSelectedApp(internalData.apps);
        internalData.contextFilters = service.getContextFilters(internalData.contexts, msg.filterOptionsAll);
        internalData.contextFilterSelected = {
            label: msg.filterOptionsAll,
            value: constants.contextType.All
        };
        service.setMenus(self.options, internalData);
        var pathname = service.getPathname(window.location, dom.getBaseHref());
        internalData.isEmbedded = service.isEmbedded(window.location.href);
        internalData.hasRights = service.hasRights(internalData);
        dom.createComponent(msg, self.options, internalData, self.options.callback, pathname);
        if (self.options.callback.onComponentReady) {
            self.options.callback.onComponentReady(response);
        }
    };

    self.options.callback.lastLoginTime = function (event) {
        event.preventDefault();
        if (dom.isContextSelectorDropdownOpened(event.currentTarget)) {
            return;
        }
        dom.removeContextSelectorDropdownPristineClass(event.currentTarget);
        var lang = language || fallbackLanguage;
        if (self.options.callback.onDisplayLastLoginTime) {
            self.options.callback.onDisplayLastLoginTime(function (data) {
                dom.updateLastLoginTime(df.getLastLoginTime(lang, data.lastLoginTime));
            });
        } else {
            xhrs.get(self.options.baseUrl + self.options.restFulPath.lastLoginTime, self.options.xsrfToken,
                function (response) {
                    if (xhrs.isError(response)) {
                        if (self.options.callback.onError) {
                            self.options.callback.onError({ status: response.errorStatus, message: response.message });
                        }
                        return;
                    }
                    dom.updateLastLoginTime(df.getLastLoginTime(lang, response.lastLoginTime));
                }, self.options.withCredentials);
        }
    };

    self.options.callback.setSelectedContext = function (event, contextName) {
        dom.updateSelectedContext(contextName);
    };

    self.setNotificationsIconBadgeValue = function (newValue) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    dom.setNotificationsIconBadgeValue(msg, newValue);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.setIconBadgeValue = function (css, newValue) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    var id = service.getIconId(css);
                    dom.setIconBadgeValue(msg, id, newValue);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.hideIcon = function (css) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    var id = service.getIconId(css);
                    dom.hideIcon(id);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.showIcon = function (css) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    var id = service.getIconId(css);
                    dom.showIcon(id);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.hideMenuItems = function (ids, hideRoots) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    var pathname = service.getPathname(window.location, dom.getBaseHref());
                    service.setMenuItemsRenderStatus(ids, internalData, false, hideRoots);
                    dom.refreshMenu(self.options, internalData, msg, self.options.callback, pathname);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.showMenuItems = function (ids) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    var pathname = service.getPathname(window.location, dom.getBaseHref());
                    service.setMenuItemsRenderStatus(ids, internalData, true);
                    dom.refreshMenu(self.options, internalData, msg, self.options.callback, pathname);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.refreshMenuItems = function (flmenu, slmenu, tlmenu) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    var pathname = service.getPathname(window.location, dom.getBaseHref());
                    self.options.firstLevelMenu = flmenu || [];
                    self.options.secondLevelMenu = slmenu || [];
                    self.options.thirdLevelMenu = tlmenu || [];
                    service.setMenus(self.options, internalData);
                    dom.refreshMenu(self.options, internalData, msg, self.options.callback, pathname);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.setActiveItems = function (location) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    var pathname = service.getPathname(location, dom.getBaseHref());
                    dom.setActiveItems(self.options, internalData, pathname);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.setActiveItemsById = function (itemflId, itemslId, itemtlId) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    dom.setActiveItemsById(self.options, internalData, itemflId, itemslId, itemtlId);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.setCurrentContext = function (context) {
        var interval = setInterval(function () {
            if (dom.hasRootElement() && internalData) {
                try {
                    dom.setCurrentContext(self.options, context, self.options.limitToDisplayTypeahead, internalData.contextsCount);
                } finally {
                    clearInterval(interval);
                }
            }
        }, 10);
    };

    self.initComponent = function (data) {
        if (data) {
            createComponent(data);
        } else {
            if (self.options.baseUrl) {
                var url = self.options.baseUrl + self.options.restFulPath.menuItems,
                    params;
                if (self.options.usesQueryParams) {
                    if (self.options.allowedContextTypes) {
                        params = xhrs.getAsQueryParams([
                            {
                                name: 'limit', value: self.options.limitToDisplayTypeahead
                            },
                            {
                                name: 'allowedContextTypes', value: self.options.allowedContextTypes
                            }]);
                    } else {
                        params = xhrs.getAsQueryParams([{
                            name: 'limit', value: self.options.limitToDisplayTypeahead
                        }]);
                    }
                } else {
                    if (self.options.allowedContextTypes) {
                        params = xhrs.getAsPathParams([self.options.limitToDisplayTypeahead, self.options.allowedContextTypes],
                            self.options.encodesPathParams);
                    } else {
                        params = xhrs.getAsPathParams([self.options.limitToDisplayTypeahead],
                            self.options.encodesPathParams);
                    }
                }
                xhrs.get(url + params, self.options.xsrfToken,
                    function (response) {
                        if (xhrs.isError(response)) {
                            if (self.options.callback.onError) {
                                self.options.callback.onError({ status: response.errorStatus, message: response.message });
                            }
                            return;
                        }
                        createComponent(response);
                    }, self.options.withCredentials);
            }
        }
    };

};
/* jshint -W117 */

var nc4navigation = {
    component: null,
    init: function (options, data) {
        this.component = new NavigationComponent(options);
        this.component.initComponent(data);
    },
    hideMenuItems: function (ids, hideRoots) {
        this.component.hideMenuItems(ids, hideRoots);
    },
    showMenuItems: function (ids) {
        this.component.showMenuItems(ids);
    },
    refreshMenuItems: function(flmenu, slmenu, tlmenu){
        this.component.refreshMenuItems(flmenu, slmenu, tlmenu);
    },
    setMenuActiveItems: function () {
        var location = window.location;
        this.component.setActiveItems(location);
    },
    setMenuActiveItemsById: function (itemflId, itemslId, itemtlId) {
        this.component.setActiveItemsById(itemflId, itemslId, itemtlId);
    },
    setCurrentContext: function (context) {
        this.component.setCurrentContext(context);
    },
    setIconBadgeValue: function (css, newValue){    
        this.component.setIconBadgeValue(css, newValue);
    },
    setNotificationsIconBadgeValue: function (newValue){    
        this.component.setNotificationsIconBadgeValue(newValue);
    },
    hideIcon: function (css){    
        this.component.hideIcon(css);
    },
    showIcon: function (css){    
        this.component.showIcon(css);
    }
};

return nc4navigation;


}));