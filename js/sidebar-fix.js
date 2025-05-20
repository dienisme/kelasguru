/**
 * sidebar-fix.js - Ensures the sidebar is correctly displayed with all menu items
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('sidebar-fix.js: Checking sidebar menu items');
    
    // Give more time for the main layout scripts to run
    setTimeout(function() {
        const sidebarContainer = document.getElementById('sidebar-container');
        
        if (!sidebarContainer) {
            console.error('sidebar-fix.js: Sidebar container not found');
            return;
        }
        
        console.log('sidebar-fix.js: Sidebar container found');
        
        // Log the sidebar container content to debug
        console.log('sidebar-fix.js: Sidebar container HTML:', sidebarContainer.innerHTML.substring(0, 100) + '...');
        
        // First check if the sidebar is empty
        if (!sidebarContainer.innerHTML || sidebarContainer.innerHTML.trim() === '') {
            console.log('sidebar-fix.js: Sidebar appears to be empty, calling initLayout');
            // If initLayout exists, call it to initialize the layout
            if (typeof initLayout === 'function') {
                initLayout();
            }
        }
        
        // Try multiple selectors to find the navigation menu
        let navMenu = sidebarContainer.querySelector('nav ul');
        
        if (!navMenu) {
            // Try alternate selectors
            navMenu = sidebarContainer.querySelector('ul');
            console.log('sidebar-fix.js: Trying alternate selector for nav menu');
        }
        
        if (!navMenu) {
            // Create a nav menu if it doesn't exist
            console.log('sidebar-fix.js: Nav menu not found, creating one');
            const navElement = document.createElement('nav');
            navElement.className = 'flex-1 p-2';
            
            navMenu = document.createElement('ul');
            navElement.appendChild(navMenu);
            
            // Find a good place to insert it
            const firstDiv = sidebarContainer.querySelector('div');
            if (firstDiv) {
                firstDiv.appendChild(navElement);
            } else {
                sidebarContainer.appendChild(navElement);
            }
        } else {
            console.log('sidebar-fix.js: Nav menu found');
        }
        
        // Check if journal menu item exists
        const journalMenuItem = sidebarContainer.querySelector('a[href="journal.html"]');
        
        // Only add the journal menu item if it doesn't already exist
        if (!journalMenuItem) {
            console.log('sidebar-fix.js: Journal menu item missing, adding it');
            
            // Check again to make double sure we don't have duplicates
            const existingItems = navMenu.querySelectorAll('a');
            let journalExists = false;
            
            existingItems.forEach(item => {
                if (item.getAttribute('href') === 'journal.html') {
                    journalExists = true;
                }
            });
            
            if (!journalExists) {
                // Create new menu item for journal
                const journalItem = document.createElement('li');
                journalItem.className = 'mb-1';
                journalItem.innerHTML = `
                    <a href="journal.html" class="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253M16 6.253v13m0-13C14.832 5.477 13.246 5 11.5 5S8.168 5.477 7 6.253v13C8.168 18.477 9.754 18 11.5 18s3.332.477 4.5 1.253"></path>
                        </svg>
                        Jurnal Pembelajaran
                    </a>
                `;
                
                // Find events menu item to insert after
                const eventsMenuItem = Array.from(navMenu.querySelectorAll('li a'))
                    .find(a => a.getAttribute('href') === 'events.html')?.parentNode;
                
                if (eventsMenuItem) {
                    navMenu.insertBefore(journalItem, eventsMenuItem.nextSibling);
                    console.log('sidebar-fix.js: Journal menu item added after events menu');
                } else {
                    // Add at the end of the menu
                    navMenu.appendChild(journalItem);
                    console.log('sidebar-fix.js: Journal menu item added at the end of the menu');
                }
            } else {
                console.log('sidebar-fix.js: Journal link already exists in menu items');
            }
        } else {
            console.log('sidebar-fix.js: Journal menu item already exists');
        }
        
        // Check if gamification menu item exists
        const gamificationMenuItem = sidebarContainer.querySelector('a[href="gamification.html"]');
        
        // Only add the gamification menu item if it doesn't already exist
        if (!gamificationMenuItem) {
            console.log('sidebar-fix.js: Gamification menu item missing, adding it');
            
            // Check again to make double sure we don't have duplicates
            const existingItems = navMenu.querySelectorAll('a');
            let gamificationExists = false;
            
            existingItems.forEach(item => {
                if (item.getAttribute('href') === 'gamification.html') {
                    gamificationExists = true;
                }
            });
            
            if (!gamificationExists) {
                // Create new menu item for gamification
                const gamificationItem = document.createElement('li');
                gamificationItem.className = 'mb-1';
                gamificationItem.innerHTML = `
                    <a href="gamification.html" class="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a4 4 0 00-4-4H5.45a4 4 0 00-3.91 3.22L1 11l.77 1.75C2.5 14.56 3.5 15 5 15h2.5M12 8l-3.5 3.5M12 8l3.5 3.5"></path>
                        </svg>
                        Gamifikasi
                    </a>
                `;
                
                // Find question-bank menu item to insert after
                const questionBankMenuItem = Array.from(navMenu.querySelectorAll('li a'))
                    .find(a => a.getAttribute('href') === 'question-bank.html')?.parentNode;
                
                if (questionBankMenuItem) {
                    navMenu.insertBefore(gamificationItem, questionBankMenuItem.nextSibling);
                    console.log('sidebar-fix.js: Gamification menu item added after question bank menu');
                } else {
                    // Add at the end of the menu
                    navMenu.appendChild(gamificationItem);
                    console.log('sidebar-fix.js: Gamification menu item added at the end of the menu');
                }
            } else {
                console.log('sidebar-fix.js: Gamification link already exists in menu items');
            }
        } else {
            console.log('sidebar-fix.js: Gamification menu item already exists');
        }
    }, 1000); // Increased wait time to 1000ms to give more time for the sidebar to be populated
}); 