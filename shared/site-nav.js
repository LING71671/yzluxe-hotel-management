(function () {
    if (window.__yzluxeSiteNavLoaded) return;
    window.__yzluxeSiteNavLoaded = true;

    var script = document.currentScript;
    var scriptUrl = script ? new URL(script.getAttribute('src'), window.location.href) : new URL('/shared/site-nav.js', window.location.href);
    var siteRoot = new URL('../', scriptUrl).href;
    var choiceUrl = new URL('Clientpage/html/Choice.html', siteRoot).href;
    var observer = null;
    var attempts = 0;

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

    function goBack(event) {
        if (event) event.preventDefault();
        if (canUseHistoryBack()) {
            window.history.back();
        } else {
            window.location.href = fallbackUrl();
        }
    }

    function addStyles() {
        if (document.getElementById('yzluxe-site-nav-style')) return;
        var style = document.createElement('style');
        style.id = 'yzluxe-site-nav-style';
        style.textContent = [
            '.yzluxe-nav-back-item{list-style:none}',
            '.yzluxe-nav-back{cursor:pointer;text-decoration:none}',
            '.yzluxe-top-back{position:fixed;top:16px;right:18px;z-index:2147483647;background:#051c33;color:white;border:none;padding:12px 25px;cursor:pointer;font-weight:bold;transition:.3s;text-decoration:none;display:inline-block;font-size:13px;line-height:1;box-shadow:0 8px 24px rgba(0,0,0,.18)}',
            '.yzluxe-top-back:hover{background:#0a2d52}',
            '.yzluxe-top-back.restaurant{background-color:#1a365d;color:#ffffff;border:none;padding:12px 30px;font-size:14px;font-weight:500;border-radius:6px;cursor:pointer;letter-spacing:1px;transition:all .3s ease}',
            '.yzluxe-top-back.restaurant:hover{background-color:#102744}',
            '@media (max-width:640px){.yzluxe-top-back{top:10px;right:10px;padding:10px 16px;font-size:12px}}'
        ].join('');
        document.head.appendChild(style);
    }

    function createBackLink() {
        var back = document.createElement('a');
        back.href = fallbackUrl();
        back.className = 'yzluxe-nav-back';
        back.textContent = 'Back';
        back.addEventListener('click', goBack);
        return back;
    }

    function findHomeLink() {
        var links = document.querySelectorAll('header nav a, nav a');
        for (var i = 0; i < links.length; i++) {
            if (links[i].textContent.trim().toLowerCase() === 'home') {
                return links[i];
            }
        }
        return null;
    }

    function insertBeforeHome() {
        if (document.querySelector('.yzluxe-nav-back')) return true;

        var homeLink = findHomeLink();
        if (!homeLink) return false;

        var homeItem = homeLink.closest('li');
        if (homeItem && homeItem.parentNode) {
            var item = document.createElement('li');
            item.className = 'yzluxe-nav-back-item';
            item.appendChild(createBackLink());
            homeItem.parentNode.insertBefore(item, homeItem);
        } else {
            homeLink.parentNode.insertBefore(createBackLink(), homeLink);
        }
        return true;
    }

    function addTopFallback() {
        if (document.querySelector('.yzluxe-nav-back') || document.querySelector('.yzluxe-top-back')) return;
        if (document.getElementById('back')) return;

        var back = document.createElement('button');
        back.type = 'button';
        back.className = 'yzluxe-top-back';
        if (pathIncludes('/Clientpage/html/mealCus/') || pathIncludes('/StaffSystem/mealWorker/')) {
            back.className += ' restaurant';
        }
        back.textContent = 'Back';
        back.addEventListener('click', goBack);
        document.body.appendChild(back);
    }

    function addBack() {
        addStyles();
        attempts++;

        if (insertBeforeHome()) {
            if (observer) observer.disconnect();
            return;
        }

        if (attempts > 20) {
            addTopFallback();
            if (observer) observer.disconnect();
        }
    }

    function start() {
        addBack();
        observer = new MutationObserver(addBack);
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(addBack, 100);
        setTimeout(addBack, 300);
        setTimeout(addBack, 700);
        setTimeout(addBack, 1200);
        setTimeout(function () {
            if (!insertBeforeHome()) {
                addTopFallback();
                if (observer) observer.disconnect();
            }
        }, 1600);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
