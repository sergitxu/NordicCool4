var hash = window.location.hash;
if (!hash || hash === '/' || hash === 'index.html') {
    location.href = '#!/item1?lang=en';
}
var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "));
    };

hash = window.location.hash;
var query = hash.substring(hash.indexOf('?') + 1);

var params = {};
while (match = search.exec(query))
    params[decode(match[1])] = decode(match[2]);

var base = window.location.origin + window.location.pathname;

function setLanguageValue(value) {
    var element = document.getElementById('language');
    if (element) {
        element.value = value;
    }
}

function setPage(text) {
    var el = document.getElementById('page');
    text = text.replace('#!', '');
    if (el) {
        el.textContent = text;
    }
}

function setAction(text) {
    var el = document.getElementById('action');
    if (el) {
        el.textContent = text;
    }
}


var translations = {
    en: {
        ITEM1: 'Item one',
        ITEM2: 'Item two',
        ITEM3: 'Item three',
        ITEM4: 'Item four',
        ITEM5: 'Item five',
        ITEM6: 'Item six',
        ITEM7: 'Item seven',
        ITEM8: 'Item eight',
        ITEM9: 'Item nine',
        ITEM11: 'Item1.1',
        ITEM12: 'Item1.2',
        ITEM13: 'Item1.3',
        ITEM111: 'Item1.1-1',
        ITEM112: 'Item1.1-2',
        ITEM113: 'Item1.1-3',
        ITEM114: 'Item1.1-4',
        ICON_HOME: 'Home (Ctrl+Alt+Home)',
        ICON_INFO: 'Info (Ctrl+Alt+I)',
        TURN_ON_ONLINE_GUIDE: 'Turn on online guide',
        UPDATE_USER_X_INFO: 'Update user X info'
    }
};

var firstLevelMenu = [{
    id: 'item1',
    text: 'ITEM1',
    url: '#!/item1/item11/item111',
    shown: true
},
{
    id: 'item2',
    text: 'ITEM2',
    url: '#!/item2',
    shown: true,
},
{
    id: 'item3',
    text: 'ITEM3',
    url: '#!/item3',
    shown: true,
},
{
    id: 'item4',
    text: 'ITEM4',
    url: '#!/item4',
    shown: true,
},
{
    id: 'item5',
    text: 'ITEM5',
    url: '#!/item5',
    shown: true,
},
{
    id: 'item6',
    text: 'ITEM6',
    url: '#!/item6',
    shown: true,
},
{
    id: 'item7',
    text: 'ITEM7',
    url: '#!/item7',
    shown: true,
}];


var secondLevelMenu = [{
    id: 'item11',
    text: 'ITEM11',
    url: '#!/item1/item11/item111',
    shown: true
},
{
    id: 'item12',
    text: 'ITEM12',
    url: '#!/item1/item12',
    shown: true
},
{
    id: 'item13',
    text: 'ITEM13',
    url: '#!/item1/item13',
    shown: true
}];


