function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return currentUser;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function saveTransaction(transactionData) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transactionData);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    saveTrackingData(transactionData);
}

function saveTrackingData(transactionData) {
    let trackingData = JSON.parse(localStorage.getItem('trackingData')) || {};
    
    const statusOptions = ['Diproses', 'Dikemas', 'Dikirim', 'Dalam Perjalanan', 'Selesai'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    trackingData[transactionData.orderNumber] = {
        nomorDO: transactionData.orderNumber,
        nama: transactionData.customerInfo.nama,
        status: randomStatus,
        ekspedisi: ['JNE', 'Pos Indonesia', 'Tiki', 'J&T'][Math.floor(Math.random() * 4)],
        tanggalKirim: new Date().toISOString().split('T')[0],
        paket: ['REG', 'YES', 'ONS'][Math.floor(Math.random() * 3)],
        total: transactionData.totalAmount,
        perjalanan: generateTrackingSteps(randomStatus)
    };
    
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
}

function generateTrackingSteps(status) {
    const baseSteps = [
        {
            waktu: new Date().toISOString().replace('T', ' ').substring(0, 19),
            keterangan: "Pesanan diterima dan sedang diproses"
        }
    ];
    
    if (status === 'Dikemas' || status === 'Dikirim' || status === 'Dalam Perjalanan' || status === 'Selesai') {
        baseSteps.push({
            waktu: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            keterangan: "Pesanan sedang dikemas"
        });
    }
    
    if (status === 'Dikirim' || status === 'Dalam Perjalanan' || status === 'Selesai') {
        baseSteps.push({
            waktu: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            keterangan: "Pesanan telah dikirim"
        });
    }
    
    if (status === 'Dalam Perjalanan' || status === 'Selesai') {
        baseSteps.push({
            waktu: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            keterangan: "Pesanan dalam perjalanan ke alamat tujuan"
        });
    }
    
    if (status === 'Selesai') {
        baseSteps.push({
            waktu: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            keterangan: "Pesanan telah sampai dan diterima"
        });
    }
    
    return baseSteps;
}

function getTrackingData(orderNumber) {
    const localTrackingData = JSON.parse(localStorage.getItem('trackingData')) || {};
    if (localTrackingData[orderNumber]) {
        return localTrackingData[orderNumber];
    }
    
    return dataTracking[orderNumber];
}