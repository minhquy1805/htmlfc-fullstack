const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentDate = new Date();

    // Lịch thi đấu mẫu
    const matches = {
        "2025-02-05": { team1: "Team A", team2: "Team B", time: "15:00", venue: "Stadium 1" },
        "2025-02-12": { team1: "Team C", team2: "Team D", time: "18:00", venue: "Stadium 2" },
        "2025-02-20": { team1: "Team E", team2: "Team F", time: "20:00", venue: "Stadium 3" },
    };

    function renderCalendar(date) {
        let year = date.getFullYear();
        let month = date.getMonth();
        
        document.getElementById('calendar-title').textContent = `${monthNames[month]} ${year}`;
        
        let firstDay = new Date(year, month, 1);
        let lastDay = new Date(year, month + 1, 0);
        
        let days = [];
        let startDay = firstDay.getDay();
        let totalDays = lastDay.getDate();
        
        // Fill the days array with empty cells for the first week
        for (let i = 0; i < startDay; i++) {
            days.push("");
        }
        
        // Fill the days array with the actual days of the month
        for (let i = 1; i <= totalDays; i++) {
            days.push(i);
        }
        
        // Create the calendar grid
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = "";
        
        let dayIndex = 0;
        for (let i = 0; i < 5; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            
            for (let j = 0; j < 7; j++) {
                let day = days[dayIndex];
                let cell = document.createElement('div');
                cell.classList.add('col', 'day');
                
                if (day === "") {
                    cell.classList.add('empty');
                } else {
                    cell.textContent = day;
                    // Format the date to YYYY-MM-DD
                    let formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    
                    // Check if there's a match on that day and add the match-day class
                    if (matches[formattedDate]) {
                        cell.classList.add('match-day');
                        let matchIcon = document.createElement('i');
                        matchIcon.classList.add('fas', 'fa-futbol', 'match-icon');
                        cell.appendChild(matchIcon);
                    }

                    cell.onclick = () => selectDay(cell, day, year, month);
                }
                row.appendChild(cell);
                dayIndex++;
            }
            
            calendarDays.appendChild(row);
            
            if (dayIndex >= days.length) break;
        }
    }

    function selectDay(cell, day, year, month) {
        let selectedDay = document.querySelector('.selected-day');
        if (selectedDay) {
            selectedDay.classList.remove('selected-day');
        }
        cell.classList.add('selected-day');
        
        // Format the date to YYYY-MM-DD
        let selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if there's a match on that day
        if (matches[selectedDate]) {
            displayMatchInfo(matches[selectedDate]);
        } else {
            document.getElementById('match-info').style.display = 'none';
        }
    }

    function displayMatchInfo(match) {
        document.getElementById('match-info').style.display = 'block';
        document.getElementById('match-details').innerHTML = `
            <strong>${match.team1} vs ${match.team2}</strong><br>
            Time: ${match.time}<br>
            Venue: ${match.venue}
        `;
    }

    document.getElementById('prev').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
    
    document.getElementById('next').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);