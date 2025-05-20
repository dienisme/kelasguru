// Student API Integration for Teacher Administration Dashboard
// Following CORS bypass rules from rules CORS.txt

// API base URL - replace with your deployed GAS Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbw7BKkbpzGW6MN0kPusBnmb0suUmfLWPTs3r1cBHU9n3UGKJ3RKU8b0tNPTlTcp59wyWg/exec';

// Helper function to make API calls while following CORS rules
async function callStudentApi(action, params = {}) {
  try {
    // Combine action with other parameters
    const data = { action, ...params };
    
    // Use URLSearchParams for CORS compatibility
    const formData = new URLSearchParams(data);
    
    console.log('Student API calling:', action, 'with params:', params);
    console.log('Student FormData:', Array.from(formData.entries()));
    
    // Simple fetch with POST method and URLSearchParams (no custom headers)
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Student API Response:', result);
    return result;
  } catch (error) {
    console.error('API call error:', error);
    return { success: false, error: error.message || 'An error occurred while communicating with the server' };
  }
}

// Student login - make sure to use the exact same action name as in code.gs
async function studentLogin(nis, password) {
  // Test the debugSiswaData action first to see if that works
  try {
    console.log("Testing debugSiswaData action first...");
    const debugResult = await callStudentApi('debugSiswaData', {});
    console.log("Debug action result:", debugResult);
    
    // Now try the actual student login
    return callStudentApi('studentLogin', { nis, password });
  } catch (error) {
    console.error("Error in test action:", error);
    return { success: false, error: "API connection test failed: " + error.message };
  }
}

// Get student grades
async function getSiswaNilai(siswa_id) {
  return callStudentApi('getSiswaNilai', { siswa_id });
}

// Cache for badge data
const cache = {
  badges: null,
  lastFetched: 0,
  cacheLifetime: 60000 // 1 minute cache lifetime
};

// Get student gamification data
async function getSiswaGamification(siswa_id) {
  try {
    // Initialize API calls in parallel
    const gamificationPromise = callStudentApi('getSiswaGamification', { siswa_id });
    
    // Start badge data fetch in parallel - check cache first
    let badgesPromise;
    const now = Date.now();
    if (!cache.badges || (now - cache.lastFetched) > cache.cacheLifetime) {
      // Cache expired or doesn't exist - fetch new data
      badgesPromise = callApi('getGamifikasiBadge').then(response => {
        if (response.success) {
          cache.badges = response.data;
          cache.lastFetched = now;
        }
        return response;
      });
    } else {
      // Use cached data
      badgesPromise = Promise.resolve({ success: true, data: cache.badges });
    }
    
    // Also fetch student badges in parallel
    const studentBadgesPromise = callApi('getSiswaBadge');
    
    // Wait for the basic gamification data
    const gamificationData = await gamificationPromise;
    
    if (!gamificationData.success) {
      return gamificationData; // Return error if basic data fetch failed
    }
    
    // Calculate level properly based on XP - ensure consistency
    if (gamificationData.data && typeof gamificationData.data.xp !== 'undefined') {
      const xp = gamificationData.data.xp;
      // Use the same calculation as in calculateLevel function
      let level = 1;
      if (xp >= 1500) level = 5;
      else if (xp >= 700) level = 4;
      else if (xp >= 300) level = 3;
      else if (xp >= 100) level = 2;
      
      // Override any level from API to ensure consistency
      gamificationData.data.level = level;
    }
    
    // Initialize badges as empty array
    gamificationData.data.badges = [];
    
    // Wait for both badge data and student badges with a timeout
    const results = await Promise.all([
      badgesPromise,
      studentBadgesPromise
    ]);
    
    const [badgesResponse, studentBadgesResponse] = results;
    
    // If both succeeded, process badge data
    if (badgesResponse.success && studentBadgesResponse.success) {
      const allBadges = badgesResponse.data || [];
      const studentBadgeAssignments = (studentBadgesResponse.data || [])
        .filter(badge => badge.siswa_id === siswa_id);
      
      if (studentBadgeAssignments.length > 0 && allBadges.length > 0) {
        // Create a map for faster badge lookups
        const badgeMap = {};
        allBadges.forEach(badge => {
          badgeMap[badge.id] = badge;
        });
        
        // Map student badges to full badge data in one pass
        const badges = studentBadgeAssignments
          .map(assignment => {
            const badgeDetails = badgeMap[assignment.badge_id];
            if (badgeDetails) {
              return {
                id: assignment.id,
                nama_badge: badgeDetails.nama_badge,
                deskripsi: badgeDetails.deskripsi,
                icon_url: badgeDetails.icon_url,
                xp_reward: badgeDetails.xp_reward,
                tanggal_perolehan: assignment.tanggal_perolehan
              };
            }
            return null;
          })
          .filter(badge => badge !== null);
        
        // Add badges to gamification data
        gamificationData.data.badges = badges;
      }
    }
    
    return gamificationData;
  } catch (error) {
    console.error('Error getting student gamification data:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred while getting gamification data',
      data: null
    };
  }
}