var thirdLevelMenu = [{
    id: 'item111',
    text: 'ITEM111',
    url: '#!/item1/item11/item111',
    shown: true
},
{
    id: 'item112',
    text: 'ITEM112',
    url: '#!/item1/item11/item112',
    shown: true
},
{
    id: 'item113',
    text: 'ITEM113',
    url: '#!/item1/item11/item113',
    shown: true
},
{
    id: 'item114',
    text: 'ITEM114',
    url: '#!/item1/item11/item114',
    shown: true
},
{
    id: 'item115',
    text: 'ITEM115',
    url: '#!/item1/item11/item115',
    shown: true
},
{
    id: 'item116',
    text: 'ITEM116',
    url: '#!/item1/item11/item116',
    shown: true
},
{
    id: 'item117',
    text: 'ITEM117',
    url: '#!/item1/item11/item117',
    shown: true
},
{
    id: 'item118',
    text: 'ITEM118',
    url: '#!/item1/item11/item118',
    shown: true
},
{
    id: 'item119',
    text: 'ITEM119',
    url: '#!/item1/item11/item119',
    shown: true
},
{
    id: 'item1110',
    text: 'ITEM1110',
    url: '#!/item1/item11/item1110',
    shown: true
},
{
    id: 'item1111',
    text: 'ITEM1111',
    url: '#!/item1/item11/item1111',
    shown: true
},
{
    id: 'item11112',
    text: 'ITEM1112',
    url: '#!/item1/item11/item1112',
    shown: true
},
{
    id: 'item1113',
    text: 'ITEM1113',
    url: '#!/item1/item11/item1113',
    shown: true
},
{
    id: 'item1114',
    text: 'ITEM1114',
    url: '#!/item1/item11/item1114',
    shown: true
},
{
    id: 'item1115',
    text: 'ITEM1115',
    url: '#!/item1/item11/item1115',
    shown: true
},
{
    id: 'item1116',
    text: 'ITEM1116',
    url: '#!/item1/item11/item1116',
    shown: true
},
{
    id: 'item1117',
    text: 'ITEM1117',
    url: '#!/item1/item11/item1117',
    shown: true
},
{
    id: 'item1118',
    text: 'ITEM1118',
    url: '#!/item1/item11/item1118',
    shown: true
},
{
    id: 'item1119',
    text: 'ITEM1119',
    url: '#!/item1/item11/item1119',
    shown: true
},
{
    id: 'item1120',
    text: 'ITEM1120',
    url: '#!/item1/item11/item1120',
    shown: true
},
{
    id: 'item1121',
    text: 'ITEM1121',
    url: '#!/item1/item11/item1121',
    shown: true
},
{
    id: 'item1122',
    text: 'ITEM1122',
    url: '#!/item1/item11/item1122',
    shown: true
},
{
    id: 'item1123',
    text: 'ITEM1123',
    url: '#!/item1/item11/item1123',
    shown: true
},
{
    id: 'item1124',
    text: 'ITEM1124',
    url: '#!/item1/item11/item1124',
    shown: true
},
{
    id: 'item1125',
    text: 'ITEM1125',
    url: '#!/item1/item11/item1125',
    shown: true
},
{
    id: 'item1126',
    text: 'ITEM1126',
    url: '#!/item1/item11/item1126',
    shown: true
},
{
    id: 'item1127',
    text: 'ITEM1127',
    url: '#!/item1/item11/item1127',
    shown: true
},
{
    id: 'item1128',
    text: 'ITEM1128',
    url: '#!/item1/item11/item1128',
    shown: true
},
{
    id: 'item1129',
    text: 'ITEM1129',
    url: '#!/item1/item11/item1129',
    shown: true
},
{
    id: 'item1130',
    text: 'ITEM1130',
    url: '#!/item1/item11/item1130',
    shown: true
},
{
    id: 'item1131',
    text: 'ITEM1131',
    url: '#!/item1/item11/item1131',
    shown: true
},
{
    id: 'item1132',
    text: 'ITEM1132',
    url: '#!/item1/item11/item1132',
    shown: true
},
{
    id: 'item1133',
    text: 'ITEM1133',
    url: '#!/item1/item11/item1133',
    shown: true
},
{
    id: 'item1134',
    text: 'ITEM1134',
    url: '#!/item1/item11/item1134',
    shown: true
},
{
    id: 'item1135',
    text: 'ITEM1135',
    url: '#!/item1/item11/item1135',
    shown: true
}
];

setLanguageValue(params.lang);

