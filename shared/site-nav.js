(function () {
    if (window.__yzluxeSiteNavLoaded) return;
    window.__yzluxeSiteNavLoaded = true;

    var script = document.currentScript;
    var scriptUrl = script ? new URL(script.getAttribute('src'), window.location.href) : new URL('/shared/site-nav.js', window.location.href);
    var siteRoot = new URL('../', scriptUrl).href;
    var choiceUrl = new URL('Clientpage/html/Choice.html', siteRoot).href;

    function pathIncludes(value) {
        return window.location.pathname.replace(/\\/g, '/').indexOf(value) !== -1;
    }

    function fallbackUrl() {
        if (pathIncludes('/Clientpage/html/roomCus/roomSys/') || pathIncludes('/Clientpage/html/mealCus/system/')) {
            return new URL('Clientpage/html/cus-subpage.html', siteRoot).href;
        }
        if (pathIncludes('/Clientpage/html/cus-subpage.html') || pathIncludes('/Clientpage/html/aboutUs.html')) {
            return choiceUrl;
        }
        if (pathIncludes('/StaffSystem/roomWorker/system/') ||
            pathIncludes('/StaffSystem/mealWorker/sys/') ||
            pathIncludes('/StaffSystem/employee_management_subsystem/html/') ||
            pathIncludes('/StaffSystem/html/Dashboard.html') ||
            pathIncludes('/StaffSystem/html/entertainment.html') ||
            pathIncludes('/StaffSystem/html/room.html')) {
            return new URL('StaffSystem/html/afterLogin.html', siteRoot).href;
        }
        if (pathIncludes('/StaffSystem/html/afterLogin.html') || pathIncludes('/StaffSystem/html/forgetPass.html')) {
            return new URL('StaffSystem/html/login.html', siteRoot).href;
        }
        if (pathIncludes('/StaffSystem/html/login.html')) {
            return choiceUrl;
        }
        return choiceUrl;
    }

    function canUseHistoryBack() {
        if (!document.referrer) return false;
        try {
            var referrer = new URL(document.referrer);
            return referrer.origin === window.location.origin && referrer.href !== window.location.href;
        } catch (error) {
            return false;
        }
    }

    function addStyles() {
        var style = document.createElement('style');
        style.textContent = [
            '.yzluxe-site-nav{position:fixed;right:18px;bottom:18px;z-index:2147483647;display:flex;gap:8px;font-family:Arial,sans-serif}',
            '.yzluxe-site-nav button{background:#051c33;color:white;border:none;padding:12px 25px;cursor:pointer;font-weight:bold;transition:.3s;text-decoration:none;display:inline-block;font-size:13px;line-height:1;box-shadow:0 8px 24px rgba(0,0,0,.18)}',
            '.yzluxe-site-nav button:hover{background:#0a2d52}',
            '.yzluxe-site-nav.restaurant button{background-color:#1a365d;color:#ffffff;border:none;padding:12px 30px;font-size:14px;font-weight:500;border-radius:6px;cursor:pointer;letter-spacing:1px;transition:all .3s ease}',
            '.yzluxe-site-nav.restaurant button:hover{background-color:#102744}',
            '@media (max-width:640px){.yzluxe-site-nav{right:10px;bottom:10px}.yzluxe-site-nav button{padding:10px 16px;font-size:12px}}'
        ].join('');
        document.head.appendChild(style);
    }

    function addNav() {
        if (document.querySelector('.yzluxe-site-nav')) return;
        addStyles();

        var nav = document.createElement('div');
        nav.className = 'yzluxe-site-nav';
        if (pathIncludes('/Clientpage/html/mealCus/') || pathIncludes('/StaffSystem/mealWorker/')) {
            nav.className += ' restaurant';
        }

        var back = document.createElement('button');
        back.type = 'button';
        back.textContent = 'Back';
        back.addEventListener('click', function () {
            if (canUseHistoryBack()) {
                window.history.back();
            } else {
                window.location.href = fallbackUrl();
            }
        });

        var home = document.createElement('button');
        home.type = 'button';
        home.textContent = 'Home';
        home.addEventListener('click', function () {
            window.location.href = choiceUrl;
        });

        nav.appendChild(back);
        nav.appendChild(home);
        document.body.appendChild(nav);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addNav);
    } else {
        addNav();
    }
})();
