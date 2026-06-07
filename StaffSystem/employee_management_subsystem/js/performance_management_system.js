 function navigateToSection(sectionId) {
        showSection(sectionId);
    }

     function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        document.querySelectorAll('.menu li').forEach(li => {
            li.classList.remove('active');
        });
        const activeMenu = document.querySelector(`.menu li[data-section="${sectionId}"]`);
        if (activeMenu) {
            activeMenu.classList.add('active');
        }

     if (sectionId === 'viewReviews') {
            loadReviews();
            loadFilterOptions();
        } else if (sectionId === 'analytics') {
            loadAnalytics();
        } else if (sectionId === 'feedback') {
            loadEmployees();
        }
     }

    document.querySelectorAll('.rating-stars').forEach(container => {
        const fieldName = container.dataset.rating;
        const stars = container.querySelectorAll('.star');
        const hiddenInput = document.getElementById(fieldName);

        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = this.dataset.value;
                hiddenInput.value = value;
                stars.forEach(s => {
                    s.classList.remove('active');
                    if (s.dataset.value <= value) {
                        s.classList.add('active');
                    }
                });
            });

            star.addEventListener('mouseenter', function() {
                const value = this.dataset.value;
                stars.forEach(s => {
                    s.style.color = s.dataset.value <= value ? '#ffc107' : '#ddd';
                });
            });
        });

        container.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                const currentValue = hiddenInput.value || 0;
                s.style.color = s.dataset.value <= currentValue ? '#ffc107' : '#ddd';
            });
        });
    });

    function loadEmployees() {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const selects = ['employeeSelect', 'reviewEmployee', 'feedbackEmployee'];

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Employee</option>';
                employees.forEach(emp => {
                    const option = document.createElement('option');
                    option.value = emp.name;
                    option.textContent = `${emp.name} - ${emp.department || 'N/A'} (${emp.position || 'N/A'})`;
                    select.appendChild(option);
                });
            }
        });
    }

    document.getElementById('kpiForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            id: Date.now(),
            employeeName: document.getElementById('employeeSelect').value,
            reviewPeriod: document.getElementById('reviewPeriod').value,
            kpis: {
                customerSatisfaction: { weight: parseInt(document.getElementById('kpi1_weight').value) },
                revenueGeneration: { weight: parseInt(document.getElementById('kpi2_weight').value) },
                serviceQuality: { weight: parseInt(document.getElementById('kpi3_weight').value) },
                teamCollaboration: { weight: parseInt(document.getElementById('kpi4_weight').value) },
                professionalDevelopment: { weight: parseInt(document.getElementById('kpi5_weight').value) }
            },
            okrs: {
                objective1: document.getElementById('objective1').value,
                kr1_1: document.getElementById('kr1_1').value,
                kr1_2: document.getElementById('kr1_2').value,
                objective2: document.getElementById('objective2').value,
                kr2_1: document.getElementById('kr2_1').value,
                kr2_2: document.getElementById('kr2_2').value
            },
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        let kpis = JSON.parse(localStorage.getItem('performanceKPIs') || '[]');
        kpis.push(formData);
        localStorage.setItem('performanceKPIs', JSON.stringify(kpis));

        alert('Performance indicators saved successfully!');
        this.reset();
    });

    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const kpi1 = parseInt(document.getElementById('kpi1_rating').value) || 0;
        const kpi2 = parseInt(document.getElementById('kpi2_rating').value) || 0;
        const kpi3 = parseInt(document.getElementById('kpi3_rating').value) || 0;
        const kpi4 = parseInt(document.getElementById('kpi4_rating').value) || 0;
        const kpi5 = parseInt(document.getElementById('kpi5_rating').value) || 0;

        if (kpi1 === 0 || kpi2 === 0 || kpi3 === 0 || kpi4 === 0 || kpi5 === 0) {
            alert('Please rate all KPI categories before submitting!');
            return;
        }

        const formData = {
            id: Date.now(),
            employeeName: document.getElementById('reviewEmployee').value,
            reviewPeriod: document.getElementById('reviewPeriodSelect').value,
            evaluationType: document.getElementById('evaluationType').value,
            reviewerName: document.getElementById('reviewerName').value,
            reviewerRole: document.getElementById('reviewerRole').value,
            kpiRatings: {
                customerSatisfaction: kpi1,
                revenueGeneration: kpi2,
                serviceQuality: kpi3,
                teamCollaboration: kpi4,
                professionalDevelopment: kpi5
            },
            okrAchievement: {
                objective1: parseInt(document.getElementById('obj1_achievement').value) || 0,
                objective2: parseInt(document.getElementById('obj2_achievement').value) || 0
            },
            strengths: document.getElementById('strengths').value,
            areasForImprovement: document.getElementById('areasForImprovement').value,
            developmentPlan: document.getElementById('developmentPlan').value,
            overallComments: document.getElementById('overallComments').value,
            overallScore: ((kpi1 + kpi2 + kpi3 + kpi4 + kpi5) / 5).toFixed(1),
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        let reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
        reviews.push(formData);
        localStorage.setItem('performanceReviews', JSON.stringify(reviews));

        alert('Performance review submitted successfully!');
        this.reset();
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
            star.style.color = '#ddd';
        });
    });

    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
        const tbody = document.getElementById('reviewsList');
        tbody.innerHTML = '';

        reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        reviews.forEach(review => {
            const row = document.createElement('tr');
            const score = parseFloat(review.overallScore);
            const badgeClass = score >= 4.5 ? 'badge-excellent' : score >= 3.5 ? 'badge-good' : score >= 2.5 ? 'badge-average' : 'badge-poor';
            const typeClass = review.evaluationType === 'Self' ? 'type-self' : review.evaluationType === 'Peer' ? 'type-peer' : 'type-manager';
             row.innerHTML = `                <td>${review.employeeName}</td>
                <td>${review.reviewPeriod}</td>
                <td><span class="evaluation-type-badge ${typeClass}">${review.evaluationType}</span></td>
                <td>${review.reviewerName}</td>
                <td><span class="badge ${badgeClass}">${review.overallScore} ★</span></td>
                <td>${review.date}</td>
                <td>
                    <button class="nav-btn" onclick="viewReviewDetail(${review.id})">View Details</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadFilterOptions() {
        const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
        const employees = [...new Set(reviews.map(r => r.employeeName))];
        const periods = [...new Set(reviews.map(r => r.reviewPeriod))];

        const empFilter = document.getElementById('filterEmployee');
        empFilter.innerHTML = '<option value="">All Employees</option>';
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp;
            option.textContent = emp;
            empFilter.appendChild(option);
        });

        const periodFilter = document.getElementById('filterPeriod');
        periodFilter.innerHTML = '<option value="">All Periods</option>';
        periods.forEach(period => {
            const option = document.createElement('option');
            option.value = period;
            option.textContent = period;
            periodFilter.appendChild(option);
        });

        empFilter.onchange = filterReviews;
        periodFilter.onchange = filterReviews;
        document.getElementById('filterType').onchange = filterReviews;
    }

    function filterReviews() {
        const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
        const employeeFilter = document.getElementById('filterEmployee').value;
        const periodFilter = document.getElementById('filterPeriod').value;
        const typeFilter = document.getElementById('filterType').value;

        const filtered = reviews.filter(review => {
            return (!employeeFilter || review.employeeName === employeeFilter) &&
                   (!periodFilter || review.reviewPeriod === periodFilter) &&
                   (!typeFilter || review.evaluationType === typeFilter);
        });

        const tbody = document.getElementById('reviewsList');
        tbody.innerHTML = '';

        filtered.forEach(review => {
            const row = document.createElement('tr');
            const score = parseFloat(review.overallScore);
            const badgeClass = score >= 4.5 ? 'badge-excellent' : score >= 3.5 ? 'badge-good' : score >= 2.5 ? 'badge-average' : 'badge-poor';
            const typeClass = review.evaluationType === 'Self' ? 'type-self' : review.evaluationType === 'Peer' ? 'type-peer' : 'type-manager';
             row.innerHTML = `                <td>${review.employeeName}</td>
                <td>${review.reviewPeriod}</td>
                <td><span class="evaluation-type-badge ${typeClass}">${review.evaluationType}</span></td>
                <td>${review.reviewerName}</td>
                <td><span class="badge ${badgeClass}">${review.overallScore} ★</span></td>
                <td>${review.date}</td>
                <td>
                    <button class="nav-btn" onclick="viewReviewDetail(${review.id})">View Details</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function viewReviewDetail(id) {
        const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
        const review = reviews.find(r => r.id === id);

        if (!review) return;

        const detail = `Employee: ${review.employeeName}Period: ${review.reviewPeriod}Type: ${review.evaluationType} Evaluation
Reviewer: ${review.reviewerName} (${review.reviewerRole})
Date: ${review.date}
=== KPI Ratings ===
Customer Satisfaction: ${review.kpiRatings.customerSatisfaction}/5 ★
Revenue Generation: ${review.kpiRatings.revenueGeneration}/5 ★
Service Quality: ${review.kpiRatings.serviceQuality}/5 ★
Team Collaboration: ${review.kpiRatings.teamCollaboration}/5 ★
Professional Development: ${review.kpiRatings.professionalDevelopment}/5 ★

=== OKR Achievement ===
Objective 1: ${review.okrAchievement.objective1}%
Objective 2: ${review.okrAchievement.objective2}%

Overall Score: ${review.overallScore}/5.0 ★

=== Strengths & Achievements ===${review.strengths || 'N/A'}
=== Areas for Improvement ===${review.areasForImprovement || 'N/A'}
=== Development Plan ===${review.developmentPlan || 'N/A'}
=== Overall Comments ===${review.overallComments || 'N/A'}        `;

        alert(detail);
    }

    function generateFeedback() {
        const employeeName = document.getElementById('feedbackEmployee').value;
        const period = document.getElementById('feedbackPeriod').value;

        if (!employeeName || !period) {
            alert('Please select employee and review period!');
            return;
        }

        const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
        const employeeReviews = reviews.filter(r => r.employeeName === employeeName && r.reviewPeriod === period);

        if (employeeReviews.length === 0) {
            document.getElementById('feedbackContent').innerHTML = '<p style="color: #666;">No reviews found for this employee in the selected period.</p>';
            return;
        }

        const avgScore = (employeeReviews.reduce((sum, r) => sum + parseFloat(r.overallScore), 0) / employeeReviews.length).toFixed(1);
        const selfReview = employeeReviews.find(r => r.evaluationType === 'Self');
        const peerReviews = employeeReviews.filter(r => r.evaluationType === 'Peer');
        const managerReview = employeeReviews.find(r => r.evaluationType === 'Manager');

        let html = `            <div class="feedback-card">
                <h4>📊 Performance Summary for ${employeeName} - ${period}</h4>
                <p><strong>Overall Average Score:</strong> <span class="badge ${parseFloat(avgScore) >= 4.5 ? 'badge-excellent' : parseFloat(avgScore) >= 3.5 ? 'badge-good' : 'badge-average'}">${avgScore} ★</span></p>
                <p><strong>Total Reviews:</strong> ${employeeReviews.length} (${selfReview ? '1 Self, ' : ''}${peerReviews.length} Peer${peerReviews.length !== 1 ? 's' : ''}, ${managerReview ? '1 Manager' : '0 Manager'})</p>
            </div>
        `;

        if (selfReview) {
            html += `                <div class="feedback-card">
                    <h4> Self-Evaluation</h4>
                    <div class="feedback-item">
                        <strong>Score:</strong> ${selfReview.overallScore}/5.0 ★
                    </div>
                    <div class="feedback-item">
                        <strong>Key Strengths:</strong> ${selfReview.strengths || 'N/A'}                    </div>
                </div>
            `;
        }

        if (peerReviews.length > 0) {
            html += `                <div class="feedback-card">
                    <h4>👥 Peer Evaluations (${peerReviews.length})</h4>
            `;
            peerReviews.forEach((review, index) => {
                html += `                    <div class="feedback-item">
                        <strong>Reviewer ${index + 1}:</strong> ${review.reviewerName} - Score: ${review.overallScore}/5.0 ★
                        <br><strong>Comments:</strong> ${review.overallComments || 'N/A'}                    </div>
                `;
            });
            html += `</div>`;
        }

        if (managerReview) {
            html += `                <div class="feedback-card">
                    <h4>👔 Manager Evaluation</h4>
                    <div class="feedback-item">
                        <strong>Score:</strong> ${managerReview.overallScore}/5.0 ★
                    </div>
                    <div class="feedback-item">
                        <strong>Strengths:</strong> ${managerReview.strengths || 'N/A'}                    </div>
                    <div class="feedback-item">
                        <strong>Areas for Improvement:</strong> ${managerReview.areasForImprovement || 'N/A'}                    </div>
                </div>
            `;
        }

        html += `            <div class="improvement-suggestions">
                <h4>💡 Improvement Suggestions</h4>
                <ul>
                    <li>Focus on areas with lower KPI scores to improve overall performance</li>
                    <li>Continue building on identified strengths</li>
                    <li>Implement the suggested development plan</li>
                    <li>Schedule follow-up review to track progress</li>
                </ul>
            </div>
        `;

        document.getElementById('feedbackContent').innerHTML = html;
    }

    function loadAnalytics() {
        const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');

        document.getElementById('totalReviews').textContent = reviews.length;

        if (reviews.length === 0) {
            document.getElementById('avgScore').textContent = '0.0';
            document.getElementById('excellentRate').textContent = '0%';
            document.getElementById('completionRate').textContent = '0%';
            return;
        }

        const allScores = reviews.map(r => parseFloat(r.overallScore));
        const avgScore = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
        document.getElementById('avgScore').textContent = avgScore.toFixed(1);

        const excellentCount = allScores.filter(s => s >= 4.5).length;
        const excellentRate = (excellentCount / allScores.length * 100).toFixed(0);
        document.getElementById('excellentRate').textContent = excellentRate + '%';

        const reviewedEmployees = new Set(reviews.map(r => r.employeeName)).size;
        const totalEmployees = employees.length || 1;
        const completionRate = (reviewedEmployees / totalEmployees * 100).toFixed(0);
        document.getElementById('completionRate').textContent = completionRate + '%';

        loadCategoryDistribution(reviews);
        loadEmployeeRanking(reviews);
    }

    function loadCategoryDistribution(reviews) {
        const categories = [
            { key: 'customerSatisfaction', label: 'Customer Satisfaction' },
            { key: 'revenueGeneration', label: 'Revenue Generation' },
            { key: 'serviceQuality', label: 'Service Quality' },
            { key: 'teamCollaboration', label: 'Team Collaboration' },
            { key: 'professionalDevelopment', label: 'Professional Development' }
        ];

        const container = document.getElementById('categoryDistribution');
        container.innerHTML = '';

        categories.forEach(cat => {
            const values = reviews.map(r => r.kpiRatings[cat.key]);
            const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
            const percentage = (avg / 5 * 100).toFixed(0);

            const div = document.createElement('div');
            div.style.marginBottom = '15px';
            div.innerHTML = `                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${cat.label}</span>
                    <span><strong>${avg.toFixed(1)}</strong>/5.0</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function loadEmployeeRanking(reviews) {
        const employeeStats = {};

        reviews.forEach(review => {
            if (!employeeStats[review.employeeName]) {
                employeeStats[review.employeeName] = {
                    name: review.employeeName,
                    totalScore: 0,
                    count: 0
                };
            }
            employeeStats[review.employeeName].totalScore += parseFloat(review.overallScore);
            employeeStats[review.employeeName].count++;
        });

        const employees = Object.values(employeeStats).map(e => ({
            ...e,
            average: e.totalScore / e.count
        })).sort((a, b) => b.average - a.average);

        const tbody = document.getElementById('rankingList');
        tbody.innerHTML = '';

        employees.forEach((employee, index) => {
            const row = document.createElement('tr');
            const badgeClass = employee.average >= 4.5 ? 'badge-excellent' : employee.average >= 3.5 ? 'badge-good' : 'badge-average';
            row.innerHTML = `                <td>${index + 1}</td>
                <td>${employee.name}</td>
                <td><span class="badge ${badgeClass}">${employee.average.toFixed(1)}/5.0</span></td>
                <td>${employee.count}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(employee.average / 5 * 100).toFixed(0)}%"></div>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

      window.addEventListener('load', function() {
        loadEmployees();
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section') || 'viewReviews';
        showSection(section);
    });