var options = {
    baseUrl: '/',
    xsrfToken: {
        header: 'X-XSRF-TOKEN',
        value: 'token1234'
    },
    language: params.lang,
    selectedAppPrefix: '',
    firstLevelMenu: firstLevelMenu,
    secondLevelMenu: secondLevelMenu,
    thirdLevelMenu: thirdLevelMenu,
    translations: translations[params.lang],
    hasFeedback: false,
    hasHelp: true,
    hasNotifications: false,
    navigateOnClickApp: false,
    pathFieldName: 'url',
    usesQueryParams: false,
    usesItemsByType: true,
    encodesPathParams: false,
    icons: [
        // {
        //     title: 'ICON_USER',
        //     css: 'vismaicon-user', 
        //     onClickCallback: function () {
        //         setAction('Clicked on Chat');
        //     },
        //     shortcutKeys: [17, 18, 36]
        // },
        {
            title: 'ICON_SETTINGS',
            css: 'vismaicon-settings',
            onClickCallback: function () {
                setAction('Clicked on Settings');
            },
            shortcutKeys: [17, 18, 73]
        },
        {
            title: 'ICON_NOTIFICATION',
            css: 'vismaicon-alert',
            badgeValue: [1],
            onClickCallback: function () {
                setAction('Clicked on Notifications');
            },
            shortcutKeys: [17, 18, 73]
        }

    ]
};

var data = {
    user: {
        firstName: 'Christian',
        lastName: 'McBale Jr.',
        email: 'christian.mcbale.jr@mail.com',
        profilePictureUrl: '../assets/img/avatar.png'
    },
    currentContext: {
        id: 1,
        name: 'Cool Company name AB',
        type: 'Customer of Visma'
    },
    apps: [{
        id: 11,
        href: '#',
        name: 'Autoinvoice',
        logoUrl: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/Autoinvoice-48.png',
        selected: false
    },
    {
        id: 12,
        href: '#',
        name: 'Visma Project Name',
        logoUrl: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/InSchool-48.png',
        selected: true
    },
    {
        id: 13,
        href: '#',
        name: 'eAccounting',
        logoUrl: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/eAccounting-48.png',
        selected: false
    },
    {
        id: 14,
        href: '#',
        name: 'InSchool',
        logoUrl: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/InSchool-48.png',
        selected: false
    },
    {
        id: 15,
        href: '#',
        name: 'Payslip',
        logoUrl: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/Payslip-48.png',
        selected: false
    },
    {
        id: 16,
        href: '#',
        name: 'Advisor',
        logoUrl: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/Advisor-48.png',
        selected: false
    },
    {
        id: 17,
        href: '#',
        name: 'Stämpla',
        logoUrl: 'https://ux.visma.com/NC4-Beta/development/documentation/assets/img/apps/Stampla-48.png',
        selected: false
    },
    ],
    contextsCount: 1,
    contexts: [
        {
            id: 1,
            name: 'Cool Company name AB',
            type: 'CustomerOfVisma'
        },
    ],
    userDetailsUrl: '#'
}


options.callback = {
    onComponentReady: function (response) {
        setAction('Component ready');

        console.log(response);
    },
    onClickMenuItem: function (event, item) {
        setAction('Clicked on menu item: ' + item.text);
        if (item.url === '#!/support') {
            modalInstance.show();
        } else {
            location.href = item.url + '?res=' + params.res + '&' + 'lang=' + params.lang;
            setPage(item.url);
        }
    },
    onChangeContextSelector: function (event, item) {
        setAction('Changed context to: ' + JSON.stringify(item));
    },
    onClickLogout: function (event) {
        setAction('Clicked on Logout')
    },
    onClickApp: function (event, item) {
        setAction('Changed app to: ' + JSON.stringify(item));
    },
    onClickHelp: function (event) {
        setAction('Clicked on Help');
    },
    onClickFeedback: function (event) {
        setAction('Clicked on Feedback');
    },
    onClickNotifications: function (event) {
        setAction('Clicked on Notification');
    },
    onError: function (error) {
        setAction(error.status + ': ' + error.message);
    }
}

options.callback.onDisplayLastLoginTime = function (success) {
    var time = {
        lastLoginTime: 1537815386615
    };
    success(time);
};

window.nc4navigation.init(options, data);

window.addEventListener('hashchange', function (event) {
    window.nc4navigation.setMenuActiveItems();
}, false);