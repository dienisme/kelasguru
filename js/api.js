// API functions for communicating with Google Apps Script backend
// Following CORS bypass technique rules

// Replace with your deployed Google Apps Script web app URL
const API_URL = 'https://script.google.com/macros/s/AKfycbw7BKkbpzGW6MN0kPusBnmb0suUmfLWPTs3r1cBHU9n3UGKJ3RKU8b0tNPTlTcp59wyWg/exec';

// Generic API function for making requests to the GAS backend
async function callApi(action, params = {}) {
    try {
        // Combine action with other parameters
        const data = {
            action,
            ...params
        };
        
        // Create URLSearchParams object (produces application/x-www-form-urlencoded format)
        const formData = new URLSearchParams(data);
        
        // Make fetch request following the CORS rules
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
            // Note: No custom headers to avoid preflight
            // Don't set mode: 'no-cors' as it prevents access to the response
        });
        
        // Parse the JSON response
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        // If fetch fails, try the JSONP approach as fallback
        return await fetchDataWithJSONP(action, params);
    }
}

// Fallback method using JSONP-like approach for CORS issues
async function fetchDataWithJSONP(action, params = {}) {
    return new Promise((resolve) => {
        // Create a unique callback name
        const callbackName = 'jsonpCallback_' + Date.now();
        
        // Create the full URL with callback parameter
        let url = `${API_URL}?action=${action}&callback=${callbackName}`;
        
        // Add other params to URL
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                url += `&${key}=${encodeURIComponent(typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key])}`;
            }
        }
        
        // Define the callback function
        window[callbackName] = function(data) {
            // Clean up by removing the script tag and deleting the callback
            document.body.removeChild(script);
            delete window[callbackName];
            
            // Resolve the promise with the data
            resolve(data);
        };
        
        // Create script element
        const script = document.createElement('script');
        script.src = url;
        script.onerror = function() {
            // Clean up
            document.body.removeChild(script);
            delete window[callbackName];
            
            // Resolve with error
            resolve({ 
                success: false, 
                error: 'Failed to load data via JSONP' 
            });
        };
        
        // Add script to document to initiate request
        document.body.appendChild(script);
    });
}

// === Authentication API ===
async function login(username, password) {
    return callApi('login', { username, password });
}

// === Generic CRUD Operations ===
async function getAllData(entityType) {
    return callApi('get' + entityType);
}

async function getDataById(entityType, id) {
    return callApi('get' + entityType, { id });
}

async function createData(entityType, data) {
    return callApi('create' + entityType, data);
}

async function updateData(entityType, id, data) {
    return callApi('update' + entityType, { id, ...data });
}

async function deleteData(entityType, id) {
    return callApi('delete' + entityType, { id });
}

// === Paginated Data Operations ===
async function getPaginatedData(entityType, page = 1, pageSize = 10, filters = {}) {
    return callApi('get' + entityType, { 
        page, 
        pageSize, 
        ...filters,
        paginated: true
    });
}

// === Kelas (Class) API ===
async function getKelas(id) {
    return id ? getDataById('Kelas', id) : getAllData('Kelas');
}

async function getPaginatedKelas(page = 1, pageSize = 10, filters = {}) {
    return callApi('getKelas', { 
        page, 
        pageSize, 
        ...filters,
        paginated: true
    });
}

async function createKelas(kelasData) {
    return createData('Kelas', kelasData);
}

async function updateKelas(id, kelasData) {
    return updateData('Kelas', id, kelasData);
}

async function deleteKelas(id) {
    return deleteData('Kelas', id);
}

// === Siswa (Student) API ===
async function getSiswa(id, kelas_id) {
    const params = {};
    if (id) params.id = id;
    if (kelas_id) params.kelas_id = kelas_id;
    return callApi('getSiswa', params);
}

async function getPaginatedSiswa(page = 1, pageSize = 10, filters = {}) {
    return getPaginatedData('Siswa', page, pageSize, filters);
}

async function createSiswa(siswaData) {
    return createData('Siswa', siswaData);
}

