// layout.js - Shared layout components for the application

// Check authentication status
function checkAuth() {
    const userData = localStorage.getItem('kelasguru_user');
    if (!userData) {
        window.location.href = 'login.html';
        return null;
    }
    
    try {
        return JSON.parse(userData);
    } catch (e) {
        localStorage.removeItem('kelasguru_user');
        window.location.href = 'login.html';
        return null;
    }
}

// Initialize layout with sidebar and header
function initLayout() {
    const user = checkAuth();
    if (!user) return;
    
    // Insert sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        const sidebarHtml = createSidebar();
        sidebarContainer.innerHTML = sidebarHtml;
        
        // Debug - check if journal link exists in the sidebar HTML
        console.log("Sidebar HTML contains journal link:", sidebarHtml.includes('href="journal.html"'));
    }
    
    // Insert header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = createHeader(user);
    }
    
    // Add event listeners
    setupLayoutEventListeners();
}

// Create sidebar HTML
function createSidebar() {
    return `
    <div class="sidebar bg-card h-full shadow-sm flex flex-col" style="background-color: #ffffff;">
        <div class="p-5 border-b flex items-center">
            <svg class="w-8 h-8 text-primary mr-2" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 56L56 162.5V184L256 290.5L456 184V162.5L256 56Z" fill="currentColor"/>
                <path d="M456 208L413 228V310C390.5 344.5 351 376 256 376C161 376 121.5 344.5 99 310V228L56 208V336C87.5 390.5 158 456 256 456C354 456 424.5 390.5 456 336V208Z" fill="currentColor"/>
                <path d="M368 242V306.5L396 282V223L368 242Z" fill="currentColor"/>
                <path d="M169 232L151 228.5L143 252L160 250L169 232Z" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M169 232L225 245L296 240.5L340 212" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1 class="text-lg font-medium">KelasGuru</h1>
        </div>
        <nav class="flex-1 p-3">
            <ul class="space-y-1.5">
                <li>
                    <a href="dashboard.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span class="text-sm font-medium">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="classes.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10"></path>
                        </svg>
                        <span class="text-sm font-medium">Kelas</span>
                    </a>
                </li>
                <li>
                    <a href="students.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <span class="text-sm font-medium">Siswa</span>
                    </a>
                </li>
                <li>
                    <a href="assignments.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <span class="text-sm font-medium">Tugas</span>
                    </a>
                </li>
                <li>
                    <a href="grades.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <span class="text-sm font-medium">Nilai</span>
                    </a>
                </li>
                <li>
                    <a href="attendance.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-sm font-medium">Presensi</span>
                    </a>
                </li>
                <li>
                    <a href="events.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-sm font-medium">Event</span>
                    </a>
                </li>
                <li>
                    <a href="journal.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253M16 6.253v13m0-13C14.832 5.477 13.246 5 11.5 5S8.168 5.477 7 6.253v13C8.168 18.477 9.754 18 11.5 18s3.332.477 4.5 1.253"></path>
                        </svg>
                        <span class="text-sm font-medium">Jurnal Pembelajaran</span>
                    </a>
                </li>
                <li>
                    <a href="question-bank.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-sm font-medium">Bank Soal</span>
                    </a>
                </li>
                <li>
                    <a href="gamification.html" class="flex items-center p-2.5 rounded-md hover:bg-muted/60 transition-colors">
                        <svg class="w-5 h-5 mr-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a4 4 0 00-4-4H5.45a4 4 0 00-3.91 3.22L1 11l.77 1.75C2.5 14.56 3.5 15 5 15h2.5M12 8l-3.5 3.5M12 8l3.5 3.5"></path>
                        </svg>
                        <span class="text-sm font-medium">Gamifikasi</span>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="p-4 border-t">
            <button id="logout-btn" class="flex items-center text-destructive w-full p-2 rounded-md hover:bg-muted/60 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="text-sm font-medium">Logout</span>
            </button>
        </div>
    </div>
    `;
}

