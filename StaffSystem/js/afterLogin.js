window.onload = function () {
    // ===== 1. 保留你原来的登录名显示 =====
    let name = localStorage.getItem("username");
    if (name && name.trim() !== "") {
        document.getElementById("showName").innerText = name;
    } else {
        document.getElementById("showName").innerText = "not log in";
    }

    // ===== 2. 菜单点击展开/收起（核心） =====
    // 全局函数，给 HTML 的 onclick="toggleSubmenu(this)" 调用
    window.toggleSubmenu = function (el) {
        let parentLi = el.parentElement;          // 当前 a 的父 li
        let submenu = parentLi.querySelector('ul'); // 找直接子 ul（二级/三级）

        if (submenu) {
            // 切换显示/隐藏
            let isHidden = (submenu.style.display === 'none' || submenu.style.display === '');
            submenu.style.display = isHidden ? 'block' : 'none';
        }
    };

    // ===== 3. 页面加载：所有子菜单【默认全部隐藏】 =====
    document.querySelectorAll('.level2, .level3').forEach(ul => {
        ul.style.display = 'none';
    });

    // ===== 4. 普通菜单项（无子菜单）点击跳转 iframe =====
    let frm = document.getElementById("data");
    if (frm) {
        document.querySelectorAll('a:not([onclick])').forEach(a => {
            a.addEventListener('click', function (e) {
                let href = this.getAttribute('href');
                if (href && href !== 'javascript:void(0)') {
                    e.preventDefault();
                    frm.src = href;
                }
            });
        });
    }
};