async function updateSiswa(id, siswaData) {
    return updateData('Siswa', id, siswaData);
}

async function deleteSiswa(id) {
    return deleteData('Siswa', id);
}

// === Tugas (Assignment) API ===
async function getTugas(id, kelas_id) {
    const params = {};
    if (id) params.id = id;
    if (kelas_id) params.kelas_id = kelas_id;
    return callApi('getTugas', params);
}

async function getPaginatedTugas(page = 1, pageSize = 10, filters = {}) {
    return getPaginatedData('Tugas', page, pageSize, filters);
}

async function createTugas(tugasData) {
    return createData('Tugas', tugasData);
}

async function updateTugas(id, tugasData) {
    return updateData('Tugas', id, tugasData);
}

async function deleteTugas(id) {
    return deleteData('Tugas', id);
}

// === Nilai (Grade) API ===
async function getNilai(id, siswa_id, tugas_id) {
    const params = {};
    if (id) params.id = id;
    if (siswa_id) params.siswa_id = siswa_id;
    if (tugas_id) params.tugas_id = tugas_id;
    return callApi('getNilai', params);
}

async function getPaginatedNilai(page = 1, pageSize = 10, filters = {}) {
    return getPaginatedData('Nilai', page, pageSize, filters);
}

async function createNilai(nilaiData) {
    return createData('Nilai', nilaiData);
}

async function updateNilai(id, nilaiData) {
    return updateData('Nilai', id, nilaiData);
}

async function deleteNilai(id) {
    return deleteData('Nilai', id);
}

// === Presensi (Attendance) API ===
async function getPresensi(id, kelas_id, tanggal) {
    const params = {};
    if (id) params.id = id;
    if (kelas_id) params.kelas_id = kelas_id;
    if (tanggal) params.tanggal = tanggal;
    return callApi('getPresensi', params);
}

async function getPaginatedPresensi(page = 1, pageSize = 10, filters = {}) {
    return getPaginatedData('Presensi', page, pageSize, filters);
}

async function createPresensi(presensiData) {
    return createData('Presensi', presensiData);
}

async function updatePresensi(id, presensiData) {
    return updateData('Presensi', id, presensiData);
}

async function deletePresensi(id) {
    return deleteData('Presensi', id);
}

// === Event API ===
async function getEvent(id) {
    return id ? getDataById('Event', id) : getAllData('Event');
}

async function getPaginatedEvent(page = 1, pageSize = 10, filters = {}) {
    return getPaginatedData('Event', page, pageSize, filters);
}

async function createEvent(eventData) {
    return createData('Event', eventData);
}

async function updateEvent(id, eventData) {
    return updateData('Event', id, eventData);
}

async function deleteEvent(id) {
    return deleteData('Event', id);
}

// === Jurnal Pembelajaran (Learning Journal) API ===
async function getJurnal(id, kelas_id) {
    const params = {};
    if (id) params.id = id;
    if (kelas_id) params.kelas_id = kelas_id;
    return callApi('getJurnal', params);
}

async function getPaginatedJurnal(page = 1, pageSize = 10, filters = {}) {
    return getPaginatedData('Jurnal', page, pageSize, filters);
}

async function createJurnal(jurnalData) {
    return createData('Jurnal', jurnalData);
}

async function updateJurnal(id, jurnalData) {
    return updateData('Jurnal', id, jurnalData);
}

async function deleteJurnal(id) {
    return deleteData('Jurnal', id);
}

// === Bank Soal (Question Bank) API ===
async function getBankSoal(id, kategori) {
    const params = {};
    if (id) params.id = id;
    if (kategori) params.kategori = kategori;
    return callApi('getBankSoal', params);
}

async function getPaginatedBankSoal(page = 1, pageSize = 10, filters = {}) {
    return getPaginatedData('BankSoal', page, pageSize, filters);
}

async function createBankSoal(soalData) {
    return createData('BankSoal', soalData);
}

async function updateBankSoal(id, soalData) {
    return updateData('BankSoal', id, soalData);
}

async function deleteBankSoal(id) {
    return deleteData('BankSoal', id);
} 