// Get leaderboard data of all students
async function getSiswaLeaderboard() {
  // Use the existing getGamifikasiXP endpoint from teacher API instead
  try {
    const response = await callApi('getGamifikasiXP');
    if (!response.success) {
      return { success: false, error: response.error || 'Failed to fetch leaderboard data' };
    }
    
    const xpData = response.data || [];
    
    // Process XP data to create leaderboard data
    const studentSummary = {};
    
    // Aggregate XP points by student
    xpData.forEach(xp => {
      const studentId = xp.siswa_id;
      if (!studentSummary[studentId]) {
        studentSummary[studentId] = {
          id: studentId,
          xp: 0,
          level: 1
        };
      }
      
      // Add XP
      studentSummary[studentId].xp += parseInt(xp.jumlah_xp || 0, 10);
    });
    
    // Fetch student information to add names and classes
    const studentResponse = await callApi('getSiswa');
    if (studentResponse.success && Array.isArray(studentResponse.data)) {
      const students = studentResponse.data;
      
      // Add student names to the summary
      for (const studentId in studentSummary) {
        const student = students.find(s => s.id === studentId);
        if (student) {
          studentSummary[studentId].nama = student.nama;
          studentSummary[studentId].kelas_id = student.kelas_id;
        }
      }
      
      // Fetch class information to add class names
      const classResponse = await callApi('getKelas');
      if (classResponse.success && Array.isArray(classResponse.data)) {
        const classes = classResponse.data;
        const classMap = {};
        
        // Create a map of class IDs to class names
        classes.forEach(cls => {
          classMap[cls.id] = cls.nama_kelas || cls.nama || `Kelas ${cls.id}`;
        });
        
        // Add class names to the summary
        for (const studentId in studentSummary) {
          const classId = studentSummary[studentId].kelas_id;
          if (classId && classMap[classId]) {
            studentSummary[studentId].kelas_nama = classMap[classId];
          } else {
            studentSummary[studentId].kelas_nama = 'Tanpa Kelas';
          }
          
          // Calculate level based on XP
          const xp = studentSummary[studentId].xp;
          let level = 1;
          if (xp >= 1500) level = 5;
          else if (xp >= 700) level = 4;
          else if (xp >= 300) level = 3;
          else if (xp >= 100) level = 2;
          
          studentSummary[studentId].level = level;
        }
      }
    }
    
    // Convert summary object to array
    const leaderboardData = Object.values(studentSummary);
    
    return { success: true, data: leaderboardData };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { success: false, error: error.message || 'An error occurred while getting leaderboard data' };
  }
}

// Check if a student is logged in
function checkStudentLogin() {
  const studentData = localStorage.getItem('kelasguru_siswa');
  if (!studentData) {
    // Redirect to student login page if not logged in
    window.location.href = 'siswa-login.html';
    return null;
  }
  
  try {
    return JSON.parse(studentData);
  } catch (e) {
    // If data is corrupted, clear it and redirect
    localStorage.removeItem('kelasguru_siswa');
    window.location.href = 'siswa-login.html';
    return null;
  }
}

// Logout student
function logoutStudent() {
  localStorage.removeItem('kelasguru_siswa');
  window.location.href = 'siswa-login.html';
}

// API functions for Students page
const API_URL_OLD = 'https://script.google.com/macros/s/AKfycbxZVwdUIupr3e3ljw-lVaZMeNuEk7rV9GOYFxshyUaJKmi3TKCsGL6B5EaLSNeJtsmIzg/exec';

// Direct API call function
async function callApi(action, params = {}) {
    try {
        const formData = new URLSearchParams();
        formData.append('action', action);
        
        // Add other params
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                formData.append(key, String(params[key])); // Ensure all values are strings
            }
        }
        
        console.log('Calling API:', action, 'with params:', params);
        console.log('FormData:', Array.from(formData.entries()));
        
        // Make fetch request
        const response = await fetch(API_URL_OLD, {
            method: 'POST',
            body: formData
        });
        
        // Parse response
        const result = await response.json();
        console.log('API Response:', result);
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

// Student functions
async function getSiswa(id, kelas_id) {
    const params = {};
    if (id) params.id = id;
    if (kelas_id) params.kelas_id = kelas_id;
    return callApi('getSiswa', params);
}

async function createSiswa(siswaData) {
    return callApi('createSiswa', siswaData);
}

async function updateSiswa(id, siswaData) {
    // Ensure both id formats are included
    const params = { 
        ...siswaData,
        id: String(id),
        siswa_id: String(id)
    };
    return callApi('updateSiswa', params);
}

async function deleteSiswa(id) {
    // Try both parameter names to ensure compatibility with backend
    return callApi('deleteSiswa', { 
        id: String(id),
        siswa_id: String(id) 
    });
}

// Class function
async function getKelas(id) {
    const params = {};
    if (id) params.id = id;
    return callApi('getKelas', params);
}

// Function to fetch class options for dropdowns
async function fetchClassOptions() {
    try {
        // Get all classes from API
        const response = await getKelas();
        
        if (response.success && Array.isArray(response.data)) {
            // Return the classes data
            return response.data;
        } else {
            console.error('Error fetching classes:', response.error || 'Unknown error');
            return [];
        }
    } catch (error) {
        console.error('Exception fetching classes:', error);
        return [];
    }
}

// Paginated student data retrieval
async function getPaginatedSiswa(page = 1, pageSize = 20, filters = {}) {
    return callApi('getSiswa', { 
        page, 
        pageSize, 
        ...filters,
        paginated: true
    });
} 