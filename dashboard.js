// FitFlow Analytics Dashboard
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.analyticsData = {
            users: [],
            workouts: [],
            sessions: [],
            activity: []
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnalyticsData();
        this.updateLastUpdated();
    }

    setupEventListeners() {
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refreshData();
        });
    }

    async loadAnalyticsData() {
        try {
            // Load real analytics data from localStorage
            this.loadRealAnalyticsData();
            
            // Generate sample data only if no real data exists
            if (this.analyticsData.users.length === 0) {
                this.generateSampleData();
            }
            
            // Update dashboard
            this.updateDashboard();
            this.createCharts();
            
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    }

    loadRealAnalyticsData() {
        // Load real analytics data from localStorage
        const storedData = localStorage.getItem('fitflow_analytics');
        if (storedData) {
            this.analyticsData = JSON.parse(storedData);
        }
        
        // Also load events data
        const eventsData = localStorage.getItem('fitflow_analytics_events');
        if (eventsData) {
            const events = JSON.parse(eventsData);
            this.analyticsData.activity = events;
            
            // Process events to create users, workouts, and sessions
            this.processRealAnalyticsData(events);
        }
    }
    
    processRealAnalyticsData(events) {
        // Extract unique users from events
        const userIds = [...new Set(events.map(e => e.userId))];
        this.analyticsData.users = userIds.map(userId => {
            const userEvents = events.filter(e => e.userId === userId);
            const workoutEvents = userEvents.filter(e => e.action === 'Workout Generated');
            const completedEvents = userEvents.filter(e => e.action === 'Workout Completed');
            
            return {
                id: userId,
                type: this.determineUserType(workoutEvents.length),
                preferredEquipment: this.getPreferredEquipment(userEvents),
                joinDate: this.getEarliestTimestamp(userEvents),
                totalWorkouts: workoutEvents.length
            };
        });
        
        // Process workout events
        this.analyticsData.workouts = events
            .filter(e => e.action === 'Workout Generated')
            .map(event => ({
                id: event.id,
                userId: event.userId,
                pattern: event.details.pattern,
                duration: event.details.duration,
                equipment: event.details.equipment,
                fitnessLevel: event.details.fitnessLevel,
                timestamp: event.timestamp,
                completed: events.some(e => 
                    e.action === 'Workout Completed' && 
                    e.details.pattern === event.details.pattern &&
                    e.details.timestamp > event.details.timestamp
                )
            }));
        
        // Process session events
        this.analyticsData.sessions = events
            .filter(e => e.action === 'Session Ended')
            .map(event => ({
                id: event.id,
                userId: event.userId,
                startTime: new Date(event.timestamp - (event.details.duration * 60 * 1000)).toISOString(),
                duration: event.details.duration,
                pagesVisited: events.filter(e => e.action === 'Page Visited').length,
                workoutGenerated: events.some(e => e.action === 'Workout Generated')
            }));
    }
    
    determineUserType(workoutCount) {
        if (workoutCount === 0) return 'Beginner';
        if (workoutCount < 10) return 'Beginner';
        if (workoutCount < 30) return 'Intermediate';
        return 'Advanced';
    }
    
    getPreferredEquipment(userEvents) {
        const equipmentEvents = userEvents.filter(e => 
            e.action === 'Equipment Changed' || e.action === 'Workout Generated'
        );
        
        const equipmentCounts = {};
        equipmentEvents.forEach(event => {
            const equipment = event.details.equipment || event.details.to;
            if (equipment && Array.isArray(equipment)) {
                equipment.forEach(eq => {
                    equipmentCounts[eq] = (equipmentCounts[eq] || 0) + 1;
                });
            }
        });
        
        const mostUsed = Object.keys(equipmentCounts).reduce((a, b) => 
            equipmentCounts[a] > equipmentCounts[b] ? a : b, 'Bodyweight');
        
        return mostUsed;
    }
    
    getEarliestTimestamp(userEvents) {
        if (userEvents.length === 0) return new Date().toISOString();
        
        const firstEvent = userEvents.reduce((earliest, current) => 
            new Date(current.timestamp) < new Date(earliest.timestamp) ? current : earliest);
        
        return firstEvent.timestamp;
    }

    generateSampleData() {
        // Generate realistic sample data for demonstration
        if (this.analyticsData.users.length === 0) {
            this.generateSampleUsers();
        }
        if (this.analyticsData.workouts.length === 0) {
            this.generateSampleWorkouts();
        }
        if (this.analyticsData.sessions.length === 0) {
            this.generateSampleSessions();
        }
        if (this.analyticsData.activity.length === 0) {
            this.generateSampleActivity();
        }
    }

    generateSampleUsers() {
        const userTypes = ['Beginner', 'Intermediate', 'Advanced'];
        const equipment = ['Dumbbells', 'Resistance Bands', 'Bodyweight', 'Kettlebells', 'Rower', 'Jump Rope'];
        
        for (let i = 0; i < 150; i++) {
            const user = {
                id: `user_${i + 1}`,
                type: userTypes[Math.floor(Math.random() * userTypes.length)],
                preferredEquipment: equipment[Math.floor(Math.random() * equipment.length)],
                joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                totalWorkouts: Math.floor(Math.random() * 50) + 1
            };
            this.analyticsData.users.push(user);
        }
    }

    generateSampleWorkouts() {
        const patterns = ['Standard', 'Circuit', 'Tabata', 'Pyramid'];
        const durations = [15, 30, 45, 60];
        const equipment = ['Dumbbells', 'Resistance Bands', 'Bodyweight', 'Kettlebells', 'Rower', 'Jump Rope'];
        
        for (let i = 0; i < 500; i++) {
            const workout = {
                id: `workout_${i + 1}`,
                userId: `user_${Math.floor(Math.random() * 150) + 1}`,
                pattern: patterns[Math.floor(Math.random() * patterns.length)],
                duration: durations[Math.floor(Math.random() * durations.length)],
                equipment: equipment[Math.floor(Math.random() * equipment.length)],
                fitnessLevel: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
                timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                completed: Math.random() > 0.2 // 80% completion rate
            };
            this.analyticsData.workouts.push(workout);
        }
    }

    generateSampleSessions() {
        for (let i = 0; i < 200; i++) {
            const session = {
                id: `session_${i + 1}`,
                userId: `user_${Math.floor(Math.random() * 150) + 1}`,
                startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                duration: Math.floor(Math.random() * 45) + 5, // 5-50 minutes
                pagesVisited: Math.floor(Math.random() * 8) + 2,
                workoutGenerated: Math.random() > 0.3
            };
            this.analyticsData.sessions.push(session);
        }
    }

    generateSampleActivity() {
        const actions = ['Workout Generated', 'Workout Started', 'Workout Completed', 'Page Visited', 'Equipment Changed'];
        
        for (let i = 0; i < 100; i++) {
            const activity = {
                id: `activity_${i + 1}`,
                userId: `user_${Math.floor(Math.random() * 150) + 1}`,
                action: actions[Math.floor(Math.random() * actions.length)],
                details: this.generateActivityDetails(actions[Math.floor(Math.random() * actions.length)]),
                timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
            };
            this.analyticsData.activity.push(activity);
        }
        
        // Sort by timestamp (most recent first)
        this.analyticsData.activity.sort((a, b) => b.timestamp - a.timestamp);
    }

    generateActivityDetails(action) {
        switch (action) {
            case 'Workout Generated':
                return `Generated ${['Circuit', 'Tabata', 'Pyramid', 'Standard'][Math.floor(Math.random() * 4)]} workout`;
            case 'Workout Started':
                return 'Started workout session';
            case 'Workout Completed':
                return 'Completed workout successfully';
            case 'Page Visited':
                return 'Visited workout overview';
            case 'Equipment Changed':
                return `Changed to ${['Dumbbells', 'Resistance Bands', 'Bodyweight'][Math.floor(Math.random() * 3)]}`;
            default:
                return 'User interaction';
        }
    }

    updateDashboard() {
        // Update key metrics
        this.updateKeyMetrics();
        
        // Update insights
        this.updateInsights();
        
        // Update activity table
        this.updateActivityTable();
        
        // Save data to localStorage
        localStorage.setItem('fitflow_analytics', JSON.stringify(this.analyticsData));
    }

    updateKeyMetrics() {
        const totalUsers = this.analyticsData.users.length;
        const totalWorkouts = this.analyticsData.workouts.length;
        const avgSessionTime = this.calculateAverageSessionTime();
        const completionRate = this.calculateCompletionRate();

        document.getElementById('total-users').textContent = totalUsers.toLocaleString();
        document.getElementById('total-workouts').textContent = totalWorkouts.toLocaleString();
        document.getElementById('avg-session-time').textContent = `${avgSessionTime} min`;
        document.getElementById('completion-rate').textContent = `${completionRate}%`;
    }

    calculateAverageSessionTime() {
        if (this.analyticsData.sessions.length === 0) return 0;
        const totalTime = this.analyticsData.sessions.reduce((sum, session) => sum + session.duration, 0);
        return Math.round(totalTime / this.analyticsData.sessions.length);
    }

    calculateCompletionRate() {
        if (this.analyticsData.workouts.length === 0) return 0;
        const completed = this.analyticsData.workouts.filter(w => w.completed).length;
        return Math.round((completed / this.analyticsData.workouts.length) * 100);
    }

    updateInsights() {
        const mostPopularEquipment = this.getMostPopular('equipment');
        const mostPopularPattern = this.getMostPopular('pattern');
        const mostPopularDuration = this.getMostPopular('duration');

        document.getElementById('most-popular-equipment').textContent = mostPopularEquipment;
        document.getElementById('most-popular-pattern').textContent = mostPopularPattern;
        document.getElementById('most-popular-duration').textContent = `${mostPopularDuration} min`;
    }

    getMostPopular(field) {
        const counts = {};
        this.analyticsData.workouts.forEach(workout => {
            const value = workout[field];
            counts[value] = (counts[value] || 0) + 1;
        });
        
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    updateActivityTable() {
        const tableBody = document.getElementById('activity-table');
        tableBody.innerHTML = '';

        // Show last 8 activities to fit better on screen
        const recentActivity = this.analyticsData.activity.slice(0, 8);
        
        recentActivity.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${this.formatTimestamp(activity.timestamp)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-dark">
                    ${activity.action}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${activity.details}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${activity.userId}
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    formatTimestamp(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    createCharts() {
        this.createEquipmentChart();
        this.createPatternChart();
        this.createDurationChart();
        this.createFitnessChart();
    }

    createEquipmentChart() {
        const ctx = document.getElementById('equipment-chart').getContext('2d');
        const data = this.getChartData('equipment');
        
        this.charts.equipment = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    createPatternChart() {
        const ctx = document.getElementById('pattern-chart').getContext('2d');
        const data = this.getChartData('pattern');
        
        this.charts.pattern = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Usage Count',
                    data: data.values,
                    backgroundColor: '#3B82F6',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    createDurationChart() {
        const ctx = document.getElementById('duration-chart').getContext('2d');
        const data = this.getChartData('duration');
        
        this.charts.duration = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels.map(d => `${d} min`),
                datasets: [{
                    label: 'Workouts Generated',
                    data: data.values,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    createFitnessChart() {
        const ctx = document.getElementById('fitness-chart').getContext('2d');
        const data = this.getChartData('fitnessLevel');
        
        this.charts.fitness = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#10B981', '#F59E0B', '#EF4444'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    getChartData(field) {
        const counts = {};
        this.analyticsData.workouts.forEach(workout => {
            const value = workout[field];
            counts[value] = (counts[value] || 0) + 1;
        });
        
        return {
            labels: Object.keys(counts),
            values: Object.values(counts)
        };
    }

    refreshData() {
        // Simulate data refresh
        this.generateSampleData();
        this.updateDashboard();
        
        // Update charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.createCharts();
        
        this.updateLastUpdated();
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('last-updated').textContent = now.toLocaleString();
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsDashboard();
});
