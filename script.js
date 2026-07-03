const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const progressBar = document.querySelector("#reading-progress");
const monthButtons = Array.from(document.querySelectorAll("[data-month-filter]"));
const timelineCards = Array.from(document.querySelectorAll("[data-timeline-card]"));
const monthGroups = Array.from(document.querySelectorAll("[data-month-group]"));
const monthHeadings = Array.from(document.querySelectorAll("[data-month-heading]"));
const monthToggles = Array.from(document.querySelectorAll("[data-month-toggle]"));
const skillTabs = Array.from(document.querySelectorAll("[data-skill-tab]"));
const skillPanels = Array.from(document.querySelectorAll("[data-skill-panel]"));

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("active", isActive);
  });
}

function updateReadingProgress() {
  if (!progressBar) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable <= 0 ? 0 : (window.scrollY / scrollable) * 100;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function filterTimeline(month) {
  monthGroups.forEach((group) => {
    const shouldShow = month === "all" || group.dataset.monthGroup === month;
    group.classList.toggle("is-hidden", !shouldShow);

    if (month === "all") {
      setMonthExpanded(group.dataset.monthGroup, false);
    } else if (shouldShow) {
      setMonthExpanded(group.dataset.monthGroup, true);
    }
  });

  monthButtons.forEach((button) => {
    const isActive = button.dataset.monthFilter === month;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setMonthExpanded(month, shouldExpand) {
  const group = monthGroups.find((item) => item.dataset.monthGroup === month);
  const toggle = monthToggles.find((item) => item.dataset.monthToggle === month);

  if (!group || !toggle) return;

  group.classList.toggle("is-collapsed", !shouldExpand);
  toggle.setAttribute("aria-expanded", String(shouldExpand));
}

function toggleMonthGroup(month) {
  const toggle = monthToggles.find((item) => item.dataset.monthToggle === month);
  const isExpanded = toggle?.getAttribute("aria-expanded") === "true";
  setMonthExpanded(month, !isExpanded);
}

function toggleTimelineCard(card) {
  const trigger = card.querySelector(".timeline-trigger");
  const detail = card.querySelector(".timeline-detail");
  const isOpen = detail.classList.toggle("open");

  if (trigger) {
    trigger.setAttribute("aria-expanded", String(isOpen));
  }
}

function activateSkillPanel(group) {
  skillTabs.forEach((tab) => {
    const isActive = tab.dataset.skillTab === group;
    tab.setAttribute("aria-selected", String(isActive));
  });

  skillPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.skillPanel === group);
  });
}

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveNav(visible.target.id);
    }
  },
  {
    rootMargin: "-20% 0px -55% 0px",
    threshold: [0.15, 0.35, 0.6],
  }
);

sections.forEach((section) => navObserver.observe(section));

monthButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => filterTimeline(button.dataset.monthFilter));
});

monthToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => toggleMonthGroup(toggle.dataset.monthToggle));
});

timelineCards.forEach((card) => {
  const trigger = card.querySelector(".timeline-trigger");
  const detail = card.querySelector(".timeline-detail");

  if (trigger && detail) {
    detail.classList.toggle("open", trigger.getAttribute("aria-expanded") === "true");
    trigger.addEventListener("click", () => toggleTimelineCard(card));
  }
});

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateSkillPanel(tab.dataset.skillTab));
});

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();
