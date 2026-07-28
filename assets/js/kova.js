(function () {
  "use strict";

  function activateTab(tabList, nextTab) {
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]'));

    tabs.forEach(function (tab) {
      var selected = tab === nextTab;
      var panelId = tab.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);

      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;

      if (panel) {
        panel.hidden = !selected;
      }
    });

    nextTab.focus();
  }

  document.querySelectorAll("[data-tabs]").forEach(function (tabsRoot) {
    var tabList = tabsRoot.querySelector('[role="tablist"]');
    if (!tabList) {
      return;
    }

    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]'));

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateTab(tabList, tab);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex = index;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activateTab(tabList, tabs[nextIndex]);
      });
    });
  });

  document.querySelectorAll("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var targetId = button.getAttribute("data-copy-target");
      var target = document.getElementById(targetId);

      if (!target || !navigator.clipboard) {
        return;
      }

      navigator.clipboard.writeText(target.textContent || "").then(function () {
        var previous = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(function () {
          button.textContent = previous;
        }, 1400);
      }).catch(function () {
        button.textContent = "Select code";
      });
    });
  });
})();
