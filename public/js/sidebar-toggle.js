document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('sidebarToggle');
  const mainContent = document.getElementById('mainContent');

  toggleButton.addEventListener('click', function () {
    if (sidebar.style.transform === 'translateX(-250px)') {
      sidebar.style.transform = 'translateX(0)';
      if (mainContent) {
        mainContent.style.marginLeft = '250px';
      }
    } else {
      sidebar.style.transform = 'translateX(-250px)';
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }
  });

  // Optional: Hide sidebar on small screens by default
  function checkScreenSize() {
    if (window.innerWidth < 992) { // Bootstrap lg breakpoint
      sidebar.style.transform = 'translateX(-250px)';
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    } else {
      sidebar.style.transform = 'translateX(0)';
      if (mainContent) {
        mainContent.style.marginLeft = '250px';
      }
    }
  }

  window.addEventListener('resize', checkScreenSize);
  checkScreenSize();
});
