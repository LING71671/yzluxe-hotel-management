 const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dayPrefixes = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

         window.onload = function() {
            loadEmployees();
            const today = new Date();
            const weekStart = getWeekStart(today);
            document.getElementById('scheduleDate').value = weekStart;
            updatePreview();
        };

        function getWeekStart(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d.setDate(diff));
            return monday.toISOString().split('T')[0];
        }

        function loadEmployees() {
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const select = document.getElementById('employeeSelect');
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name + ' - ' + emp.department;
                select.appendChild(option);
            });
        }

        function saveSchedule() {
            const employeeName = document.getElementById('employeeSelect').value;
            const scheduleDate = document.getElementById('scheduleDate').value;

            if (!employeeName) {
                alert('Please select an employee!');
                return;
            }
            if (!scheduleDate) {
                alert('Please select a schedule date!');
                return;
            }

            const scheduleData = {
                employeeName: employeeName,
                weekStart: scheduleDate,
                type: document.querySelector('input[name="scheduleType"]:checked').value,
                days: {}
            };

            dayPrefixes.forEach((prefix, index) => {
                const dayType = document.getElementById(prefix + '-type').value;
                scheduleData.days[dayNames[index]] = {
                    start: dayType === 'work' ? document.getElementById(prefix + '-start').value : 'OFF',
                    end: dayType === 'work' ? document.getElementById(prefix + '-end').value : 'OFF',
                    type: dayType
                };
            });

            let schedules = JSON.parse(localStorage.getItem('schedules') || '[]');

            const existingIndex = schedules.findIndex(s =>
                s.employeeName === employeeName && s.weekStart === scheduleDate
            );

            if (existingIndex !== -1) {
                schedules[existingIndex] = scheduleData;
            } else {
                schedules.push(scheduleData);
            }

            localStorage.setItem('schedules', JSON.stringify(schedules));
            alert('Schedule saved successfully!');
            updatePreview();
        }

        function loadExistingSchedule() {
            const employeeName = document.getElementById('employeeSelect').value;
            const scheduleDate = document.getElementById('scheduleDate').value;

            if (!employeeName || !scheduleDate) {
                alert('Please select an employee and date!');
                return;
            }

            const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
            const schedule = schedules.find(s =>
                s.employeeName === employeeName && s.weekStart === scheduleDate
            );

            if (schedule) {
                dayPrefixes.forEach((prefix, index) => {
                    const dayData = schedule.days[dayNames[index]];
                    if (dayData) {
                        document.getElementById(prefix + '-type').value = dayData.type;
                        if (dayData.type === 'work') {
                            document.getElementById(prefix + '-start').value = dayData.start;
                            document.getElementById(prefix + '-end').value = dayData.end;
                        }
                    }
                });
                alert('Schedule loaded!');
            } else {
                alert('No existing schedule found for this employee and date.');
            }
        }

        function updatePreview() {
            const tbody = document.querySelector('#schedulePreview tbody');
            tbody.innerHTML = '';

            dayPrefixes.forEach((prefix, index) => {
                const dayType = document.getElementById(prefix + '-type').value;
                const row = document.createElement('tr');

                row.innerHTML =
                    '<td>' + dayNames[index] + '</td>' +
                    '<td>' + (dayType === 'work' ? document.getElementById(prefix + '-start').value : 'OFF') + '</td>' +
                    '<td>' + (dayType === 'work' ? document.getElementById(prefix + '-end').value : 'OFF') + '</td>' +
                    '<td>' + (dayType === 'work' ? 'Work' : 'Day Off') + '</td>';

                tbody.appendChild(row);
            });
        }