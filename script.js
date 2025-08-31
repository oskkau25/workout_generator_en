// --- DATABASE OF EXERCISES ---
const exercises = [
    // Warm-up (20 exercises)
    { name: "Arm Circles", description: "Circle your arms loosely forwards and backwards to mobilize the shoulder joints.", image: "https://wger.de/media/exercise-images/138/Arm-circles.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "warmup" },
    { name: "Leg Swings", description: "Hold onto a wall and swing one leg loosely forward and back, as well as side to side.", image: "https://wger.de/media/exercise-images/229/Leg-swings.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Jumping Jacks", description: "A classic exercise to get your circulation going. Jump into a straddle while bringing your arms together above your head.", image: "https://wger.de/media/exercise-images/101/Jumping-jacks.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Jumping Rope (slow)", description: "Jump rope at a relaxed pace to slowly raise your heart rate and train coordination.", image: "https://wger.de/media/exercise-images/100/Rope-jumping.png", equipment: "Jump Rope", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Torso Twists", description: "Stand with feet shoulder-width apart and twist your upper body from side to side.", image: "https://wger.de/media/exercise-images/220/Trunk-rotation.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "warmup" },
    { name: "High Knees", description: "Run in place, bringing your knees up towards your chest as high as possible.", image: "https://wger.de/media/exercise-images/98/High-knees.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Butt Kicks", description: "Run in place, trying to kick your glutes with your heels.", image: "https://wger.de/media/exercise-images/96/Butt-kicks.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Cat-Cow Stretch", description: "On all fours, arch your back up like a cat, then drop your belly down like a cow. Mobilizes the spine.", image: "https://wger.de/media/exercise-images/142/Cat-cow-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "warmup" },
    { name: "Hip Circles", description: "Stand on one leg and make large circles with the other knee to open up the hips.", image: "https://wger.de/media/exercise-images/228/Hip-circles.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Ankle Rotations", description: "Sit or stand and rotate one ankle in circles, first clockwise, then counter-clockwise.", image: "https://wger.de/media/exercise-images/140/Ankle-circles.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Inchworm", description: "From a standing position, walk your hands out to a plank, then walk your feet towards your hands.", image: "https://wger.de/media/exercise-images/227/Inchworm.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "World's Greatest Stretch", description: "Step into a deep lunge and place both hands on the floor. Twist your torso and reach one arm to the sky.", image: "https://wger.de/media/exercise-images/205/Worlds-greatest-stretch.png", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Light Rowing", description: "Start with a few minutes of easy rowing to warm up the entire body.", image: "https://wger.de/media/exercise-images/202/Rowing.png", equipment: "Rower", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "warmup" },
    { name: "Dynamic Chest Stretch", description: "Swing your arms open wide to stretch the chest, then cross them in front of you.", image: "https://wger.de/media/exercise-images/144/Dynamic-chest-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "warmup" },
    { name: "Side Lunges", description: "Step out to one side, keeping the other leg straight. Sink your hips back to stretch the inner thigh.", image: "https://wger.de/media/exercise-images/233/Side-lunge.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Frankenstein Kicks", description: "Walk forward, kicking one leg straight out in front of you, trying to touch it with the opposite hand.", image: "https://wger.de/media/exercise-images/145/Frankenstein-walk.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Glute Bridges (Warm-up)", description: "Lie on your back with knees bent. Lift your hips towards the ceiling, squeezing your glutes.", image: "https://wger.de/media/exercise-images/111/Glute-bridge.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "warmup" },
    { name: "Shoulder Taps", description: "In a plank position, slowly tap your left shoulder with your right hand, and vice versa. Keep hips stable.", image: "https://wger.de/media/exercise-images/198/Shoulder-taps.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "warmup" },
    { name: "Wrist Circles", description: "Gently rotate your wrists in both directions to prepare them for exercise.", image: "https://wger.de/media/exercise-images/143/Wrist-circles.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "warmup" },
    { name: "Neck Rolls", description: "Slowly and gently roll your head from side to side, avoiding full circles to protect the neck.", image: "https://wger.de/media/exercise-images/139/Neck-rolls.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "warmup" },

    // Main Workout (50+ exercises)
    { name: "Squats", description: "Stand hip-width apart, lower your buttocks as if sitting on a chair. Keep your back straight.", image: "https://wger.de/media/exercise-images/74/Squats.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Push-ups", description: "Place hands shoulder-width apart, tense your body, and lower your chest to the floor. Beginners can keep their knees on the ground.", image: "https://wger.de/media/exercise-images/65/Push-ups.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "main" },
    { name: "Lunges", description: "Take a big step forward and bend both knees to about 90 degrees. Push back and switch sides.", image: "https://wger.de/media/exercise-images/87/Lunges.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Legs", type: "main" },
    { name: "Plank", description: "Support yourself on your forearms and toes. Keep your body in a straight line from head to toe.", image: "https://wger.de/media/exercise-images/107/Plank.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "main" },
    { name: "Burpees", description: "A combination of a squat, push-up, and vertical jump. Very intense for the whole body.", image: "https://wger.de/media/exercise-images/95/Burpees.png", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Full Body", type: "main" },
    { name: "Glute Bridge", description: "Lie on your back, knees bent, and lift your hips off the floor until your body forms a straight line from shoulders to knees.", image: "https://wger.de/media/exercise-images/111/Glute-bridge.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Diamond Push-ups", description: "Perform a push-up with your hands close together, forming a diamond shape. Focuses on the triceps.", image: "https://wger.de/media/exercise-images/61/Diamond-push-ups.png", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Pike Push-ups", description: "From a downward-dog position, lower your head towards the floor. Focuses on the shoulders.", image: "https://wger.de/media/exercise-images/64/Pike-push-ups.png", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Superman", description: "Lie on your stomach and simultaneously lift your arms, chest, and legs off the floor. Strengthens the lower back.", image: "https://wger.de/media/exercise-images/114/Superman.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Back", type: "main" },
    { name: "Russian Twists", description: "Sit on the floor, lean back, and lift your feet. Twist your torso from side to side.", image: "https://wger.de/media/exercise-images/108/Russian-twist.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "main" },
    { name: "Bicycle Crunches", description: "Lie on your back and bring opposite knee to opposite elbow in a cycling motion.", image: "https://wger.de/media/exercise-images/104/Bicycle-crunch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Core", type: "main" },
    { name: "Mountain Climbers", description: "In a plank position, alternate bringing your knees to your chest as if you're climbing a mountain.", image: "https://wger.de/media/exercise-images/99/Mountain-climbers.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "main" },
    { name: "Dumbbell Bicep Curls", description: "Hold a dumbbell in each hand. Bend your arms and lift the dumbbells to your shoulders without swinging your upper body.", image: "https://wger.de/media/exercise-images/49/Dumbbell-biceps-curl.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Dumbbell Shoulder Press", description: "Sit upright and hold the dumbbells at shoulder height. Press them vertically upwards until your arms are almost straight.", image: "https://wger.de/media/exercise-images/55/Dumbbell-shoulder-press.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Bent-over Dumbbell Rows", description: "Bend your upper body forward with a straight back. Pull the dumbbells up the side of your body towards your chest.", image: "https://wger.de/media/exercise-images/51/Bent-over-row.png", equipment: "Dumbbells", level: ["Intermediate", "Advanced"], muscle: "Back", type: "main" },
    { name: "Goblet Squat", description: "Hold a dumbbell vertically in front of your chest. Perform a deep squat while keeping your back straight.", image: "https://wger.de/media/exercise-images/89/Goblet-squat.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Dumbbell Flys", description: "Lie on your back and press dumbbells above your chest. Lower them out to the sides in a wide arc.", image: "https://wger.de/media/exercise-images/52/Dumbbell-flyes.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "main" },
    { name: "Tricep Kickbacks", description: "Lean forward with a dumbbell in one hand. Extend your arm straight back, squeezing the tricep.", image: "https://wger.de/media/exercise-images/57/Dumbbell-triceps-kickback.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Overhead Tricep Extension", description: "Hold one dumbbell with both hands above your head. Lower it behind your head by bending your elbows.", image: "https://wger.de/media/exercise-images/56/Dumbbell-triceps-extension.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Dumbbell Lunges", description: "Hold a dumbbell in each hand and perform lunges. Adds resistance to the standard lunge.", image: "https://wger.de/media/exercise-images/87/Lunges.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Romanian Deadlifts (RDLs)", description: "Hold dumbbells in front of your thighs. Hinge at your hips, keeping your back straight and legs almost straight.", image: "https://wger.de/media/exercise-images/91/Romanian-deadlift.png", equipment: "Dumbbells", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Lateral Raises", description: "Stand and hold dumbbells at your sides. Raise your arms out to the sides until they're at shoulder level.", image: "https://wger.de/media/exercise-images/53/Lateral-raises.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Front Raises", description: "Hold dumbbells in front of your thighs. Raise them straight out in front of you to shoulder level.", image: "https://wger.de/media/exercise-images/54/Front-raises.png", equipment: "Dumbbells", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Kettlebell Swings", description: "Hinge at your hips and swing the kettlebell up to chest height using the power from your glutes and hamstrings.", image: "https://wger.de/media/exercise-images/154/Kettlebell-swing.png", equipment: "Kettlebell", level: ["Intermediate", "Advanced"], muscle: "Full Body", type: "main" },
    { name: "Kettlebell Goblet Squat", description: "Hold a kettlebell by the horns at your chest. Perform a deep squat, keeping your chest up.", image: "https://wger.de/media/exercise-images/153/Goblet-squat.png", equipment: "Kettlebell", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Kettlebell Deadlift", description: "Stand with the kettlebell between your feet. Hinge at your hips and lift it with a straight back.", image: "https://wger.de/media/exercise-images/151/Kettlebell-deadlift.png", equipment: "Kettlebell", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "main" },
    { name: "Kettlebell Halos", description: "Hold the kettlebell by the horns and circle it around your head. Great for shoulder mobility and core stability.", image: "https://wger.de/media/exercise-images/152/Kettlebell-halo.png", equipment: "Kettlebell", level: ["Beginner", "Intermediate"], muscle: "Shoulders", type: "main" },
    { name: "Pull-ups", description: "Grasp the bar slightly wider than shoulder-width. Pull yourself up until your chin is over the bar.", image: "https://wger.de/media/exercise-images/23/Pull-ups.png", equipment: "Pull-up Bar", level: ["Intermediate", "Advanced"], muscle: "Back", type: "main" },
    { name: "Chin-ups", description: "Grasp the bar with an underhand grip, shoulder-width apart. Pull yourself up, focusing on the biceps.", image: "https://wger.de/media/exercise-images/22/Chin-ups.png", equipment: "Pull-up Bar", level: ["Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Hanging Leg Raises", description: "Hang from the bar and lift your straight legs until they are parallel to the floor. For the abdominal muscles.", image: "https://wger.de/media/exercise-images/106/Hanging-leg-raises.png", equipment: "Pull-up Bar", level: ["Intermediate", "Advanced"], muscle: "Core", type: "main" },
    { name: "Toes-to-Bar", description: "Hang from the bar and lift your toes all the way up to touch the bar. An advanced core exercise.", image: "https://wger.de/media/exercise-images/110/Toes-to-bar.png", equipment: "Pull-up Bar", level: ["Advanced"], muscle: "Core", type: "main" },
    { name: "Negative Pull-ups", description: "Jump up so your chin is over the bar. Then lower yourself down as slowly as possible. Ideal for beginners.", image: "https://wger.de/media/exercise-images/23/Pull-ups.png", equipment: "Pull-up Bar", level: ["Beginner"], muscle: "Back", type: "main" },
    { name: "Resistance Band Rows", description: "Sit on the floor with your legs straight. Place the band around your feet and pull the ends towards you, elbows close to your body.", image: "https://wger.de/media/exercise-images/213/Seated-band-rows.png", equipment: "Resistance Band", level: ["Beginner", "Intermediate"], muscle: "Back", type: "main" },
    { name: "Banded Glute Kickbacks", description: "On all fours with a band around your feet, kick one leg straight back, squeezing the glute.", image: "https://wger.de/media/exercise-images/210/Glute-kickbacks.png", equipment: "Resistance Band", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Banded Squats", description: "Place a resistance band above your knees and perform a squat, pushing your knees out against the band.", image: "https://wger.de/media/exercise-images/214/Banded-squat.png", equipment: "Resistance Band", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "Banded Bicep Curls", description: "Stand on the middle of the band and curl the ends up like you would with dumbbells.", image: "https://wger.de/media/exercise-images/207/Biceps-curl-with-band.png", equipment: "Resistance Band", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "Face Pulls", description: "Anchor a band at chest height. Pull the band towards your face, separating your hands as you pull.", image: "https://wger.de/media/exercise-images/209/Face-pull.png", equipment: "Resistance Band", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "main" },
    { name: "Jumping Rope (intense)", description: "Classic rope jumping for warm-up and endurance. Keep your upper body upright and jump only a few inches high.", image: "https://wger.de/media/exercise-images/100/Rope-jumping.png", equipment: "Jump Rope", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "main" },
    { name: "Double Unders", description: "An advanced jump rope technique where the rope passes under your feet twice for every jump.", image: "https://wger.de/media/exercise-images/100/Rope-jumping.png", equipment: "Jump Rope", level: ["Advanced"], muscle: "Full Body", type: "main" },
    { name: "TRX Rows", description: "Grasp the TRX handles and lean back with your arms straight. Pull your chest to the handles by squeezing your shoulder blades together.", image: "https://wger.de/media/exercise-images/179/Trx-row.png", equipment: "TRX Bands", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "main" },
    { name: "TRX Push-ups", description: "Place your feet in the TRX loops and get into a push-up position. Perform push-ups, keeping your core tight.", image: "https://wger.de/media/exercise-images/178/Trx-push-up.png", equipment: "TRX Bands", level: ["Intermediate", "Advanced"], muscle: "Chest", type: "main" },
    { name: "TRX Bicep Curls", description: "Lean back holding the TRX handles with palms facing up. Curl your body towards your hands.", image: "https://wger.de/media/exercise-images/176/Trx-biceps-curl.png", equipment: "TRX Bands", level: ["Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "TRX Tricep Press", description: "Face away from the anchor point, holding the handles. Lean forward and press the handles away from you.", image: "https://wger.de/media/exercise-images/180/Trx-triceps-press.png", equipment: "TRX Bands", level: ["Intermediate", "Advanced"], muscle: "Arms", type: "main" },
    { name: "TRX Hamstring Curls", description: "Lie on your back with your heels in the TRX loops. Drag your heels towards you, lifting your hips.", image: "https://wger.de/media/exercise-images/177/Trx-hamstring-curl.png", equipment: "TRX Bands", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "main" },
    { name: "TRX Atomic Push-ups", description: "Perform a push-up with your feet in the straps, then immediately bring both knees to your chest.", image: "https://wger.de/media/exercise-images/178/Trx-push-up.png", equipment: "TRX Bands", level: ["Advanced"], muscle: "Full Body", type: "main" },
    { name: "Rowing Machine", description: "Sit on the rowing machine. Push off powerfully with your legs, then pull the handle to your chest with your back and arms. Coordinate the movement smoothly.", image: "https://wger.de/media/exercise-images/202/Rowing.png", equipment: "Rower", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Full Body", type: "main" },
    { name: "Rowing Sprints", description: "Perform short, high-intensity intervals on the rowing machine.", image: "https://wger.de/media/exercise-images/202/Rowing.png", equipment: "Rower", level: ["Intermediate", "Advanced"], muscle: "Full Body", type: "main" },

    // Cool-down (20 exercises)
    { name: "Quad Stretch", description: "Stand upright, pull one foot towards your glutes, and keep the knee pointing downwards. Hold for 30 seconds per side.", image: "https://wger.de/media/exercise-images/266/Standing-quad-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Chest Stretch", description: "Stand in a doorway and press your forearms against the frame to open up the chest muscles. Hold for 30 seconds.", image: "https://wger.de/media/exercise-images/246/Doorway-chest-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Chest", type: "cooldown" },
    { name: "Child's Pose", description: "Kneel on the floor, sit back on your heels, and bend your torso forward until your forehead touches the floor. Relaxes the back.", image: "https://wger.de/media/exercise-images/142/Cat-cow-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "cooldown" },
    { name: "Hamstring Stretch", description: "Sit on the floor with one leg extended, and gently lean forward to feel a stretch in the back of your thigh.", image: "https://wger.de/media/exercise-images/251/Seated-hamstring-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Pigeon Pose", description: "A deep stretch for the glutes and hip flexors. Bring one knee forward and extend the other leg back.", image: "https://wger.de/media/exercise-images/260/Pigeon-pose.png", equipment: "Bodyweight", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Triceps Stretch", description: "Reach one arm overhead, bend the elbow, and gently pull the elbow with the opposite hand.", image: "https://wger.de/media/exercise-images/270/Overhead-triceps-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Arms", type: "cooldown" },
    { name: "Shoulder Stretch", description: "Bring one arm across your body and gently pull it closer with your other arm.", image: "https://wger.de/media/exercise-images/263/Cross-body-shoulder-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Shoulders", type: "cooldown" },
    { name: "Calf Stretch", description: "Stand facing a wall and step one foot back, pressing the heel into the floor.", image: "https://wger.de/media/exercise-images/245/Wall-calf-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Hip Flexor Stretch", description: "Kneel in a lunge position and gently push your hips forward to stretch the front of the hip.", image: "https://wger.de/media/exercise-images/253/Kneeling-hip-flexor-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Knees to Chest", description: "Lie on your back and hug both knees to your chest to release tension in the lower back.", image: "https://wger.de/media/exercise-images/255/Knees-to-chest.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "cooldown" },
    { name: "Cobra Pose", description: "Lie on your stomach and gently push your upper body up, arching your back.", image: "https://wger.de/media/exercise-images/247/Cobra-pose.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate"], muscle: "Back", type: "cooldown" },
    { name: "Butterfly Stretch", description: "Sit with the soles of your feet together and gently press your knees towards the floor.", image: "https://wger.de/media/exercise-images/244/Butterfly-stretch.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Spinal Twist", description: "Lie on your back, bring one knee across your body, and look in the opposite direction.", image: "https://wger.de/media/exercise-images/265/Lying-spinal-twist.png", equipment: "Bodyweight", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "cooldown" },
    { name: "Foam Roller Back", description: "Lie with your upper back on the roller. Lift your hips and roll slowly up and down to release tension.", image: "https://wger.de/media/exercise-images/782/Foam-roller-thoracic-extension.png", equipment: "Foam Roller", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Back", type: "cooldown" },
    { name: "Foam Roller Quads", description: "Support yourself on your forearms and place the front of your thighs on the roller. Roll slowly from the knee to the hip.", image: "https://wger.de/media/exercise-images/780/Foam-roller-quadriceps.png", equipment: "Foam Roller", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Foam Roller Hamstrings", description: "Sit with the back of your thighs on the roller and slowly roll from your glutes to your knees.", image: "https://wger.de/media/exercise-images/778/Foam-roller-hamstrings.png", equipment: "Foam Roller", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Foam Roller Calves", description: "Sit and place one calf on the roller. Roll from the ankle to below the knee.", image: "https://wger.de/media/exercise-images/776/Foam-roller-calves.png", equipment: "Foam Roller", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Foam Roller IT Band", description: "Lie on your side with the roller on the outside of your thigh. Roll from your hip to your knee.", image: "https://wger.de/media/exercise-images/779/Foam-roller-it-band.png", equipment: "Foam Roller", level: ["Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Foam Roller Glutes", description: "Sit on the foam roller with one ankle crossed over the opposite knee and roll over the glute area.", image: "https://wger.de/media/exercise-images/777/Foam-roller-glutes.png", equipment: "Foam Roller", level: ["Beginner", "Intermediate", "Advanced"], muscle: "Legs", type: "cooldown" },
    { name: "Foam Roller Lats", description: "Lie on your side with the foam roller under your armpit and roll down the side of your back.", image: "https://wger.de/media/exercise-images/783/Foam-roller-lats.png", equipment: "Foam Roller", level: ["Intermediate", "Advanced"], muscle: "Back", type: "cooldown" }
];

// --- DOM ELEMENT REFERENCES ---
const form = document.getElementById('workout-form');
const durationSlider = document.getElementById('duration');
const durationValue = document.getElementById('duration-value');
const workoutPlanDiv = document.getElementById('workout-plan');
const planContentDiv = document.getElementById('plan-content');
const noResultsDiv = document.getElementById('no-results');
const loadingDiv = document.getElementById('loading');
const generateBtn = document.getElementById('generate-btn');

// --- EVENT LISTENERS ---
durationSlider.addEventListener('input', (e) => {
    durationValue.textContent = e.target.value;
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Manually hide previous results at the start
    workoutPlanDiv.classList.add('hidden');
    noResultsDiv.classList.add('hidden');
    
    setLoading(true);

    const level = document.getElementById('fitness-level').value;
    const mainDuration = parseInt(durationSlider.value);
    const equipmentCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let selectedEquipment = Array.from(equipmentCheckboxes).map(cb => cb.value);
    if (selectedEquipment.length === 0) {
        selectedEquipment.push("Bodyweight");
    }

    const filterByType = (type) => exercises.filter(ex => 
        ex.type === type &&
        ex.level.includes(level) &&
        selectedEquipment.includes(ex.equipment)
    );

    const availableWarmup = filterByType('warmup');
    const availableMain = filterByType('main');
    const availableCooldown = filterByType('cooldown');
    
    const warmupPlan = generateRandomSet(availableWarmup, 5);
    const cooldownPlan = generateRandomSet(availableCooldown, 5);

    if (availableMain.length < mainDuration / 2) {
        displayPlan(null, null, null, "");
        setLoading(false);
        return;
    }

    try {
        const geminiResponse = await generateAiPlan(availableMain, mainDuration, level, selectedEquipment);
        const aiPlanNames = geminiResponse.plan;
        
        const mainPlan = aiPlanNames.map(name => {
            return availableMain.find(ex => ex.name === name);
        }).filter(Boolean);

        displayPlan(warmupPlan, mainPlan, cooldownPlan, geminiResponse.summary);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const fallbackMainPlan = generateRandomSet(availableMain, mainDuration);
        displayPlan(warmupPlan, fallbackMainPlan, cooldownPlan, "A randomly generated plan. The AI could not be reached.");
    } finally {
        setLoading(false);
    }
});

// --- GEMINI API INTEGRATION ---
async function generateAiPlan(availableExercises, totalDuration, level, equipment) {
    // FIXED: Added placeholder for API key - user needs to add their own
    const apiKey = "YOUR_GEMINI_API_KEY_HERE"; // BUG FIX: User must add their API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const exerciseInfoForAI = availableExercises.map(ex => ({ name: ex.name, muscle: ex.muscle }));

    const systemPrompt = `You are an experienced fitness trainer. Your task is to create a balanced and effective workout plan that considers different muscle groups (like chest, back, legs, core) and avoids repetition. Return your answer exclusively in JSON format.`;
    const userQuery = `Create a workout plan.
- Duration: ${totalDuration} minutes (which means ${totalDuration} exercises)
- Fitness Level: ${level}
- Available Equipment: ${equipment.join(', ')}
- Available Exercises: ${JSON.stringify(exerciseInfoForAI)}
Create a plan that arranges the exercises in a sensible order to ensure a full-body workout.
Give me a brief summary of the plan (1-2 sentences) and a list of the selected exercise names in the correct order.`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    summary: { type: "STRING" },
                    plan: { type: "ARRAY", items: { type: "STRING" } }
                },
                required: ["summary", "plan"]
            }
        }
    };

    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const result = await response.json();
    return JSON.parse(result.candidates[0].content.parts[0].text);
}

// --- HELPER & DISPLAY FUNCTIONS ---
function setLoading(isLoading) {
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
    planContentDiv.innerHTML = '';
    
    if (!main || main.length === 0) {
        workoutPlanDiv.classList.add('hidden');
        noResultsDiv.classList.remove('hidden');
        return;
    }
    
    noResultsDiv.classList.add('hidden');
    workoutPlanDiv.classList.remove('hidden');

    const createSection = (title, exercises) => {
        if (!exercises || exercises.length === 0) return '';
        let sectionHtml = `<h2 class="text-2xl font-bold text-center text-blue-400 my-6">${title}</h2>`;
        exercises.forEach((exercise) => {
            sectionHtml += `
                <div class="bg-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center border border-gray-700 shadow-md animate-fade-in mb-6">
                    <div class="w-full md:w-1/3 h-48 md:h-full flex-shrink-0 bg-white p-2">
                        <img src="${exercise.image}" alt="Sketch of ${exercise.name}" class="w-full h-full object-contain" onerror="this.onerror=null;this.src='https://placehold.co/600x400/1f2937/ffffff?text=Image+Error';">
                    </div>
                    <div class="p-6 w-full">
                        <h3 class="text-xl font-bold">${exercise.name}</h3>
                        <p class="text-gray-400 mt-2">${exercise.description}</p>
                        <div class="mt-4 bg-gray-700 inline-block px-4 py-2 rounded-full text-sm font-semibold">
                            <span class="text-white">Duration: </span>
                            <span class="text-blue-300">45 sec work, 15 sec rest</span>
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