// Create header HTML
function createHeader(user) {
    return `
    <div class="header bg-card flex justify-between items-center p-4 border-b">
        <div class="flex items-center">
            <button id="mobile-menu-btn" class="md:hidden p-2 rounded-md hover:bg-muted/60 mr-3 transition-colors">
                <svg class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <h1 class="text-lg font-medium page-title">Dashboard</h1>
        </div>
        <div class="flex items-center">
            <div class="mr-4 text-sm text-muted-foreground hidden sm:block">
                Welcome, ${user ? (user.name || user.username || 'User') : 'User'}
            </div>
            <div class="relative">
                <button id="user-menu-btn" class="flex items-center">
                    <div class="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                        ${user ? getUserInitials(user) : 'U'}
                    </div>
                </button>
                <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-10 hidden">
                    <a href="#" class="block px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors">Profile</a>
                    <a href="#" class="block px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors">Settings</a>
                    <button id="header-logout-btn" class="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted/60 transition-colors">Logout</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Get user initials for avatar
function getUserInitials(user) {
    if (user.name) {
        const nameParts = user.name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return user.name[0].toUpperCase();
    }
    return user.username[0].toUpperCase();
}

// Set up event listeners for layout components
function setupLayoutEventListeners() {
    // Toggle mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar-container');
            if (sidebar) {
                sidebar.classList.toggle('hidden');
                
                // When sidebar is shown on mobile, make it fixed position over the content
                if (!sidebar.classList.contains('hidden')) {
                    sidebar.classList.add('fixed', 'z-50', 'h-screen', 'left-0', 'top-0', 'shadow-lg');
                    sidebar.style.backgroundColor = '#ffffff';
                    sidebar.style.width = '16rem'; // 64px = 16rem
                    
                    // Also apply background color to the inner sidebar div for proper rendering
                    const innerSidebar = sidebar.querySelector('.sidebar');
                    if (innerSidebar) {
                        innerSidebar.style.backgroundColor = '#ffffff';
                        innerSidebar.classList.add('h-full');
                    }
                    
                    // Add a close button to the sidebar
                    if (!document.getElementById('sidebar-close')) {
                        const closeBtn = document.createElement('button');
                        closeBtn.id = 'sidebar-close';
                        closeBtn.className = 'absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200 md:hidden';
                        closeBtn.innerHTML = `
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        `;
                        closeBtn.addEventListener('click', function() {
                            sidebar.classList.add('hidden');
                            sidebar.classList.remove('fixed', 'z-50', 'h-screen', 'left-0', 'top-0', 'bg-card', 'shadow-lg');
                            sidebar.style.backgroundColor = '';
                            sidebar.style.width = '';
                            
                            // Reset inner sidebar styles too
                            const innerSidebar = sidebar.querySelector('.sidebar');
                            if (innerSidebar) {
                                innerSidebar.style.backgroundColor = '';
                            }
                            
                            this.remove();
                            document.getElementById('sidebar-overlay')?.remove();
                        });
                        sidebar.appendChild(closeBtn);
                    }
                    
                    // Add overlay to close sidebar when clicking outside
                    if (!document.getElementById('sidebar-overlay')) {
                        const overlay = document.createElement('div');
                        overlay.id = 'sidebar-overlay';
                        overlay.className = 'fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden';
                        overlay.addEventListener('click', function() {
                            sidebar.classList.add('hidden');
                            sidebar.classList.remove('fixed', 'z-50', 'h-screen', 'left-0', 'top-0', 'bg-card', 'shadow-lg');
                            sidebar.style.backgroundColor = '';
                            sidebar.style.width = '';
                            
                            // Reset inner sidebar styles too
                            const innerSidebar = sidebar.querySelector('.sidebar');
                            if (innerSidebar) {
                                innerSidebar.style.backgroundColor = '';
                            }
                            
                            this.remove();
                            document.getElementById('sidebar-close')?.remove();
                        });
                        document.body.appendChild(overlay);
                    }
                } else {
                    // Remove the fixed position when hidden
                    sidebar.classList.remove('fixed', 'z-50', 'h-screen', 'left-0', 'top-0', 'bg-card', 'shadow-lg');
                    sidebar.style.backgroundColor = '';
                    sidebar.style.width = '';
                    
                    // Reset inner sidebar styles too
                    const innerSidebar = sidebar.querySelector('.sidebar');
                    if (innerSidebar) {
                        innerSidebar.style.backgroundColor = '';
                    }
                    
                    document.getElementById('sidebar-overlay')?.remove();
                    document.getElementById('sidebar-close')?.remove();
                }
            }
        });
    }
    
    // Handle window resize to reset sidebar state
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar-container');
        if (sidebar) {
            if (window.innerWidth >= 768) { // md breakpoint
                sidebar.classList.remove('fixed', 'z-50', 'h-screen', 'left-0', 'top-0', 'bg-card', 'shadow-lg');
                sidebar.style.backgroundColor = '';
                sidebar.style.width = '';
                
                // Reset inner sidebar styles too
                const innerSidebar = sidebar.querySelector('.sidebar');
                if (innerSidebar) {
                    innerSidebar.style.backgroundColor = '';
                }
                
                document.getElementById('sidebar-overlay')?.remove();
                document.getElementById('sidebar-close')?.remove();
                
                // Make sure sidebar is visible on desktop
                sidebar.classList.remove('hidden');
                sidebar.classList.add('md:block');
            } else {
                // On small screens, sidebar should be hidden unless explicitly shown
                if (!sidebar.classList.contains('fixed')) {
                    sidebar.classList.add('hidden');
                }
            }
        }
    });
    
    // Toggle user dropdown
    const userMenuBtn = document.getElementById('user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            document.getElementById('user-dropdown').classList.toggle('hidden');
        });
    }
    
    // Handle logout
    const logoutBtns = [
        document.getElementById('logout-btn'),
        document.getElementById('header-logout-btn')
    ];
    
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                logout();
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const userDropdown = document.getElementById('user-dropdown');
        const userMenuBtn = document.getElementById('user-menu-btn');
        
        if (userDropdown && userMenuBtn) {
            if (!userMenuBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.add('hidden');
            }
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('kelasguru_user');
    window.location.href = 'login.html';
}

// Update page title in header
function updatePageTitle(title) {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = title;
    }
    document.title = `${title} - Teacher Administration Dashboard`;
}

// Show loading spinner
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        `;
    }
}

// Show error message
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>${message}</p>
            <button class="mt-2 bg-red-200 hover:bg-red-300 text-red-800 py-1 px-3 rounded" onclick="window.location.reload()">Retry</button>
        </div>
        `;
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format date and time for display
function formatDateTime(dateString) {
    if (!dateString) return '-';
    return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

// Update page title
function updatePageTitle(title) {
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = title;
    }
    
    // Also update document title
    document.title = title + ' - Teacher Administration Dashboard';
} 