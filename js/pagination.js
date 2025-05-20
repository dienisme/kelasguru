/**
 * Pagination utility for implementing lazy loading across the application
 */

class Pagination {
    constructor(options = {}) {
        this.currentPage = options.initialPage || 1;
        this.pageSize = options.pageSize || 10;
        this.totalItems = options.totalItems || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.containerId = options.containerId || '';
        this.onPageChange = options.onPageChange || (() => {});
        this.isLoading = false;
    }

    setTotalItems(count) {
        this.totalItems = count;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.renderPagination();
    }

    next() {
        if (this.currentPage < this.totalPages && !this.isLoading) {
            this.currentPage++;
            this.onPageChange(this.currentPage);
            this.renderPagination();
        }
    }

    prev() {
        if (this.currentPage > 1 && !this.isLoading) {
            this.currentPage--;
            this.onPageChange(this.currentPage);
            this.renderPagination();
        }
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages && !this.isLoading) {
            this.currentPage = page;
            this.onPageChange(this.currentPage);
            this.renderPagination();
        }
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        const paginationContainer = document.getElementById(this.containerId);
        if (paginationContainer) {
            const buttons = paginationContainer.querySelectorAll('button');
            buttons.forEach(button => {
                button.disabled = isLoading;
                if (isLoading) {
                    button.classList.add('opacity-50', 'cursor-not-allowed');
                } else {
                    button.classList.remove('opacity-50', 'cursor-not-allowed');
                }
            });
        }
    }

    renderPagination() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        let html = '<div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">';
        
        // Mobile view pagination
        html += `
            <div class="flex flex-1 justify-between sm:hidden">
                <button ${this.currentPage === 1 ? 'disabled' : ''} 
                   class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                   id="prev-page-mobile">
                   Previous
                </button>
                <button ${this.currentPage === this.totalPages ? 'disabled' : ''}
                   class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${this.currentPage === this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                   id="next-page-mobile">
                   Next
                </button>
            </div>
        `;

        // Desktop view pagination
        html += `
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        Showing <span class="font-medium">${(this.currentPage - 1) * this.pageSize + 1}</span> to 
                        <span class="font-medium">${Math.min(this.currentPage * this.pageSize, this.totalItems)}</span> of 
                        <span class="font-medium">${this.totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button ${this.currentPage === 1 ? 'disabled' : ''} 
                            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                            id="prev-page">
                            <span class="sr-only">Previous</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                            </svg>
                        </button>
        `;

        // Page numbers
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.currentPage;
            html += `
                <button aria-current="${isActive ? 'page' : 'false'}" 
                    class="page-number relative inline-flex items-center px-4 py-2 text-sm font-semibold ${isActive 
                        ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary' 
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}"
                    data-page="${i}">
                    ${i}
                </button>
            `;
        }

        html += `
                        <button ${this.currentPage === this.totalPages ? 'disabled' : ''} 
                            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${this.currentPage === this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                            id="next-page">
                            <span class="sr-only">Next</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>`;

        container.innerHTML = html;

        // Add event listeners
        document.getElementById('prev-page')?.addEventListener('click', () => this.prev());
        document.getElementById('next-page')?.addEventListener('click', () => this.next());
        document.getElementById('prev-page-mobile')?.addEventListener('click', () => this.prev());
        document.getElementById('next-page-mobile')?.addEventListener('click', () => this.next());

        // Page number buttons
        const pageNumberButtons = container.querySelectorAll('.page-number');
        pageNumberButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page, 10);
                this.goToPage(page);
            });
        });
    }
}

// Infinite scroll pagination helper
class InfiniteScroll {
    constructor(options = {}) {
        this.container = document.getElementById(options.containerId);
        this.currentPage = options.initialPage || 1;
        this.pageSize = options.pageSize || 10;
        this.isLoading = false;
        this.hasMore = true;
        this.onLoadMore = options.onLoadMore || (() => {});
        this.threshold = options.threshold || 100; // pixels from bottom to trigger next page
        
        // Initialize if container exists
        if (this.container) {
            this.setupInfiniteScroll();
        }
    }

