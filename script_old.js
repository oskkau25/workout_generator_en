// --- FINAL IMPROVED WORKOUT GENERATOR WITH EXERCISE LINKS ---
// Note: Images replaced with links to ACE Fitness exercise library for detailed instructions

// --- IMPROVED EXERCISE DATABASE ---
const exercises = [
    // Warm-up exercises
    { name: "Arm Circles", description: "Circle your arms loosely forwards and backwards to mobilize the shoulder joints.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "warmup" },
    { name: "Leg Swings", description: "Hold onto a wall and swing one leg loosely forward and back, as well as side to side.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Jumping Jacks", description: "A classic exercise to get your circulation going. Jump into a straddle while bringing your arms together above your head.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Jumping Rope (slow)", description: "Jump rope at a relaxed pace to slowly raise your heart rate and train coordination.", equipment: "Jump Rope", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Torso Twists", description: "Stand with feet shoulder-width apart and twist your upper body from side to side.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "warmup" },
    { name: "High Knees", description: "Run in place, bringing your knees up towards your chest as high as possible.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Butt Kicks", description: "Run in place, trying to kick your glutes with your heels.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Cat-Cow Stretch", description: "On all fours, arch your back up like a cat, then drop your belly down like a cow. Mobilizes the spine.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "warmup" },
    { name: "Hip Circles", description: "Stand on one leg and make large circles with the other knee to open up the hips.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Ankle Rotations", description: "Sit or stand and rotate one ankle in circles, first clockwise, then counter-clockwise.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Inchworm", description: "From a standing position, walk your hands out to a plank, then walk your feet towards your hands.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "World's Greatest Stretch", description: "Step into a deep lunge and place both hands on the floor. Twist your torso and reach one arm to the sky.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Light Rowing", description: "Start with a few minutes of easy rowing to warm up the entire body.", equipment: "Rower", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Dynamic Chest Stretch", description: "Swing your arms open wide to stretch the chest, then cross them in front of you.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "warmup" },
    { name: "Side Lunges", description: "Step out to one side, keeping the other leg straight. Sink your hips back to stretch the inner thigh.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Frankenstein Kicks", description: "Walk forward, kicking one leg straight out in front of you, trying to touch it with the opposite hand.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Glute Bridges (Warm-up)", description: "Lie on your back with knees bent. Lift your hips towards the ceiling, squeezing your glutes.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Shoulder Taps", description: "In a plank position, slowly tap your left shoulder with your right hand, and vice versa. Keep hips stable.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "warmup" },
    { name: "Wrist Circles", description: "Gently rotate your wrists in both directions to prepare them for exercise.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "warmup" },
    { name: "Neck Rolls", description: "Slowly and gently roll your head from side to side, avoiding full circles to protect the neck.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "warmup" },

    // Main exercises - Bodyweight
    { name: "Squats", description: "Stand hip-width apart, lower your buttocks as if sitting on a chair. Keep your back straight.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Push-ups", description: "Place hands shoulder-width apart, tense your body, and lower your chest to the floor. Beginners can keep their knees on the ground.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "main" },
    { name: "Lunges", description: "Take a big step forward and bend both knees to about 90 degrees. Push back and switch sides.", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Legs", type: "main" },
    { name: "Plank", description: "Support yourself on your forearms and toes. Keep your body in a straight line from head to toe.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "main" },
    { name: "Glute Bridge", description: "Lie on your back, knees bent, and lift your hips off the floor until your body forms a straight line from shoulders to knees.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Wall Sit", description: "Lean against a wall and slide down until your thighs are parallel to the floor. Hold the position.", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Legs", type: "main" },
    { name: "Step-ups", description: "Step up onto a sturdy surface with one foot, then step back down. Alternate legs.", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Legs", type: "main" },
    { name: "Calf Raises", description: "Stand on the edge of a step and raise your heels up and down to strengthen your calves.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Bird Dog", description: "On all fours, extend one arm forward and the opposite leg back. Keep your core stable.", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Core", type: "main" },
    { name: "Dead Bug", description: "Lie on your back with arms and legs in the air. Lower opposite arm and leg while keeping your back flat.", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Core", type: "main" },
    { name: "Burpees", description: "A combination of a squat, push-up, and vertical jump. Very intense for the whole body.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Full Body", type: "main" },
    { name: "Diamond Push-ups", description: "Perform a push-up with your hands close together, forming a diamond shape. Focuses on the triceps.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Pike Push-ups", description: "From a downward-dog position, lower your head towards the floor. Focuses on the shoulders.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Superman", description: "Lie on your stomach and simultaneously lift your arms, chest, and legs off the floor. Strengthens the lower back.", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Back", type: "main" },
    { name: "Russian Twists", description: "Sit on the floor, lean back, and lift your feet. Twist your torso from side to side.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "main" },
    { name: "Bicycle Crunches", description: "Lie on your back and bring opposite knee to opposite elbow in a cycling motion.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "main" },
    { name: "Mountain Climbers", description: "In a plank position, alternate bringing your knees to your chest as if you're climbing a mountain.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "main" },
    { name: "Jump Squats", description: "Perform a squat and then explosively jump up, landing softly back into a squat position.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Split Squats", description: "Step one foot back and lower into a lunge position. Keep your front knee over your toes.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Single-leg Glute Bridge", description: "Perform a glute bridge with one leg extended straight up in the air.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "main" },

    // Main exercises - Dumbbells
    { name: "Dumbbell Bicep Curls", description: "Hold a dumbbell in each hand. Bend your arms and lift the dumbbells to your shoulders without swinging your upper body.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Dumbbell Shoulder Press", description: "Sit upright and hold the dumbbells at shoulder height. Press them vertically upwards until your arms are almost straight.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Bent-over Dumbbell Rows", description: "Bend your upper body forward with a straight back. Pull the dumbbells up the side of your body towards your chest.", equipment: "Dumbbells", level: ["Intermediate", "Advanced"], muscle: "Back", type: "main" },
    { name: "Goblet Squat", description: "Hold a dumbbell vertically in front of your chest. Perform a deep squat while keeping your back straight.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Dumbbell Flys", description: "Lie on your back and press dumbbells above your chest. Lower them out to the sides in a wide arc.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "main" },
    { name: "Tricep Kickbacks", description: "Lean forward with a dumbbell in one hand. Extend your arm straight back, squeezing the tricep.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Overhead Tricep Extension", description: "Hold one dumbbell with both hands above your head. Lower it behind your head by bending your elbows.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Dumbbell Lunges", description: "Hold a dumbbell in each hand and perform lunges. Adds resistance to the standard lunge.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Romanian Deadlifts (RDLs)", description: "Hold dumbbells in front of your thighs. Hinge at your hips, keeping your back straight and legs almost straight.", equipment: "Dumbbells", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Lateral Raises", description: "Stand and hold dumbbells at your sides. Raise your arms out to the sides until they're at shoulder level.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Front Raises", description: "Hold dumbbells in front of your thighs. Raise them straight out in front of you to shoulder level.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Dumbbell Deadlift", description: "Stand with dumbbells in front of your thighs. Hinge at your hips and lower the dumbbells down your legs.", equipment: "Dumbbells", level: ["Intermediate", "Advanced"], muscle: "Back", type: "main" },
    { name: "Dumbbell Chest Press", description: "Lie on your back and press dumbbells straight up from your chest, then lower them back down.", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "main" },

    // Cool-down exercises
    { name: "Quad Stretch", description: "Stand upright, pull one foot towards your glutes, and keep the knee pointing downwards. Hold for 30 seconds per side.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Chest Stretch", description: "Stand in a doorway and press your forearms against the frame to open up the chest muscles. Hold for 30 seconds.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "cooldown" },
    { name: "Child's Pose", description: "Kneel on the floor, sit back on your heels, and bend your torso forward until your forehead touches the floor. Relaxes the back.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "cooldown" },
    { name: "Hamstring Stretch", description: "Sit on the floor with one leg extended, and gently lean forward to feel a stretch in the back of your thigh.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Pigeon Pose", description: "A deep stretch for the glutes and hip flexors. Bring one knee forward and extend the other leg back.", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Triceps Stretch", description: "Reach one arm overhead, bend the elbow, and gently pull the elbow with the opposite hand.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "cooldown" },
    { name: "Shoulder Stretch", description: "Bring one arm across your body and gently pull it closer with your other arm.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "cooldown" },
    { name: "Calf Stretch", description: "Stand facing a wall and step one foot back, pressing the heel into the floor.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Hip Flexor Stretch", description: "Kneel in a lunge position and gently push your hips forward to stretch the front of the hip.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Knees to Chest", description: "Lie on your back and hug both knees to your chest to release tension in the lower back.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "cooldown" },
    { name: "Cobra Pose", description: "Lie on your stomach and gently push your upper body up, arching your back.", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Back", type: "cooldown" },
    { name: "Butterfly Stretch", description: "Sit with the soles of your feet together and gently press your knees towards the floor.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Spinal Twist", description: "Lie on your back, bring one knee across your body, and look in the opposite direction.", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "cooldown" }
];

// --- HELPER FUNCTIONS ---
function validateForm() {
    const level = document.getElementById('fitness-level').value;
    const mainDuration = parseInt(document.getElementById('duration').value);
    const equipmentCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Validate fitness level
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
        throw new Error('Invalid fitness level selected');
    }
    
    // Validate duration
    if (isNaN(mainDuration) || mainDuration < 10 || mainDuration > 60) {
        throw new Error('Invalid duration selected');
    }
    
    // Validate equipment selection
    if (equipmentCheckboxes.length === 0) {
        throw new Error('No equipment selected');
    }
    
    return true;
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">❌</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">×</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">✅</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">×</button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 3000);
}

function setLoading(isLoading) {
    const loadingDiv = document.getElementById('loading');
    const generateBtn = document.getElementById('generate-btn');
    
    loadingDiv.classList.toggle('hidden', !isLoading);
    generateBtn.disabled = isLoading;
    generateBtn.classList.toggle('opacity-50', isLoading);
    generateBtn.classList.toggle('cursor-not-allowed', isLoading);
}

function generateRandomSet(exerciseList, count) {
    if (exerciseList.length === 0) return [];
    const shuffled = [...exerciseList].sort(() => 0.5 - Math.random());
    const numToReturn = Math.min(count, shuffled.length);
    return shuffled.slice(0, numToReturn);
}

function displayPlan(warmup, main, cooldown, summary) {
    const planContentDiv = document.getElementById('plan-content');
    const workoutPlanDiv = document.getElementById('workout-plan');
    const noResultsDiv = document.getElementById('no-results');
    
    planContentDiv.innerHTML = '';
    
    if (!main || main.length === 0) {
        workoutPlanDiv.classList.add('hidden');
        noResultsDiv.classList.remove('hidden');
        return;
    }
    
    noResultsDiv.classList.add('hidden');
    workoutPlanDiv.classList.remove('hidden');

    // Function to get exercise description link
    function getExerciseLink(exerciseName) {
        const exerciseLinks = {
            // Warm-up exercises
            "Arm Circles": "https://www.acefitness.org/resources/everyone/exercise-library/arm-circles/",
            "Leg Swings": "https://www.acefitness.org/resources/everyone/exercise-library/leg-swings/",
            "Jumping Jacks": "https://www.acefitness.org/resources/everyone/exercise-library/jumping-jacks/",
            "Jumping Rope (slow)": "https://www.acefitness.org/resources/everyone/exercise-library/jump-rope/",
            "Torso Twists": "https://www.acefitness.org/resources/everyone/exercise-library/torso-twists/",
            "High Knees": "https://www.acefitness.org/resources/everyone/exercise-library/high-knees/",
            "Butt Kicks": "https://www.acefitness.org/resources/everyone/exercise-library/butt-kicks/",
            "Cat-Cow Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/cat-cow-stretch/",
            "Hip Circles": "https://www.acefitness.org/resources/everyone/exercise-library/hip-circles/",
            "Ankle Rotations": "https://www.acefitness.org/resources/everyone/exercise-library/ankle-rotations/",
            "Inchworm": "https://www.acefitness.org/resources/everyone/exercise-library/inchworm/",
            "World's Greatest Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/worlds-greatest-stretch/",
            "Light Rowing": "https://www.acefitness.org/resources/everyone/exercise-library/rowing/",
            "Dynamic Chest Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/dynamic-chest-stretch/",
            "Side Lunges": "https://www.acefitness.org/resources/everyone/exercise-library/side-lunges/",
            "Frankenstein Kicks": "https://www.acefitness.org/resources/everyone/exercise-library/frankenstein-kicks/",
            "Glute Bridges (Warm-up)": "https://www.acefitness.org/resources/everyone/exercise-library/glute-bridge/",
            "Shoulder Taps": "https://www.acefitness.org/resources/everyone/exercise-library/shoulder-taps/",
            "Wrist Circles": "https://www.acefitness.org/resources/everyone/exercise-library/wrist-circles/",
            "Neck Rolls": "https://www.acefitness.org/resources/everyone/exercise-library/neck-rolls/",
            
            // Main exercises - Bodyweight
            "Squats": "https://www.acefitness.org/resources/everyone/exercise-library/squat/",
            "Push-ups": "https://www.acefitness.org/resources/everyone/exercise-library/push-up/",
            "Lunges": "https://www.acefitness.org/resources/everyone/exercise-library/lunge/",
            "Plank": "https://www.acefitness.org/resources/everyone/exercise-library/plank/",
            "Glute Bridge": "https://www.acefitness.org/resources/everyone/exercise-library/glute-bridge/",
            "Wall Sit": "https://www.acefitness.org/resources/everyone/exercise-library/wall-sit/",
            "Step-ups": "https://www.acefitness.org/resources/everyone/exercise-library/step-up/",
            "Calf Raises": "https://www.acefitness.org/resources/everyone/exercise-library/calf-raise/",
            "Bird Dog": "https://www.acefitness.org/resources/everyone/exercise-library/bird-dog/",
            "Dead Bug": "https://www.acefitness.org/resources/everyone/exercise-library/dead-bug/",
            "Burpees": "https://www.acefitness.org/resources/everyone/exercise-library/burpee/",
            "Diamond Push-ups": "https://www.acefitness.org/resources/everyone/exercise-library/diamond-push-up/",
            "Pike Push-ups": "https://www.acefitness.org/resources/everyone/exercise-library/pike-push-up/",
            "Superman": "https://www.acefitness.org/resources/everyone/exercise-library/superman/",
            "Russian Twists": "https://www.acefitness.org/resources/everyone/exercise-library/russian-twist/",
            "Bicycle Crunches": "https://www.acefitness.org/resources/everyone/exercise-library/bicycle-crunch/",
            "Mountain Climbers": "https://www.acefitness.org/resources/everyone/exercise-library/mountain-climber/",
            "Jump Squats": "https://www.acefitness.org/resources/everyone/exercise-library/jump-squat/",
            "Split Squats": "https://www.acefitness.org/resources/everyone/exercise-library/split-squat/",
            "Single-leg Glute Bridge": "https://www.acefitness.org/resources/everyone/exercise-library/single-leg-glute-bridge/",
            
            // Main exercises - Dumbbells
            "Dumbbell Bicep Curls": "https://www.acefitness.org/resources/everyone/exercise-library/dumbbell-bicep-curl/",
            "Dumbbell Shoulder Press": "https://www.acefitness.org/resources/everyone/exercise-library/dumbbell-shoulder-press/",
            "Bent-over Dumbbell Rows": "https://www.acefitness.org/resources/everyone/exercise-library/bent-over-dumbbell-row/",
            "Goblet Squat": "https://www.acefitness.org/resources/everyone/exercise-library/goblet-squat/",
            "Dumbbell Flys": "https://www.acefitness.org/resources/everyone/exercise-library/dumbbell-fly/",
            "Tricep Kickbacks": "https://www.acefitness.org/resources/everyone/exercise-library/tricep-kickback/",
            "Overhead Tricep Extension": "https://www.acefitness.org/resources/everyone/exercise-library/overhead-tricep-extension/",
            "Dumbbell Lunges": "https://www.acefitness.org/resources/everyone/exercise-library/dumbbell-lunge/",
            "Romanian Deadlifts (RDLs)": "https://www.acefitness.org/resources/everyone/exercise-library/romanian-deadlift/",
            "Lateral Raises": "https://www.acefitness.org/resources/everyone/exercise-library/lateral-raise/",
            "Front Raises": "https://www.acefitness.org/resources/everyone/exercise-library/front-raise/",
            "Dumbbell Deadlift": "https://www.acefitness.org/resources/everyone/exercise-library/dumbbell-deadlift/",
            "Dumbbell Chest Press": "https://www.acefitness.org/resources/everyone/exercise-library/dumbbell-chest-press/",
            
            // Cool-down exercises
            "Quad Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/quad-stretch/",
            "Chest Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/chest-stretch/",
            "Child's Pose": "https://www.acefitness.org/resources/everyone/exercise-library/childs-pose/",
            "Hamstring Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/hamstring-stretch/",
            "Pigeon Pose": "https://www.acefitness.org/resources/everyone/exercise-library/pigeon-pose/",
            "Triceps Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/tricep-stretch/",
            "Shoulder Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/shoulder-stretch/",
            "Calf Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/calf-stretch/",
            "Hip Flexor Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/hip-flexor-stretch/",
            "Knees to Chest": "https://www.acefitness.org/resources/everyone/exercise-library/knees-to-chest/",
            "Cobra Pose": "https://www.acefitness.org/resources/everyone/exercise-library/cobra-pose/",
            "Butterfly Stretch": "https://www.acefitness.org/resources/everyone/exercise-library/butterfly-stretch/",
            "Spinal Twist": "https://www.acefitness.org/resources/everyone/exercise-library/spinal-twist/"
        };
        
        // Return the specific link or a fallback to ACE Fitness search
        return exerciseLinks[exerciseName] || `https://www.acefitness.org/resources/everyone/exercise-library/?search=${encodeURIComponent(exerciseName)}`;
    }

    const createSection = (title, exercises) => {
        if (!exercises || exercises.length === 0) return '';
        let sectionHtml = `<h2 class="text-2xl font-bold text-center text-blue-400 my-6">${title}</h2>`;
        exercises.forEach((exercise) => {
            const exerciseLink = getExerciseLink(exercise.name);
            sectionHtml += `
                <div class="bg-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center border border-gray-700 shadow-md animate-fade-in mb-6">
                    <div class="w-full md:w-1/3 h-48 md:h-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600 p-6 flex items-center justify-center">
                        <div class="text-center text-white">
                            <div class="text-4xl mb-2">💪</div>
                            <div class="text-sm font-semibold">Exercise Demo</div>
                            <a href="${exerciseLink}" target="_blank" rel="noopener noreferrer" class="inline-block mt-3 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                                Learn More →
                            </a>
                        </div>
                    </div>
                    <div class="p-6 w-full">
                        <h3 class="text-xl font-bold">${exercise.name}</h3>
                        <p class="text-gray-400 mt-2">${exercise.description}</p>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <div class="bg-gray-700 inline-block px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="text-white">Duration: </span>
                                <span class="text-blue-300">45 sec work, 15 sec rest</span>
                            </div>
                            <div class="bg-gray-700 inline-block px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="text-white">Muscle: </span>
                                <span class="text-green-300">${exercise.muscle}</span>
                            </div>
                            <div class="bg-gray-700 inline-block px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="text-white">Equipment: </span>
                                <span class="text-yellow-300">${exercise.equipment}</span>
                            </div>
                        </div>
                        <div class="mt-4">
                            <a href="${exerciseLink}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline font-semibold">
                                📖 View detailed instructions and form guide
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        return sectionHtml;
    };

    const summaryHtml = `<div class="text-center text-blue-300 bg-gray-800 p-4 rounded-lg mb-8 border border-gray-700">${summary}</div>`;

    planContentDiv.innerHTML += createSection("Warm-up (5 Minutes)", warmup);
    planContentDiv.innerHTML += `<h2 class="text-2xl font-bold text-center text-blue-400 my-6">Main Workout (${main.length} Minutes)</h2>` + summaryHtml;
    planContentDiv.innerHTML += createSection("", main);
    planContentDiv.innerHTML += createSection("Cool-down (5 Minutes)", cooldown);

    workoutPlanDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- MAIN INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing workout generator...');
    
    // Get DOM elements
    const form = document.getElementById('workout-form');
    const durationSlider = document.getElementById('duration');
    const durationValue = document.getElementById('duration-value');
    const generateBtn = document.getElementById('generate-btn');
    
    console.log('DOM elements found:', {
        form: !!form,
        durationSlider: !!durationSlider,
        durationValue: !!durationValue,
        generateBtn: !!generateBtn
    });
    
    // Add time slider functionality
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            durationValue.textContent = this.value;
        });
        
        // Initialize duration display
        durationValue.textContent = durationSlider.value;
    }
    
    // Add form submission handler
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted!');
            
            try {
                // Validate form input
                validateForm();
                
                // Hide previous results
                const workoutPlanDiv = document.getElementById('workout-plan');
                const noResultsDiv = document.getElementById('no-results');
                workoutPlanDiv.classList.add('hidden');
                noResultsDiv.classList.add('hidden');
                
                setLoading(true);

                const level = document.getElementById('fitness-level').value;
                const mainDuration = parseInt(durationSlider.value);
                const equipmentCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                let selectedEquipment = Array.from(equipmentCheckboxes).map(cb => cb.value);
                
                // Ensure Bodyweight is always available as fallback
                if (selectedEquipment.length === 0) {
                    selectedEquipment.push("Bodyweight");
                }

                // Improved filtering logic
                const filterByType = (type) => exercises.filter(ex => 
                    ex.type === type &&
                    ex.level.includes(level) &&
                    selectedEquipment.includes(ex.equipment)
                );

                const availableWarmup = filterByType('warmup');
                const availableMain = filterByType('main');
                const availableCooldown = filterByType('cooldown');
                
                console.log(`Available exercises - Warmup: ${availableWarmup.length}, Main: ${availableMain.length}, Cooldown: ${availableCooldown.length}`);
                console.log('Selected equipment:', selectedEquipment);
                console.log('Fitness level:', level);
                
                const warmupPlan = generateRandomSet(availableWarmup, 5);
                const cooldownPlan = generateRandomSet(availableCooldown, 5);

                // FIXED: Improved logic - only check if we have enough exercises for the requested duration
                if (availableMain.length === 0) {
                    throw new Error('No exercises available for the selected criteria. Please try different equipment or fitness level.');
                }

                // Use fallback plan if AI is not available
                const fallbackMainPlan = generateRandomSet(availableMain, mainDuration);
                displayPlan(warmupPlan, fallbackMainPlan, cooldownPlan, `Generated ${mainDuration}-minute workout plan with ${selectedEquipment.join(', ')} equipment.`);
                
                showSuccess('Workout plan generated successfully!');
                
            } catch (error) {
                console.error("Error generating plan:", error);
                showError(error.message || 'Failed to generate workout plan. Please try again.');
                
                // Show no results message
                const workoutPlanDiv = document.getElementById('workout-plan');
                const noResultsDiv = document.getElementById('no-results');
                workoutPlanDiv.classList.add('hidden');
                noResultsDiv.classList.remove('hidden');
            } finally {
                setLoading(false);
            }
        });
        
        console.log('Form event listener attached successfully');
    }
    
    // Add ARIA labels and roles
    if (generateBtn) {
        generateBtn.setAttribute('aria-label', 'Generate workout plan');
        generateBtn.setAttribute('role', 'button');
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'SELECT') {
            e.target.blur();
        }
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('button, input, select, a');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #3b82f6';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
    
    console.log('Workout generator initialized successfully!');
});
