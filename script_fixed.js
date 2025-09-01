// --- SIMPLIFIED WORKOUT GENERATOR FOR TESTING ---

// Simple exercise data
const exercises = [
    { name: "Squats", description: "Basic squat exercise", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Push-ups", description: "Basic push-up exercise", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "main" },
    { name: "Plank", description: "Basic plank exercise", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "main" }
];

// Simple image function
function getExerciseImage(exerciseName) {
    return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center";
}

// DOM elements
const form = document.getElementById('workout-form');
const durationSlider = document.getElementById('duration');
const durationValue = document.getElementById('duration-value');
const workoutPlanDiv = document.getElementById('workout-plan');
const planContentDiv = document.getElementById('plan-content');
const noResultsDiv = document.getElementById('no-results');
const loadingDiv = document.getElementById('loading');
const generateBtn = document.getElementById('generate-btn');

console.log('DOM elements found:', {
    form: !!form,
    durationSlider: !!durationSlider,
    durationValue: !!durationValue,
    workoutPlanDiv: !!workoutPlanDiv,
    planContentDiv: !!planContentDiv,
    noResultsDiv: !!noResultsDiv,
    loadingDiv: !!loadingDiv,
    generateBtn: !!generateBtn
});

// Simple form handler
form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted!');
    
    // Show loading
    loadingDiv.classList.remove('hidden');
    workoutPlanDiv.classList.add('hidden');
    noResultsDiv.classList.add('hidden');
    
    // Simulate processing
    setTimeout(() => {
        // Hide loading
        loadingDiv.classList.add('hidden');
        
        // Show results
        workoutPlanDiv.classList.remove('hidden');
        planContentDiv.innerHTML = `
            <h2 class="text-2xl font-bold text-center text-blue-400 my-6">Test Workout Plan</h2>
            <div class="bg-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center border border-gray-700 shadow-md mb-6">
                <div class="w-full md:w-1/3 h-48 md:h-full flex-shrink-0 bg-white p-2">
                    <img src="${getExerciseImage('Squats')}" alt="Squats" class="w-full h-full object-contain">
                </div>
                <div class="p-6 w-full">
                    <h3 class="text-xl font-bold">Squats</h3>
                    <p class="text-gray-400 mt-2">Basic squat exercise</p>
                </div>
            </div>
        `;
        
        console.log('Workout plan generated!');
    }, 1000);
});

// Time slider functionality
if (durationSlider && durationValue) {
    durationSlider.addEventListener('input', function() {
        durationValue.textContent = this.value;
        console.log('Duration changed to:', this.value);
    });
    
    // Initialize
    durationValue.textContent = durationSlider.value;
}

console.log('Script loaded successfully!');