    setupInfiniteScroll() {
        // Find the parent scrollable container
        this.scrollContainer = this.findScrollContainer(this.container);
        
        // Setup scroll event listener
        this.scrollListener = this.handleScroll.bind(this);
        this.scrollContainer.addEventListener('scroll', this.scrollListener);
    }

    findScrollContainer(element) {
        // Find the scrollable parent container
        let parent = element.parentElement;
        while (parent) {
            const overflowY = window.getComputedStyle(parent).overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
                return parent;
            }
            parent = parent.parentElement;
        }
        // Default to window if no scrollable container found
        return window;
    }

    handleScroll() {
        if (this.isLoading || !this.hasMore) return;

        const scrollPosition = this.scrollContainer === window 
            ? (window.innerHeight + window.scrollY) 
            : (this.scrollContainer.offsetHeight + this.scrollContainer.scrollTop);
        
        const scrollHeight = this.scrollContainer === window 
            ? document.body.scrollHeight 
            : this.scrollContainer.scrollHeight;

        if (scrollHeight - scrollPosition <= this.threshold) {
            this.loadMore();
        }
    }

    loadMore() {
        if (this.isLoading || !this.hasMore) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        this.showLoader();
        this.onLoadMore(this.currentPage, (hasMore) => {
            this.hideLoader();
            this.hasMore = hasMore;
            this.isLoading = false;
        });
    }

    showLoader() {
        // Create loader if it doesn't exist
        if (!document.getElementById('infinite-scroll-loader')) {
            const loader = document.createElement('div');
            loader.id = 'infinite-scroll-loader';
            loader.className = 'text-center py-4';
            loader.innerHTML = `
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p class="text-gray-500 mt-2">Loading more...</p>
            `;
            this.container.appendChild(loader);
        }
    }

    hideLoader() {
        const loader = document.getElementById('infinite-scroll-loader');
        if (loader) {
            loader.remove();
        }
    }

    reset() {
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;
    }

    destroy() {
        if (this.scrollContainer) {
            this.scrollContainer.removeEventListener('scroll', this.scrollListener);
        }
    }
}

// Tab-based lazy loading
class LazyTabs {
    constructor(options = {}) {
        this.tabsSelector = options.tabsSelector || '.lazy-tab';
        this.contentSelector = options.contentSelector || '.lazy-tab-content';
        this.onTabChange = options.onTabChange || (() => {});
        this.activeTab = null;
        
        this.init();
    }
    
    init() {
        const tabs = document.querySelectorAll(this.tabsSelector);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.activateTab(tab);
            });
        });
        
        // Activate first tab by default
        if (tabs.length > 0 && !this.activeTab) {
            // Check if any tab has data-active="true"
            const activeTab = Array.from(tabs).find(tab => tab.getAttribute('data-active') === 'true');
            this.activateTab(activeTab || tabs[0]);
        }
    }
    
    activateTab(tab) {
        // Skip if already active
        if (this.activeTab === tab) return;
        
        const targetId = tab.getAttribute('data-tab-id');
        const allTabs = document.querySelectorAll(this.tabsSelector);
        const allContents = document.querySelectorAll(this.contentSelector);
        
        // Hide all content sections
        allContents.forEach(content => {
            content.classList.add('hidden');
        });
        
        // Deactivate all tabs
        allTabs.forEach(t => {
            t.setAttribute('data-active', 'false');
        });
        
        // Activate current tab
        tab.setAttribute('data-active', 'true');
        
        // Show current content
        const content = document.getElementById(targetId);
        if (content) {
            content.classList.remove('hidden');
            
            // Call the callback with the new active tab
            this.activeTab = tab;
            this.onTabChange(targetId, tab);
        }
    }
}

// Lazy image loading
function setupLazyImages() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('img.lazy-load');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
        });
    }
} 